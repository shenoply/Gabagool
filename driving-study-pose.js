/* Standalone pose study. Uses the original rat mesh and the actual car. */
(function(scope){
function solveArm203(THREE,rig,side,target,pole){
 const bones=rig.userData.pipBones,arm=bones[side+'Arm'],fore=bones[side+'ForeArm'],hand=bones[side+'Hand'];if(!arm||!fore||!hand)return;
 if(pole){
  rig.updateWorldMatrix(true,true);const V=()=>new THREE.Vector3(),a=arm.getWorldPosition(V()),e=fore.getWorldPosition(V()),w=hand.getWorldPosition(V()),l1=a.distanceTo(e),l2=e.distanceTo(w),direction=target.clone().sub(a),d=Math.max(.0001,Math.min(direction.length(),l1+l2-.00001));direction.normalize();const bend=pole.clone().sub(a);bend.addScaledVector(direction,-bend.dot(direction));if(bend.lengthSq()<1e-8)bend.set(0,-1,0);bend.normalize();const along=(l1*l1-l2*l2+d*d)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-along*along)),elbow=a.clone().addScaledVector(direction,along).addScaledVector(bend,height);
  const orient=(joint,end,goal)=>{rig.updateWorldMatrix(true,true);const origin=joint.getWorldPosition(V()),from=end.getWorldPosition(V()).sub(origin).normalize(),to=goal.clone().sub(origin).normalize(),delta=new THREE.Quaternion().setFromUnitVectors(from,to),world=joint.getWorldQuaternion(new THREE.Quaternion());joint.quaternion.copy(joint.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(delta.multiply(world))).normalize();joint.updateWorldMatrix(false,true);};orient(arm,fore,elbow);orient(fore,hand,a.clone().addScaledVector(direction,d));return hand.getWorldPosition(V()).distanceTo(target);
 }
 for(let i=0;i<18;i++){for(const bone of [fore,arm]){rig.updateWorldMatrix(true,true);const origin=bone.getWorldPosition(new THREE.Vector3()),from=hand.getWorldPosition(new THREE.Vector3()).sub(origin),to=target.clone().sub(origin);if(from.lengthSq()<1e-10||to.lengthSq()<1e-10)continue;const delta=new THREE.Quaternion().setFromUnitVectors(from.normalize(),to.normalize()),world=bone.getWorldQuaternion(new THREE.Quaternion());bone.quaternion.copy(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(delta.multiply(world))).normalize();bone.updateWorldMatrix(false,true);}if(hand.getWorldPosition(new THREE.Vector3()).distanceTo(target)<.001)break;}
 return hand.getWorldPosition(new THREE.Vector3()).distanceTo(target);
}
function grip220(g){g.traverse(m=>{if(!m.isSkinnedMesh||m.userData.grip220)return;const base=m.geometry,si=base.attributes.skinIndex,sw=base.attributes.skinWeight;if(!si||!sw)return;const ids=['Left','Right'].map(side=>m.skeleton.bones.indexOf(g.userData.pipBones[side+'Hand'])).filter(i=>i>=0);if(!ids.length)return;const geo=base.clone(),p=geo.attributes.position;for(const id of ids){const to=m.skeleton.boneInverses[id].clone().multiply(m.bindMatrix),back=to.clone().invert();for(let i=0;i<p.count;i++){let weight=0;for(let k=0;k<4;k++)if(si.array[i*4+k]===id)weight+=sw.array[i*4+k];if(weight<.01)continue;const original=new THREE.Vector3().fromBufferAttribute(base.attributes.position,i),v=original.clone().applyMatrix4(to);const blend=THREE.MathUtils.smoothstep(v.y,0,5)*Math.min(1,weight*1.5);v.x*=.58;v.y*=.68;v.z*=.55;if(v.y>4.0){const distance=v.y-4.0,radius=2.65,theta=Math.min(2.95,distance/radius);v.y=4.0+Math.sin(theta)*radius;v.z-=(1-Math.cos(theta))*radius;}v.applyMatrix4(back);original.lerp(v,blend);p.setXYZ(i,original.x,original.y,original.z);}}p.needsUpdate=true;geo.computeVertexNormals();m.userData.grip220={base,curled:geo};m.geometry=geo;});}

// Add local finger detail so curved contact does not leave long triangles crossing the wood.
function refineStudyPaws(model,detail=3){model.traverse(m=>{if(!m.isSkinnedMesh)return;const g=m.geometry,attrs=g.attributes,keys=Object.keys(attrs),out=Object.fromEntries(keys.map(k=>[k,[]])),ids=['Left','Right'].map(s=>m.skeleton.bones.indexOf(model.userData.pipBones[s+'Hand']));
 const vertex=i=>Object.fromEntries(keys.map(k=>[k,Array.from(attrs[k].array.slice(i*attrs[k].itemSize,(i+1)*attrs[k].itemSize))]));
 const middle=(a,b)=>{const v={};for(const k of keys)if(k!=='skinIndex'&&k!=='skinWeight')v[k]=a[k].map((x,j)=>(x+b[k][j])/2);const weights=new Map();for(const x of [a,b])x.skinIndex.forEach((id,j)=>weights.set(id,(weights.get(id)||0)+x.skinWeight[j]/2));const entries=[...weights].sort((a,b)=>b[1]-a[1]).slice(0,4);while(entries.length<4)entries.push([0,0]);const total=entries.reduce((n,x)=>n+x[1],0);v.skinIndex=entries.map(x=>x[0]);v.skinWeight=entries.map(x=>x[1]/total);return v;};
 const emit=(a,b,c,n)=>{if(n){const ab=middle(a,b),bc=middle(b,c),ca=middle(c,a);emit(a,ab,ca,n-1);emit(ab,b,bc,n-1);emit(ca,bc,c,n-1);emit(ab,bc,ca,n-1);}else for(const v of [a,b,c])for(const k of keys)out[k].push(...v[k]);};
 for(let i=0;i<(g.index?g.index.count:attrs.position.count);i+=3){const tri=[0,1,2].map(k=>vertex(g.index?g.index.getX(i+k):i+k));const hand=tri.some(v=>v.skinIndex.some((id,k)=>ids.includes(id)&&v.skinWeight[k]>.05));emit(...tri,hand?detail:0);}
 const refined=new THREE.BufferGeometry();for(const k of keys)refined.setAttribute(k,new THREE.BufferAttribute(new attrs[k].array.constructor(out[k]),attrs[k].itemSize,attrs[k].normalized));m.geometry=refined;
 });}
function createPipDrivingStudy(model,car,options={}){
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),bones={},rest={};
 model.position.set(0,0,0);model.rotation.set(0,0,0);model.scale.setScalar(1);car.add(model);
 model.traverse(o=>{if(o.isBone){bones[o.name]=o;rest[o.name]=o.quaternion.clone();}if(o.isMesh){o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;}});
 model.updateMatrixWorld(true);const bounds=new THREE.Box3();
 model.traverse(m=>{if(!m.isMesh)return;if(m.isSkinnedMesh)m.skeleton.update();const p=m.geometry.attributes.position;for(let i=0;i<p.count;i++){const v=V().fromBufferAttribute(p,i);if(m.isSkinnedMesh)m.boneTransform(i,v);m.localToWorld(v);model.worldToLocal(v);bounds.expandByPoint(v);}});
 model.scale.setScalar(.5/(bounds.max.y-bounds.min.y));model.updateMatrixWorld(true);
 const forward=bones.headfront.getWorldPosition(V()).sub(bones.Head.getWorldPosition(V())).applyQuaternion(car.getWorldQuaternion(new THREE.Quaternion()).invert());model.rotation.y=-Math.atan2(forward.x,forward.z);
 const rig={userData:{pipBones:bones},updateWorldMatrix:(a,b)=>model.updateWorldMatrix(a,b)};
 model.userData.pipBones=bones;grip220(model);refineStudyPaws(model,options.fast?2:3);
 const wheel=car.userData.wheel,centres={};wheel.position.z=-.125;wheel.position.y=.69;wheel.scale.setScalar(.65);wheel.rotation.x=.02;const column=car.getObjectByName('Steering column');column.geometry.dispose();column.geometry=new THREE.TubeGeometry(new THREE.LineCurve3(V(-.28,.43,.09),wheel.position.clone()),1,.009,10,false);
 car.traverse(o=>{if(o.name==='Cream seat cushion'){o.scale.z=.77;o.position.z=-.37;o.position.y=.345;}});

 function meshCentre(side){
  const hand=bones[side+'Hand'],sum=V();let count=0;model.updateMatrixWorld(true);
  model.traverse(m=>{if(!m.isSkinnedMesh)return;const id=m.skeleton.bones.indexOf(hand);if(id<0)return;m.skeleton.update();const p=m.geometry.attributes.position,si=m.geometry.attributes.skinIndex,sw=m.geometry.attributes.skinWeight;
   for(let i=0;i<p.count;i++){let w=0;for(let k=0;k<4;k++)if(si.array[i*4+k]===id)w+=sw.array[i*4+k];if(w<.8)continue;const v=V().fromBufferAttribute(p,i);m.boneTransform(i,v);v.applyMatrix4(m.matrixWorld);sum.add(v);count++;}
  });return count?sum.divideScalar(count):hand.getWorldPosition(V());
 }
 // Fit the curled paw around the rim cross-section while preserving its original texture.
 let rimReady=false;const paws=[];model.traverse(m=>{if(!m.isSkinnedMesh)return;const p=m.geometry.attributes.position,si=m.geometry.attributes.skinIndex,sw=m.geometry.attributes.skinWeight,ids=['Left','Right'].map(s=>m.skeleton.bones.indexOf(bones[s+'Hand'])),vertices=[];for(let i=0;i<p.count;i++){let w=0;for(let k=0;k<4;k++)if(ids.includes(si.array[i*4+k]))w+=sw.array[i*4+k];if(w>.05)vertices.push(i);}const groups=new Map();for(const i of vertices){const key=[...si.array.slice(i*4,i*4+4),...sw.array.slice(i*4,i*4+4)].join(',');if(!groups.has(key))groups.set(key,{indices:[],ids:Array.from(si.array.slice(i*4,i*4+4)),weights:Array.from(sw.array.slice(i*4,i*4+4))});groups.get(key).indices.push(i);}paws.push({m,vertices,groups:[...groups.values()],base:p.array.slice()});});
 function clearRim(){
  model.updateMatrixWorld(true);wheel.updateWorldMatrix(true,false);
  const point=V(),skin=new THREE.Matrix4(),bone=new THREE.Matrix4();
  for(const {m,groups}of paws){m.skeleton.update();const p=m.geometry.attributes.position,toWheel=wheel.matrixWorld.clone().invert().multiply(m.matrixWorld);
   // Subdivided paw vertices often share identical skin weights. Compute their
   // skin-to-wheel transform and inverse once per group, not once per vertex.
   for(const {indices,ids,weights}of groups){skin.elements.fill(0);for(let k=0;k<4;k++){if(!weights[k])continue;bone.fromArray(m.skeleton.boneMatrices,ids[k]*16);for(let j=0;j<16;j++)skin.elements[j]+=bone.elements[j]*weights[k];}
    const transform=toWheel.clone().multiply(m.bindMatrixInverse).multiply(skin).multiply(m.bindMatrix),inverse=transform.clone().invert();
    for(const i of indices){point.fromBufferAttribute(p,i).applyMatrix4(transform);const radial=Math.hypot(point.x,point.y),offset=radial-.095,clearance=.0132,d=Math.hypot(offset,point.z);if(d>=clearance)continue;
     const nr=d>1e-7?offset/d:0,nz=d>1e-7?point.z/d:-1,r=.095+nr*clearance;point.x*=r/radial;point.y*=r/radial;point.z=nz*clearance;point.applyMatrix4(inverse);p.setXYZ(i,point.x,point.y,point.z);
    }
   }p.needsUpdate=true;if(!options.fast||!rimReady){if(typeof smoothStudyNormals==='function')smoothStudyNormals(THREE,m.geometry);else m.geometry.computeVertexNormals();}
  }
 }
 function update(steering=0,reach=null){
  const reachWeight=reach?.weight||0;
  for(const {m,base}of paws){m.geometry.attributes.position.array.set(base);m.geometry.attributes.position.needsUpdate=true;}
  for(const [name,b]of Object.entries(bones))b.quaternion.copy(rest[name]);wheel.rotation.z=steering;
  for(const side of ['Left','Right']){bones[side+'UpLeg'].rotateX(-1.15);bones[side+'Leg'].rotateX(1.05);}
  bones.Spine.rotateX(.06);for(const [name,b]of Object.entries(bones))if(/Tail_/.test(name))b.rotateX(-.10);
  model.updateMatrixWorld(true);car.updateMatrixWorld(true);
  const hip=car.localToWorld(car.userData.seat.clone().add(V((reach?.kind==='radio'||reach?.kind==='volume')?Math.min(1,reachWeight*4)*.085:reachWeight*(reach?.side==='Right'?-.055:.025),.115,-.015+Math.abs(steering)*.025+reachWeight*.025))),actual=bones.Hips.getWorldPosition(V());model.position.add(car.worldToLocal(hip).sub(car.worldToLocal(actual)));model.updateMatrixWorld(true);
  if(reachWeight&&reach.target){const spine=bones.Hips,origin=spine.getWorldPosition(V()),direction=reach.target.clone().add(V(reach.kind==='volume'?.114:0,.13,0).applyQuaternion(car.getWorldQuaternion(new THREE.Quaternion()))).sub(origin).normalize(),up=V(0,1,0),delta=new THREE.Quaternion().setFromUnitVectors(up,direction),angle=2*Math.acos(Math.min(1,Math.abs(delta.w)));delta.slerp(new THREE.Quaternion(),1-reachWeight*Math.min(1,.6/Math.max(angle,.001)));const headWorld=bones.Head.getWorldQuaternion(new THREE.Quaternion());const world=spine.getWorldQuaternion(new THREE.Quaternion());spine.quaternion.copy(spine.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(delta.multiply(world)));model.updateMatrixWorld(true);bones.Head.quaternion.copy(bones.Head.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(headWorld));model.updateMatrixWorld(true);}
  for(const side of ['Left','Right']){
   const sign=car.worldToLocal(bones[side+'UpLeg'].getWorldPosition(V())).x<car.userData.seat.x?-1:1,legRig={userData:{pipBones:{[side+'Arm']:bones[side+'UpLeg'],[side+'ForeArm']:bones[side+'Leg'],[side+'Hand']:bones[side+'Foot']}},updateWorldMatrix:(a,b)=>model.updateWorldMatrix(a,b)};
   solveArm203(THREE,legRig,side,car.localToWorld(V(car.userData.seat.x+sign*.042,.295,-.14)),car.localToWorld(V(car.userData.seat.x+sign*.08,.31,.06)));
   const foot=bones[side+'Foot'],toe=bones[side+'ToeBase'];model.updateMatrixWorld(true);if(toe){const from=toe.getWorldPosition(V()).sub(foot.getWorldPosition(V())).normalize(),toward=V(0,0,1).transformDirection(car.matrixWorld),world=foot.getWorldQuaternion(new THREE.Quaternion());foot.quaternion.copy(foot.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(new THREE.Quaternion().setFromUnitVectors(from,toward).multiply(world)));}

  }
  const errors={};
  for(const side of ['Left','Right']){
   const arm=bones[side+'Arm'],hand=bones[side+'Hand'],sign=wheel.worldToLocal(arm.getWorldPosition(V())).x<0?-1:1;
   const desired=wheel.localToWorld(V(sign*.095,-.010,-.010)),pole=arm.getWorldPosition(V()).add(V(sign*.13,-.035,-.025).applyQuaternion(car.getWorldQuaternion(new THREE.Quaternion())));
   if(reachWeight&&reach.side===side&&reach.target)desired.lerp(reach.target,reachWeight);
   const basis=new THREE.Matrix4().makeBasis(V(0,sign,0),V(0,0,1),V(sign,0,0)),orientation=wheel.getWorldQuaternion(new THREE.Quaternion()).multiply(new THREE.Quaternion().setFromRotationMatrix(basis));
   for(let i=0;i<5;i++){
    hand.quaternion.copy(hand.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(orientation));model.updateMatrixWorld(true);
    const center=centres[side]?hand.localToWorld(centres[side].clone()):meshCentre(side);
    if(!centres[side])centres[side]=hand.worldToLocal(center.clone());
    const target=hand.getWorldPosition(V()).add(desired.clone().sub(center));solveArm203(THREE,rig,side,target,pole);
   }
   hand.quaternion.copy(hand.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(orientation));model.updateMatrixWorld(true);
   errors[side]=(options.fast&&centres[side]?hand.localToWorld(centres[side].clone()):meshCentre(side)).distanceTo(desired);
  }
  clearRim();rimReady=true;return errors;
 }
 update();return {model,bones,update};
}
scope.createPipDrivingStudy=createPipDrivingStudy;
})(typeof window!=='undefined'?window:globalThis);
