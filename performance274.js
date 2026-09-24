/* Build 274: performance scheduler for decorative/UI work. */
(()=>{
 const wrapRate=(name,hz)=>{
  const old=window[name];if(typeof old!=='function')return;
  let acc=0;
  window[name]=function(dt,...args){acc+=dt;if(acc<1/hz)return;const use=Math.min(.12,acc);acc=0;return old(use,...args);};
 };
 wrapRate('tickAtmosphere',30);
 wrapRate('tickYard47',30);
 wrapRate('tickAnimals37',30);
 wrapRate('tickModels44',30);
 const oldDraw=window.drawLife;if(typeof oldDraw==='function'){
  let acc=0;window.drawLife=function(){acc+=STEP;if(acc<.2)return;acc=0;return oldDraw();};
 }
 // Reduce expensive skinned pedestrian bounds checks even further; motion remains continuous.
 if(window.cityLife263?.people){
  for(const p of window.cityLife263.people)if(p)p.groundClock=0;
 }
  window.performance274={active:true};
})();