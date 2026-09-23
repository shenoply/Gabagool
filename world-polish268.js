/* Build 268: visible whole-map polish — stronger landmarks, paths, den, home and tutorial cues. */
(()=>{
 let yardRoot=null,homeRoot=null,marker=null,lastPhase='';
 const mat=(c)=>new THREE.MeshLambertMaterial({color:c});
 function box268(w,h,d,c){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.userData.noInk=true;return m;}
 function stone268(g,x,z,s=1,c=0x77766b){const m=new THREE.Mesh(new THREE.SphereGeometry(.38,8,6),mat(c));m.scale.set(1.3*s,.28*s,1*s);m.position.set(x,.09*s,z);m.rotation.y=(x*.37+z*.19)%6.28;m.userData.noInk=true;g.add(m);return m;}
 function seedYard268(){
  if(phase!=='scavenge'||yardRoot===root)return;yardRoot=root;
  const g=new THREE.Group();g.name='Build 268 visible yard polish';root.add(g);
  // A clearly readable stepping path from the central yard toward the north/city route.
  const path=[[1,26],[3,28],[4,30],[4,32],[4,34],[4,36]];
  for(let i=0;i<path.length;i++){const [x,z]=path[i];const s=stone268(g,x,z,.72,i%2?0x8b8069:0x756d5e);s.scale.z*=.72;}
  // Strong pond bank: irregular earth/stone ring visible from normal third-person view.
  const px=23.2,pz=32.1;
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=3.25+(i%3)*.14;stone268(g,px+Math.cos(a)*r,pz+Math.sin(a)*r,.62+(i%2)*.08,i%4===0?0x665f4d:0x7e7968);}
  // Larger reed clumps around the water.
  for(const a of [0.35,1.25,2.5,3.45,4.7,5.6]){const rg=new THREE.Group();rg.position.set(px+Math.cos(a)*2.75,0,pz+Math.sin(a)*2.75);for(let j=0;j<6;j++){const r=new THREE.Mesh(new THREE.CylinderGeometry(.018,.03,.75+j*.05,5),mat(0x637747));r.position.set((j-2.5)*.05,.38,Math.sin(j*1.7)*.08);r.rotation.z=(j-2.5)*.025;r.userData.noInk=true;rg.add(r);}g.add(rg);}
  // Lizard den becomes a real landmark rather than a few low rocks.
  const dx=-18.75,dz=24.75;
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2,r=1.05+(i%2)*.2;const s=stone268(g,dx+Math.cos(a)*r,dz+Math.sin(a)*r,.82,i%3===0?0x9c704b:0x7f6047);s.position.y=.12;}
  const denRoof=box268(1.55,.16,.95,0x8e6849);denRoof.position.set(dx,.78,dz);denRoof.rotation.z=.08;g.add(denRoof);
  const denSign=markerText('LIZARD DEN');denSign.position.set(dx,1.48,dz+.2);denSign.scale.setScalar(.2);g.add(denSign);
  // Big Rat territory gets a visible scrap awning and identity.
  const bx=NB.x,bz=NB.z;
  for(const sx of [-1,1]){const p=box268(.11,2.2,.11,0x5e4b38);p.position.set(bx+sx*1.2,1.1,bz-.7);g.add(p);}
  const tarp=box268(2.8,.06,1.9,0x586f63);tarp.position.set(bx,2.16,bz-.7);tarp.rotation.z=-.05;g.add(tarp);
  const ratSign=markerText('BIG RAT');ratSign.position.set(bx,2.55,bz-.72);ratSign.scale.setScalar(.22);g.add(ratSign);
  // Gate/city route marker visible from farther away.
  const archL=box268(.16,2.5,.16,0x6d573d),archR=archL.clone();archL.position.set(3.1,1.25,33.2);archR.position.set(4.9,1.25,33.2);g.add(archL,archR);
  const arch=box268(2,.15,.18,0x6d573d);arch.position.set(4,2.45,33.2);g.add(arch);
  const citySign=markerText('CITY →');citySign.position.set(4,2.78,33.15);citySign.scale.setScalar(.22);g.add(citySign);
 }
 function seedHome268(){
  if(phase!=='house'||homeRoot===root)return;homeRoot=root;
  const g=new THREE.Group();g.name='Build 268 visible home polish';root.add(g);
  // Large warm rug instantly changes the room read without blocking furniture.
  const rug=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.7),new THREE.MeshLambertMaterial({color:0x845e46,side:THREE.DoubleSide}));rug.rotation.x=-Math.PI/2;rug.position.set(.4,.012,.5);rug.userData.noInk=true;g.add(rug);
  const border=new THREE.Mesh(new THREE.RingGeometry(1.1,1.25,4),new THREE.MeshBasicMaterial({color:0xd0b27a,side:THREE.DoubleSide}));border.rotation.x=-Math.PI/2;border.rotation.z=Math.PI/4;border.scale.set(1.55,1,.72);border.position.set(.4,.018,.5);border.userData.noInk=true;g.add(border);
  // Visible overhead beam + warm practical light.
  const beam=box268(HW-1,.16,.18,0x6b4d34);beam.position.set(0,2.7,-.5);g.add(beam);
  const lamp=new THREE.PointLight(0xffbd6a,1.05,12);lamp.position.set(-1.7,2.35,.2);g.add(lamp);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.1,10,8),new THREE.MeshBasicMaterial({color:0xffd899}));bulb.position.copy(lamp.position);bulb.userData.noInk=true;g.add(bulb);
 }
 function tutorialMarker268(){
  if(marker?.parent)marker.parent.remove(marker);marker=null;
  const t=window.tutorial219;if(!t||phase!=='scavenge'||!rat)return;
  const p=t.progress,step=p?.chapter&&t.chapters[p.chapter]?.[p.index];if(!step)return;
  let target=null,label='';
  if(step[0]==='grab'&&sc?.items){const live=sc.items.filter(i=>!i.taken);live.sort((a,b)=>a.m.position.distanceTo(rat.position)-b.m.position.distanceTo(rat.position));target=live[0]?.m;label='GRAB';}
  else if(step[0]==='map'){target=rat;label='MAP';}
  else if(step[0]==='craft'){target=rat;label='CRAFT';}
  if(!target)return;
  marker=new THREE.Group();const cone=new THREE.Mesh(new THREE.ConeGeometry(.14,.35,8),new THREE.MeshBasicMaterial({color:0xffd45c}));cone.rotation.x=Math.PI;cone.position.y=.2;cone.userData.noInk=true;marker.add(cone);const tag=markerText(label);tag.position.y=.55;tag.scale.setScalar(.16);marker.add(tag);root.add(marker);marker.userData.target=target;
 }
 function tickMarker268(){if(!marker?.userData.target)return;const t=marker.userData.target.position;marker.position.set(t.x,t.y+1.25+Math.sin(performance.now()*.004)*.08,t.z);}
 function polishMap268(){const m=document.getElementById('mapGeo267');if(!m||m.dataset.b268)return;m.dataset.b268='1';m.style.opacity='.95';m.innerHTML='<span style="position:absolute;left:36%;top:5%;font-size:8px">CITY</span><span style="position:absolute;left:5%;top:58%;font-size:8px">DEN</span><span style="position:absolute;left:70%;top:57%;font-size:8px">POND</span><span style="position:absolute;left:36%;top:78%;font-size:8px">YARD</span><i style="position:absolute;left:47%;top:25%;width:7%;height:37%;background:#c1bca8;border-radius:3px;opacity:.8"></i><i style="position:absolute;left:20%;top:70%;width:55%;height:2px;background:#9a845e;transform:rotate(-4deg);opacity:.75"></i>';}
 const tick0=tickWorld38;tickWorld38=function(dt){tick0(dt);if(phase!==lastPhase){lastPhase=phase;if(marker?.parent)marker.parent.remove(marker);marker=null;}seedYard268();seedHome268();polishMap268();if(!marker&&phase==='scavenge')tutorialMarker268();tickMarker268();};
 const clear0=clear;clear=function(...args){yardRoot=null;homeRoot=null;if(marker?.parent)marker.parent.remove(marker);marker=null;return clear0(...args);};
 const css=document.createElement('style');css.textContent='#miniMap171{outline:1px solid #e7d39a55!important}#lesson219{box-shadow:0 8px 26px #0008!important}';document.head.appendChild(css);
})();