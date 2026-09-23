/* Build 271 stability layer */
(()=>{
 function norm271(){
  home.yard76=home.yard76||{};
  const yd={bridge:false,bag:false,prize:false,vinyl:false,pool:false,cat:false,rain:false,jobs:false,missionsActive:false};
  for(const k in yd) if(typeof home.yard76[k]!=='boolean') home.yard76[k]=yd[k];
  home.flow269=home.flow269||{discovered:{},rewarded:false,intro:false};
  home.flow269.discovered=(home.flow269.discovered&&typeof home.flow269.discovered==='object')?home.flow269.discovered:{};
  home.storage=home.storage||{};home.pantry=home.pantry||{};home.discoveries60=home.discoveries60||{};home.routes=home.routes||{};home.tools=home.tools||{};
  const t=home.tutorial219=home.tutorial219||{done:{},step:{},started:{}};
  t.done=t.done||{};t.step=t.step||{};t.started=t.started||{};
  for(const [name,steps] of Object.entries(window.tutorial219?.chapters||{})){
   const n=Number(t.step[name]);t.step[name]=Number.isFinite(n)?Math.max(0,Math.min(steps.length-1,n)):0;
  }
 }
 function zeroInput271(){try{keys={};joy.x=joy.z=0;joyId=null;}catch(e){}}
 function check271(){
  if(!rat)return;
  const p=rat.position;
  if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||!Number.isFinite(p.z)||p.y<-5){
   if(phase==='house')p.set(-HW/2+1.6,0,DOORZ);
   else if(phase==='inside')p.set(0,.05,3.8);
   else p.set(1,0,29);
   rat.userData.air=false;rat.userData.vy=0;rat.userData.wallState=null;rat.userData.climb=null;
   if(car77?.riding&&car77.g){car77.g.position.copy(p);car77.speed=0;}
   gameCam.ready=false;zeroInput271();sayToast('Position corrected');
  }
  if(!Number.isFinite(gameCam.yaw)||!Number.isFinite(gameCam.pitch)||!Number.isFinite(gameCam.distance)){
   gameCam.yaw=0;gameCam.pitch=.58;gameCam.distance=phase==='house'?11:4.6;gameCam.ready=false;
  }
  const lesson=document.getElementById('lesson219'),objective=document.getElementById('objective269');
  if(objective)objective.style.visibility=(lesson&&!lesson.hidden)||car77?.riding?'hidden':'visible';
  if(document.getElementById('modal')?.style.display==='flex')zeroInput271();
 }
 norm271();
 const oldSave=save;save=function(...args){norm271();return oldSave(...args);};
 let acc=0,lastPhase='';
 const oldTick=tickWorld38;tickWorld38=function(dt){oldTick(dt);if(phase!==lastPhase){lastPhase=phase;zeroInput271();}acc+=dt;if(acc>.15){acc=0;check271();}};
 addEventListener('blur',zeroInput271);document.addEventListener('visibilitychange',()=>{if(document.hidden)zeroInput271();});
 const style=document.createElement('style');style.textContent='#objective269{max-width:min(390px,68vw)}body.menu-open65 #geckoWhistle193{display:none!important}@media(max-width:600px){#objective269{top:48px;max-width:62vw}#geckoWhistle193{bottom:160px!important}}';document.head.appendChild(style);
 window.qa271={normalize:norm271,check:check271};
})();