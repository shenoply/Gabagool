(()=>{
 const $=id=>document.getElementById(id),stage=$('stage'),V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true});}catch(e){$('error').style.display='block';$('error').textContent='3D graphics could not start. Please open this preview in Chrome and reload.';return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.prepend(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x203b34);scene.fog=new THREE.Fog(0x203b34,4,12);
 const camera=new THREE.PerspectiveCamera(40,1,.006,30),car=createRoadster202(THREE);scene.add(car);
 scene.add(new THREE.HemisphereLight(0xf0f3e2,0x344b41,1.3));const key=new THREE.DirectionalLight(0xffe5bd,2.5);key.position.set(-2,4,-2);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-2,right:2,top:2,bottom:-2,near:.1,far:10});key.shadow.bias=-.0002;scene.add(key);
 const fill=new THREE.DirectionalLight(0xcce1e3,.9);fill.position.set(3,2,3);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.MeshStandardMaterial({color:0x254239,roughness:1}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=-.012;scene.add(floor);
 const originals=[];car.traverse(o=>{if(o.isMesh)originals.push([o,o.visible]);});
 let lastAngle=null,study=null,mode='pose',yaw=-1.1,pitch=.28,distance=1.5,target=V(-.17,.34,-.17),motion=false,time=0,angle=0,dragged=false;
 function choose(name){mode=name;document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));const close=name!=='car'&&name!=='cockpit';for(const [o,v]of originals){o.visible=v&&(!close||/seat|steering|dashboard|pedal|gear/i.test(o.name));}
  if(study)study.model.visible=true;
  target.set(-.17,.34,-.17);yaw=-1.1;pitch=.28;distance=Math.max(1.15,.76/camera.aspect);
  if(name==='side'){yaw=-Math.PI/2;pitch=.10;}
  if(name==='hands'){target.copy(car.userData.wheel.getWorldPosition(V()));for(const [o]of originals)if(/dashboard|seat/i.test(o.name))o.visible=false;yaw=.55;pitch=.25;distance=Math.max(.42,.30/camera.aspect);}
  if(name==='car'){target.set(0,.28,0);distance=Math.max(2.6,1.65/camera.aspect);yaw=-.75;pitch=.30;}
  if(name==='cockpit'){pitch=.12;yaw=0;}
  $('status').textContent=name==='cockpit'?'Drag to look around':'Drag to rotate · pinch to zoom';
 }
 function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();choose(mode);}
 addEventListener('resize',resize);resize();document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>choose(b.dataset.view));
 $('motion').onclick=()=>{motion=!motion;$('motion').classList.toggle('active',motion);$('motion').textContent=motion?'Pause steering':'Test steering';};
 $('steering').oninput=e=>{angle=Number(e.target.value);motion=false;$('motion').classList.remove('active');$('motion').textContent='Test steering';};
 new THREE.GLTFLoader().load('rat-animation-pack67.glb',asset=>{
  const mixer=new THREE.AnimationMixer(asset.scene),idle=asset.animations.find(c=>c.name==='Idle_4');if(idle){mixer.clipAction(idle).play();mixer.update(0);}
  study=createPipDrivingStudy(asset.scene,car);window.drivingStudy={scene,camera,car,study,renderer,choose};choose(mode);
 },undefined,()=>{$('error').style.display='block';$('error').textContent='Pip’s model could not load. Reload this page to try again.';});
 const pointers=new Map();let pinch=0;const canvas=renderer.domElement;
 canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});pinch=0;};
 canvas.onpointermove=e=>{const old=pointers.get(e.pointerId);if(!old)return;const dx=e.clientX-old.x,dy=e.clientY-old.y;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){yaw-=dx*.006;pitch=THREE.MathUtils.clamp(pitch+dy*.004,-.1,1.35);}else{const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)distance=THREE.MathUtils.clamp(distance*pinch/d,.25,6);pinch=d;}};
 canvas.onpointerup=canvas.onpointercancel=e=>{pointers.delete(e.pointerId);pinch=0;};canvas.onwheel=e=>{e.preventDefault();distance=THREE.MathUtils.clamp(distance+e.deltaY*.002,.25,6);};
 const clock=new THREE.Clock();function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);time+=dt;if(motion){angle=Math.sin(time*.65)*.30;$('steering').value=angle;}if(study&&lastAngle!==angle){study.update(angle);lastAngle=angle;}
  if(mode==='cockpit'){camera.fov=75;camera.position.set(car.userData.seat.x,.545,-.30);camera.lookAt(camera.position.clone().add(V(Math.sin(yaw)*Math.cos(pitch),-Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch))));}
  else{camera.fov=40;camera.position.copy(target).add(V(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance));camera.lookAt(target);}
  camera.updateProjectionMatrix();renderer.render(scene,camera);
 }frame();
})();
