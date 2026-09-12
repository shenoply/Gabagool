(() => {
  function geckoRun98(actor, amount = 1) {
    const r = actor.cineRig96;
    if (!r) return;
    const names = ['ArmF.L_05','ArmF2.L_06','ArmF.R_010','ArmF2.R_011','Bone.019_024','Bone.020_025','Bone.023_029','Bone.024_030','Bone.013_018','Bone.014_00','Bone.015_019','Bone.016_020'];
    for (const name of names) if (r.bones[name] && r.rest[name]) r.bones[name].quaternion.copy(r.rest[name]);
    const b = r.bones;
    const stride = Math.sin(actor.clock * 13);
    const lift = Math.cos(actor.clock * 13);
    b['ArmF.L_05']?.rotateZ(stride * .82 * amount);
    b['ArmF.L_05']?.rotateX(lift * .24 * amount);
    b['ArmF.R_010']?.rotateZ(-stride * .82 * amount);
    b['ArmF.R_010']?.rotateX(-lift * .24 * amount);
    b['Bone.019_024']?.rotateZ(-stride * .74 * amount);
    b['Bone.019_024']?.rotateX(-lift * .22 * amount);
    b['Bone.023_029']?.rotateZ(stride * .74 * amount);
    b['Bone.023_029']?.rotateX(lift * .22 * amount);
    b['ArmF2.L_06']?.rotateX((.18 + Math.max(0, lift) * .68) * amount);
    b['ArmF2.R_011']?.rotateX((.18 + Math.max(0, -lift) * .68) * amount);
    b['Bone.020_025']?.rotateX((.16 + Math.max(0, -lift) * .61) * amount);
    b['Bone.024_030']?.rotateX((.16 + Math.max(0, lift) * .61) * amount);
    b['Bone.013_018']?.rotateY(stride * .12 * amount);
    b['Bone.014_00']?.rotateY(-stride * .22 * amount);
    b['Bone.015_019']?.rotateY(-stride * .17 * amount);
    b['Bone.016_020']?.rotateY(-stride * .12 * amount);
  }

  function seatedPip98() {
    const actor = wildlife88?.gecko;
    const u = rat?.userData;
    if (!actor?.riding || !u?.pipPivot) return;

    // Keep Pip visibly on the saddle: normal standing height is .90.
    // The enlarged gecko's back is well above Pip's normal ground pose.
    u.pipPivot.position.set(0, 1.68, .04);
    u.pipPivot.rotation.set(-.22, 0, 0);
    u.pipPivot.scale.setScalar(1);

    const pose = {
      LeftUpLeg: [-1.12, 0, -.46], RightUpLeg: [-1.12, 0, .46],
      LeftLeg: [1.30, 0, 0], RightLeg: [1.30, 0, 0],
      LeftArm: [.92, 0, -.22], RightArm: [.92, 0, .22],
      LeftForeArm: [.30, 0, 0], RightForeArm: [.30, 0, 0]
    };
    for (const [name, angles] of Object.entries(pose)) {
      const bone = u.pipBones?.[name];
      const rest = u.pipRest?.[name];
      if (!bone || !rest) continue;
      bone.quaternion.copy(rest);
      const a = Array.isArray(angles) ? angles : [angles, 0, 0];
      bone.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(a[0], a[1], a[2])));
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
      actor.model.scale.multiplyScalar(2.35);
      actor.mountSize98 = true;
    }

    // Positive quarter-turn puts the dark back upward and all four feet below the body.
    actor.model.rotation.x = Math.PI / 2;
    // Keep the same belly-down roll when mounted; the parent group handles heading.
    actor.model.rotation.y = 0;
    actor.model.rotation.z = 0;
    actor.model.position.y = .25;

    if (actor.riding) {
      actor.g.position.set(rat.position.x, Math.max(0, rat.position.y), rat.position.z);
      actor.g.rotation.y = rat.rotation.y;
      const p = rat.position;
      const previous = actor.mountPrevious98;
      const travelled = previous ? (p.x - previous.x) ** 2 + (p.z - previous.z) ** 2 : 0;
      const input = Math.hypot(joy?.x || 0, joy?.z || 0) > .10 ||
        !!(keys.w || keys.a || keys.s || keys.d || keys.arrowup || keys.arrowdown || keys.arrowleft || keys.arrowright);
      const moving = travelled > .0000005 || input;
      if (!previous) actor.mountPrevious98 = new THREE.Vector3();
      actor.mountPrevious98.copy(p);
      // Apply the procedural leg cycle after every mixer update. A small breathing
      // crawl remains at rest; full stride starts immediately with input/travel.
      actor.mixer.timeScale = moving ? 2.7 : 1;
      geckoRun98(actor, moving ? 1 : .12);
      if (moving) {
        actor.model.position.y += Math.abs(Math.sin(actor.clock * 13)) * .035;
      }
    } else actor.mountPrevious98 = null;
  };

  const models98Base = tickModels44;
  tickModels44 = function (dt) {
    models98Base(dt);
    seatedPip98();
  };
})();
