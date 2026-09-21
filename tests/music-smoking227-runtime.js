(async()=>{
const check=(v,m)=>{if(!v)throw Error(m);};
check(music227.source===null&&!piano.enabled,'Music started automatically');
voiceOn=true;music69.unlocked=true;musicTick69();check(!piano.enabled&&music227.source===null,'Unlock starts songs');
tickWorld38(.2);check(music227.pickups.length===11,'Missing world collectibles');
const headphones=music227.pickups.find(p=>p.id==='headphones227');rat.position.copy(headphones.g.position);tickWorld38(.2);grab();check(home.music227.headphones&&!home.music227.wear&&music227.source===null,'Headset pickup auto-started or failed');
const record=music227.pickups.find(p=>p.id==='record1');rat.position.copy(record.g.position);tickWorld38(.2);grab();check(home.music227.records.record1&&!record.g.visible,'Vinyl pickup failed');
const savedCount=Object.keys(home.music227.records).length;grab();check(Object.keys(home.music227.records).length===savedCount,'Duplicate record');
music227.start('headphones',6);check(music227.source==='headphones'&&music69.index===6&&piano.enabled,'Found record cannot play through headphones');
music227.stop();music227.start('headphones',7);check(music227.source===null,'Unfound record played');
music227.start('headphones');sewer211.enter('yard');tickWorld38(.2);check(music227.source==='headphones','Headphones lost on travel');music227.stop();sewer211.exit('yard');tickWorld38(.2);check(music227.source===null&&!piano.enabled,'Sewer exit auto-started music');
check(!music227.pickups.find(p=>p.id==='record1').g.visible,'Collected record respawned');
carTouch220.attach();cockpit225.update(.05);await Promise.resolve();rat.userData.job67=null;rat.position.copy(car77.g.position).add(new THREE.Vector3(-.55,0,-.2));enterCar77();for(let i=0;i<85;i++){tickWorld38(.05);rat.animate(.05,0);}check(car77.riding&&!cockpit223.entering,'Cannot enter car');
const driver=car77.driver225;check(driver,'Driver missing');
car77.speed=0;driver.cabin.activate('volume');check(music227.source==='car'&&music69.index<6,'Car radio not connected');for(let i=0;i<40;i++)cockpit225.update(.05);
pipSmoke205.toggle();check(pipSmoke205.state?.active,'Smoking not started');
for(let i=0;i<150;i++)cockpit225.update(.05);
const smoke=pipSmoke205.state;check(smoke&&smoke.time>5,'Visible driver smoking did not advance');
const wrist=driver.study.bones.LeftHand.getWorldPosition(new THREE.Vector3()),cig=smoke.cig.getWorldPosition(new THREE.Vector3());check(wrist.distanceTo(cig)<.03,'Cigarette detached from hand');
for(const b of Object.values(driver.study.bones))check(b.quaternion.toArray().every(Number.isFinite),'Invalid smoking bone');
pipSmoke205.toggle();check(!pipSmoke205.state,'Smoking did not stop');cockpit225.update(.05);
car77.speed=0;exitCar77();for(let i=0;i<90;i++)tickWorld38(.05);musicTick69();check(music227.source===null,'Car radio follows rat outside');
rat.userData.air=false;rat.userData.swim66=false;rat.userData.job67=null;pipSmoke205.toggle();for(let i=0;i<100;i++)rat.animate(.05,0);check(pipSmoke205.state?.time>4,'On-foot smoke failed');pipSmoke205.dispose();
report.music227={manualStart:true,headphonesSaved:true,recordsSaved:true,lockedRecords:true,sewerNoAutoplay:true,carRadio:true};report.smoking227={carActor:true,onFoot:true,cigaretteHeld:true,finiteBones:true};
})()
