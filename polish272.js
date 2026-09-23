/* Build 272: interaction smoothing + lightweight performance guards. */
(()=>{
 let talkFacing=false,nearClock=0,lastPrompt='',fpsFrames=0,fpsTime=performance.now(),lowHint=false;
 function faceTarget272(target,dt){
  if(!rat||!target)return;
  const dx=target.x-rat.position.x,dz=target.z-rat.position.z;if(Math.hypot(dx,dz)<.01)return;
  const yaw=Math.atan2(dx,dz),d=Math.atan2(Math.sin(yaw-rat.rotation.y),Math.cos(yaw-rat.rotation.y));
  rat.rotation.y+=d*(1-Math.exp(-dt*8));
 }
 const talk0=startTalk;startTalk=function(...a){talkFacing=true;return talk0(...a);};
 const end0=endTalk;endTalk=function(...a){const r=end0(...a);talkFacing=false;gameCam.ready=false;return r;};
 function interaction272(dt){
  if(!rat||!gameplayActive())return;
  if(talkFacing&&phase==='scavenge')faceTarget272(NB,dt);
  nearClock+=dt;if(nearClock<.12)return;nearClock=0;
  if(ui?.prompt?.style.display==='block'){
   const text=ui.prompt.textContent||'';
   if(text!==lastPrompt){lastPrompt=text;ui.prompt.animate?.([{transform:'translateX(-50%) scale(.96)',opacity:.65},{transform:'translateX(-50%) scale(1)',opacity:1}],{duration:130});}
  }
 }
 function perf272(){
  fpsFrames++;const now=performance.now(),elapsed=now-fpsTime;if(elapsed<2500)return;const fps=fpsFrames*1000/elapsed;fpsFrames=0;fpsTime=now;
  if(fps<34&&!lowHint){lowHint=true;if(!lowQuality){lowQuality=true;applyQuality?.();sayToast('Performance mode enabled');}}
  else if(fps>48)lowHint=false;
 }
 const old=tickWorld38;tickWorld38=function(dt){old(dt);interaction272(Math.min(.05,dt));perf272();};
 const css=document.createElement('style');css.textContent='#prompt{transition:opacity .12s ease,transform .12s ease}#talk{transition:opacity .16s ease}';document.head.appendChild(css);
 window.polish272={};
})();