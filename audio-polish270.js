/* Build 270: area ambience, interaction feedback and character reaction polish. */
(()=>{
 let ctx=null,master=null,noise=null,filter=null,region='',pulse=0,catClock=8,birdClock=5,creakClock=9;
 function ensure270(){
  if(ctx)return true;ctx=audio();if(!ctx)return false;
  master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
  const len=ctx.sampleRate*2,b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  noise=ctx.createBufferSource();noise.buffer=b;noise.loop=true;filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=900;noise.connect(filter).connect(master);noise.start();return true;
 }
 function region270(){
  if(phase==='house')return 'house';if(phase==='inside')return 'dumpster';if(phase!=='scavenge'||!rat)return 'quiet';
  if(window.city204?.inDistrict?.(rat.position))return 'city';
  if(Math.hypot(rat.position.x-23.2,rat.position.z-32.1)<6)return 'pond';
  if(Math.hypot(rat.position.x+18.75,rat.position.z-24.75)<5)return 'den';
  return 'yard';
 }
 function setRegion270(name){if(name===region)return;region=name;if(!ensure270())return;const cfg={quiet:[0,700],yard:[.010,1150],pond:[.017,1450],den:[.008,850],city:[.014,520],house:[.005,430],dumpster:[.007,360]}[name]||[0,700];master.gain.setTargetAtTime(cfg[0],ctx.currentTime,.8);filter.frequency.setTargetAtTime(cfg[1],ctx.currentTime,.7);}
 function tiny270(kind=.5){if(!ensure270()||!voiceOn)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(150+kind*180,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(75+kind*50,ctx.currentTime+.09);g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.018,ctx.currentTime+.008);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.11);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.12);}
 function ambienceEvents270(dt){if(!voiceOn||document.hidden||!rat)return;birdClock-=dt;catClock-=dt;creakClock-=dt;
  if(region==='yard'&&birdClock<=0){birdClock=7+Math.random()*12;window.audio207?.animal?.('audio207/birdsong.mp3',rat.position.clone().add(new THREE.Vector3((Math.random()-.5)*10,0,(Math.random()-.5)*10)),.12,.96+Math.random()*.08);}
  if(region==='pond'&&birdClock<=0){birdClock=6+Math.random()*9;window.audio207?.animal?.('audio207/birdsong.mp3',new THREE.Vector3(23.2,0,32.1),.16,.98+Math.random()*.05);}
  if(region==='city'&&birdClock<=0){birdClock=9+Math.random()*15;window.audio207?.animal?.('audio207/corvid.mp3',rat.position.clone().add(new THREE.Vector3((Math.random()-.5)*14,0,(Math.random()-.5)*14)),.10,.92+Math.random()*.12);}
  if(region==='house'&&creakClock<=0){creakClock=12+Math.random()*18;tiny270(.22);}
  if(region==='den'&&zaytona?.owner===root&&catClock<=0&&rat.position.distanceTo(zaytona.g.position)<5){catClock=14+Math.random()*18;meow66(zaytona.g.position);}
 }
 function wrapFeedback270(){
  if(window.__feedback270)return;window.__feedback270=true;
  if(typeof doorAction==='function'){const old=doorAction;doorAction=function(...a){tiny270(.3);return old(...a);};}
  if(typeof enterCar77==='function'){const old=enterCar77;enterCar77=function(...a){tiny270(.72);const r=old(...a);setTimeout(()=>tiny270(.45),90);return r;};}
  if(typeof exitCar77==='function'){const old=exitCar77;exitCar77=function(...a){tiny270(.35);return old(...a);};}
  if(typeof performCraft==='function'){const old=performCraft;performCraft=function(...a){const r=old(...a);if(r!==false){tiny270(.82);setTimeout(()=>tiny270(.55),120);}return r;};}
 }
 function contextualCat270(dt){
  if(!zaytona||zaytona.owner!==root||!rat||phase!=='scavenge')return;const d=rat.position.distanceTo(zaytona.g.position);
  zaytona.userData270=zaytona.userData270||{near:false,cool:0};const u=zaytona.userData270;u.cool=Math.max(0,u.cool-dt);
  if(d<1.5&&!u.near&&u.cool===0){u.near=true;u.cool=10;meow66(zaytona.g.position);}else if(d>2.4)u.near=false;
 }
 const tick0=tickWorld38;tickWorld38=function(dt){tick0(dt);wrapFeedback270();setRegion270(region270());if(master&&(!voiceOn||document.hidden))master.gain.setTargetAtTime(0,ctx.currentTime,.25);else if(master&&voiceOn){const v={quiet:0,yard:.010,pond:.017,den:.008,city:.014,house:.005,dumpster:.007}[region]||0;master.gain.setTargetAtTime(v,ctx.currentTime,.5);}ambienceEvents270(dt);contextualCat270(dt);};
 document.addEventListener('visibilitychange',()=>{if(master&&document.hidden)master.gain.setTargetAtTime(0,ctx.currentTime,.1);});
 window.audioPolish270={get region(){return region;}};
})();