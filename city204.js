/* Build 204: neighbourhood streets and interactive cockpit. */
(()=>{
 let city=null,clock=0,station=-1;const stations=['Dumpster FM','Alley Groove','Rainy Night'];
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
 const roads209=[[-86,24,40.5,49.5],[52,94,40.5,49.5],[-86,94,60.5,69.5],[-86,94,73.5,82.5],[-86,94,-24.5,-15.5],[-84.5,-75.5,-20,78],[83.5,92.5,-20,78],[-44.5,-35.5,45,78],[15.5,24.5,45,78],[51.5,60.5,45,78],[-66,-58,78,141],[66,74,78,141],[-66,74,137,145]];
 const onRoad=p=>roads209.some(([a,b,c,d])=>p.x>=a&&p.x<=b&&p.z>=c&&p.z<=d);
 const inDistrict=p=>p.x>=-62&&p.x<=70&&p.z>=83&&p.z<=141;
 const inCity=p=>(p.z>=40&&p.z<=66&&p.x>=-15&&p.x<=27)||onRoad(p)||inDistrict(p);
 const connector=p=>p.z>=34&&p.z<=42&&p.x>=1.5&&p.x<=6.5;
 const inExtension=p=>inCity(p)||connector(p);
 function citySolid(p,r=.3){if(p.z>36.3&&!inExtension(p))return true;if(city?.owner===root){if(city.solids.some(o=>Math.abs(p.x-o.x)<o.hx+r&&Math.abs(p.z-o.z)<o.hz+r))return true;if(city.cars.some(t=>Math.hypot(p.x-t.g.position.x,p.z-t.g.position.z)<r+.62))return true;}return false;}
 const blocked=blockedCar77;blockedCar77=function(p,r=.39){if(phase==='scavenge'&&inExtension(p))return citySolid(p,r);if(phase==='scavenge'&&p.z>36.3)return true;return blocked(p,r);};
 const resolve=resolveGeometry62;resolveGeometry62=function(p,before){if(phase==='scavenge'&&inExtension(p)){if(inDistrict(p)||inDistrict(before))resolve(p,before);if(citySolid(p,.2))p.copy(before);return;}resolve(p,before);};
 const walls=wallSolids;wallSolids=function(){const list=walls();return phase==='scavenge'&&city?.owner===root?[...list,...city.solids.map(s=>({...s,h:3}))]:list;};
 const controlBefore=control;control=function(dt,options){if(phase==='scavenge'&&city?.owner===root&&options?.bounds){options={...options,bounds:[-86,94,-25,145],ground:options.ground};const ground=arguments[1].ground;options.ground=(x,z)=>z>36.3?0:ground?ground(x,z):0;const before=rat.position.clone(),result=controlBefore(dt,options);if(rat.position.z>36.3&&!inExtension(rat.position))rat.position.copy(before);return result;}return controlBefore(dt,options);};
 function part(parent,w,h,d,x,y,z,color,name){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.8}));m.position.set(x,y,z);m.name=name;m.userData.noInk=true;parent.add(m);return m;}
 function route(lane){const pts=[],cx=6,cz=53,hx=14+lane,hz=8+lane,r=4;for(let corner=0;corner<4;corner++){const a=corner*Math.PI/2,ox=cx+(corner===0||corner===3?1:-1)*(hx-r),oz=cz+(corner<2?1:-1)*(hz-r);for(let j=0;j<=12;j++){const t=a+j/12*Math.PI/2;pts.push(new THREE.Vector3(ox+Math.cos(t)*r,0,oz+Math.sin(t)*r));}}return new THREE.CatmullRomCurve3(pts,true,'centripetal');}
 function seed(){if(phase!=='scavenge'||!root||city?.owner===root)return;city={owner:root,g:new THREE.Group(),cars:[],solids:[]};root.add(city.g);const g=city.g;g.name='Open city streets';
 const dashes209=[];for(const [a,b,c,d] of roads209){part(g,b-a,.04,d-c,(a+b)/2,-.018,(c+d)/2,0x484c50,'Open neighbourhood road');const horizontal=b-a>d-c;const length=horizontal?b-a:d-c;for(let n=3;n<length-2;n+=4)dashes209.push([horizontal?1.7:.08,horizontal?.08:1.7,horizontal?a+n:(a+b)/2,horizontal?(c+d)/2:c+n]);}
 const markings=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xdccda6,roughness:1}),dashes209.length),transform=new THREE.Object3D();markings.name='Batched city road markings';dashes209.forEach(([w,d,x,z],i)=>{transform.position.set(x,.012,z);transform.scale.set(w,.012,d);transform.updateMatrix();markings.setMatrixAt(i,transform.matrix);});g.add(markings);

 part(g,42,.04,26,6,-.025,53,0x484c50,'City asphalt');part(g,5,.045,12,4,0,38,0x484c50,'Open north driveway');
 // The island keeps both carriageways clear and gives the loop a recognisable centre.
 part(g,19,.10,6,6,.02,53,0xa59c86,'City block pavement');city.solids.push({x:6,z:53,hx:9.5,hz:3});
 const names=['CRUMB CAFÉ','VINYL & TAIL','NIGHT MARKET'];for(let i=0;i<3;i++){const x=-.5+i*6.5,h=[3.2,4.5,3.7][i];part(g,5.5,h,4.6,x,h/2,53,[0x97705b,0x607c79,0xb39866][i],'City shop');for(const side of [-1,1]){part(g,4.8,.16,.65,x,1.25,53+side*2.45,0x294d40,'Shop awning');for(const dx of [-1.5,0,1.5])part(g,.8,.75,.04,x+dx,.65,53+side*2.32,0xa7c6bd,'Shop window');const tag=markerText(names[i]);tag.position.set(x,1.75,53+side*2.36);tag.scale.setScalar(.25);if(side>0)tag.rotation.y=Math.PI;g.add(tag);}}
 for(const z of [45,61])for(let x=-7;x<=19;x+=2.4)part(g,1.2,.012,.055,x,.007,z,0xdccda6,'Road centre dash');for(const x of [-8,20])for(let z=49;z<=57;z+=2.4)part(g,.055,.012,1.2,x,.007,z,0xdccda6,'Road centre dash');
 for(const z of [41,65])for(let x=-11;x<=23;x+=8){part(g,.08,2.8,.08,x,1.4,z,0x263e39,'Street lamp');part(g,.35,.12,.35,x,2.83,z,0xf3dfad,'Street lantern');}
 for(let i=0;i<7;i++)part(g,.32,.015,3.7,2.6+i*.48,.013,41.8,0xe1d8bb,'Crosswalk');
 const tag=markerText('CITY ↑  •  TRAFFIC');tag.position.set(4,1.5,36);tag.scale.setScalar(.32);g.add(tag);
 for(let i=0;i<6;i++){const lane=i%2?1.1:-1.1,curve=route(lane),t=i/6,car=new THREE.Group();car.name='City traffic';const color=[0xb8664e,0x627d99,0xd0af68,0x617e66,0x8d7398,0xb9b9a4][i];part(car,.80,.25,1.45,0,.28,0,color,'Compact car body');part(car,.67,.30,.68,0,.54,-.12,color,'Cabin');part(car,.58,.21,.025,0,.55,.23,0x9ab7bd,'Windshield');for(const x of [-.42,.42])for(const z of [-.45,.45]){const tyre=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.10,12),new THREE.MeshStandardMaterial({color:0x202322}));tyre.rotation.z=Math.PI/2;tyre.position.set(x,.19,z);car.add(tyre);}for(const x of [-.25,.25])part(car,.12,.07,.02,x,.32,.735,0xf3e2b4,'Headlight');g.add(car);const traffic={g:car,curve,length:curve.getLength(),u:t,direction:i%2?1:-1,speed:0};car.position.copy(curve.getPointAt(t));city.cars.push(traffic);}
 }
 const add=addCar77;addCar77=function(){add();seed();};
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);if(phase!=='scavenge')return;seed();if(!gameplayActive()||document.hidden){release();return;}dt=Math.min(.05,Math.max(0,dt));clock+=dt;
 for(const t of city.cars){const tangent=t.curve.getTangentAt(t.u).multiplyScalar(t.direction),p=t.g.position;let stop=false;const obstacles=city.cars.filter(a=>a!==t).map(a=>a.g.position);if(car77)obstacles.push(car77.g.position);if(rat&&!car77?.riding)obstacles.push(rat.position);for(const o of obstacles){const v=o.clone().sub(p),ahead=v.dot(tangent),lateral=Math.abs(v.x*tangent.z-v.z*tangent.x);if(ahead>-.2&&ahead<3.3&&lateral<1.05)stop=true;}t.speed=THREE.MathUtils.damp(t.speed,stop?0:2.1,stop?12:2,dt);const next=(t.u+t.direction*t.speed*dt/t.length+1)%1,goal=t.curve.getPointAt(next);if(!obstacles.some(o=>goal.distanceTo(o)<1.05)){t.u=next;t.g.position.copy(goal);}t.g.rotation.y=Math.atan2(tangent.x,tangent.z);}
 const c=car77;if(!c)return;const wet=weather42().rain,mode=c.wiperMode||0,on=mode===1||(mode===0&&wet>.08);c.wiperPhase=(c.wiperPhase||0)+(on?dt*(3+wet*4):0);const target=on?Math.cos(c.wiperPhase)*1.05:1.12;for(const w of c.wipers)w.rotation.z=THREE.MathUtils.damp(w.rotation.z,target,18,dt);
 c.signalTime=(c.signalTime||0)+dt;if(Math.abs(c.steer)>.35)c.signalTurned=true;if(c.indicator&&(c.signalTime>9||(c.signalTurned&&Math.abs(c.steer)<.08&&c.signalTime>1.2))){c.indicator=0;updateSignals();}for(const l of c.indicators)l.material.emissiveIntensity=c.indicator===l.userData.side&&clock%.8<.4?2:0;
 if(c.reach?.kind==='radio')c.radioKnob.rotation.z=Math.sin(c.reach.time/c.reach.duration*Math.PI)*.8;
 };
 window.city204={roads209,onRoad,inDistrict,seed,route,inExtension,citySolid,get state(){return city;},release,tune,signal};
})();
