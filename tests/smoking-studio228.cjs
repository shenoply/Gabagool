// Loads the actual standalone page scripts and both GLTF actors; no pixel rendering.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path'),P=path.resolve(__dirname,'..'),THREE=require('../three-r128-build55.js'),{document,element}=require('./dom211.cjs');
const html=fs.readFileSync(path.join(P,'smoking-study.html'),'utf8');document.body.innerHTML=html;const stage=document.getElementById('stage');stage.clientWidth=390;stage.clientHeight=580;
let frame,now=0;const renderer={domElement:element('canvas'),setPixelRatio(){},setSize(){},render(scene,camera){assert(camera.position.toArray().every(Number.isFinite));}};
THREE.WebGLRenderer=function(){return renderer;};THREE.Clock=function(){this.getDelta=()=>.05;};
const ctx={THREE,document,console,TextDecoder,TextEncoder,URL,Blob,setTimeout,clearTimeout,performance,devicePixelRatio:1,ResizeObserver:class{constructor(f){this.f=f;}observe(){this.f();}},requestAnimationFrame:f=>{frame=f;}};ctx.window=ctx;ctx.self=ctx;global.document=document;global.self=global;vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(P,'GLTFLoader.js'),'utf8'),ctx);
THREE.GLTFLoader.prototype.load=function(url,onLoad,_,onError){const b=fs.readFileSync(path.join(P,url));this.parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'',onLoad,onError);};
for(const m of html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)){if(['three-r128-build55.js','GLTFLoader.js'].includes(m[1]))continue;vm.runInContext(fs.readFileSync(path.join(P,m[1]),'utf8'),ctx,{filename:m[1]});}
setTimeout(()=>{try{
const s=ctx.smokingStudy227;assert(s&&s.seated&&s.standing);
for(const mode of ['car','foot']){
 s.choose(mode);document.getElementById('smoke').onclick();for(let i=0;i<190;i++)frame();
 const a=mode==='car'?s.seated:s.standing,palm=s.smoke.palm(a.model,a.bones,'Left'),origin=s.smoke.cig.getWorldPosition(new THREE.Vector3());assert(palm.distanceTo(origin)<1e-5,'Cigarette must remain in the palm');
 const box=new THREE.Box3().setFromObject(s.smoke.cig);assert(box.getSize(new THREE.Vector3()).length()<.029,'Cigarette too long');
 const fit=s.headphones.userData.fit;assert(fit.length===2);for(const f of fit){const inner=f.x-f.side*.005;assert(f.side>0?inner>f.earMax.x+.005:inner<f.earMin.x-.005,'Ear intersects cushion');}
 for(const body of (mode==='car'?s.bodies:s.footBodies)){assert(body.patches.length>0,'No neck closure');for(const patch of body.patches){assert(!('center' in patch),'Old centre fan remains');assert(patch.triangles.length>0,'Open cap');}assert([...body.inside.attributes.position.array].every(Number.isFinite));}
 document.getElementById('first').onclick();frame();
 renderer.domElement.onpointerdown({pointerId:1,clientX:0,clientY:0});renderer.domElement.onpointermove({pointerId:1,clientX:5000,clientY:0});frame();assert(Math.abs(s.look.yaw)<=1.55,'Can turn inside back of head');
 renderer.domElement.onpointermove({pointerId:1,clientX:-5000,clientY:2000});frame();assert(Math.abs(s.look.yaw)<=1.55&&s.look.pitch<=1.3,'Camera limit failed');renderer.domElement.onpointerup({pointerId:1});
 document.getElementById('headset').onclick();frame();
}
console.log('228: palm attachment, shorter cigarette, ear clearance, triangulated caps and first-person camera limits passed for both actors.');process.exit(0);
}catch(e){console.error(e);process.exit(1);}},1500);
