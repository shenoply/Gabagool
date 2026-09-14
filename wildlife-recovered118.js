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

  // Wild-gecko encounter: defeat it before it can be tamed and ridden.
  function strikeGecko141(kind) {
    const g = wildlife88?.gecko;
    if (!g?.battle141 || g.tamed || !rat) return;
    const offset = g.g.position.clone().sub(rat.position).setY(0);
    if (offset.length() > 1.6) return;
    const forward = new THREE.Vector3(Math.sin(rat.rotation.y), 0, Math.cos(rat.rotation.y));
    if (forward.dot(offset.normalize()) < -.25) return;
    const damage = kind === 'bite' ? 20 : 14;
    g.hp141 = Math.max(0, g.hp141 - damage);
    g.hit141 = .22;
    if (g.hp141 <= 0) {
      g.battle141 = false;
      g.tamed = true;
      save();
      sayToast('The gecko yields. It is tame now — press E to ride.');
    } else sayToast(`${kind === 'bite' ? 'Bite' : 'Tail whip'} landed · Gecko ${g.hp141}%`);
  }

  const biteBeforeGecko141 = doBite;
  doBite = function geckoBite141(...args) {
    const result = biteBeforeGecko141(...args);
    strikeGecko141('bite');
    return result;
  };
  const whipBeforeGecko141 = whip67;
  whip67 = function geckoWhip141(...args) {
    const result = whipBeforeGecko141(...args);
    strikeGecko141('whip');
    return result;
  };

  const geckoTickBeforeBattle141 = tickGecko88;
  tickGecko88 = function tickGeckoBattle141(dt, g) {
    if (g?.intro141 > 0) {
      g.intro141 -= dt;
      const face = rat.position.clone().sub(g.g.position).setY(0);
      if (face.lengthSq() > .001) turn88(g.g, Math.atan2(face.x, face.z), dt, 8);
      const pipFace = g.g.position.clone().sub(rat.position).setY(0);
      if (pipFace.lengthSq() > .001) turn88(rat, Math.atan2(pipFace.x, pipFace.z), dt, 8);
      // Every line gets its own close shot: Pip, Gecko, Pip, then Gecko.
      if (g.intro141 > 7.1) ui.sub.textContent = 'PIP: Easy now. I’m not your enemy.';
      else if (g.intro141 > 4.8) {
        ui.sub.textContent = 'GECKO: *A low hiss rattles through the yard.*';
        if (!g.hissed141) { g.hissed141 = true; sfx.hiss(); }
      } else if (g.intro141 > 2.4) ui.sub.textContent = 'PIP: Then show me what you’ve got.';
      else ui.sub.textContent = 'GECKO: *The gecko lowers itself, ready to strike.*';
      ui.sub.style.opacity = '1';
      if (g.intro141 <= 0) {
        ui.sub.style.opacity = '0';
        ui.sub.textContent = '';
        gameCam.ready = false;
        sayToast('Battle started — Bite and Tail Whip!');
      }
      return;
    }
    geckoTickBeforeBattle141(dt, g);
    if (!g?.battle141 || g.tamed || g.riding || !rat) return;
    g.cool141 = Math.max(0, (g.cool141 || 0) - dt);
    g.hit141 = Math.max(0, (g.hit141 || 0) - dt);
    const offset = rat.position.clone().sub(g.g.position).setY(0);
    const distance = offset.length();
    if (distance > 1.15) {
      offset.normalize();
      g.g.position.addScaledVector(offset, dt * .72);
      turn88(g.g, Math.atan2(offset.x, offset.z), dt, 6);
    }
    if (distance < 1.1 && g.cool141 <= 0 && !rat.userData.air) {
      g.cool141 = 2.4;
      const push = rat.position.clone().sub(g.g.position).setY(0).normalize();
      rat.position.addScaledVector(push, .55);
      ensureLife().stamina = Math.max(0, ensureLife().stamina - 9);
      sayToast('Gecko snap! Roll away or strike back.');
    }
  };

  const interactBeforeBattle141 = interactWildlife88;
  interactWildlife88 = function interactGeckoBattle141() {
    const near = wildlife88?.near;
    if (near?.type === 'gecko' && !near.obj.tamed) {
      const g = near.obj;
      if (!g.battle141) {
        g.battle141 = true;
        g.hp141 = 100;
        g.cool141 = 1.1;
        g.intro141 = 9.4;
        g.hissed141 = false;
        sayToast('Wild gecko battle!');
      }
      return true;
    }
    return interactBeforeBattle141();
  };

  const wildlifeTickBeforeBattle141 = tickWildlife88;
  tickWildlife88 = function wildlifeBattle141(dt) {
    wildlifeTickBeforeBattle141(dt);
    const g = wildlife88?.gecko;
    if (g?.battle141 && !g.tamed) {
      ui.prompt.style.display = 'block';
      ui.prompt.textContent = `WILD GECKO · ${g.hp141}% · Bite / Tail Whip`;
      $('padE').textContent = 'Battle';
    }
  };

  // Playground cinematic: a true shot/reverse-shot, rather than a single
  // distant overview. The camera only owns the view while dialogue is playing.
  const cameraBeforeGeckoIntro141 = tickGameplayCamera;
  tickGameplayCamera = function geckoIntroCamera141(dt) {
    const g = wildlife88?.gecko;
    if (!g?.intro141 || !rat) return cameraBeforeGeckoIntro141(dt);
    const pipShot = g.intro141 > 7.1 || (g.intro141 <= 4.8 && g.intro141 > 2.4);
    const subject = pipShot ? rat : g.g;
    const other = pipShot ? g.g : rat;
    const toOther = other.position.clone().sub(subject.position).setY(0);
    if (toOther.lengthSq() < .001) toOther.set(0, 0, 1);
    toOther.normalize();
    // Stand just in front and to the side of whoever is speaking, so their
    // face is visible and the other character stays in the background.
    const side = new THREE.Vector3(-toOther.z, 0, toOther.x);
    const target = subject.position.clone().add(new THREE.Vector3(0, pipShot ? .58 : .46, 0)).addScaledVector(toOther, .15);
    const desired = target.clone().addScaledVector(toOther, -2.15).addScaledVector(side, pipShot ? .78 : -.78).add(new THREE.Vector3(0, pipShot ? .52 : .38, 0));
    camera.position.lerp(desired, 1 - Math.exp(-dt * 8));
    camera.lookAt(target.clone().lerp(other.position.clone().add(new THREE.Vector3(0, .4, 0)), .12));
    $('cameraTools').style.display = 'none';
  };

  const controlBeforeGeckoIntro141 = control;
  control = function geckoIntroControl141(dt, options) {
    if (wildlife88?.gecko?.intro141 > 0) return 0;
    return controlBeforeGeckoIntro141(dt, options);
  };

  // Direct review link: enter the playground normally, then the opening
  // cinematic begins without having to find and press E on the gecko.
  if (new URLSearchParams(location.search).get('preview') === 'gecko') {
    let previewStarted141 = false;
    const startGeckoPreview141 = () => {
      const g = wildlife88?.gecko;
      if (previewStarted141 || phase !== 'scavenge' || !rat || !g) {
        if (!previewStarted141) setTimeout(startGeckoPreview141, 250);
        return;
      }
      previewStarted141 = true;
      g.tamed = false;
      g.riding = false;
      g.battle141 = true;
      g.hp141 = 100;
      g.cool141 = 1.1;
      g.intro141 = 9.4;
      g.hissed141 = false;
      gameCam.ready = false;
    };
    setTimeout(startGeckoPreview141, 250);
  }

})();
