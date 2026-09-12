(() => {
  function gait97(actor, strength) {
    const r = actor.cineRig96;
    if (!r) return;
    const names = ['ArmF.L_05','ArmF2.L_06','ArmF.R_010','ArmF2.R_011','Bone.019_024','Bone.020_025','Bone.023_029','Bone.024_030','Bone.013_018','Bone.014_00','Bone.015_019','Bone.016_020'];
    for (const name of names) if (r.bones[name] && r.rest[name]) r.bones[name].quaternion.copy(r.rest[name]);
    const b = r.bones, stride = Math.sin(actor.clock * 9), lift = Math.cos(actor.clock * 9);
    b['ArmF.L_05']?.rotateZ(stride * .52 * strength);
    b['ArmF.R_010']?.rotateZ(-stride * .52 * strength);
    b['Bone.019_024']?.rotateZ(-stride * .46 * strength);
    b['Bone.023_029']?.rotateZ(stride * .46 * strength);
    b['ArmF2.L_06']?.rotateX(Math.max(0, lift) * .38 * strength);
    b['ArmF2.R_011']?.rotateX(Math.max(0, -lift) * .38 * strength);
    b['Bone.020_025']?.rotateX(Math.max(0, -lift) * .34 * strength);
    b['Bone.024_030']?.rotateX(Math.max(0, lift) * .34 * strength);
    b['Bone.013_018']?.rotateY(stride * .08 * strength);
    b['Bone.014_00']?.rotateY(-stride * .16 * strength);
    b['Bone.015_019']?.rotateY(-stride * .12 * strength);
    b['Bone.016_020']?.rotateY(-stride * .09 * strength);
  }

  const gecko97Base = tickGecko88;
  tickGecko88 = function (dt, actor) {
    const before = actor.g.position.clone();
    gecko97Base(dt, actor);

    actor.model.rotation.x = Math.PI / 2;
    actor.model.rotation.y = actor.riding ? Math.PI : 0;
    actor.model.rotation.z = 0;
    actor.model.position.y = .14;

    const moving = actor.g.position.distanceToSquared(before) > .000001 || actor.riding && (rat.userData.vel || 0) > .08;
    if (moving) gait97(actor, actor.riding ? 1 : .9);

    if (actor.riding) {
      actor.g.position.set(rat.position.x, Math.max(0, rat.position.y), rat.position.z);
      const u = rat.userData;
      if (u.pipPivot) {
        u.pipPivot.position.y = .62;
        u.pipPivot.position.z = -.04;
        u.pipPivot.rotation.x = -.18;
      }
    }
  };

  const wildlife97Base = tickWildlife88;
  tickWildlife88 = function (dt) {
    wildlife97Base(dt);
    if (wildlife88.gecko?.riding) {
      ui.prompt.style.display = 'none';
      $('padE').textContent = 'Dismount';
    }
  };
})();
