(() => {
  let patched = false;

  function applyWildlifePatch() {
    if (patched || typeof wildlife88 === 'undefined' || typeof THREE === 'undefined') return;
    patched = true;

    styleCat88 = function styleCatSafe(a) {
      a.model.traverse(o => {
        if (!o.isMesh) return;
        const eye = /sphere|eye/i.test(o.name);
        o.material = new THREE.MeshStandardMaterial({
          color: eye ? 0x211712 : 0x8a654f,
          roughness: eye ? 0.32 : 0.96,
          metalness: 0,
          emissive: eye ? 0x120b07 : 0x000000,
          emissiveIntensity: eye ? 0.12 : 0,
          skinning: !!o.isSkinnedMesh,
          vertexColors: false
        });
      });
    };

    const originalSeed = seedWildlife88;
    seedWildlife88 = function seedWildlifeSafe() {
      originalSeed();
      const g = wildlife88.gecko;
      if (g && !g.safeSize95) {
        g.model.scale.multiplyScalar(1.22);
        g.safeSize95 = true;
      }
      const c = wildlife88.cat;
      if (c && !c.safeMaterial95) {
        styleCat88(c);
        c.safeMaterial95 = true;
      }
    };

    tickGecko88 = function tickGeckoSafe(dt, g) {
      g.clock += dt;
      g.mixer?.update(dt);
      const u = rat.userData;
      if (!g.safeSize95) {
        g.model.scale.multiplyScalar(1.22);
        g.safeSize95 = true;
      }
      if (g.riding) {
        g.g.position.set(rat.position.x, Math.max(0, rat.position.y - 0.02), rat.position.z);
        g.g.rotation.y = rat.rotation.y;
        g.model.rotation.y = Math.PI;
        u.geckoRide88 = true;
        u.seated41 = true;
        if (u.pipPivot) {
          u.pipPivot.position.y = 0.72;
          u.pipPivot.position.z = -0.08;
          u.pipPivot.rotation.x = -0.25 + Math.sin(g.clock * 5) * 0.025;
        }
        const moving = (u.vel || 0) > 0.08;
        play88(g, moving ? /walk/i : /idle/i);
        g.mixer.timeScale = moving ? 1.9 : 1;
        for (const side of ['Left', 'Right']) {
          rotateBone69(u, side + 'Arm', -0.48);
          rotateBone69(u, side + 'ForeArm', -0.42 + Math.sin(g.clock * 5) * 0.04);
        }
        return;
      }
      u.geckoRide88 = false;
      if (u.seated41) u.seated41 = false;
      if (g.tamed) {
        const desired = rat.position.clone().add(new THREE.Vector3(-Math.sin(rat.rotation.y) * 2.8, 0, -Math.cos(rat.rotation.y) * 2.8));
        const v = desired.sub(g.g.position);
        v.y = 0;
        if (v.length() > 1.3) {
          const gap = v.length();
          v.normalize();
          g.g.position.addScaledVector(v, dt * (gap > 5 ? 2.35 : 1.15));
          turn88(g.g, Math.atan2(v.x, v.z), dt, 7);
          play88(g, /walk/i);
          g.mixer.timeScale = 1.55;
        } else {
          play88(g, /idle/i);
          g.mixer.timeScale = 1;
        }
      } else {
        g.wander -= dt;
        if (g.wander <= 0) {
          g.wander = 3 + Math.random() * 4;
          g.target.set(8.1 + (Math.random() - 0.5) * 3, 0, 27.1 + (Math.random() - 0.5) * 3);
        }
        const v = g.target.clone().sub(g.g.position);
        v.y = 0;
        if (v.length() > 0.2) {
          v.normalize();
          g.g.position.addScaledVector(v, dt * 0.28);
          g.g.rotation.y = Math.atan2(v.x, v.z);
          play88(g, /walk/i);
        } else play88(g, /idle/i);
      }
    };

    tickCat88 = function tickCatSafe(dt, c) {
      c.clock += dt;
      c.cool = Math.max(0, c.cool - dt);
      c.mixer?.update(dt);
      c.wander -= dt;
      const d = Math.hypot(rat.position.x - c.g.position.x, rat.position.z - c.g.position.z);
      let target;
      let speed = 0.84;
      if (d < 5.5) {
        target = rat.position.clone();
        speed = d < 2.4 ? 2.3 : 1.75;
        play88(c, /run/i);
        c.mixer.timeScale = 2.8;
      } else {
        if (c.wander <= 0) {
          c.wander = 4 + Math.random() * 5;
          c.target.set(23.5 + (Math.random() - 0.5) * 6, 0, 15 + (Math.random() - 0.5) * 9);
        }
        target = c.target;
        play88(c, /walk/i);
        c.mixer.timeScale = 1.8;
      }
      const v = target.clone().sub(c.g.position);
      v.y = 0;
      if (v.length() > 0.35) {
        v.normalize();
        const next = c.g.position.clone().addScaledVector(v, dt * speed);
        if (next.x > 19 && next.x < 29 && next.z > 7 && next.z < 25) c.g.position.copy(next);
        turn88(c.g, Math.atan2(v.x, v.z), dt, 8);
      }
      if (d < 1.25 && c.cool === 0) {
        c.cool = 5;
        ensureLife().stamina = Math.max(0, ensureLife().stamina - 15);
        const away = rat.position.clone().sub(c.g.position).setY(0).normalize();
        rat.position.addScaledVector(away, 1);
        sfx.yowl();
        sayToast('The cat pounces — sprint away or use the fence routes!');
      }
    };

    tickRatNpc88 = function tickRatNpcSafe(dt, n) {
      n.clock += dt;
      n.wander -= dt;
      n.talking = Math.max(0, (n.talking || 0) - dt);
      if (n.talking) {
        n.walking = false;
        turn88(n.g, Math.atan2(rat.position.x - n.g.position.x, rat.position.z - n.g.position.z), dt, 3.2);
      } else {
        if (n.wander <= 0 || n.g.position.distanceTo(n.target) < 0.16) {
          n.wander = 1.4 + Math.random() * 2.2;
          const a = Math.random() * Math.PI * 2;
          const r = 0.9 + Math.random() * 1.6;
          n.target.set(n.home.x + Math.sin(a) * r, 0, n.home.z + Math.cos(a) * r);
        }
        const v = n.target.clone().sub(n.g.position);
        v.y = 0;
        n.walking = v.length() > 0.15;
        if (n.walking) {
          v.normalize();
          n.g.position.addScaledVector(v, dt * 0.52);
          turn88(n.g, Math.atan2(v.x, v.z), dt, 5.5);
        }
      }
      const stride = n.walking ? Math.sin(n.clock * 8.5) : 0;
      n.model.position.y = n.modelBaseY + (n.walking ? Math.abs(stride) * 0.035 : Math.sin(n.clock * 2) * 0.006);
      n.model.rotation.z = n.walking ? stride * 0.035 : 0;
    };

    const originalInteract = interactWildlife88;
    interactWildlife88 = function interactWildlifeSafe() {
      const x = wildlife88.near;
      if (x?.type === 'rat') x.obj.talking = 2.4;
      return originalInteract();
    };
  }

  const timer = setInterval(() => {
    try {
      applyWildlifePatch();
      if (patched) clearInterval(timer);
    } catch (error) {
      console.error('Wildlife patch waiting:', error);
    }
  }, 100);
})();