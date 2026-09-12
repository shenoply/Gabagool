(() => {
  function geckoRun98(actor) {
    const r = actor.cineRig96;
    if (!r) return;
    const names = ['ArmF.L_05','ArmF2.L_06','ArmF.R_010','ArmF2.R_011','Bone.019_024','Bone.020_025','Bone.023_029','Bone.024_030','Bone.013_018','Bone.014_00','Bone.015_019','Bone.016_020'];
    for (const name of names) if (r.bones[name] && r.rest[name]) r.bones[name].quaternion.copy(r.rest[name]);
    const b = r.bones;
    const stride = Math.sin(actor.clock * 12);
    const lift = Math.cos(actor.clock * 12);
    b['ArmF.L_05']?.rotateZ(stride * .68);
    b['ArmF.R_010']?.rotateZ(-stride * .68);
    b['Bone.019_024']?.rotateZ(-stride * .60);
    b['Bone.023_029']?.rotateZ(stride * .60);
    b['ArmF2.L_06']?.rotateX(Math.max(0, lift) * .52);
    b['ArmF2.R_011']?.rotateX(Math.max(0, -lift) * .52);
    b['Bone.020_025']?.rotateX(Math.max(0, -lift) * .46);
    b['Bone.024_030']?.rotateX(Math.max(0, lift) * .46);
    b['Bone.013_018']?.rotateY(stride * .12);
    b['Bone.014_00']?.rotateY(-stride * .22);
    b['Bone.015_019']?.rotateY(-stride * .17);
    b['Bone.016_020']?.rotateY(-stride * .12);
  }

  function seatedPip98() {
    const actor = wildlife88?.gecko;
    const u = rat?.userData;
    if (!actor?.riding || !u?.pipPivot) return;

    // Keep Pip visibly on the saddle: normal standing height is .90.
    u.pipPivot.position.set(0, 1.30, -.02);
    u.pipPivot.rotation.set(-.16, 0, 0);
    u.pipPivot.scale.setScalar(1);

    const pose = {
      LeftUpLeg: -1.18, RightUpLeg: -1.18,
      LeftLeg: 1.42, RightLeg: 1.42,
      LeftArm: -.50, RightArm: -.50,
      LeftForeArm: -.58, RightForeArm: -.58
    };
    for (const [name, angle] of Object.entries(pose)) {
      const bone = u.pipBones?.[name];
      const rest = u.pipRest?.[name];
      if (!bone || !rest) continue;
      bone.quaternion.copy(rest);
      bone.rotateX(angle);
    }

    // Never allow Pip's walk/run action to show while the gecko carries him.
    if (u.pipActions?.Drive_Idle && u.pipClip !== 'Drive_Idle') {
      u.pipActions[u.pipClip]?.fadeOut(.08);
      u.pipActions.Drive_Idle.reset().fadeIn(.08).play();
      u.pipClip = 'Drive_Idle';
    }
  }

  const gecko98Base = tickGecko88;
  tickGecko88 = function (dt, actor) {
    gecko98Base(dt, actor);

    if (!actor.mountSize98) {
      actor.model.scale.multiplyScalar(1.65);
      actor.mountSize98 = true;
    }

    actor.model.rotation.x = Math.PI / 2;
    actor.model.rotation.y = actor.riding ? Math.PI : 0;
    actor.model.rotation.z = 0;
    actor.model.position.y = .18;

    if (actor.riding) {
      actor.g.position.set(rat.position.x, Math.max(0, rat.position.y), rat.position.z);
      actor.g.rotation.y = rat.rotation.y;
      if ((rat.userData.vel || 0) > .05) {
        actor.mixer.timeScale = 2.4;
        geckoRun98(actor);
      }
    }
  };

  const models98Base = tickModels44;
  tickModels44 = function (dt) {
    models98Base(dt);
    seatedPip98();
  };
})();
