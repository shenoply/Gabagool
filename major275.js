/* Build 275: major consolidation — cleaner HUD, journal, adaptive rendering, progression feedback. */
(()=>{
 const css=document.createElement('style');
 css.textContent=`
 body.focus275 #navigation201{opacity:.82}
 body.focus275 #objective269{opacity:.92}
 #objective269.compact275 small{display:none}
 #objective269.compact275{padding:6px 11px;max-width:min(330px,60vw);opacity:.82}
 #journey275{display:grid;gap:9px}
 #journey275 section{padding:11px 12px;border:1px solid #b9aa7b55;border-radius:12px;background:#ffffff0a}
 #journey275 b{color:#f1d79e}
 #journey275 .meter{height:7px;border-radius:8px;background:#ffffff18;overflow:hidden;margin-top:7px}
 #journey275 .meter i{display:block;height:100%;background:#d7b766}
 @media(max-width:600px){#objective269.compact275{max-width:58vw;font-size:10px}}
 `;document.head.appendChild(css);

 let objectiveClock=0,lastObjectiveKey='',uiClock=0,perfClock=0,frames=0,perfTier=0,goodClock=0;
 function journey275(){
  const s=progress76(),f=home.flow269||{discovered:{}},disc=Object.keys(f.discovered||{}).length;
  const milestones=[
   ['Meet Big Rat',!!s.missionsActive],
   ['Recover the vinyl',!!s.vinyl],
   ['Find the silver key',!!s.pool],
   ['Unlock the alley',!!s.jobs],
   ['Discover the city',!!f.discovered?.city],
   ['Find the lizard den',!!f.discovered?.den],
   ['Tame the lizard',!!home.geckoTamed88],
   ['Complete Stairway to Heaven',!!home.stairwayPortrait183]
  ];
  const done=milestones.filter(x=>x[1]).length,pct=Math.round(done/milestones.length*100);
  modal('Pip’s journal',`<div id="journey275"><section><b>Journey progress · ${pct}%</b><div class="meter"><i style="width:${pct}%"></i></div><p>${done} of ${milestones.length} major milestones complete · ${disc} locations discovered.</p></section><section>${milestones.map(([n,v])=>'<p>'+(v?'✓':'○')+' '+n+'</p>').join('')}</section><section><b>Current objective</b><p>${window.flow269?.current?.().title||'Explore Pip’s Lane'}</p><small>${window.flow269?.current?.().detail||'Scavenge, build and explore.'}</small></section></div>`,[['Map',()=>window.openYard201?.()],['Close',closeModal]]);
 }
 const menu0=menu65;
 menu65=function(...a){
  const r=menu0(...a),actions=$('modalActions');
  if(actions&&!actions.querySelector('[data-journal275]')){const b=document.createElement('button');b.className='btn';b.dataset.journal275='';b.textContent='Pip’s journal';b.onclick=journey275;actions.prepend(b);}
  return r;
 };

 function objective275(dt){
  const el=document.getElementById('objective269');if(!el||el.hidden)return;
  const q=window.flow269?.current?.();const key=q?.id||'';
  if(key!==lastObjectiveKey){lastObjectiveKey=key;objectiveClock=7;el.classList.remove('compact275');}
  else objectiveClock=Math.max(0,objectiveClock-dt);
  el.classList.toggle('compact275',objectiveClock===0);
  const busy=!!car77?.riding||!!photo.active||!!(sc&&sc.talk)||$('modal')?.style.display==='flex';
  el.style.visibility=busy?'hidden':'visible';
 }

 function focus275(){
  const busy=!!car77?.riding||!!photo.active||!!(sc&&sc.talk)||$('modal')?.style.display==='flex';
  document.body.classList.toggle('focus275',!busy);
 }

 function setTier275(tier){
  if(tier===perfTier)return;perfTier=tier;
  const coarse=matchMedia('(pointer:coarse)').matches;
  const base=lowQuality?1:(coarse?1.15:1.5);
  const ratio=tier===2?Math.min(base,.85):tier===1?Math.min(base,1):base;
  renderer.setPixelRatio(Math.min(devicePixelRatio,ratio));resize();
  if(tier===2&&!lowQuality){lowQuality=true;renderer.shadowMap.enabled=false;scene.traverse(o=>{if(o.userData.atmosphere)o.visible=false;});}
  if(tier>0)sayToast(tier===2?'Performance mode · lighter world':'Performance mode · reduced resolution');
 }
 function perf275(dt){
  frames++;perfClock+=dt;if(perfClock<4)return;
  const fps=frames/perfClock;frames=0;perfClock=0;
  if(fps<34){goodClock=0;setTier275(2);}
  else if(fps<44){goodClock=0;if(perfTier<1)setTier275(1);}
  else if(fps>54){goodClock+=4;if(goodClock>=16&&perfTier>0){goodClock=0;setTier275(perfTier-1);}}
  else goodClock=0;
 }

 const tick0=tickWorld38;
 tickWorld38=function(dt){
  tick0(dt);
  uiClock+=dt;if(uiClock>.12){uiClock=0;objective275(.12);focus275();}
  perf275(dt);
 };

 window.major275={journal:journey275,get performanceTier(){return perfTier;}};
})();