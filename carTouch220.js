/* Direct world interactions. Only the current nearby/looked-at part gets actions. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),clamp=THREE.MathUtils.clamp;
 let owner=null,targets=[],parts=[],selected=null,held=null,gesture=null,mirror=null,lastTap=0,refresh=0;
 const state=()=>vehicle219.data().parts220??={};
 const active=()=>phase==='scavenge'&&car77?.owner===root&&gameplayActive()&&!photo.active;
 function mesh(parent,geometry,color,name,position){const m=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:.5}));m.name=name;m.position.copy(position);m.userData.noInk=true;parent.add(m);return m;}
 function tag(o,id){o.userData.touch220=id;return o;}
 function target(id,object,label,action,anchor=object,inside=false){tag(object,id);const t={id,object,label,action,anchor,inside};targets.push(t);return t;}
 function installed(p){return !state()[p.id]||state()[p.id].installed!==false;}
 function persist(p){state()[p.id]={installed:installed(p),position:p.mesh.getWorldPosition(V()).toArray(),upgraded:!!state()[p.id]?.upgraded};save();}
 function attach(){const c=car77;if(owner===c)return;owner=c;targets=[];parts=[];selected=null;mirror=null;if(!c)return;vehicle219.attach(c);const a=c.cabin219;const serviceState=vehicle219.data();if(serviceState.resetRevision223!==223){serviceState.parts220={};serviceState.oil=serviceState.coolant=serviceState.condition=100;serviceState.temperature=22;serviceState.resetRevision223=223;save();}
  for(const [i,d]of a.doors.entries()){
   const side=i?1:-1,handle=mesh(d.pivot,new THREE.BoxGeometry(.025,.028,.10),0xc8c6ae,'Interior door handle',V(-side*.10,.15,-.43));
   const crank=mesh(d.pivot,new THREE.SphereGeometry(.025,10,8),0xc8b07a,'Window crank',V(-side*.12,.09,-.25));
   target('door'+i,d.pivot,()=>car77.riding?(d.open?'Close door':'Open door'):(d.open?'Close door':'Open door'),()=>vehicle219.toggle('door',i),handle,true);tag(handle,'door'+i);
   target('window'+i,crank,()=>vehicle219.data().windows?'Lower window':'Raise window',()=>vehicle219.toggle('windows'),crank,true);
  }
  const hoodPoint=new THREE.Object3D();hoodPoint.position.set(0,.32,.74);c.g.add(hoodPoint);
  target('hood',a.hood,()=>a.hoodOpen?'Close hood':'Open hood',()=>vehicle219.toggle('hood'),hoodPoint);
  const latch=mesh(c.visual,new THREE.BoxGeometry(.12,.035,.05),0xb7a786,'Roof latch',V(-.28,.91,.10));target('roof',latch,()=>vehicle219.data().roof?'Open roof':'Close roof',()=>vehicle219.toggle('roof'),latch,true);
  for(const [i,m]of a.mirrors.entries())target('mirror'+i,m.pivot219,()=> 'Adjust '+['centre','left','right'][i]+' mirror',()=>{mirror=i;selected=null;sayToast('Drag the mirror to aim it. Tap Done to finish.');},m.face,true);
  target('oil',a.oil,()=>vehicle219.data().oil>=99?'Oil full':(inv.oil219?'Add oil':'Oil bottle needed'),()=>vehicle219.serviceStart('oil'));
  target('coolant',a.coolant,()=>vehicle219.data().coolant>=99?'Cooling water full':(inv.coolant219?'Add cooling water':'Water bottle needed'),()=>vehicle219.serviceStart('coolant'));
  target('repair',a.engine.getObjectByName('Engine block'),()=>vehicle219.data().condition>=99?'Engine healthy':'Repair engine · 2 foil + 1 nail',()=>vehicle219.serviceStart('repair'));
  const filter=mesh(a.engine,new THREE.CylinderGeometry(.075,.075,.07,16),0x707d68,'Air filter',V(0,.49,.43));
  const plugs=mesh(a.engine,new THREE.BoxGeometry(.17,.035,.035),0xc7baa0,'Spark plug rail',V(.10,.50,.68));
  const belt=mesh(a.engine,new THREE.TorusGeometry(.075,.013,6,20),0x353b33,'Drive belt',V(0,.39,.83));
  const brake=mesh(c.steeringPivots[1],new THREE.BoxGeometry(.08,.09,.12),0x6f7265,'Brake caliper',V(.02,0,0));
  for(const [id,name,obj,upgrade]of [['radiator','Radiator',a.engine.getObjectByName('Radiator'),'cooling'],['filter','Air filter',filter,null],['plugs','Spark plugs',plugs,'engine'],['belt','Drive belt',belt,null],['brakes','Brake caliper',brake,'brakes'],...a.engine.children.filter(o=>o.isMesh&&!['Radiator','Air filter','Spark plug rail','Drive belt'].includes(o.name)).map((o,i)=>['engine'+i,o.name,o,null]),...c.hubs.map((wheel,i)=>['wheel'+i,['Rear left','Front left','Rear right','Front right'][i]+' wheel',wheel,i===0?'tyres':null])]){
   const p={id,name,requiresHood:!id.startsWith('wheel')&&id!=='brakes',mesh:obj,parent:obj.parent,position:obj.position.clone(),quaternion:obj.quaternion.clone(),scale:obj.scale.clone(),upgrade};
   const slot=new THREE.Mesh(obj.geometry||new THREE.BoxGeometry(.14,.49,.49),new THREE.MeshBasicMaterial({color:0xd8c48b,visible:false,transparent:true,opacity:0,depthWrite:false}));slot.position.copy(p.position);slot.quaternion.copy(p.quaternion);slot.scale.copy(p.scale);p.parent.add(slot);p.slot=slot;slot.visible=false;
   const t=target('part-'+id,obj,()=> 'Hold '+name,()=>pickup(p));t.part=p;
   const st=target('slot-'+id,slot,()=> 'Refit '+name,()=>refit(p));st.part=p;
   if(!installed(p)){removeSolid78(obj);obj.traverse(m=>m.userData.heldCarPart221=true);c.g.updateWorldMatrix(true,true);root.attach(obj);obj.position.fromArray(state()[id].position);slot.visible=true;}
   parts.push(p);
  }
 }
 function valid(t){if(!active()||!t)return false;const c=car77,a=c.cabin219;
  if(c.riding)return roadsterControls203.viewIndex!==0&&t.inside;
  if(t.id.startsWith('mirror')||t.id==='roof'||t.id.startsWith('window'))return false;
  if(t.id==='oil'||t.id==='coolant'||t.id==='repair'||t.part?.requiresHood&&(t.id.startsWith('slot-')||t.id.startsWith('part-')&&installed(t.part))){if(!a.hoodOpen||a.hoodValue<.95)return false;}
  if(t.id.startsWith('slot-')&&(!held||held.part!==t.part))return false;
  return rat.position.distanceTo(t.anchor.getWorldPosition(V()))<.95;
 }
 function hit(x,y){if(!active())return null;attach();const rect=renderer.domElement.getBoundingClientRect();ndc.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);camera.updateMatrixWorld(true);car77.g.updateWorldMatrix(true,true);ray.setFromCamera(ndc,camera);
  const objects=[car77.g,...parts.filter(p=>!installed(p)).map(p=>p.mesh)];const hits=ray.intersectObjects(objects,true);
  for(const h of hits){let visible=true;for(let o=h.object;o;o=o.parent)if(!o.visible){visible=false;break;}if(!visible)continue;let t=null;for(let o=h.object;o;o=o.parent){if(o.userData.touch220){t=targets.find(t=>t.id===o.userData.touch220);break;}}
   // Opaque body surfaces occlude parts behind them. Transparent glass is skipped.
   if(t&&valid(t))return t;if(h.object.material?.transparent)continue;break;
  }
  // Expand small visible parts to a finger-sized screen target, never through an opaque panel.
  const candidates=targets.filter(t=>valid(t)&&!/^(door|hood)/.test(t.id)).map(t=>{const p=t.anchor.getWorldPosition(V()).project(camera);return {t,p,d:Math.hypot((p.x+1)*rect.width/2+rect.left-x,(1-p.y)*rect.height/2+rect.top-y)};}).filter(k=>k.d<24&&k.p.z>-1&&k.p.z<1).sort((a,b)=>a.d-b.d);
  for(const {t,p}of candidates){ray.setFromCamera(new THREE.Vector2(p.x,p.y),camera);for(const h of ray.intersectObjects(objects,true)){let visible=true;for(let o=h.object;o;o=o.parent)if(!o.visible)visible=false;if(!visible||h.object.material?.transparent)continue;let id;for(let o=h.object;o;o=o.parent)if(o.userData.touch220){id=o.userData.touch220;break;}if(id===t.id)return t;break;}}
  return null;
 }
 function current(){if(!active()||mirror!==null)return null;if(!car77.riding&&rat.position.distanceTo(car77.g.position)>2&&!parts.some(p=>!installed(p)&&rat.position.distanceTo(p.mesh.position)<.95))return null;const rect=renderer.domElement.getBoundingClientRect(),look=hit(rect.left+rect.width*.5,rect.top+rect.height*.52);if(look)return look;if(selected&&valid(selected))return selected;if(car77.riding)return null;return targets.filter(t=>/^door|^hood$/.test(t.id)&&valid(t)).sort((a,b)=>rat.position.distanceTo(a.anchor.getWorldPosition(V()))-rat.position.distanceTo(b.anchor.getWorldPosition(V())))[0]||null;}
 function pickup(p){if(!active()||car77.riding||Math.abs(car77.speed)>.08||vehicle219.service)return false;if(car77.ignition206)return sayToast('Switch the engine off first.');const t=targets.find(t=>t.id==='part-'+p.id);if(!valid(t))return false;if(held)drop();
  removeSolid78(p.mesh);p.mesh.traverse(m=>m.userData.heldCarPart221=true);if(rat.userData.spring57){rat.userData.spring57=null;rat.userData.vy=0;}
  root.updateWorldMatrix(true,true);root.attach(p.mesh);state()[p.id]={installed:false,position:p.mesh.position.toArray(),upgraded:!!state()[p.id]?.upgraded};p.slot.visible=true;held={part:p,owner:root,aim:null};selected=null;save();tutorial219.record('service');sayToast('Holding '+p.name+'. Move to carry it; tap its empty mounting point to refit.');return true;
 }
 function refit(p){if(!held||held.part!==p||!valid(targets.find(t=>t.id==='slot-'+p.id))||car77.ignition206)return false;p.parent.add(p.mesh);p.mesh.position.copy(p.position);p.mesh.quaternion.copy(p.quaternion);p.mesh.scale.copy(p.scale);p.slot.visible=false;p.mesh.traverse(m=>m.userData.heldCarPart221=false);registerSolid62(p.mesh);state()[p.id]={installed:true,upgraded:!!state()[p.id]?.upgraded};held=null;selected=null;save();tutorial219.record('service');sayToast(p.name+' refitted.');return true;}
 function drop(){if(!held)return;const p=held.part;if(held.owner===root){const forward=V(Math.sin(rat.rotation.y),0,Math.cos(rat.rotation.y));p.mesh.position.copy(rat.position).addScaledVector(forward,.35);p.mesh.position.y=rat.position.y+.08;p.mesh.quaternion.identity();const bounds=new THREE.Box3().setFromObject(p.mesh);p.mesh.position.y+=rat.position.y+.01-bounds.min.y;persist(p);}held=null;selected=null;}
 function upgrade(p){if(!p.upgrade||held||!installed(p))return false;const u=vehicle219.upgrades[p.upgrade];if(vehicle219.data().upgrades[p.upgrade])return false;if(!Object.entries(u.needs).every(([k,n])=>(inv[k]||0)>=n))return false;if(!pickup(p))return false;for(const [k,n]of Object.entries(u.needs))inv[k]-=n;state()[p.id].upgraded=true;vehicle219.data().upgrades[p.upgrade]=true;p.mesh.traverse(m=>{if(m.isMesh&&m.material?.color){m.material=m.material.clone();m.material.color.setHex(0xc4ae72);}});save();bag();sayToast('Upgraded '+p.name+' in hand. Tap its slot to fit it.');return true;}
 const originalInterlock=vehicle219.interlocked;vehicle219.interlocked=()=>originalInterlock()||parts.some(p=>!installed(p)&&(/^(wheel|radiator|filter|plugs|belt|brakes)/.test(p.id)||p.name==='Engine block'));
 const enterBefore220=enterCar77;enterCar77=function(){if(held){sayToast('Put down or refit the part before entering.');return false;}return enterBefore220();};
 const baseTune=vehicle219.tuning;vehicle219.tuning=()=>{const t=baseTune();if(parts.some(p=>!installed(p)&&(/^(wheel|radiator|filter|plugs|belt|brakes)/.test(p.id)||p.name==='Engine block')))t.power=0;return t;};
 const bar=document.createElement('div');bar.id='carContext220';bar.hidden=true;const action=document.createElement('button'),secondary=document.createElement('button');action.id='partAction220';secondary.id='partSecondary220';bar.append(action,secondary);document.body.appendChild(bar);
 const carry=document.createElement('button');carry.id='carryPart220';carry.hidden=true;carry.onclick=drop;document.body.appendChild(carry);
 const done=document.createElement('button');done.id='mirrorDone220';done.textContent='Mirror: drag to aim · Done';done.hidden=true;done.onclick=()=>{mirror=null;gesture=null;save();};document.body.appendChild(done);
 const exit=document.createElement('button');exit.id='exitCar220';exit.textContent='Exit car';exit.setAttribute('aria-label','Exit vehicle');exit.onclick=()=>exitCar77();cockpit205.hud.appendChild(exit);
 action.onclick=()=>{const t=current();if(!t)return;if(car77.riding&&t.id==='door0')exitCar77();else t.action();};
 function renderUI(){const playing=active(),t=current();exit.hidden=!playing||!car77.riding;exit.disabled=Math.abs(car77?.speed||0)>.15;exit.textContent='Exit car';exit.title=exit.disabled?'Stop before exiting':'Exit car';bar.hidden=!playing||Math.abs(car77.speed)>.08||!t||!!vehicle219.service||!!held&&t?.part===held.part&&t.id.startsWith('part-');carry.hidden=!playing||!held;done.hidden=!playing||mirror===null;if(held)carry.textContent=held.part.name+' in hand · Put down';if(!t)return;
  action.textContent=car77.riding&&t.id==='door0'?'Exit through door':t.label();action.disabled=Math.abs(car77.speed)>.08;secondary.hidden=true;
  if(car77.riding&&t.id==='door0'){secondary.textContent=t.label();secondary.onclick=t.action;secondary.hidden=false;}
  else if(!car77.riding&&t.id.startsWith('door')&&car77.cabin219.doors[Number(t.id.slice(-1))].open){secondary.textContent='Enter car';secondary.onclick=()=>enterCar77();secondary.hidden=false;}
  else if(t.part&&['Oil filler','Coolant cap','Engine block'].includes(t.part.name)){const kind=t.part.name==='Oil filler'?'oil':t.part.name==='Coolant cap'?'coolant':'repair';secondary.textContent=kind==='repair'?'Repair engine':kind==='oil'?'Add oil':'Add cooling water';secondary.onclick=()=>vehicle219.serviceStart(kind);secondary.hidden=false;}
  else if(t.part?.upgrade&&installed(t.part)&&!held){const p=t.part,u=vehicle219.upgrades[p.upgrade];if(!vehicle219.data().upgrades[p.upgrade]&&Object.entries(u.needs).every(([k,n])=>(inv[k]||0)>=n)){secondary.textContent='Fit '+u.label;secondary.onclick=()=>upgrade(p);secondary.hidden=false;}}
 }
 const css=document.createElement('style');css.textContent='#carContext220{position:fixed;z-index:34;left:50%;top:57%;transform:translateX(-50%);display:flex;gap:5px;max-width:90vw}#carContext220[hidden],#carryPart220[hidden],#mirrorDone220[hidden],#exitCar220[hidden]{display:none!important}#carContext220 button,#carryPart220,#mirrorDone220,#exitCar220{min-height:44px;padding:8px 12px;border-radius:12px;border:1px solid #d1ba8355;background:#203d34e8;color:#f1dfb8;font:600 12px/1.25 system-ui}#carContext220 button:disabled{opacity:.5}#carryPart220,#mirrorDone220{position:fixed;z-index:36;left:50%;transform:translateX(-50%);top:65%;max-width:75vw}#cockpit205 #exitCar220{margin-top:8px;width:100%;background:#d8bd88;color:#243c30}';document.head.appendChild(css);
 const canvas=renderer.domElement;
 canvas.addEventListener('pointerdown',e=>{if(!active()||e.button>0)return;const t=hit(e.clientX,e.clientY);gesture={id:e.pointerId,x:e.clientX,y:e.clientY,t,dragged:false};if(t?.id.startsWith('mirror')&&car77.riding){if(Math.abs(car77.speed)>.08){gesture=null;return;}mirror=Number(t.id.slice(-1));const s=vehicle219.data().mirrors[mirror];gesture.yaw=s.yaw;gesture.pitch=s.pitch;canvas.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopImmediatePropagation();gameCam.pointers.delete(e.pointerId);}else if(held&&t?.part===held.part){canvas.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopImmediatePropagation();gameCam.pointers.delete(e.pointerId);}},true);
 canvas.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.hypot(dx,dy)>8)gesture.dragged=true;
  if(gesture.yaw!==undefined&&mirror!==null){vehicle219.adjustMirror(mirror,gesture.yaw+dx*.004,gesture.pitch-dy*.003);e.preventDefault();e.stopImmediatePropagation();}
  else if(held&&gesture.t?.part===held.part){const rect=canvas.getBoundingClientRect();ndc.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(ndc,camera);const plane=new THREE.Plane(V(0,1,0),-(rat.position.y+.28)),p=ray.ray.intersectPlane(plane,V());if(p){held.aim=p;e.preventDefault();e.stopImmediatePropagation();}}
 },true);
 function release(e){if(!gesture||e.pointerId!==gesture.id)return;const g=gesture;gesture=null;if(e.type==='pointercancel'){mirror=null;return;}if(g.yaw!==undefined||g.dragged&&held&&g.t?.part===held.part){lastTap=performance.now();save();e.preventDefault();e.stopImmediatePropagation();return;}if(!g.dragged&&g.t&&valid(g.t)){selected=g.t;if(car77.riding&&g.t.id==='door0')exitCar77();else g.t.action();gameCam.pointers.delete(e.pointerId);gameCam.moved=true;lastTap=performance.now();e.preventDefault();e.stopImmediatePropagation();}renderUI();}
 canvas.addEventListener('pointerup',release,true);canvas.addEventListener('pointercancel',release,true);canvas.addEventListener('click',e=>{if(performance.now()-lastTap<400){e.preventDefault();e.stopImmediatePropagation();}},true);
 addEventListener('blur',()=>{gesture=null;mirror=null;});document.addEventListener('visibilitychange',()=>{gesture=null;mirror=null;});
 const make=makeRat;makeRat=function(){const g=make(),animate=g.animate;g.animate=function(...args){animate(...args);if(held&&g===rat&&held.owner===root&&g.userData.pipBones?.LeftHand){const b=g.userData.pipBones,shoulder=b.LeftArm.getWorldPosition(V()),forward=V(0,-.025,.075).applyAxisAngle(V(0,1,0),g.rotation.y);let aim=held.aim?.clone()||shoulder.clone().add(forward);const delta=aim.clone().sub(shoulder);if(delta.length()>.095)aim=shoulder.clone().add(delta.setLength(.095));solveArm203(THREE,g,'Left',aim,shoulder.clone().add(V(0,-.15,0)));held.part.mesh.position.copy(b.LeftHand.getWorldPosition(V()));held.part.mesh.quaternion.copy(g.getWorldQuaternion(new THREE.Quaternion()));}};return g;};
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);if(!active()){bar.hidden=carry.hidden=done.hidden=exit.hidden=true;if(held&&held.owner!==root){held=null;}return;}attach();if(Math.abs(car77.speed)>.08||roadsterControls203.viewIndex===0){mirror=null;gesture=null;}if(held)persistTimer(dt);refresh+=dt;if(refresh>.10){refresh=0;renderUI();}};
 let saveClock=0;function persistTimer(dt){saveClock+=dt;if(saveClock>2){saveClock=0;persist(held.part);}}
 window.carTouch220={serviceTarget(kind){return parts.find(p=>p.name===(kind==='coolant'?'Coolant cap':'Oil filler'))?.slot;},attach,hit,current,pickup,refit,drop,upgrade,renderUI,get targets(){return targets;},get parts(){return parts;},get held(){return held;},get mirror(){return mirror;}};
})();
