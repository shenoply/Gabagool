/* Shared lightweight smoking gesture for the live actor and isolated studio. */
function createPipSmoke227(THREE,parent){
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),g=new THREE.Group();g.name='Hand held cigarette';parent.add(g);
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.7});
 const part=(geo,c,p,owner=g)=>{const m=new THREE.Mesh(geo,mat(c));m.position.copy(p);m.userData.noInk=true;m.raycast=()=>{};owner.add(m);return m;};
 const cig=new THREE.Group();g.add(cig);
 for(const [len,z,c]of [[.016,.008,0xe5decc],[.006,-.003,0xac7845],[.002,.017,0x777570]]){const m=part(new THREE.CylinderGeometry(.0018,.0018,len,8),c,V(0,0,z),cig);m.rotation.x=Math.PI/2;}
 const ember=part(new THREE.SphereGeometry(.0019,8,6),0xd46426,V(0,0,.019),cig);ember.material.emissive.setHex(0xff4b12);
 const lighter=new THREE.Group();g.add(lighter);part(new THREE.BoxGeometry(.013,.022,.007),0xb5aa7e,V(),lighter);const flame=part(new THREE.SphereGeometry(1,8,6),0xffba4c,V(0,.019,0),lighter);flame.scale.set(.003,.007,.003);flame.material.emissive.setHex(0xffa020);
 const puffs=Array.from({length:12},()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,6,4),new THREE.MeshBasicMaterial({color:0xbac6bd,transparent:true,opacity:0,depthWrite:false}));m.visible=false;m.raycast=()=>{};g.add(m);return {m,age:3,v:V()};});let active=false,time=0,emit=0,lastTarget=null;const grips=new Map();
 function palm(model,bones,side){const hand=bones[side+'Hand'];if(!grips.has(hand)){const sum=V();let n=0;model.updateWorldMatrix(true,true);model.traverse(m=>{if(!m.isSkinnedMesh)return;const id=m.skeleton.bones.indexOf(hand),a=m.geometry.attributes;if(id<0)return;m.skeleton.update();for(let i=0;i<a.position.count;i++){let w=0;for(let k=0;k<4;k++)if(a.skinIndex.array[i*4+k]===id)w+=a.skinWeight.array[i*4+k];if(w<.8)continue;const v=V().fromBufferAttribute(a.position,i);m.boneTransform(i,v);sum.add(m.localToWorld(v));n++;}});grips.set(hand,n?hand.worldToLocal(sum.divideScalar(n)):V());}return hand.localToWorld(grips.get(hand).clone());}
 function start(){active=true;time=0;g.visible=true;puffs.forEach(p=>{p.age=3;p.m.visible=false;});}
 function stop(){active=false;g.visible=false;}
 function target(model,bones,space){model.updateWorldMatrix(true,true);const q=space.getWorldQuaternion(new THREE.Quaternion()),forward=V(0,0,1).applyQuaternion(q),side=V(1,0,0).applyQuaternion(q),mouth=(bones.headfront||bones.Head).getWorldPosition(V()).add(V(0,-.009,0)),rest=bones.Hips.getWorldPosition(V()).add(V(0,.10,0)).addScaledVector(forward,.105).addScaledVector(side,.105),cycle=Math.max(0,time-4.6)%8;
  const draw=time<4.6?0:THREE.MathUtils.smoothstep(cycle,0,.8)*(1-THREE.MathUtils.smoothstep(cycle,1.8,2.8));
  lastTarget={kind:'smoke',side:'Left',target:rest.lerp(mouth.clone().addScaledVector(forward,.008),draw),weight:THREE.MathUtils.smoothstep(time,0,.6),mouth,forward,q,draw};return lastTarget;
 }
 function pose(model,bones,space,dt,seated=false){if(!active)return;time+=Math.min(.05,dt);const r=target(model,bones,space),rig={userData:{pipBones:bones},updateWorldMatrix:(a,b)=>model.updateWorldMatrix(a,b)};
  const arm=bones.LeftArm.getWorldPosition(V()),hand=bones.LeftHand,orientation=hand.getWorldQuaternion(new THREE.Quaternion()),desired=palm(model,bones,'Left').lerp(r.target,r.weight);for(let i=0;i<3;i++){hand.quaternion.copy(hand.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(orientation));model.updateWorldMatrix(true,true);const target=hand.getWorldPosition(V()).add(desired.clone().sub(palm(model,bones,'Left')));solvePipArm227(THREE,rig,'Left',target,arm.clone().add(V(.04,-.08,0).applyQuaternion(r.q)));}hand.quaternion.copy(hand.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(orientation));
  model.updateWorldMatrix(true,true);const grip=palm(model,bones,'Left');cig.position.copy(g.worldToLocal(grip));cig.quaternion.copy(g.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(r.q));cig.visible=true;
  const lighting=time>1.0&&time<3.8,tip=cig.localToWorld(V(0,0,.019));lighter.visible=lighting;flame.visible=time>1.7&&time<3.2;
  if(lighting){const aim=palm(model,bones,'Right').lerp(tip.clone().add(V(0,-.019,0)),THREE.MathUtils.smoothstep(time,1,1.6));for(let i=0;i<2;i++){const target=bones.RightHand.getWorldPosition(V()).add(aim.clone().sub(palm(model,bones,'Right')));solvePipArm227(THREE,rig,'Right',target,bones.RightArm.getWorldPosition(V()).add(V(-.04,-.09,0).applyQuaternion(r.q)));model.updateWorldMatrix(true,true);}lighter.position.copy(g.worldToLocal(palm(model,bones,'Right')));lighter.quaternion.copy(cig.quaternion);}
  ember.material.emissiveIntensity=time>3.2?(r.draw>.7?2.3:.5):0;const cycle=Math.max(0,time-4.6)%8,exhale=time>4.6&&cycle>2.2&&cycle<3.7;emit+=dt;
  if(time>3.2&&emit>(exhale?.13:.42)){emit=0;const p=puffs.find(p=>p.age>=2);if(p){p.age=0;p.m.position.copy(g.worldToLocal((exhale?r.mouth:tip).clone()));p.v.copy(r.forward).multiplyScalar(exhale?.04:.005);p.v.y=.035;p.m.visible=true;}}
  for(const p of puffs){if(p.age>=2)continue;p.age+=dt;p.m.position.addScaledVector(p.v,dt);p.m.scale.setScalar(.003+p.age*.009);p.m.material.opacity=Math.max(0,.13*(1-p.age/2));p.m.visible=p.age<2;}
 }
 g.visible=false;return {g,cig,lighter,start,stop,target,pose,palm,get active(){return active;},get time(){return time;}};
}
// Sized from the original posed ear vertices, once per actor. No mesh scans per frame.
function createPipHeadphones227(THREE){const g=new THREE.Group();g.name='Pip ear-clearance headphones';g.userData.fits=new WeakMap();return g;}
function fitPipHeadphones228(THREE,g,model,bones){
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);model.updateWorldMatrix(true,true);
 const head=bones.Head.getWorldPosition(V()),forward=bones.headfront.getWorldPosition(V()).sub(head).normalize(),right=V().crossVectors(V(0,1,0),forward).normalize(),up=V().crossVectors(forward,right),basis=new THREE.Matrix4().makeBasis(right,up,forward);
 let fit=g.userData.fits.get(model);
 if(!fit){const ears=[new THREE.Box3(),new THREE.Box3()];model.traverse(m=>{if(!m.isSkinnedMesh)return;m.skeleton.update();const a=m.geometry.attributes,id=m.skeleton.bones.indexOf(bones.Head);for(let i=0;i<a.position.count;i++){let weight=0;for(let k=0;k<4;k++)if(a.skinIndex.array[i*4+k]===id)weight+=a.skinWeight.array[i*4+k];if(weight<.5)continue;const p=V().fromBufferAttribute(a.position,i);m.boneTransform(i,p);m.localToWorld(p).sub(head);const v=V(p.dot(right),p.dot(up),p.dot(forward));if(Math.abs(v.x)>.045&&v.y>.012&&v.z<.035)ears[v.x>0?1:0].expandByPoint(v);}});
  fit=ears.map((b,i)=>{if(b.isEmpty())b.set(V(i? .045:-.105,.02,-.06),V(i?.105:-.045,.105,.025));const center=b.getCenter(V()),size=b.getSize(V()),side=i?1:-1;return {side,earMin:b.min.clone(),earMax:b.max.clone(),x:(i?b.max.x:b.min.x)+side*.012,y:center.y,z:center.z,radius:Math.max(size.y,size.z)*.5+.009};});g.userData.fits.set(model,fit);
 }
 if(g.userData.actor!==model){while(g.children.length){const child=g.children[0];child.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});g.remove(child);}g.userData.actor=model;g.userData.fit=fit;
  const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:metalness?.35:.85});
  for(const f of fit){const cup=new THREE.Group();cup.name=f.side<0?'Left ear cup':'Right ear cup';cup.position.set(f.x,f.y,f.z);g.add(cup);
   const cushion=new THREE.Mesh(new THREE.TorusGeometry(f.radius-.005,.005,8,32),mat(0x242b25));cushion.rotation.y=Math.PI/2;cup.add(cushion);
   for(const [radius,depth,offset,color,metal]of [[f.radius,.006,.008,0x624029,0],[f.radius*.84,.002,.012,0xb69b62,.7],[f.radius*.73,.002,.014,0x654630,0]]){const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,depth,32),mat(color,metal));m.rotation.z=Math.PI/2;m.position.x=f.side*offset;cup.add(m);}
  }
  const [l,r]=fit,top=Math.max(l.earMax.y,r.earMax.y)+.034,curve=new THREE.CatmullRomCurve3([V(l.x,l.y,l.z),V(l.x*.94,top-.02,l.z),V(0,top,(l.z+r.z)*.5),V(r.x*.94,top-.02,r.z),V(r.x,r.y,r.z)]);const band=new THREE.Mesh(new THREE.TubeGeometry(curve,32,.0055,8,false),mat(0x292e29));band.name='Padded arch above ears';g.add(band);g.traverse(o=>{o.userData.noInk=true;o.raycast=()=>{};});
 }
 g.position.copy(head);g.quaternion.setFromRotationMatrix(basis);return fit;
}
