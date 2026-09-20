/* Use Pip's original textured, skinned arms; stage entry at the nearest door. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 let owner=null,model=null,rig=null,meshes=[],entry=null;
 function build(){
  if(owner===car77&&model===rat?.userData.approvedPip)return;
  if(rig){for(const {copy}of meshes)copy.geometry.dispose();rig.parent?.remove(rig);}
  owner=car77;model=rat?.userData.approvedPip;meshes=[];if(!owner||!model)return;
  rig=new THREE.Group();rig.name='Pip original cockpit arms';scene.add(rig);rig.visible=false;
  rat.traverse(source=>{
   if(!source.isSkinnedMesh)return;
   // Start from the original mesh, preserving its UVs, fur and pink-paw texture.
   const geo=source.geometry.clone(),si=geo.attributes.skinIndex,sw=geo.attributes.skinWeight,keep=[];
   const ids=new Set(),roots=['LeftArm','RightArm'].map(k=>rat.userData.pipBones[k]);source.skeleton.bones.forEach((b,i)=>{for(let p=b;p;p=p.parent)if(roots.includes(p)){ids.add(i);break;}});
   const arm=i=>{let w=0;for(let k=0;k<4;k++)if(ids.has(si.array[i*4+k]))w+=sw.array[i*4+k];return w>.7;};
   for(let i=0;i<(geo.index?.count||geo.attributes.position.count);i+=3){const tri=[0,1,2].map(k=>geo.index?geo.index.getX(i+k):i+k);if(tri.every(arm))keep.push(...tri);}
   if(!keep.length){geo.dispose();return;}geo.setIndex(keep);geo.clearGroups();const copy=new THREE.SkinnedMesh(geo,source.material);copy.skeleton=source.skeleton;copy.bindMatrix.copy(source.bindMatrix);copy.bindMatrixInverse.copy(source.bindMatrixInverse);copy.bindMode=source.bindMode;copy.matrixAutoUpdate=false;copy.frustumCulled=false;rig.add(copy);meshes.push({source,copy});
  });
 }
 function pose(){build();if(!rig)return;for(const {source,copy}of meshes){source.updateWorldMatrix(true,false);copy.matrix.copy(source.matrixWorld);copy.matrixWorld.copy(source.matrixWorld);copy.bindMatrixInverse.copy(source.bindMatrixInverse);if(copy.userData.sourceGeometry223!==source.geometry){copy.geometry.attributes.position.copy(source.geometry.attributes.position);copy.geometry.attributes.position.needsUpdate=true;copy.geometry.attributes.normal.copy(source.geometry.attributes.normal);copy.geometry.attributes.normal.needsUpdate=true;copy.userData.sourceGeometry223=source.geometry;}}}
 const baseEnter=enterCar77;enterCar77=function(){
  if(entry||car77?.riding)return false;if(window.carTouch220?.held)return baseEnter();
  const c=car77;if(!c||!rat)return false;vehicle219.attach(c);
  const from=rat.position.clone(),local=c.g.worldToLocal(from.clone()),side=local.x>=0?1:0;
  const oldDoor=c.cabin219.doors.map(d=>({open:d.open,value:d.value})),result=baseEnter();
  if(c.riding){roadsterControls203.setView(0);c.cabin219.doors.forEach((d,i)=>Object.assign(d,oldDoor[i]));entry={c,g:rat,from,side,time:0,door:c.g.localToWorld(V(side?.56:-.56,0,-.26))};keys={};joy.x=joy.z=0;}
  return result;
 };
 const control=controlCar77;controlCar77=function(dt,options={}){return control(dt,entry?{...options,locked:true}:options);};
 const make=makeRat;makeRat=function(){const g=make(),animate=g.animate;g.animate=function(...args){
  animate(...args);if(!entry||entry.g!==g)return;
  const e=entry,c=e.c,t=e.time,b=g.userData.pipBones,rest=g.userData.pipRest,seat=g.position.clone(),sign=e.side?1:-1;
  const passenger=seat.clone().add(V(e.side?.392:0,0,0).applyAxisAngle(V(0,1,0),c.g.rotation.y));
  if(t<.6)g.position.lerpVectors(e.from,e.door,THREE.MathUtils.smoothstep(t,0,.6));
  else if(t<1.35)g.position.copy(e.door);
  else if(t<2.3){g.position.lerpVectors(e.door,passenger,THREE.MathUtils.smoothstep(t,1.35,2.3));g.position.y+=Math.sin((t-1.35)/.95*Math.PI)*.07;}
  else g.position.lerpVectors(passenger,seat,THREE.MathUtils.smoothstep(t,2.3,2.9));
  if(t<2.3&&b){const walking=t<.6||t>1.35,wave=walking?Math.sin(t*12):0;
   for(const s of ['Left','Right'])for(const part of ['Arm','ForeArm','UpLeg','Leg']){const key=s+part;if(!b[key]||!rest[key])continue;b[key].quaternion.copy(rest[key]);const phase=wave*(s==='Left'?1:-1);b[key].rotateX(part==='UpLeg'?phase*.5:part==='Leg'?Math.max(0,-phase)*.7:part==='Arm'?-phase*.3:-.25);}
   g.rotation.y=c.g.rotation.y-sign*Math.PI/2*(1-THREE.MathUtils.smoothstep(t,1.8,2.3));g.updateWorldMatrix(true,true);
   if(t>=.6&&t<1.35){const s=e.side?'Left':'Right',hand=b[s+'Hand'],arm=b[s+'Arm'];if(hand&&arm){const target=carTouch220.targets.find(k=>k.id==='door'+e.side).anchor.getWorldPosition(V()),origin=arm.getWorldPosition(V());target.sub(origin).clampLength(0,.095).add(origin);solveArm203(THREE,g,s,target,origin.clone().add(V(0,-.1,0)));}}
  }
 };return g;};
 const handbrake=document.createElement('button');handbrake.id='handbrake223';handbrake.textContent='Handbrake';handbrake.onclick=()=>{roadsterControls203.handbrake();tutorial219.record('handbrake');};cockpit205.hud.insertBefore(handbrake,$('outsideView221'));
 const style=document.createElement('style');style.textContent='#handbrake223{height:40px;min-height:40px;flex:0 0 40px;border-radius:12px;border:1px solid #d1ba8355;background:#203d34e8;color:#f1dfb8;font:600 12px system-ui}#handbrake223[aria-pressed=true]{background:#d8bd88;color:#243c30}';document.head.appendChild(style);
 const tick=tickWorld38;tickWorld38=function(dt){
  tick(dt);
  if(entry){const e=entry;if(car77!==e.c||!e.c.riding){entry=null;}else if(gameplayActive()){
   e.time+=Math.min(dt,.05);if(e.time>=.6)e.c.cabin219.doors[e.side].open=e.time<2.9;if(e.time>=2.9)e.c.cabin219.doors.forEach(d=>d.open=false);
   if(e.time>=3.9){e.c.cabin219.doors.forEach(d=>d.open=false);entry=null;roadsterControls203.setView(0);tutorial219.start('car');}
  }}
  if(car77?.riding&&roadsterControls203.viewIndex===0)car77.reach=null;
  handbrake.textContent=car77?.handbrake?'Release handbrake':'Handbrake';handbrake.setAttribute('aria-pressed',String(!!car77?.handbrake));
  pose();
 };
 const render=renderer.render;renderer.render=function(s,cam){
  const use=s===scene&&cam===camera&&car77?.riding&&[1,2,3].includes(roadsterControls203.viewIndex);
  const rv=rat?.visible,gv=rig?.visible;if(rig)rig.visible=use;if(rat&&use)rat.visible=false;else if(rat&&s===scene&&car77?.riding)rat.visible=true;
  try{return render.call(this,s,cam);}finally{if(rat)rat.visible=rv;if(rig)rig.visible=gv;}
 };
 window.cockpit223={pose,get rig(){return rig;},get meshes(){return meshes;},get entering(){return !!entry;},get entry(){return entry;}};
})();
