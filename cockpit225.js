/* Approved model-study cockpit, fitted to the live car without changing gameplay Pip. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);let pending=null,baseline=null,lastInside=false;
 function attach(c){
  if(!c||c.driver225||pending===c)return;pending=c;
  loadApprovedPip().then(asset=>{
   if(!asset||car77!==c){if(pending===c)pending=null;return;}
   vehicle219.attach(c);carTouch220.attach();
   detailRoadster225(THREE,c.g,c);
   const model=clonePipScene(asset.scene),mixer=new THREE.AnimationMixer(model),clip=asset.animations.find(a=>a.name==='Idle');if(clip){mixer.clipAction(clip).play();mixer.update(0);}
   const study=createPipDrivingStudy(model,c.g),bodies=[];model.name='Approved seated Pip';model.traverse(m=>{if(m.isSkinnedMesh)bodies.push(createStudyInsideBody(THREE,m));});model.visible=false;
   const cabin=createStudyCabin({THREE,car:c.g,renderer,camera,live:c,getMode:()=>c.riding&&!cockpit223.entering&&roadsterControls203.viewIndex>0?'cockpit':'outside',onStatus:sayToast});
   // The new instrument panel replaces all legacy dial overlays.
   for(const needle of c.gauges206||[]){needle.visible=false;}
   c.driver225={study,bodies,cabin,angle:null,reach:false,clock:0};pending=null;
  }).catch(e=>{pending=null;console.warn('Cockpit model unavailable',e);});
 }
 function update(dt){
  const c=car77;if(!c||c.owner!==root)return;attach(c);const d=c.driver225;if(!d)return;
  const active=c.riding&&!cockpit223.entering;d.study.model.visible=active;
  let reach=d.cabin.tick(Math.min(dt,.05),-c.steer*.55,Math.abs(c.speed)>.05);
  if(active&&roadsterControls203.viewIndex>0&&c.reach?.target){const r=c.reach,q=r.time/r.duration;reach={kind:r.kind,target:r.target,side:r.side||'Right',weight:Math.max(0,Math.min(1,q/.28,(1-q)/.28))};}
  const angle=-c.steer*.55;d.clock+=dt;
  if(active&&d.clock>=1/24&&(d.angle===null||Math.abs(d.angle-angle)>.001||reach||d.reach)){
   d.clock=0;d.bodies.forEach(b=>b.mesh.geometry=b.full);d.study.update(angle,reach);d.bodies.forEach(b=>b.sync());d.angle=angle;d.reach=!!reach;
  }
  // The wheel stays in sync even when the animation update is throttled.
  c.wheel.rotation.z=angle;
 }
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);update(dt);};
 const cam=tickGameplayCamera;tickGameplayCamera=function(dt){
  cam(dt);const c=car77,d=c?.driver225,inside=d&&c.riding&&!cockpit223.entering&&roadsterControls203.viewIndex>0&&!photo.active;
  if(!inside){lastInside=false;return;}if(!lastInside||baseline?.car!==c)baseline={car:c,yaw:gameCam.yaw,pitch:gameCam.pitch};lastInside=true;
  const yaw=THREE.MathUtils.clamp(gameCam.yaw-baseline.yaw,-1.5,1.5),pitch=THREE.MathUtils.clamp(gameCam.pitch-baseline.pitch+.30,-.45,1.35);
  d.study.model.updateWorldMatrix(true,true);const eye=d.study.bones.Head.getWorldPosition(V()).add(V(0,.022,.025).applyQuaternion(c.g.getWorldQuaternion(new THREE.Quaternion())));
  camera.position.copy(eye);const direction=V(Math.sin(yaw)*Math.cos(pitch),-Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).applyQuaternion(c.g.getWorldQuaternion(new THREE.Quaternion()));camera.lookAt(eye.add(direction));camera.near=.006;camera.fov=90;camera.updateProjectionMatrix();
 };
 const render=renderer.render;renderer.render=function(s,cam){
  const c=car77,d=c?.driver225,use=d&&c.riding&&!cockpit223.entering;
  if(!use)return render.call(this,s,cam);
  const visible=rat.visible;rat.visible=false;if(cockpit223.rig)cockpit223.rig.visible=false;
  d.bodies.forEach(b=>b.mesh.geometry=s===scene&&cam===camera&&roadsterControls203.viewIndex>0&&!photo.active?b.inside:b.full);
  try{return render.call(this,s,cam);}finally{rat.visible=visible;}
 };
 window.cockpit225={attach,update};
})();
