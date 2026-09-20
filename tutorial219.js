/* Contextual first-use practice and a permanent control handbook. No modal locks
   during practice: completion comes from actions or measured movement. */
(()=>{
 const chapters={
  foot:[
   ['move','Move Pip','Push the left joystick, or hold WASD / arrow keys. Walk a little.'],
   ['look','Look around','Drag an empty part of the scene to turn the camera. Pinch to zoom.'],
   ['jump','Jump','Tap Jump (Space on a keyboard).'],
   ['crawl','Crawl','Tap Crawl to go low, then tap again to stand.'],
   ['roll','Roll','Tap Roll for a quick dodge.'],
   ['bite','Bite','Tap Bite for a close attack.'],
   ['tail','Tail whip','Tap Tail whip for a wider attack.'],
   ['grab','Grab / interact','Tap Grab near objects, doors, a car, a ladder or a boat. It changes with what is nearby.'],
   ['footView','Rat camera','Tap Rat view to switch first / third person (V).'],
   ['actions','Actions','Open Actions for Pip’s activities. Car parts are used directly by touching them. Close the panel afterwards.'],
   ['bag','Bag','Open Bag to inspect supplies, food and water. Close it afterwards.'],
   ['craft','Craft','Open Craft to read recipes and their ingredients. Close it afterwards.'],
   ['map','Map & destinations','Tap the compass / map to read destinations. The map toolbar can enlarge, fade or hide it.'],
   ['sound','Sound','Tap Sound to mute or unmute. Music can also be controlled in Menu → Music playlist.'],
   ['menu','Menu','Open Menu for travel, weather, camera, quality and this tutorial. Close it afterwards.']
  ],
  car:[
   ['ignition','Start the engine','Tap Start engine. Stop it before servicing. Close doors and hood before driving.'],
   ['drive','Accelerate gently','Joystick up / W accelerates. Ease off to coast. Drive a short distance.'],
   ['steer','Steer','Joystick left/right or A/D steers. Steering is gentler at higher speeds.'],
   ['brake','Brake & reverse','Pull the joystick back / hold S to brake. Keep holding after stopping to reverse slowly.'],
   ['carView','Car camera','Tap Car view / V to cycle Outside, Driver, Hands, Dashboard and Shoulder. Drag to look down.'],
   ['horn','Horn','Tap the speaker / horn button (H).'],
   ['carMenu','Car controls','Tap the three-line car button for Drive, Cabin and City pages.'],
   ['handbrake','Parking brake','Use Handbrake on the Drive page (B). Release it before driving.'],
   ['indicator','Indicators','Use left / right indicators on Drive (Q / R). Tap again to cancel.'],
   ['lights','Headlights','Use Headlights on Drive.'],
   ['wipers','Wipers','Cabin → Wipers cycles Auto, On and Off.'],
   ['radio','Car radio','Cabin → Radio cycles stations and Off (N).'],
   ['glovebox','Glovebox','Cabin → Glovebox moves supplies between the bag and car. Stop first.'],
   ['lookSide','Check beside you','Hold Look left, right or behind in Cabin. Release to face forward.'],
   ['drift','Drift','Hold DRIFT / Shift while moving to loosen grip. Release to regain traction.'],
   ['roof','Convertible roof','Park and tap the roof latch above the windscreen. Let the roof finish folding.'],
   ['windows','Windows','Look at a door and tap its window crank to raise or lower the windows.'],
   ['mirrors','Adjust mirrors','Tap a mirror, then drag it to aim its view. Pip reaches over. Tap Done when finished.'],
   ['door','Car doors','Look at a door handle: use the nearby Open / Close prompt. Stop before opening it.'],
   ['exitCar','Step out','Stop and tap the visible Exit car button, or look at the driver’s door handle and use Exit car.']
  ],
  service:[
   ['hood','Open the hood','Switch off, step out and walk to the front. Tap the hood or the nearby Open hood prompt.'],
   ['service','Service or upgrade','Tap an exposed part to hold it. Carry or drag it, then tap its empty slot to refit it. Tap a filler to use oil or water from your bag when needed.']
  ],
  sewer:[
   ['sewerMap','Sewer map','Use the compass / map to find ladders, canals and the boat. Surface entrances are marked ↓ SEWER.'],
   ['boat','Board the boat','Walk to the boat by the landing, then tap Grab / Board.'],
   ['row','Row','Push the joystick / W to row forward. Pull back to reverse; left/right steers.'],
   ['shore','Leave the boat','Stop alongside a dry bank and tap Grab / Leave boat.'],
  ]
 };
 const handbook=[
  ['Map toolbar','Map restores the minimap; expand changes size; transparency fades the background; the crossed eye hides it. Compass opens destinations and tracking.'],
  ['Home & building','Home returns home. Menu → Home & decorating opens furniture, paint, floors, windows and storage. Each building panel labels place, rotate, confirm and cancel. Craft shows costs before spending.'],
  ['Lizard','The green lizard button calls your companion. Use the nearby interaction prompt to ride / leave and the joystick to move.'],
  ['Actions & rest','Actions offers smoking, leaning against the car and sitting on the bench when nearby. Repeat the action or move to stand.'],
  ['Photo & camera','Menu → Camera has zoom, reset and Photo mode. Photo controls are labelled on the screen; close Photo to resume.'],
  ['Menus & choices','Close / × returns to play. Tabs switch pages. Disabled buttons need their listed supplies or conditions. Travel changes area; quality controls graphics; weather changes the weather.'],
  ['Service supplies','Three parts crates: beside the original car spot, on the approach road, and near the city entrance. Grab transfers only what fits. Oil and water are consumed; installed upgrades stay saved.'],
  ['Upgrades','Ignition & belt improves acceleration; radiator reduces heating; tyres improve cornering; rebuilt brakes improve stopping. Tap the engine part to inspect it. With a matching upgrade in your bag, Fit upgrade becomes available.']
 ];
 function state(){const s=home.tutorial219??={done:{},step:{},started:{}};if(s.carRevision!==220){s.carRevision=220;delete s.done.car;s.step.car=0;}return s;}
 let chapter=null,index=0,passed=false,origin=null,yaw=0,previousContext=null,paused=false;
 const card=document.createElement('section');card.id='lesson219';card.hidden=true;card.setAttribute('aria-label','Control practice');document.body.appendChild(card);
 const style=document.createElement('style');style.textContent='#lesson219{position:fixed;z-index:45;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);width:min(300px,calc(100vw - 24px));padding:8px 10px;box-sizing:border-box;border:1px solid #d5bb83;border-radius:14px;background:#19382ff5;color:#f4e4bf;font:12px/1.35 system-ui;box-shadow:0 6px 20px #0005}#lesson219[hidden]{display:none}#lesson219 details{max-height:18vh;overflow:auto;margin:5px 0}#lesson219 summary{min-height:28px;cursor:pointer}#lesson219 p{margin:5px 0 9px}#lesson219 button{min-height:44px;margin-right:6px;padding:8px 12px;border:1px solid #d0b888;border-radius:9px;background:#e8d3a2;color:#1e382e;font-weight:600}#lesson219 button:disabled{opacity:.45}.tutorial-controls219{outline:3px solid #f4cc65!important;outline-offset:3px}body.menu-open65 #lesson219{display:none}@media(max-height:500px){#lesson219{left:12px;transform:none;width:280px;font-size:12px}}';document.head.appendChild(style);
 function clearHighlight(){document.querySelectorAll('.tutorial-controls219').forEach(b=>b.classList.remove('tutorial-controls219'));}
 function draw(){if(!chapter)return;const step=chapters[chapter][index];card.hidden=false;card.innerHTML='<strong>'+chapter[0].toUpperCase()+chapter.slice(1)+' · '+(index+1)+' / '+chapters[chapter].length+' — '+step[1]+'</strong><details><summary>Show instructions</summary><p>'+step[2]+'</p></details><button id="lessonNext219">'+(passed?'Done ✓ · Next':'Try it first')+'</button><button id="lessonPause219">Pause</button>';$('lessonNext219').disabled=!passed;$('lessonNext219').onclick=next;$('lessonPause219').onclick=pause;clearHighlight();card.style.top='max(10px,env(safe-area-inset-top))';let placed=false;document.querySelectorAll('button').forEach(b=>{if(eventName(b)===step[0]&&!b.hidden&&b.offsetParent!==null){b.classList.add('tutorial-controls219');if(!placed){const r=b.getBoundingClientRect();if(r.top<190)card.style.top=Math.min(r.bottom+12,innerHeight-300)+'px';placed=true;}}});}
 function start(name,reset=false){if(!chapters[name])return;if(name==='foot'&&phase!=='scavenge'){closeModal();sayToast('Head outside to the yard for movement practice.');return;}closeModal();chapter=name;index=reset?0:Math.min(state().step[name]||0,chapters[name].length-1);state().started[name]=true;passed=false;paused=false;origin=rat?.position.clone();yaw=gameCam.yaw;draw();}
 function next(){if(!passed||!chapter)return false;index++;state().step[chapter]=index;save();if(index===chapters[chapter].length){state().done[chapter]=true;save();sayToast('Practice complete. Menu → Tutorial to read or practise again.');chapter=null;card.hidden=true;clearHighlight();return true;}passed=false;origin=rat?.position.clone();yaw=gameCam.yaw;draw();return true;}
 function pause(){paused=true;chapter=null;card.hidden=true;clearHighlight();save();sayToast('Lesson saved. Resume in Menu → Tutorial.');}
 function record(name){if(chapter&&chapters[chapter][index][0]===name&&!passed){passed=true;if(name==='exitCar'&&chapter==='car'&&index===chapters.car.length-1)next();else draw();}}
 function eventName(b){const id=b.id||'',text=(b.getAttribute?.('aria-label')||b.textContent||'').toLowerCase();const ids={padJ:'jump',padB:'bite',padR:'roll',padE:'grab',tail67:'tail',pipActions205:'actions',bag:'bag',craftBook:'craft',mute:'sound',menu65:'menu',ignition211:'ignition'};if(ids[id])return ids[id];if(/crawl/.test(text))return 'crawl';if(/grab|interact/.test(text))return 'grab';if(/rat.*view|walking view/.test(text))return 'footView';if(/car view|camera view/.test(text))return 'carView';if(/horn/.test(text))return 'horn';if(/car controls/.test(text))return 'carMenu';if(/handbrake|release brake/.test(text))return 'handbrake';if(/indicator/.test(text))return 'indicator';if(/headlight/.test(text))return 'lights';if(/wiper/.test(text))return 'wipers';if(/radio|dumpster fm|alley groove|rainy night/.test(text))return 'radio';if(/glovebox/.test(text))return 'glovebox';if(/look left|look right|look behind/.test(text))return 'lookSide';if(/drift/.test(text))return 'drift';if(/map|compass|destination/.test(text))return window.sewer211?.active?'sewerMap':'map';return null;}
 document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('button');if(b&&!b.disabled&&!card.contains(b)){const name=eventName(b);if(name)record(name);}},true);
 addEventListener('keydown',e=>{if(!gameplayActive()||/INPUT|TEXTAREA/.test(e.target?.tagName||''))return;const k=e.key.toLowerCase();const n={ ' ':'jump',v:car77?.riding?'carView':'footView',h:'horn',b:'handbrake',q:'indicator',r:'indicator',n:'radio',shift:'drift'}[k];if(n)record(n);});
 function menu(){closeModal();const rows=Object.entries(chapters).map(([name,steps])=>'<h3>'+name[0].toUpperCase()+name.slice(1)+(state().done[name]?' ✓':'')+'</h3>'+steps.map(s=>'<p><b>'+s[1]+':</b> '+s[2]+'</p>').join('')).join('');modal('Tutorial & button guide',rows+handbook.map(([title,text])=>'<p><b>'+title+':</b> '+text+'</p>').join(''),Object.keys(chapters).map(name=>['Practise '+name,()=>start(name,true)]).concat([['Resume saved lesson',()=>{const name=Object.keys(chapters).find(k=>state().started[k]&&!state().done[k])||'foot';start(name);}],['Close',closeModal]]));}
 const menuBefore=menu65;menu65=function(){menuBefore();const b=document.createElement('button');b.className='btn';b.textContent='Tutorial · read or practise';b.onclick=menu;$('modalActions').appendChild(b);};$('menu65').onclick=menu65;
 const enterCarBefore220=enterCar77;enterCar77=function(){const was=!!car77?.riding,result=enterCarBefore220();if(!was&&car77?.riding&&!state().done.car)start('car');return result;};
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);if(!rat||!gameplayActive()||document.hidden)return;const context=car77?.riding?'car':window.sewer211?.active?'sewer':'foot';if(context!==previousContext){previousContext=context;paused=false;if(chapter&&chapter!==context&&(chapter!=='service'||context==='car')){chapter=null;card.hidden=true;clearHighlight();}}
  if(!chapter&&!paused&&!state().done[context]&&(context!=='foot'||phase==='scavenge'))start(context);
  if(!chapter)return;const id=chapters[chapter][index][0];if(origin&&rat.position.distanceTo(origin)>.65&&id==='move')record('move');if(Math.abs(gameCam.yaw-yaw)>.16)record('look');if(car77?.riding){if(Math.abs(car77.speed)>.6)record('drive');if(Math.abs(car77.steer)>.3&&Math.abs(car77.speed)>.2)record('steer');if(car77.speed<-.2)record('brake');}if(window.sewerBoat215?.riding){record('boat');if(origin&&rat.position.distanceTo(origin)>.7)record('row');}else if(chapter==='sewer'&&id==='shore')record('shore');
 };
 window.tutorial219={start,next,pause,record,menu,chapters,handbook,get progress(){return {chapter,index,passed};}};
})();
