/* Build 261: large-scale city traffic and garden-tree reuse. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 let owner=null,traffic=[],trees=[],lanes=null,treeLoading=false;

 function mat(color,rough=.62,metal=.18){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});}
 function add(g,geo,m,x=0,y=0,z=0,name=''){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.name=name;o.userData.noInk=true;o.castShadow=false;o.receiveShadow=true;g.add(o);return o;}
 function trafficCar261(kind=0,color=0x485c69){
  const g=new THREE.Group();g.name=kind===1?'City estate car':'City sedan';
  const body=mat(color,.52,.28),dark=mat(0x1d2224,.45,.28),trim=mat(0xb5b7b2,.28,.72),glass=new THREE.MeshStandardMaterial({color:0x263944,roughness:.16,metalness:.35,transparent:true,opacity:.76});
  // Human-scale proportions: roughly 4.7m long, 1.85m wide, 1.5m high relative to Pip's world.
  const length=kind===1?5.3:4.8,width=1.86,hood=1.35,cabinL=kind===1?2.8:2.35;
  add(g,new THREE.BoxGeometry(width,.55,length),body,0,.58,0,'Lower body');
  add(g,new THREE.BoxGeometry(width*.94,.32,length*.88),body,0,.91,-.02,'Upper belt');
  add(g,new THREE.BoxGeometry(width*.88,.22,hood),body,0,1.08,length*.32,'Bonnet');
  add(g,new THREE.BoxGeometry(width*.84,.65,cabinL),glass,0,1.35,-.28,'Cabin glass');
  add(g,new THREE.BoxGeometry(width*.88,.14,cabinL+.08),body,0,1.69,-.28,'Roof');
  add(g,new THREE.BoxGeometry(width*.92,.18,.20),trim,0,.58,length*.505,'Front bumper');
  add(g,new THREE.BoxGeometry(width*.92,.18,.18),trim,0,.58,-length*.505,'Rear bumper');
  add(g,new THREE.BoxGeometry(width*.46,.14,.05),dark,0,.83,length*.512,'Grille');
  for(const side of [-1,1]){
    for(const z of [-length*.32,length*.32]){
      const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.24,18),dark);wheel.rotation.z=Math.PI/2;wheel.position.set(side*width*.51,.48,z);wheel.name='Traffic wheel';wheel.userData.noInk=true;g.add(wheel);
      const hub=new THREE.Mesh(new THREE.CylinderGeometry(.20,.20,.25,16),trim);hub.rotation.z=Math.PI/2;hub.position.copy(wheel.position);hub.position.x+=side*.005;hub.userData.noInk=true;g.add(hub);
    }
    add(g,new THREE.BoxGeometry(.07,.16,.34),trim,side*width*.51,1.35,.30,'Mirror');
  }
  const lightM=new THREE.MeshStandardMaterial({color:0xf1e7c5,emissive:0xffd98a,emissiveIntensity:.65,roughness:.3});
  for(const x of [-.55,.55])add(g,new THREE.BoxGeometry(.28,.16,.05),lightM,x,.85,length*.515,'Headlamp');
  const rearM=new THREE.MeshStandardMaterial({color:0x8a211c,emissive:0x7a110d,emissiveIntensity:.45});
  for(const x of [-.55,.55])add(g,new THREE.BoxGeometry(.28,.15,.05),rearM,x,.85,-length*.515,'Rear lamp');
  g.scale.setScalar(1.42); // intentionally large compared with Pip
  return g;
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
  if(owner===root)return;clear261();owner=root;lanes=chooseLanes261();if(!lanes)return;
  const palette=[0x3d4b55,0x6e756e,0x4e3e3d,0x2f3438,0x7a6a55,0x405c66];
  for(let i=0;i<6;i++){
    const g=trafficCar261(i%3===0?1:0,palette[i%palette.length]);root.add(g);
    const dir=i%2?1:-1,lane=dir>0?lanes.a:lanes.b,span=lanes.z1-lanes.z0,z=lanes.z0+(i/6)*span;
    g.position.set(lane,0,z);g.rotation.y=dir>0?0:Math.PI;
    traffic.push({g,dir,lane,speed:5.0+(i%3)*.45,baseSpeed:5.0+(i%3)*.45,halfL:3.7,halfW:1.45});
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
      const h=new THREE.Group(),v=asset.clone(true);h.add(v);h.position.set(x,0,z);h.rotation.y=(x*1.37+z*.41)%6.28;h.scale.setScalar(12);h.name='City cherry tree from Pip garden';h.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.userData.noInk=true;o.userData.keepGeometry=true;}});root.add(h);trees.push(h);
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
    if(car77?.riding){car77.speed*=.25;}else{
      if(Math.abs(dx)/(t.halfW+1)>Math.abs(dz)/(t.halfL+1))rat.position.x=t.g.position.x+Math.sign(dx||1)*(t.halfW+1);
      else rat.position.z=t.g.position.z+Math.sign(dz||1)*(t.halfL+1);
    }
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