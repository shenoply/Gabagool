/* Build 267: whole-map polish pass — backyard, home, wildlife and navigation. */
(()=>{
 let yardOwner=null,homeOwner=null,mapDone=false,roamClock=0;
 const makeMat=(c)=>new THREE.MeshLambertMaterial({color:c});
 function addReed267(parent,x,z,s=1){const g=new THREE.Group(),m=makeMat(0x6f7f49);for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.CylinderGeometry(.015,.024,.42+(.08*i),5),m);r.position.set((i-1.5)*.055,.21,Math.sin(i*2.1)*.05);r.rotation.z=(i-1.5)*.035;r.userData.noInk=true;g.add(r);}g.position.set(x,0,z);g.scale.setScalar(s);parent.add(g);return g;}
 function addStone267(parent,x,z,s=.25){const m=new THREE.Mesh(new THREE.SphereGeometry(1,7,5),makeMat(0x7b7b6f));m.scale.set(s,.08,s*.75);m.position.set(x,.035,z);m.rotation.y=(x+z)*.73;m.userData.noInk=true;parent.add(m);return m;}
 function scratch267(parent,x,z,rot=0){const g=new THREE.Group(),mat=new THREE.LineBasicMaterial({color:0x7c6449,transparent:true,opacity:.65});for(let i=-1;i<=1;i++){const pts=[new THREE.Vector3(i*.07,0,0),new THREE.Vector3(i*.05+.03,.005,.38)];const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat);l.rotation.y=rot;l.position.set(x,.022,z);g.add(l);}parent.add(g);}
 function seedYard267(){
  if(phase!=='scavenge'||yardOwner===root)return;yardOwner=root;
  const g=new THREE.Group();g.name='Build 267 backyard polish';root.add(g);
  const px=23.2,pz=32.1;
  [[-2.6,-.8],[2.4,-.5],[-2.0,1.5],[1.9,1.7],[-.6,-2.0],[.8,2.2]].forEach(([dx,dz],i)=>addReed267(g,px+dx,pz+dz,.8+(i%3)*.12));
  [[-2.9,.2],[2.8,.6],[-1.4,-2.1],[1.3,2.35],[0,-2.45]].forEach(([dx,dz],i)=>addStone267(g,px+dx,pz+dz,.28+(i%2)*.06));
  scratch267(g,-18.8,24.3,.25);scratch267(g,-18.5,24.7,.18);
  const pathMat=new THREE.MeshBasicMaterial({color:0x8a7858,transparent:true,opacity:.24,depthWrite:false});
  for(const [x,z,sy] of [[-14,25,1],[-9,26,1],[4,26,1],[12,27,1],[18,29,1]]){const p=new THREE.Mesh(new THREE.CircleGeometry(.32,14),pathMat);p.rotation.x=-Math.PI/2;p.scale.set(1,.55,1);p.position.set(x,.018,z);p.userData.noInk=true;g.add(p);}
  const postMat=makeMat(0x6d563a);
  for(const [x,z,label] of [[29.1,19,'GATE'],[4,31.4,'CITY']]){const post=new THREE.Mesh(new THREE.BoxGeometry(.12,.85,.12),postMat);post.position.set(x,.425,z);post.userData.noInk=true;g.add(post);const sign=markerText(label);sign.scale.setScalar(.16);sign.position.set(x,.95,z);g.add(sign);}
 }
 function seedHome267(){
  if(phase!=='house'||homeOwner===root)return;homeOwner=root;
  const g=new THREE.Group();g.name='Build 267 home atmosphere';root.add(g);
  const lamp=new THREE.PointLight(0xffc67a,.55,8);lamp.position.set(-2.2,2.35,-1.4);g.add(lamp);
  const warm=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),new THREE.MeshBasicMaterial({color:0xffd79a}));warm.position.copy(lamp.position);warm.userData.noInk=true;g.add(warm);
  const crackMat=new THREE.LineBasicMaterial({color:0x6e5d4d,transparent:true,opacity:.38});
  for(const [x,y] of [[-3.7,1.1],[3.6,1.35],[1.2,.7]]){const pts=[new THREE.Vector3(x,y,-HD/2+.02),new THREE.Vector3(x+.15,y-.2,-HD/2+.02),new THREE.Vector3(x-.02,y-.38,-HD/2+.02),new THREE.Vector3(x+.19,y-.58,-HD/2+.02)];g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),crackMat));}
 }
 function polishMiniMap267(){
  if(mapDone)return;const map=document.getElementById('miniMap171');if(!map)return;mapDone=true;
  map.style.background='linear-gradient(#68756a 0 30%,#435f45 30% 100%)';
  const o=document.createElement('div');o.id='mapGeo267';o.setAttribute('aria-hidden','true');o.style.cssText='position:absolute;inset:0;pointer-events:none;opacity:.72;font:700 7px system-ui;color:#f5e8c8;text-shadow:0 1px 2px #000';
  o.innerHTML='<span style="position:absolute;left:36%;top:6%">CITY</span><span style="position:absolute;left:7%;top:59%">DEN</span><span style="position:absolute;left:68%;top:57%">POND</span><span style="position:absolute;left:38%;top:75%">YARD</span><i style="position:absolute;left:48%;top:29%;width:5%;height:31%;background:#aaa69a;opacity:.7"></i>';map.appendChild(o);
 }
 function roamZaytona267(dt){
  if(phase!=='scavenge'||!zaytona||zaytona.owner!==root)return;roamClock+=dt;if(roamClock<22)return;roamClock=0;
  const c=zaytona;if(c.path.length||c.dwell>0)return;const spots=[[20.8,31.5],[-17.8,24.2],[7.5,29.5],[12,7]];const q=spots[Math.floor((ensureLife().clock/22)%spots.length)];if(c.grid.free(q[0],q[1])){const p=c.grid.path(c.g.position,{x:q[0],z:q[1]});if(p.length){c.path=p;c.walkClip=['Walk','ConfidentWalk','Strut'][Math.floor(Math.random()*3)];c.dwell=7;}}
 }
 const tick0=tickWorld38;tickWorld38=function(dt){tick0(dt);if(phase==='scavenge')seedYard267();if(phase==='house')seedHome267();polishMiniMap267();roamZaytona267(Math.min(.05,dt));};
 const clear0=clear;clear=function(...args){yardOwner=null;homeOwner=null;return clear0(...args);};
 const css=document.createElement('style');css.textContent='#navigation201 #miniMap171{border:1px solid #d7c89a66!important;box-shadow:0 5px 18px #0004}#navTarget201{max-width:190px}#lesson219{max-width:280px}';document.head.appendChild(css);
 window.mapPolish267={};
})();