// CPU scene/logic integration check using the shipped Three.js and GLTFLoader.
// This is not a WebGL or browser visual test.
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert'),P=path.resolve(__dirname,'..');const THREE=require('../three-r128-build55.js');
const timers=[];const {element,document}=require('../tests/dom211.cjs');
const fakeRenderer={getRenderTarget:()=>null,setRenderTarget(){},shadowMap:{},capabilities:{isWebGL2:false,getMaxAnisotropy:()=>1},info:{render:{calls:0,triangles:0}},setPixelRatio(){},setSize(){},setClearColor(){},getPixelRatio:()=>1,render(){},dispose(){},domElement:element()};
const ctx={THREE,console,document,Blob,URL,TextDecoder,TextEncoder,ArrayBuffer,Uint8Array,Uint16Array,Uint32Array,Float32Array,performance,Math,Date,Map,Set,Promise,queueMicrotask,setTimeout:(f,ms)=>{if(ms<1000)return setTimeout(f,ms);timers.push(f);return 1},clearTimeout(){},setInterval(){},clearInterval(){},requestAnimationFrame(){},cancelAnimationFrame(){},addEventListener(){},removeEventListener(){},innerWidth:900,innerHeight:800,devicePixelRatio:1,matchMedia:()=>({matches:false,addEventListener(){}}),navigator:{userAgent:'scene-test',hardwareConcurrency:8},location:{search:'',href:'http://localhost',reload(){}},localStorage:{getItem:()=>null,setItem(){}},Image:function(){return element()},Audio:function(){return element()},fetch:async url=>{const file=path.join(P,String(url).split('?')[0]);return {ok:fs.existsSync(file),arrayBuffer:async()=>{const b=fs.readFileSync(file);return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)},json:async()=>JSON.parse(fs.readFileSync(file,'utf8'))}},atob:s=>Buffer.from(s,'base64').toString('binary'),btoa:s=>Buffer.from(s,'binary').toString('base64'),__renderer:fakeRenderer};global.document=document;global.self=global;ctx.URLSearchParams=URLSearchParams;ctx.window=ctx;ctx.self=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(P,'GLTFLoader.js'),'utf8'),ctx);THREE.GLTFLoader.prototype.load=function(url,onLoad,onProgress,onError){try{const b=fs.readFileSync(path.join(P,url.split('?')[0]));this.parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'',onLoad,onError)}catch(e){onError?.(e)}};
let source=[...fs.readFileSync(path.join(P,'index.html'),'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n');source=source.replace('const renderer=createRenderer55();','const renderer=__renderer;');

(async()=>{
document.body.innerHTML=fs.readFileSync(path.join(P,'index.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'');
vm.runInContext(source,ctx,{filename:'game-inline.js'});
for(const m of fs.readFileSync(path.join(P,'index.html'),'utf8').matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)){if(['three-r128-build55.js','GLTFLoader.js'].includes(m[1]))continue;vm.runInContext(fs.readFileSync(path.join(P,m[1]),'utf8'),ctx,{filename:m[1]});}
await vm.runInContext('loadApprovedPip()',ctx);vm.runInContext('startScavenge()',ctx);await new Promise(r=>setTimeout(r,2200));
vm.runInContext('voiceOn=false; for(let i=0;i<3;i++){tickScavenge(1/60);tickWorld38(1/60);tickGameplayCamera(1/60);}',ctx);
console.log('Loaded full game and all current scripts');
vm.runInContext(`
this.report={};
// Previously trapped by the side of the city approach and the former z=52 limit.
for(const [a,b] of [[[4,0,35],[7,0,35]],[[20,0,51.9],[20,0,53.1]],[[7,0,45],[4,0,45]]]){const p=new THREE.Vector3(...b);resolveGeometry62(p,new THREE.Vector3(...a));if(p.distanceTo(new THREE.Vector3(...b))>.01)throw Error('Invisible city boundary '+JSON.stringify([a,b,p.toArray()]));}
report.cityTransitions=true;
rat.userData.job67=null;rat.position.copy(car77.g.position).add(new THREE.Vector3(1,0,0));enterCar77();tickWorld38(.2);if(!car77.riding)throw Error('Cannot enter car');if($('ignition211').textContent!=='Start engine')throw Error('Ignition not exposed');motoring206.ignition();tickWorld38(.2);if(!car77.ignition206)throw Error('Ignition failed');
roadsterControls203.setView(1);rat.animate(1/60,0);gameCam.pitch=2.1;tickGameplayCamera(1/60);const direction=camera.getWorldDirection(new THREE.Vector3());if(direction.y>-.9)throw Error('Cannot look down');report.driverLookDown=direction.toArray();report.fullBodyMeshes=rat.userData.approvedPip.children.length;
car77.speed=0;exitCar77();sewer211.enter('yard');for(let i=0;i<10;i++){tickArea(1/60);tickWorld38(1/60);tickGameplayCamera(1/60);tickAnimals37(1/60);tickLife42(1/60);tick66(1/60);}if(!sewer211.active)throw Error('Sewer entry failed');report.sewerMeshes=root.children.length;
rat.position.set(1.4,.34,5);if(!sewerBoat215.grab()||!sewerBoat215.riding)throw Error('Cannot board');keys.w=true;for(let i=0;i<120;i++)tickArea(1/60);keys.w=false;if(sewerBoat215.boat.position.z<6)throw Error('Boat does not move');for(let i=0;i<30;i++)tickArea(1/60);if(!sewerBoat215.grab()||sewerBoat215.riding)throw Error('Cannot disembark');if(sewerBoat215.wet(rat.position.x,rat.position.z))throw Error('Exit in water');report.canoeRoundTrip=true;

rat.position.set(-11,0,25);tickArea(.016);grab();if(home.sewer211.finds.west!==true)throw Error('Salvage failed');const n=inv.nail;grab();if(inv.nail!==n)throw Error('Duplicate salvage');
sewer211.showMap();if($('modal').style.display!=='flex')throw Error('Sewer map failed');closeModal();
rat.position.copy(sewer211.entrances[1].below);tickArea(.016);grab();if(phase!=='scavenge'||rat.position.distanceTo(new THREE.Vector3(4,0,60.2))>.01)throw Error('City ladder exit failed');
sewer211.enter('city');if(!sewer211.active||rat.position.z<29)throw Error('City entry failed');if(sewer211.state.finds.some(f=>f.id==='west'))throw Error('Saved cache respawned');sewer211.exit('yard');if(rat.position.distanceTo(new THREE.Vector3(6.8,0,28.2))>.01)throw Error('Yard return failed');report.sewerRoundTrip=true;report.salvageSaved=true;
`,ctx);
await new Promise(r=>setTimeout(r,200));
if(process.env.WW_EXTRA_TEST)vm.runInContext(fs.readFileSync(path.resolve(P,process.env.WW_EXTRA_TEST),'utf8'),ctx,{filename:process.env.WW_EXTRA_TEST});
if(process.env.WW_SCENE_EXPORT&&ctx.sceneExport220)fs.writeFileSync(process.env.WW_SCENE_EXPORT,JSON.stringify(ctx.sceneExport220));
console.log(JSON.stringify(ctx.report,null,2));process.exit(0);
})().catch(e=>{console.error(e.stack);process.exit(1)});
