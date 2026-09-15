/* Stairway to Heaven: isolated course controller, real player/companion assets. */
(() => {
  'use strict';
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  let H=null;
  const texture=new THREE.TextureLoader().load('stairway-reward183.jpg');
  texture.encoding=THREE.sRGBEncoding;
  const checkpoints=[
    {p:[0,0,1],name:'Stairway entrance'},
    {p:[0,2.4,-7.6],name:'Rooftop jumps'},
    {p:[0,4,-15],name:'Rope climb'},
    {p:[0,7,-17],name:'Zipline tower'},
    {p:[8,6,-23],name:'Across the rooftops'},
    {p:[8,9,-31],name:'Lizard run & jumps'},
    {p:[14,9,-40],name:'Crawl & wall climb'},
    {p:[14,12.6,-46],name:'Bird crossing'},
    {p:[0,17.5,-54],name:'Leap of faith'},
    {p:[6,10.9,-59],name:'Water landing & wall climb'},
    {p:[0,20.5,-63],name:'Heaven'}
  ];
  const material=(color,kind)=>kind?MT(color,kind):new THREE.MeshStandardMaterial({color,roughness:.85});
  function mesh(w,h,d,x,y,z,mat,parent=root){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function deck(x,y,z,w=2.4,d=2,kind='wood') {
    const m=mesh(w,.22,d,x,y-.11,z,H.materials[kind]);m.name='Course landing';
    H.platforms.push({x,z,w,d,y,bottom:y-.22});
    // Plank seams and solid-looking scaffold posts, not a pile of floating cubes.
    for(let i=1;i<Math.ceil(w/.4);i++)mesh(.016,.008,d-.05,x-w/2+i*.4,y+.006,z,H.materials.dark);
    if(y>.5)for(const side of [-1,1])mesh(.1,Math.min(y,3.4),.1,x+side*(w/2-.12),y-Math.min(y,3.4)/2-.22,z+d/2-.15,H.materials.dark);
    return m;
  }
  function stairs(x,z,y,count,rise=.2,run=.45){for(let i=1;i<=count;i++)deck(x,y+i*rise,z-i*run,2.1,run+.035);}
  function beam(from,to,r=.035,color=0x514a3e){const delta=to.clone().sub(from),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),7),material(color));m.position.copy(from).add(to).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),delta.normalize());root.add(m);return m;}
  function sign(text,pos,width=2.4){const c=document.createElement('canvas');c.width=768;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#243e39';ctx.fillRect(0,0,768,128);ctx.strokeStyle='#e8ca87';ctx.lineWidth=6;ctx.strokeRect(3,3,762,122);ctx.fillStyle='#fff0cd';ctx.font='bold 36px sans-serif';ctx.textAlign='center';ctx.fillText(text,384,78);const map=new THREE.CanvasTexture(c);const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width/6),new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide}));m.position.copy(pos);root.add(m);return m;}
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
      H.animals[key]={g,model,mixer,rest:g.position.clone()};
    },undefined,()=>{if(H&&root===owner){H.assetError=true;sayToast('Companion model could not load. Retry this checkpoint to reload.');}});
  }
  function hud() {
    const bar=document.createElement('section');bar.id='heaven183';
    bar.innerHTML='<strong>Stairway to Heaven</strong><small id="heavenStage183"></small><div><button id="heavenRetry183">Retry checkpoint</button><button id="heavenExit183">Back to yard</button></div><small id="heavenHelp183">Move: stick / WASD · Jump: Space · Use: E · Crawl: C</small>';
    document.body.appendChild(bar);$('heavenRetry183').onclick=respawn;$('heavenExit183').onclick=()=>startScavenge();
    const cameraBar=document.createElement('div');cameraBar.id='heavenCamera183';cameraBar.innerHTML='<button aria-label="Zoom out course">−</button><button aria-label="Reset course camera">↻</button><button aria-label="Zoom in course">+</button>';document.body.appendChild(cameraBar);
    const buttons=cameraBar.querySelectorAll('button');buttons[0].onclick=()=>zoomGame(1.2);buttons[1].onclick=()=>{gameCam.yaw=0;gameCam.pitch=.38;gameCam.distance=4.8;};buttons[2].onclick=()=>zoomGame(.83);
  }
  const previousClear=clear;
  clear=function(){H=null;document.body.classList.remove('heaven-course');$('heaven183')?.remove();$('heavenCamera183')?.remove();previousClear();};
  window.startHeaven183=function() {
    exitPhoto();closeModal();clear();phase='heaven';sc=null;sfx.rain(false);radioStop();
    H={platforms:[],blocks:[],actions:[],animals:{},completed:{},checkpoint:0,transit:null,grounded:true,vy:0,clock:0,won:false,materials:{wood:material(0x99734c,'wood'),brick:material(0x92604a,'brick'),dark:material(0x49443b),stone:material(0xc7c2a6,'cobble')}};
    scene.background=new THREE.Color(0xb9d4df);scene.fog=new THREE.Fog(0xb9d4df,32,110);sun.intensity=1;hemi.intensity=.8;
    rat=makeRat();rat.scale.setScalar(.25);rat.position.set(0,0,1);root.add(rat);rat.rotation.y=Math.PI;
    gameCam.yaw=0;gameCam.pitch=.38;gameCam.distance=4.8;gameCam.ready=false;keys={};joy.x=joy.z=0;
    document.body.classList.add('heaven-course');ui.title.style.display='none';ui.pad.style.display='flex';ui.prompt.style.display='block';hud();
    deck(0,0,1,5,4,'brick');
    for(const x of [-2.3,2.3])mesh(.15,2.5,.15,x,1.25,2.5,H.materials.dark);
    for(let x=-2.2;x<2.3;x+=.35)mesh(.04,2.1,.04,x,1.05,2.5,H.materials.dark);
    sign('STAIRWAY TO HEAVEN',V(0,2.6,2.45),4);
    stairs(0,-.7,0,12);deck(0,2.4,-7.6,2.8,2.7);
    for(const [z,y] of [[-10.4,2.9],[-12.8,3.45],[-15,4]])deck(0,y,z,1.8,1.65);
    deck(0,7,-17,3,3);beam(V(-.55,4,-15.55),V(-.55,7.5,-15.55));beam(V(.55,4,-15.55),V(.55,7.5,-15.55));
    for(let y=4;y<7.5;y+=.24)beam(V(-.55,y,-15.55),V(.55,y,-15.55),.03,0x957650);
    action('Climb rope ladder',[0,4,-15],[0,7,-17],'climb',3.8,2);
    deck(8,6,-23,3,3);beam(V(0,8.1,-17),V(8,7.1,-23),.075,0x191f24);
    beam(V(0,8.18,-17),V(8,7.18,-23),.015,0xd4ba7d);
    H.zipHandle=beam(V(0,8.1,-17),V(0,7.65,-17),.05,0xe0ad4b);
    for(const p of [[0,7,-17],[8,6,-23]])for(const x of [-.75,.75])beam(V(p[0]+x,p[1],p[2]),V(p[0]+x,p[1]+2,p[2]),.065);
    action('Ride zipline',[0,7,-17],[8,6,-23],'zipline',3.4,3);
    stairs(8,-24,6,15);deck(8,9,-31,3,2.4);
    // Flat run split by two real gaps; Jump is required while riding.
    for(let i=0;i<=24;i++){const q=i/24;if((q>.28&&q<.42)||(q>.62&&q<.76))continue;deck(8+6*q,9,-31-9*q,1.2,.46,'stone');}
    action('Mount lizard · run and jump gaps',[8,9,-31],[14,9,-40],'lizard',8,5);
    animal('lizard-recovered115.glb','lizard',[8.7,9,-31],1.65);
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
    action('Leap of faith into water',[0,17.5,-54],[6,10.9,-59],'leap',3.4,8);
    deck(6,8.5,-59,5,5,'stone');
    for(const x of [3.5,8.5])mesh(.2,2.7,5,x,9.85,-59,H.materials.stone);
    for(const z of [-61.5,-56.5])mesh(5,2.7,.2,6,9.85,z,H.materials.stone);
    const water=new THREE.Mesh(new THREE.PlaneGeometry(4.8,4.8),new THREE.MeshPhongMaterial({color:0x418f9c,transparent:true,opacity:.6,side:THREE.DoubleSide}));water.rotation.x=-Math.PI/2;water.position.set(6,11.15,-59);root.add(water);
    H.splash=new THREE.Mesh(new THREE.RingGeometry(.3,.4,32),new THREE.MeshBasicMaterial({color:0xe3ffff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));H.splash.rotation.x=-Math.PI/2;H.splash.position.set(6,11.18,-59);root.add(H.splash);
    mesh(2,6.6,.4,4,14.2,-61,H.materials.brick);
    for(let i=0;i<22;i++)mesh(.25,.12,.2,4+(i%2?-.45:.45),11.2+i*.29,-60.75,H.materials.stone);
    action('Climb out to final stairs',[6,10.9,-59],[0,17.5,-55],'wallfinish',6,9);
    sign('LEAP → WATER',V(0,18.8,-54),2.5);
    // The loading boundary retains the same yard gate and urban setting.
    mesh(25,.2,20,0,-.3,5,H.materials.brick);
    for(const x of [-6,6]){mesh(3,7,18,x,3.2,-3,H.materials.brick);for(let z=-9;z<5;z+=3)mesh(.03,1.2,1.1,x+(x<0?1.51:-1.51),3.5,z,H.materials.dark);}
    sign('← PIP’S LANE',V(-2,1.3,1.5),2);
    const reward=portrait(root,2);reward.position.set(0,22.15,-64);H.reward=reward;
    sign('YOUR REWARD',V(0,24,-64),2.5);
    for(let i=0;i<checkpoints.length;i++) {
      const c=checkpoints[i],ring=new THREE.Mesh(new THREE.RingGeometry(.4,.48,24),new THREE.MeshBasicMaterial({color:0xe9c872,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(c.p[0],c.p[1]+.015,c.p[2]);root.add(ring);
      sign((i+1)+' · '+c.name,V(c.p[0],c.p[1]+1.3,c.p[2]-.75),2.5);
    }
    // Brick towers become pale ruins as the route reaches the clouds.
    for(const [x,z,h] of [[-4,-9,2],[4,-18,5],[11,-27,7],[17,-37,10],[-4,-55,15]])mesh(2.6,h,3,x,h/2-3,z,h>10?H.materials.stone:H.materials.brick);
    for(let i=0;i<20;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5+i%3,1),new THREE.MeshBasicMaterial({color:0xeaf0e7,transparent:true,opacity:.35,depthWrite:false}));m.scale.set(2,.32,1.2);m.position.set(Math.sin(i*2.4)*15,9+(i%5)*1.5,-28-i*2);root.add(m);}
    sayToast('Gate opened: Stairway to Heaven. Checkpoints save each section during this run.');
  };
  function respawn(){if(!H)return;const p=checkpoints[H.checkpoint].p;H.transit=null;H.vy=0;H.grounded=true;rat.position.set(...p);rat.userData.air=false;rat.userData.crawl169=false;rat.userData.act=null;rat.userData.seated41=false;rat.userData.climb=null;rat.rotation.set(0,Math.PI,0);gameCam.ready=false;for(const a of Object.values(H.animals))a.g.position.copy(a.rest);$('padC').textContent='Crawl';sayToast('Back at '+checkpoints[H.checkpoint].name);}
  function nearAction(){return H.actions.find(a=>a.required<=H.checkpoint&&a.p.distanceTo(rat.position)<1.4);}
  function use(){if(!H||H.transit)return;const a=nearAction();if(a){if((a.type==='bird'||a.type==='lizard')&&!H.animals[a.type]){sayToast('Loading companion… use Retry if it does not appear.');return;}H.transit={...a,from:rat.position.clone(),progress:0};H.grounded=false;rat.userData.crawl169=false;return;}
    if(H.checkpoint===10&&rat.position.distanceTo(V(0,20.5,-63))<2){home.stairwayPortrait183=true;home.collectibles=home.collectibles||{};home.collectibles.stairwayHeaven=true;save();H.won=true;modal('You reached Heaven!', '<p>Your framed portrait is earned. It will hang in Pip’s home.</p><img src="stairway-reward183.jpg" alt="Stairway reward portrait" style="display:block;max-height:35vh;max-width:90%;margin:auto;border:8px ridge #c39d4d">',[['Back to yard',()=>startScavenge()],['Keep exploring',closeModal]]);}}
  function underRoof(){return H&&H.blocks.some(b=>Math.abs(rat.position.x-b.x)<b.w/2+.16&&Math.abs(rat.position.z-b.z)<b.d/2+.16&&rat.position.y<b.bottom&&rat.position.y+.75>b.bottom);}
  function jump(){if(H?.transit?.type==='lizard'){if(!H.transit.jumpTime)H.transit.jumpTime=1.35;return;}if(H&&!H.transit&&H.grounded&&!underRoof()){H.vy=6;H.grounded=false;rat.userData.air=true;rat.userData.crawl169=false;}}
  const oldCrawl=toggleCrawl169;toggleCrawl169=function(){if(phase==='heaven'&&(H?.transit||(rat.userData.crawl169&&underRoof())))return;return oldCrawl();};
  const oldJump=doJump;doJump=function(){if(phase==='heaven')return jump();return oldJump();};
  const oldGrab=grab;grab=function(){if(phase==='heaven')return use();return oldGrab();};
  addEventListener('keydown',e=>{if(phase!=='heaven'||/INPUT|TEXTAREA/.test(e.target?.tagName)||e.repeat)return;if(e.code==='Space'){e.preventDefault();jump();}if(e.key.toLowerCase()==='c')toggleCrawl169();});
  window.tickHeaven183=function(dt){
    if(!H||!rat)return;H.clock+=dt;const u=rat.userData;
    if(H.transit){const ride=H.transit,manual=['bird','lizard','climb','wall','wallfinish'].includes(ride.type);const moving=!manual||keys.w||keys.arrowup||joy.z<-.15;
      if(moving)ride.progress=Math.min(1,ride.progress+dt/ride.duration);
      const q=ride.progress;rat.position.lerpVectors(ride.from,ride.to,q);rat.rotation.y=Math.atan2(ride.to.x-ride.from.x,ride.to.z-ride.from.z);
      if(ride.type==='bird')rat.position.y+=Math.sin(q*Math.PI)*1.7;
      if(ride.type==='lizard'){
        ride.jumpTime=Math.max(0,(ride.jumpTime||0)-dt);
        const gap=(q>.28&&q<.42)||(q>.62&&q<.76);
        if(gap&&!ride.jumpTime){sayToast('Missed the gap — jump while riding.');respawn();return;}
        rat.position.y+=ride.jumpTime?Math.sin(Math.PI*ride.jumpTime/1.35)*.95:Math.sin(H.clock*14)*.025;
      }
      if(ride.type==='leap')rat.position.y+=Math.sin(q*Math.PI)*2;
      if(ride.type==='zipline')H.zipHandle.position.copy(rat.position).add(V(0,.88,0));
      const a=H.animals[ride.type];if(a){a.g.position.copy(rat.position);a.g.rotation.y=rat.rotation.y;rat.position.y+=ride.type==='bird'?-.6:.18;}
      u.seated41=ride.type==='lizard';u.air=ride.type==='bird'||ride.type==='zipline';rat.animate(dt,moving?.5:0,false);
      if(u.pipPivot&&['climb','wall','wallfinish'].includes(ride.type)) {u.pipPivot.rotation.x=.2;for(const side of ['Left','Right']){rotateBone69(u,side+'Arm',-1.4+Math.sin(H.clock*6+(side==='Left'?0:Math.PI))*.4);rotateBone69(u,side+'UpLeg',.6+Math.sin(H.clock*6+(side==='Left'?Math.PI:0))*.4);}}
      if(u.pipPivot&&ride.type==='leap'){u.pipPivot.rotation.x=q<.65?-Math.PI/2:Math.PI/2;for(const side of ['Left','Right'])rotateBone69(u,side+'Arm',-1.2);}
      if(u.pipPivot&&['bird','zipline'].includes(ride.type))for(const side of ['Left','Right'])rotateBone69(u,side+'Arm',-2.6);
      if(q===1){H.completed[ride.type]=true;if(ride.type==='leap')H.splashTime=1;rat.position.copy(ride.to);H.transit=null;H.vy=0;H.grounded=true;u.air=false;u.seated41=false;}
    }else{
      let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
      if(Math.hypot(joy.x,joy.z)>.15){dx=joy.x;dz=joy.z;}
      const len=Math.hypot(dx,dz),speed=u.crawl169?1.05:3.0;if(len>1){dx/=len;dz/=len;}
      const vx=(Math.cos(gameCam.yaw)*dx+Math.sin(gameCam.yaw)*dz)*speed,vz=(-Math.sin(gameCam.yaw)*dx+Math.cos(gameCam.yaw)*dz)*speed;
      const before=rat.position.clone();rat.position.x+=vx*dt;rat.position.z+=vz*dt;
      const radius=.16,height=u.crawl169?.29:.68;
      if(u.crawl169&&underRoof())H.completed.crawl=true;
      for(const b of H.blocks)if(Math.abs(rat.position.x-b.x)<b.w/2+radius&&Math.abs(rat.position.z-b.z)<b.d/2+radius&&rat.position.y+height>b.bottom&&rat.position.y<b.top){rat.position.x=before.x;rat.position.z=before.z;}
      for(const p of H.platforms)if(Math.abs(rat.position.x-p.x)<p.w/2+radius&&Math.abs(rat.position.z-p.z)<p.d/2+radius&&rat.position.y+height>p.bottom&&rat.position.y<p.y-.25){rat.position.x=before.x;rat.position.z=before.z;}
      H.vy-=dt*13;const nextY=rat.position.y+H.vy*dt;let floor=-Infinity;
      for(const p of H.platforms)if(Math.abs(rat.position.x-p.x)<p.w/2&&Math.abs(rat.position.z-p.z)<p.d/2&&p.y<=before.y+(H.grounded?.25:.03)&&p.y>=nextY-.02)floor=Math.max(floor,p.y);
      if(H.checkpoint===9&&Math.abs(rat.position.x-6)<2.25&&Math.abs(rat.position.z+59)<2.25){rat.position.y=10.9;H.vy=0;H.grounded=true;u.swim66=true;}
      else if(Number.isFinite(floor)&&H.vy<=0){rat.position.y=floor;H.vy=0;H.grounded=true;u.swim66=false;}else{rat.position.y=nextY;H.grounded=false;u.swim66=false;}
      u.air=!H.grounded;u.vy=H.vy;u.vel=Math.hypot(vx,vz);u.run=false;
      if(len>.1){const yaw=Math.atan2(vx,vz);rat.rotation.y+=Math.atan2(Math.sin(yaw-rat.rotation.y),Math.cos(yaw-rat.rotation.y))*(1-Math.exp(-dt*10));}
      rat.animate(dt,Math.min(1,len),false);
      if(rat.position.y<checkpoints[H.checkpoint].p[1]-4)respawn();
    }
    for(const a of Object.values(H.animals))a.mixer.update(dt);
    // Sequential checkpoints prevent a jump from skipping required animal sections.
    const next=checkpoints[H.checkpoint+1],requirement={3:'climb',4:'zipline',6:'lizard',7:'wall',8:'bird',9:'leap',10:'wallfinish'}[H.checkpoint+1];if(next&&!H.transit&&(!requirement||H.completed[requirement])&&(H.checkpoint!==6||H.completed.crawl)&&rat.position.distanceTo(V(...next.p))<1.1){H.checkpoint++;sayToast('Checkpoint '+(H.checkpoint+1)+' · '+next.name);}
    if(H.splashTime>0){H.splashTime=Math.max(0,H.splashTime-dt);H.splash.material.opacity=H.splashTime;H.splash.scale.setScalar(1+(1-H.splashTime)*5);}
    const a=nearAction();ui.prompt.style.display='block';ui.prompt.textContent=H.transit?(H.transit.type==='zipline'?'Zipline crossing…':H.transit.type==='leap'?'Leap of faith!':H.transit.type==='lizard'?'Hold forward · Jump over both gaps':'Hold forward to '+(H.transit.type==='bird'?'fly':'climb')):H.checkpoint===10?'E · Claim framed portrait':a?'E · '+a.label:H.checkpoint===6?'Crawl beneath the tunnel, then climb the brick wall':'Follow the gold checkpoint rings';
    $('padE').textContent=H.checkpoint===10?'Claim':a?'Use':'—';$('padJ').textContent='Jump';$('padC').textContent=u.crawl169?'Stand':'Crawl';
    $('heavenStage183').textContent=(H.checkpoint+1)+' / '+checkpoints.length+' · '+checkpoints[H.checkpoint].name;
    const target=rat.position.clone().add(V(0,.45,0)),d=gameCam.distance;
    const goal=target.clone().add(V(Math.sin(gameCam.yaw)*Math.cos(gameCam.pitch)*d,Math.sin(gameCam.pitch)*d,Math.cos(gameCam.yaw)*Math.cos(gameCam.pitch)*d));
    if(!gameCam.ready){camera.position.copy(goal);gameCam.ready=true;}else camera.position.lerp(goal,1-Math.exp(-dt*8));camera.lookAt(target);gameCam.pos.copy(camera.position);
  };
  function enterExtension184(){const cover=document.createElement('div');cover.textContent='Pip’s Lane → Rooftops · Loading Stairway to Heaven…';cover.style.cssText='position:fixed;inset:0;display:grid;place-items:center;background:#243e39;color:#f8e8c5;font:20px system-ui;z-index:999;padding:30px;text-align:center';document.body.appendChild(cover);requestAnimationFrame(()=>requestAnimationFrame(()=>{try{startHeaven183();}finally{cover.remove();}}));}
  const gateUse=useGate57;useGate57=function(){if(nearGate57()){enterExtension184();return true;}return gateUse();};
  // Replay is independent of the trophy and all old backyard job flags.
  const grabBeforeReplay185=grab;grab=function(){if(phase==='scavenge'&&rat&&Math.hypot(rat.position.x-29.5,rat.position.z-19)<2.8){enterExtension184();return true;}return grabBeforeReplay185();};
  const menuBeforeReplay185=menu65;menu65=function(){menuBeforeReplay185();const actions=$('modalActions');if(!actions||phase==='heaven')return;const b=document.createElement('button');b.className='btn';b.textContent=(home.stairwayPortrait183?'Replay':'Play')+' Stairway to Heaven';b.onclick=()=>{closeModal();enterExtension184();};actions.appendChild(b);};
  const yardStart184=startScavenge;startScavenge=function(){const returning=phase==='heaven';yardStart184();if(returning){rat.position.set(29,0,19);gameCam.yaw=-Math.PI/2;gameCam.ready=false;}};
  const areaStart=startArea;startArea=function(id){if(id==='courtyard'&&phase==='scavenge'){enterExtension184();return;}return areaStart(id);};
  const propsTick=tickProps57;tickProps57=function(dt){propsTick(dt);if(nearGate57()){ui.prompt.textContent='E · Stairway to Heaven';$('padE').textContent='Enter';}};
  const houseStart=startHouse;startHouse=function(){houseStart();if(home.stairwayPortrait183){const p=portrait(root,.85);p.position.set(0,1.9,-HD/2+.08);p.name='Earned Stairway portrait';}};
  const style=document.createElement('style');style.textContent='.heaven-course #title,.heaven-course #hud,.heaven-course #settings,.heaven-course #survival,.heaven-course #miniMap171,.heaven-course #mute,.heaven-course #weatherBadge,.heaven-course #cameraTools,.heaven-course #go,.heaven-course #padB,.heaven-course #padR,.heaven-course #tailWhip88,.heaven-course #hb{display:none!important}#heaven183{position:fixed;left:12px;right:12px;top:12px;z-index:80;max-width:400px;background:#243e39ed;color:#f8e8c5;border:1px solid #ccaa65;border-radius:14px;padding:12px;font:14px system-ui}#heaven183 strong,#heaven183 small{display:block;margin-bottom:6px}#heaven183 button,#heavenCamera183 button{border:0;border-radius:8px;background:#ead6a2;color:#243e39;padding:8px;margin:3px;pointer-events:auto}#heavenCamera183{position:fixed;left:12px;bottom:190px;z-index:90}.heaven-course #prompt{max-width:75%;font-size:15px;bottom:28%}';document.head.appendChild(style);
  style.textContent+='.heaven-course #tail67{display:none!important}';
  if(new URLSearchParams(location.search).has('heavenPreview')){const b=document.createElement('button');b.className='btn';b.textContent='Play Stairway to Heaven';b.style.cssText='position:fixed;top:12px;right:12px;z-index:200';b.onclick=()=>{b.remove();startHeaven183();};document.body.appendChild(b);}
})();
