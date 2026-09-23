/* Build 261: large-scale city traffic and garden-tree reuse. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 let owner=null,traffic=[],trees=[],lanes=null,treeLoading=false;

 const trafficAssets261={saloon:null,wagon:null,loading:null};
 function loadTrafficAssets261(){
  if(trafficAssets261.loading)return trafficAssets261.loading;
  const loader=new THREE.GLTFLoader();
  const load=url=>new Promise((resolve,reject)=>loader.load(url,g=>resolve(g.scene),undefined,reject));
  trafficAssets261.loading=Promise.all([
   load('https://cdn.3dassets.dev/assets/32490/v1/model.glb'),
   load('https://cdn.3dassets.dev/assets/27328/v1/model.glb')
  ]).then(([saloon,wagon])=>{
   for(const src of [saloon,wagon])src.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.userData.noInk=true;o.frustumCulled=true;}});
   trafficAssets261.saloon=saloon;trafficAssets261.wagon=wagon;return trafficAssets261;
  }).catch(e=>{console.warn('CC0 traffic assets failed to load',e);return trafficAssets261;});
  return trafficAssets261.loading;
 }
 function cloneTrafficAsset261(kind){
  const src=kind==='wagon'?trafficAssets261.wagon:trafficAssets261.saloon;
  if(!src)return null;const g=src.clone(true);g.name=kind==='wagon'?'CC0 station wagon traffic':'CC0 saloon traffic';
  g.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.userData.noInk=true;}});
  g.scale.setScalar(kind==='wagon'?1.18:1.12);return g;
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
  if(!trafficAssets261.saloon||!trafficAssets261.wagon){loadTrafficAssets261().then(()=>{if(owner!==root)seedTraffic261();});return;}
  clear261();owner=root;lanes=chooseLanes261();if(!lanes)return;
  for(let i=0;i<4;i++){
    const kind=i%2?'wagon':'saloon',g=cloneTrafficAsset261(kind);if(!g)continue;root.add(g);
    const dir=i%2?1:-1,lane=dir>0?lanes.a:lanes.b,span=lanes.z1-lanes.z0,z=lanes.z0+(i/4)*span;
    g.position.set(lane,0,z);g.rotation.y=dir>0?0:Math.PI;
    traffic.push({g,dir,lane,speed:4.1+(i%2)*.35,baseSpeed:4.1+(i%2)*.35,halfL:kind==='wagon'?3.0:2.8,halfW:1.35});
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
  if(owner!==root)return;const state=city204.state;if(!state?.collision||!rat)return;
  for(let i=0;i<traffic.length;i++){
    const t=traffic[i],ahead=traffic.find((o,j)=>j!==i&&o.dir===t.dir&&Math.abs(o.lane-t.lane)<.5&&((o.g.position.z-t.g.position.z)*t.dir)>0&&((o.g.position.z-t.g.position.z)*t.dir)<12);
    const target=(nearPlayer261(t)||ahead)?1.1:t.baseSpeed;t.speed=THREE.MathUtils.damp(t.speed,target,2.2,dt);
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
  for(const t of traffic)t.g.parent?.remove(t.g);for(const g of trees)g.parent?.remove(g);
  traffic=[];trees=[];lanes=null;owner=null;treeLoading=false;
 }

 const tickBefore261=tickWorld38;
 tickWorld38=function(dt){tickBefore261(dt);if(phase!=='scavenge'){if(owner)clear261();return;}seedTraffic261();seedTrees261();if(gameplayActive()&&!document.hidden)tickTraffic261(Math.min(.05,dt));};
 const clearBefore261=clear;clear=function(...args){clear261();return clearBefore261(...args);};

 window.cityTraffic261={get traffic(){return traffic;},get trees(){return trees;},seedTraffic:seedTraffic261,seedTrees:seedTrees261};
})();