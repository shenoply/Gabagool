// Backyard integration: optional assets never gate startup. Original mission coordinates remain stable.
let yard78=null;
const assetCache78=new Map();
function loadAsset78(file){if(!assetCache78.has(file))assetCache78.set(file,new Promise((resolve,reject)=>new THREE.GLTFLoader().load(file,resolve,undefined,reject)).catch(e=>{assetCache78.delete(file);throw e;}));return assetCache78.get(file);}
function fitAsset78(scene,pos,dimensions,yaw=0){
 const g=new THREE.Group(),visual=new THREE.Group();visual.add(scene);g.add(visual);visual.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(visual),s=b.getSize(new THREE.Vector3());const k=dimensions.uniform||1;
 visual.scale.set(dimensions.w?dimensions.w/Math.max(s.x,.001):k,dimensions.h?dimensions.h/Math.max(s.y,.001):k,dimensions.d?dimensions.d/Math.max(s.z,.001):k);visual.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(visual);visual.position.sub(new THREE.Vector3((b.min.x+b.max.x)/2,b.min.y,(b.min.z+b.max.z)/2));g.position.set(...pos);g.rotation.y=yaw;g.traverse(m=>{if(m.isMesh){m.userData.noInk=true;m.userData.keepGeometry=true;m.castShadow=false;m.receiveShadow=true;}});return g;
}
function removeSolid78(g){const set=new Set();g.traverse(m=>set.add(m));surfaces57=surfaces57.filter(s=>!set.has(s.mesh));root.userData.collisionCache62?.clear();}
function solid78(g){root.add(g);g.updateWorldMatrix(true,true);registerSolid62(g);return g;}
function state78(){return home.backyard78||(home.backyard78={});}
function addFind78(id,label,item,count,pos,requirement=null){
 const y=yard78,m=ITEMS[item].build();m.scale.setScalar(.35);m.position.set(...pos);m.name=label;m.visible=!state78()[id];root.add(m);y.finds.push({id,label,item,count,m,requirement});
}
function near78(){const u=rat?.userData,y=yard78;if(!y||y.owner!==root||phase!=='scavenge'||!u||u.drive77||u.air||u.bird71||u.rope66||u.wallState||u.climb||u.job67?.lock)return null;
 const f=y.finds.find(f=>f.m.visible&&f.m.position.distanceTo(rat.position)<.85);if(f)return {type:'find',f};if(y.logs&&rat.position.distanceTo(y.logs.position)<1.5&&!state78().logWood)return {type:'wood'};if(y.rail&&rat.position.distanceTo(y.rail.start)<1.3)return {type:'rail'};return null;
}
function collectFind78(f){if(state78()[f.id])return;if(f.requirement&&!f.requirement()){sayToast('The spider is watching. Hide or distract it first.');return;}if(totalBag()+f.count>bagCapacity()){sayToast('Your bag is full. Store something first.');return;}
 const actor=rat,owner=root;sequence67(rat,['Inspect_Find','Pocket_Find'],{lock:true,done:()=>{if(root!==owner||rat!==actor||state78()[f.id])return;if(totalBag()+f.count>bagCapacity()){sayToast('Make room in your bag.');return;}state78()[f.id]=true;inv[f.item]=(inv[f.item]||0)+f.count;f.m.visible=false;save();bag();sfx.pickup();sayToast(f.label+' added to your bag');}});
}
function ivy78(x,z,dx,dz,width,height=3){
 const y=yard78,count=Math.max(18,Math.round(width*4)),leafGeo=new THREE.BufferGeometry(),v=[0,.02,0,-.12,0,0,-.045,0,-.08,0,0,-.035,.045,0,-.08,.12,0,0,.045,0,.08,0,0,.035],idx=[];for(let i=1;i<=7;i++)idx.push(0,i,i===7?1:i+1);leafGeo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));leafGeo.setIndex(idx);leafGeo.computeVertexNormals();
 const mat=new THREE.MeshStandardMaterial({color:0x3f633f,roughness:1,side:THREE.DoubleSide}),mesh=new THREE.InstancedMesh(leafGeo,mat,count),o=new THREE.Object3D();mesh.name='Consistent fence ivy';mesh.userData.noInk=true;
 for(let i=0;i<count;i++){const t=(i+.5)/count,cluster=Math.pow(Math.max(0,Math.sin(t*Math.PI*3)),2),side=(i%2?1:-1),j=.08*Math.sin(i*4.1);o.position.set(x+dx*(t*width+j)-dz*.07,.22+(i%6)/5*height*(.25+.75*cluster),z+dz*(t*width+j)+dx*.07);o.rotation.set(Math.PI/2+side*.22,0,Math.atan2(dz,dx)+i*.47);o.scale.setScalar(cluster>.22?.65+(i%3)*.1:0);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);}root.add(mesh);y.decor.push(mesh);
}
function yardFence78(){const y=yard78,mat=new THREE.MeshStandardMaterial({color:0x765238,roughness:.98}),postMat=new THREE.MeshStandardMaterial({color:0x563923,roughness:1});
 // One continuous timber perimeter. Only the east-side garden gate has an opening.
 const runs=[[-20.82,11.6,0,1,52.2],[31.32,.45,0,1,29.9],[31.32,30.05,0,1,15.3],[5.25,37.72,1,0,52.15],[5.25,-14.48,1,0,52.15]];
 for(const [x,z,dx,dz,len]of runs){const boards=Math.ceil(len/.72);for(let i=0;i<boards;i++){const along=-len/2+(i+.5)*len/boards,b=box(dx?.62:.14,2.75,dz?.62:.14,mat);b.position.set(x+dx*along,1.375,z+dz*along);b.name='Weathered backyard fence board';root.add(b);y.decor.push(b);}for(let p=-len/2;p<=len/2+.1;p+=4.8){const post=box(.22,3.15,.22,postMat);post.position.set(x+dx*p,1.575,z+dz*p);post.name='Backyard fence post';root.add(post);y.decor.push(post);}const collider=box(dx?len:.18,2.75,dz?len:.18,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));collider.position.set(x,1.375,z);collider.name='Backyard perimeter collider';solid78(collider);y.decor.push(collider);}
}
function cleanPoolZone78(){
 // Build 76 supplied several access decks around the temporary pool. Keep the mission objects,
 // but remove the platforms which now penetrate the replacement pool.
 const remove=/Walkable escape plank|Salvage route deck|Deck support|Floating biscuit tin lid/i;
 for(const node of [...root.children]){if(!remove.test(node.name||''))continue;const p=node.position;if(p.x<-16.25&&p.z>30){removeSolid78(node);root.remove(node);}}
}
function clearLegacyWood81(){
 const remove=/^(Batched backyard structures|Salvage route deck|Deck support|Walkable escape plank|Hinged shortcut plank|Small prize shelf|Loose shelf brace|Bird-route salvage shelf|Climbing rope to salvage platform|Knotted route rope|Legacy wooden platform|Legacy wooden platform support|Backyard picnic table|Garden stepping stone|Climbable garden rock|Cream[ _]enamel|Rusty[ _]drums|Blue[ _]galvanized[ _]steel)$/i,dead=[];
 root.traverse(o=>{const source=(o.userData?.sourceMaterial78||'').trim();if(remove.test(o.name||'')||remove.test(source))dead.push(o);});
 for(const o of dead){removeSolid78(o);o.parent?.remove(o);}
 if(world60?.owner===root){for(const f of world60.finds||[]){f.cover?.parent?.remove(f.cover);f.tag?.parent?.remove(f.tag);f.opened=true;f.g.visible=!home.discoveries60[f.id];f.g.position.y=.1;}world60.platforms=[];world60.ropes71=[];world60.shortcuts=[];}
 YARD_DATA.obstacles.length=0;YARD_DATA.platforms.length=0;
 root.updateMatrixWorld(true);root.userData.collisionCache62?.clear();
}
function simplePool78(){
 const g=new THREE.Group();g.position.set(-12.5,0,30.7);g.name='Clean striped inflatable kids pool';
 const colors=[0xe9a46f,0xf2d986,0x79aeb1],mats=colors.map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.88,metalness:0}));
 for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(2.65-i*.07,.16,8,40),mats[i]);ring.rotation.x=Math.PI/2;ring.position.y=.17+i*.24;ring.name='Inflatable pool ring';g.add(ring);}
 const liner=new THREE.Mesh(new THREE.CircleGeometry(2.48,40),new THREE.MeshStandardMaterial({color:0x82b8b8,roughness:.72}));liner.rotation.x=-Math.PI/2;liner.position.y=.025;liner.name='Pool liner';g.add(liner);solid78(g);return g;
}
function recolor78(){root.traverse(m=>{if(!m.isMesh)return;const name=(m.userData.sourceMaterial78||'')+' '+m.name;if(/Peeling teal fence|Backyard perimeter fence/i.test(name)){m.material=new THREE.MeshStandardMaterial({color:0x765238,roughness:.98});}});}
function cleanSupplied78(g,type){let i=0;g.traverse(m=>{if(!m.isMesh)return;const old=m.material,n=(old?.name||m.name||'').toLowerCase();if(old?.map){old.map.encoding=THREE.sRGBEncoding;old.map.anisotropy=2;old.needsUpdate=true;}if(type==='pool'){const colors=[0x6f9da0,0xd6b767,0xb47a75,0xd8d0aa];m.material=new THREE.MeshStandardMaterial({color:colors[i++%colors.length],roughness:.82,metalness:0});}else if(type==='gate')m.material=new THREE.MeshStandardMaterial({color:0x455654,roughness:.86,metalness:.18});else if(type==='picnic')m.material=new THREE.MeshStandardMaterial({color:0x76553d,roughness:.92});else if(type==='gnome'){m.material=old.clone();m.material.color.set(0xffffff);m.material.roughness=.9;m.material.metalness=0;m.material.needsUpdate=true;}});return g;}
function hangRail78(){const y=yard78;if(!y?.rail)return;const u=rat.userData;u.rail78={t:0};u.air=false;u.vy=0;u.job67=null;u.act=null;sayToast('Move sideways along the rail · Jump to drop');}
function dropRail78(){const u=rat?.userData;if(!u?.rail78)return false;u.rail78=null;u.air=true;u.vy=-.3;u.drop62=.5;return true;}
function spiderClip78(sp,name){if(sp.clip===name)return;const a=sp.actions[name];if(!a)return;sp.actions[sp.clip]?.fadeOut(.12);a.reset().setLoop(THREE.LoopRepeat,Infinity).fadeIn(.12).play();sp.clip=name;}
function spiderTick78(dt){const y=yard78,sp=y?.spider;if(!sp)return;sp.cool=Math.max(0,sp.cool-dt);sp.scared=Math.max(0,sp.scared-dt);const p=rat.position,dist=sp.g.position.distanceTo(p);const hidden=rat.userData.cover67||rat.userData.act?.type==='roll'||!!rat.userData.drive77;
 sp.aware=!hidden&&dist<2.8&&sp.scared===0;const target=sp.scared>0?sp.home.clone().add(new THREE.Vector3(-1.5,0,-.5)):sp.aware?p.clone():sp.home.clone().add(new THREE.Vector3(Math.sin(y.time*.4)*.55,0,Math.cos(y.time*.4)*.35));target.y=sp.home.y;
 if(target.distanceTo(sp.home)>2.8)target.copy(sp.home);const delta=target.sub(sp.g.position),speed=sp.scared>0?1.2:sp.aware?.6:.2;
 if(delta.length()>.12){sp.g.rotation.y=Math.atan2(delta.x,delta.z);const step=Math.min(speed*dt,delta.length());sp.g.position.addScaledVector(delta.normalize(),step);spiderClip78(sp,sp.scared>0?'run_ani_vor':'walk_ani_vor');}else spiderClip78(sp,'warte_pose');
 if(sp.aware&&dist<.7&&sp.cool===0){sp.cool=3;spiderClip78(sp,'Attack');const away=p.clone().sub(sp.g.position);away.y=0;if(away.lengthSq()>.001){const before=p.clone();p.addScaledVector(away.normalize(),.25);resolveGeometry62(p,before);}sayToast('Too close! Roll away or use your tail.');}
 sp.mixer.update(dt);if(dist>18)sp.g.visible=false;else sp.g.visible=true;
}
async function seed78(){
 const owner=root,y=yard78={owner,finds:[],decor:[],time:0,loaded:[],errors:[],ready:false,spider:null};state78();ui.phase.textContent='Backyard · Pip’s lane';recolor78();
 clearLegacyWood81();yardFence78();ivy78(-20.7,8,0,1,9,2.1);ivy78(31.2,25,0,1,7,2.1);ivy78(-7,37.6,1,0,10,2.1);cleanPoolZone78();
 const jobs=[
 ['logs78.glb',a=>{const g=fitAsset78(a.scene.clone(true),[-15.2,0,17.4],{w:3.8,h:1.05,d:1.9},12*Math.PI/180);g.name='Climbable firewood stack';solid78(g);y.logs=g;addFind78('logToken','Hidden brass token','coin',1,[-15.2,1.13,17.4]);}],
 ['gnomes78.glb',a=>{for(const [x,z]of [[11.8,34.8],[25.9,19.3]]){const g=fitAsset78(cleanSupplied78(a.scene.clone(true),'gnome'),[x,0,z],{h:.82,uniform:1});g.name='Garden gnome landmark';solid78(g);}addFind78('gnomeButton','Gnome’s lost button','button',1,[26.1,.13,19.8]);}],
 ['gate78.glb',a=>{if(!gate57||gate57.owner!==owner)return;const g=fitAsset78(cleanSupplied78(a.scene.clone(true),'gate'),[0,0,0],{w:5.35,h:2.8,d:.16},-Math.PI/2);g.position.z=2.8;g.name='Single hinged garden gate';removeSolid78(gate57.leaf);gate57.leaf.clear();gate57.leaf.add(g);gate57.leaf.updateWorldMatrix(true,true);registerSolid62(gate57.leaf);}],
 ['railing78.glb',a=>{const panel=(pos,yaw=0)=>{const g=fitAsset78(cleanSupplied78(a.scene.clone(true),'gate'),pos,{w:.12,h:1.1,d:4.5},yaw);g.name='Grounded iron herb-garden railing';solid78(g);return g;};const left=panel([25.35,0,24.55]),right=panel([30.25,0,24.55]),back=panel([27.8,0,26.78],Math.PI/2);y.rail={g:left,start:new THREE.Vector3(25.35,1.03,22.45),end:new THREE.Vector3(25.35,1.03,26.62),parts:[left,right,back]};addFind78('railWasher','Rail-end washer','nail',2,[25.65,.13,22.25]);}],
 ['spider78.glb',a=>{const visual=clonePipScene(a.scene),g=fitAsset78(visual,[-18.6,.025,23.4],{uniform:.025});root.add(g);g.name='Log-corner spider';const mixer=new THREE.AnimationMixer(visual),actions={};for(const clip of a.animations){const c=clip.clone();for(const tr of c.tracks){if(tr.name.endsWith('.position')&&tr.values.length>3){for(let i=3;i<tr.values.length;i+=3){tr.values[i]=tr.values[0];tr.values[i+2]=tr.values[2];}}}actions[c.name]=mixer.clipAction(c);}y.spider={g,mixer,actions,home:g.position.clone(),scared:0,cool:0,aware:false,clip:null};spiderClip78(y.spider,'warte_pose');addFind78('spiderTreasure','Spider’s shiny stash','coin',1,[-19,.13,23.9],()=>!y.spider.aware||y.spider.scared>0);}],
 ['backyard-design78.glb',a=>{for(const [name,pos,size,yaw]of [['Garden tools',[27.8,0,32.3],{w:2.4,h:1,d:1.8},0],['Herb bed',[28.2,0,24.3],{w:2.5,h:.7,d:3.4},0],['Pot tunnel',[17.6,0,17.8],{w:1.4,h:1.4,d:2.5},Math.PI/2]]){const part=a.scene.getObjectByName(name)||a.scene.getObjectByName(name.replace(/ /g,'_'));if(!part)throw Error('Missing design group '+name);const g=fitAsset78(part.clone(true),pos,size,yaw);g.name=name+' from approved backyard';solid78(g);}
  // The bed's leaves are opaque geometry, never a solid collision wall.
  const herbMat=M(0x748349);for(let i=0;i<12;i++){const stem=cyl(.025,.04,.38,herbMat,5);stem.position.set(27.45+(i%3)*.38,.89,23.3+Math.floor(i/3)*.62);root.add(stem);for(let side of [-1,1]){const leaf=sph(.17,herbMat,5,3);leaf.scale.set(.65,.2,1);leaf.position.copy(stem.position).add(new THREE.Vector3(side*.09,.1,0));root.add(leaf);}}
 }]
 ];
 // Two concurrent downloads at most; failed decorations leave base gameplay intact.
 let cursor=0;async function worker(){while(cursor<jobs.length){const [file,apply]=jobs[cursor++];try{const a=await loadAsset78(file);if(root!==owner)return;apply(a);y.loaded.push(file);}catch(e){y.errors.push(file);console.warn('Backyard asset unavailable:',file,e.message);}}}
 await Promise.all([worker(),worker()]);if(root!==owner)return;if(bilginPool&&bilginPool.owner===owner){removeSolid78(bilginPool.g);bilginPool.g.parent?.remove(bilginPool.g);const g=simplePool78();bilginPool.g=g;bilginPool.radius=2.3;bilginPool.water.geometry.dispose();bilginPool.water.geometry=new THREE.CircleGeometry(2.28,40);bilginPool.water.material.color.setHex(0x6fa7a8);bilginPool.water.material.opacity=.68;y.pool=g;}cleanPoolZone78();y.ready=true;root.updateMatrixWorld(true);root.userData.collisionCache62?.clear();save();
}
const startBefore78=startScavenge;startScavenge=function(){startBefore78();seed78();};
const grabBefore78=grab;grab=function(){if(!gameplayActive())return grabBefore78();if(rat.userData.rail78)return dropRail78();const n=near78();if(!n)return grabBefore78();if(n.type==='find')return collectFind78(n.f);if(n.type==='rail')return hangRail78();if(n.type==='wood'){if(totalBag()+3>bagCapacity()){sayToast('Make room for three sticks.');return;}const owner=root;sequence67(rat,['Inspect_Find','Pocket_Find'],{lock:true,done:()=>{if(root!==owner||state78().logWood||totalBag()+3>bagCapacity())return;inv.stick=(inv.stick||0)+3;state78().logWood=true;save();bag();sfx.pickup();sayToast('Three dry sticks collected');}});}};
const hintBefore78=ropeHints66;ropeHints66=function(){hintBefore78();if(!gameplayActive())return;if(rat.userData.rail78){ui.prompt.style.display='block';ui.prompt.textContent='Hanging · move sideways · Jump to drop';$('padE').textContent='Let go';return;}const n=near78();if(n){ui.prompt.style.display='block';ui.prompt.textContent=n.type==='find'?n.f.label:n.type==='wood'?'Collect dry firewood':'Hang on the railing';$('padE').textContent=n.type==='rail'?'Hang on':'Collect';}};
const controlBefore78=control;control=function(dt,options){const u=rat.userData;if(!u.rail78)return controlBefore78(dt,options);if(!gameplayActive()||document.hidden)return 0;const r=yard78?.rail;if(!r||yard78.owner!==root){dropRail78();return 0;}const dir=THREE.MathUtils.clamp(joy.x+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),-1,1);u.rail78.t=THREE.MathUtils.clamp(u.rail78.t+dir*dt*.23,0,1);rat.position.lerpVectors(r.start,r.end,u.rail78.t);rat.rotation.y=-Math.PI/2;u.air=false;u.vy=0;u.vel=0;return 0;};
const motionBefore78=motion67;motion67=function(g,dt,speed,base,act){if(g.userData.rail78)return 'Ledge_Hang_Loop';return motionBefore78(g,dt,speed,base,act);};
const jumpBefore78=doJump;doJump=function(){if(dropRail78())return;return jumpBefore78();};
const hitBefore78=tailHit67;tailHit67=function(g){hitBefore78(g);const sp=yard78?.spider;if(sp&&sp.g.position.distanceTo(g.position)<1.7){sp.scared=7;sp.aware=false;spiderClip78(sp,'run_ani_back');sayToast('The spider retreats—grab the stash!');}if(car77&&!car77.riding&&car77.g.position.distanceTo(g.position)<2){const before=car77.g.position.clone(),dir=before.clone().sub(g.position);dir.y=0;const next=before.clone().addScaledVector(dir.normalize(),.55);if(!blockedCar77(next)){car77.g.position.copy(next);car77.g.updateWorldMatrix(true,true);root.userData.collisionCache62?.clear();}}};
const honkBefore78=honk77;honk77=function(){honkBefore78();const sp=yard78?.spider;if(car77?.riding&&sp&&car77.g.position.distanceTo(sp.g.position)<7){sp.scared=8;sp.aware=false;}};
const tickBefore78=tickWorld38;tickWorld38=function(dt){tickBefore78(dt);if(yard78?.owner!==root||phase!=='scavenge'||!gameplayActive()||document.hidden)return;yard78.time+=dt;spiderTick78(dt);};
// Drive contacts follow the actual steering wheel, using the existing rat rig.
const makeRatBefore78=makeRat;makeRat=function(){const g=makeRatBefore78(),animate=g.animate;g.animate=function(dt,...args){animate(dt,...args);const u=g.userData;if(!u.drive77||!car77?.wheel||!u.pipBones)return;car77.g.updateWorldMatrix(true,true);g.updateWorldMatrix(true,true);
 for(const side of ['Left','Right']){const arm=u.pipBones[side+'Arm'],fore=u.pipBones[side+'ForeArm'],hand=u.pipBones[side+'Hand'];if(!arm||!fore||!hand)continue;const target=car77.wheel.localToWorld(new THREE.Vector3(side==='Left'?-.095:.095,car77.horn>0&&side==='Right'?0:.045,0));for(let i=0;i<5;i++)for(const bone of [fore,arm]){const origin=bone.getWorldPosition(new THREE.Vector3()),from=hand.getWorldPosition(new THREE.Vector3()).sub(origin),to=target.clone().sub(origin);if(from.lengthSq()<1e-8||to.lengthSq()<1e-8)continue;const delta=new THREE.Quaternion().setFromUnitVectors(from.normalize(),to.normalize()),world=bone.getWorldQuaternion(new THREE.Quaternion());bone.quaternion.copy(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(delta.multiply(world)));bone.updateWorldMatrix(false,true);}}
 };return g;};
// Route button dispatch through the current horn handler, including wildlife reaction.
carPanel77.children[0].onpointerdown=e=>{e.preventDefault();e.stopPropagation();honk77();};
// Feet span narrow gaps between picnic-table boards; do not fall through a plank seam.
