/* Interactive studio mirrors, scoped to this preview. */
function createStudyMirrors({THREE,scene,car,renderer,camera,onSelect,onStatus}){
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),$=id=>document.getElementById(id),mirrors=[],ray=new THREE.Raycaster();
 let selected=null,drag=null,clock=0,index=0;
 for(const [i,x,y,z,w,h]of [[0,0,.635,.09,.13,.053],[1,-.49,.512,.137,.076,.044],[2,.49,.512,.137,.076,.044]]){
  const pivot=new THREE.Group();pivot.position.set(x,y,z);pivot.name='Adjustable study mirror';car.add(pivot);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(w+.009,h+.009,.006),new THREE.MeshStandardMaterial({color:0x89918b,metalness:.8,roughness:.25}));pivot.add(frame);
  const rt=new THREE.WebGLRenderTarget(256,128,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});rt.texture.wrapS=THREE.RepeatWrapping;rt.texture.repeat.x=-1;rt.texture.offset.x=1;
  const face=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:rt.texture,side:THREE.DoubleSide}));face.position.z=-.004;face.rotation.y=Math.PI;pivot.add(face);
  const cam=new THREE.PerspectiveCamera(60,w/h,.008,30);mirrors.push({pivot,face,frame,cam,rt,yaw:0,pitch:0});
 }
 // A quiet studio backdrop provides recognisable landmarks in the reflections.
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#17382e';ctx.fillRect(0,0,1024,256);ctx.textAlign='center';ctx.font='600 38px sans-serif';
 for(const [x,label,col]of [[170,'LEFT','#d4a667'],[512,'PIP’S STUDIO','#e5d8b9'],[854,'RIGHT','#88aea4']]){ctx.fillStyle=col;ctx.fillRect(x-100,55,200,6);ctx.fillText(label,x,145);}
 const texture=new THREE.CanvasTexture(canvas);texture.encoding=THREE.sRGBEncoding;
 const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(4,1),new THREE.MeshBasicMaterial({map:texture}));backdrop.position.set(0,.65,-2.8);scene.add(backdrop);
 function update(){if(selected===null)return;const m=mirrors[selected];m.pivot.rotation.set(m.pitch,m.yaw,0);$('mirror-yaw').value=m.yaw;$('mirror-pitch').value=m.pitch;}
 function select(i){selected=i;onSelect?.(mirrors[i].pivot);$('mirror-controls').hidden=false;document.querySelectorAll('[data-mirror]').forEach(b=>b.classList.toggle('active',Number(b.dataset.mirror)===i));$('mirrors').classList.add('active');onStatus?.('Drag the mirror, or use its angle sliders.');update();}
 function done(){selected=null;drag=null;$('mirror-controls').hidden=true;$('mirrors').classList.remove('active');onStatus?.('Drag to look · pinch to zoom');}
 $('mirrors').onclick=()=>select(selected??0);document.querySelectorAll('[data-mirror]').forEach(b=>b.onclick=()=>select(Number(b.dataset.mirror)));
 $('mirror-done').onclick=done;$('mirror-reset').onclick=()=>{if(selected!==null){mirrors[selected].yaw=mirrors[selected].pitch=0;update();}};
 for(const [id,key]of [['mirror-yaw','yaw'],['mirror-pitch','pitch']])$(id).oninput=e=>{if(selected!==null){mirrors[selected][key]=Number(e.target.value);update();}};
 const el=renderer.domElement;
 function hit(e){if(!mirrors[0].pivot.visible)return -1;const rect=el.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);car.updateWorldMatrix(true,true);const hits=ray.intersectObjects(mirrors.flatMap(m=>[m.face,m.frame]));return hits.length?mirrors.findIndex(m=>m.face===hits[0].object||m.frame===hits[0].object):-1;}
 el.addEventListener('pointerdown',e=>{const i=hit(e);if(i<0)return;select(i);drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:mirrors[i].yaw,pitch:mirrors[i].pitch};el.setPointerCapture(e.pointerId);e.preventDefault();e.stopImmediatePropagation();},true);
 el.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id||selected===null)return;const m=mirrors[selected];m.yaw=THREE.MathUtils.clamp(drag.yaw+(e.clientX-drag.x)*.004,-.55,.55);m.pitch=THREE.MathUtils.clamp(drag.pitch-(e.clientY-drag.y)*.003,-.4,.4);update();e.preventDefault();e.stopImmediatePropagation();},true);
 for(const type of ['pointerup','pointercancel'])el.addEventListener(type,e=>{if(drag?.id!==e.pointerId)return;drag=null;e.preventDefault();e.stopImmediatePropagation();},true);
 function render(dt,fullBody){clock+=dt;if(clock<.07)return;clock=0;const m=mirrors[index++%3],saved=renderer.getRenderTarget(),visible=mirrors.map(m=>m.pivot.visible);
  car.updateWorldMatrix(true,true);const pos=m.face.getWorldPosition(V()),normal=m.face.getWorldDirection(V()).normalize(),incident=pos.clone().sub(camera.position).normalize(),direction=incident.reflect(normal);
  m.cam.position.copy(pos).addScaledVector(direction,.01);m.cam.up.set(0,1,0);m.cam.lookAt(pos.clone().add(direction));
  try{mirrors.forEach(m=>m.pivot.visible=false);renderer.setRenderTarget(m.rt);if(fullBody)fullBody(()=>renderer.render(scene,m.cam));else renderer.render(scene,m.cam);}
  finally{renderer.setRenderTarget(saved);mirrors.forEach((m,i)=>m.pivot.visible=visible[i]);}
 }
 return {mirrors,select,done,render,get selected(){return selected;}};
}
