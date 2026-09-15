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
  const DEN_POS_155 = new THREE.Vector3(-18.75, 0, 24.75);
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
    if (!g.riding && g.denHome153) {
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
      rat.position.y = water.position.y - .58;
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

})();
