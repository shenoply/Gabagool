/* Shared mobile-friendly gondola geometry for Wet Whiskers. */
function makeCanoe212(){
 const g=new THREE.Group();g.name='Pip’s sewer gondola';const wood=[0x523322,0x68442c,0x795237,0x463024].map(color=>new THREE.MeshStandardMaterial({color,roughness:.85})),brass=new THREE.MeshStandardMaterial({color:0x9a7b42,metalness:.65,roughness:.5}),dark=new THREE.MeshStandardMaterial({color:0x212825,roughness:.65});
 function box(w,h,d,x,y,z,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o;}
 const stations=[[-1.05,.035,.32],[-.85,.23,.16],[-.55,.34,.1],[0,.38,.08],[.55,.34,.1],[.85,.23,.17],[1.05,.025,.4]];
 for(let j=0;j<3;j++)for(const side of [-1,1])for(let i=0;i<stations.length-1;i++){const a=stations[i],b=stations[i+1],t0=j/3,t1=(j+1)/3;const p=[];for(const [s,t]of [[a,t0],[b,t0],[b,t1],[a,t1]])p.push(side*s[1]*(.67+.33*t),s[2]+t*.27,s[0]);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setIndex(side===1?[0,1,2,0,2,3]:[2,1,0,3,2,0]);geo.computeVertexNormals();const mat=wood[(i+j)%4].clone();mat.side=THREE.DoubleSide;g.add(new THREE.Mesh(geo,mat));}
 // Seven lengthwise planks follow the tapered hull instead of protruding crosswise.
 for(let i=-3;i<=3;i++){const x=i*.065,half=.82-Math.pow(Math.abs(x)/.25,2)*.22;box(.061,.045,half*2,x,.16,0,wood[(i+4)%4]);}

 function beam(a,b,r,mat){const v=new THREE.Vector3(...a),q=new THREE.Vector3(...b),d=q.clone().sub(v),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),8),mat);o.position.copy(v.add(q).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());g.add(o);return o;}
 for(const side of [-1,1])for(let i=0;i<stations.length-1;i++){const a=stations[i],b=stations[i+1];beam([side*a[1],a[2]+.28,a[0]],[side*b[1],b[2]+.28,b[0]],.026,wood[1]);}
 for(const z of [-.43,.35])box(.63,.055,.19,0,.32,z,wood[2]);
 for(const z of [-.65,.65])for(const side of [-1,1]){const patch=box(.025,.17,.13,side*.30,.31,z,brass);patch.rotation.z=side*-.23;for(const y of [.26,.36]){const rivet=new THREE.Mesh(new THREE.SphereGeometry(.013,6,4),dark);rivet.position.set(side*.32,y,z);g.add(rivet);}}
 beam([0,.36,1.02],[0,.82,1.08],.038,wood[0]);beam([0,.81,1.08],[0,.81,.91],.018,brass);
 box(.12,.025,.12,0,.53,.91,brass);box(.12,.025,.12,0,.72,.91,brass);const glow=new THREE.MeshStandardMaterial({color:0xffd17b,emissive:0xffaa35,emissiveIntensity:.8,transparent:true,opacity:.8});box(.09,.17,.09,0,.625,.91,glow);for(const x of [-.05,.05])for(const z of [.86,.96])beam([x,.54,z],[x,.71,z],.009,brass);
 const radio=box(.24,.16,.10,0,.44,-.43,new THREE.MeshStandardMaterial({color:0xcabb98,roughness:.7}));box(.1,.1,.008,-.05,.45,-.374,dark);for(const x of [.045,.085]){const dial=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.014,12),brass);dial.rotation.x=Math.PI/2;dial.position.set(x,.44,-.372);g.add(dial);}beam([.09,.52,-.44],[.09,.71,-.44],.004,brass);
 const paddle=new THREE.Group();paddle.name='Wooden paddle';const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.015,.018,1.25,8),wood[2]);paddle.add(shaft);const blade=new THREE.Mesh(new THREE.BoxGeometry(.115,.30,.026),wood[1]);blade.position.y=-.75;paddle.add(blade);paddle.position.set(.42,.52,.05);paddle.rotation.z=-.6;paddle.rotation.x=.3;g.add(paddle);g.userData.paddle=paddle;const seen=new Set();g.traverse(o=>{if(o.isMesh){const m=o.material;if(!seen.has(m)){seen.add(m);m.color.convertSRGBToLinear();}o.castShadow=true;o.receiveShadow=true;}});return g;
}
