(() => {
  // Replacement mount built from the newly recovered Maya mesh. It is not
  // skinned, so its crawl is driven directly from the real mesh coordinates.
  const originalLoad88 = load88;
  load88 = function loadRecovered116(file, done) {
    if (file !== 'gecko') return originalLoad88(file, done);
    const owner = root;
    loader88.load('lizard-recovered115.glb?v=116', asset => {
      if (root === owner && phase === 'scavenge') done(asset);
    }, undefined, error => console.warn('Recovered gecko failed:', error));
  };

  const smooth = (a, b, value) => {
    const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  function prepare116(g) {
    if (g.recovered116) return;
    g.recovered116 = [];
    // actor88 already fits this model to the intended wildlife height. Keep it
    // only slightly enlarged so it reads as a mount without dwarfing Pip.
    g.model.scale.multiplyScalar(.92);
    g.model.traverse(mesh => {
      const source = mesh.geometry?.attributes?.position;
      if (!mesh.isMesh || !source) return;
      mesh.geometry = mesh.geometry.clone();
      const position = mesh.geometry.attributes.position;
      position.setUsage(THREE.DynamicDrawUsage);
      g.recovered116.push({ mesh, position, rest: new Float32Array(position.array) });
      mesh.frustumCulled = false;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    g.recoveredRestY116 = g.model.position.y;
    g.recoveredBaseLow116 = lowest116(g, true);
    g.previous116 = g.g.position.clone();
  }

  function lowest116(g, rest = false) {
    let low = Infinity;
    for (const d of g.recovered116) {
      const a = rest ? d.rest : d.position.array;
      for (let i = 1; i < a.length; i += 3) low = Math.min(low, a[i]);
    }
    return low;
  }

  function moving116(g) {
    const u = rat.userData;
    const travelled = g.previous116.distanceToSquared(rat.position) > .00001;
    g.previous116.copy(rat.position);
    // Use actual mount speed, not held input, so the crawl eases in and has a
    // natural settling stop instead of snapping between walk and idle.
    return Math.min(1, Math.max(travelled ? .08 : 0, (u.vel || 0) / 4.8));
  }

  function crawl116(g, pace) {
    g.crawlPhase116 = (g.crawlPhase116 || 0) + (1.15 + pace * 7.2) * (g.lastRideDt116 || 1 / 60);
    const phase = g.crawlPhase116;
    const strength = .10 + pace * .90;
    for (const d of g.recovered116) {
      const a = d.position.array;
      const r = d.rest;
      for (let i = 0; i < a.length; i += 3) {
        const x = r[i], y = r[i + 1], z = r[i + 2];
        const tail = smooth(-1.0, -4.25, z);
        const head = smooth(.62, 1.55, z);
        const sideWave = Math.sin(phase - z * 1.22) *
          (.012 + tail * .105 + head * .018) * strength;
        let nx = x + sideWave, ny = y, nz = z;

        // Four broad shoulder/hip zones follow a diagonal walking sequence.
        // The body core is excluded, so the spine stays level while the legs move.
        const front = Math.exp(-Math.pow((z - .66) / .42, 2));
        const rear = Math.exp(-Math.pow((z + .72) / .48, 2));
        const outside = smooth(.19, .49, Math.abs(x));
        const leg = Math.max(front, rear) * outside;
        if (leg > .002) {
          const isFront = front >= rear;
          const jointZ = isFront ? .66 : -.72;
          const jointY = .47;
          const diagonal = ((x > 0) === isFront) ? 0 : Math.PI;
          const step = phase + diagonal;
          const angle = Math.sin(step) * .29 * strength;
          const dy = y - jointY, dz = z - jointZ;
          const cs = Math.cos(angle), sn = Math.sin(angle);
          const turnedY = dy * cs - dz * sn;
          const turnedZ = dy * sn + dz * cs;
          ny += (jointY + turnedY - y) * leg;
          nz += (jointZ + turnedZ - z) * leg;
          const foot = smooth(.39, .70, Math.abs(x)) * leg;
          ny += Math.max(0, Math.sin(step)) * foot * .105 * strength;
          nx += Math.cos(step) * foot * .035 * Math.sign(x) * strength;
        }
        a[i] = nx;
        a[i + 1] = ny;
        a[i + 2] = nz;
      }
      d.position.needsUpdate = true;
    }
    // Correct only penetration caused by the moving feet. This keeps the belly
    // level and grounded without the old whole-body bounce.
    const currentLow = lowest116(g);
    g.model.position.y = g.recoveredRestY116 +
      Math.max(0, g.recoveredBaseLow116 - currentLow) * g.model.scale.y;
  }

  window.animateCourseLizard187 = function(g,dt,moving) {
    prepare116(g);g.lastRideDt116=dt;
    if(moving)crawl116(g,.65);
  };
  tickGecko88 = function tickRecovered116(dt, g) {
    prepare116(g);
    g.clock += dt;
    g.lastRideDt116 = dt;
    const u = rat.userData;
    if (g.riding) {
      const moving = moving116(g);
      g.g.position.set(rat.position.x, Math.max(0, rat.position.y), rat.position.z);
      // Rider and mount must share one heading; smoothing only the gecko made
      // Pip appear to glitch away from the saddle.
      g.g.rotation.y = rat.rotation.y;
      g.model.rotation.set(0, 0, 0);
      crawl116(g, moving);
      u.geckoRide88 = true;
      u.seated41 = true;
      return;
    }

    u.geckoRide88 = false;
    if (u.seated41) u.seated41 = false;
    let walking = false;
    if (g.tamed) {
      const desired = rat.position.clone().add(new THREE.Vector3(
        -Math.sin(rat.rotation.y) * 2.8, 0, -Math.cos(rat.rotation.y) * 2.8));
      const v = desired.sub(g.g.position).setY(0);
      if (v.length() > 1.25) {
        const gap = v.length();
        v.normalize();
        g.g.position.addScaledVector(v, dt * (gap > 5 ? 2.4 : 1.25));
        turn88(g.g, Math.atan2(v.x, v.z), dt, 7);
        walking = true;
      }
    } else {
      g.wander -= dt;
      if (g.wander <= 0) {
        g.wander = 3 + Math.random() * 4;
        g.target.set(8.1 + (Math.random() - .5) * 3, 0, 27.1 + (Math.random() - .5) * 3);
      }
      const v = g.target.clone().sub(g.g.position).setY(0);
      if (v.length() > .2) {
        v.normalize();
        g.g.position.addScaledVector(v, dt * .42);
        turn88(g.g, Math.atan2(v.x, v.z), dt, 7);
        walking = true;
      }
    }
    crawl116(g, walking);
    g.previous116.copy(g.g.position);
  };

  let savedPivot116 = null;
  function saddlePoint121(g) {
    // Read the actual recovered mesh, whose local axes differ from Pip's.
    // The neck is 27% back from the head along its real length.
    let minZ = Infinity, maxZ = -Infinity;
    for (const d of g.recovered116 || []) {
      const p = d.rest;
      for (let i = 2; i < p.length; i += 3) {
        minZ = Math.min(minZ, p[i]);
        maxZ = Math.max(maxZ, p[i]);
      }
    }
    if (!Number.isFinite(minZ)) return new THREE.Vector3(0, 0, 0);
    const neckZ = maxZ - (maxZ - minZ) * .27;
    const worldNeck = g.model.localToWorld(new THREE.Vector3(0, 0, neckZ));
    rat.updateWorldMatrix(true, false);
    return rat.worldToLocal(worldNeck);
  }

  function seatPip116() {
    const g = wildlife88?.gecko;
    const u = rat?.userData;
    if (!u?.pipPivot) return;
    if (!g?.riding) {
      if (g?.reins128) {
        g.reins128.parent?.remove(g.reins128);
        g.reins128.traverse(o => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
        g.reins128 = null;
      }
      if (savedPivot116) {
        u.pipPivot.position.copy(savedPivot116.position);
        u.pipPivot.quaternion.copy(savedPivot116.quaternion);
        u.pipPivot.scale.copy(savedPivot116.scale);
        savedPivot116 = null;
        u.pipClip = null;
      }
      return;
    }
    if (!savedPivot116) savedPivot116 = {
      position: u.pipPivot.position.clone(),
      quaternion: u.pipPivot.quaternion.clone(),
      scale: u.pipPivot.scale.clone()
    };
    // Pip's normal standing pivot is y=.9. Calculate the saddle from the
    // rendered lizard's actual height rather than a fixed magic number. This
    // stays correct at the smaller gameplay scale and prevents belly-clipping.
    const worldBox = new THREE.Box3().setFromObject(g.model);
    const backHeight = Math.max(.18, worldBox.max.y - g.g.position.y);
    // Use the recovered lizard's actual neck point, transformed into Pip's
    // local space. This cannot be reversed by either model's facing axis.
    const saddle = saddlePoint121(g);
    // Lift the rider clear of the textured back; the recovered mesh's visual
    // body sits higher than its geometry bounding box around the shoulders.
    // Sit down into the mount rather than standing upright on it.
    u.pipPivot.position.set(saddle.x, .9 + backHeight + .70, saddle.z);
    u.pipPivot.rotation.set(-.08, 0, 0);
    u.pipPivot.scale.setScalar(.92);
    const pose = {
      Spine: [-.72, 0, 0], Spine01: [-.30, 0, 0],
      // A real riding pose: hips lifted, thighs spread around the lizard's
      // shoulders, then knees bent down along both sides of its body.
      LeftUpLeg: [-1.52, 0, -.72], RightUpLeg: [-1.52, 0, .72],
      LeftLeg: [1.86, 0, 0], RightLeg: [1.86, 0, 0],
      LeftFoot: [-.08, 0, 0], RightFoot: [-.08, 0, 0],
      // Reach forward as if holding onto the neck/shoulders, rather than
      // holding the arms straight out to the sides.
      LeftArm: [.94, 0, -.26], RightArm: [.94, 0, .26],
      LeftForeArm: [.52, 0, -.08], RightForeArm: [.52, 0, .08],
      Head: [.72, 0, 0]
    };
    for (const [name, angles] of Object.entries(pose)) {
      const bone = u.pipBones?.[name], rest = u.pipRest?.[name];
      if (!bone || !rest) continue;
      bone.quaternion.copy(rest).multiply(new THREE.Quaternion().setFromEuler(
        new THREE.Euler(angles[0], angles[1], angles[2])));
    }

    // Use the actual hand bones and world-space targets, rather than relying
    // on arm Euler angles (whose local axes differ on Pip's imported rig).
    const saddleWorld = rat.localToWorld(saddle.clone());
    const forward = new THREE.Vector3(0, 0, 1)
      .transformDirection(g.model.matrixWorld).normalize();
    const side = new THREE.Vector3(1, 0, 0)
      .transformDirection(g.model.matrixWorld).normalize();
    const gripBase = saddleWorld.addScaledVector(forward, .56).add(new THREE.Vector3(0, .32, 0));
    // Proper leather reins instead of stretching Pip's arms to the neck.
    if (!g.reins128) {
      const reins = new THREE.Group();
      reins.name = 'Gecko leather reins';
      reins.userData.strands = [];
      for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
        const strand = [];
        for (let segment = 0; segment < 3; segment++) {
          const rein = new THREE.Mesh(
            new THREE.CylinderGeometry(.0055, .0055, 1, 6),
            new THREE.MeshStandardMaterial({ color: 0x24130a, roughness: .9 })
          );
          rein.castShadow = true; strand.push(rein); reins.add(rein);
        }
        reins.userData.strands.push(strand);
      }
      g.g.add(reins); g.reins128 = reins;
    }
    const anchors = [
      gripBase.clone().addScaledVector(side, .19),
      gripBase.clone().addScaledVector(side, -.19)
    ];
    ['LeftHand', 'RightHand'].forEach((name, i) => {
      const hand = u.pipBones?.[name];
      if (!hand) return;
      const from = g.g.worldToLocal(hand.getWorldPosition(new THREE.Vector3()));
      const to = g.g.worldToLocal(anchors[i]);
      // Three short cylinders form a visible but natural sagging leather rein.
      const middle = from.clone().lerp(to, .5).add(new THREE.Vector3(0, -.16, 0));
      const points = [from, from.clone().lerp(middle, .58), middle, to];
      const strand = g.reins128.userData.strands[i];
      for (let segment = 0; segment < 3; segment++) {
        const a = points[segment], b = points[segment + 1];
        const delta = b.clone().sub(a), length = delta.length();
        const rein = strand[segment];
        rein.position.copy(a).addScaledVector(delta, .5);
        rein.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
        rein.scale.set(1, length, 1);
      }
    });
  }

  const originalModels116 = tickModels44;
  tickModels44 = function tickModelsRecovered116(dt) {
    originalModels116(dt);
    seatPip116();
  };

  function nameGecko150() {
    if (!home.geckoTamed88) { sayToast('Tame the gecko first.'); return; }
    const current = home.geckoName88 || 'Gecko';
    modal('Name your gecko', `<p>Choose a short name for your companion.</p><input id="geckoName150" maxlength="14" value="${current.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" placeholder="Gecko name">`, [
      ['Save name', () => {
        const input = $('geckoName150');
        const name = (input?.value || '').replace(/[^a-zA-Z0-9 '\-]/g, '').trim().slice(0, 14);
        if (!name) { sayToast('Give your gecko a name first.'); return; }
        home.geckoName88 = name;
        if (wildlife88?.gecko) wildlife88.gecko.name = name;
        save(); closeModal(); sayToast(`${name} is ready to explore.`);
      }],
      ['Cancel', closeModal]
    ]);
    setTimeout(() => $('geckoName150')?.focus(), 0);
  }

  const menuBeforeGeckoName150 = menu65;
  menu65 = function menuWithGeckoName150() {
    menuBeforeGeckoName150();
    if (!home.geckoTamed88) return;
    const button = document.createElement('button');
    button.className = 'btn';
    button.textContent = `Name gecko · ${home.geckoName88 || 'Gecko'}`;
    button.addEventListener('click', nameGecko150);
    $('modalActions').appendChild(button);
  };

  // Mounted travel uses a small velocity buffer. It keeps Pip responsive but
  // lets the gecko gather speed and settle to a stop instead of skating.
  const controlBeforeGeckoRide151 = control;
  control = function smoothGeckoRide151(dt, options) {
    const g = wildlife88?.gecko;
    if (!g?.riding || !rat) return controlBeforeGeckoRide151(dt, options);
    const before = rat.position.clone();
    const beforeYaw = rat.rotation.y;
    const result = controlBeforeGeckoRide151(dt, { ...options, walk: 2.38 });
    const desired = rat.position.clone().sub(before).setY(0).multiplyScalar(1 / Math.max(dt, .001));
    const blend = 1 - Math.exp(-dt * 4.6);
    g.rideVelocity151 = g.rideVelocity151 || new THREE.Vector3();
    g.rideVelocity151.lerp(desired, blend);
    if (desired.lengthSq() < .001) g.rideVelocity151.multiplyScalar(1 - Math.exp(-dt * 7.5));
    rat.position.copy(before).addScaledVector(g.rideVelocity151, dt);
    if (options?.bounds) {
      rat.position.x = THREE.MathUtils.clamp(rat.position.x, options.bounds[0], options.bounds[1]);
      rat.position.z = THREE.MathUtils.clamp(rat.position.z, options.bounds[2], options.bounds[3]);
    }
    rat.userData.motionX = g.rideVelocity151.x;
    rat.userData.motionZ = g.rideVelocity151.z;
    rat.userData.vel = g.rideVelocity151.length();
    const turned = Math.atan2(Math.sin(rat.rotation.y - beforeYaw), Math.cos(rat.rotation.y - beforeYaw));
    const maxTurn = dt * 6.2;
    rat.rotation.y = beforeYaw + THREE.MathUtils.clamp(turned, -maxTurn, maxTurn);
    return Math.min(1, rat.userData.vel / 2.38);
  };

  // Rainyard Monitor home: actual exported GLB in a quiet rear-left corner.
  // Back-left map corner, just inside the fence line. The opening faces the yard.
  const DEN_POS_155 = new THREE.Vector3(28.1, 0, 36.2);
  const seedWildlifeBeforeDen153 = seedWildlife88;
  seedWildlife88 = function seedWildlifeWithMonitorHome153() {
    const result = seedWildlifeBeforeDen153();
    if (phase !== 'scavenge' || wildlife88?.owner !== root || wildlife88.den153Loading || wildlife88.den153) return result;
    wildlife88.den153Loading = true;
    const owner = root;
    loader88.load('rainyard-monitor-hide.glb?v=153', asset => {
      if (root !== owner || phase !== 'scavenge' || wildlife88.owner !== owner) return;
      const den = asset.scene;
      den.name = 'Rainyard Monitor clay-stone hide';
      den.position.copy(DEN_POS_155);
      den.rotation.y = 0;
      den.scale.setScalar(1.45);
      den.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      root.add(den); registerSolid62(den); wildlife88.den153 = den;
      const g = wildlife88.gecko;
      if (g) {
        g.denHome153 = DEN_POS_155.clone().add(new THREE.Vector3(0, 0, .42));
        g.g.position.copy(g.denHome153); g.g.rotation.y = Math.PI;
      }
    }, undefined, error => console.warn('Monitor hide failed to load:', error));
    return result;
  };

  // The monitor rests in its solid den whenever it is not being ridden. The
  // lowered body stays hidden behind the front stones, leaving its head out.
  const tickGeckoBeforeDen153 = tickGecko88;
  tickGecko88 = function tickMonitorAtHome153(dt, g) {
    if (wildlife88.den153 && !g.denHome153) {
      g.denHome153 = DEN_POS_155.clone().add(new THREE.Vector3(0, 0, .42));
    }
    if (!g.riding && g.denHome153 && !(g.callUntil173 > t)) {
      g.g.position.copy(g.denHome153); g.g.rotation.y = Math.PI;
      g.target.copy(g.denHome153); g.wander = 999;
      tickGeckoBeforeDen153(dt, g);
      if (g.denRestY153 === undefined) g.denRestY153 = g.model.position.y;
      g.g.position.copy(g.denHome153); g.g.rotation.y = Math.PI;
      g.model.position.y = g.denRestY153 - .20;
      return;
    }
    if (g.denRestY153 !== undefined) g.model.position.y = g.denRestY153;
    tickGeckoBeforeDen153(dt, g);
  };

  // Final movement pass: scenery is already triangle-solid, but smoothing a
  // mounted turn happens after the base controller. Re-run that collision and
  // give the two animal bodies a reliable physical radius as well.
  const controlBeforeWorldSolid154 = control;
  function pushAnimal154(p, body, radius) {
    if (!body || p.y > .7) return;
    const dx = p.x - body.position.x, dz = p.z - body.position.z;
    const d = Math.hypot(dx, dz), min = radius + .18;
    if (d >= min) return;
    const nx = d > .001 ? dx / d : 1, nz = d > .001 ? dz / d : 0;
    p.x = body.position.x + nx * min; p.z = body.position.z + nz * min;
  }
  control = function physicalWorld154(dt, options) {
    const before = rat?.position.clone();
    const speed = controlBeforeWorldSolid154(dt, options);
    if (!before || phase !== 'scavenge' || rat.userData.wallState) return speed;
    resolveGeometry62(rat.position, before);
    const g = wildlife88?.gecko;
    // The decorative cave is not an enterable building: keep Pip outside the
    // rock mass even at the open side, while its monitor can still be reached.
    if (wildlife88?.den153 && !g?.riding) pushAnimal154(rat.position, wildlife88.den153, 1.72);
    if (g && !g.riding) pushAnimal154(rat.position, g.g, .48);
    pushAnimal154(rat.position, wildlife88?.ratNpc?.g, .52);
    return speed;
  };

  // The monitor's head is intentionally just beyond the solid den boundary,
  // so the normal tame/ride interaction remains reachable from outside.
  const tickWildlifeBeforeDenPrompt155 = tickWildlife88;
  tickWildlife88 = function tickWildlifeMonitorPrompt155(dt) {
    tickWildlifeBeforeDenPrompt155(dt);
    const g = wildlife88?.gecko;
    if (!g || g.riding || !g.denHome153 || !rat || rat.userData.wallState || sc?.talk) return;
    const d = g.g.position.distanceTo(rat.position);
    if (d > 2.45) return;
    wildlife88.near = { type: 'gecko', obj: g, d };
    const gn = g.name || home.geckoName88 || 'Gecko';
    ui.prompt.style.display = 'block';
    ui.prompt.textContent = g.tamed ? 'E · Ride ' + gn : 'E · Tame gecko';
    $('padE').textContent = g.tamed ? 'Ride' : 'Tame';
  };

  // Water dive: Jump becomes Dive while swimming. Pip slips beneath the
  // surface, uses the real swim loop horizontally and surfaces on the next tap.
  const floatBeforeDive163 = float66;
  float66 = function floatWithDive163() {
    const swimming = floatBeforeDive163();
    const u = rat?.userData, water = rat && waterVolume66(rat.position);
    if (!u || !swimming || !water) {
      if (u) u.diving163 = false;
      if ($('padJ')) $('padJ').textContent = 'Jump';
      return swimming;
    }
    if (u.diving163) {
      rat.position.y = water === pond173.water
        ? Math.max(pondFloor180(rat.position.x, rat.position.z) + .22, water.position.y - 1.65)
        : water.position.y - .58;
      u.floor57 = rat.position.y;
    }
    if ($('padJ')) $('padJ').textContent = u.diving163 ? 'Surface' : 'Dive';
    return swimming;
  };

  const jumpBeforeDive163 = doJump;
  doJump = function diveOrJump163() {
    const u = rat?.userData;
    if (u?.swim66 && waterVolume66(rat.position)) {
      u.diving163 = !u.diving163;
      u.air = false; u.vy = 0;
      sayToast(u.diving163 ? 'Pip dives beneath the surface.' : 'Pip rises for air.');
      return;
    }
    return jumpBeforeDive163();
  };

  const makeRatBeforeDive163 = makeRat;
  makeRat = function makeDiveRat163() {
    const g = makeRatBeforeDive163(), animateBeforeDive163 = g.animate;
    g.animate = function animateDiveRat163(dt, ...args) {
      animateBeforeDive163(dt, ...args);
      const u = g.userData;
      if (!u.diving163 || !u.pipPivot) return;
      // A clean horizontal dive pose layered over Swim_Forward_Loop.
      u.pipPivot.rotation.x = .82;
      u.pipPivot.position.y = .52;
      for (const side of ['Left', 'Right']) {
        rotateBone69(u, side + 'Arm', -.78);
        rotateBone69(u, side + 'ForeArm', -.34);
        rotateBone69(u, side + 'UpLeg', .32);
      }
    };
    return g;
  };

  const worldBeforeDive163 = tickWorld38;
  tickWorld38 = function tickDiveBubbles163(dt) {
    worldBeforeDive163(dt);
    const u = rat?.userData;
    if (!u?.diving163 || !rat) { if (u?.diveBubbles163) u.diveBubbles163.visible = false; return; }
    if (!u.diveBubbles163) {
      const group = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: 0xd9f7f2, transparent: true, opacity: .72 });
      for (let i = 0; i < 9; i++) { const bubble = new THREE.Mesh(new THREE.SphereGeometry(.024 + (i % 3) * .012, 6, 5), mat); bubble.userData.offset = i * .47; group.add(bubble); }
      root.add(group); u.diveBubbles163 = group;
    }
    const group = u.diveBubbles163; group.visible = true; group.position.copy(rat.position);
    group.children.forEach((bubble, i) => { const age = (t * 1.3 + bubble.userData.offset) % 1; bubble.position.set(Math.sin(i * 2.7) * .13, age * .62, Math.cos(i * 3.1) * .13); bubble.scale.setScalar(.35 + age); });
  };

  // A low wooden bench/dive board gives the paddling pool a deliberate jump
  // point. Jump at its end to perform a short clean splash into the water.
  function addDiveBoard164() {
    if (phase !== 'scavenge' || !root || root.userData.diveBoard164) return;
    const g = new THREE.Group(), wood = new THREE.MeshStandardMaterial({ color: 0x76513b, roughness: .92 });
    const board = new THREE.Mesh(new THREE.BoxGeometry(.72, .12, 2.15), wood);
    board.position.y = 1.36; board.castShadow = board.receiveShadow = true; g.add(board);
    for (const z of [-.72, .42]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.13, 1.34, .13), wood); leg.position.set(0, .67, z); leg.castShadow = true; g.add(leg); }
    g.position.set(-12.5, 0, 27.78); g.name = 'High pool diving bench'; root.add(g); registerSolid62(g);
    root.userData.diveBoard164 = { g, end: new THREE.Vector3(-12.5, 1.38, 28.72), splash: new THREE.Vector3(-12.5, 0, 30.05) };
  }
  const seedWildlifeBeforeBoard164 = seedWildlife88;
  seedWildlife88 = function seedWithDiveBoard164() { const r = seedWildlifeBeforeBoard164(); addDiveBoard164(); return r; };

  const jumpBeforeBoard164 = doJump;
  doJump = function jumpFromPoolBoard164() {
    const u = rat?.userData, board = root?.userData.diveBoard164;
    if (u && board && !u.air && !u.swim66 && !u.act && Math.hypot(rat.position.x - board.end.x, rat.position.z - board.end.z) < .78) {
      u.poolLeap164 = { t: 0, from: rat.position.clone() };
      u.air = true; u.vy = 0; u.motionX = u.motionZ = 0; u.leap166 = true;
      sayToast('Pip leaps into the pool!'); return;
    }
    return jumpBeforeBoard164();
  };

  const worldBeforeBoard164 = tickWorld38;
  tickWorld38 = function tickPoolBoard164(dt) {
    worldBeforeBoard164(dt); addDiveBoard164();
    const u = rat?.userData, board = root?.userData.diveBoard164;
    if (!u || !board) return;
    if (u.poolLeap164) {
      const leap = u.poolLeap164;
      // Let the launch and splash feel snappy, then hold the middle of the
      // arc in a readable slow-motion beat for Pip's Leap of Faith pose.
      const priorQ = Math.min(1, leap.t / 1.25);
      leap.t += dt * (priorQ > .30 && priorQ < .74 ? .40 : 1);
      const q = Math.min(1, leap.t / 1.25);
      rat.position.lerpVectors(leap.from, board.splash, q);
      rat.position.y = leap.from.y * (1 - q) + Math.sin(q * Math.PI) * 2.65;
      rat.rotation.y = Math.PI; u.air = true;
      if (q === 1) { u.poolLeap164 = null; u.air = false; u.diving163 = true; rat.position.y = waterVolume66(rat.position)?.position.y - .58 || 0; sayToast('Tap Surface when you want to rise.'); }
      return;
    }
    if (!u.swim66 && !u.air && Math.hypot(rat.position.x - board.end.x, rat.position.z - board.end.z) < .88) {
      $('padJ').textContent = 'Leap';
    }
  };

  // Leap of Faith: play Pip's forward dive whenever a descent begins from a
  // meaningful height. A normal hop stays a normal jump; the board marks the
  // leap immediately, and ledges activate it once Pip starts falling.
  const motionBeforeLeap166 = motion67;
  motion67 = function motionWithLeap166(g, dt, speed, base, act) {
    const selected = motionBeforeLeap166(g, dt, speed, base, act);
    const u = g?.userData;
    return (g === rat && u?.leap166 && u.air && !u.swim66 && u.act?.type !== 'airRoll') ? 'Fall_Forward' : selected;
  };

  const makeRatBeforeLeap166 = makeRat;
  makeRat = function makeLeapRat166() {
    const g = makeRatBeforeLeap166(), animateBeforeLeap166 = g.animate;
    g.animate = function animateLeapRat166(dt, ...args) {
      animateBeforeLeap166(dt, ...args);
      const u = g.userData;
      if (!u.leap166 || !u.air || u.swim66 || !u.pipPivot) return;
      // A compact forward swan-dive that keeps Pip readable at game distance.
      u.pipPivot.rotation.x = .74;
      for (const side of ['Left', 'Right']) {
        rotateBone69(u, side + 'Arm', -.92);
        rotateBone69(u, side + 'ForeArm', -.42);
        rotateBone69(u, side + 'UpLeg', .24);
      }
    };
    return g;
  };

  const worldBeforeLeap166 = tickWorld38;
  tickWorld38 = function tickLeapOfFaith166(dt) {
    worldBeforeLeap166(dt);
    const u = rat?.userData;
    if (!u || !rat) return;
    if (u.air && !u.swim66) {
      u.fallPeak166 = Math.max(u.fallPeak166 ?? rat.position.y, rat.position.y);
      // Ordinary jumps peak below this; board jumps and ledge falls exceed it.
      if (!u.leap166 && u.fallPeak166 > 1.15 && u.vy < -0.55) {
        u.leap166 = true;
        sayToast('Leap of faith!');
      }
      return;
    }
    u.fallPeak166 = rat.position.y;
    u.leap166 = false;
  };

  // Build 169 movement poses: use the supplied Pip rig, then layer the
  // recognisable low crawl, running long-jump and wall-kick silhouettes over it.
  const makeRatBeforeMoves169 = makeRat;
  makeRat = function makeMovementRat169() {
    const g = makeRatBeforeMoves169(), animateBeforeMoves169 = g.animate;
    g.animate = function animateMovementRat169(dt, ...args) {
      animateBeforeMoves169(dt, ...args);
      const u = g.userData, p = u.pipPivot;
      if (!p) return;
      if (u.crawl169 && !u.air && !u.swim66) {
        p.position.y = .57; p.rotation.x = .54;
        for (const side of ['Left', 'Right']) {
          rotateBone69(u, side + 'Arm', -.72);
          rotateBone69(u, side + 'ForeArm', -.48);
          rotateBone69(u, side + 'UpLeg', .72);
          rotateBone69(u, side + 'Leg', -.46);
        }
      } else if (u.wallJump169 > 0) {
        u.wallJump169 = Math.max(0, u.wallJump169 - dt);
        p.rotation.x = .38;
        for (const side of ['Left', 'Right']) { rotateBone69(u, side + 'Arm', -.82); rotateBone69(u, side + 'UpLeg', .55); }
      } else if (u.longJump169 && u.air) {
        p.rotation.x = .32;
        for (const side of ['Left', 'Right']) { rotateBone69(u, side + 'Arm', -.72); rotateBone69(u, side + 'ForeArm', -.32); rotateBone69(u, side + 'UpLeg', .28); }
      }
    };
    return g;
  };

  // Build 171: compact feedback polish that makes everyday exploration feel
  // much more alive without adding another heavy scene or combat system.
  const polish171 = { dust: [], ripples: [], finds: [], clock: 0, waterClock: 0 };
  const dustMat171 = new THREE.MeshBasicMaterial({ color: 0xdcc89b, transparent: true, opacity: .55, depthWrite: false });
  const rippleMat171 = new THREE.MeshBasicMaterial({ color: 0xd9f7f2, transparent: true, opacity: .62, depthWrite: false, side: THREE.DoubleSide });

  function burst171(list, position, kind = 'dust') {
    if (!root) return;
    const mesh = new THREE.Mesh(kind === 'dust' ? new THREE.CircleGeometry(.18, 12) : new THREE.RingGeometry(.07, .10, 14), kind === 'dust' ? dustMat171.clone() : rippleMat171.clone());
    mesh.rotation.x = -Math.PI / 2; mesh.position.copy(position); mesh.position.y += .025; root.add(mesh);
    list.push({ mesh, age: 0, kind });
  }
  function updateBurst171(list, dt) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i]; p.age += dt; const q = p.age / (p.kind === 'dust' ? .48 : .7);
      p.mesh.scale.setScalar(1 + q * (p.kind === 'dust' ? 3.3 : 5)); p.mesh.material.opacity = Math.max(0, (1 - q) * (p.kind === 'dust' ? .45 : .55));
      if (q >= 1) { p.mesh.parent?.remove(p.mesh); p.mesh.geometry.dispose(); p.mesh.material.dispose(); list.splice(i, 1); }
    }
  }

  const landBeforePolish171 = land57;
  land57 = function landWithImpact171(u, impact, surface) {
    landBeforePolish171(u, impact, surface);
    if (impact > 3.5 && rat) {
      burst171(polish171.dust, rat.position, 'dust');
      gameCam.shake171 = Math.min(.18, impact * .012);
    }
  };

  const pickupBeforePolish171 = pickupCard60;
  pickupCard60 = function pickupWithSparkle171(id, rare) {
    pickupBeforePolish171(id, rare);
    if (!rat || !root) return;
    const g = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: rare ? 0xffd66d : 0xfff3ae, transparent: true, opacity: .95 });
    for (let i = 0; i < 5; i++) { const star = new THREE.Mesh(new THREE.OctahedronGeometry(.04, 0), mat); star.userData.a = i * 1.26; g.add(star); }
    g.position.copy(rat.position).add(new THREE.Vector3(0, .45, 0)); root.add(g); polish171.finds.push({ g, age: 0, mat });
  };

  const grabBeforePolish171 = grab;
  grab = function grabPolishFind171() {
    const find = polish171.finds171?.find(f => f.g.position.distanceTo(rat.position) < .85);
    if (find) return grabBeforePolish171();
    return grabBeforePolish171();
  };

  function addMap171() {
    if ($('miniMap171')) return;
    const map = document.createElement('div'); map.id = 'miniMap171';
    map.innerHTML = '<b>Yard</b><i data-id="home">⌂</i><i data-id="den" aria-label="Lizard den">🦎</i><i data-id="pip">●</i>';
    map.style.cssText = 'display:none;position:fixed;right:12px;top:104px;width:108px;height:108px;border:2px solid #e7dbc0;border-radius:18px;background:#29463ddd;color:#f7eedc;z-index:24;pointer-events:none;overflow:hidden;font:11px system-ui';
    map.querySelector('b').style.cssText = 'position:absolute;left:9px;top:7px;font-weight:600';
    map.querySelectorAll('i').forEach(i => i.style.cssText = 'position:absolute;font-style:normal;transform:translate(-50%,-50%);font-size:16px');
    map.querySelector('[data-id="home"]').style.color = '#f4d987'; map.querySelector('[data-id="den"]').style.color = '#a8df9f'; map.querySelector('[data-id="pip"]').style.color = '#ffead0';
    map.userData = {};
    document.body.appendChild(map);
    const style = document.createElement('style'); style.textContent = '#mute{top:224px!important;z-index:28!important}.photo #hud,.photo #settings,.photo #survival,.photo #weatherBadge,.photo #mute,.photo #pad,.photo #cameraTools,.photo #miniMap171,.photo #prompt{display:none!important}'; document.head.appendChild(style);
  }
  function mapPoint171(el, x, z) { el.style.left = (10 + (x + 20) / 50 * 88) + 'px'; el.style.top = (96 - (z / 38) * 88) + 'px'; }
  function seedFinds171() {
    if (phase !== 'scavenge' || !root || polish171.findOwner === root) return;
    polish171.findOwner = root; polish171.finds171 = [];
    [[-10.8, .12, 18.8], [15.2, .12, 8.9], [1.5, .12, 34.2]].forEach((p, i) => {
      const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: [0xd6b35e, 0x9dc4d4, 0xd77e54][i], emissive: [0x382200, 0x00222b, 0x340c00][i], emissiveIntensity: .6 });
      const coin = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .035, 12), mat); coin.rotation.x = Math.PI / 2; g.add(coin); g.position.set(...p); g.name = 'Hidden shiny find'; root.add(g); polish171.finds171.push({ g, id: 'shiny' + i, taken: false, mat, phase: i });
    });
  }
  const grabBeforeFinds171 = grab;
  grab = function grabHiddenFind171() {
    const f = polish171.finds171?.find(x => !x.taken && x.g.position.distanceTo(rat.position) < .72);
    if (f) { f.taken = true; f.g.visible = false; pickupCard60('coin', true); sayToast('A hidden shiny thing for Pip’s collection.'); return true; }
    return grabBeforeFinds171();
  };

  const cameraBeforePolish171 = tickGameplayCamera;
  tickGameplayCamera = function cameraWithImpact171(dt) {
    cameraBeforePolish171(dt);
    if (gameCam.shake171 > .001 && !photo.active) { camera.position.x += Math.sin(t * 91) * gameCam.shake171; camera.position.y += Math.cos(t * 77) * gameCam.shake171; gameCam.shake171 *= Math.exp(-dt * 13); }
  };

  const worldBeforePolish171 = tickWorld38;
  tickWorld38 = function tickPolish171(dt) {
    worldBeforePolish171(dt); addMap171(); seedFinds171(); polish171.clock += dt;
    updateBurst171(polish171.dust, dt); updateBurst171(polish171.ripples, dt);
    const u = rat?.userData;
    if (u?.swim66 && polish171.clock - polish171.waterClock > .34) { polish171.waterClock = polish171.clock; burst171(polish171.ripples, rat.position, 'ripple'); }
    for (const f of polish171.finds) { f.age += dt; f.g.position.y += dt * .38; f.g.rotation.y += dt * 5; f.mat.opacity = Math.max(0, 1 - f.age / .55); if (f.age > .55) { f.g.parent?.remove(f.g); f.mat.dispose(); polish171.finds.splice(polish171.finds.indexOf(f), 1); } }
    for (const f of polish171.finds171 || []) if (!f.taken) { f.g.rotation.y += dt * 1.8; f.g.position.y = .12 + Math.sin(polish171.clock * 2.5 + f.phase) * .05; }
    const map = $('miniMap171'); if (map) { map.style.display = phase === 'scavenge' && !photo.active ? 'block' : 'none'; if (rat) mapPoint171(map.querySelector('[data-id="pip"]'), rat.position.x, rat.position.z); mapPoint171(map.querySelector('[data-id="home"]'), 0, -2); const den = wildlife88?.den153 ? DEN_POS_155 : new THREE.Vector3(-18.75, 0, 24.75); mapPoint171(map.querySelector('[data-id="den"]'), den.x, den.z); }
    // A slow, restrained light cycle: warm afternoon through blue evening.
    if (['scavenge', 'explore'].includes(phase)) { const day = .52 + .48 * Math.sin(polish171.clock * .035); sun.intensity = .25 + day * .65; hemi.intensity = .23 + day * .36; }
    const gecko = wildlife88?.gecko;
    if (gecko?.denHome153 && !gecko.riding) { if (gecko.restY171 === undefined) gecko.restY171 = gecko.model.position.y; gecko.model.rotation.z = Math.sin(polish171.clock * 1.8) * .025; gecko.model.position.y = gecko.restY171 + Math.sin(polish171.clock * 1.8) * .002; }
  };

  // Build 173: a larger readable yard map, a natural pond and a proper
  // underwater follow camera. The pond uses the same swim/dive controls as
  // the pool, so it is immediately playable on mobile.
  const pond173 = { owner: null, water: null, fish: [], clock: 0 };
  function addPond173() {
    return buildNaturalPond179();
  }
  /* Retained for reference only; replaced by the sculpted basin below. */
  function retiredPool173() {
    if (phase !== 'scavenge' || !root || pond173.owner === root) return;
    pond173.owner = root; pond173.fish = []; pond173.clock = 0;
    const center = new THREE.Vector3(23.2, 0, 32.1), g = new THREE.Group(); g.name = 'Willow pond';
    const shore = new THREE.Mesh(new THREE.CylinderGeometry(2.72, 2.94, .18, 32), new THREE.MeshStandardMaterial({ color: 0x765d40, roughness: 1 })); shore.scale.z = .78; shore.position.set(center.x, .01, center.z); g.add(shore);
    const liner = new THREE.Mesh(new THREE.CylinderGeometry(2.46, 2.65, .16, 32), new THREE.MeshStandardMaterial({ color: 0x233c37, roughness: 1 })); liner.scale.z = .78; liner.position.set(center.x, .08, center.z); g.add(liner);
    const water = new THREE.Mesh(new THREE.CircleGeometry(2.37, 40), new THREE.MeshStandardMaterial({ color: 0x397d89, transparent: true, opacity: .78, roughness: .18, metalness: .12, depthWrite: false })); water.scale.z = .78; water.rotation.x = -Math.PI / 2; water.position.set(center.x, .48, center.z); water.name = 'Deep pond water'; g.add(water); pond173.water = water;
    const reedMat = new THREE.MeshStandardMaterial({ color: 0x4d6b38, roughness: 1 });
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, r = 2.55 + (i % 3) * .10; const reed = new THREE.Mesh(new THREE.CylinderGeometry(.022, .032, .42 + (i % 4) * .08, 5), reedMat); reed.position.set(center.x + Math.sin(a) * r, .3, center.z + Math.cos(a) * r * .76); reed.rotation.z = Math.sin(i * 4.1) * .15; g.add(reed); }
    root.add(g); pond173.g = g;
    for (let i = 0; i < 7; i++) { const fish = new THREE.Group(), body = new THREE.Mesh(new THREE.SphereGeometry(.13, 8, 6), new THREE.MeshStandardMaterial({ color: [0xe2a64a, 0xd86c44, 0x8ab1c4][i % 3], roughness: .6 })); body.scale.set(1.5, .6, .65); fish.add(body); const tail = new THREE.Mesh(new THREE.ConeGeometry(.09, .18, 3), body.material); tail.rotation.z = -Math.PI / 2; tail.position.x = -.19; fish.add(tail); fish.userData = { a: i * .86, r: .55 + (i % 4) * .52, speed: .45 + (i % 3) * .11, depth: .13 + (i % 2) * .10 }; g.add(fish); pond173.fish.push(fish); }
  }
  const waterBeforePond173 = waterVolume66;
  waterVolume66 = function waterWithPond173(p) {
    const w = pond173.water;
    if (w && pond173.owner === root && pondInside179(p.x, p.z)) return w;
    return waterBeforePond173(p);
  };
  const cameraBeforePond173 = tickGameplayCamera;
  tickGameplayCamera = function underwaterFollow173(dt) {
    cameraBeforePond173(dt);
    applyDiveCamera181();
  };
  window.applyDiveCamera181 = function() {
    try {
      const u = rat?.userData, water = rat && waterVolume66(rat.position);
      if (!u?.diving163 || !water || photo.active || !['scavenge','explore'].includes(phase)) return;
      const target = rat.position.clone().add(new THREE.Vector3(0, .13, 0));
      const distance = THREE.MathUtils.clamp(gameCam.distance * .68, 2.2, 3.6);
      const offset = new THREE.Vector3(Math.sin(gameCam.yaw) * distance, .12, Math.cos(gameCam.yaw) * distance);
      const goal = target.clone().add(offset);
      if (water === pond173.water) {
        // Find room around the swimmer instead of collapsing the boom into Pip.
        let found=false;
        for(const d of [distance,2.2,1.8]) {
          for(const turn of [0,.35,-.35,.7,-.7,1.05,-1.05,1.57,-1.57,2.1,-2.1,Math.PI]) {
            const a=gameCam.yaw+turn,x=target.x+Math.sin(a)*d,z=target.z+Math.cos(a)*d;
            if(!pondInside179(x,z)||pondFloor180(x,z)+.18>target.y+.22)continue;
            goal.set(x,Math.min(water.position.y-.15,Math.max(target.y+.08,pondFloor180(x,z)+.18)),z);
            found=true;break;
          }
          if(found)break;
        }
        if(!found)goal.set(23.2,Math.min(water.position.y-.2,target.y+.08),32.1);
      } else goal.y = Math.min(goal.y,water.position.y-.2);
      camera.position.copy(goal);
      gameCam.pos.copy(goal);
      camera.lookAt(target);
    } catch (error) { console.warn('Underwater camera disabled for this frame', error); }
  };
  const worldBeforePond173 = tickWorld38;
  tickWorld38 = function tickPond173(dt) {
    // Exploration polish is optional: never allow a visual add-on to freeze
    // the base player/camera loop.
    try { worldBeforePond173(dt); } catch (error) { console.warn('Optional exploration layer paused', error); }
    try {
      addPond173();
      if (pond173.owner !== root || !pond173.water) return;
      pond173.clock += dt;
      for (const fish of pond173.fish) { const u = fish.userData, a = u.a + pond173.clock * u.speed; fish.position.set(pond173.water.position.x + Math.cos(a) * u.r, pond173.water.position.y - u.depth + Math.sin(pond173.clock * 2 + u.a) * .035, pond173.water.position.z + Math.sin(a) * u.r * .58); fish.rotation.y = -a + Math.PI / 2; fish.rotation.z = Math.sin(pond173.clock * 5 + u.a) * .16; }
    } catch (error) { console.warn('Pond update disabled for this frame', error); }
  };

  const mapBeforeLarge173 = addMap171;
  addMap171 = function addLargeMap173() {
    mapBeforeLarge173(); const map = $('miniMap171'); if (!map) return; map.userData ||= {}; if (map.userData.large173) return;
    map.userData.large173 = true; map.style.width = '150px'; map.style.height = '150px'; map.style.borderRadius = '22px';
    $('mute').style.top = '270px';
  };
  const pointBeforeLarge173 = mapPoint171;
  mapPoint171 = function mapPointLarge173(el, x, z) {
    const map = $('miniMap171'); if (!map?.userData.large173) return pointBeforeLarge173(el, x, z);
    el.style.left = (12 + (x + 22) / 55 * 124) + 'px'; el.style.top = (137 - (z + 14) / 55 * 124) + 'px';
  };

  // Small, useful exploration tools rather than another complicated HUD.
  function callGecko173() {
    const g = wildlife88?.gecko;
    if (!g?.tamed) { sayToast('Tame the gecko first.'); return; }
    g.callUntil173 = t + 12; g.wander = 0; sayToast((g.name || 'Gecko') + ' comes to Pip for a moment.'); closeModal();
  }
  function senses173() {
    const count = (polish171.finds171 || []).filter(f => !f.taken).length;
    sayToast(count ? 'Pip catches ' + count + ' glint' + (count > 1 ? 's' : '') + ' nearby on the yard map.' : 'Pip cannot smell any more hidden shinies.');
    const map = $('miniMap171'); if (map) { map.style.boxShadow = '0 0 0 4px #e9c867,0 0 24px #e9c867'; setTimeout(() => { if (map) map.style.boxShadow = ''; }, 1200); }
  }
  function collection173() {
    const shiny = (polish171.finds171 || []).filter(f => f.taken).length;
    const fish = home.pondFish173 || 0;
    modal('Pip’s little collection', `<p>Shiny things found: <strong>${shiny} / 3</strong></p><p>Pond fish watched: <strong>${fish}</strong></p><p>Places: Pip’s Lane · Willow Pond · Monitor Den</p>`, [['Close', closeModal]]);
  }
  const menuBeforeExplore173 = menu65;
  menu65 = function menuExplore173() {
    menuBeforeExplore173();
    const actions = $('modalActions'); if (!actions) return;
    const add = (label, fn) => { const b = document.createElement('button'); b.className = 'btn'; b.textContent = label; b.onclick = fn; actions.appendChild(b); };
    if (phase === 'scavenge') { add('Rat senses', senses173); add('Call gecko', callGecko173); add('Collection book', collection173); }
    if (phase === 'house') add('Rest until evening', () => { home.weather42 = 'evening'; save(); closeModal(); sayToast('Pip wakes to a warm evening.'); });
  };
  const grabBeforeFish173 = grab;
  grab = function pondFishInteraction173() {
    if (pond173.owner === root && pond173.water && rat && !rat.userData.diving163 && Math.hypot(rat.position.x - pond173.water.position.x, rat.position.z - pond173.water.position.z) < 2.7) {
      home.pondFish173 = (home.pondFish173 || 0) + 1; save(); sayToast('A little fish flicks its tail beneath the reeds.'); return true;
    }
    return grabBeforeFish173();
  };

  // Open the east-rear corner into a real extra playyard with a matching fence.
  const expansion177 = { owner: null };
  function addPlayyard177() {
    if (phase !== 'scavenge' || !root || expansion177.owner === root) return;
    expansion177.owner = root;
    const remove = [];
    root.traverse(o => { if ((o.name === 'Backyard perimeter collider' || /Weathered backyard fence/.test(o.name || '')) && (o.position.x > 30 || o.position.z > 37)) remove.push(o); });
    for (const o of remove) { removeSolid78(o); o.parent?.remove(o); }
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(27, 19), new THREE.MeshStandardMaterial({ color: 0x668c57, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.set(34.5, .006, 42.5); ground.name = 'East playyard grass'; root.add(ground);
    const mat = new THREE.MeshStandardMaterial({ color: 0x51321e, roughness: 1 });
    const fence = (x, z, w, d) => { const m = box(w, 2.75, d, mat); m.position.set(x, 1.375, z); m.name = 'Extended playyard fence'; solid78(m); };
    fence(47, 42.5, .16, 19); fence(34.5, 52, 25, .16);
    for (let i = 0; i < 18; i++) { const blade = new THREE.Mesh(new THREE.ConeGeometry(.035, .38 + (i % 3) * .12, 4), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x4b793e : 0x739753 })); blade.position.set(25 + (i % 6) * 3.6, .2, 38.5 + Math.floor(i / 6) * 4.2); root.add(blade); }
    root.userData.collisionCache62?.clear();
  }
  const controlBeforePlayyard177 = control;
  control = function controlPlayyard177(dt, options) {
    const next = phase === 'scavenge' ? { ...options, bounds: [-21, 46.6, -14, 51.6] } : options;
    return controlBeforePlayyard177(dt, next);
  };
  const worldBeforePlayyard177 = tickWorld38;
  tickWorld38 = function tickPlayyard177(dt) { worldBeforePlayyard177(dt); try { addPlayyard177(); } catch (error) { console.warn('Playyard extension paused', error); } };
  const cameraBeforePlayyard177 = tickGameplayCamera;
  tickGameplayCamera = function framePlayyard177(dt) {
    cameraBeforePlayyard177(dt);
    if (phase === 'scavenge' && !photo.active && gameCam.distance > 5.3) gameCam.distance = 4.8;
  };

  // Build 178: retain the pond's generous footprint but landscape it into a
  // real place, and give the new playyard a reason to explore.
  const landscape178 = { owner: null, prize: null };
  function rock178(x, z, scale, color = 0x73685a) {
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color, roughness: 1 })); r.position.set(x, scale * .45, z); r.scale.set(scale * 1.3, scale * .72, scale); r.rotation.set(.2, x * .37, z * .18); root.add(r); return r;
  }
  function addLandscape178() {
    if (phase !== 'scavenge' || !root || landscape178.owner === root || !pond173.water) return;
    landscape178.owner = root;
    const cx = pond173.water.position.x, cz = pond173.water.position.z;
    // Uneven stones and lily pads break the perfect manufactured rim.
    // Shore rocks and pads are part of the new pond itself.
    // A simple dirt stepping path connects Pip's Lane, the pond and new yard.
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x917552, roughness: 1 });
    for (let i = 0; i < 14; i++) { const q = i / 13, stone = new THREE.Mesh(new THREE.CircleGeometry(.36 + (i % 3) * .04, 9), pathMat); stone.rotation.x = -Math.PI / 2; stone.position.set(7 + q * 15.3, .018, 28.5 + Math.sin(q * Math.PI) * 3.8); stone.rotation.z = i * .61; root.add(stone); }
    // Landmarks: a tree, little shed, rocky hiding bush and a short log climb.
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.32, .48, 4.4, 7), new THREE.MeshStandardMaterial({ color: 0x5a412b, roughness: 1 })); trunk.position.set(38.5, 2.2, 43.2); root.add(trunk);
    for (let i = 0; i < 4; i++) { const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35 - i * .12, 1), new THREE.MeshStandardMaterial({ color: [0x456d3d, 0x587e45, 0x365c35, 0x5a843e][i], roughness: 1 })); crown.position.set(38.5 + Math.sin(i * 2.2) * .65, 5.2 + (i % 2) * .35, 43.2 + Math.cos(i * 2.2) * .65); root.add(crown); }
    const shed = new THREE.Group(), wood = new THREE.MeshStandardMaterial({ color: 0x76513b, roughness: 1 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(3.1, 2.15, 2.35), wood); wall.position.y = 1.08; shed.add(wall); const roof = new THREE.Mesh(new THREE.ConeGeometry(2.35, 1.05, 4), new THREE.MeshStandardMaterial({ color: 0x3e3934, roughness: 1 })); roof.position.y = 2.68; roof.rotation.y = Math.PI / 4; shed.add(roof); shed.position.set(42.1, 0, 47.7); shed.name = 'Little playyard shed'; root.add(shed); registerSolid62(shed);
    for (let i = 0; i < 7; i++) rock178(28.2 + Math.sin(i * 1.7) * .8, 43 + Math.cos(i * 1.7) * .65, .33 + (i % 2) * .12, 0x4c7041);
    for (let i = 0; i < 3; i++) { const log = new THREE.Mesh(new THREE.CylinderGeometry(.25, .28, 2.05, 9), new THREE.MeshStandardMaterial({ color: 0x69442d, roughness: 1 })); log.rotation.z = Math.PI / 2; log.position.set(31 + i * 1.2, .32 + i * .28, 39.8); log.name = 'Log climb'; root.add(log); }
    const prize = new THREE.Mesh(new THREE.OctahedronGeometry(.18, 0), new THREE.MeshStandardMaterial({ color: 0xe6be4c, emissive: 0x593600, emissiveIntensity: .7 })); prize.position.set(42.1, .62, 46.1); prize.name = 'Playyard brass charm'; root.add(prize); landscape178.prize = prize;
  }
  const startBeforeRestore178 = startScavenge;
  startScavenge = function restoreStart178() {
    startBeforeRestore178(); const life = ensureLife();
    if (life.hunger < 8 || life.thirst < 8) { life.hunger = Math.max(62, life.hunger); life.thirst = Math.max(62, life.thirst); save(); sayToast('Pip starts the day fed and hydrated.'); }
    gameCam.distance = 4.8;
  };
  const grabBeforeLandscape178 = grab;
  grab = function grabLandscapePrize178() {
    if (landscape178.prize?.visible && rat?.position.distanceTo(landscape178.prize.position) < .85) { landscape178.prize.visible = false; pickupCard60('coin', true); sayToast('You found the playyard brass charm.'); return true; }
    return grabBeforeLandscape178();
  };
  const worldBeforeLandscape178 = tickWorld38;
  tickWorld38 = function tickLandscape178(dt) { worldBeforeLandscape178(dt); try { addLandscape178(); if (landscape178.prize?.visible) { landscape178.prize.rotation.y += dt * 2.4; landscape178.prize.position.y = .62 + Math.sin(t * 3) * .05; } } catch (error) { console.warn('Landscape pass paused', error); } };
  const mapBeforeLabels178 = addMap171;
  addMap171 = function mapLabels178() { mapBeforeLabels178(); const m = $('miniMap171'); if (m && !m.querySelector('.labels178')) { const l = document.createElement('small'); l.className = 'labels178'; l.textContent = 'Willow Pond · Playyard'; l.style.cssText = 'position:absolute;left:9px;bottom:7px;font-size:8px;opacity:.8'; m.appendChild(l); } };
  const style178 = document.createElement('style'); style178.textContent = '#mute{top:340px!important;z-index:28!important}'; document.head.appendChild(style178);
  const hud181=document.createElement('style');hud181.textContent='#miniMap171{width:104px!important;height:104px!important;border-radius:14px!important}#miniMap171 .labels178{display:none}#mute#mute{top:auto!important;bottom:190px!important;left:12px!important;right:auto!important;height:36px!important;min-height:0!important;width:auto!important;padding:6px 12px!important;z-index:40!important}';document.head.appendChild(hud181);
  mapPoint171=function(el,x,z){el.style.left=(8+(x+22)/70*88)+'px';el.style.top=(94-(z+14)/67*80)+'px';};

  // One shared shoreline drives the mesh and swimming bounds.
  function pondRadius179(a) { return 1 + .12 * Math.sin(3*a+.4) + .065 * Math.cos(5*a); }
  function pondDistance179(x,z) { return Math.hypot((x-23.2)/3.6,(z-32.1)/2.9); }
  function pondInside179(x,z) { const a=Math.atan2((z-32.1)/2.9,(x-23.2)/3.6); return pondDistance179(x,z)<pondRadius179(a); }
  function pondFloor180(x,z) {
    const a=Math.atan2((z-32.1)/2.9,(x-23.2)/3.6),q=pondDistance179(x,z)/pondRadius179(a);
    return q<.68 ? -2.4+q/.68*.6 : q<1 ? -1.8+(q-.68)/.32*2.6 : .8;
  }
  function excavatePond180() {
    // Cut only flat ground surfaces; leave props, actors and their materials alone.
    const bounds=new THREE.Box3(),size=new THREE.Vector3();
    root.updateMatrixWorld(true);
    root.traverse(mesh=>{
      if(!mesh.isMesh||!mesh.geometry||mesh.isSkinnedMesh)return;
      bounds.setFromObject(mesh);bounds.getSize(size);
      if(size.y>.18||bounds.max.y>.2||bounds.min.y<-.2||size.x<4||size.z<4||bounds.max.x<19||bounds.min.x>28||bounds.max.z<28||bounds.min.z>36)return;
      const cut=original=>{const mat=original.clone();mat.onBeforeCompile=shader=>{
        shader.vertexShader='varying vec3 pondWorld180;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\npondWorld180=(modelMatrix*vec4(transformed,1.0)).xyz;');
        shader.fragmentShader='varying vec3 pondWorld180;\n'+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nvec2 pondP180=(pondWorld180.xz-vec2(23.2,32.1))/vec2(3.6,2.9); float pondA180=atan(pondP180.y,pondP180.x); if(length(pondP180)<1.0+0.12*sin(3.0*pondA180+0.4)+0.065*cos(5.0*pondA180)) discard;');
      };mat.customProgramCacheKey=()=> 'pond-cut-180';return mat;};
      mesh.material=Array.isArray(mesh.material)?mesh.material.map(cut):cut(mesh.material);
    });
  }
  function buildNaturalPond179() {
    if (phase !== 'scavenge' || !root || pond173.owner === root) return;
    excavatePond180();
    const g = new THREE.Group(); g.name='Willow pond · natural bank'; root.add(g);
    pond173.owner=root; pond173.g=g; pond173.fish=[]; pond173.clock=0;
    const material=(color)=>new THREE.MeshStandardMaterial({color,roughness:.95});
    const rings=[0,.68,1,1.12,1.52], heights=[-2.4,-1.8,.8,.86,.015];
    const colors=[0x173735,0x36504a,0x8d8061,0x847257,0x68804b];
    const vertices=[], indices=[], shades=[], n=80;
    for(let r=0;r<rings.length;r++) for(let i=0;i<=n;i++) {
      const a=i/n*Math.PI*2, radius=pondRadius179(a)*rings[r];
      vertices.push(23.2+Math.cos(a)*3.6*radius,heights[r],32.1+Math.sin(a)*2.9*radius);
      const c=new THREE.Color(colors[r]); c.multiplyScalar(.94+.06*Math.sin(i*1.7)); shades.push(c.r,c.g,c.b);
    }
    for(let r=0;r<rings.length-1;r++) for(let i=0;i<n;i++) { const a=r*(n+1)+i,b=a+n+1; indices.push(a,b,a+1,b,b+1,a+1); }
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3)); geo.setAttribute('color',new THREE.Float32BufferAttribute(shades,3)); geo.setIndex(indices); geo.computeVertexNormals();
    const bank=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide})); bank.name='Sloping pond bank'; bank.receiveShadow=true; g.add(bank);
    const shape=new THREE.Shape();
    for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,r=pondRadius179(a),x=Math.cos(a)*3.6*r,y=-Math.sin(a)*2.9*r;if(!i)shape.moveTo(x,y);else shape.lineTo(x,y);}
    const water=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshPhongMaterial({color:0x285c59,transparent:true,opacity:.68,shininess:65,specular:0x8dada5,side:THREE.DoubleSide,depthWrite:false})); water.rotation.x=-Math.PI/2; water.position.set(23.2,.8,32.1); water.name='Deep pond water';g.add(water);pond173.water=water;
    const stoneMats=[material(0x7b796d),material(0x918674),material(0x646c61)];
    for(let i=0;i<25;i++) {
      if(i>7&&i<13)continue; // Open shallow entrance, not a ring wall.
      const a=i/25*Math.PI*2,r=pondRadius179(a)*1.09,s=.24+(i%4)*.1;
      const stone=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),stoneMats[i%3]);stone.scale.set(s*1.5,s*.62,s);stone.position.set(23.2+Math.cos(a)*3.6*r,.86,32.1+Math.sin(a)*2.9*r);stone.rotation.set(.1,a,.12);stone.castShadow=true;stone.receiveShadow=true;g.add(stone);registerSolid62(stone);
    }
    const leafMat=material(0x587d3f),stemMat=material(0x697a42),tipMat=material(0x69513a);
    for(const [x,z] of [[20.4,33.3],[26.1,32.8]]) for(let j=0;j<9;j++) {
      const h=.48+(j%4)*.16,px=x+Math.sin(j*2.4)*.35,pz=z+Math.cos(j*2.4)*.3;
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(.013,.02,h,5),stemMat);stem.position.set(px,.8+h/2,pz);g.add(stem);
      const tip=new THREE.Mesh(new THREE.CylinderGeometry(.037,.037,.18,6),tipMat);tip.position.set(px,.8+h,pz);g.add(tip);
      const blade=new THREE.Mesh(new THREE.ConeGeometry(.055,h*.85,3),leafMat);blade.position.set(px+.07,.8+h*.35,pz);blade.rotation.z=.25;g.add(blade);
    }
    for(let i=0;i<12;i++) {
      const side=i<6?-1:1,x=23.2+side*(1.8+(i%3)*.25),z=32.1+.6+Math.sin(i*2.4)*.55;
      const pad=new THREE.Mesh(new THREE.CircleGeometry(.18+(i%3)*.025,14,.12,Math.PI*2-.3),leafMat);pad.rotation.x=-Math.PI/2;pad.rotation.z=i;pad.position.set(x,.815,z);g.add(pad);
    }
    const log=new THREE.Mesh(new THREE.CylinderGeometry(.23,.3,2.5,9),material(0x59452e));log.rotation.z=Math.PI/2;log.rotation.y=.42;log.position.set(20,.95,34.1);log.castShadow=true;g.add(log);registerSolid62(log);
    for(let i=0;i<7;i++) {
      const fish=new THREE.Group(),mat=material([0x9d7647,0x756c48,0x6d8580][i%3]);
      const body=new THREE.Mesh(new THREE.SphereGeometry(.1,10,6),mat);body.scale.set(1.7,.55,.7);fish.add(body);
      const tail=new THREE.Mesh(new THREE.ConeGeometry(.065,.12,3),mat);tail.rotation.z=Math.PI/2;tail.position.x=-.19;fish.add(tail);
      fish.userData={a:i*.86,r:.7+(i%4)*.52,speed:.16+(i%3)*.04,depth:.7+(i%3)*.45};g.add(fish);pond173.fish.push(fish);
    }
  }
  const controlBeforePond179=control;
  control=function(dt,options) {
    if(phase!=='scavenge'||!options?.ground)return controlBeforePond179(dt,options);
    const previous=options.ground;
    return controlBeforePond179(dt,{...options,ground:(x,z)=>{
      const a=Math.atan2((z-32.1)/2.9,(x-23.2)/3.6),q=pondDistance179(x,z)/pondRadius179(a);
      if(q>=1.52)return previous(x,z);
      if(q<1)return pondFloor180(x,z);
      return q<1.12?.8+(q-1)*.5:.86*(1-(q-1.12)/.4);
    }});
  };
  // Reproducible real-engine preview; does not change normal saved spawn.
  if(new URLSearchParams(location.search).has('pondPreview')) {
    const preview=document.createElement('button');preview.className='btn';preview.textContent='Preview pond';preview.style.cssText='position:fixed;top:12px;left:45%;z-index:200';
    preview.onclick=()=>{startScavenge();rat.position.set(23.2,0,26.3);gameCam.yaw=Math.PI;gameCam.pitch=.32;gameCam.distance=3.8;gameCam.ready=false;preview.remove();};document.body.appendChild(preview);
  }

})();
