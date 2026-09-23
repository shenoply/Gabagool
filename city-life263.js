/* Build 263: imported animated city pedestrians and realistic gulls. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 let owner=null,people=[],gulls=[],loading=null,assets=null;

 function loadLife263(){
  if(loading)return loading;
  const loader=new THREE.GLTFLoader(),load=url=>new Promise((resolve,reject)=>loader.load(url,resolve,undefined,reject));
  loading=Promise.all([
   load('https://cdn.3dassets.dev/assets/32901/v1/model.glb'),
   load('https://cdn.3dassets.dev/assets/35400/v1/model.glb')
  ]).then(([human,gull])=>assets={human,gull}).catch(e=>{console.warn('City life assets failed',e);return null;});
  return loading;
 }

 function neutraliseHuman263(model,index){
  const tones=[new THREE.Color(0x56606a),new THREE.Color(0x6f6559),new THREE.Color(0x46584f)];
  model.traverse(o=>{
   if(/weapon|rifle|carbine|knife|blade|holster|ammo|magazine/i.test(o.name||'')){o.visible=false;return;}
   if(o.isMesh){
    o.castShadow=false;o.receiveShadow=true;o.userData.noInk=true;
    if(o.material){o.material=o.material.clone();if(o.material.color)o.material.color.lerp(tones[index%tones.length],.22);}
   }
  });
 }

 function openSide263(side,z){
  const col=city204.state?.collision;if(!col)return 0;const b=col.bounds,cx=(b.min.x+b.max.x)/2;
  for(const d of [10,12,14,16,18,20,22]){
   const x=cx+side*d;if(x<b.min.x+2||x>b.max.x-2)continue;
   if(!col.blocked({x,z},.65))return x;
  }
  return cx+side*9;
 }

 function seedPeople263(){
  const state=city204.state;if(!assets?.human||!state?.collision||state.owner!==root||people.length)return;
  const b=state.collision.bounds,z0=b.min.z+18,z1=b.max.z-18,walk=assets.human.animations.find(c=>/walk/i.test(c.name))||assets.human.animations[0];
  for(let i=0;i<3;i++){
   const side=i%2?1:-1,z=z0+(i+1)*(z1-z0)/4,x=openSide263(side,z),g=new THREE.Group(),model=clonePipScene(assets.human.scene);
   neutraliseHuman263(model,i);g.add(model);root.add(g);g.position.set(x,0,z);g.name='Imported city pedestrian';
   model.updateWorldMatrix(true,true);const box=new THREE.Box3().setFromObject(model),h=Math.max(.01,box.max.y-box.min.y),scale=2.45/h;model.scale.multiplyScalar(scale);model.position.y-=box.min.y*scale;
   const mixer=new THREE.AnimationMixer(model),action=walk?mixer.clipAction(walk):null;action?.play();if(action)action.time=i*.47;
   const dir=i===1?-1:1;g.rotation.y=dir>0?0:Math.PI;
   people.push({g,model,mixer,dir,side,speed:.72+i*.08,z0,z1,baseX:x,phase:i*2.1,groundClock:0});
  }
 }

 function seedGulls263(){
  const state=city204.state;if(!assets?.gull||!state?.collision||state.owner!==root||gulls.length)return;
  const b=state.collision.bounds,cx=(b.min.x+b.max.x)/2;
  const spots=[
   [cx-17,b.min.z+25,.1],[cx+18,b.min.z+43,1.7],[cx-20,b.min.z+66,3.1],[cx+16,b.min.z+88,4.7]
  ];
  for(const [x,z,rot] of spots){
   if(z>b.max.z-5)continue;const g=assets.gull.scene.clone(true);g.position.set(x,0,z);g.rotation.y=rot;g.scale.setScalar(1.25);g.name='Realistic imported city gull';g.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.userData.noInk=true;}});root.add(g);gulls.push(g);
  }
 }

 function tickPeople263(dt){
  const col=city204.state?.collision;if(!col)return;
  for(const p of people){
   p.mixer?.update(Math.min(.05,dt));
   p.groundClock=(p.groundClock||0)+dt;
   if(p.groundClock>.28){
    p.groundClock=0;
    p.g.position.y=0;
    p.model.updateWorldMatrix(true,true);
    const feetBox=new THREE.Box3().setFromObject(p.model);
    if(Number.isFinite(feetBox.min.y))p.g.position.y=-feetBox.min.y+.002;
   }
   let nextZ=p.g.position.z+p.dir*p.speed*dt;
   if(nextZ>p.z1){nextZ=p.z0;p.g.position.x=openSide263(p.side,nextZ);}
   if(nextZ<p.z0){nextZ=p.z1;p.g.position.x=openSide263(p.side,nextZ);}
   if(col.blocked({x:p.g.position.x,z:nextZ},.45)){
    const nx=openSide263(p.side,nextZ);if(!col.blocked({x:nx,z:nextZ},.45))p.g.position.x=nx;else nextZ+=p.dir*2.2;
   }
   p.g.position.z=nextZ;p.g.rotation.y=p.dir>0?0:Math.PI;
  }
 }

 function clear263(){
  for(const p of people){p.mixer?.stopAllAction();p.g.parent?.remove(p.g);}for(const g of gulls)g.parent?.remove(g);
  people=[];gulls=[];owner=null;
 }

 function seed263(){
  const state=window.city204?.state;if(!state?.collision||state.owner!==root)return;
  if(owner!==root){clear263();owner=root;}
  if(!assets){loadLife263().then(()=>{if(owner===root){seedPeople263();seedGulls263();}});return;}
  seedPeople263();seedGulls263();
 }

 const tickBefore263=tickWorld38;
 tickWorld38=function(dt){tickBefore263(dt);if(phase!=='scavenge'){if(owner)clear263();return;}seed263();if(owner===root&&gameplayActive()&&!document.hidden)tickPeople263(dt);};
 const clearBefore263=clear;clear=function(...args){clear263();return clearBefore263(...args);};

 window.cityLife263={get people(){return people;},get gulls(){return gulls;}};
})();