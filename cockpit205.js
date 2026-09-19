/* Compact car HUD. Existing controls retain their handlers and live state. */
(()=>{
 const buttons=Array.from(carPanel77.children),[horn,exit,brake,view,drift,left,right,radio,wipers,map]=buttons;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
 const hud=el('section','cockpit205');hud.id='cockpit205';hud.setAttribute('aria-label','Driving controls');
 const quick=el('div','cockpit205-quick'),drawer=el('section','cockpit205-drawer');drawer.id='cockpit205-drawer';drawer.hidden=true;drawer.setAttribute('aria-label','Car controls');
 const menu=el('button','cockpit205-key','•••');menu.type='button';menu.setAttribute('aria-label','Open car controls');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-controls',drawer.id);
 const close=el('button','cockpit205-close','×');close.type='button';close.setAttribute('aria-label','Close car controls');
 function toggle(open){drawer.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.classList.toggle('selected',open);if(!open&&document.activeElement&&drawer.contains(document.activeElement))menu.focus();}
 menu.onclick=()=>toggle(drawer.hidden);close.onclick=()=>toggle(false);const title=el('header','cockpit205-title','CAR CONTROLS');title.appendChild(close);drawer.appendChild(title);
 const grid=el('div','cockpit205-grid');drawer.appendChild(grid);
 for(const b of [brake,left,right,radio,wipers,map,exit]){b.classList.add('cockpit205-secondary');grid.appendChild(b);}
 horn.dataset.short205='Horn';view.dataset.short205='View';for(const b of [horn,view]){b.classList.add('cockpit205-key');quick.appendChild(b);}quick.appendChild(menu);
 // Keep the dynamic full view name accessible, while the visible label stays short.
 horn.setAttribute('aria-label','Sound horn');view.setAttribute('aria-label','Change camera view');
 drift.classList.add('cockpit205-drift');drift.textContent='DRIFT';drift.setAttribute('aria-label','Hold to drift');drift.oncontextmenu=e=>e.preventDefault();const oldDown=drift.onpointerdown;drift.onpointerdown=e=>{if(e.button>0)return;drift.setPointerCapture?.(e.pointerId);oldDown(e);};for(const name of ['pointerup','pointercancel','lostpointercapture'])drift.addEventListener(name,()=>city204.release());
 const note=el('span','cockpit205-note','HOLD TO SLIDE');const main=el('div','cockpit205-main');main.append(drift,note);hud.append(drawer,quick,main);document.body.appendChild(hud);
 const smoke=el('button','cockpit205-secondary','Light cigarette');smoke.type='button';smoke.onclick=()=>window.pipSmoke205?.toggle();grid.insertBefore(smoke,exit);
 const foot=el('button','btn','Pip’s actions');foot.id='pipActions205';foot.onclick=()=>modal('Pip’s actions','<p>Light a cigarette, take a few puffs, then put it out.</p>',[[window.pipSmoke205?.state?'Put out cigarette':'Light cigarette',()=>{closeModal();window.pipSmoke205?.toggle();}],['Close',closeModal]]);
 const rail=document.getElementById('navigation201');if(rail)rail.appendChild(foot);
 for(const b of [map,exit])b.addEventListener('pointerdown',()=>toggle(false));
 for(const b of [horn,view,menu,close,smoke])b.addEventListener('pointerdown',e=>e.stopPropagation());
 addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false);});addEventListener('blur',()=>{toggle(false);city204.release();});
 const outside=e=>{if(!hud.contains(e.target))toggle(false);};document.addEventListener('pointerdown',outside);
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);const riding=!!car77?.riding&&gameplayActive()&&!photo.active&&!document.hidden;hud.hidden=!riding;if(!riding)toggle(false);const smoking=!!window.pipSmoke205?.state;smoke.textContent=smoking?'Put out cigarette':'Light cigarette';view.title=['Outside','Driver','Hands only','Dashboard','Shoulder'][roadsterControls203.viewIndex]+' · tap to change';};hud.hidden=true;
 window.cockpit205={hud,drawer,menu,close,toggle,smoke,drift};
})();
