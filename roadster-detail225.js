/* Shared cabin and coachwork detailing for the game and model study. */
function detailRoadster225(THREE,car,live=null){
 const existing=car.getObjectByName('Roadster tailored interior');if(existing)return existing;
 const root=new THREE.Group();root.name='Roadster tailored interior';car.add(root);
 const mat=(color,metalness=0,roughness=.8)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const brass=mat(0xb59b6e,.7,.3),rubber=mat(0x202722),leather=mat(0x674735),cream=mat(0xd8c5a0);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#343b32';ctx.fillRect(0,0,128,128);
 for(let y=0;y<128;y+=2)for(let x=0;x<128;x+=2){ctx.fillStyle=['#3c4438','#30372e','#464a3c'][(x*7+y*3)%3];ctx.fillRect(x,y,1,2);}
 const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(5,6);texture.encoding=THREE.sRGBEncoding;
 const carpet=new THREE.MeshStandardMaterial({map:texture,color:0xb3ad8a,roughness:1});
 function box(name,w,h,d,material,x,y,z,parent=root){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.name=name;o.position.set(x,y,z);o.userData.noInk=true;parent.add(o);return o;}
 box('Fitted wool carpet',.717,.008,.708,carpet,0,.235,-.182);
 for(const x of [-.195,.195]){
  box('Leather bound floor mat',.291,.004,.31,leather,x,.241,-.095);
  box('Woven removable floor mat',.279,.004,.298,carpet,x,.245,-.095);
  box('Rubber heel pad',.17,.004,.087,rubber,x,.249,-.056);
  for(let i=0;i<8;i++)box('Heel pad rib',.16,.001,.003,rubber,x,.252,-.09+i*.009);
 }
 for(const side of [-1,1]){
  box('Brass door sill',.022,.006,.46,brass,side*.355,.244,-.15);
  const pocket=box('Leather door map pocket',.016,.064,.14,leather,side*.373,.265,-.31);
  box('Folded street map',.003,.042,.09,cream,side*.368,.305,-.31);
  // Fasten accessories to the existing hinged doors when used in the live car.
  const door=live?.cabin219?.doors[side<0?0:1]?.pivot;
  if(door){car.updateWorldMatrix(true,true);const map=root.children[root.children.length-1];door.attach(pocket);door.attach(map);}
 }
 box('Passenger leather tool roll',.17,.033,.066,leather,.23,.253,-.34);
 for(const x of [.18,.28])box('Tool roll strap',.008,.038,.071,brass,x,.255,-.34);
 // An unobtrusive lidded travel cup secured beside the passenger console.
 const cup=new THREE.Mesh(new THREE.CylinderGeometry(.021,.017,.052,16),cream);cup.name='Travel flask';cup.position.set(.07,.273,-.29);root.add(cup);
 const lid=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.008,16),rubber);lid.position.set(.07,.301,-.29);root.add(lid);
 for(const side of [-1,1]){
  box('Running board rubber inset',.056,.006,.43,rubber,side*.436,.169,-.13);
  box('Running board bright edge',.004,.008,.45,brass,side*.465,.167,-.13);
 }
 const badge=new THREE.Mesh(new THREE.CircleGeometry(.016,24),brass);badge.name='Roadster nose badge';badge.position.set(0,.366,.62);badge.rotation.x=-.4;root.add(badge);
 root.traverse(o=>{o.userData.noInk=true;});return root;
}
