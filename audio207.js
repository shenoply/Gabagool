/* Natural prerecorded character speech and credited animal field recordings. */
(()=>{
 const buffers=new Map(),pending=new Map(),animals=new Set();let epoch=0,owner=null;const last=new Map();
 function buffer(file){if(buffers.has(file))return Promise.resolve(buffers.get(file));if(pending.has(file))return pending.get(file);const ac=audio();if(!ac)return Promise.reject(Error('Audio unavailable'));const p=fetch(file).then(r=>{if(!r.ok)throw Error('Audio unavailable');return r.arrayBuffer();}).then(b=>ac.decodeAudioData(b)).then(b=>{buffers.set(file,b);pending.delete(file);return b;},e=>{pending.delete(file);throw e;});pending.set(file,p);return p;}
 const allowed=()=>voiceOn&&!document.hidden&&gameplayActive();
 const oldPlay=playVoice69;playVoice69=function(cue,pos=null,onend=null){if(!cue?.file207)return oldPlay(cue,pos,onend);if(!allowed())return false;stopVoice69();const token=speech69.token;
  buffer(cue.file207).then(b=>{if(token!==speech69.token||!allowed()||(pos&&(!rat||pos.distanceTo(rat.position)>8)))return;const ac=audio(),source=ac.createBufferSource(),gain=ac.createGain();source.buffer=b;gain.gain.value=pos?Math.max(.12,.8*(1-pos.distanceTo(rat.position)/10)):.8;source.connect(gain).connect(ac.destination);const current={source,gain,pos};speech69.current=current;if(pos)sound66.voiceClock=b.duration+.3;source.onended=()=>{if(speech69.current!==current)return;speech69.current=null;source.disconnect();gain.disconnect();if(sound66.utterance?.recorded69)sound66.utterance=null;sound66.voiceClock=0;$('chatter66').style.display='none';onend?.();};source.start();}).catch(()=>{if(token===speech69.token){sound66.utterance=null;sound66.voiceClock=0;$('chatter66').style.display='none';}});return true;};
 function stopAnimals(){epoch++;for(const item of [...animals]){try{item.source.stop();}catch{}item.finish();}last.clear();}
 function animal(file,pos,volume=.62,rate=1){if(!allowed()||!rat||animals.size>=3)return false;const now=performance.now();if(now-(last.get(file)??-Infinity)<1500)return false;last.set(file,now);const token=epoch,world=root;
  buffer(file).then(b=>{if(token!==epoch||world!==root||!allowed()||(pos&&pos.distanceTo(rat.position)>14)||animals.size>=3)return;const ac=audio(),source=ac.createBufferSource(),gain=ac.createGain(),pan=ac.createStereoPanner?.();source.buffer=b;source.playbackRate.value=rate;source.connect(gain);if(pan)gain.connect(pan).connect(ac.destination);else gain.connect(ac.destination);const item={source,gain,pan,pos:pos?.clone(),volume,finish(){animals.delete(item);source.disconnect();gain.disconnect();pan?.disconnect();}};animals.add(item);source.onended=item.finish;updateAnimal(item);source.start();}).catch(()=>{});return true;}
 function updateAnimal(item){const distance=item.pos?rat.position.distanceTo(item.pos):0;item.gain.gain.value=item.volume*Math.max(0,1-distance/14)*(sound66.utterance?.4:1);if(item.pan&&item.pos){const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);item.pan.pan.value=THREE.MathUtils.clamp(item.pos.clone().sub(rat.position).dot(right)/10,-.9,.9);}}
 meow66=pos=>animal('audio207/zaytona.mp3',pos,.92+Math.random()*.16,.93+Math.random()*.13);sfx.yowl=()=>animal('audio207/zaytona.mp3',typeof zaytona!=='undefined'&&zaytona?.owner===root?zaytona.g.position:rat?.position,.92+Math.random()*.16,.94+Math.random()*.12);
 const oldEffect=effect58;effect58=function(kind,pos){if(kind==='bird')return animal('audio207/birdsong.mp3',pos,.28);if(kind==='crow')return animal('audio207/corvid.mp3',pos,.35);return oldEffect(kind,pos);};
 crowCall=()=>animal('audio207/corvid.mp3',typeof gardenCrow!=='undefined'&&gardenCrow?.owner===root?gardenCrow.g.position:rat?.position,.3);
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);if(owner!==root||!allowed()){if(owner!==root||animals.size||last.size)stopAnimals();owner=root;return;}for(const item of animals){if(item.pos&&item.pos.distanceTo(rat.position)>14){try{item.source.stop();}catch{}item.finish();}else updateAnimal(item);}};
 const clearBefore=clear;clear=function(){stopAnimals();return clearBefore();};
 $('mute').addEventListener('click',()=>{if(!voiceOn)stopAnimals();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAnimals();});
 const cues=/* DIALOGUE207 */[
  {
    "name": "Councillor Crumb",
    "text": "I promise every bird a bigger nest, and a shorter winter.",
    "file207": "audio207/bird-00.mp3",
    "duration": 6.034286
  },
  {
    "name": "Opposition pigeon",
    "text": "You promised that last spring. We got a parking meter.",
    "file207": "audio207/bird-01.mp3",
    "duration": 4.989388
  },
  {
    "name": "The independent",
    "text": "I vote for whoever opens the dumpster.",
    "file207": "audio207/bird-02.mp3",
    "duration": 2.272653
  },
  {
    "name": "Councillor Crumb",
    "text": "The council has approved a tax on shiny things.",
    "file207": "audio207/bird-03.mp3",
    "duration": 3.082449
  },
  {
    "name": "Opposition pigeon",
    "text": "A shiny tax? How about fixing the leaking birdbath first?",
    "file207": "audio207/bird-04.mp3",
    "duration": 4.989388
  },
  {
    "name": "The independent",
    "text": "Can we debate the actual issue? Someone ate my bread.",
    "file207": "audio207/bird-05.mp3",
    "duration": 3.787755
  },
  {
    "name": "Councillor Crumb",
    "text": "Our new housing plan guarantees a twig for every nest.",
    "file207": "audio207/bird-06.mp3",
    "duration": 4.127347
  },
  {
    "name": "Opposition pigeon",
    "text": "One twig? Your nephew got the entire birdhouse.",
    "file207": "audio207/bird-07.mp3",
    "duration": 5.146122
  },
  {
    "name": "The independent",
    "text": "My manifesto is simple. More crumbs. Fewer speeches.",
    "file207": "audio207/bird-08.mp3",
    "duration": 4.284082
  }
];
 const names=new Set(cues.map(c=>c.name));for(let i=recordings69.length-1;i>=0;i--)if(names.has(recordings69[i].name))recordings69.splice(i,1);recordings69.push(...cues);birdLines66.splice(0,birdLines66.length,...cues.map(c=>[c.name,c.text]));
 function preload(){for(const cue of cues)buffer(cue.file207).catch(()=>{});for(const file of ['zaytona','birdsong','corvid'])buffer('audio207/'+file+'.mp3').catch(()=>{});}
 for(const id of ['start','newgame'])$(id).addEventListener('click',preload);
 const credit=document.createElement('button');credit.textContent='Sound credits';credit.className='cockpit205-secondary';credit.hidden=true;credit.onclick=()=>{cockpit205.toggle(false);modal('Voices & animal recordings','<p>The three council birds use original dialogue with natural-sounding AI voices.</p><p>Zaytona: “Meow” by Dan Crosby, recording of Silas. Converted and level-adjusted under <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA 3.0</a>. <a href="https://commons.wikimedia.org/wiki/File:Meow.ogg" target="_blank" rel="noopener">Original recording</a>.</p><p>Birdsong: Jc Guan, public domain. Corvid calls: National Park Service, public domain.</p><p><a href="audio207/CREDITS.md" target="_blank" rel="noopener">Full sound credits and sources</a></p>',[['Close',closeModal]]);};cockpit206.groups.Cabin.push(credit);cockpit205.drawer.querySelector('.cockpit205-grid').appendChild(credit);
 window.audio207={buffer,animal,stopAnimals,cues};
})();
