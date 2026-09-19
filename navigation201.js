/* Build 201: readable navigation, live objectives and one responsive HUD rail. */
(() => {
  const rail=document.createElement('aside');rail.id='navigation201';rail.setAttribute('aria-label','Exploration tools');document.body.appendChild(rail);
  const style=document.createElement('style');style.textContent=`
#navigation201{position:fixed;right:max(10px,env(safe-area-inset-right));top:92px;z-index:26;display:none;flex-direction:column;align-items:stretch;gap:6px;width:138px;pointer-events:auto}
#navigation201 #miniMap171{position:relative!important;inset:auto!important;flex-shrink:0;cursor:pointer;pointer-events:auto;width:138px!important;height:138px!important}
#navigation201 button{position:relative!important;inset:auto!important;transform:none!important;margin:0!important;width:100%!important;min-height:34px!important;padding:7px 8px!important;font:600 11px/1.25 system-ui!important;border-radius:9px!important}
#navigation201 #heavenLaunch186{display:none!important}
#navigation201 .mapLegend200{display:none}#navigation201 #miniMap171 b{font-size:10px}
#navigation201 [data-id=alley]{font-size:12px!important}#navigation201 [data-heaven186]{display:none}
#navigation201 [data-id=pip]{z-index:5;text-shadow:0 0 3px #000;font-size:14px!important}
#navTarget201{font:11px/1.35 system-ui;background:#203b35ed;padding:7px;border-radius:8px;color:#ffdf90;text-align:center;pointer-events:none}
body.menu-open65 #navigation201,body.photo #navigation201,body.heaven-course #navigation201{display:none!important}
.map201{position:relative;width:100%;height:310px;min-height:200px;background:#294c41;border:1px solid #688e73;border-radius:14px;overflow:hidden;touch-action:manipulation}
.map201 svg{position:absolute;width:100%;height:100%;inset:0;pointer-events:none}.map201 button{position:absolute!important;transform:translate(-50%,-50%);border:2px solid #dfd6ac;background:#e9d7a7;color:#213c32;border-radius:50%;width:32px;height:32px;min-height:0;padding:0;cursor:pointer;font:bold 14px system-ui;z-index:2}.map201 button.selected{outline:3px solid #fff;box-shadow:0 0 15px #eac95c}.map201 .player{position:absolute;color:white;transform:translate(-50%,-50%);z-index:3;pointer-events:none;text-shadow:0 1px 4px black;font-size:20px}.map201-note{font:14px/1.5 system-ui;margin:10px 0}.map201-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:10px}.map201-list button{border:1px solid #b2bda4;background:#e8ebdc;color:#243c32;border-radius:9px;padding:10px;text-align:left;font:13px system-ui;cursor:pointer}.map201-list button.active{background:#f0d58c}.objectives200 section{color:#243c32}.objective201-track{border:0;border-radius:8px;background:#29463e;color:#fff1ce;padding:8px 12px;margin-top:6px;cursor:pointer}
@media(max-height:540px){#navigation201{top:58px;width:112px;gap:4px;right:8px}#navigation201 #miniMap171{display:none!important}#navigation201 button{min-height:30px!important;padding:6px!important}#navigation201 #navTarget201{max-height:40px;overflow:hidden}}
@media(max-width:480px){.map201{height:280px}.map201-list{grid-template-columns:1fr 1fr}#navigation201{top:94px}}
`;document.head.appendChild(style);
  const mapButton=document.createElement('button');mapButton.className='btn';mapButton.textContent='⌖ Open yard map';mapButton.onclick=()=>openYard201();rail.appendChild(mapButton);
  const targetLabel=document.createElement('div');targetLabel.id='navTarget201';targetLabel.hidden=true;rail.appendChild(targetLabel);
  let tracked=null,lastRefresh=0;
  const point=(x,z)=>({x:Math.max(5,Math.min(95,8+(x+22)/70*84)),y:Math.max(7,Math.min(94,91-(z+14)/67*80))});
  function destinations(){const s=progress76(),bird=typeof rideActor71==='function'?rideActor71():null;return [
    {id:'home',icon:'⌂',name:'Pip’s home',x:0,z:-2,detail:'Return home to decorate and arrange your crafted furniture.'},
    {id:'rat',icon:'R',name:'Big Rat',x:NB.x,z:NB.z,detail:s.jobs?'Jobs complete. Your reward is in storage.':'Talk to Big Rat, then recover the vinyl and silver key.'},
    {id:'alley',icon:'A',name:'Alley route / rooftops',x:29.5,z:19,detail:'The east gate leads to Stairway to Heaven. Approach it and press Enter. The course is always replayable.'},
    {id:'den',icon:'L',name:'Lizard den',x:-18.75,z:24.75,detail:home.geckoTamed88?'Use the whistle to call your lizard.':'Find the lizard at its clay-stone den and use Tame.'},
    {id:'car',icon:'C',name:'Convertible',x:car77?.g.position.x??5.4,z:car77?.g.position.z??17.6,detail:'Approach either side and press Drive. Joystick or WASD drives; Horn and Exit appear while seated.'},
    {id:'bird',icon:'B',name:'Osprey transport',x:bird?.g.position.x??0,z:bird?.g.position.z??0,detail:bird?'Live bird position. Approach its pickup range for a lift.':'The bird is not available in this area.',unavailable:!bird},
    {id:'bench',icon:'W',name:'Workbench & storage',x:3.2,z:31.3,detail:'Bring salvage here to craft and manage your supplies.'},
    {id:'pond',icon:'≈',name:'Willow Pond',x:23.2,z:32.1,detail:'Swim and dive beneath the pond surface.'},
    {id:'dumpster',icon:'D',name:'Dumpster',x:8.7,z:-10.8,detail:'Climb inside to search for salvage.'},
    {id:'vinyl',icon:'♪',name:'Violet-label vinyl',x:yard76?.vinyl?.m.position.x??0,z:yard76?.vinyl?.m.position.z??0,detail:s.vinyl?'Collected.':'Recover this for Big Rat.',unavailable:!yard76?.vinyl||!!s.vinyl},
    {id:'key',icon:'K',name:'Silver pool key',x:yard76?.poolFind?.m.position.x??-12.5,z:yard76?.poolFind?.m.position.z??30.7,detail:s.pool?'Collected.':'Search the old pool for Big Rat’s silver key.',unavailable:!yard76?.poolFind||!!s.pool}
  ];}
  function track(id){tracked=id;closeModal();const d=destinations().find(d=>d.id===id);sayToast('Tracking '+d.name+' — follow the gold marker on your map.');}
  function openYard201(selected=tracked||'alley'){
    if(phase!=='scavenge'){openMap();return;}const all=destinations(),d=all.find(d=>d.id===selected)||all[0];
    const markers=all.filter(d=>!d.unavailable).map(d=>{const p=point(d.x,d.z);return `<button data-map201="${d.id}" class="${d.id===selected?'selected':''}" style="left:${p.x}%;top:${p.y}%" aria-label="${d.name}" title="${d.name}">${d.icon}</button>`;}).join('');
    const p=point(rat.position.x,rat.position.z);
    modal('Pip’s Lane · Yard map',`<div class="map201"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 15H72V85H12Z" fill="#45623f" stroke="#a08959" stroke-width="1.5"/><path d="M34 82L34 50L60 50L60 30L25 30" fill="none" stroke="#a99c78" stroke-width="3" opacity=".5"/><ellipse cx="62" cy="35" rx="6" ry="4" fill="#447d86"/><rect x="14" y="34" width="8" height="6" rx="2" fill="#75aeb4"/></svg>${markers}<span class="player" style="left:${p.x}%;top:${p.y}%" title="Pip">●</span></div><p class="map201-note"><b>${d.name}</b><br>${d.detail}</p><div class="map201-list">${all.filter(d=>!d.unavailable).map(d=>`<button data-map201="${d.id}" class="${d.id===selected?'active':''}">${d.icon} · ${d.name}</button>`).join('')}</div>`,[['Track destination',()=>track(d.id),!!d.unavailable],['Objectives',openObjectives200],['Close',closeModal]]);
    $('modalBody').querySelectorAll('[data-map201]').forEach(b=>b.onclick=()=>openYard201(b.dataset.map201));
  }
  window.openYard201=openYard201;
  openObjectives200=function(){const s=progress76();const items=[
    ['Big Rat’s jobs',s.jobs?'Complete — reward collected':!s.missionsActive?'Talk to Big Rat to begin':s.vinyl&&s.pool?'Return to Big Rat to collect your reward':'In progress','rat',`<p>${s.vinyl?'✓':'○'} Recover the violet-label vinyl</p><p>${s.pool?'✓':'○'} Find the silver pool key</p>`],
    ['Alley route / Stairway to Heaven',home.stairwayPortrait183?'Portrait earned · replay any time':'Available · east gate, marked A','alley','<p>Complete the rooftop course and claim the framed rat portrait.</p>'],
    ['Meet your lizard',home.geckoTamed88?'Tamed · whistle to call it':'Visit the clay-stone den','den',''],
    ['Take the convertible for a drive','Available · marked C','car','<p>Drive, reverse, steer and honk. Stop before getting out.</p>'],
    ['Rebuild your home','Collect salvage → craft → decorate','bench','']
  ];modal('Objectives',`<div class="objectives200">${items.map(([name,status,id,body])=>`<section><b>${name}</b>${body}<p>${status}</p><button class="objective201-track" data-objective201="${id}">Show on map</button></section>`).join('')}</div>`,[['Yard map',()=>openYard201()],['Travel',openMap],['Close',closeModal]]);$('modalBody').querySelectorAll('[data-objective201]').forEach(b=>b.onclick=()=>openYard201(b.dataset.objective201));};
  const tick=tickWorld38;tickWorld38=function(dt){tick(dt);const visible=phase==='scavenge'&&!photo.active&&$('modal').style.display!=='flex';rail.style.display=visible?'flex':'none';
    for(const id of ['miniMap171','objectives200','geckoWhistle193','heavenLaunch186']){const el=$(id);if(el&&el.parentNode!==rail){rail.insertBefore(el,targetLabel);if(id==='miniMap171'){el.setAttribute('role','button');el.setAttribute('aria-label','Open detailed yard map');el.tabIndex=0;el.onclick=()=>openYard201();el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openYard201();}};}}}
    if(!visible||!rat)return;lastRefresh+=dt;if(lastRefresh<.15)return;lastRefresh=0;const map=$('miniMap171');if(map){map.querySelector('b').textContent='Pip’s Lane · tap to open';let marker=map.querySelector('[data-nav201]');if(!marker){marker=document.createElement('i');marker.dataset.nav201='';marker.style.cssText='position:absolute;color:#ffd55f;font-size:25px;transform:translate(-50%,-50%);text-shadow:0 0 3px black;pointer-events:none;z-index:4';marker.textContent='◎';map.appendChild(marker);}const d=destinations().find(d=>d.id===tracked&&!d.unavailable);marker.style.display=d?'block':'none';targetLabel.hidden=!d;if(d){window.mapPoint171(marker,d.x,d.z);const distance=Math.hypot(d.x-rat.position.x,d.z-rat.position.z);targetLabel.textContent=d.name+' · '+(distance<2?'Here':Math.round(distance)+' m');}}
  };
})();
