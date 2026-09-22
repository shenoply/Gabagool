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

 function ensureHomeTable(){
  home.placed=home.placed||[];
  if(!CRAFT.workbench||home.placed.some(p=>p.id==='workbench'))return;
  const p={id:'workbench',x:3.6,z:1.9,rot:Math.PI};
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
  if(c.result||/plank|nail|paint|material|foil/i.test(c.name||''))return 'materials';
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

 function card(id){
  const c=CRAFT[id],isReady=ready(id),why=purpose(id);
  return '<article class="recipe250"><header><div><strong>'+esc(c.name)+'</strong>'+(why?'<small>'+esc(why)+'</small>':'')+'</div><button data-craft250="'+id+'" '+(isReady?'':'disabled')+'>'+(isReady?'Craft':'Missing')+'</button></header><div class="needs250">'+needHtml(c)+'</div></article>';
 }
 function openWorkshop250(focus){
  if(phase!=='house'){
   modal('Crafting table is at home','<p>Pip now does all proper crafting at his home table. Bring salvage home, unload it into storage, then craft from one clear list.</p>',[['Go home',()=>{closeModal();startHouse();}],['Close',closeModal]]);
   return;
  }
  ensureHomeTable();ensureLife();home.tools=home.tools||{};home.pantry=home.pantry||{};
  const done=primary.filter(id=>home.tools[id]).length;
  const ids=recipeIds();
  modal('Home crafting table',
   '<div class="progress250"><b>Primary tools '+done+' / '+primary.length+'</b><small>Materials in your bag and home storage are counted together.</small></div>'+
   '<div class="tabs250">'+[['essentials','Tools'],['materials','Materials'],['home','Home items']].map(([k,n])=>'<button data-tab250="'+k+'" aria-pressed="'+(tab===k)+'">'+n+'</button>').join('')+'</div>'+
   '<div class="quick250"><button id="unload250">Unload entire bag to home</button><button id="load250">Take useful tool materials</button></div>'+
   (tab==='essentials'?'<p class="goal250"><b>Recommended order:</b> axe → hammer → saw → brush. Each card shows exactly what is missing.</p>':'')+
   '<div class="list250">'+(ids.map(card).join('')||'<p>Nothing left to craft in this section.</p>')+'</div>',
   [['Objectives',openObjectives200],['Close',closeModal]]
  );
  $('modal').classList.add('workshop250');
  $('modalBody').querySelectorAll('[data-tab250]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab250;openWorkshop250();});
  $('modalBody').querySelectorAll('[data-craft250]').forEach(b=>b.onclick=()=>doCraft(b.dataset.craft250));
  $('unload250').onclick=()=>{unloadAll();openWorkshop250();};
  $('load250').onclick=()=>{takePrimary();openWorkshop250();};
  if(focus){const el=$('modalBody').querySelector('[data-craft250="'+focus+'"]')?.closest('.recipe250');el?.scrollIntoView({block:'center'});}
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
   ['Crafting table',openWorkshop250],
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
 `;document.head.appendChild(css);

 const tickBefore250=tickWorld38;
 tickWorld38=function(dt){tickBefore250(dt);addResetButton();unload.style.display=phase==='house'&&gameplayActive()&&totalBag()>0?'block':'none';};

 window.workshop250={open:openWorkshop250,unloadAll,resetCar:resetCar250,actions:actions250};
})();