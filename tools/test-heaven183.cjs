// Headless controller tests with real Three.js geometry, no renderer required.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const THREE={...require('../three-r128-build55.js')};
THREE.TextureLoader=class{load(){return new THREE.Texture();}};
const elements=new Map();
function element(){return {style:{},classList:{add(){},remove(){}},remove(){},appendChild(){},querySelectorAll(){return [element(),element(),element()];},getContext(){return {fillRect(){},strokeRect(){},fillText(){}};}};}
const $=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
let captures;
const c={THREE,console,URLSearchParams,location:{search:''},document:{createElement:element,body:element(),head:element()},$,addEventListener(){},MT:color=>new THREE.MeshStandardMaterial({color}),root:new THREE.Group(),scene:new THREE.Scene(),sun:{},hemi:{},sfx:{rain(){}},radioStop(){},exitPhoto(){},closeModal(){},sayToast(){},save(){},home:{},HD:8,phase:'scavenge',sc:null,keys:{},joy:{x:0,z:0},gameCam:{yaw:0,pitch:.38,distance:4.8,ready:false},camera:new THREE.PerspectiveCamera(55,.6,.01,150),ui:{title:element(),pad:element(),prompt:element()},makeRat(){const r=new THREE.Group();r.animate=()=>{};return r;},clear(){c.root=new THREE.Group();},startScavenge(){c.clear();c.phase='scavenge';},startHouse(){c.clear();c.phase='house';},startArea(){},tickProps57(){},useGate57(){},nearGate57(){return false;},doJump(){},grab(){},toggleCrawl169(){c.rat.userData.crawl169=!c.rat.userData.crawl169;},rotateBone69(){},zoomGame(f){c.gameCam.distance*=f;},modal(...args){captures=args;},loader88:{load(file,cb){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.BoxGeometry(1,.3,.5)));cb({scene:g,animations:[]});}}};c.window=c;
c.menu65=()=>{};c.requestAnimationFrame=fn=>fn();c.rat=null;c.gameCam.pos=new THREE.Vector3();vm.createContext(c);
// Expose state in this test VM only, never in the shipped course.
const source=fs.readFileSync(require('path').join(__dirname,'../heaven-course183.js'),'utf8').replace('  const previousClear=clear;','  window.test183={state:()=>H,checkpoints,respawn,underRoof};\n  const previousClear=clear;');
vm.runInContext(source,c);c.startHeaven183();let h=c.test183.state();
assert(h.platforms.length>60);assert.equal(h.actions.length,6);assert(h.animals.bird&&h.animals.lizard);
assert(h.solids.length>h.platforms.length,'structural props are collidable');
for(const cloud of c.root.children.filter(m=>m.name==='Cosmetic distant cloud')){assert(cloud.position.y<0&&Math.abs(cloud.position.x)>30);assert(!h.solids.some(s=>s.m===cloud));}
function ticks(n){for(let i=0;i<n;i++)c.tickHeaven183(1/60);}
ticks(5);assert.equal(c.rat.position.y,12);c.doJump();assert.equal(h.transit.type,'leap');ticks(230);assert(!h.opening);assert(h.completed.leap);assert.equal(c.rat.position.y,0);
c.keys.w=true;ticks(175);c.keys.w=false;console.log('Stairs end',c.rat.position.toArray());assert(c.rat.position.y>2.3,'stairs should be walkable');
// Jump is genuine ballistic movement with a landing, not a teleport.
c.rat.position.set(0,2.4,-7.6);h.vy=0;h.grounded=true;ticks(2);assert.equal(h.checkpoint,1);c.doJump();ticks(15);assert(c.rat.position.y>3);ticks(70);assert.equal(c.rat.position.y,2.4);
// Verify each interaction arrives on its destination and awards the next checkpoint.
for(const [takeoff,landing,y] of [[-8.5,-10.7,2.9],[-10.95,-13.15,3.45],[-13.35,-15.5,4]]){
  c.keys.w=true;for(let i=0;i<180&&c.rat.position.z>takeoff;i++)c.tickHeaven183(1/60);c.doJump();for(let i=0;i<180&&c.rat.position.z>landing;i++)c.tickHeaven183(1/60);c.keys.w=false;ticks(40);assert(Math.abs(c.rat.position.y-y)<.02,'jump gap landing '+landing);
}
for(const [type,checkpoint] of [['climb',2],['zipline',3],['bird',7]]){
  h.checkpoint=checkpoint;const a=h.actions.find(x=>x.type===type);c.rat.position.copy(a.p);h.grounded=true;c.grab();assert(h.transit,type+' starts');c.keys.w=true;ticks(Math.ceil(a.duration*60)+2);c.keys.w=false;assert(!h.transit,type+' ends');assert(h.completed[type]);assert.equal(h.checkpoint,checkpoint+1);assert(c.rat.position.distanceTo(a.to)<.16);
}
// Standing cannot enter tunnel; crawling can and cannot stand/jump inside it.
h.checkpoint=6;h.transit=null;h.vy=0;h.grounded=true;c.rat.position.set(14,9,-40);c.rat.userData.crawl169=false;c.keys.w=true;ticks(30);assert(c.rat.position.z>-40.6);c.toggleCrawl169();ticks(70);assert(c.rat.position.z<-40.7);assert(h.completed.crawl);assert(c.test183.underRoof());c.toggleCrawl169();assert(c.rat.userData.crawl169);c.doJump();assert(h.grounded);c.keys.w=false;
// Falls return safely; reward persists in home data; leaving clears course state.
c.rat.position.y=-40;ticks(1);assert(c.rat.position.distanceTo(new THREE.Vector3(...c.test183.checkpoints[6].p))<.1);
h.checkpoint=5;c.rat.position.copy(h.actions.find(a=>a.type==='lizard').p);c.grab();c.keys.w=true;for(let i=0;i<700;i++){const ride=h.transit;if(ride){const target=ride.progress<.36?.65:ride.progress<.62?-.65:.65;const delta=target-(ride.offset||0);c.joy.x=Math.abs(delta)>.04?Math.sign(delta):0;}c.tickHeaven183(1/60);}c.joy.x=0;c.keys.w=false;assert(h.completed.lizard);assert.equal(h.checkpoint,6);
// Barrier impact stops the mount; reverse backs away instead of killing Pip.
h.checkpoint=5;c.rat.position.copy(h.actions.find(a=>a.type==='lizard').p);c.grab();c.keys.w=true;ticks(150);assert(h.transit?.blocked);const stopped=h.transit.progress;ticks(20);assert.equal(h.transit.progress,stopped);c.keys.w=false;c.keys.s=true;ticks(30);assert(h.transit.progress<stopped);c.keys.s=false;c.test183.respawn();
// Steering off the track falls into the den and returns to the run checkpoint.
h.checkpoint=5;delete h.completed.lizard;c.rat.position.copy(h.actions.find(a=>a.type==='lizard').p);c.grab();c.keys.w=true;c.keys.d=true;ticks(150);c.keys.w=false;c.keys.d=false;assert(!h.transit);assert(!h.completed.lizard);assert.equal(h.checkpoint,5);
for(const [type,cp] of [['wall',6],['climb',2]]){h.checkpoint=cp;const a=h.actions.find(a=>a.type===type);c.rat.position.copy(a.p);c.grab();c.keys.w=true;for(let i=0;i<Math.ceil(a.duration*60)+2;i++){c.tickHeaven183(1/60);if(h.transit&&h.transit.progress>.14&&h.transit.progress<.77)assert(c.rat.position.z>(type==='wall'?-44.6:-15.3),'climber stays outside surface');}c.keys.w=false;assert(h.completed[type]);}
h.checkpoint=9;c.rat.position.set(0,20.5,-63);c.grab();assert(c.home.stairwayPortrait183);assert(captures[0].includes('complete'));
c.startScavenge();assert.equal(c.test183.state(),null);assert.equal(c.phase,'scavenge');
c.home.routes={courtyard:true};c.home.stairwayPortrait183=true;c.rat.position.set(29.5,0,19);c.grab();assert.equal(c.phase,'heaven');assert.equal(c.test183.state().checkpoint,0);assert(c.home.stairwayPortrait183,'replay preserves earned trophy');
console.log('PASS: scene build, stairs, jump/landing, four traversal modes, crawl clearance, fall recovery, reward and cleanup');
