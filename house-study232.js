/* Separate house design study: no game save access or gameplay overrides. */
(()=>{'use strict';const T=THREE,stage=document.querySelector('#stage'),scene=new T.Scene();scene.background=new T.Color('#53635b');scene.fog=new T.Fog('#87958c',110,420);const camera=new T.PerspectiveCamera(48,1,.04,600),renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputEncoding=T.sRGBEncoding;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;stage.appendChild(renderer.domElement);scene.add(new T.HemisphereLight(0xfff5dd,0x393b31,.58));const sun=new T.DirectionalLight(0xffdfa5,.95);sun.position.set(-5,16,-9);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18});scene.add(sun);const fill=new T.DirectionalLight(0xd8eeef,.5);fill.position.set(4,8,12);scene.add(fill);
let seed=232;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};function texture(kind){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=kind==='wood'?'#775133':'#c6b798';x.fillRect(0,0,256,256);for(let i=0;i<1700;i++){x.fillStyle=kind==='wood'?`rgba(${rand()>.5?'31,17,9':'199,151,93'},${rand()*.16})`:`rgba(78,68,42,${rand()*.06})`;const a=rand()*256,b=rand()*256;x.fillRect(a,b,kind==='wood'?rand()*85:rand()*4,kind==='wood'?.5+rand():rand()*4)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t}const woodTex=texture('wood'),plasterTex=texture('plaster');new T.TextureLoader().load('wood_planks-build48.jpg',t=>{t.encoding=T.sRGBEncoding;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(1,2);wood.map=t;dark.map=t;wood.needsUpdate=dark.needsUpdate=true});const mat=(c,map)=>new T.MeshStandardMaterial({color:c,map:map||null,roughness:.94});const wood=mat(0x987045,woodTex),dark=mat(0x77583d,woodTex),plaster=mat(0xcbbe9d,plasterTex),soil=mat(0x665740),sage=mat(0x738277),iron=mat(0x514e43),cloth=mat(0xab9c72),cream=mat(0xd8cbaa);const house=new T.Group();scene.add(house);function mesh(g,m,parent=house){const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}function box(w,h,d,x,y,z,m=wood,parent=house){const o=mesh(new T.BoxGeometry(w,h,d),m,parent);o.position.set(x,y,z);return o}function beam(a,b,r=.12,m=dark,parent=house){const av=new T.Vector3(...a),bv=new T.Vector3(...b),o=mesh(new T.CylinderGeometry(r,r,av.distanceTo(bv),8),m,parent);o.position.copy(av).add(bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());return o}function panel(points,depth,m,parent=house){const s=new T.Shape();points.forEach((p,i)=>i?s.lineTo(...p):s.moveTo(...p));s.closePath();return mesh(new T.ExtrudeGeometry(s,{depth,bevelEnabled:false}),m,parent)}
// The masonry is the enclosing building wall, rather than the home's interior finish.
box(20,.7,13,0,-.75,0,dark);box(150,.25,140,0,-1.25,0,mat(0x586344),scene);box(20,7.6,.7,0,3,-5.9,mat(0x918879));
// Actual circular opening through plaster and the outer building wall.
house.remove(house.children[1]); // replace the solid outer wall with a pierced wall below
function wallWithWindow(w,h,depth,z,m){const shape=new T.Shape();shape.moveTo(-w/2,0);shape.lineTo(w/2,0);shape.lineTo(w/2,h);shape.lineTo(-w/2,h);shape.closePath();const hole=new T.Path();hole.absarc(.3,3.6,2.05,0,Math.PI*2,true);shape.holes.push(hole);const o=mesh(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:64}),m);o.position.z=z;return o}wallWithWindow(20,7.3,.65,-6.1,mat(0x918879));wallWithWindow(16,6.6,.18,-5.3,plaster);
for(const r of [2.13,2.28]){const ring=mesh(new T.TorusGeometry(r,.11,8,64),dark);ring.position.set(.3,3.6,-5.02)}beam([.3,1.55,-4.98],[.3,5.65,-4.98],.045,wood);beam([-1.74,3.6,-4.98],[2.34,3.6,-4.98],.045,wood);box(4.7,.18,.64,.3,1.43,-4.94);
// A layered, weathered courtyard replaces the placeholder ball-shaped trees.
const courtyard=new T.Group();scene.add(courtyard);
const brick=mat(0x927663,plasterTex),stone=mat(0x979487,plasterTex),glass=mat(0x415b60),tile=mat(0x785b4c);
box(48,.2,34,0,-1,-24,stone,courtyard);
for(let i=0;i<35;i++){const x=-18+rand()*36,z=-12-rand()*24;box(.9,.015,.65,x,-.89,z,mat(i%2?0x8a897b:0xa09b89),courtyard)}
for(const [x,z,w,h] of [[-13,-28,10,12],[0,-35,13,15],[13,-29,11,10]]){
box(w,h,5,x,h/2-1,z,brick,courtyard);box(w+.5,.3,5.5,x,h-1,z,tile,courtyard);
for(let row=0;row<3;row++)for(let col=0;col<3;col++){const wx=x-w*.32+col*w*.32,wy=1.8+row*3.1;box(1.45,2.05,.16,wx,wy,z+2.58,dark,courtyard);box(1.18,1.76,.06,wx,wy,z+2.7,glass,courtyard);box(1.7,.13,.45,wx,wy-1.05,z+2.7,stone,courtyard);box(.065,1.76,.08,wx,wy,z+2.75,cream,courtyard);box(1.18,.06,.08,wx,wy,z+2.75,cream,courtyard)}
box(.7,2,.7,x+w*.25,h-.1,z,brick,courtyard);beam([x+w*.46,0,z+2.8],[x+w*.46,h-.8,z+2.8],.065,iron,courtyard);
for(let j=0;j<18;j++){const chip=box(.4+rand(),.03,.02,x+(rand()-.5)*w,rand()*(h-1),z+2.52,stone,courtyard)}
}
for(const x of [-13,13]){box(14,1.9,.7,x,-.05,-18,brick,courtyard);box(14,.17,.94,x,.98,-18,stone,courtyard);}
for(let j=0;j<40;j++)if(Math.abs(-20+j)>6)box(.018,1.8,.018,-20+j,.02,-17.63,dark,courtyard);
for(const x of [-13,13])for(let j=0;j<4;j++)box(14,.02,.018,x,-.7+j*.43,-17.63,dark,courtyard);
// Terracotta planters and individual climbing leaves preserve the view through the glass.
for(const [x,z]of[[-7,-15],[7,-16],[-12,-20],[12,-19]]){const pot=mesh(new T.CylinderGeometry(.7,.46,1.05,14),mat(0x9d694d),courtyard);pot.position.set(x,-.32,z);for(let j=0;j<12;j++){const ex=x+(rand()-.5)*2,ey=.5+rand()*2,ez=z+(rand()-.5);beam([x,0,z],[ex,ey,ez],.018,mat(0x526245),courtyard);const leaf=mesh(new T.SphereGeometry(.23,6,4),mat(j%2?0x677b50:0x405f45),courtyard);leaf.scale.set(.5,1.8,.18);leaf.position.set(ex,ey,ez);leaf.rotation.z=(rand()-.5)*2}}
for(let j=0;j<34;j++){const leaf=mesh(new T.SphereGeometry(.24,6,4),mat(0x536b47),courtyard);leaf.scale.set(1,.65,.2);leaf.position.set(-9+Math.sin(j*.8)*.8,.2+j*.13,-17.5)}
beam([-13,5,-23],[12,4.5,-24],.025,iron,courtyard);
for(let j=0;j<3;j++)box(.75,1.3,.025,-5+j*2,3.95,-23.4,mat([0xb6aa91,0x788b88,0xa8a58d][j]),courtyard);
// Individual floorboards over visible joists, with splintered ends around a genuine hole.
const broken=new T.Group(),fixed=new T.Group();house.add(broken,fixed);fixed.visible=false;const clickable=[];for(let i=0;i<6;i++)box(16,.26,.23,0,-.34,-4.6+i*1.85,dark);box(16,.12,10.4,0,-.64,0,mat(0x302c23));for(let i=0;i<24;i++){const x=-7.66+i*.665;const damaged=(i>10&&i<20)||(i>2&&i<6);box(.63,.14,10.25,x,-.07,0,wood,fixed);if(!damaged)box(.63,.14,10.25,x,-.07,0,wood,broken);else{const start=-1.4+rand()*1.5,end=2.6+rand()*1.0;box(.63,.14,5.12+start,x,-.07,(-5.12+start)/2,wood,broken);box(.63,.14,5.12-end,x,-.07,(5.12+end)/2,wood,broken);for(const [z,s]of[[start,1],[end,-1]]){const p=panel([[-.315,0],[-.26,(.12+rand()*.6)*s],[-.17,.03*s],[-.06,(.3+rand()*.55)*s],[.05,.09*s],[.19,(.1+rand()*.5)*s],[.315,0]],.14,wood,broken);p.rotation.x=Math.PI/2;p.position.set(x,0,z);clickable.push(p)}}}
// Lath-backed damaged plaster patches, with exposed wood rather than voids.
box(.25,6.5,10.4,-8,3.25,0,dark);box(.25,6.5,10.4,8,3.25,0,dark);const left=new T.Group(),right=new T.Group();house.add(left,right);for(const side of[-1,1]){const g=side<0?left:right;for(let j=0;j<20;j++)box(.12,.14,10.1,side*7.85,.2+j*.31,0,dark,g);for(let j=0;j<5;j++){if((side===1&&j===2)||(side===-1&&j===0))continue;let patch=panel([[-1,0],[.8,0],[1,1.25],[.77,1.45],[1,1.7],[.92,5.9],[-1,6.2],[-.8,3.1],[-1,2.7]],.13,plaster,g);patch.rotation.y=Math.PI/2;patch.position.set(side*7.7,.2,-4+j*2)}box(.15,1.15,10.3,side*7.65,.57,0,dark,g)}
for(const x of[-7.65,-4,4,7.65])box(.22,6.7,.3,x,3.35,-5.03,dark);box(16,.24,.35,0,6.5,-5,wood);box(16,.25,.3,0,.5,-5,wood);
// Angular hairline cracks and crumbling patches on the back wall.
for(const [x,y]of[[-5.6,4.9],[5.2,4.5],[-3,1.1],[6.6,2.1]]){for(let j=0;j<5;j++)beam([x+j*.11,y-j*.23,-5.09],[x+(j+1)*.11+(j%2?.15:-.15),y-(j+1)*.23,-5.09],.017,soil);const p=panel([[0,0],[.7,.1],[.92,.46],[.63,.7],[.72,1.1],[.2,.92],[-.15,.43]],.015,dark);p.position.set(x,y-1.4,-5.105);for(let j=0;j<4;j++)box(.66,.04,.025,x+.3,y-1.2+j*.2,-5.065,wood)}
// Roof remains real geometry; cutaway inspection hides only its front half.
const roofBack=new T.Group(),roofFront=new T.Group();house.add(roofBack,roofFront);for(let i=0;i<8;i++){const x=-7.6+i*2.17;beam([x,6.5,-5.3],[x,7.4,0],.12,dark,roofBack);beam([x,7.4,0],[x,6.5,5.3],.12,dark,roofFront)}for(let i=0;i<16;i++){const z=-5.2+i*.66,g=z<0?roofBack:roofFront;if(i===2||i===3)continue;const b=box(16.6,.15,.64,0,7.4-Math.abs(z)*.17,z,wood,g);b.rotation.x=z<0?-.168:.168;if(i===4){b.rotation.z=.035;b.position.y-=.18}}roofFront.visible=false;
// Salvaged domestic furniture at rat scale, leaving the centre spacious.
box(3.8,.4,2.4,-5.6,.38,-2.6,dark);box(3.55,.35,2.18,-5.6,.74,-2.6,sage);box(.3,1.6,2.4,-7.4,.9,-2.6);box(3.2,.12,1.5,-5.3,.98,-2.3,cloth);box(.8,.26,1.4,-6.6,1.04,-2.65,cream);for(const x of[4.1,7])for(const z of[-3.8,-2.5])box(.14,1.65,.14,x,.82,z,dark);box(3.5,.2,1.65,5.55,1.75,-3.15);box(3.2,.13,.9,5.5,3.5,-4.7);for(let i=0;i<5;i++){const o=mesh(new T.CylinderGeometry(.15,.18,.38,12),mat([0x9b7857,0x7e9989,0xcbba89][i%3]));o.position.set(4.4+i*.48,3.76,-4.7)}box(1.2,.13,.6,5.5,1.91,-3.15,dark);beam([5,2,-3],[6,2,-3],.04,iron);box(.28,.18,.2,6,2,-3,iron);box(2,.16,1.25,-2.1,1.06,-.2);for(const x of[-2.8,-1.4])for(const z of[-.6,.2])box(.13,1,.13,x,.5,z,dark);
const rug=box(4.2,.025,2.8,-3,.025,2.1,mat(0x777c61));for(let i=0;i<11;i++)box(.025,.028,2.8,-5+i*.4,.04,2.1,cloth);
for(let i=0;i<23;i++){const p=mesh(new T.DodecahedronGeometry(.055+rand()*.12,0),plaster,broken);p.scale.y=.3;p.position.set(4+rand()*3,.12,-4+rand()*2)}for(let i=0;i<4;i++){const b=box(.18,.1,1.5,6.5+i*.19,.18+i*.08,2.8,dark,broken);b.rotation.y=.45}const bucket=mesh(new T.CylinderGeometry(.36,.25,.53,16,1,true),iron);bucket.position.set(6,.28,.3);beam([5.65,.62,.3],[6.35,.62,.3],.025,iron);
// A thick section through the human building wall encloses the rat-sized home.
const masonry=mat(0x777363,plasterTex),edge=mat(0x484a40,plasterTex);
box(2.0,9,12,-9.1,3.25,0,masonry);box(2.0,9,12,9.1,3.25,0,masonry);
box(20.2,1.0,12,0,8.0,0,masonry);box(20.2,.6,12,0,-1.0,0,edge);
// Cutaway exposes the interior but preserves ceiling beams and wall thickness.
const cap=house.children[house.children.length-2];cap.visible=false;
for(const x of[-7.8,7.8])box(.32,6.7,.4,x,3.25,5.1,dark);
box(16.1,.3,.45,0,6.5,5.1,dark);
for(let i=0;i<6;i++)box(16,.2,.22,0,6.62,-4.7+i*1.88,dark);
// Scuffed lower panelling and skirting hide the repeated plaster panel joins.
for(const side of[-1,1]){for(let j=0;j<14;j++)box(.11,1.12,.7,side*7.52,.59,-4.6+j*.71,dark);box(.2,.13,10.3,side*7.48,1.17,0,wood);box(.22,.16,10.3,side*7.47,.1,0,wood)}
// An arched inner doorway makes the room read as a home in a wall cavity.
const door=new T.Group();house.add(door);door.position.set(-7.36,0,2.25);door.rotation.y=Math.PI/2;
const ds=new T.Shape();ds.moveTo(-.75,0);ds.lineTo(.75,0);ds.lineTo(.75,2);ds.absarc(0,2,.75,0,Math.PI,false);ds.lineTo(-.75,0);
mesh(new T.ExtrudeGeometry(ds,{depth:.08,bevelEnabled:false}),dark,door);
for(let i=0;i<6;i++)box(.21,2.0,.04,-.62+i*.25,1,.1,wood,door);
const arch=mesh(new T.TorusGeometry(.82,.08,8,32,Math.PI),wood,door);arch.position.set(0,2,.12);
for(const x of[-.82,.82])box(.15,2,.18,x,1,.1,wood,door);
const knob=mesh(new T.SphereGeometry(.07,12,8),iron,door);knob.position.set(.45,1.1,.22);
// Warm reading lamp, reclaimed storage, blankets and tools give scale and purpose.
box(1.1,.85,.8,-5.2,.44,-4.25,dark);box(1.15,.09,.86,-5.2,.92,-4.25,wood);
beam([-5.2,.95,-4.25],[-5.2,1.65,-4.25],.045,iron);
const shade=mesh(new T.CylinderGeometry(.24,.44,.4,20,1,true),mat(0xd2ac62));shade.position.set(-5.2,1.68,-4.25);
const lamp=new T.PointLight(0xffbd67,1.0,7,2);lamp.position.set(-5.2,1.55,-4.2);house.add(lamp);
box(3.9,.22,.18,-5.6,1.05,-1.4,dark);box(3.9,.5,.2,-5.6,1.25,-3.8,dark);
for(let j=0;j<9;j++)box(.032,.035,1.6,-6.6+j*.29,1.08,-2.2,cream);
for(let k=0;k<2;k++){box(1.25,.8,.9,5+k*1.4,.4,-4.3,dark);for(let j=0;j<3;j++)box(1.27,.055,.95,5+k*1.4,.15+j*.27,-4.3,wood)}
for(let j=0;j<3;j++){const book=box(.3,.45+rand()*.18,.5,4.2+j*.35,2.1,-3.5,mat([0x536e60,0x9b6549,0xa99872][j]));book.rotation.z=(j-1)*.06}
box(.65,.12,.4,-2.3,1.19,-.2,mat(0x727b61));
const cup=mesh(new T.CylinderGeometry(.14,.11,.23,14,1,true),cream);cup.position.set(-1.6,1.26,-.3);
// Peeling plaster follows an irregular contour; rubble collects beneath the damage.
for(const [x,y] of [[-6.8,2.8],[5.4,5.1]]){const patch=panel([[0,0],[.3,-.2],[1.1,.1],[1.4,.5],[1.12,.72],[1.3,1.1],[.55,1.35],[.17,.92],[-.13,.65]],.028,dark);patch.position.set(x,y,-5.065);for(let j=0;j<5;j++)box(1,.055,.04,x+.6,y+.12+j*.21,-5.01,wood);for(let j=0;j<7;j++){const chip=panel([[0,0],[.12,.04],[.18,.13],[.03,.19]],.025,plaster,broken);chip.rotation.x=-Math.PI/2;chip.rotation.z=rand()*6;chip.position.set(x+rand()*1.5,.05,-4.8+rand()*.8)}}
// Loose tilted boards, lifted edges, nail heads and grime, not a repeated zigzag cutout.
for(let j=0;j<5;j++){const plank=box(.28,.09,1.3+rand(),2+j*.47,.13+rand()*.15,2.5+rand()*.4,wood,broken);plank.rotation.y=-.45+rand()*.9;plank.rotation.z=(rand()-.5)*.2}
for(let i=0;i<24;i++)for(const z of[-4.75,4.75]){const nail=mesh(new T.CylinderGeometry(.024,.024,.012,6),iron);nail.position.set(-7.66+i*.665,.011,z)}
const damp=new T.MeshBasicMaterial({color:0x44472d,transparent:true,opacity:.14,depthWrite:false});for(let j=0;j<14;j++){const stain=mesh(new T.CircleGeometry(.15+rand()*.5,12),damp);stain.rotation.x=-Math.PI/2;stain.position.set(5+rand()*2,.017,-4+rand()*3)}
// Larger failures: a bowed beam, broken plaster chunks and splintered debris.
for(let i=0;i<28;i++){const chunk=mesh(new T.DodecahedronGeometry(.09+rand()*.21,0),plaster,broken);chunk.scale.set(1,.35,.7);chunk.position.set(6.9-rand()*1.7,.06,-1+rand()*3)}
for(let i=0;i<9;i++){const splinter=box(.06+rand()*.1,.06,.5+rand()*1.5,-4+rand()*9,.04+rand()*.12,1+rand()*3,dark,broken);splinter.rotation.y=rand()*6;splinter.rotation.z=rand()*.13}
const bowed=box(.16,3.1,.16,7.34,2.45,.1,dark,broken);bowed.rotation.z=-.12;
for(const [x,y]of[[-4.1,5.1],[3.2,5.7],[6.2,2.8]])for(let j=0;j<8;j++)beam([x+j*.14,y-j*.18,-5.065],[x+(j+1)*.14+(j%2?.09:-.09),y-(j+1)*.18,-5.065],.022,soil);
// One world unit is approximately 20 cm; Pip stands 1.25 units tall.
// Rat furniture and shell share scale .55, while the human courtyard uses scale 6.
house.scale.setScalar(.55);
courtyard.scale.setScalar(6);courtyard.position.set(0,4.7,45);
// Human-scale paving and drain beside the foundation, at rat eye height.
for(let x=-4;x<=4;x++)for(let z=0;z<5;z++)box(2.35,.12,2.35,x*2.4,-.28,-5-z*2.4,stone,scene);
beam([7,-.3,-8],[7,24,-8],.42,iron,scene);beam([7,.2,-8],[7,.2,-10],.42,iron,scene);
for(let i=0;i<8;i++)box(.09,.06,1.2,4.1+i*.18,-.15,-7,iron,scene);
const discarded=mesh(new T.CylinderGeometry(.52,.52,1.55,20),mat(0x83958d),scene);discarded.rotation.z=Math.PI/2;discarded.position.set(-5,.32,-7.5);
// The home occupies a cutaway in a continuous human building foundation.
// These structural masses meet the existing room shell exactly; they are not backdrop props.
const hostBuilding=new T.Group();scene.add(hostBuilding);
const hostPlaster=mat(0xa69d88,plasterTex),foundation=mat(0x777569,plasterTex);
box(80,32.55,7,0,20.375,-.15,hostPlaster,hostBuilding);
for(const x of[-22.8,22.8])box(34.4,5.15,7,x,1.575,-.15,foundation,hostBuilding);
box(80,.65,7,0,-.98,-.15,foundation,hostBuilding);
// Continuous masonry joints tie both sides of the cavity into the same wall.
for(const side of[-1,1])for(let row=0;row<7;row++){
box(34.4,.026,.035,side*22.8,-.65+row*.7,3.37,dark,hostBuilding);
for(let col=0;col<15;col++)box(.025,.67,.035,side*(6.1+col*2.3+(row%2)*.6),-.32+row*.7,3.37,dark,hostBuilding);
}
// Human windows sit far above Pip's cavity, making the host building unmistakable.
for(const x of[-22,-11,0,11,22])for(const y of[12,24]){
box(4.4,6.2,.16,x,y,3.4,dark,hostBuilding);box(3.95,5.75,.1,x,y,3.51,glass,hostBuilding);
box(.1,5.75,.12,x,y,3.59,cream,hostBuilding);box(3.95,.1,.12,x,y,3.59,cream,hostBuilding);
box(4.8,.22,.65,x,y-3.2,3.6,stone,hostBuilding);
}
box(80,.25,.4,0,7,3.5,stone,hostBuilding);
// The inspection opening exposes the room; there is no independent exterior roof or plinth.
// Photorealistic garden backdrop sits outside the actual circular opening.
const gardenMaterial=new T.MeshBasicMaterial({color:0xffffff,fog:false});
new T.TextureLoader().load('garden-view237.jpg',t=>{t.encoding=T.sRGBEncoding;gardenMaterial.map=t;gardenMaterial.needsUpdate=true;});
const gardenView=new T.Mesh(new T.PlaneGeometry(9,6),gardenMaterial);gardenView.position.set(.165,2.0,-4.15);scene.add(gardenView);
// Load the actual game rat for an honest scale reference.
new T.GLTFLoader().load('pip-animated.glb',g=>{const p=g.scene,b=new T.Box3().setFromObject(p),s=b.getSize(new T.Vector3());p.scale.setScalar(1.25/s.y/.55);p.position.set(-.9,-b.min.y*(1.25/s.y/.55),1.8);p.rotation.y=.3;p.traverse(o=>{if(o.isMesh)o.castShadow=true});house.add(p)},undefined,()=>{});
let mode='whole',yaw=.12,pitch=.16,distance=16,target=new T.Vector3(0,1.35,0),roofOn=false,repaired=false;function view(m){mode=m;document.querySelector('#overview').classList.toggle('active',m==='whole');document.querySelector('#inside').classList.toggle('active',m==='inside');if(m==='whole'){target.set(0,1.35,0);yaw=.12;pitch=.16;distance=16}else{target.set(.2,2.4,-3);yaw=.08;pitch=.025;distance=7.7}update()}function update(){camera.fov=mode==='inside'?Math.max(45,Math.min(85,65+(distance-7.7)*3)):48;camera.updateProjectionMatrix();const framed=mode==='whole'?distance*Math.max(1,.82/camera.aspect):distance;camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*framed,target.y+Math.sin(pitch)*framed,target.z+Math.cos(yaw)*Math.cos(pitch)*framed);if(mode==='inside'){camera.position.set(.1,1.12,2.4);camera.lookAt(.1+Math.sin(yaw)*8,1.12-Math.sin(pitch)*8,2.4-Math.cos(yaw)*Math.cos(pitch)*8)}else camera.lookAt(target);left.visible=true;right.visible=true;roofFront.visible=roofOn||mode==='inside';cap.visible=roofOn||mode==='inside'}document.querySelector('#overview').onclick=()=>view('whole');document.querySelector('#inside').onclick=()=>view('inside');document.querySelector('#roof').onclick=e=>{roofOn=!roofOn;e.target.textContent=roofOn?'Cutaway roof':'Full enclosure';e.target.classList.toggle('active',roofOn);update()};document.querySelector('#damage').onclick=e=>{repaired=!repaired;broken.visible=!repaired;fixed.visible=repaired;e.target.textContent=repaired?'Show damage':'Repair preview';e.target.classList.toggle('active',repaired);document.querySelector('#note').textContent=repaired?'Floor repaired for comparison. Wall plaster still needs restoration.':'Broken floorboards expose joists; cracked walls expose wooden lath.'};const pointers=new Map();let moved=0,lastGap=0;stage.onpointerdown=e=>{stage.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);moved=0;lastGap=0};stage.onpointermove=e=>{if(!pointers.has(e.pointerId))return;const p=pointers.get(e.pointerId),dx=e.clientX-p[0],dy=e.clientY-p[1];pointers.set(e.pointerId,[e.clientX,e.clientY]);moved+=Math.abs(dx)+Math.abs(dy);if(pointers.size===2){const a=[...pointers.values()],gap=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(lastGap)distance=Math.max(3,Math.min(32,distance*lastGap/gap));lastGap=gap}else{yaw-=dx*.006;pitch=Math.max(-.2,Math.min(1.25,pitch+dy*.004))}update()};stage.onpointerup=e=>{pointers.delete(e.pointerId);if(moved<8&&!repaired){const b=stage.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1),camera);if(ray.intersectObjects(clickable).length)document.querySelector('#note').textContent='Splintered floorboard · future repair: a plank, nails and a hammer.'}};stage.onpointercancel=e=>pointers.delete(e.pointerId);stage.onwheel=e=>{e.preventDefault();distance=Math.max(3,Math.min(32,distance+e.deltaY*.02));update()};function resize(){camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);update()}addEventListener('resize',resize);resize();renderer.setAnimationLoop(()=>renderer.render(scene,camera));window.houseStudy232={scene,camera,renderer,view,get repaired(){return repaired}};
})();
