(()=>{
 const check=(v,m)=>{if(!v)throw Error(m);};closeModal();tutorial219.pause();tickWorld38(.03);carTouch220.attach();const c=car77;rat.position.copy(c.g.position).add(new THREE.Vector3(-.7,0,0));c.cabin219.doors[0].open=true;const before=rat.position.clone();enterCar77();check(cockpit222.entering,'Entry animation missing');check(roadsterControls203.viewIndex===0,'Instant cockpit teleport');rat.animate(.016,0);check(rat.position.distanceTo(before)<.001,'Entry snaps on first frame');for(let i=0;i<90;i++){tickWorld38(1/60);rat.animate(1/60,0);}check(!cockpit222.entering&&roadsterControls203.viewIndex===2,'Entry does not finish in cockpit');
 for(const steer of [-.55,0,.55]){c.wheel.rotation.z=steer;cockpit222.pose();for(const a of cockpit222.arms){const target=c.g.worldToLocal(c.wheel.localToWorld(new THREE.Vector3(a.sign*.095,0,-.003)));check(a.paw.position.distanceTo(target)<.001,'Paw leaves wheel');check(a.fore.scale.y<.5,'Exploding arm');}}
 check(carTouch220.parts.every(p=>p.slot.material.visible===false),'Wireframe placeholders visible');
 c.speed=0;exitCar77();report.cockpit222={animatedEntry:true,defaultCockpit:true,gripTracksWheel:true,invisibleMountTargets:true};
})();
