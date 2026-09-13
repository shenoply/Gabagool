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
    const stick = Math.hypot(joy?.x || 0, joy?.z || 0) > .08;
    const keyboard = !!(keys.w || keys.a || keys.s || keys.d ||
      keys.arrowup || keys.arrowdown || keys.arrowleft || keys.arrowright);
    const travelled = g.previous116.distanceToSquared(rat.position) > .000001;
    g.previous116.copy(rat.position);
    return stick || keyboard || travelled || (u.vel || 0) > .03;
  }

  function crawl116(g, moving) {
    const phase = g.clock * (moving ? 6.4 : 1.45);
    const strength = moving ? 1 : .10;
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
    const u = rat.userData;
    if (g.riding) {
      const moving = moving116(g);
      g.g.position.set(rat.position.x, Math.max(0, rat.position.y), rat.position.z);
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
    u.pipPivot.position.set(saddle.x, .9 + backHeight + 1.02, saddle.z);
    u.pipPivot.rotation.set(-.08, 0, 0);
    u.pipPivot.scale.setScalar(.92);
    const pose = {
      Spine: [-.08, 0, 0], Spine01: [-.05, 0, 0],
      // A real riding pose: hips lifted, thighs spread around the lizard's
      // shoulders, then knees bent down along both sides of its body.
      LeftUpLeg: [-1.30, 0, -.88], RightUpLeg: [-1.30, 0, .88],
      LeftLeg: [1.55, 0, 0], RightLeg: [1.55, 0, 0],
      LeftFoot: [-.26, 0, 0], RightFoot: [-.26, 0, 0],
      // Reach forward as if holding onto the neck/shoulders, rather than
      // holding the arms straight out to the sides.
      LeftArm: [.94, 0, -.26], RightArm: [.94, 0, .26],
      LeftForeArm: [.52, 0, -.08], RightForeArm: [.52, 0, .08]
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
    const gripBase = saddleWorld.addScaledVector(forward, .48).add(new THREE.Vector3(0, .04, 0));
    armReach73(u, 'Left', gripBase.clone().addScaledVector(side, .19));
    armReach73(u, 'Right', gripBase.clone().addScaledVector(side, -.19));
  }

  const originalModels116 = tickModels44;
  tickModels44 = function tickModelsRecovered116(dt) {
    originalModels116(dt);
    seatPip116();
  };
})();
