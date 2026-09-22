/* Build 255: crafting companion, voiced onboarding, Big Rat headset guidance. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 const birdTutorial=[
  ['Councillor Crumb','Flood took half your home, Pip. You need proper tools before you start patching everything.'],
  ['Opposition pigeon','Start simple. Pebbles, sticks and twine make an axe and hammer. Bring the salvage home.'],
  ['The independent','Then build the saw and brush at your workbench. Axe for branches, saw for planks, hammer for repairs, brush for paint.']
 ];
 let birdState={owner:null,step:0,next:0};
 function craftBirdTick255(){
  if(phase!=='scavenge'||!rat||home.craftBirdIntro255||!voiceOn||!gameplayActive())return;
  const birds=actors44.find(a=>a.owner===root&&a.id==='songbirds');if(!birds)return;
  const d=birds.g.position.distanceTo(rat.position);if(d>5.4)return;
  if(birdState.owner!==root){birdState={owner:root,step:0,next:0};}
  sound66.birdCooldown=Math.max(sound66.birdCooldown||0,12);
  if(birdState.step>=birdTutorial.length){home.craftBirdIntro255=true;save();return;}
  if(performance.now()<birdState.next||sound66.utterance)return;
  const [name,line]=birdTutorial[birdState.step++];voice66(name,line,birds.g.position,[1.15,.88,1.42][birdState.step%3]);birdState.next=performance.now()+6500;
 }

 // After the normal recorded Big Rat introduction, add a separate voiced headset hint.
 const endTalkBefore255=endTalk;
 endTalk=function(){
  endTalkBefore255();
  const d=window.music227?.data?.();if(!d?.mission250||d.headphones||home.bigRatHeadsetHint255||phase!=='scavenge')return;
  home.bigRatHeadsetHint255=true;save();
  setTimeout(()=>{if(phase==='scavenge'&&voiceOn)voice66('The Fat Rat','You looking for those walnut headphones? I saw them by the yard path, near the old work area.',NB,.78);},500);
  setTimeout(()=>{if(phase==='scavenge'&&voiceOn)voice66('The Fat Rat','Check just north of here. Keep your eyes low; they are rat-sized and easy to miss.',NB,.78);},7000);
 };

 // Add Zaytona/Tay as a calm workshop companion, seated on the stool beside Pip.
 let tay=null,tayOwner=null,tayMode=0,tayModeClock=0;
 function clearTay255(){if(tay){tay.mixer?.stopAllAction();tay.g.parent?.remove(tay.g);}tay=null;tayOwner=null;}
 function seedTay255(){
  if(phase!=='house'||!root?.userData?.workshop251||tayOwner===root)return;
  if(!zaytonaAsset){loadZaytona().then(()=>{if(phase==='house')seedTay255();}).catch(()=>{});return;}
  clearTay255();tayOwner=root;
  const table=root.userData.workshop251,g=new THREE.Group(),model=clonePipScene(zaytonaAsset.scene);g.add(model);root.add(g);
  model.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(model),size=box.getSize(V()),k=.72/Math.max(.01,size.y);model.scale.multiplyScalar(k);model.position.y-=box.min.y*k;
  const mixer=new THREE.AnimationMixer(model),actions={};for(const clip of zaytonaAsset.animations)actions[clip.name]=mixer.clipAction(clip);
  const sit=Object.entries(actions).find(([n])=>/sit|idle/i.test(n))?.[1]||Object.values(actions)[0];sit?.play();mixer.update(0);
  const p=table.localToWorld(V(1.18,.47,-1.03));g.position.copy(p);g.rotation.y=table.rotation.y-Math.PI/2;g.name='Tay seated at Pip workshop';
  tay={g,model,mixer,time:0,baseY:g.position.y};
 }
 function tickTay255(dt){
  if(phase!=='house'){clearTay255();return;}seedTay255();if(!tay)return;
  tay.mixer?.update(Math.min(.05,dt));tay.time+=dt;tayModeClock-=dt;if(tayModeClock<=0){tayMode=(tayMode+1)%3;tayModeClock=6+tayMode*2;}
  tay.g.position.y=tay.baseY+Math.sin(tay.time*1.6)*.004;
  const head=tay.model.getObjectByName('Head');if(head){head.rotation.y=tayMode===0?Math.sin(tay.time*.65)*.10:tayMode===1?.22:Math.sin(tay.time*2.4)*.05;head.rotation.z=tayMode===2?Math.sin(tay.time*2.8)*.08:0;}
  const tail=tay.model.getObjectByName('Tail_01')||tay.model.getObjectByName('Tail');if(tail)tail.rotation.y=Math.sin(tay.time*(tayMode===2?2.8:1.1))*.12;
  tay.g.visible=!!window.workshop251State?.open||rat.position.distanceTo(root.userData.workshop251.position)<4;
 }

 function bigRatObjectiveHint256(){
  if(phase!=='scavenge'||!rat||!sc?.nearNb||sound66.utterance)return;
  const tools=['axe230','hammer230','saw230','brush230'];const missing=tools.find(id=>!home.tools?.[id]);
  const md=window.music227?.data?.();
  let line='';
  if(missing)line='Before you worry about fancy stuff, get your '+(CRAFT[missing]?.name||'tools')+' sorted. Check the yard for salvage and bring it home.';
  else if(md?.mission250&&!md.headphones)line='Those walnut headphones are by the yard path. Stay low and look around the old work area.';
  else if(!home.geckoTamed88)line='If you hear scratching near the clay stones, that gecko might be worth making friends with.';
  else line='You are doing fine, kid. Keep fixing the place one job at a time.';
  voice66('The Fat Rat',line,NB,.78);
 }
 // Cigarette remains usable from Actions; keep it alive through later action-menu overrides.
 const actionsButton=$('pipActions205');
 actionsButton?.addEventListener('contextmenu',e=>e.preventDefault());

 const tickBefore255=tickWorld38;let hintClock256=0;
 tickWorld38=function(dt){tickBefore255(dt);craftBirdTick255();tickTay255(dt);hintClock256=Math.max(0,hintClock256-dt);if(phase==='scavenge'&&sc?.nearNb&&!sc.talk&&hintClock256===0&&home.craftBirdIntro255){hintClock256=28;bigRatObjectiveHint256();}};
 const clearBefore255=clear;
 clear=function(...args){clearTay255();birdState={owner:null,step:0,next:0};return clearBefore255(...args);};

 window.build255={get tay(){return tay;},birdTutorial};
})();