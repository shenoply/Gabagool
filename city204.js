/* Build 204: neighbourhood streets and interactive cockpit. */
(()=>{
 let city=null,clock=0,station=-1,stuckClock262=0,lastPos262=null;const stations=['Dumpster FM','Alley Groove','Rainy Night'];
 const active=()=>!!car77?.riding&&gameplayActive();
 function button(label,fn){const b=document.createElement('button');b.className='btn';b.textContent=label;b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();fn(b);};carPanel77.appendChild(b);return b;}
 const drift=button('Hold drift',b=>{if(!active())return;car77.drifting=true;car77.reach={kind:'brake',time:0,duration:.75};b.setAttribute('aria-pressed','true');});
 function release(){if(car77)car77.drifting=false;drift.setAttribute('aria-pressed','false');}
 for(const event of ['pointerup','pointercancel','blur'])addEventListener(event,release);document.addEventListener('visibilitychange',release);
 function signal(side){if(!active())return;car77.indicator=car77.indicator===side?0:side;car77.signalTime=0;car77.signalTurned=false;updateSignals();}
 const left=button('◀ Indicator',()=>signal(-1)),right=button('Indicator ▶',()=>signal(1));
 function updateSignals(){left.setAttribute('aria-pressed',String(car77?.indicator===-1));right.setAttribute('aria-pressed',String(car77?.indicator===1));}
 function tune(){if(!active())return;station=(station+1)%4;radioStop();if(station<3){radio.preset204=station;if(voiceOn){radio.on=true;radio.mode='station';radioStation(true);$('rplay').textContent='Stop';$('rnow').textContent=stations[station];}}radioButton.textContent=station<3?'♪ '+stations[station]:'Radio off';car77.reach={kind:'radio',time:0,duration:1.1};sayToast(station<3?stations[station]+(voiceOn?'':' · sound muted'):'Radio off');}
 const radioButton=button('♪ Radio',tune);
 const wiper=button('Wipers: Auto',b=>{if(!active())return;car77.wiperMode=((car77.wiperMode||0)+1)%3;b.textContent='Wipers: '+['Auto','On','Off'][car77.wiperMode];});
 button('City map',()=>openYard201('city'));
 addEventListener('keydown',e=>{if(e.repeat||!active()||/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||''))return;const k=e.key.toLowerCase();if(k==='shift'){e.preventDefault();car77.drifting=true;car77.reach={kind:'brake',time:0,duration:.75};}if(k==='q')signal(-1);if(k==='r')signal(1);if(k==='n')tune();});addEventListener('keyup',e=>{if(e.key==='Shift')release();});
 const style=document.createElement('style');style.textContent='#carPanel203{right:max(8px,env(safe-area-inset-right))!important;bottom:156px!important;width:min(280px,61vw);max-width:280px;max-height:42dvh;overflow:auto;align-content:flex-end;touch-action:none}#carPanel203 button{min-height:40px;flex:1 0 42%;padding:7px 8px!important;font-size:12px!important}#carPanel203 button[aria-pressed=true]{background:#efbe62;color:#1b322c}@media(max-height:500px){#carPanel203{bottom:12px!important;right:12px!important;width:270px;max-height:64dvh}}';document.head.appendChild(style);
 const roads209=[[1.15,6.85,33.4,72]];
 const entryCorridor259=p=>p.x>=.35&&p.x<=7.65&&p.z>=31.8&&p.z<=76;
 function findSafeCityEntry260(){
  const col=city?.collision;if(!col)return null;
  const b=col.bounds,centerX=(b.min.x+b.max.x)/2;
  // Search progressively deeper into the imported city for a genuinely open rat/car-sized patch.
  for(const z of [b.min.z+6,b.min.z+12,b.min.z+20,b.min.z+30,b.min.z+42,b.min.z+58]){
   for(let ring=0;ring<18;ring++)for(const side of ring?[1,-1]:[1]){
    const x=centerX+side*ring*2.2,p={x,z};
    if(x<b.min.x+2||x>b.max.x-2||z>b.max.z-2)continue;
    if(!col.blocked(p,.8))return new THREE.Vector3(x,0,z);
   }
  }
  return new THREE.Vector3(centerX,0,Math.min(b.max.z-4,b.min.z+18));
 }
 function rescueCity262(){
  const dest=findSafeCityEntry260();if(!dest||!rat)return false;
  if(car77?.riding){car77.g.position.copy(dest);car77.g.position.y=0;car77.speed=0;rat.position.copy(dest);}
  else{rat.position.copy(dest);rat.position.y=0;rat.userData.air=false;rat.userData.vy=0;rat.userData.wallState=null;rat.userData.climb=null;}
  gameCam.ready=false;sayToast('Moved to a clear city street');return true;
 }
 function transferIntoCity260(){
  if(!city?.collision)return false;const dest=findSafeCityEntry260();if(!dest)return false;
  if(car77?.riding){
   car77.g.position.copy(dest);car77.g.position.y=0;car77.speed=0;car77.g.rotation.y=0;
   rat.position.copy(dest);
  }else{
   rat.position.copy(dest);rat.position.y=0;rat.userData.air=false;rat.userData.vy=0;rat.userData.wallState=null;rat.userData.climb=null;
  }
  gameCam.ready=false;sayToast('Entered the city');return true;
 }
 const inDistrict=p=>{const b=city?.collision?.bounds;return !!b&&p.x>=b.min.x&&p.x<=b.max.x&&p.z>=b.min.z&&p.z<=b.max.z;};
 const onRoad=p=>roads209.some(([a,b,c,d])=>p.x>=a&&p.x<=b&&p.z>=c&&p.z<=d);
 const inExtension=p=>onRoad(p)||inDistrict(p);
 function citySolid(p,r=.3){if(entryCorridor259(p))return false;return inDistrict(p)&&!!city?.collision?.blocked(p,r);}
 const blocked=blockedCar77;blockedCar77=function(p,r=.39){if(phase==='scavenge')return citySolid(p,r);return blocked(p,r);};
 const resolve=resolveGeometry62;resolveGeometry62=function(p,before){if(phase==='scavenge'&&(entryCorridor259(p)||entryCorridor259(before)))return;if(phase==='scavenge'&&(inDistrict(p)||inDistrict(before))){city?.collision?.resolve(p,before,.2);return;}resolve(p,before);};
 const controlBefore=control;control=function(dt,options){if(phase==='scavenge'&&city?.owner===root&&options?.bounds){const ground=options.ground,b=city?.collision?.bounds;const dynamic=b?[Math.min(-86,b.min.x-8),Math.max(94,b.max.x+8),Math.min(-25,b.min.z-8),Math.max(180,b.max.z+8)]:[-86,94,-25,180];options={...options,bounds:dynamic,ground:(x,z)=>inExtension({x,z})?0:ground?ground(x,z):0};const before=rat.position.clone(),result=controlBefore(dt,options);return result;}return controlBefore(dt,options);};
 function part(parent,w,h,d,x,y,z,color,name){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.8}));m.position.set(x,y,z);m.name=name;m.userData.noInk=true;parent.add(m);return m;}
 function seed(){if(phase!=='scavenge'||!root)return;
  if(city?.owner!==root){city={owner:root,g:new THREE.Group(),cars:[],solids:[],collision:null};root.add(city.g);city.g.name='Original city entrance';
   part(city.g,7.2,.018,45,4,.001,53.5,0x3f4245,'Main city road');
   part(city.g,.72,.12,31,.55,.055,60.5,0xb8b0a2,'Left city curb');
   part(city.g,.72,.12,31,7.45,.055,60.5,0xb8b0a2,'Right city curb');
   part(city.g,.55,3.2,.55,.55,1.6,34.2,0x5c5041,'Main city gate left');
   part(city.g,.55,3.2,.55,7.45,1.6,34.2,0x5c5041,'Main city gate right');
   part(city.g,7.45,.42,.55,4,3.05,34.2,0x5c5041,'Main city gate lintel');
   const sign=markerText('CITY');sign.position.set(4,3.08,34.05);sign.scale.setScalar(.28);city.g.add(sign);
  }
  const actor=actors44.find(a=>a.id==='city'&&a.owner===root);if(actor&&!city.collision){
   // Build 248: expand the supplied human city further so Pip reads as a true rat.
   // Re-scale before generating collision, then pin the original entrance back to z=56 so the yard gate still joins it.
   if(!actor.g.userData.cityScale259){actor.g.userData.cityScale259=true;actor.g.scale.multiplyScalar(6.5);actor.g.updateWorldMatrix(true,true);let b=new THREE.Box3().setFromObject(actor.g);actor.g.position.x+=4-(b.min.x+b.max.x)/2;actor.g.position.z+=70-b.min.z;actor.g.updateWorldMatrix(true,true);}
   city.collision=buildCityCollision210(THREE,actor.g);city.model=actor.g;}
 }
 const add=addCar77;addCar77=function(){add();seed();};
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);if(phase!=='scavenge')return;seed();if(!gameplayActive()||document.hidden){release();return;}dt=Math.min(.05,Math.max(0,dt));clock+=dt;
 // Crossing the north-gate threshold transfers Pip/the roadster to an open street in the real imported city.
 if(city?.collision&&rat&&rat.position.x>.3&&rat.position.x<7.7&&rat.position.z>54&&rat.position.z<70&&!inDistrict(rat.position)){transferIntoCity260();}
 if(city?.collision&&rat&&inDistrict(rat.position)){
   const moving=Math.hypot(joy.x,joy.z)>.2||['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].some(k=>keys[k])||(car77?.riding&&Math.abs(car77.speed)>.08);
   if(!lastPos262)lastPos262=rat.position.clone();
   const travelled=rat.position.distanceTo(lastPos262);lastPos262.copy(rat.position);
   stuckClock262=moving&&travelled<.003?stuckClock262+dt:Math.max(0,stuckClock262-dt*2);
   if(stuckClock262>2.2){stuckClock262=0;rescueCity262();}
 }else{stuckClock262=0;lastPos262=null;}
 const c=car77;if(!c)return;const wet=weather42().rain,mode=c.wiperMode||0,on=mode===1||(mode===0&&wet>.08);c.wiperPhase=(c.wiperPhase||0)+(on?dt*(3+wet*4):0);const target=on?Math.cos(c.wiperPhase)*1.05:1.12;for(const w of c.wipers)w.rotation.z=THREE.MathUtils.damp(w.rotation.z,target,18,dt);
 c.signalTime=(c.signalTime||0)+dt;if(Math.abs(c.steer)>.35)c.signalTurned=true;if(c.indicator&&(c.signalTime>9||(c.signalTurned&&Math.abs(c.steer)<.08&&c.signalTime>1.2))){c.indicator=0;updateSignals();}for(const l of c.indicators)l.material.emissiveIntensity=c.indicator===l.userData.side&&clock%.8<.4?2:0;
 if(c.reach?.kind==='radio')c.radioKnob.rotation.z=Math.sin(c.reach.time/c.reach.duration*Math.PI)*.8;
 };
 function climbSolids(){
  if(!city?.collision)return [];
  if(city.climbCache248)return city.climbCache248;
  const top=Math.max(3,city.collision.bounds.max.y),out=[],segments=city.collision.segments;
  const stride=Math.max(1,Math.ceil(segments.length/120));
  for(let i=0;i<segments.length&&out.length<120;i+=stride){
   const s=segments[i],dx=s.b.x-s.a.x,dz=s.b.z-s.a.z,len=Math.hypot(dx,dz);if(len<1.4)continue;
   if(Math.abs(dx)>Math.abs(dz)*5)out.push({x:(s.a.x+s.b.x)/2,z:(s.a.z+s.b.z)/2,hx:Math.min(len/2,7),hz:.07,h:top,cityClimb247:true});
   else if(Math.abs(dz)>Math.abs(dx)*5)out.push({x:(s.a.x+s.b.x)/2,z:(s.a.z+s.b.z)/2,hx:.07,hz:Math.min(len/2,7),h:top,cityClimb247:true});
  }
  city.climbCache248=out;
  return out;
 }
 const wallBefore248=wallSolids;wallSolids=function(){const base=wallBefore248();if(phase==='scavenge'&&city?.collision)return [...base,...climbSolids()];return base;};
 window.city204={roads209,onRoad,inDistrict,entryCorridor259,findSafeCityEntry260,transferIntoCity260,rescueCity262,seed,inExtension,citySolid,climbSolids,get state(){return city;},release,tune,signal};
})();
