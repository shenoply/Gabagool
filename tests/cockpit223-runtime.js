(()=>{
 const check=(v,m)=>{if(!v)throw Error(m);};closeModal();tutorial219.pause();tickWorld38(.03);carTouch220.attach();const c=car77;
 check(vehicle219.data().condition>99&&carTouch220.parts.every(p=>vehicle219.data().parts220[p.id]?.installed!==false),'Parts reset failed');
 for(const side of [-1,1]){
  rat.position.copy(c.g.localToWorld(new THREE.Vector3(side*.75,0,-.25)));rat.userData.air=false;
  enterCar77();check(cockpit223.entering,'Entry missing');check(cockpit223.entry.side===(side>0?1:0),'Wrong door side');const from=rat.position.clone();rat.animate(1/60,0);check(rat.position.distanceTo(from)<.001,'First frame teleport');
  for(let i=0;i<310;i++){tickWorld38(1/60);rat.animate(1/60,0);}
  check(!cockpit223.entering&&roadsterControls203.viewIndex===0,'Must finish outside');check(!vehicle219.interlocked(),'Car stuck interlocked after entry');
  check(!vehicle219.adjustMirror(0,.2,.1),'Mirror adjusts outside');check(!$('handbrake223').hidden,'Handbrake hidden');
  c.ignition206=true;keys.w=true;for(let i=0;i<60;i++)controlCar77(1/60);keys.w=false;check(c.speed>.3,'Car cannot drive');c.speed=0;c.ignition206=false;
  roadsterControls203.setView(2);rat.animate(1/60,0);cockpit223.pose();check(cockpit223.meshes.length>0,'Original arm meshes missing');for(const {source,copy}of cockpit223.meshes){check(copy.geometry.index.count>100,'Empty arm geometry');check(copy.material===source.material,'Not original rat material');check(copy.skeleton===source.skeleton,'Not original skeleton');}
  for(const turn of [-.55,0,.55]){c.wheel.rotation.z=turn;rat.animate(1/60,0);check(c.handErrors203.Left<.015&&c.handErrors203.Right<.015,'Grip error '+JSON.stringify(c.handErrors203));}
  exitCar77();
 }
 tutorial219.pause();report.cockpit223={bothDoors:true,outsideDefault:true,partsReset:true,carAccelerates:true,texturedOriginalArms:true,handbrake:true,mirrorOutsideDisabled:true};
})();
