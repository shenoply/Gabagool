/* A cockpit-sized, connected arm rig. Never render the world character through
   the driver's eye; mirrors retain the original character and seated animation. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),up=V(0,1,0);
 let owner=null,rig=null,arms=[],entry=null;
 const fur=new THREE.MeshStandardMaterial({color:0x697473,roughness:1});
 const skin=new THREE.MeshStandardMaterial({color:0xb98078,roughness:.92});
 function ellipsoid(parent,mat,size,name){const m=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),mat);m.scale.copy(size);m.name=name;parent.add(m);return m;}
 function rod(parent,mat,r,name){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.92,1,10),mat);m.name=name;parent.add(m);return m;}
 function connect(m,a,b){m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=a.distanceTo(b);m.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());}
 function attach(){
  if(owner===car77)return;rig?.parent?.remove(rig);owner=car77;if(!owner)return;
  rig=new THREE.Group();rig.name='Cockpit connected paws';owner.g.add(rig);rig.visible=false;arms=[];
  const belly=ellipsoid(rig,fur,V(.09,.10,.055),'Cockpit belly');belly.position.set(owner.seat.x,.24,-.34);
  for(const sign of [-1,1]){
   const upper=rod(rig,fur,.019,'Upper arm'),fore=rod(rig,fur,.016,'Forearm'),elbow=ellipsoid(rig,fur,V(.018,.019,.018),'Elbow');
   const paw=new THREE.Group();rig.add(paw);ellipsoid(paw,skin,V(.015,.023,.010),'Paw').position.set(0,0,-.010);
   // Four small fingers curl over and behind the wheel rim, with a thumb beneath.
   for(let i=0;i<4;i++){
    const points=[V((i-1.5)*.007,-.004,-.015),V((i-1.5)*.007,.011,-.016),V((i-1.5)*.007,.017,-.004),V((i-1.5)*.007,.008,.006)];
    const finger=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),10,.0032,6,false),skin);paw.add(finger);
   }
   ellipsoid(paw,skin,V(.005,.013,.005),'Thumb').position.set(-sign*.016,-.009,-.002);
   arms.push({sign,upper,fore,elbow,paw});
  }
 }
 function pose(){
  attach();if(!owner?.riding)return;owner.g.updateWorldMatrix(true,true);const c=owner;
  for(const a of arms){
   const shoulder=V(c.seat.x+a.sign*.09,.355,-.34);
   const target=c.g.worldToLocal(c.wheel.localToWorld(V(a.sign*.095,0,-.003)));
   const r=c.reach,weight=r?Math.max(0,Math.min(1,r.time/r.duration/.28,(1-r.time/r.duration)/.28)):0;
   if(r?.target&&a.sign===(r.side==='Right'?1:-1))target.lerp(c.g.worldToLocal(r.target.getWorldPosition(V())),weight);
   const elbow=shoulder.clone().lerp(target,.48);elbow.y-=.038;elbow.x+=a.sign*.025;
   connect(a.upper,shoulder,elbow);connect(a.fore,elbow,target);a.elbow.position.copy(elbow);a.paw.position.copy(target);
   a.paw.quaternion.copy(c.g.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(c.wheel.getWorldQuaternion(new THREE.Quaternion())));
   a.paw.rotation.z+=a.sign>0?-Math.PI/2:Math.PI/2;
  }
 }
 const enter=enterCar77;
 enterCar77=function(){
  if(entry)return false;const from=rat?.position.clone(),was=car77?.riding,result=enter();
  if(!was&&car77?.riding){
   const c=car77;entry={car:c,rat,from,time:0,duration:1.25};roadsterControls203.setView(0);
   c.cabin219.doors[0].open=true;c.cabin219.doors[0].value=1;keys={};joy.x=joy.z=0;
  }return result;
 };
 const controlBefore=controlCar77;
 controlCar77=function(dt,options={}){return controlBefore(dt,entry?{...options,locked:true}:options);};
 const make=makeRat;makeRat=function(){const g=make(),animate=g.animate;g.animate=function(...args){
  animate(...args);if(entry&&entry.rat===g&&entry.car.riding){
   const c=entry.car,t=Math.min(1,entry.time/entry.duration),seat=g.position.clone(),door=c.g.localToWorld(V(-.53,.03,-.25));
   if(t<.45)g.position.lerpVectors(entry.from,door,THREE.MathUtils.smoothstep(t,0,.45));
   else g.position.lerpVectors(door,seat,THREE.MathUtils.smoothstep(t,.45,1));
  }
 };return g;};
 const tick=tickWorld38;tickWorld38=function(dt){
  tick(dt);if(entry){if(car77!==entry.car||!car77.riding)entry=null;else{entry.time+=Math.min(dt,.05);if(entry.time>=entry.duration){car77.cabin219.doors[0].open=false;entry=null;roadsterControls203.setView(2);}}}
  pose();
 };
 // Nested mirror renders use the world rat. Only the main cockpit uses this rig.
 const render=renderer.render;renderer.render=function(s,cam){
  const use=s===scene&&cam===camera&&car77?.riding&&[1,2,3].includes(roadsterControls203.viewIndex);
  const wasRat=rat?.visible,wasRig=rig?.visible;
  if(rig)rig.visible=use;if(rat&&use)rat.visible=false;
  else if(rat&&s===scene&&car77?.riding)rat.visible=true;
  try{return render.call(this,s,cam);}finally{if(rat)rat.visible=wasRat;if(rig)rig.visible=wasRig;}
 };
 window.cockpit222={pose,get rig(){return rig;},get arms(){return arms;},get entering(){return !!entry;}};
})();
