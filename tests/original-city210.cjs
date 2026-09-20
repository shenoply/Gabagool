const fs=require('fs'),assert=require('assert'),THREE=require('../three-r128-build55.js');global.THREE=THREE;global.self=global;global.ProgressEvent=class{};require('../GLTFLoader.js');THREE.TextureLoader.prototype.load=function(url,cb){const t=new THREE.Texture();queueMicrotask(()=>cb(t));return t;};
const build=require('../original-city210.js'),bytes=fs.readFileSync(require('path').join(__dirname,'../city-build48.glb'));
new THREE.GLTFLoader().parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'',asset=>{
 const g=new THREE.Group();g.add(asset.scene);g.scale.set(7,11.2,7);g.position.set(4,0,91);g.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(g);g.position.z+=56-b.min.z;let floor;g.traverse(m=>{if(m.material?.name==='RoadsGround')floor=m;});g.position.y-=new THREE.Box3().setFromObject(floor).max.y;g.updateMatrixWorld(true);
 const c=build(THREE,g);assert(c.segments.length>100);for(let z=56;z<=59;z+=.1)assert(!c.blocked({x:4,z},.6),'Gate reaches original ground');
 let checks=0;for(const s of c.segments){const dx=s.b.x-s.a.x,dz=s.b.z-s.a.z,len=Math.hypot(dx,dz);if(len<.5)continue;const m={x:(s.a.x+s.b.x)/2,z:(s.a.z+s.b.z)/2};assert(c.blocked(m,.12));const from=new THREE.Vector3(m.x-dz/len,0,m.z+dx/len),to=new THREE.Vector3(m.x+dz/len,0,m.z-dx/len);assert(c.resolve(to,from,.12),'Swept movement cannot tunnel through walls');checks++;}
 // Flood-fill open ground at car clearance: city perimeter and internal streets must connect.
 const step=.5,minX=Math.ceil(c.bounds.min.x/step)*step,minZ=56.5,w=Math.floor((c.bounds.max.x-minX)/step)+1,h=Math.floor((c.bounds.max.z-minZ)/step)+1;
 const open=new Uint8Array(w*h),visited=new Uint8Array(w*h);for(let z=0;z<h;z++)for(let x=0;x<w;x++)open[z*w+x]=!c.blocked({x:minX+x*step,z:minZ+z*step},.65);
 const start=Math.round((4-minX)/step),q=[start];visited[start]=1;for(let n=0;n<q.length;n++){const id=q[n],x=id%w,z=Math.floor(id/w);for(const [nx,nz] of [[x-1,z],[x+1,z],[x,z-1],[x,z+1]]){if(nx<0||nx>=w||nz<0||nz>=h)continue;const i=nz*w+nx;if(open[i]&&!visited[i]){visited[i]=1;q.push(i);}}}
 const reach=q.map(i=>({x:minX+(i%w)*step,z:minZ+Math.floor(i/w)*step}));assert(reach.some(p=>p.x<c.bounds.min.x+2));assert(reach.some(p=>p.x>c.bounds.max.x-2));assert(reach.some(p=>p.z>c.bounds.max.z-2));
 fs.writeFileSync('/tmp/city210-analysis.json',JSON.stringify({bounds:c.bounds,segments:c.segments,reachable:reach}));
 console.log(JSON.stringify({wallSegments:c.segments.length,wallCrossingChecks:checks,reachableCarCells:q.length,bounds:c.bounds,originalAsset:'unchanged'}));
},e=>{throw e});
