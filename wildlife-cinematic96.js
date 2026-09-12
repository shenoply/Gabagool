(() => {
  let film = null;

  const rig = actor => {
    if (actor.cineRig96) return actor.cineRig96;
    const bones = {}, rest = {};
    actor.model.traverse(o => {
      if (!o.isBone) return;
      bones[o.name] = o;
      rest[o.name] = o.quaternion.clone();
    });
    return actor.cineRig96 = { bones, rest };
  };

  const restore = (actor, names) => {
    const r = rig(actor);
    for (const name of names) if (r.bones[name] && r.rest[name]) r.bones[name].quaternion.copy(r.rest[name]);
    return r.bones;
  };

  function crawl(actor) {
    const names = ['ArmF.L_05','ArmF2.L_06','ArmF.R_010','ArmF2.R_011','Bone.019_024','Bone.020_025','Bone.023_029','Bone.024_030','Bone.013_018','Bone.014_00','Bone.015_019','Bone.016_020'];
    const b = restore(actor, names), stride = Math.sin(actor.clock * 8), lift = Math.cos(actor.clock * 8);
    b['ArmF.L_05']?.rotateZ(stride * .48);
    b['ArmF.R_010']?.rotateZ(-stride * .48);
    b['Bone.019_024']?.rotateZ(-stride * .42);
    b['Bone.023_029']?.rotateZ(stride * .42);
    b['ArmF2.L_06']?.rotateX(Math.max(0, lift) * .34);
    b['ArmF2.R_011']?.rotateX(Math.max(0, -lift) * .34);
    b['Bone.020_025']?.rotateX(Math.max(0, -lift) * .3);
    b['Bone.024_030']?.rotateX(Math.max(0, lift) * .3);
    b['Bone.013_018']?.rotateY(stride * .07);
    b['Bone.014_00']?.rotateY(-stride * .14);
    b['Bone.015_019']?.rotateY(-stride * .11);
    b['Bone.016_020']?.rotateY(-stride * .08);
  }

  const geckoBase = tickGecko88;
  tickGecko88 = function (dt, actor) {
    const before = actor.g.position.clone();
    geckoBase(dt, actor);
    if (!actor.riding && actor.g.position.distanceToSquared(before) > .000001) crawl(actor);
  };

  function animateRat(actor) {
    const names = ['Head.000','Neck.000','Arm_L.000','Arm_L.001','Arm_R.000','Arm_R.001','Spine.005','Tail.000','Tail.001','Tail.002'];
    const b = restore(actor, names), q = film?.time || 0;
    b['Head.000']?.rotateZ(Math.sin(q * 4) * .08);
    b['Neck.000']?.rotateZ(Math.sin(q * 4) * .045);
    b['Arm_L.000']?.rotateZ(-.55 - Math.sin(q * 7) * .18);
    b['Arm_L.001']?.rotateZ(.65 + Math.sin(q * 7) * .22);
    b['Arm_R.000']?.rotateZ(-.18 + Math.sin(q * 3) * .09);
    b['Arm_R.001']?.rotateZ(.28);
    b['Spine.005']?.rotateZ(Math.sin(q * 2.5) * .035);
    b['Tail.000']?.rotateY(Math.sin(q * 3) * .2);
    b['Tail.001']?.rotateY(Math.sin(q * 3 - .45) * .16);
    b['Tail.002']?.rotateY(Math.sin(q * 3 - .9) * .12);
    actor.model.position.y = actor.modelBaseY + Math.sin(q * 4) * .012;
  }

  const card = document.createElement('button');
  card.type = 'button';
  card.style.cssText = 'display:none;position:fixed;z-index:120;left:50%;bottom:max(22px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(88vw,430px);padding:12px 16px;border:1px solid #d6bf8d88;border-radius:15px;background:#172a27ee;color:#fff;text-align:left;font:15px/1.35 system-ui;box-shadow:0 10px 35px #0008';
  card.innerHTML = '<strong style="display:block;color:#f0cf8b;margin-bottom:3px">Neighbour Rat</strong><span></span><small style="display:block;opacity:.58;margin-top:5px">Tap to skip</small>';
  document.body.appendChild(card);

  function finish() {
    if (!film) return;
    film.actor.talking = 0;
    film = null;
    card.style.display = 'none';
    gameCam.ready = false;
  }

  function start(actor) {
    film = { actor, time: 0 };
    actor.talking = 6;
    keys = {};
    joy.x = joy.z = 0;
    card.style.display = 'block';
    card.querySelector('span').textContent = 'The ants found crumbs by the gate.';
  }

  card.addEventListener('pointerdown', finish);

  const ratBase = tickRatNpc88;
  tickRatNpc88 = function (dt, actor) {
    if (film?.actor === actor) {
      actor.clock += dt;
      actor.walking = false;
      animateRat(actor);
      return;
    }
    ratBase(dt, actor);
  };

  const interactBase = interactWildlife88;
  interactWildlife88 = function () {
    const near = wildlife88.near;
    if (near?.type === 'rat') {
      start(near.obj);
      return true;
    }
    return interactBase();
  };

  const controlBase = control;
  control = function (dt, options) {
    if (film) return 0;
    return controlBase(dt, options);
  };

  const cameraBase = tickGameplayCamera;
  tickGameplayCamera = function (dt) {
    cameraBase(dt);
    if (!film) return;
    if (!film.actor?.g?.parent || phase !== 'scavenge') return finish();
    film.time += dt;
    keys = {};
    joy.x = joy.z = 0;
    animateRat(film.actor);
    const center = film.actor.g.position.clone().add(new THREE.Vector3(0, .42, 0));
    const angle = film.time < 2.8 ? -.72 + film.time * .08 : .42 - (film.time - 2.8) * .05;
    const distance = film.time < 2.8 ? 2.35 : 2.7;
    const goal = center.clone().add(new THREE.Vector3(Math.sin(angle) * distance, .5, Math.cos(angle) * distance));
    camera.position.lerp(goal, 1 - Math.exp(-dt * (film.time < .8 ? 6 : 3)));
    camera.lookAt(center);
    card.querySelector('span').textContent = film.time < 2.8 ? 'The ants found crumbs by the gate.' : 'Keep low—the snake watches the timber.';
    if (film.time > 5.6) finish();
  };
})();
