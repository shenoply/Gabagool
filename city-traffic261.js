/* Build 261: large-scale city traffic and garden-tree reuse. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 let owner=null,traffic=[],trees=[],parked=[],signals=[],lanes=null,treeLoading=false,signalClock=0;

 const trafficAssets261={saloon:null,wagon:null,citycar:null,suv:null,convertible:null,signal:null,loading:null};
 function loadTrafficAssets261(){
  if(trafficAssets261.loading)return trafficAssets261.loading;
  const loader=new THREE.GLTFLoader();
  const load=url=>new Promise((resolve,reject)=>loader.load(url,g=>resolve(g.scene),undefined,reject));
  trafficAssets261.loading=Promise.all([
   load('https://cdn.3dassets.dev/assets/32490/v1/model.glb'),
   load('https://cdn.3dassets.dev/assets/27328/v1/model.glb'),
   load('https://cdn.3dassets.dev/assets/32487/v1/model.glb'),
   load('https://cdn.3dassets.dev/assets/32500/v1/model.glb'),
   load('https://cdn.3dassets.dev/assets/32528/v1/model.glb'),
   load('https://cdn.3dassets.dev/assets/24836/v1/model.glb')
  ]).then(([saloon,wagon,citycar,suv,convertible,signal])=>{
   for(const src of [saloon,wagon,citycar,suv,convertible,signal])src?.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.userData.noInk=true;o.frustumCulled=true;}});
   Object.assign(trafficAssets261,{saloon,wagon,citycar,suv,convertible,signal});return trafficAssets261;
  }).catch(e=>{console.warn('CC0 traffic assets failed to load',e);return trafficAssets261;});
  return trafficAssets261.loading;
 }
 function cloneTrafficAsset261(kind){
  const src=trafficAssets261[kind]||trafficAssets261.saloon;if(!src)return null;
  const g=src.clone(true);g.name='CC0 city '+kind;
  g.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.userData.noInk=true;}});
  g.updateWorldMatrix(true,true);const b=new THREE.Box3().setFromObject(g),s=b.getSize(new THREE.Vector3()),target=kind==='citycar'?5.6:kind==='suv'?7.0:kind==='wagon'?6.8:kind==='convertible'?6.4:6.6,k=target/Math.max(.01,s.z,s.x);g.scale.multiplyScalar(k);g.updateWorldMatrix(true,true);const bb=new THREE.Box3().setFromObject(g);g.position.y-=bb.min.y;return g;
 }
 function laneScore261(x,b){
  const col=city204.state?.collision;if(!col)return -1;let open=0,total=0;
  for(let z=b.min.z+10;z<b.max.z-10;z+=8){total++;if(!col.blocked({x,z},1.55))open++;}
  return open/Math.max(1,total);
 }
 function chooseLanes261(){
  const col=city204.state?.collision;if(!col)return null;const b=col.bounds,cx=(b.min.x+b.max.x)/2,candidates=[];
  for(let off=-24;off<=24;off+=2.5){const x=cx+off,score=laneScore261(x,b);if(score>.72)candidates.push({x,score});}
  candidates.sort((a,b)=>b.score-a.score);
  if(!candidates.length)return {a:cx-3,b:cx+3,z0:col.bounds.min.z+10,z1:col.bounds.max.z-10};
  const a=candidates[0].x,bestOther=candidates.find(q=>Math.abs(q.x-a)>5);
  return {a,b:bestOther?.x??a+6,z0:col.bounds.min.z+10,z1:col.bounds.max.z-10};
 }

 function seedTraffic261(){
  const state=window.city204?.state;if(!state?.collision||state.owner!==root)return;
  if(owner===root)return;
  if(!trafficAssets261.saloon||!trafficAssets261.wagon||!trafficAssets261.citycar||!trafficAssets261.suv||!trafficAssets261.convertible){loadTrafficAssets261().then(()=>{if(owner!==root)seedTraffic261();});return;}
  clear261();owner=root;lanes=chooseLanes261();if(!lanes)return;
  const kinds=['saloon','wagon','citycar','suv','convertible'];
  for(let i=0;i<5;i++){
    const kind=kinds[i],g=cloneTrafficAsset261(kind);if(!g)continue;root.add(g);
    const dir=i%2?1:-1,lane=dir>0?lanes.a:lanes.b,span=lanes.z1-lanes.z0,z=lanes.z0+(i/5)*span;
    g.position.set(lane,0,z);g.rotation.y=dir>0?0:Math.PI;
    traffic.push({g,dir,lane,speed:3.7+(i%3)*.32,baseSpeed:3.7+(i%3)*.32,halfL:kind==='suv'?3.7:3.3,halfW:1.55});
  }
  seedStreetFurniture261();
 }

 function seedStreetFurniture261(){
  const state=city204.state;if(!state?.collision||!lanes)return;const b=state.collision.bounds;
  // Four human-scale signals at two simple intersections.
  const zs=[lanes.z0+(lanes.z1-lanes.z0)*.34,lanes.z0+(lanes.z1-lanes.z0)*.68];
  for(const z of zs)for(const x of [lanes.a-3.4,lanes.b+3.4]){
    const src=trafficAssets261.signal;if(src){const g=src.clone(true);g.position.set(x,0,z);g.rotation.y=x<(lanes.a+lanes.b)/2?0:Math.PI;g.scale.setScalar(1.18);g.name='CC0 traffic signal';root.add(g);signals.push(g);}
  }
  // Parked vehicles near the signals and curb, separate from moving traffic.
  const pk=['citycar','suv','convertible','wagon'];let j=0;
  for(const z of zs)for(const side of [-1,1]){
    const g=cloneTrafficAsset261(pk[j++%pk.length]);if(!g)continue;const x=side<0?Math.min(lanes.a,lanes.b)-5.7:Math.max(lanes.a,lanes.b)+5.7;
    if(x<b.min.x+3||x>b.max.x-3||state.collision.blocked({x,z:z+side*5},1.4))continue;
    g.position.set(x,0,z+side*5);g.rotation.y=side<0?0:Math.PI;g.name='Parked '+g.name;root.add(g);parked.push(g);
  }
 }
 function seedTrees261(){
  const state=window.city204?.state;if(!state?.collision||state.owner!==root||trees.length||treeLoading)return;
  treeLoading=true;
  model44('sakura').then(asset=>{
    treeLoading=false;if(!asset||root!==state.owner)return;const b=state.collision.bounds,cx=(b.min.x+b.max.x)/2;
    const spots=[];for(let z=b.min.z+18;z<b.max.z-14;z+=20){
      for(const side of [-1,1]){
        for(const dist of [11,16,22]){
          const x=cx+side*dist,p={x,z};if(x<b.min.x+4||x>b.max.x-4)continue;
          if(!state.collision.blocked(p,1.0)){spots.push([x,z]);break;}
        }
      }
    }
    for(const [x,z] of spots.slice(0,12)){
      const h=new THREE.Group(),v=asset.clone(true);h.add(v);h.position.set(x,0,z);h.rotation.y=(x*1.37+z*.41)%6.28;h.scale.setScalar(8.5);h.name='City cherry tree from Pip garden';h.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.userData.noInk=true;o.userData.keepGeometry=true;}});root.add(h);trees.push(h);
    }
  }).catch(()=>{treeLoading=false;});
 }

 function nearPlayer261(t){
  const p=car77?.riding?car77.g.position:rat?.position;if(!p)return false;
  return Math.abs(p.x-t.g.position.x)<4.2&&Math.abs(p.z-t.g.position.z)<8.0;
 }
 function tickTraffic261(dt){
  if(owner!==root)return;const state=city204.state;if(!state?.collision||!rat)return;signalClock+=dt;
  for(let i=0;i<traffic.length;i++){
    const t=traffic[i],ahead=traffic.find((o,j)=>j!==i&&o.dir===t.dir&&Math.abs(o.lane-t.lane)<.5&&((o.g.position.z-t.g.position.z)*t.dir)>0&&((o.g.position.z-t.g.position.z)*t.dir)<12);
    const red=((signalClock%12)<5.5),nearestSignal=signals.length?signals.reduce((best,s)=>Math.abs(s.position.z-t.g.position.z)<Math.abs(best.position.z-t.g.position.z)?s:best,signals[0]):null,approachRed=red&&nearestSignal&&((nearestSignal.position.z-t.g.position.z)*t.dir)>0&&((nearestSignal.position.z-t.g.position.z)*t.dir)<8;const target=(nearPlayer261(t)||ahead||approachRed)?0.8:t.baseSpeed;t.speed=THREE.MathUtils.damp(t.speed,target,2.2,dt);
    t.g.position.z+=t.dir*t.speed*dt;
    if(t.dir>0&&t.g.position.z>lanes.z1)t.g.position.z=lanes.z0;
    if(t.dir<0&&t.g.position.z<lanes.z0)t.g.position.z=lanes.z1;
    // Keep traffic off blocked geometry: if route drifts into a facade, skip it forward to next safe section.
    if(state.collision.blocked({x:t.g.position.x,z:t.g.position.z},1.25)){
      for(let s=0;s<18;s++){t.g.position.z+=t.dir*2;if(!state.collision.blocked({x:t.g.position.x,z:t.g.position.z},1.25))break;}
    }
  }
  // Large traffic bodies are solid to Pip and the player's roadster.
  const p=car77?.riding?car77.g.position:rat.position;
  for(const t of traffic){
    const dx=p.x-t.g.position.x,dz=p.z-t.g.position.z;if(Math.abs(dx)>t.halfW+1||Math.abs(dz)>t.halfL+1)continue;
    if(car77?.riding){car77.speed=0;const away=new THREE.Vector3(dx,0,dz);if(away.lengthSq()<.001)away.set(1,0,0);away.normalize();car77.g.position.addScaledVector(away,.18);rat.position.copy(car77.g.position);}else{const away=new THREE.Vector3(dx,0,dz);if(away.lengthSq()<.001)away.set(1,0,0);away.normalize();rat.position.addScaledVector(away,.22);}
  }
 }

 function clear261(){
  for(const t of traffic)t.g.parent?.remove(t.g);for(const g of trees)g.parent?.remove(g);for(const g of parked)g.parent?.remove(g);for(const g of signals)g.parent?.remove(g);
  traffic=[];trees=[];parked=[];signals=[];lanes=null;owner=null;treeLoading=false;signalClock=0;
 }

 const tickBefore261=tickWorld38;
 tickWorld38=function(dt){tickBefore261(dt);if(phase!=='scavenge'){if(owner)clear261();return;}seedTraffic261();seedTrees261();if(gameplayActive()&&!document.hidden)tickTraffic261(Math.min(.05,dt));};
 const clearBefore261=clear;clear=function(...args){clear261();return clearBefore261(...args);};

 window.cityTraffic261={get traffic(){return traffic;},get trees(){return trees;},get parked(){return parked;},get signals(){return signals;},seedTraffic:seedTraffic261,seedTrees:seedTrees261};
})();