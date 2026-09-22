/* Build 250: simplified home workshop, progression, car recovery, headset mission actions. */
(()=>{
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const primary=['axe230','hammer230','saw230','brush230'].filter(id=>CRAFT[id]);
 const toolUse={
  axe230:'Chop fallen branches for building wood.',
  hammer230:'Repair home boards and straighten salvage into nails.',
  saw230:'Turn branches into planks at the home crafting table.',
  brush230:'Paint repaired wall boards.'
 };
 let tab='essentials',placedOwner=null;
 function tableRecord255(){return home.placed?.find(p=>p.id==='workbench')||null;}
 function moveTableHere255(){
  if(phase!=='house'||!rat)return;
  ensureHomeTable();const p=tableRecord255();if(!p)return;
  const fwd=new THREE.Vector3(Math.sin(rat.rotation.y),0,Math.cos(rat.rotation.y));
  p.x=THREE.MathUtils.clamp(rat.position.x+fwd.x*1.2,-HW/2+1.7,HW/2-1.7);
  p.z=THREE.MathUtils.clamp(rat.position.z+fwd.z*1.2,-HD/2+1.5,HD/2-1.5);
  p.rot=rat.rotation.y+Math.PI;save();
  if(root?.userData?.workshop251){root.remove(root.userData.workshop251);delete root.userData.workshop251;}
  closeModal();startHouse();sayToast('Crafting table moved.');
 }

 function ensureHomeTable(){
  home.placed=home.placed||[];
  if(!CRAFT.workbench||home.placed.some(p=>p.id==='workbench'))return;
  const p={id:'workbench',x:-4.4,z:-1.9,rot:0};
  home.placed.push(p);save();
  if(phase==='house'&&hs?.house&&typeof spawnPlaced==='function')try{spawnPlaced(p);}catch(e){}
 }
 const houseBefore250=startHouse;
 startHouse=function(){houseBefore250();ensureHomeTable();};

 function count(id){return (inv[id]||0)+(home.pantry?.[id]||0);}
 function ready(id){const c=CRAFT[id];return !!c&&Object.entries(c.needs||{}).every(([k,n])=>count(k)>=n)&&!(c.tool&&home.tools?.[id]);}
 function needHtml(c){return Object.entries(c.needs||{}).map(([k,n])=>{
  const have=count(k),ok=have>=n;return '<span class="'+(ok?'ok250':'miss250')+'"><b>'+esc(ITEMS[k]?.name||k)+'</b><small>'+have+' / '+n+'</small></span>';
 }).join('');}
 function group(id,c){
  if(primary.includes(id))return 'essentials';
  if(/stew|snack|food|meal|drink|brew/i.test(c.name||''))return 'food';
  if(c.result||/plank|nail|paint|material|foil|twine/i.test(c.name||''))return 'materials';
  return 'home';
 }
 function recipeIds(){
  return Object.keys(CRAFT).filter(id=>{
   const c=CRAFT[id];if(!c||c.collectible)return false;
   if(c.tool&&home.tools?.[id])return false;
   if(c.special==='door'&&home.door)return false;
   return group(id,c)===tab;
  });
 }
 function purpose(id){
  return toolUse[id]|| (typeof craftPurpose40==='function'?craftPurpose40(id,CRAFT[id]):'');
 }
 function doCraft(id){
  if(phase!=='house')return;
  const c=CRAFT[id];if(!c)return;
  if(!ready(id)){sayToast('Missing materials for '+c.name+'.');return;}
  const made=performCraft(id,1);if(made)openWorkshop250(id);
 }

 function unloadAll(){
  ensureLife();home.pantry=home.pantry||{};let moved=0;
  for(const [k,n] of Object.entries(inv)){if(n>0){home.pantry[k]=(home.pantry[k]||0)+n;moved+=n;delete inv[k];}}
  save();bag();sayToast(moved?'Moved '+moved+' items into home storage.':'Your bag is already empty.');
  return moved;
 }
 function takePrimary(){
  const wanted=new Set(primary.flatMap(id=>Object.keys(CRAFT[id].needs||{})));let moved=0;
  for(const id of wanted){const have=inv[id]||0,stored=home.pantry?.[id]||0,need=Math.max(0,4-have),take=Math.min(stored,need);if(take){inv[id]=(inv[id]||0)+take;home.pantry[id]-=take;moved+=take;}}
  save();bag();sayToast(moved?'Loaded useful tool materials into your bag.':'No extra tool materials needed.');
 }

 function svg254(id){
  const map={
   axe230:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#e7dbc3"/><path d="M57 88L67 30" stroke="#72472b" stroke-width="11" stroke-linecap="round"/><path d="M64 31L93 22 101 44 69 48Z" fill="#777b72" stroke="#535850" stroke-width="3"/><path d="M62 45c9-6 17-9 25-10" stroke="#c8aa76" stroke-width="4"/></svg>',
   hammer230:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#e7dbc3"/><path d="M58 94L64 41" stroke="#714b30" stroke-width="11" stroke-linecap="round"/><path d="M37 32L88 38 86 54 36 49Z" fill="#85877f" stroke="#565950" stroke-width="3"/><path d="M56 45c9-2 19-1 29 3" stroke="#c2a16e" stroke-width="4"/></svg>',
   saw230:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#e7dbc3"/><path d="M27 39H94L86 73 78 66 70 75 62 67 54 76 46 68 38 77 27 70Z" fill="#8c928c" stroke="#565d57" stroke-width="3"/><rect x="17" y="31" width="18" height="50" rx="6" fill="#704b31"/></svg>',
   brush230:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="#e7dbc3"/><path d="M60 97L61 55" stroke="#714b30" stroke-width="12" stroke-linecap="round"/><path d="M39 54L82 54 77 27 44 27Z" fill="#b89d68"/><path d="M45 33L76 33" stroke="#5e7e50" stroke-width="6"/></svg>',
   stick:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><rect width="90" height="90" rx="16" fill="#eadfc9"/><path d="M20 64C35 52 46 48 68 26" stroke="#71482d" stroke-width="8" stroke-linecap="round"/><path d="M45 45l-9-12M53 38l12-8" stroke="#71482d" stroke-width="5" stroke-linecap="round"/></svg>',
   pebble:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><rect width="90" height="90" rx="16" fill="#eadfc9"/><path d="M23 58Q20 42 31 31Q43 20 61 28Q74 35 68 55Q61 69 42 68Q29 68 23 58Z" fill="#9ca19a" stroke="#6d736d" stroke-width="3"/></svg>',
   string:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><rect width="90" height="90" rx="16" fill="#eadfc9"/><ellipse cx="45" cy="45" rx="26" ry="15" fill="none" stroke="#a47c49" stroke-width="7"/><ellipse cx="45" cy="45" rx="17" ry="8" fill="none" stroke="#d3b47a" stroke-width="4"/></svg>',
   foil:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><rect width="90" height="90" rx="16" fill="#eadfc9"/><path d="M22 28L69 22 65 63 29 69Z" fill="#bfc6c2" stroke="#7e8884" stroke-width="3"/><path d="M30 34L58 29M31 46L61 41" stroke="#eef2ef" stroke-width="3"/></svg>',
   nail:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><rect width="90" height="90" rx="16" fill="#eadfc9"/><path d="M27 28L64 65" stroke="#686f6d" stroke-width="7"/><path d="M23 24L36 19" stroke="#4d5553" stroke-width="8" stroke-linecap="round"/></svg>',
   fiber:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><rect width="90" height="90" rx="16" fill="#eadfc9"/><path d="M31 68L38 26M43 69L46 23M55 67L60 29" stroke="#73945a" stroke-width="6" stroke-linecap="round"/></svg>'
  };
  const s=map[id];return s?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s):'';
 }
 function preview(id){try{return typeof recipePreview==='function'?recipePreview(id):'';}catch(e){return '';}}
 function ingredientIcon(id){const src=svg254(id)||preview(id);return src?'<img src="'+src+'" alt="'+esc(ITEMS[id]?.name||id)+'">':'<span class="fallback251">◆</span>';}
 function needHtml(c){return Object.entries(c.needs||{}).sort(([ka,na],[kb,nb])=>(count(ka)>=na)-(count(kb)>=nb)).map(([k,n])=>{
  const have=count(k),ok=have>=n,name=ITEMS[k]?.name||k;
  return '<span class="need251 '+(ok?'ok250':'miss250')+'">'+ingredientIcon(k)+'<span><strong>'+esc(name)+'</strong><small>Have '+have+' · Need '+n+'</small></span></span>';
 }).join('');}
 function shortUse251(id){
  return ({axe230:'Chop',hammer230:'Repair',saw230:'Planks',brush230:'Paint',sawplanks230:'Make planks',salvagenails230:'Make nails',mixpaint230:'Mix paint'})[id]||'';
 }
 function card(id){
  const c=CRAFT[id],isReady=ready(id),src=svg254(id)||preview(id),use=shortUse251(id);
  const missing=Object.entries(c.needs||{}).filter(([k,n])=>count(k)<n).map(([k,n])=>(n-count(k))+' '+(ITEMS[k]?.name||k)).join(', ');
  return '<article class="recipe250 '+(isReady?'ready251':'')+'" data-card250="'+id+'">'+
   (src?'<img class="recipeimg251" src="'+src+'" alt="'+esc(c.name)+'">':'')+
   '<div class="title251"><strong>'+esc(c.name)+'</strong>'+(use?'<small>'+esc(use)+'</small>':'')+'</div>'+
   (!isReady&&missing?'<div class="missingSummary254">Missing: '+esc(missing)+'</div>':'')+'<div class="needs250">'+needHtml(c)+'</div>'+
   (isReady?'<button data-craft250="'+id+'">Craft</button>':'<span class="missingbtn251">Missing</span>')+
  '</article>';
 }
 function closeWorkshop251(){
  const p=$('workshopPanel251');if(p)p.remove();
  document.body.classList.remove('workshop-live251');
  if(window.workshop251State){window.workshop251State.open=false;window.workshop251State.crafting=false;}if(rat?.userData)rat.userData.seated41=false;
 }
 function progressStrip251(){
  return '<div class="toolstrip251">'+primary.map((id,i)=>{
   const done=!!home.tools?.[id],src=svg254(id)||preview(id),active=!done&&primary.slice(0,i).every(x=>home.tools?.[x]);
   return '<div class="'+(done?'done251':active?'active251':'')+'">'+(src?'<img src="'+src+'" alt="">':'')+'<span>'+esc(CRAFT[id].name.replace(/^(Pebble |Salvage |Tin-tooth |Fibre )/i,''))+'</span>'+(done?'<b>✓</b>':'')+'</div>';
  }).join('<i>›</i>')+'</div>';
 }
 function createPanel251(){
  let panel=$('workshopPanel251');if(panel)panel.remove();
  panel=document.createElement('section');panel.id='workshopPanel251';panel.innerHTML='<header><div><small>PIP’S HOME</small><b>Home Crafting Table</b><em>Tiny tools for a bigger home</em></div><button id="closeWorkshop251" aria-label="Close">×</button></header><div id="workshopScene253"></div><div id="workshopBody251"></div><footer><div id="bagFooter253"></div><button id="unloadFooter253">⇩ Unload Bag</button><button id="storageFooter253">▣ Open Storage</button><div id="storageCount253"></div></footer>';
  document.body.appendChild(panel);$('closeWorkshop251').onclick=closeWorkshop251;return panel;
 }
 function renderWorkshop251(focus){
  const panel=$('workshopPanel251')||createPanel251(),body=$('workshopBody251');
  const done=primary.filter(id=>home.tools[id]).length,ids=recipeIds();
  body.innerHTML=
   progressStrip251()+
   '<nav class="tabs250">'+[['essentials','🛠 Tools'],['materials','◆ Materials'],['home','⌂ Home'],['food','● Food']].map(([k,n])=>'<button data-tab250="'+k+'" aria-pressed="'+(tab===k)+'">'+n+'</button>').join('')+'</nav>'+
   '<div class="craftgrid251">'+(ids.map(card).join('')||'<p class="empty251">Nothing left here.</p>')+'</div>';
  body.querySelectorAll('[data-tab250]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab250;renderWorkshop251();});
  body.querySelectorAll('[data-craft250]').forEach(b=>b.onclick=()=>doCraftAnimated251(b.dataset.craft250));
  const bf=$('bagFooter253'),sf=$('storageCount253');if(bf)bf.textContent='Bag '+totalBag()+' / '+bagCapacity();if(sf)sf.textContent='Home Storage '+Object.values(home.pantry||{}).reduce((a,n)=>a+(n||0),0);
  const uf=$('unloadFooter253'),stf=$('storageFooter253');if(uf)uf.onclick=()=>{unloadAll();renderWorkshop251();};if(stf)stf.onclick=()=>{closeWorkshop251();openPantry();};
  if(focus){body.querySelector('[data-card250="'+focus+'"]')?.scrollIntoView({block:'center'});}
  panel.dataset.done=done;
 }
 function openWorkshop250(focus){
  if(phase!=='house'){
   modal('Crafting table is at home','<p>Return home to use Pip’s crafting table.</p>',[['Go home',()=>{closeModal();startHouse();}],['Close',closeModal]]);
   return;
  }
  ensureHomeTable();ensureLife();home.tools=home.tools||{};home.pantry=home.pantry||{};
  seedWorkshop251();document.body.classList.add('workshop-live251');
  window.workshop251State.open=true;positionPip251();gameCam.yaw=-.52;gameCam.pitch=.30;gameCam.distance=5.3;gameCam.ready=false;
  renderWorkshop251(focus);
 }

 const workshop251State=window.workshop251State={open:false,crafting:false,until:0,kind:null,prop:null};
 function seedWorkshop251(){
  if(phase!=='house'||!root)return;
  if(root.userData.workshop251)return;
  const rec=tableRecord255()||{x:-4.4,z:-1.9,rot:0};const g=new THREE.Group();g.name='Pip detailed crafting table';g.position.set(rec.x,0,rec.z);g.rotation.y=rec.rot||0;root.add(g);root.userData.workshop251=g;
  const woodM=new THREE.MeshStandardMaterial({color:0x684628,roughness:.82}),darkM=new THREE.MeshStandardMaterial({color:0x33291f,roughness:.9}),metalM=new THREE.MeshStandardMaterial({color:0x7d827b,metalness:.55,roughness:.42}),paperM=new THREE.MeshStandardMaterial({color:0xd8c9a8,roughness:1});
  const add=(geo,mat,x,y,z,name)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.name=name;m.userData.noInk=true;m.castShadow=true;m.receiveShadow=true;g.add(m);return m;};
  add(new THREE.BoxGeometry(2.65,.14,1.12),woodM,0,.82,0,'Heavy workbench top');
  for(const x of [-1.12,1.12])for(const z of [-.42,.42])add(new THREE.BoxGeometry(.15,.82,.15),woodM,x,.41,z,'Workbench leg');
  add(new THREE.BoxGeometry(2.35,.09,.18),darkM,0,.35,-.46,'Workbench brace');
  const back=add(new THREE.BoxGeometry(2.55,1.15,.10),woodM,0,1.43,.50,'Tool backboard');
  for(let i=0;i<5;i++){const hook=add(new THREE.CylinderGeometry(.015,.015,.18,8),metalM,-.85+i*.42,1.55,.41,'Tool hook');hook.rotation.x=Math.PI/2;}
  const vise=add(new THREE.BoxGeometry(.40,.28,.32),metalM,1.02,.94,-.12,'Workbench vise');add(new THREE.CylinderGeometry(.025,.025,.62,8),metalM,1.02,.83,-.31,'Vise handle').rotation.z=Math.PI/2;
  add(new THREE.BoxGeometry(.62,.025,.43),paperM,-.55,.91,-.10,'Cutting mat');
  for(let i=0;i<4;i++){const scrap=add(new THREE.BoxGeometry(.32,.035,.07),i%2?woodM:metalM,-.7+i*.42,.94,.17,'Crafting material');scrap.rotation.y=(i-1.5)*.18;}
  const lampStem=add(new THREE.CylinderGeometry(.025,.025,.8,8),metalM,-1.02,1.28,.36,'Workbench lamp stem');lampStem.rotation.z=-.18;
  const shade=add(new THREE.ConeGeometry(.22,.25,16,1,true),new THREE.MeshStandardMaterial({color:0x395443,roughness:.7,side:THREE.DoubleSide}),-.90,1.66,.30,'Workbench lamp');shade.rotation.x=Math.PI;
  const light=new THREE.PointLight(0xffd48a,.7,5);light.position.set(-.90,1.54,.15);g.add(light);
  const stool=new THREE.Group();stool.position.set(0,0,-1.15);g.add(stool);const seat=new THREE.Mesh(new THREE.CylinderGeometry(.38,.35,.10,12),woodM);seat.position.y=.46;seat.userData.noInk=true;stool.add(seat);for(const x of [-.23,.23])for(const z of [-.18,.18]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.07,.46,.07),woodM);leg.position.set(x,.23,z);leg.userData.noInk=true;stool.add(leg);}
 }
 function positionPip251(){
  const g=root?.userData?.workshop251;if(!g||!rat)return;
  const seat=g.localToWorld(new THREE.Vector3(-.12,0,-1.02));rat.position.copy(seat);rat.rotation.y=g.rotation.y;rat.userData.vel=0;rat.userData.air=false;rat.userData.seated41=true;
  gameCam.yaw=-.38;gameCam.pitch=.37;gameCam.distance=6.2;gameCam.ready=false;
 }
 function craftProp251(kind){
  const g=new THREE.Group(),wood=new THREE.MeshStandardMaterial({color:0x725036,roughness:.9}),metal=new THREE.MeshStandardMaterial({color:0x8d928d,metalness:.55,roughness:.35});
  if(kind==='saw230'){
   const blade=new THREE.Mesh(new THREE.BoxGeometry(.42,.13,.02),metal);blade.position.set(.12,.18,0);g.add(blade);
   const grip=new THREE.Mesh(new THREE.BoxGeometry(.12,.16,.05),wood);grip.position.set(-.16,.16,0);g.add(grip);
  }else if(kind==='brush230'){
   const handle=new THREE.Mesh(new THREE.CylinderGeometry(.02,.025,.34,8),wood);handle.position.y=.17;g.add(handle);
   const head=new THREE.Mesh(new THREE.BoxGeometry(.18,.12,.05),wood);head.position.y=.38;g.add(head);
  }else{
   const handle=new THREE.Mesh(new THREE.CylinderGeometry(.025,.032,.42,8),wood);handle.position.y=.21;g.add(handle);
   const head=new THREE.Mesh(new THREE.BoxGeometry(kind==='axe230'?.24:.20,.10,.10),metal);head.position.y=.43;g.add(head);
  }
  g.scale.setScalar(.78);return g;
 }
 function doCraftAnimated251(id){
  if(workshop251State.crafting)return;
  const c=CRAFT[id];if(!c||!ready(id)){sayToast('Missing materials.');return;}
  workshop251State.crafting=true;workshop251State.until=performance.now()+1150;workshop251State.kind=id;
  const prop=craftProp251(id);workshop251State.prop=prop;root.add(prop);
  try{sequence67(rat,[id==='saw230'?'Craft_Saw_Loop':'Craft_Hammer_Loop'],{duration:1.1,lock:true});}catch(e){}
  const button=$('workshopBody251')?.querySelector('[data-craft250="'+id+'"]');if(button){button.disabled=true;button.textContent='Working…';}
  setTimeout(()=>{
   if(workshop251State.prop){workshop251State.prop.parent?.remove(workshop251State.prop);workshop251State.prop=null;}
   if(phase==='house'&&ready(id))performCraft(id,1);
   workshop251State.crafting=false;workshop251State.kind=null;
   if(workshop251State.open)renderWorkshop251(id);
  },1150);
 }

 // Replace the old 3x3 ingredient HUD with the simple home table.
 openCraftBook=openWorkshop250;
 $('craftBook').onclick=()=>openWorkshop250();

 // One-tap home unloading.
 const unload=document.createElement('button');unload.id='unloadHome250';unload.className='btn';unload.textContent='Unload bag';unload.onclick=()=>{unloadAll();};
 document.body.appendChild(unload);

 // Home menu gets direct workshop/storage actions.
 const homeMenuBefore250=homeMenu63;
 homeMenu63=function(){
  if(phase!=='house')return homeMenuBefore250();
  ui.hb.style.display='none';
  modal('Your home','<p>Home is now the centre for storage, crafting and decorating.</p>',[
   ['Crafting table',openWorkshop250],['Move crafting table here',moveTableHere255],
   ['Unload bag to storage',()=>{unloadAll();homeMenu63();}],
   ['Place furniture',()=>chest60('furniture')],
   ['Storage chest',openPantry],
   ['Repairs & paint',()=>homestead230.menu()],
   ['Close',closeModal]
  ]);
 };

 function resetCar250(){
  try{if(car77?.riding){car77.speed=0;exitCar77();}}catch(e){}
  try{stopEngine77();}catch(e){}
  delete home.vehicle219;delete home.car206;
  if(home.homestead230){} // preserve unrelated progression
  try{disposeCar77();}catch(e){}
  try{addCar77();}catch(e){}
  save();sayToast('Roadster reset to factory condition.');
 }

 function actions250(){
  const md=window.music227?.data?.(),found=!!md?.headphones,mission=!!md?.mission250;
  const arr=[
   [window.pipSmoke205?.state?'Put out cigarette':'Light cigarette',()=>{closeModal();window.pipSmoke205?.toggle();}],
   ['Reset roadster',()=>{closeModal();resetCar250();}],
   [found?'Headphones · '+(md.wear?'equipped':'found'):mission?'Headset mission · in progress':'Start headset mission',()=>{
      closeModal();
      if(found)music227.menu();
      else if(mission)openYard201('headphones227');
      else{md.mission250=true;save();sayToast('Mission started: find Pip’s walnut headset by the yard path.');openYard201('headphones227');}
   }],
   ['Music',()=>{closeModal();music227.menu();}],
   ['Close',closeModal]
  ];
  modal('Pip’s actions','<p>Quick recovery and equipment actions.</p>',arr);
 }
 const act=$('pipActions205');
 act.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();actions250();},true);

 // Always expose reset in the car-control sheet.
 function addResetButton(){
  const box=$('carActions242');if(!box||$('resetCar250'))return;
  const b=document.createElement('button');b.id='resetCar250';b.textContent='Reset car';b.onclick=resetCar250;box.appendChild(b);
 }

 // Clearer objectives: tools first, then headset and major exploration goals.
 const objectivesBefore250=openObjectives200;
 openObjectives200=function(){
  const md=window.music227?.data?.(),found=!!md?.headphones,mission=!!md?.mission250;
  const toolRows=primary.map(id=>{
   const c=CRAFT[id],done=!!home.tools?.[id];
   return '<div class="objtool250"><b>'+(done?'✓ ':'○ ')+esc(c.name)+'</b><small>'+Object.entries(c.needs).map(([k,n])=>esc(ITEMS[k]?.name||k)+' '+count(k)+'/'+n).join(' · ')+'</small><em>'+esc(toolUse[id]||'')+'</em></div>';
  }).join('');
  modal('Objectives',
   '<section class="objective250"><h3>1 · Establish the home workshop</h3><p>Return home and use the crafting table. Unload salvage into home storage; crafting automatically counts both bag and stored materials.</p><button data-obj250="craft">Open crafting table</button></section>'+
   '<section class="objective250"><h3>2 · Craft the primary tools</h3>'+toolRows+'</section>'+
   '<section class="objective250"><h3>3 · Headset mission</h3><p>'+(found?'✓ Walnut headset recovered. It is now available from Actions and Music.':mission?'Find the walnut headset beside the yard path.':'Start the headset mission from Actions.')+'</p><button data-obj250="headset">'+(found?'Open Music':mission?'Show mission area':'Start mission')+'</button></section>'+
   '<section class="objective250"><h3>4 · Restore the home</h3><p>Use the hammer + planks + nails for damaged boards. Use the brush + paint for repaired walls.</p></section>'+
   '<section class="objective250"><h3>5 · Explore</h3><p>Drive the city, tame the lizard, replay Stairway to Heaven and explore the sewer routes.</p></section>',
   [['Yard map',()=>openYard201()],['Close',closeModal]]
  );
  $('modalBody').querySelector('[data-obj250="craft"]').onclick=()=>openWorkshop250();
  $('modalBody').querySelector('[data-obj250="headset"]').onclick=()=>{
   if(found)return music227.menu();
   md.mission250=true;save();closeModal();openYard201('headphones227');
  };
 };

 const css=document.createElement('style');css.textContent=`
 #unloadHome250{display:none;position:fixed;left:12px;bottom:235px;z-index:44;min-height:44px;padding:9px 12px;font:600 12px system-ui;background:#d7ba7b;color:#24362f}
 .workshop250 section{width:min(650px,96vw)!important}.progress250{padding:12px 14px;background:#e4eadb;border-radius:12px;margin-bottom:10px}.progress250 b,.progress250 small{display:block}.progress250 small{margin-top:4px;color:#5d6c60}
 .tabs250,.quick250{display:flex;gap:7px;overflow-x:auto;margin:10px 0}.tabs250 button,.quick250 button,.objective250 button{min-height:44px;padding:9px 12px;border:1px solid #bdc7b5;border-radius:10px;background:#eef2e7;color:#294438;font:600 13px system-ui}.tabs250 button[aria-pressed=true]{background:#315a49;color:white}
 .goal250{background:#f0e4ca;padding:10px;border-radius:10px}.list250{display:flex;flex-direction:column;gap:9px}.recipe250{border:1px solid #d5d9cb;border-radius:14px;padding:12px;background:#fffdf8}.recipe250 header{display:flex;gap:10px;justify-content:space-between;align-items:flex-start}.recipe250 header>div{min-width:0}.recipe250 strong{font:650 16px system-ui}.recipe250 header small{display:block;margin-top:4px;font:12px/1.35 system-ui;color:#657365}.recipe250 header button{min-height:44px;padding:8px 12px;border:0;border-radius:10px;background:#315a49;color:white;font:600 13px system-ui}.recipe250 header button:disabled{background:#c7cbc2;color:#6d756d}
 .needs250{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.needs250 span{padding:7px 9px;border-radius:9px;min-width:100px}.needs250 span b,.needs250 span small{display:block}.needs250 span small{font:12px system-ui}.ok250{background:#e1eedb}.miss250{background:#f3dfd4}
 .objective250{padding:12px;border:1px solid #d7d9cd;border-radius:12px;margin-bottom:10px;background:#fffdf8}.objective250 h3{margin:0 0 7px!important}.objtool250{display:grid;grid-template-columns:1fr auto;gap:3px 10px;padding:8px 0;border-bottom:1px solid #e2e2d8}.objtool250 small{font:12px system-ui;color:#6a7267}.objtool250 em{grid-column:1/-1;font:12px/1.35 system-ui;color:#56645a}

 #workshopPanel251{position:fixed;z-index:90;inset:0;background:linear-gradient(180deg,rgba(26,36,31,.22),rgba(16,23,19,.96) 33%);color:#f4ead6;font-family:system-ui;display:grid;grid-template-rows:auto minmax(130px,25vh) 1fr auto;overflow:hidden}
 #workshopPanel251>header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:linear-gradient(90deg,#53391f,#6c4a28);border-bottom:2px solid #b89561;box-shadow:0 4px 20px #0007}
 #workshopPanel251>header>div small,#workshopPanel251>header>div em{display:block;font:600 10px/1.2 system-ui;letter-spacing:.14em;opacity:.75}#workshopPanel251>header>div b{display:block;font:700 24px Georgia,serif;letter-spacing:.01em}#workshopPanel251>header>div em{font-style:normal;letter-spacing:0;margin-top:2px}
 #closeWorkshop251{width:48px;height:48px;border:1px solid #e5d2aa55;border-radius:14px;background:#20352c;color:#f7edd7;font-size:28px}
 #workshopScene253{position:relative;background:linear-gradient(90deg,rgba(24,33,28,.12),rgba(24,33,28,.72));overflow:hidden;pointer-events:none}
 #workshopScene253:before{content:'Pip at the workbench';position:absolute;left:18px;bottom:14px;padding:7px 10px;border-radius:10px;background:#1d2e27c9;color:#f2dfb8;font:600 12px system-ui}
 #workshopBody251{overflow:auto;padding:12px 14px 18px;touch-action:pan-y;background:linear-gradient(#1c2a24,#17231e)}
 .toolstrip251{display:flex;align-items:center;gap:6px;padding:10px;background:#253930;border:1px solid #dfc78733;border-radius:16px;max-width:760px;margin:0 auto 10px}.toolstrip251>div{position:relative;flex:1;text-align:center;opacity:.4}.toolstrip251 img{display:block;width:56px;height:56px;object-fit:contain;margin:auto;border-radius:50%;background:#efe4cf}.toolstrip251 span{font-size:11px}.toolstrip251 i{opacity:.4}.toolstrip251 .done251{opacity:1}.toolstrip251 .active251{opacity:1;filter:drop-shadow(0 0 10px #e5b75b)}.toolstrip251 b{display:block;color:#a7d9a4;font-size:12px;margin-top:2px}
 #workshopPanel251 .tabs250{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:900px;margin:0 auto 12px}#workshopPanel251 .tabs250 button{min-height:50px;border:1px solid #d8bd843f;border-radius:13px;background:#253a31;color:#f5e8cf;font:650 14px system-ui}#workshopPanel251 .tabs250 button[aria-pressed=true]{background:#d8ae63;color:#1f2d27}
 .craftgrid251{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;max-width:1000px;margin:0 auto}.recipe250{display:grid;grid-template-columns:118px 1fr auto;grid-template-rows:auto auto;gap:8px 12px;align-items:center;background:#f3e7d2;color:#25372f;border:2px solid #d5bd91;border-radius:18px;padding:12px;box-shadow:0 5px 0 #0002}.recipeimg251{grid-row:1/3;width:118px;height:118px;object-fit:contain;background:#e2d7c2;border-radius:14px}.title251 strong{display:block;font:700 18px Georgia,serif}.title251 small{display:block;font:12px system-ui;color:#6a7268;margin-top:3px}.recipe250>button{grid-column:3;grid-row:1/3;min-width:92px;min-height:48px;border:0;border-radius:12px;background:#35694c;color:#fff;font:700 14px system-ui}.recipe250>button:disabled{background:#aaa99e;color:#eee8dc}.missingSummary254{grid-column:2/4;font:700 12px system-ui;color:#a34f3f;background:#f4ddd4;border-radius:9px;padding:6px 8px}.needs250{grid-column:2;display:flex;gap:6px;overflow:visible;flex-wrap:wrap}.need251{display:flex;align-items:center;gap:7px;padding:6px 8px!important;min-width:150px!important;border-radius:10px}.need251 img{width:38px;height:38px;object-fit:contain;border-radius:8px}.need251 span{min-width:0}.need251 strong{display:block;font:700 12px system-ui}.need251 small{display:block;font:11px system-ui;color:#59665c;margin-top:2px}.need251 b{font:700 12px system-ui!important}.ok250{background:#dcebd8}.miss250{background:#f0d7cd}.missingbtn251{grid-column:3;grid-row:1/3;align-self:center;padding:11px 13px;border-radius:10px;background:#9d9b91;color:#f1eadc;font:700 12px system-ui}.recipe250.ready251{box-shadow:inset 4px 0 #4d8a62,0 5px 0 #0002}.empty251{grid-column:1/-1;text-align:center;opacity:.7}
 #workshopPanel251>footer{display:grid;grid-template-columns:1fr auto auto 1fr;gap:10px;align-items:center;padding:12px 16px;background:linear-gradient(90deg,#4a341f,#5b4025);border-top:2px solid #b89561}#workshopPanel251>footer>div,#workshopPanel251>footer>button{min-height:44px;border-radius:11px;border:1px solid #d5bd8955;background:#20352c;color:#f7ead0;font:650 13px system-ui;padding:10px 13px}#workshopPanel251>footer>div:last-child{text-align:right}
 body.workshop-live251 #settings,body.workshop-live251 #survival,body.workshop-live251 #hud,body.workshop-live251 #pad,body.workshop-live251 #homePanelToggle,body.workshop-live251 #unloadHome250,body.workshop-live251 #pipActions205,body.workshop-live251 #tail67,body.workshop-live251 #wallControls,body.workshop-live251 #prompt{display:none!important}
 @media(max-width:700px){#workshopPanel251{grid-template-rows:auto 23vh 1fr auto}#workshopPanel251>header>div b{font-size:20px}.toolstrip251 img{width:42px;height:42px}.toolstrip251 span{display:none}.craftgrid251{grid-template-columns:1fr}.recipe250{grid-template-columns:86px 1fr auto}.recipeimg251{width:86px;height:86px}.title251 strong{font-size:16px}.need251 img{width:28px;height:28px}#workshopPanel251>footer{grid-template-columns:1fr 1fr;gap:7px}#workshopPanel251>footer>div:last-child{text-align:left}} `;document.head.appendChild(css);

 const tickBefore250=tickWorld38;
 tickWorld38=function(dt){
  tickBefore250(dt);addResetButton();seedWorkshop251();
  unload.style.display=phase==='house'&&gameplayActive()&&!workshop251State.open&&totalBag()>0?'block':'none';
  const g=root?.userData?.workshop251;
  if(g&&rat&&phase==='house'&&!workshop251State.open&&!photo.active&&rat.position.distanceTo(g.position)<1.7){
    ui.prompt.style.display='block';ui.prompt.textContent='Crafting table · Tap Craft';$('padE').textContent='Craft';
  }
  if(workshop251State.crafting&&workshop251State.prop&&rat){
    const hand=rat.userData.pipBones?.RightHand;
    if(hand){rat.updateWorldMatrix(true,true);workshop251State.prop.position.copy(hand.getWorldPosition(new THREE.Vector3()));workshop251State.prop.rotation.set(0,rat.rotation.y,Math.sin(performance.now()*.018)*.65);}
  }
  if(workshop251State.open&&phase!=='house')closeWorkshop251();
};

 const grabBefore251=grab;grab=function(){const g=root?.userData?.workshop251;if(phase==='house'&&g&&rat&&!workshop251State.open&&rat.position.distanceTo(g.position)<1.7){openWorkshop250();return;}return grabBefore251();};
 const controlBefore251=control;control=function(dt,options){if(workshop251State.open)return 0;return controlBefore251(dt,options);};
 window.workshop250={open:openWorkshop250,close:closeWorkshop251,unloadAll,resetCar:resetCar250,actions:actions250,moveTableHere:moveTableHere255};
})();