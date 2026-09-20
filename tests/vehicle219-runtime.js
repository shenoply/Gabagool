(()=>{
 const check=(v,m)=>{if(!v)throw Error(m);};
 tutorial219.pause();closeModal();tickWorld38(.03);vehicle219.attach(car77);
 const c=car77,a=c.cabin219;
 check(a.doors.length===2&&a.mirrors.length===3,'Cabin parts missing');
 rat.position.copy(c.g.position).add(new THREE.Vector3(1,0,0));enterCar77();
 for(let i=0;i<90;i++)tickWorld38(1/60);
 check(!vehicle219.interlocked(),'Automatic entry door did not close');
 c.reach=null;c.steer=0;rat.animate(.016,0);console.log('Hand contact errors',c.handErrors203);
 for(const steer of [-1,0,1]){c.wheel.rotation.z=-steer*.55;rat.animate(.016,0);check(Object.values(c.handErrors203).every(e=>e<.012),'Hands cannot reach turning wheel');}
 c.wheel.rotation.z=0;
 vehicle219.toggle('door');for(let i=0;i<70;i++)tickWorld38(1/60);
 check(Math.abs(a.doors[0].pivot.rotation.y)>1&&vehicle219.interlocked(),'Door hinge/interlock');
 vehicle219.toggle('door');for(let i=0;i<70;i++)tickWorld38(1/60);
 vehicle219.toggle('roof');vehicle219.toggle('windows');for(let i=0;i<240;i++)tickWorld38(1/60);
 check(a.roofValue===1&&a.windowValue===1&&a.doors[0].glass.visible,'Roof and windows');
 check(vehicle219.adjustMirror(1,.22,-.12),'Mirror adjustment rejected');
 for(const index of [0,1,2]){vehicle219.adjustMirror(index,.22,-.12);c.reach.time=.8;rat.animate(.016,0);check(Object.values(c.handErrors203).every(e=>e<.012),'Mirror reach does not contact '+index);}
 for(let i=0;i<90;i++)tickWorld38(1/60);
 check(Math.abs(a.mirrors[1].pivot219.rotation.y-.22)<.002,'Mirror did not turn');
 check(vehicle219.data().mirrors[1].yaw===.22,'Mirror not saved');
 c.speed=0;exitCar77();c.ignition206=false;vehicle219.toggle('hood');for(let i=0;i<120;i++)tickWorld38(1/60);
 check(a.hood.rotation.x<-1.2,'Hood did not lift');
 rat.position.copy(c.g.localToWorld(new THREE.Vector3(0,0,1.02)));inv.oil219=1;vehicle219.data().oil=40;
 check(vehicle219.serviceStart('oil')===true,'Oil service failed');for(let i=0;i<240;i++){tickWorld38(1/60);rat.animate(1/60,0);}
 check(vehicle219.data().oil===100&&inv.oil219===0&&!vehicle219.service,'Oil service did not finish/consume');
 inv.spark219=1;inv.belt219=1;check(vehicle219.serviceStart('engine')===true,'Upgrade failed');for(let i=0;i<240;i++)tickWorld38(1/60);
 check(vehicle219.data().upgrades.engine&&inv.spark219===0&&vehicle219.tuning().power>1,'Upgrade no effect');
 inv.coolant219=1;vehicle219.data().coolant=40;vehicle219.data().temperature=80;check(vehicle219.serviceStart('coolant')!==true,'Hot coolant service allowed');
 tutorial219.start('foot',true);check(!tutorial219.next(),'Tutorial advanced without practice');tutorial219.record('move');check(tutorial219.next(),'Tutorial would not advance after action');check(tutorial219.progress.index===1,'Tutorial progress not retained');tutorial219.pause();tutorial219.start('foot');check(tutorial219.progress.index===1,'Tutorial resume lost');tutorial219.pause();
 report.vehicle219={hinges:true,windows:true,roof:true,mirrors:true,service:true,upgrade:true,tutorial:true};
})();
