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

  // Rainyard Monitor den — a compact clay-stone hide, made as real game
  // geometry rather than a flat decoration. The entrance faces the path.
  function buildGeckoDen152() {
    const den = new THREE.Group();
    den.name = 'Rainyard Monitor clay-stone hide';
    den.position.set(5.95, 0, 29.35);
    const clay = [0x754735, 0x8c5940, 0x674233, 0x9a654a].map(color =>
      new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0 }));
    const moss = new THREE.MeshStandardMaterial({ color: 0x526c46, roughness: 1 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x130f0b, roughness: 1, side: THREE.BackSide });
    const soil = new THREE.MeshStandardMaterial({ color: 0x34281e, roughness: 1 });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(1.12, 16), soil);
    floor.rotation.x = -Math.PI / 2; floor.position.y = .012; den.add(floor);
    const interior = new THREE.Mesh(new THREE.SphereGeometry(.74, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), dark);
    interior.scale.set(1.13, .84, .88); interior.position.set(0, .15, .26); den.add(interior);
    const stone = (x, y, z, scale, colorIndex, turn = 0) => {
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(.34, 1), clay[colorIndex % clay.length]);
      m.position.set(x, y, z); m.scale.copy(scale); m.rotation.set(turn * .25, turn, turn * .18);
      m.castShadow = true; m.receiveShadow = true; den.add(m); return m;
    };
    // Low side walls and a rounded arch: deliberately imperfect hand-laid clay.
    [[-.67,.18,-.18,.82,.56,.74,0],[-.48,.48,-.16,.84,.66,.70,1],[.67,.18,-.18,.82,.56,.74,2],[.48,.48,-.16,.84,.66,.70,3],
      [-.40,.78,-.12,.82,.58,.62,1],[0,.87,-.14,.92,.58,.66,2],[.40,.78,-.12,.82,.58,.62,3],
      [-.72,.17,.42,.90,.58,.72,2],[-.46,.55,.45,.88,.64,.72,0],[0,.69,.49,1.05,.67,.82,1],[.46,.55,.45,.88,.64,.72,3],[.72,.17,.42,.90,.58,.72,1],
      [-.36,.76,.74,.88,.60,.65,0],[.36,.76,.74,.88,.60,.65,2]].forEach((p, i) => stone(p[0], p[1], p[2], new THREE.Vector3(p[3], p[4], p[5]), i, p[6]));
    // Wet moss patches grow only along the top and shaded outer stones.
    [[-.48,.60,.12,.22],[.44,.73,.24,.18],[0,.98,.15,.24],[-.72,.33,.30,.16],[.67,.31,.29,.15]].forEach(([x,y,z,s]) => {
      const patch = new THREE.Mesh(new THREE.SphereGeometry(s, 8, 5), moss);
      patch.scale.set(1,.22,.75); patch.position.set(x,y,z); patch.rotation.x=.18; den.add(patch);
    });
    for (const [x,z,h] of [[-.94,.42,.31],[-.82,.72,.22],[.92,.45,.28],[.78,.78,.18],[-.18,.95,.22]]) {
      const weed = new THREE.Mesh(new THREE.ConeGeometry(.025,.18+h,5), moss);
      weed.position.set(x,.11,z); weed.rotation.z=(x < 0 ? .24 : -.24); den.add(weed);
    }
    return den;
  }

  const seedWildlifeBeforeDen152 = seedWildlife88;
  seedWildlife88 = function seedWildlifeWithDen152() {
    const result = seedWildlifeBeforeDen152();
    if (phase === 'scavenge' && wildlife88?.owner === root && !wildlife88.den152) {
      wildlife88.den152 = buildGeckoDen152();
      root.add(wildlife88.den152);
    }
    return result;
  };

})();
