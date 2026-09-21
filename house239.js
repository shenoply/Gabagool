/* Approved wall-cavity home integrated with the existing 60 persistent repair records. */
(()=>{const T=THREE,paint={sage:0x809377,cream:0xd6c7a6,blue:0x6d8c96,clay:0xac7861};
const woodTexture=new T.TextureLoader().load('wood_planks-build48.jpg');
const gardenTexture=new T.TextureLoader().load('garden-view238.jpg');gardenTexture.encoding=T.sRGBEncoding;
const wood=new T.MeshLambertMaterial({color:0x795434,map:woodTexture}),plaster=new T.MeshLambertMaterial({color:0xc5b899}),dark=new T.MeshLambertMaterial({color:0x393329}),stone=new T.MeshLambertMaterial({color:0x80796b});
const windowX=2,windowY=1.9,windowR=1.12;
function add(g,geo,m,x=0,y=0,z=0){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.receiveShadow=true;o.userData.noInk=true;g.add(o);return o;}
function block(g,w,h,d,x,y,z,m=wood){return add(g,new T.BoxGeometry(w,h,d),m,x,y,z);}
function wallGeometry(x0,x1,y0,y1,z,damaged=false){const a=[],uv=[];function rect(l,r,b,t){if(t<=b)return;const ps=[l,b,z,r,b,z,r,t,z,l,b,z,r,t,z,l,t,z];a.push(...ps);for(let i=0;i<ps.length;i+=3)uv.push(ps[i]/3,ps[i+1]/3);}
const n=80;for(let i=0;i<n;i++){const l=x0+(x1-x0)*i/n,r=x0+(x1-x0)*(i+1)/n,x=(l+r)/2,dx=x-windowX;
let lo=windowY,hi=windowY;if(Math.abs(dx)<windowR){const h=Math.sqrt(windowR*windowR-dx*dx);lo-=h;hi+=h;}else{lo=hi=-100;}
let top=y1;if(damaged&&i>27&&i<48)top-=.11+(i%5)*.027;
if(hi<=y0||lo>=top)rect(l,r,y0,top);else{rect(l,r,y0,Math.min(top,lo));rect(l,r,Math.max(y0,hi),top);}}
const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(a,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.computeVertexNormals();return geo;}
const prior=makeHouse;makeHouse=function(s){const g=prior(s);g.name='Pip wall home';const decor=new T.Group();decor.name='Wall home structure';g.add(decor);
// Keep board IDs and refresh functions so previous repairs, paint and materials remain valid.
for(const b of g.userData.boards230||[]){const old=b.refresh;b.refresh=function(){old();const state=homestead230.state(),ok=!!state.boards[b.id];
if(b.id.startsWith('back-')){while(b.group.children.length){const o=b.group.children.pop();o.parent=null;o.geometry?.dispose();}
const section=Number(b.id.split('-')[1]),row=Number(b.id.split('-')[2]),x0=-HW/2+section*HW/4,x1=x0+HW/4-.025,y0=.055+row*.74,y1=y0+.69;
const m=new T.MeshLambertMaterial({color:state.paint[b.id]?paint[state.paint[b.id]]:ok?0xd8c7a4:0xb6a98c,side:T.DoubleSide});
const geo=wallGeometry(x0,x1,y0,y1,-HD/2+.085,!ok);geo.translate(-b.x,-b.y,-b.z);add(b.group,geo,m);
}else if(!b.wall){while(b.group.children.length){const o=b.group.children[0];b.group.remove(o);o.geometry?.dispose();}
const index=Number(b.id.split('-')[1]),row=Number(b.id.split('-')[2]),w=HW/12-.035,d=HD/2-.05;
if(ok||![2,3,7,8,9].includes(index)){block(b.group,w,.09,d,0,0,0,wood);}else{const gap=.85+(index%3)*.2,part=(d-gap)/2;block(b.group,w,.09,part,0,0,-(gap+part)/2,wood);const end=block(b.group,w,.09,part,0,-.035,(gap+part)/2,wood);end.rotation.x=.018;
for(let i=0;i<4;i++){const shard=block(b.group,w/5,.09,.22+(i%3)*.13,-w*.38+i*w*.24,0,-gap/2+.08,wood);shard.rotation.y=(i%2?.07:-.07);}}
}
};b.refresh();}
// Dark lath behind the damaged plaster, clipped around the real round opening.
add(decor,wallGeometry(-HW/2,HW/2,0,3.25,-HD/2-.03),dark);
for(const r of [windowR+.045,windowR+.16])add(decor,new T.TorusGeometry(r,.065,8,64),wood,windowX,windowY,-HD/2+.16);
block(decor,.045,windowR*2,.07,windowX,windowY,-HD/2+.18);block(decor,windowR*2,.045,.07,windowX,windowY,-HD/2+.18);block(decor,2.8,.12,.5,windowX,windowY-windowR-.1,-HD/2+.2);
add(decor,new T.PlaneGeometry(11,7.33),new T.MeshBasicMaterial({map:gardenTexture,fog:false}),windowX,2,-HD/2-1.7);
block(decor,HW,.12,HD,0,-.4,0,dark);
for(let z=-HD/2+.5;z<HD/2;z+=1.4)block(decor,HW,.18,.18,0,-.21,z,dark);
for(const x of [-HW/2,HW/2]){block(decor,.22,.17,HD,x,.08,0);block(decor,.2,.15,HD,x,3.3,0);}
block(decor,HW,.18,.2,0,3.3,-HD/2);
block(decor,80,22,.35,0,14.3,-HD/2-.3,stone);
const ceiling=new T.Group();ceiling.name='Interior ceiling';decor.add(ceiling);for(let i=0;i<12;i++){if(i===3||i===4)continue;block(ceiling,HW+.15,.12,HD/12-.025,0,3.55,-HD/2+(i+.5)*HD/12);}
for(let x=-HW/2;x<=HW/2;x+=2)block(ceiling,.18,.25,HD,x,3.36,0,dark);
// Continuous host wall above and beside the room; overhead cutaway hides upper mass only.
const upper=new T.Group();upper.name='Host building upper wall';decor.add(upper);block(upper,80,30,HD+.7,0,18.65,0,stone);
for(const x of [-24,24])block(decor,32,4.1,HD+.7,x,1.55,0,stone);
block(decor,80,.5,HD+.7,0,-.65,0,stone);
// Maintain the live doorway corridor and original door interaction at the left wall.
// The left host mass is a cutaway in overhead play; it must not cover the usable doorway.
for(const o of decor.children){if(o.isMesh&&o.geometry.parameters?.width===32&&o.position.x<0)o.visible=false;}
const chips=new T.Group();decor.add(chips);for(let i=0;i<22;i++){const o=add(chips,new T.DodecahedronGeometry(.055+(i%4)*.025,0),plaster,HW/2-.4-(i%5)*.15,.07,-3+(i%7)*.21);o.scale.y=.3;}
g.userData.wallHome239={ceiling,upper,chips};decor.traverse(o=>o.userData.noInk=true);return g;};
const before=startHouse;startHouse=function(){before();const surround=root.userData.homeGarden231;if(surround){root.remove(surround);delete root.userData.homeGarden231;}scene.background.set(0x5c6457);scene.fog=new T.Fog(0x5c6457,45,100);
for(const [x,z]of [[0,2.5],[-1,2.5],[1,3.5]]){if(!hs.placed.some(e=>!e.p.wall&&Math.hypot(e.p.x-x,e.p.z-z)<(defOf(e.p.id).r||.5)+.65)){rat.position.set(x,0,z);break;}}
gameCam.pitch=.4;gameCam.distance=9;gameCam.yaw=0;gameCam.ready=false;tickGameplayCamera(0);};
const tick=tickWorld38;tickWorld38=function(dt){tick(dt);if(phase!=='house'||!hs?.house)return;const h=hs.house.userData.wallHome239;if(!h)return;const inside=camera.position.y<3.22&&Math.abs(camera.position.x)<HW/2&&Math.abs(camera.position.z)<HD/2;h.ceiling.visible=inside;h.upper.visible=inside;h.chips.visible=Object.keys(homestead230.state().boards).length<60;};
// Reserve the window aperture when placing wall decorations, just like the existing doorway.
const pose=ghostPose;ghostPose=function(){const p=pose();if(p.wall==='back'&&Math.abs(p.x-windowX)<windowR+.4&&p.y>windowY-windowR-.3&&p.y<windowY+windowR+.3){p.ok=false;p.wall='blocked';}return p;};
window.wallHome239={windowX,windowY,windowR};
})();
