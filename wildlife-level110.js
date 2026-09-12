(() => {
  const LEG_BONES = [
    'Bone_01','Bone.001_02','Bone.002_03','Bone.002_end_04','Bone.003_015',
    'ArmF.L_05','ArmF2.L_06','ArmF3.L_07','ArmF4.L_08',
    'ArmF.R_010','ArmF2.R_011','ArmF3.R_012','ArmF4.R_013',
    'Bone.019_024','Bone.020_025','Bone.021_026','Bone.022_027',
    'Bone.023_029','Bone.024_030','Bone.025_031','Bone.026_032',
    'Bone.013_018','Bone.014_00','Bone.015_019','Bone.016_020','Bone.017_021','Bone.018_022'
  ];

  function ensureCarrier103(actor) {
    if (actor.carrier103) return actor.carrier103;
    const carrier = new THREE.Group();
    carrier.name = 'Gecko riding carrier';
    actor.g.add(carrier);
    carrier.add(actor.model);
    carrier.rotation.set(Math.PI / 2, 0, 0);
    carrier.position.y = .02;
    actor.model.rotation.set(0, 0, 0);
    actor.model.position.y = 0;
    actor.model.scale.multiplyScalar(2.35);
    actor.carrier103 = carrier;
    actor.previousRide103 = actor.g.position.clone();
    return carrier;
  }

  function restoreGecko103(actor) {
    // The older cinematic patch created this rig lazily only after an unmounted
    // walk. Build it here as well so mounting first can never leave a rigid gecko.
    let rig = actor.cineRig96;
    if (rig && !rig.restPos) {
      rig.restPos = {};
      actor.model.traverse(o => {
        if (o.isBone) rig.restPos[o.name] = o.position.clone();
      });
    }
    if (!rig) {
      const bones = {}, rest = {}, restPos = {};
      actor.model.traverse(o => {
        if (!o.isBone) return;
        bones[o.name] = o;
        rest[o.name] = o.quaternion.clone();
        restPos[o.name] = o.position.clone();
      });
      rig = actor.cineRig96 = { bones, rest, restPos };
    }
    for (const name of LEG_BONES) {
      if (rig.bones[name] && rig.rest[name]) rig.bones[name].quaternion.copy(rig.rest[name]);
    }
    return rig.bones;
  }

  function sourceCrawl108(actor, moving, dt) {
    const clip = actor.clips?.[2];
    if (!actor.mixer || !clip) return crawl103(actor, moving);
    if (!actor.sourceRestPos108) {
      actor.sourceRestPos108 = {};
      for (const [name, bone] of Object.entries(actor.bones || {})) {
        actor.sourceRestPos108[name] = bone.position.clone();
      }
    }
    for (const [name, bone] of Object.entries(actor.bones || {})) {
      if (actor.rest?.[name]) bone.quaternion.copy(actor.rest[name]);
      if (actor.sourceRestPos108[name]) bone.position.copy(actor.sourceRestPos108[name]);
    }
    if (!actor.sourceRideAction108) {
      actor.mixer.stopAllAction();
      actor.sourceRideAction108 = actor.mixer.clipAction(clip).reset()
        .setLoop(THREE.LoopRepeat, Infinity).play();
      actor.rideAnimTime108 = 0;
    }
    actor.rideAnimTime108 += dt * (moving ? 1.55 : .32);
    actor.sourceRideAction108.enabled = true;
    actor.sourceRideAction108.setEffectiveWeight(1);
    actor.mixer.setTime(actor.rideAnimTime108 % clip.duration);

    const b = actor.bones || {};
    const axial = [
      'Bone_01','Bone.001_02','Bone.002_03','Bone.002_end_04',
      'Bone.012_017','Bone.013_018','Bone.014_00','Bone.015_019',
      'Bone.016_020','Bone.017_021','Bone.018_022','Bone.018_end_023'
    ];
    for (const name of axial) {
      if (b[name] && actor.rest?.[name]) b[name].quaternion.copy(actor.rest[name]);
      if (b[name] && actor.sourceRestPos108[name]) b[name].position.copy(actor.sourceRestPos108[name]);
    }
    // Preview 14: keep the complete tail-to-neck axis level while the source
    // clip continues animating all four limbs.
    b['Bone.001_02']?.quaternion.identity();
    b['Bone.002_03']?.quaternion.identity();
    b['Bone.002_03']?.rotateY(Math.sin(actor.rideAnimTime108 * 4.8) * .025);
    actor.g.updateMatrixWorld(true);
  }

  function crawl103(actor, moving) {
    const b = restoreGecko103(actor);
    if (!b) return;
    const phase = actor.clock * (moving ? 7.2 : 2.2);
    const stride = Math.sin(phase);
    const lift = Math.cos(phase);
    const power = moving ? 1 : .035;
    if (!actor.rideLegPositions103) {
      actor.rideLegPositions103 = {};
      for (const name of ['ArmF.L_05','ArmF.R_010','Bone.019_024','Bone.023_029']) {
        if (b[name]) actor.rideLegPositions103[name] = b[name].position.clone();
      }
    }
    for (const [name, rest] of Object.entries(actor.rideLegPositions103)) b[name]?.position.copy(rest);
    // The supplied walking clip has no changing keyframes. Translate each whole
    // limb slightly as well as bending it, so the mounted crawl is unmistakable.
    if (moving) {
      b['ArmF.L_05']?.position.add(new THREE.Vector3(stride * .18, lift * .12, 0));
      b['ArmF.R_010']?.position.add(new THREE.Vector3(-stride * .18, -lift * .12, 0));
      b['Bone.019_024']?.position.add(new THREE.Vector3(-stride * .16, -lift * .11, 0));
      b['Bone.023_029']?.position.add(new THREE.Vector3(stride * .16, lift * .11, 0));
    }
    b['Bone_01']?.rotateZ(stride * .13 * power);
    b['Bone_01']?.rotateX(lift * .07 * power);
    b['Bone.001_02']?.rotateZ(-stride * .10 * power);
    b['Bone.002_03']?.rotateZ(-stride * .075 * power);
    b['Bone.002_end_04']?.rotateZ(-stride * .045 * power);
    b['Bone.003_015']?.rotateY(stride * .055 * power);
    b['ArmF.L_05']?.rotateZ(stride * 1.12 * power);
    b['ArmF.L_05']?.rotateX(lift * .52 * power);
    b['ArmF.R_010']?.rotateZ(-stride * 1.12 * power);
    b['ArmF.R_010']?.rotateX(-lift * .52 * power);
    b['Bone.019_024']?.rotateZ(-stride * 1.04 * power);
    b['Bone.019_024']?.rotateX(-lift * .48 * power);
    b['Bone.023_029']?.rotateZ(stride * 1.04 * power);
    b['Bone.023_029']?.rotateX(lift * .48 * power);
    b['ArmF2.L_06']?.rotateX((.18 + Math.max(0, lift) * .80) * power);
    b['ArmF2.R_011']?.rotateX((.18 + Math.max(0, -lift) * .80) * power);
    b['ArmF3.L_07']?.rotateZ(-stride * .48 * power);
    b['ArmF3.R_012']?.rotateZ(stride * .48 * power);
    b['ArmF4.L_08']?.rotateX(Math.max(0, lift) * .58 * power);
    b['ArmF4.R_013']?.rotateX(Math.max(0, -lift) * .58 * power);
    b['Bone.020_025']?.rotateX((.16 + Math.max(0, -lift) * .72) * power);
    b['Bone.024_030']?.rotateX((.16 + Math.max(0, lift) * .72) * power);
    b['Bone.021_026']?.rotateZ(stride * .44 * power);
    b['Bone.025_031']?.rotateZ(-stride * .44 * power);
    b['Bone.022_027']?.rotateX(Math.max(0, -lift) * .52 * power);
    b['Bone.026_032']?.rotateX(Math.max(0, lift) * .52 * power);
    b['Bone.013_018']?.rotateY(stride * .10 * power);
    b['Bone.014_00']?.rotateY(-stride * .20 * power);
    b['Bone.015_019']?.rotateY(-stride * .15 * power);
    b['Bone.016_020']?.rotateY(-stride * .11 * power);
    b['Bone.017_021']?.rotateY(-stride * .085 * power);
    b['Bone.018_022']?.rotateY(-stride * .06 * power);
  }

  function riderInput103(actor) {
    const p = rat.position;
    const previous = actor.previousRide103;
    const travelled = previous ? (p.x - previous.x) ** 2 + (p.z - previous.z) ** 2 : 0;
    if (!previous) actor.previousRide103 = new THREE.Vector3();
    actor.previousRide103.copy(p);
    const stick = Math.hypot(joy?.x || 0, joy?.z || 0) > .08;
    const keyboard = !!(keys.w || keys.a || keys.s || keys.d ||
      keys.arrowup || keys.arrowdown || keys.arrowleft || keys.arrowright);
    return stick || keyboard || travelled > .0000002 || (rat.userData.vel || 0) > .02;
  }

  function posePip103() {
    const actor = wildlife88?.gecko;
    const u = rat?.userData;
    if (!u?.pipPivot) return;
    if (!actor?.riding) {
      if (u.mountLocked103) {
        u.mountLocked103 = false;
        u.pipClip = null;
      }
      return;
    }
    u.pipMixer?.stopAllAction();
    u.mountLocked103 = true;
    u.pipPivot.position.set(0, 1.42, .05);
    u.pipPivot.rotation.set(-.18, 0, 0);
    u.pipPivot.scale.setScalar(1);
    const pose = {
      Spine: [-.10, 0, 0],
      LeftUpLeg: [-1.08, 0, -.48],
      RightUpLeg: [-1.08, 0, .48],
      LeftLeg: [1.26, 0, 0],
      RightLeg: [1.26, 0, 0],
      LeftArm: [.82, 0, -.28],
      RightArm: [.82, 0, .28],
      LeftForeArm: [.24, 0, 0],
      RightForeArm: [.24, 0, 0]
    };
    for (const [name, angles] of Object.entries(pose)) {
      const bone = u.pipBones?.[name];
      const rest = u.pipRest?.[name];
      if (!bone || !rest) continue;
      bone.quaternion.copy(rest).multiply(
        new THREE.Quaternion().setFromEuler(new THREE.Euler(angles[0], angles[1], angles[2]))
      );
    }
  }

  const geckoBase103 = tickGecko88;
  tickGecko88 = function (dt, actor) {
    const carrier = ensureCarrier103(actor);
    actor.model.rotation.set(0, 0, 0);
    actor.model.position.y = 0;
    carrier.rotation.set(Math.PI / 2, 0, 0);
    carrier.position.y = .02;
    if (actor.riding) {
      actor.clock += dt;
      actor.wasRiding103 = true;
      actor.g.position.set(rat.position.x, Math.max(0, rat.position.y), rat.position.z);
      // The gecko asset's head points opposite its authored forward axis.
      // Flip the mount group so both animals face the actual control direction.
      actor.g.rotation.y = rat.rotation.y + Math.PI;
      const moving = riderInput103(actor);
      sourceCrawl108(actor, moving, dt);
      rat.userData.geckoRide88 = true;
      rat.userData.seated41 = true;
    } else {
      const justDismounted = !!actor.wasRiding103;
      if (actor.wasRiding103) {
        actor.wasRiding103 = false;
        actor.sourceRideAction108 = null;
        actor.mixer?.stopAllAction();
        actor.current = null;
      }
      geckoBase103(dt, actor);
      if (justDismounted) {
        actor.mixer?.stopAllAction();
        for (const [name, bone] of Object.entries(actor.bones || {})) {
          if (actor.rest?.[name]) bone.quaternion.copy(actor.rest[name]);
          if (actor.sourceRestPos108?.[name]) bone.position.copy(actor.sourceRestPos108[name]);
        }
        for (const name of [
          'Bone_01','Bone.001_02','Bone.002_03','Bone.002_end_04',
          'Bone.012_017','Bone.013_018','Bone.014_00','Bone.015_019',
          'Bone.016_020','Bone.017_021','Bone.018_022','Bone.018_end_023'
        ]) {
          const bone = actor.bones?.[name];
          if (bone && actor.rest?.[name]) bone.quaternion.copy(actor.rest[name]);
          if (bone && actor.sourceRestPos108?.[name]) bone.position.copy(actor.sourceRestPos108[name]);
        }
        actor.bones?.['Bone.001_02']?.quaternion.identity();
        actor.bones?.['Bone.002_03']?.quaternion.identity();
        actor.current = null;
        play88(actor, /idle/i);
      }
      actor.previousRide103.copy(actor.g.position);
    }
  };

  const modelsBase103 = tickModels44;
  tickModels44 = function (dt) {
    modelsBase103(dt);
    posePip103();
  };
})();
