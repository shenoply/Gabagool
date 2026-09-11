// Regression checks for inventory and camera logic without requiring a GPU.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const THREE=require('../three-r128-build55.js');
for(const m of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
function fragment(start,end){return source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));}
const context={CRAFT:{},home:{tools:{},favoriteRecipes:{}},filter65:'all',query65:'',craftReady82:true,category65:()=> 'home',craftLimit:id=>Number(id==='last'),};vm.createContext(context);
vm.runInContext(fragment('function recipes85()', 'function browse85()'),context);
for(let i=0;i<20;i++)context.CRAFT['r'+i]={name:'Recipe '+i};context.CRAFT.last={name:'Last ready recipe'};
assert.deepEqual(Array.from(context.recipes85()),['last'],'ready recipes must be selected before pagination');
context.craftReady82=false;assert.equal(context.recipes85()[0],'last','ready recipes sort first');
context.query65='last';assert.equal(context.recipes85().length,1);
// A translated, rotated character must stay inside both portrait and landscape views.
const g=new THREE.Group();g.name='Big Rat';g.position.set(15,0,10);g.rotation.y=1.3;g.add(new THREE.Mesh(new THREE.BoxGeometry(2,2,1)));
const root=new THREE.Group();root.add(g);const c={THREE,root,posedBounds:()=>new THREE.Box3(new THREE.Vector3(-1,-1,-.5),new THREE.Vector3(1,1,.5)),camera:new THREE.PerspectiveCamera(55,1,.1,100),NBF:new THREE.Vector3(Math.sin(1.3),0,Math.cos(1.3)),ui:{prompt:{style:{}}},neighbourBounds85:null,neighbourModel85:null};vm.createContext(c);
vm.runInContext(fragment('frameNeighbour63=function(){','\n$(\'hcancel\')'),c);
for(const aspect of [.45,1,1.8]){c.camera.aspect=aspect;c.camera.updateProjectionMatrix();c.frameNeighbour63();c.camera.updateMatrixWorld(true);for(const x of [-1,1])for(const y of [-1,1])for(const z of [-.5,.5]){const p=g.localToWorld(new THREE.Vector3(x,y,z)).project(c.camera);assert(Math.abs(p.x)<.85&&Math.abs(p.y)<.85,'entire Big Rat fits screen with margin');}assert(c.camera.position.distanceTo(g.position)>3,'camera stays outside character');}
// Repeated make taps must spend once and completion must wait for animation.
let spent=0,results=0;const dom={style:{display:'none'}};const craft={craftBusy85:false,craftBatch47:3,craftLimit:()=>3,performCraft:()=>{spent++;return true;},closeModal:()=>{},sayToast:()=>{},CRAFT:{chair:{name:'Chair'}},root:{},photo:{active:false},rat:{userData:{job67:{}}},$:()=>dom,result85:()=>results++};vm.createContext(craft);vm.runInContext(fragment('function make85(id)', 'openCraftBook=function(){if(![\'house\''),craft);craft.make85('chair');craft.make85('chair');assert.equal(spent,1);assert.equal(results,0);craft.rat.userData.job67.done();assert.equal(results,1);assert.equal(craft.craftBusy85,false);
console.log('PASS: script syntax, ready filtering, camera framing at three aspect ratios, craft duplicate protection and completion.');
