/* Exploration shortcuts are an opt-in panel, never a permanent button stack. */
(()=>{
 const rail=document.getElementById('navigation201');
 const toggle=document.createElement('button');toggle.id='navigationToggle208';toggle.type='button';toggle.setAttribute('aria-label','Open exploration tools');toggle.setAttribute('aria-expanded','false');toggle.title='Map, objectives and actions';toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5z"/></svg>';rail.prepend(toggle);
 function open(value){rail.classList.toggle('tools-open208',value);toggle.setAttribute('aria-expanded',String(value));toggle.setAttribute('aria-label',value?'Close exploration tools':'Open exploration tools');}
 toggle.onclick=()=>open(!rail.classList.contains('tools-open208'));
 document.addEventListener('pointerdown',e=>{if(!rail.contains(e.target))open(false);});
 rail.addEventListener('click',e=>{const button=e.target.closest('button');if(button&&button!==toggle&&!button.closest('#mapTools207'))open(false);});
 // Hiding the map also dismisses the panel: only the compass remains.
 rail.querySelector('#mapTools207')?.addEventListener('click',()=>open(false));
 addEventListener('keydown',e=>{if(e.key==='Escape')open(false);});addEventListener('blur',()=>open(false));
 const style=document.createElement('style');style.textContent=`
 body #navigation201:not(.tools-open208)>button:not(#navigationToggle208),body #navigation201:not(.tools-open208)>#mapTools207,body #navigation201:not(.tools-open208)>#navTarget201{display:none!important}
 body #navigation201[data-map-size=hidden]:not(.tools-open208){width:44px!important}
 body #navigation201.tools-open208{width:200px!important;padding:8px;border:1px solid #d5dab235;border-radius:15px;background:#1e352eef;box-sizing:border-box;max-height:calc(100dvh - 330px);overflow:auto;overscroll-behavior:contain}
 body #navigation201 #navigationToggle208{display:block!important;order:-2;align-self:flex-end;width:44px!important;height:44px!important;min-height:44px!important;flex:0 0 44px;padding:11px!important;border:1px solid #e9e0c02b!important;border-radius:50%!important;background:#20372da6!important;color:#ede6cf!important;touch-action:manipulation}
 #navigationToggle208 svg{display:block;width:20px;height:20px}body #navigation201.tools-open208 #navigationToggle208{background:#c5ab75!important;color:#20372d!important}
 body #navigation201.tools-open208>button:not(#navigationToggle208){min-height:44px!important;font-size:11px!important;padding:7px!important;border:1px solid #ede6cf22!important;background:#ffffff0b!important;color:#ede6cf!important;border-radius:9px!important}
 body #navigation201.tools-open208 #miniMap171{display:none!important}
 @media(max-height:520px){body #navigation201.tools-open208{max-height:calc(100dvh - 90px)}}
 `;document.head.appendChild(style);
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);if(rail.dataset.inactive207==='true')open(false);};
 window.hud208={open};
})();
