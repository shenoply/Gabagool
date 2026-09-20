(()=>{
 const check=(x,m)=>{if(!x)throw Error(m);};closeModal();tutorial219.pause();tickWorld38(.03);carTouch220.attach();const c=car77,a=c.cabin219;
 check(!$('workshop219'),'Workshop still covers car');
 rat.position.copy(c.g.position).add(new THREE.Vector3(1,0,0));tutorial219.start('service');enterCar77();check(c.riding&&tutorial219.progress.chapter==='car','Service tutorial blocks car tutorial');
 carTouch220.renderUI();check(!$('exitCar220').hidden,'Exit button missing');
 for(let i=0;i<70;i++)tickWorld38(1/60);
 c.reach=null;roadsterControls203.setView(2);for(const turn of [-1,0,1]){c.wheel.rotation.z=turn*.55;rat.animate(.016,0);for(const side of ['Left','Right']){const b=rat.userData.pipBones;check(c.handErrors203[side]<.012,'Wheel reach '+side);check(b[side+'ForeArm'].getWorldPosition(new THREE.Vector3()).y<b[side+'Arm'].getWorldPosition(new THREE.Vector3()).y+.003,'Elbow flips above shoulder');}}
 let gripCount=0;rat.traverse(m=>{if(m.userData.grip220){gripCount++;check(m.geometry!==m.userData.grip220.base,'Grip mesh not applied');}});check(gripCount>0,'Paws remain flat');
 c.wheel.rotation.z=0;const door=carTouch220.targets.find(t=>t.id==='door0');camera.position.copy(c.g.localToWorld(new THREE.Vector3(c.seat.x,.5,-.25)));camera.lookAt(door.anchor.getWorldPosition(new THREE.Vector3()));camera.updateMatrixWorld(true);check(carTouch220.current()?.id==='door0','Looking at handle does not expose exit');
 c.speed=0;exitCar77();check(!c.riding,'Cannot exit');rat.traverse(m=>check(!m.userData.grip220,'Driving hand deformation leaked into walking'));
 c.ignition206=false;rat.position.copy(c.g.localToWorld(new THREE.Vector3(0,0,1.02)));if(!a.hoodOpen)vehicle219.toggle('hood');for(let i=0;i<100;i++)tickWorld38(1/60);
 const p=carTouch220.parts.find(p=>p.id==='radiator');check(carTouch220.pickup(p),'Cannot hold radiator');check(carTouch220.held?.part===p&&p.mesh.parent===root,'Part did not detach');check(vehicle219.interlocked(),'Missing part allows driving');
 enterCar77();check(!c.riding,'Entered while holding part');rat.animate(.016,0);check(p.mesh.getWorldPosition(new THREE.Vector3()).distanceTo(rat.userData.pipBones.LeftHand.getWorldPosition(new THREE.Vector3()))<.001,'Held part does not follow hand');
 carTouch220.drop();check(!carTouch220.held&&vehicle219.data().parts220.radiator.installed===false,'Dropped part not saved');check(carTouch220.pickup(p),'Cannot pick dropped part back up');check(carTouch220.refit(p),'Cannot refit held part');check(p.mesh.parent===p.parent&&vehicle219.data().parts220.radiator.installed,'Refit transform/state');
 const filter=carTouch220.parts.find(p=>p.id==='filter');const saved=rat.position.clone();rat.position.set(20,0,20);check(!carTouch220.pickup(filter),'Can interact across map');rat.position.copy(saved);
 tutorial219.pause();report.carTouch220={carTutorial:true,noWorkshop:true,exit:true,handleLook:true,curledPaws:true,elbowPole:true,pickupCarryDropRefit:true,rangeGate:true};
})();
