/* Stairway to Heaven: isolated course controller, real player/companion assets. */
(() => {
  'use strict';
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  let H=null;
  function courseSound188(kind){
    if(!H||typeof sfxCtx!=='function')return;const ac=sfxCtx();if(!ac)return;
    if(!H.audioBus){H.audioBus=ac.createGain();H.audioBus.connect(ac.destination);}
    const o=ac.createOscillator(),gain=ac.createGain(),now=ac.currentTime;
    const tones={checkpoint:[660,990,.35],splash:[160,45,.5],leap:[600,90,.6],bump:[120,60,.12],step:[95,55,.06],wing:[220,70,.18]};
    const [f,end,dur]=tones[kind]||[kind,kind,.4];o.type=typeof kind==='number'?'sine':'triangle';o.frequency.setValueAtTime(f,now);o.frequency.exponentialRampToValueAtTime(end,now+dur);gain.gain.setValueAtTime(typeof kind==='number'?.025:.055,now);gain.gain.exponentialRampToValueAtTime(.0001,now+dur);o.connect(gain).connect(H.audioBus);o.start(now);o.stop(now+dur);o.onended=()=>{o.disconnect();gain.disconnect();};
  }
  function courseAudio188(dt){
    if(H.audioBus)H.audioBus.gain.value=typeof voiceOn==='undefined'||voiceOn?1:0;
    musicTick69();
    const b=$('heavenSound188');if(b)b.textContent=typeof voiceOn!=='undefined'&&!voiceOn?'Sound: off':'Sound: on';
  }
  function playMission189(){if(H){music69.unlocked=true;music69.blocked=false;musicTick69();}}
  addEventListener('pointerdown',playMission189);
  addEventListener('keydown',playMission189);
  const texture=new THREE.TextureLoader().load('stairway-reward183.jpg');
  texture.encoding=THREE.sRGBEncoding;
  const checkpoints=[
    {p:[0,0,1],name:'Leap of faith · starting lagoon'},
    {p:[0,2.4,-7.6],name:'Rooftop jumps'},
    {p:[0,4,-15],name:'Rope climb'},
    {p:[0,7,-17],name:'Zipline tower'},
    {p:[8,6,-23],name:'Across the rooftops'},
    {p:[8,9,-31],name:'Sky causeway'},
    {p:[14,9,-40],name:'Crawl & wall climb'},
    {p:[14,12.6,-46],name:'Bird crossing'},
    {p:[0,17.5,-54],name:'Final ascent'},
    {p:[0,20.5,-63],name:'Heaven summit · claim portrait'}
  ];
  const material=(color,kind)=>kind?MT(color,kind):new THREE.MeshStandardMaterial({color,roughness:.85});
  function mesh(w,h,d,x,y,z,mat,parent=root){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);if(H&&parent===root&&h>.05)H.solids.push({x,z,w,d,bottom:y-h/2,top:y+h/2,m});return m;}
  function deck(x,y,z,w=2.4,d=2,kind='wood') {
    const m=mesh(w,.22,d,x,y-.11,z,H.materials[kind]);m.name='Course landing';
    H.platforms.push({x,z,w,d,y,bottom:y-.22});
    // Plank seams and solid-looking scaffold posts, not a pile of floating cubes.
    for(let i=1;i<Math.ceil(w/.4);i++)mesh(.016,.008,d-.05,x-w/2+i*.4,y+.006,z,H.materials.dark);
    if(y>.5)for(const side of [-1,1])mesh(.1,Math.min(y,3.4),.1,x+side*(w/2-.12),y-Math.min(y,3.4)/2-.22,z+d/2-.15,H.materials.dark);
    return m;
  }
  function stairs(x,z,y,count,rise=.2,run=.45){for(let i=1;i<=count;i++)deck(x,y+i*rise,z-i*run,2.1,run+.035);}
  function beam(from,to,r=.035,color=0x514a3e){const delta=to.clone().sub(from),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),7),material(color));m.position.copy(from).add(to).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),delta.normalize());root.add(m);if(H&&r>=.03){const b=new THREE.Box3().setFromObject(m),s=b.getSize(V(0,0,0)),c=b.getCenter(V(0,0,0));H.solids.push({x:c.x,z:c.z,w:s.x,d:s.z,bottom:b.min.y,top:b.max.y,m});}return m;}
  function portrait(parent,width=1.8){const g=new THREE.Group();parent.add(g);const mat=material(0xbd923e),height=width*1.365;mesh(width+.18,height+.18,.1,0,0,0,mat,g);const pic=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture}));pic.position.z=.056;g.add(pic);for(const x of [-1,1])mesh(.075,height+.3,.15,x*(width/2+.09),0,.04,mat,g);for(const y of [-1,1])mesh(width+.3,.075,.15,0,y*(height/2+.09),.04,mat,g);return g;}
  function action(label,p,to,type,duration,required){H.actions.push({label,p:V(...p),to:V(...to),type,duration,required});}
  function animal(file,key,pos,length) {
    const owner=root;
    loader88.load(file,asset=>{
      if(!H||root!==owner||phase!=='heaven')return;
      const g=new THREE.Group(),model=asset.scene;g.add(model);root.add(g);if(key==='bird')model.rotation.y=-Math.PI/2;
      const b=new THREE.Box3().setFromObject(model),size=b.getSize(V(0,0,0));
      model.scale.multiplyScalar(length/Math.max(size.x,size.y,size.z));
      b.setFromObject(model);const center=b.getCenter(V(0,0,0));model.position.sub(V(center.x,b.min.y,center.z));g.position.set(...pos);
      g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.frustumCulled=false;}});
      const mixer=new THREE.AnimationMixer(model);if(asset.animations[0])mixer.clipAction(asset.animations[0]).play();
      H.animals[key]={g,model,visual:model,mixer,rest:g.position.clone(),modelY:model.position.y};
      if(key==='bird'&&typeof prepareOsprey73==='function')prepareOsprey73(H.animals[key]);
    },undefined,()=>{if(H&&root===owner){H.assetError=true;sayToast('Companion model could not load. Retry this checkpoint to reload.');}});
  }
  function hud() {
    const bar=document.createElement('section');bar.id='heaven183';
    bar.innerHTML='<div><button id="heavenRetry183">Retry</button><button id="heavenExit183">Exit</button></div>';
    document.body.appendChild(bar);$('heavenRetry183').onclick=respawn;$('heavenExit183').onclick=()=>startScavenge();
    const sound=document.createElement('button');sound.id='heavenSound188';sound.textContent='Sound: on';sound.onclick=()=>$('mute').click();bar.appendChild(sound);
    const music=document.createElement('button');music.textContent=piano.enabled?'Music: on':'Music: off';music.onclick=()=>{piano.enabled=!piano.enabled;music.textContent=piano.enabled?'Music: on':'Music: off';playMission189();};bar.appendChild(music);const next=document.createElement('button');next.textContent='Next song';next.onclick=()=>{piano.enabled=true;music.textContent='Music: on';music69.unlocked=true;nextMusic190();};bar.appendChild(next);
    const cameraBar=document.createElement('div');cameraBar.id='heavenCamera183';cameraBar.innerHTML='<button aria-label="Zoom out course">−</button><button aria-label="Reset course camera">↻</button><button aria-label="Zoom in course">+</button>';document.body.appendChild(cameraBar);
    const buttons=cameraBar.querySelectorAll('button');buttons[0].onclick=()=>zoomGame(1.2);buttons[1].onclick=()=>{gameCam.yaw=0;gameCam.pitch=.38;gameCam.distance=4.8;};buttons[2].onclick=()=>zoomGame(.83);
  }
  const previousClear=clear;
  clear=function(){if(H?.audioBus)H.audioBus.disconnect();if(H?.sunColor&&sun.color)sun.color.copy(H.sunColor);H=null;document.body.classList.remove('heaven-course');$('heaven183')?.remove();$('heavenCamera183')?.remove();$('heavenLaunch186')?.remove();previousClear();};
  window.startHeaven183=function() {
    exitPhoto();closeModal();clear();phase='heaven';sc=null;sfx.rain(false);radioStop();
    H={platforms:[],solids:[],blocks:[],actions:[],animals:{},completed:{},checkpoint:0,transit:null,grounded:true,vy:0,clock:0,won:false,sunColor:sun.color?.clone(),materials:{wood:material(0x99734c,'wood'),brick:material(0x92604a,'brick'),dark:material(0x49443b),stone:material(0xc7c2a6,'cobble')}};
    scene.background=new THREE.Color(0xbcd8ed);scene.fog=new THREE.Fog(0xbcd8ed,85,180);sun.intensity=1.15;sun.color?.set(0xffe2b1);hemi.intensity=.85;
    playMission189();
    H.opening=true;rat=makeRat();rat.scale.setScalar(.25);rat.position.set(0,12,7);root.add(rat);rat.rotation.y=Math.PI;
    gameCam.yaw=0;gameCam.pitch=.38;gameCam.distance=4.8;gameCam.ready=false;keys={};joy.x=joy.z=0;
    document.body.classList.add('heaven-course');ui.title.style.display='none';ui.pad.style.display='flex';ui.prompt.style.display='none';hud();
    deck(0,12,7,4,3,'brick');
    action('Leap of faith · dive into the lagoon',[0,12,7],[0,0,1],'leap',3.8,0);
    deck(0,-2.2,1,5,5,'stone');deck(0,0,-1,5,1,'stone');
    for(const x of [-2.5,2.5])mesh(.2,2.4,5,x,-1,1,H.materials.stone);
    const water=new THREE.Mesh(new THREE.PlaneGeometry(4.8,4.8),new THREE.MeshPhongMaterial({color:0x418f9c,transparent:true,opacity:.55,side:THREE.DoubleSide}));water.rotation.x=-Math.PI/2;water.position.set(0,.23,1);root.add(water);
    H.splash=new THREE.Mesh(new THREE.RingGeometry(.3,.4,32),new THREE.MeshBasicMaterial({color:0xe3ffff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));H.splash.rotation.x=-Math.PI/2;H.splash.position.set(0,.25,1);root.add(H.splash);
    for(const x of [-2.3,2.3])mesh(.15,2.5,.15,x,1.25,2.5,H.materials.dark);
    for(let x=-2.2;x<2.3;x+=.35)mesh(.04,2.1,.04,x,1.05,2.5,H.materials.dark);
    stairs(0,-.7,0,12);deck(0,2.4,-7.6,2.8,2.7);
    for(const [z,y] of [[-10.4,2.9],[-12.8,3.45],[-15,4]])deck(0,y,z,1.8,1.65);
    deck(0,7,-17,3,3);beam(V(-.55,4,-15.55),V(-.55,7.5,-15.55));beam(V(.55,4,-15.55),V(.55,7.5,-15.55));
    for(let y=4;y<7.5;y+=.24)beam(V(-.55,y,-15.55),V(.55,y,-15.55),.03,0x957650);
    action('Climb rope ladder',[0,4,-15],[0,7,-17],'climb',3.8,2);
    deck(8,6,-23,3,3);
    H.zipCurve=new THREE.CatmullRomCurve3([V(0,8.6,-17),V(4,7.8,-20),V(8,7.6,-23)]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(H.zipCurve,32,.028,8,false),material(0x303b42)));
    H.zipHandle=new THREE.Group();root.add(H.zipHandle);
    const wheel=new THREE.Mesh(new THREE.TorusGeometry(.09,.025,8,16),material(0xc6a44b));H.zipHandle.add(wheel);
    mesh(.035,.18,.035,0,-.09,0,H.materials.dark,H.zipHandle);mesh(.44,.045,.045,0,-.2,0,material(0xc6a44b),H.zipHandle);H.zipHandle.position.copy(H.zipCurve.getPoint(0));
    for(const p of [[0,7,-17],[8,6,-23]])for(const x of [-.75,.75])beam(V(p[0]+x,p[1],p[2]),V(p[0]+x,p[1]+2,p[2]),.065);
    action('Ride zipline',[0,7,-17],[8,6,-23],'zipline',3.4,3);
    stairs(8,-24,6,15);deck(8,9,-31,3,2.4);
    // Continuous straight track. Steer around staggered barriers, never jump.
    H.runSide=V(9,0,6).normalize();H.runObstacles=[];
    const bridge=new THREE.Mesh(new THREE.BoxGeometry(3.2,.24,Math.hypot(6,9)+1),H.materials.wood);bridge.position.set(11,8.88,-35.5);bridge.rotation.y=Math.atan2(6,-9);bridge.castShadow=true;bridge.receiveShadow=true;root.add(bridge);
    // Small invisible support cells match the rotated bridge footprint.
    for(let i=0;i<=40;i++){const q=i/40,cell={x:8+6*q,z:-31-9*q,w:2.5,d:.6,y:9,bottom:8.76};H.platforms.push(cell);H.solids.push({...cell,top:9,m:bridge});}
    for(const side of [-1,1])for(let i=0;i<=14;i++){const p=V(8+6*i/14,9.015,-31-9*i/14).addScaledVector(H.runSide,side*1.45);const stripe=new THREE.Mesh(new THREE.BoxGeometry(.045,.015,.3),material(0xe7c879));stripe.position.copy(p);stripe.rotation.y=bridge.rotation.y;root.add(stripe);}
    for(const [q,side] of [[.25,-1],[.5,1],[.75,-1]]){const p=V(8+6*q,9,-31-9*q).addScaledVector(H.runSide,side*.64);mesh(.65,.55,.65,p.x,9.275,p.z,H.materials.brick);H.runObstacles.push({q,offset:side*.64});}
    deck(11,4.5,-35.5,10,14,'brick');
    for(let i=0;i<55;i++){const spike=new THREE.Mesh(new THREE.ConeGeometry(.16,.7,5),H.materials.dark);spike.position.set(7+(i%9),4.85,-30-Math.floor(i/9)*1.7);root.add(spike);}
    for(let i=0;i<6;i++){const pts=[];for(let j=0;j<18;j++)pts.push(V(7+i*.9+Math.sin(j*.5)*.35,4.65,-32-j*.2));const snake=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),28,.09,6,false),material(i%2?0x66713c:0x483628));root.add(snake);}
    deck(14,9,-40,3,2.2);deck(14,9,-42,1.5,3);
    mesh(1.7,.2,2.5,14,9.64,-42,H.materials.wood);
    for(const side of [-1,1])mesh(.12,.65,2.5,14+side*.81,9.3,-42,H.materials.dark);
    H.blocks.push({x:14,z:-42,w:1.7,d:2.5,bottom:9.54,top:9.74});
    deck(14,9,-44,2,1.4);deck(14,12.6,-46,2.6,1.6);
    mesh(2.4,3.6,.3,14,10.8,-45,H.materials.brick);
    for(let i=0;i<12;i++)mesh(.22,.12,.16,14+(i%2?-.4:.4),9.3+i*.28,-44.8,H.materials.stone);
    action('Climb brick wall',[14,9,-44],[14,12.6,-46],'wall',4,6);
    action('Bird flight · hold forward',[14,12.6,-46],[0,17.5,-54],'bird',7,7);
    animal('osprey-build74.glb','bird',[14.8,13,-46],3.0);
    deck(0,17.5,-54,4,2.4,'stone');stairs(0,-55,17.5,15);deck(0,20.5,-63,5,3.4,'stone');
    // The loading boundary retains the same yard gate and urban setting.
    for(const x of [-8,8])mesh(10,.2,20,x,-.3,5,H.materials.brick);
    for(const x of [-6,6]){mesh(3,7,18,x,3.2,-3,H.materials.brick);for(let z=-9;z<5;z+=3)mesh(.03,1.2,1.1,x+(x<0?1.51:-1.51),3.5,z,H.materials.dark);}
    const reward=portrait(root,1.5);reward.position.set(0,22,-64);H.reward=reward;
    const rewardBox=new THREE.Box3().setFromObject(reward),rewardSize=rewardBox.getSize(V(0,0,0)),rewardCenter=rewardBox.getCenter(V(0,0,0));H.solids.push({x:rewardCenter.x,z:rewardCenter.z,w:rewardSize.x,d:rewardSize.z,bottom:rewardBox.min.y,top:rewardBox.max.y,m:reward});
    for(let i=0;i<checkpoints.length;i++) {
      const c=checkpoints[i],ring=new THREE.Mesh(new THREE.RingGeometry(.4,.48,24),new THREE.MeshBasicMaterial({color:0xe9c872,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(c.p[0],c.p[1]+.015,c.p[2]);root.add(ring);
    }
    // Brick towers become pale ruins as the route reaches the clouds.
    for(const [x,z,h] of [[-4,-9,2],[4,-18,5],[11,-27,7],[17,-37,10],[-4,-55,15]])mesh(2.6,h,3,x,h/2-3,z,h>10?H.materials.stone:H.materials.brick);
    for(let i=0;i<12;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(2+i%3,1),new THREE.MeshBasicMaterial({color:0xf6f0e4,transparent:true,opacity:.22,depthWrite:false}));m.name='Cosmetic distant cloud';m.scale.set(2,.3,1.2);m.position.set((i%2?-1:1)*(35+i%3*6),-7-i%3,-10-i*6);root.add(m);}
    root.updateMatrixWorld(true);H.cameraRay=new THREE.Raycaster();
  };
  function respawn(){if(!H)return;const p=H.opening?[0,12,7]:checkpoints[H.checkpoint].p;H.transit=null;H.vy=0;H.grounded=true;rat.position.set(...p);rat.userData.swim66=false;rat.userData.air=false;rat.userData.crawl169=false;rat.userData.act=null;rat.userData.seated41=false;rat.userData.climb=null;rat.rotation.set(0,Math.PI,0);gameCam.ready=false;for(const a of Object.values(H.animals))a.g.position.copy(a.rest);$('padC').textContent='Crawl';sayToast('Back at '+checkpoints[H.checkpoint].name);}
  function nearAction(){return H.actions.find(a=>a.required<=H.checkpoint&&a.p.distanceTo(rat.position)<1.4);}
  function use(){if(!H||H.transit)return;const a=nearAction();if(a){if(a.type==='bird'&&!H.animals[a.type]){return;}H.transit={...a,from:rat.position.clone(),progress:0};courseSound188(a.type==='leap'?'leap':'checkpoint');if(['climb','wall'].includes(a.type)){gameCam.yaw=0;gameCam.pitch=.25;gameCam.ready=false;}H.grounded=false;rat.userData.crawl169=false;return;}
    if(H.checkpoint===9&&rat.position.distanceTo(V(0,20.5,-63))<3.5){home.stairwayPortrait183=true;home.collectibles=home.collectibles||{};home.collectibles.stairwayHeaven=true;save();H.won=true;modal('Course complete!', '<p>You reached Heaven! Your framed portrait is earned and will hang in Pip’s home.</p><img src="stairway-reward183.jpg" alt="Stairway reward portrait" style="display:block;max-height:35vh;max-width:90%;margin:auto;border:8px ridge #c39d4d">',[['Back to yard',()=>startScavenge()],['Keep exploring',closeModal]]);}}
  function underRoof(){return H&&H.blocks.some(b=>Math.abs(rat.position.x-b.x)<b.w/2+.16&&Math.abs(rat.position.z-b.z)<b.d/2+.16&&rat.position.y<b.bottom&&rat.position.y+.75>b.bottom);}
  function climbPath186(ride,q){
    const faceZ=ride.type==='climb'?-15.12:-44.42;
    const align=V(ride.to.x,ride.from.y,faceZ),high=V(ride.to.x,ride.to.y+.3,faceZ),over=ride.to.clone().add(V(0,.3,0));
    if(q<.12)return ride.from.clone().lerp(align,q/.12);
    if(q<.78)return align.lerp(high,(q-.12)/.66);
    if(q<.94)return high.lerp(over,(q-.78)/.16);
    return over.lerp(ride.to,(q-.94)/.06);
  }
  function jump(){if(H?.opening&&!H.transit)return use();if(H&&!H.transit&&H.grounded&&!underRoof()){H.vy=6;H.grounded=false;rat.userData.air=true;rat.userData.crawl169=false;}}
  function leapPose188(u,q){
    if(!u.pipPivot)return;u.pipPivot.rotation.x=q<.2?q/.2*.7:.7+Math.min(1,(q-.2)/.6)*.55;
    if(!u.pipBones||!u.pipRest)return;
    for(const [name,angles]of Object.entries({LeftArm:[0,0,-1.25],RightArm:[0,0,1.25],LeftForeArm:[.1,0,0],RightForeArm:[.1,0,0],LeftUpLeg:[.1,0,-.12],RightUpLeg:[.1,0,.12],LeftLeg:[.08,0,0],RightLeg:[.08,0,0]})){const b=u.pipBones[name],rest=u.pipRest[name];if(b&&rest)b.quaternion.copy(rest).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(...angles)));}
  }
  function birdGrip187(a,u){
    if(!a.wings73||!u.pipBones?.LeftHand||!u.pipBones?.RightHand)return;
    a.g.updateWorldMatrix(true,true);rat.updateWorldMatrix(true,true);
    const targets=gripTargets73(a);if(targets.length!==2)return;
    const hands=[u.pipBones.LeftHand,u.pipBones.RightHand],middle=hands[0].getWorldPosition(V(0,0,0)).add(hands[1].getWorldPosition(V(0,0,0))).multiplyScalar(.5);
    rat.position.add(targets[0].clone().add(targets[1]).multiplyScalar(.5).sub(middle));rat.updateWorldMatrix(true,true);
    if(hands[0].getWorldPosition(V(0,0,0)).distanceTo(targets[1])<hands[0].getWorldPosition(V(0,0,0)).distanceTo(targets[0]))targets.reverse();
    armReach73(u,'Left',targets[0]);armReach73(u,'Right',targets[1]);
  }
  const oldCrawl=toggleCrawl169;toggleCrawl169=function(){if(phase==='heaven'&&(H?.transit||(rat.userData.crawl169&&underRoof())))return;return oldCrawl();};
  const oldJump=doJump;doJump=function(){if(phase==='heaven')return jump();return oldJump();};
  const oldGrab=grab;grab=function(){if(phase==='heaven')return use();return oldGrab();};
  addEventListener('keydown',e=>{if(phase!=='heaven'||/INPUT|TEXTAREA/.test(e.target?.tagName)||e.repeat)return;if(e.code==='Space'){e.preventDefault();jump();}if(e.key.toLowerCase()==='c')toggleCrawl169();});
  window.tickHeaven183=function(dt){
    if(!H||!rat)return;H.clock+=dt;courseAudio188(dt);const u=rat.userData;
    if(H.transit){const ride=H.transit,manual=['bird','climb','wall','wallfinish'].includes(ride.type);const moving=!manual||keys.w||keys.arrowup||joy.z<-.15;
      if(moving)ride.progress=Math.min(1,ride.progress+dt/ride.duration);
      const q=ride.progress;rat.position.lerpVectors(ride.from,ride.to,q);rat.rotation.y=Math.atan2(ride.to.x-ride.from.x,ride.to.z-ride.from.z);
      if(['climb','wall'].includes(ride.type)){rat.position.copy(climbPath186(ride,q));rat.rotation.y=Math.PI;}
      if(ride.type==='bird')rat.position.y+=Math.sin(q*Math.PI)*1.7;
      if(ride.type==='leap')rat.position.y=ride.from.y+2*Math.sin(q*Math.PI)+(ride.to.y-ride.from.y)*q*q;
      if(ride.type==='zipline'){
        const point=H.zipCurve.getPoint(q);H.zipHandle.position.copy(point);H.zipHandle.rotation.y=Math.atan2(8,-6);rat.position.copy(point).add(V(0,-1,0));
        if(q<.1)rat.position.lerp(ride.from,1-q/.1);
        if(q>.9)rat.position.lerp(ride.to,(q-.9)/.1);
      }
      const a=H.animals[ride.type];if(a){a.g.position.copy(rat.position);a.g.rotation.y=rat.rotation.y;rat.position.y+=ride.type==='bird'?-.6:.18;}
      u.seated41=false;u.air=ride.type==='bird'||ride.type==='zipline';u.swim66=false;u.vel=0;rat.animate(dt,0,false);
      if(u.pipPivot&&['climb','wall'].includes(ride.type)) {u.pipPivot.rotation.x=.08;for(const side of ['Left','Right']){const step=Math.sin(q*ride.duration*6+(side==='Left'?0:Math.PI));rotateBone69(u,side+'Arm',-1.9+step*.3);rotateBone69(u,side+'ForeArm',-.6);rotateBone69(u,side+'UpLeg',.65-step*.35);rotateBone69(u,side+'Leg',-.8);}}
      if(ride.type==='leap')leapPose188(u,q);
      if(u.pipPivot&&['bird','zipline'].includes(ride.type))for(const side of ['Left','Right'])rotateBone69(u,side+'Arm',-2.6);
      if(ride.type==='bird'&&a){if(a.wings73)a.wings73.phase.value=H.clock*5;birdGrip187(a,u);}
      if(ride.progress===1){H.completed[ride.type]=true;if(ride.type==='leap'){H.splashTime=1;H.opening=false;courseSound188('splash');}rat.position.copy(ride.to);H.transit=null;H.vy=0;H.grounded=true;u.air=false;u.seated41=false;}
    }else{
      let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
      if(Math.hypot(joy.x,joy.z)>.15){dx=joy.x;dz=joy.z;}
      const len=Math.hypot(dx,dz),speed=u.crawl169?1.05:3.0;if(len>1){dx/=len;dz/=len;}
      const vx=(Math.cos(gameCam.yaw)*dx+Math.sin(gameCam.yaw)*dz)*speed,vz=(-Math.sin(gameCam.yaw)*dx+Math.cos(gameCam.yaw)*dz)*speed;
      const before=rat.position.clone();rat.position.x+=vx*dt;rat.position.z+=vz*dt;
      const radius=.16,height=u.crawl169?.29:.68;
      if(u.crawl169&&underRoof())H.completed.crawl=true;
      for(const b of H.solids)if(Math.abs(rat.position.x-b.x)<b.w/2+radius&&Math.abs(rat.position.z-b.z)<b.d/2+radius&&rat.position.y+height>b.bottom+.015&&rat.position.y<b.top-.25){rat.position.x=before.x;rat.position.z=before.z;}
      H.vy-=dt*13;let nextY=rat.position.y+H.vy*dt;let floor=-Infinity;
      for(const b of H.solids){if(Math.abs(rat.position.x-b.x)>=b.w/2||Math.abs(rat.position.z-b.z)>=b.d/2)continue;
        if(H.vy>0&&before.y+height<=b.bottom+.02&&nextY+height>=b.bottom){nextY=b.bottom-height;H.vy=0;}
        if(H.vy<=0&&b.top<=before.y+(H.grounded?.25:.03)&&b.top>=nextY-.02)floor=Math.max(floor,b.top);
      }
      for(const p of H.platforms)if(Math.abs(rat.position.x-p.x)<p.w/2&&Math.abs(rat.position.z-p.z)<p.d/2&&p.y<=before.y+(H.grounded?.25:.03)&&p.y>=nextY-.02)floor=Math.max(floor,p.y);
      if(!H.opening&&H.checkpoint===0&&Math.abs(rat.position.x)<2.35&&rat.position.z>-.5&&rat.position.z<3.35){rat.position.y=0;H.vy=0;H.grounded=true;u.swim66=true;}
      else if(Number.isFinite(floor)&&H.vy<=0){rat.position.y=floor;H.vy=0;H.grounded=true;u.swim66=false;}else{rat.position.y=nextY;H.grounded=false;u.swim66=false;}
      u.air=!H.grounded;u.vy=H.vy;u.vel=Math.hypot(vx,vz);u.run=false;
      if(len>.1){const yaw=Math.atan2(vx,vz);rat.rotation.y+=Math.atan2(Math.sin(yaw-rat.rotation.y),Math.cos(yaw-rat.rotation.y))*(1-Math.exp(-dt*10));}
      rat.animate(dt,Math.min(1,len),false);
      if(rat.position.y<checkpoints[H.checkpoint].p[1]-4)respawn();
    }
    for(const a of Object.values(H.animals))a.mixer.update(dt);
    // Sequential checkpoints prevent a jump from skipping required animal sections.
    const next=checkpoints[H.checkpoint+1],requirement={1:'leap',3:'climb',4:'zipline',7:'wall',8:'bird'}[H.checkpoint+1];if(next&&!H.transit&&(!requirement||H.completed[requirement])&&(H.checkpoint!==6||H.completed.crawl)&&rat.position.distanceTo(V(...next.p))<1.1){H.checkpoint++;courseSound188('checkpoint');}
    if(H.splashTime>0){H.splashTime=Math.max(0,H.splashTime-dt);H.splash.material.opacity=H.splashTime;H.splash.scale.setScalar(1+(1-H.splashTime)*5);}
    const a=nearAction();ui.prompt.style.display='none';
    $('padE').textContent=H.checkpoint===9?'Claim':a?'Use':'—';$('padJ').textContent='Jump';$('padC').textContent=u.crawl169?'Stand':'Crawl';
    const target=rat.position.clone().add(V(0,.45,0)),d=gameCam.distance;
    const goal=target.clone().add(V(Math.sin(gameCam.yaw)*Math.cos(gameCam.pitch)*d,Math.sin(gameCam.pitch)*d,Math.cos(gameCam.yaw)*Math.cos(gameCam.pitch)*d));
    const look=goal.clone().sub(target),distance=look.length();H.cameraRay.set(target,look.normalize());H.cameraRay.far=distance;
    const obstruction=H.cameraRay.intersectObjects([...new Set(H.solids.map(b=>b.m))],true).find(hit=>hit.distance>.12);
    if(obstruction)goal.copy(target).addScaledVector(look,Math.max(.65,obstruction.distance-.2));
    if(!gameCam.ready){camera.position.copy(goal);gameCam.ready=true;}else camera.position.lerp(goal,1-Math.exp(-dt*8));camera.lookAt(target);gameCam.pos.copy(camera.position);
  };
  function enterExtension184(){const cover=document.createElement('div');cover.textContent='Pip’s Lane → Rooftops · Loading Stairway to Heaven…';cover.style.cssText='position:fixed;inset:0;display:grid;place-items:center;background:#243e39;color:#f8e8c5;font:20px system-ui;z-index:999;padding:30px;text-align:center';document.body.appendChild(cover);requestAnimationFrame(()=>requestAnimationFrame(()=>{try{startHeaven183();}finally{cover.remove();}}));}
  const gateUse=useGate57;useGate57=function(){if(nearGate57()){enterExtension184();return true;}return gateUse();};
  // Replay is independent of the trophy and all old backyard job flags.
  const grabBeforeReplay185=grab;grab=function(){if(phase==='scavenge'&&rat&&Math.hypot(rat.position.x-29.5,rat.position.z-19)<2.8){enterExtension184();return true;}return grabBeforeReplay185();};
  const menuBeforeReplay185=menu65;menu65=function(){menuBeforeReplay185();const actions=$('modalActions');if(!actions||phase==='heaven')return;const b=document.createElement('button');b.className='btn';b.textContent=(home.stairwayPortrait183?'Replay':'Play')+' Stairway to Heaven';b.onclick=()=>{closeModal();enterExtension184();};actions.appendChild(b);};
  function showMission186(){if(phase!=='scavenge'||$('heavenLaunch186'))return;const b=document.createElement('button');b.id='heavenLaunch186';b.textContent='★ '+(home.stairwayPortrait183?'Replay':'Play')+' Stairway to Heaven';b.onclick=enterExtension184;document.body.appendChild(b);}
  const yardStart184=startScavenge;startScavenge=function(){const returning=phase==='heaven';yardStart184();showMission186();if(returning){rat.position.set(29,0,19);gameCam.yaw=-Math.PI/2;gameCam.ready=false;}};
  const areaStart=startArea;startArea=function(id){if(id==='courtyard'&&phase==='scavenge'){enterExtension184();return;}return areaStart(id);};
  const propsTick=tickProps57;tickProps57=function(dt){propsTick(dt);showMission186();const map=$('miniMap171');if(map&&!map.querySelector('[data-heaven186]')){const marker=document.createElement('i');marker.dataset.heaven186='true';marker.textContent='★';marker.title='Stairway to Heaven gate';marker.style.cssText='position:absolute;left:73px;top:49px;color:#ffda67;font-style:normal;font-size:18px';map.appendChild(marker);}if(nearGate57()){ui.prompt.textContent='E · Stairway to Heaven';$('padE').textContent='Enter';}};
  const houseStart=startHouse;startHouse=function(){houseStart();if(home.stairwayPortrait183){const p=portrait(root,.85);p.position.set(0,1.9,-HD/2+.08);p.name='Earned Stairway portrait';}};
  const style=document.createElement('style');style.textContent='.heaven-course #title,.heaven-course #hud,.heaven-course #settings,.heaven-course #survival,.heaven-course #miniMap171,.heaven-course #mute,.heaven-course #weatherBadge,.heaven-course #cameraTools,.heaven-course #go,.heaven-course #padB,.heaven-course #padR,.heaven-course #tailWhip88,.heaven-course #hb{display:none!important}#heaven183{position:fixed;left:12px;right:12px;top:12px;z-index:80;max-width:400px;background:#243e39ed;color:#f8e8c5;border:1px solid #ccaa65;border-radius:14px;padding:12px;font:14px system-ui}#heaven183 strong,#heaven183 small{display:block;margin-bottom:6px}#heaven183 button,#heavenCamera183 button{border:0;border-radius:8px;background:#ead6a2;color:#243e39;padding:8px;margin:3px;pointer-events:auto}#heavenCamera183{position:fixed;left:12px;bottom:190px;z-index:90}.heaven-course #prompt{max-width:75%;font-size:15px;bottom:28%}';document.head.appendChild(style);
  style.textContent+='.heaven-course #tail67{display:none!important}';
  style.textContent+='#heavenLaunch186{position:fixed;left:12px;bottom:245px;z-index:60;padding:10px 14px;border:1px solid #ffe4a0;border-radius:12px;background:#e4b854;color:#243e39;font:bold 13px system-ui;pointer-events:auto}#heaven183{padding:8px;font-size:12px;max-width:310px}#heavenHelp183{display:none!important}#heaven183 button{padding:6px;font-size:12px}';
  if(new URLSearchParams(location.search).has('heavenPreview')){const b=document.createElement('button');b.className='btn';b.textContent='Play Stairway to Heaven';b.style.cssText='position:fixed;top:12px;right:12px;z-index:200';b.onclick=()=>{b.remove();startHeaven183();};document.body.appendChild(b);}
})();
