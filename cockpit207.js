/* Small persistent driving controls; the secondary panel opens only on demand. */
(()=>{
 const paths={horn:'M4 10h4l8-5v14l-8-5H4z M19 9q3 3 0 6',camera:'M4 7h4l2-3h4l2 3h4v13H4z M15 13a3 3 0 1 0-6 0 3 3 0 0 0 6 0',menu:'M4 7h16M4 12h16M4 17h16',drift:'M8 4h8l3 5v7H5V9z M8 4 6 9h12 M8 12h1m6 0h1 M7 19q-4 1 0 3m10-3q-4 1 0 3',map:'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2z M9 3v16M15 5v16',expand:'M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6',hide:'M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z M4 3l16 18',opacity:'M12 3a9 9 0 1 0 0 18z M12 3a9 9 0 0 1 0 18',back:'m14 5-7 7 7 7'};
 const svg=name=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${name==='opacity'?'<path d="M12 3a9 9 0 1 0 0 18z" fill="currentColor"/>':''}<path d="${paths[name]}"/></svg>`;
 const quick=cockpit205.hud.querySelector('.cockpit205-quick');
 for(const [b,name,label]of [[quick.children[0],'horn','Sound horn'],[quick.children[1],'camera','Change camera view'],[cockpit205.menu,'menu','Car controls']]){delete b.dataset.short205;b.dataset.icon207=name;b.setAttribute('aria-label',label);b.title=label;b.insertAdjacentHTML('beforeend',svg(name));}
 // Dynamic legacy text updates cannot replace the icon rendered by CSS's mask.
 const drift=cockpit205.drift;drift.innerHTML=svg('drift')+'<span>DRIFT</span>';
 const rail=document.getElementById('navigation201'),bar=document.createElement('div');bar.id='mapTools207';rail.prepend(bar);
 let state={size:'small',transparent:false};try{const saved=JSON.parse(localStorage.getItem('ww-map207'));if(['small','large','hidden'].includes(saved?.size))state.size=saved.size;state.transparent=!!saved?.transparent;}catch{}
 function button(icon,label,fn){const b=document.createElement('button');b.type='button';b.innerHTML=svg(icon);b.setAttribute('aria-label',label);b.title=label;b.onclick=e=>{e.stopPropagation();fn();};bar.appendChild(b);return b;}
 const show=button('map','Show minimap',()=>set('size','small'));
 const enlarge=button('expand','Enlarge minimap',()=>set('size',state.size==='large'?'small':'large'));
 const fade=button('opacity','Make minimap transparent',()=>set('transparent',!state.transparent));
 const hide=button('hide','Hide minimap',()=>set('size','hidden'));
 function set(key,value){state[key]=value;try{localStorage.setItem('ww-map207',JSON.stringify(state));}catch{}update();}
 function update(){rail.dataset.mapSize=state.size;rail.classList.toggle('map-transparent207',state.transparent);const hidden=state.size==='hidden';show.hidden=!hidden;enlarge.hidden=fade.hidden=hide.hidden=hidden;enlarge.setAttribute('aria-label',state.size==='large'?'Shrink minimap':'Enlarge minimap');enlarge.title=enlarge.getAttribute('aria-label');fade.setAttribute('aria-pressed',String(state.transparent));fade.title=state.transparent?'Make minimap solid':'Make minimap transparent';fade.setAttribute('aria-label',fade.title);}
 update();
 const css=document.createElement('style');css.textContent=`
 #cockpit205 [data-icon207]{font-size:0!important}#cockpit205 [data-icon207]::after{content:'';display:block;width:21px;height:21px;margin:auto;background:currentColor;mask:var(--icon207) center/contain no-repeat;-webkit-mask:var(--icon207) center/contain no-repeat}
 #cockpit205 [data-icon207] svg{display:none}#cockpit205 .cockpit205-key{border-radius:50%!important;background:#1c332cd9!important}
 #cockpit205{width:148px;bottom:max(18px,env(safe-area-inset-bottom))}#cockpit205 .cockpit205-quick{gap:6px;margin-bottom:10px}
 #cockpit205 .cockpit205-drift{width:66px!important;height:66px!important;min-height:66px!important;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:8px!important;letter-spacing:.05em;background:#d6b77dcf!important}
 #cockpit205 .cockpit205-drift svg{width:25px;height:25px}#cockpit205 .cockpit205-note{display:none}#cockpit205 .cockpit205-main{width:66px}
 #cockpit205 .cockpit205-drawer{bottom:132px;border-radius:16px;max-height:calc(100dvh - 230px)}#cockpit205 .cockpit205-title{font-size:9px}#cockpit205 .cockpit205-secondary{font-size:10px!important}
 #toast{top:auto!important;bottom:190px!important;font:11px/1.35 system-ui!important;padding:7px 11px!important;max-width:min(280px,78vw)!important;border-radius:9px!important;pointer-events:none}
 #chatter66{font:12px/1.4 system-ui!important;padding:8px 11px!important;bottom:190px!important;width:min(310px,80vw);box-sizing:border-box}
 #prompt{font-size:11px!important;line-height:1.3!important}#hud,#phase,#mute#mute{font-size:11px!important}
 body #navigation201{top:calc(env(safe-area-inset-top,0px) + 148px)!important;right:max(10px,env(safe-area-inset-right));width:138px!important;gap:4px}
 body.driving203 #settings{top:14px!important;font-size:11px!important;padding:8px 12px!important;min-height:44px!important}body.driving203 #navigation201{display:flex!important;top:calc(env(safe-area-inset-top,0px) + 68px)!important}body.driving203 #navigation201>button,body.driving203 #navTarget201{display:none!important}
 body #navigation201[data-map-size=large]{width:min(230px,calc(100vw - 24px))!important}body #navigation201.map-panel207[data-map-size=large]{width:138px!important}
 body #navigation201 #miniMap171{width:100%!important;height:auto!important;aspect-ratio:1;box-sizing:border-box;border:1px solid #d8d6ae66;background:#203b34db!important;display:block!important}
 body #navigation201.map-transparent207 #miniMap171{background:#203b3426!important;border-color:#d8d6ae55}.map-transparent207 .mapTerrain207{opacity:.18!important}#miniMap171 i{text-shadow:0 1px 3px #071b14,0 0 2px #071b14}
 body #navigation201 #miniMap171 b{display:none}body.driving203 #navigation201[data-map-size=hidden]{width:44px!important}
 body #navigation201[data-map-size=hidden] #miniMap171,body #navigation201[data-map-size=hidden] #navTarget201{display:none!important}
 #mapTools207{display:flex;justify-content:flex-end;gap:2px;order:-1;pointer-events:auto}body #navigation201 #mapTools207 button{width:44px!important;height:44px!important;min-height:44px!important;flex:0 0 44px;padding:11px!important;border:1px solid #d8d6ae33;background:#203b34d9;color:#f4ecd8;border-radius:12px!important;touch-action:manipulation}
 #mapTools207 button[hidden]{display:none!important}#mapTools207 svg{display:block;width:20px;height:20px}body #navigation201 #mapTools207 button[aria-pressed=true]{background:#c1a367;color:#20352e}
 body.menu-open65 #navigation201,body.photo #navigation201,body.heaven-course #navigation201,body #navigation201[data-inactive207=true]{display:none!important}
 @media(max-height:520px){body #navigation201{top:64px!important;right:10px}body #navigation201 #miniMap171{max-height:145px}body #navigation201[data-map-size=large] #miniMap171{max-height:200px}#chatter66,#toast{bottom:20px!important;max-width:40vw!important}#cockpit205 .cockpit205-drawer{bottom:0;right:158px;max-height:calc(100dvh - 28px)}}
 `;document.head.appendChild(css);
 for(const b of quick.children){const name=b.dataset.icon207;if(name){const data=svg(name);b.style.setProperty('--icon207',`url("data:image/svg+xml,${encodeURIComponent(data)}")`);}}
 const before=tickWorld38;tickWorld38=function(dt){before(dt);rail.classList.toggle('map-panel207',!cockpit205.drawer.hidden);const map=document.getElementById('miniMap171');if(map&&!map.querySelector('.mapTerrain207')){map.insertAdjacentHTML('afterbegin','<svg class="mapTerrain207" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.55"><path d="M9 42H92V94H9Z" fill="#5e794b" stroke="#d0b784" stroke-width=".6"/><path d="M21 15H79V33H21Z" fill="none" stroke="#b0aaa0" stroke-width="6"/><path d="M48 43V33" stroke="#b0aaa0" stroke-width="5"/><path d="M21 15H79V33H21Z" fill="none" stroke="#f0d896" stroke-dasharray="2 2" stroke-width=".6"/><text x="50" y="8" font-size="5" text-anchor="middle" fill="#fff1cc">CITY</text></svg>');}rail.dataset.inactive207=String(phase!=='scavenge'||photo.active||!gameplayActive());};
 window.cockpit207={set,get state(){return {...state};}};
})();
