/* Build 265: map/tutorial polish, entrance smoothing, quieter HUD, steadier traffic. */
(()=>{
 let polishedRoot=null,entrance=null;
 function polishEntrance265(){
  const state=window.city204?.state;if(!state?.owner||state.owner!==root||polishedRoot===root)return;
  polishedRoot=root;
  const g=new THREE.Group();g.name='Build 265 city entrance polish';
  const roadMat=new THREE.MeshStandardMaterial({color:0x3f4245,roughness:.92});
  const curbMat=new THREE.MeshStandardMaterial({color:0xa9a297,roughness:.95});
  const approach=new THREE.Mesh(new THREE.BoxGeometry(7.25,.025,9),roadMat);approach.position.set(4,.006,34.9);approach.name='Smooth city approach';approach.userData.noInk=true;g.add(approach);
  for(const x of [.48,7.52]){const c=new THREE.Mesh(new THREE.BoxGeometry(.55,.07,6.7),curbMat);c.position.set(x,.03,36.1);c.userData.noInk=true;g.add(c);}
  const lineMat=new THREE.MeshBasicMaterial({color:0xd7d0b4});
  for(const z of [34.6,37.3]){const m=new THREE.Mesh(new THREE.BoxGeometry(.07,.015,1.3),lineMat);m.position.set(4,.025,z);m.userData.noInk=true;g.add(m);}
  root.add(g);entrance=g;
 }
 function simplifyTutorial265(){
  const t=window.tutorial219;if(!t?.chapters||t.chapters.foot.length<=8)return;
  t.chapters.foot.splice(0,t.chapters.foot.length,
   ['move','Move Pip','Use the joystick or WASD. Walk a short distance.'],
   ['look','Look around','Drag the scene to turn the camera. Pinch to zoom.'],
   ['grab','Pick something up','Walk to nearby scrap and use Grab.'],
   ['bag','Open your bag','Open Bag once, then close it and keep playing.'],
   ['map','Use the map','Open the map and choose a destination.'],
   ['craft','Craft something','Open Craft and inspect one recipe.'],
   ['footView','Try Rat view','Switch between first and third person.'],
   ['menu','Done','Open Menu any time for the full controls guide.']
  );
 }
 function cleanerHud265(){
  const nav=document.getElementById('navigation201');if(!nav)return;
  nav.style.transition='opacity .18s ease,transform .18s ease';
  const target=document.getElementById('navTarget201');if(target)target.style.fontSize='10px';
 }
 function trafficPolish265(){
  const c=window.cityTraffic261;if(!c)return;
  const traffic=c.traffic||[];
  for(let i=0;i<traffic.length;i++){const t=traffic[i];if(!t||!t.g)continue;t.baseSpeed=Math.min(t.baseSpeed||4,3.4+(i%3)*.28);}
 }
 const tick0=tickWorld38;
 tickWorld38=function(dt){tick0(dt);if(phase!=='scavenge')return;polishEntrance265();simplifyTutorial265();cleanerHud265();trafficPolish265();};
 const clear0=clear;clear=function(...args){polishedRoot=null;entrance=null;return clear0(...args);};
 const css=document.createElement('style');css.textContent='#lesson219{backdrop-filter:blur(4px)}#lesson219 p{margin:4px 0 7px!important}#lesson219 strong{font-size:12px}#navigation201.tools-open208{box-shadow:0 8px 28px #0005}#navigation201 #navTarget201{opacity:.9}#navigation201 button{letter-spacing:.01em}';document.head.appendChild(css);
})();