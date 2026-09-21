(async()=>{
const check225=(ok,msg)=>{if(!ok)throw Error(msg);};
carTouch220.attach();cockpit225.update(.05);await Promise.resolve();
check225(!!car77.driver225,'Approved driver not attached');
const d225=car77.driver225;
check225(!!car77.g.getObjectByName('Fitted wool carpet'),'Carpet missing');
check225(carTouch220.parts.every(p=>vehicle219.data().parts220[p.id]?.installed!==false&&p.mesh.parent===p.parent),'Reset did not restore parts');
check225(vehicle219.data().resetRevision225===225,'Missing saved reset revision');
rat.position.copy(car77.g.position).add(new THREE.Vector3(-.55,0,-.2));rat.userData.job67=null;enterCar77();
for(let i=0;i<85;i++){tickWorld38(.05);rat.animate(.05,0);}
check225(!cockpit223.entering&&car77.riding,'Entry unfinished');
check225(roadsterControls203.viewIndex===2,'Default view not cockpit');
tickGameplayCamera(.016);renderer.render(scene,camera);
check225(d225.bodies.every(b=>b.mesh.geometry===b.inside),'First person body not selected');
check225(!vehicle219.interlocked(),'Restored car still interlocked');
if(!car77.ignition206)motoring206.ignition();keys.w=true;
for(let i=0;i<40;i++)controlCar77(.05);keys.w=false;
check225(car77.speed>.2,'Restored engine cannot drive');
for(let i=0;i<20;i++)cockpit225.update(.05);
check225(d225.cabin.needles[0].pivot.rotation.z<2.3,'Speed needle not responding');
car77.speed=0;car77.ignition206=false;
d225.cabin.activate('window');for(let i=0;i<40;i++)cockpit225.update(.05);
check225(vehicle219.data().windows===true,'Cabin window not connected');
for(const angle of [-.3,0,.3]){d225.bodies.forEach(b=>b.mesh.geometry=b.full);const errors=d225.study.update(angle);d225.bodies.forEach(b=>b.sync());check225(Object.values(errors).every(e=>Number.isFinite(e)&&e<.04),'Grip too far away '+JSON.stringify(errors));}
roadsterControls203.setView(0);renderer.render(scene,camera);check225(d225.bodies.every(b=>b.mesh.geometry===b.full),'Outside body not restored');
car77.speed=0;exitCar77();cockpit225.update(.05);check225(!d225.study.model.visible,'Seated duplicate after exit');
// Simulate an older save with a broken engine and missing components.
vehicle219.data().resetRevision225=224;vehicle219.data().parts220={radiator:{installed:false,position:[2,0,2]},wheel0:{installed:false,position:[2,0,2]}};vehicle219.data().condition=0;vehicle219.data().oil=0;vehicle219.data().upgrades.engine=true;
const inventory225=JSON.stringify(inv);startScavenge();await Promise.resolve();carTouch220.attach();cockpit225.update(.05);await Promise.resolve();
check225(vehicle219.data().condition===100&&vehicle219.data().oil===100,'Old engine save not repaired');
check225(carTouch220.parts.every(p=>p.mesh.parent===p.parent),'Old missing parts not remounted');
check225(JSON.stringify(inv)===inventory225&&vehicle219.data().upgrades.engine,'Reset lost inventory or upgrades');
check225(!vehicle219.interlocked(),'Migrated car blocked');
report.cockpit225={carpet:true,partsReset:true,engineDrives:true,windowWorks:true,firstPersonBody:true,grip:true};

})()