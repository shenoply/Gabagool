/* Interactive dashboard study. All controls are part of the car, not an overlay. */
function createStudyCabin({THREE,car,renderer,camera,getMode,onReach,onStatus}){
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),root=new THREE.Group();root.name='Dashboard details';car.add(root);
 const mat=(c,m=0,r=.5)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r}),brass=mat(0xb99b60,.75,.28),dark=mat(0x172824),ivory=mat(0xe5d7b0),rubber=mat(0x161c19),wood=car.getObjectByName('Dashboard').material;
 const add=(g,m,p,parent=root)=>{const o=new THREE.Mesh(g,m);o.position.copy(p);parent.add(o);return o;};
 const box=(w,h,d,m,p,parent)=>add(new THREE.BoxGeometry(w,h,d),m,p,parent);
 function label(text,w,h,p,parent=root,bg='#172824',fg='#e5d7b0') {const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,512,128);x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';x.font='600 46px Georgia';x.fillText(text,256,64);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const o=add(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}),p,parent);o.rotation.y=Math.PI;return {o,set(text){x.fillStyle=bg;x.fillRect(0,0,512,128);x.fillStyle=fg;x.fillText(text,256,64);t.needsUpdate=true;}};}
 car.traverse(o=>{if(/Gauge face|Gauge surround|Radio console|Radio tuning knob/.test(o.name))o.visible=false;});
 const needles=[];
 for(const [x,r,title,max]of [[-.21,.034,'KM/H',120],[-.126,.025,'RPM',6],[-.056,.017,'FUEL',1]]){
  const g=new THREE.Group();g.position.set(x,.396,.050);root.add(g);const ring=add(new THREE.TorusGeometry(r,.002,8,48),brass,V(),g);add(new THREE.CircleGeometry(r-.001,48),new THREE.MeshStandardMaterial({color:0x10231c,side:THREE.DoubleSide}),V(0,0,-.001),g);
  for(let i=0;i<=12;i++){const a=-Math.PI*.75+i/12*Math.PI*1.5,rr=r*.80;const tick=box(.001,r*.10,.001,ivory,V(Math.sin(a)*rr,Math.cos(a)*rr,-.002),g);tick.rotation.z=-a;}
  label(title,r*1.1,r*.27,V(0,-r*.42,-.003),g);const pivot=new THREE.Group();pivot.position.z=-.004;g.add(pivot);box(.0015,r*.63,.0015,mat(0xb96737),V(0,r*.29,0),pivot);needles.push({pivot,max,title});add(new THREE.SphereGeometry(.003,10,8),brass,V(0,0,-.005),g);
 }
 // A fitted passenger glovebox, brass latch and narrow ventilation slots.
 box(.245,.078,.006,wood,V(.19,.369,.048));for(const y of [.342,.405])box(.244,.0015,.002,brass,V(.19,y,.043));box(.030,.005,.004,brass,V(.19,.387,.039));label('PIP · ROADSTER',.105,.012,V(.19,.36,.039));
 for(let i=0;i<9;i++)box(.004,.022,.003,rubber,V(.325+i*.005,.387,.041));
 // Sloped centre radio shelf within the seated rat's reach.
 const radio=new THREE.Group();radio.position.set(-.11,.423,-.112);radio.name='Dashboard radio';root.add(radio);box(.135,.012,.14,wood,V(-.11,.396,-.038));box(.15,.052,.030,wood,V(),radio);box(.143,.045,.004,brass,V(0,0,-.017),radio);box(.136,.038,.004,dark,V(0,0,-.020),radio);
 const stations=['CANAL WALTZ','NIGHT PIANO','GARDEN JAZZ'];let station=0;const display=label(stations[0],.076,.015,V(0,.006,-.023),radio,'#b8aa73','#24382c');
 for(let i=0;i<13;i++)box(.002,.006,.001,brass,V(-.031+i*.005,-.010,-.024),radio);
 const knobs=[];for(const x of [-.057,.057]){const k=add(new THREE.CylinderGeometry(.009,.009,.008,20),rubber,V(x,0,-.027),radio);k.rotation.x=Math.PI/2;box(.0015,.007,.002,ivory,V(x,.002,-.032),radio);knobs.push(k);}label('VOL',.023,.007,V(-.055,-.016,-.026),radio);label('TUNE',.025,.007,V(.055,-.016,-.026),radio);
 // Mint leaf charm suspended beneath the centre mirror.
 const charm=new THREE.Group();charm.position.set(0,.622,.055);root.add(charm);add(new THREE.CylinderGeometry(.0007,.0007,.065,6),ivory,V(0,-.0325,0),charm);
 const leaf=new THREE.Shape();leaf.moveTo(0,0);leaf.bezierCurveTo(-.023,-.012,-.022,-.041,0,-.052);leaf.bezierCurveTo(.022,-.041,.023,-.012,0,0);const mint=add(new THREE.ExtrudeGeometry(leaf,{depth:.001,bevelEnabled:false,curveSegments:10}),mat(0x497b4c,0,.85),V(0,-.065,0),charm);mint.material.side=THREE.DoubleSide;label('MINT',.025,.007,V(0,-.091,-.001),charm,'#497b4c','#d7dfb5');
 const vein=add(new THREE.CylinderGeometry(.0006,.0006,.042,5),ivory,V(0,-.091,-.001),charm);vein.rotation.z=.07;
 // Driver door pivots at its front hinge; leather, handle and glass move together.
 const door=new THREE.Group();door.position.set(-.438,.30,.104);car.add(door);door.name='Interactive driver door';car.updateMatrixWorld(true);
 const parts=[];car.traverse(o=>{if(!o.isMesh)return;if((o.name==='Hinged door skin'&&o.userData.doorSide219===-1)||(/Saddle leather door insert|Walnut door cap|Door inlay|Door stitching|Door seam|Door handle/.test(o.name)&&o.getWorldPosition(V()).x<-.3))parts.push(o);});parts.forEach(o=>door.attach(o));
 const handle=box(.025,.012,.058,brass,V(-.325,.395,-.18));door.attach(handle);const handleMount=box(.05,.008,.013,wood,V(-.352,.390,-.18));door.attach(handleMount);
 const glassMat=new THREE.MeshStandardMaterial({color:0xb7d3cc,transparent:true,opacity:.22,roughness:.12,side:THREE.DoubleSide,depthWrite:false});
 const glass=box(.003,.18,.39,glassMat,V(-.405,.479,-.11));door.attach(glass);const glassBase=glass.position.clone();
 const rightGlass=box(.003,.18,.39,glassMat,V(.405,.479,-.11));const rightBase=rightGlass.position.clone();
 box(.050,.07,.047,wood,V(-.11,.36,-.190));const switchBase=box(.044,.009,.041,wood,V(-.11,.40,-.190));const windowSwitch=box(.020,.007,.023,brass,V(-.11,.408,-.190));label('WINDOW',.039,.009,V(-.11,.394,-.212));
 let doorOpen=false,windowOpen=false,doorAngle=0,windowLevel=1,action=null,t=0,sway=0,swayV=0,previousAngle=0;
 let audio=null,gain=null,nextNote=0,note=0,radioOn=false;
 function sound(){if(!audio){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;audio=new C();gain=audio.createGain();gain.gain.value=.035;gain.connect(audio.destination);}audio.resume();}
 function music(){if(!audio||!radioOn||audio.state!=='running')return;const now=audio.currentTime;if(nextNote>now+.12)return;nextNote=now+.42;const patterns=[[60,64,67,64,62,65,69,65],[60,67,64,72,67,64,62,67],[60,63,67,70,65,63,62,67]],pitch=patterns[station][note++%8],osc=audio.createOscillator(),env=audio.createGain();osc.type='sine';osc.frequency.value=440*Math.pow(2,(pitch-69)/12);env.gain.setValueAtTime(0,now);env.gain.linearRampToValueAtTime(.32,now+.035);env.gain.exponentialRampToValueAtTime(.001,now+.65);osc.connect(env);env.connect(gain);osc.start(now);osc.stop(now+.7);}
 function activate(kind){if(action)return;const obj=kind==='door'?handle:kind==='window'?windowSwitch:knobs[kind==='volume'?0:1];sound();action={kind,time:0,fired:false,obj,target:obj.getWorldPosition(V())};onStatus('Pip is reaching for the '+(kind==='window'?'right window switch':kind==='door'?'door handle':'radio')+'…');}
 const ray=new THREE.Raycaster(),hits=[handle,windowSwitch,...knobs,display.o];let down=null;
 const el=renderer.domElement;
 el.addEventListener('pointerdown',e=>{if(getMode()!=='cockpit')return;const r=el.getBoundingClientRect();camera.updateMatrixWorld();car.updateMatrixWorld(true);ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const h=ray.intersectObjects(hits)[0];if(!h)return;down={id:e.pointerId,x:e.clientX,y:e.clientY,obj:h.object};el.setPointerCapture(e.pointerId);e.stopImmediatePropagation();},true);
 el.addEventListener('pointermove',e=>{if(down?.id===e.pointerId)e.stopImmediatePropagation();},true);
 for(const type of ['pointerup','pointercancel'])el.addEventListener(type,e=>{if(down?.id!==e.pointerId)return;const d=down;down=null;if(type==='pointerup'&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<15)activate(d.obj===handle?'door':d.obj===windowSwitch?'window':d.obj===knobs[0]?'volume':'radio');e.stopImmediatePropagation();},true);
 function tick(dt,angle,moving){t+=dt;const impulse=(angle-previousAngle)/Math.max(dt,.001);previousAngle=angle;swayV+=(-16*sway-3.4*swayV-impulse*.75+(moving?Math.sin(t*4.5)*.12:0))*dt;sway+=swayV*dt;charm.rotation.z=THREE.MathUtils.clamp(sway,-.42,.42);charm.rotation.x=moving?Math.sin(t*1.6)*.055:charm.rotation.x*Math.exp(-dt*3);
  needles.forEach(n=>n.pivot.rotation.z=n.title==='FUEL'?.6:2.2-(moving?(n.title==='RPM'?2.1:1.7)+Math.sin(t*.8)*.2:0));
  const old=doorAngle;doorAngle=THREE.MathUtils.damp(doorAngle,doorOpen?.85:0,4,dt);door.rotation.y=doorAngle;windowLevel=THREE.MathUtils.damp(windowLevel,windowOpen?0:1,3,dt);rightGlass.scale.y=windowLevel;rightGlass.position.y=rightBase.y-(1-windowLevel)*.09;
  music();let reach=null;if(action){action.time+=dt;const a=action.time,weight=a<.7?THREE.MathUtils.smoothstep(a,0,.7):a<1.15?1:1-THREE.MathUtils.smoothstep(a,1.15,1.9);reach={target:action.target,weight,side:action.kind==='door'?'Right':'Left'};
   if(a>=.85&&!action.fired){action.fired=true;if(action.kind==='door'){doorOpen=!doorOpen;onStatus(doorOpen?'Door opening':'Door closing');}else if(action.kind==='window'){windowOpen=!windowOpen;onStatus(windowOpen?'Right window lowering':'Right window closing');}else if(action.kind==='volume'){radioOn=!radioOn;onStatus(radioOn?'Radio on · original studio music':'Radio off');}else{station=(station+1)%stations.length;radioOn=true;display.set(stations[station]);knobs[1].rotation.y+=.7;onStatus(stations[station]+' · original studio music');}}
   if(a>=1.9){action=null;reach={weight:0};}
  }return reach;
 }
 return {root,charm,door,handle,windowSwitch,knobs,activate,tick,get state(){return {station,radioOn,doorOpen,windowOpen,busy:!!action};}};
}
