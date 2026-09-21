/* Music belongs to an explicitly operated object. A saved collection never auto-plays. */
(()=>{
 const records=window.classicalRecords227,baseCount=music69.tracks.length;
 records.forEach(r=>music69.tracks.push({title:r.composer+' · '+r.title,file:r.file}));
 const data=()=>{home.music227??={headphones:false,wear:false,records:{}};home.music227.records??={};return home.music227;};
 let source=null,anchor=null,station=null,near=null,world=null,pickups=[],elapsed=0;
 const originalStop=radioStop;originalStop();piano.enabled=false;music69.el?.pause();
 window.sewerAudio218={active:false,enter(){},leave(){},tick(){}};
 const sewerButton=document.getElementById('sewerAudio218');if(sewerButton)sewerButton.hidden=true;
 function pool(kind=source){return kind==='vinyl'?records.flatMap((r,i)=>data().records[r.id]?[baseCount+i]:[]):[...Array(baseCount).keys(),...records.flatMap((r,i)=>data().records[r.id]?[baseCount+i]:[])];}
 function valid(){if(!source)return false;if(source==='headphones')return data().headphones&&data().wear;if(source==='car')return !!car77?.riding;return !!anchor&&anchor.owner===root&&rat&&rat.position.distanceTo(anchor.pos)<6;}
 function stop(){source=null;anchor=null;piano.enabled=false;music69.el?.pause();radio.on=false;syncMusicMute192();}
 function start(kind,index){if(kind==='headphones'&&!data().headphones)return sayToast('Find the headphones first. See Music collection for its map marker.');if(kind==='car'&&!car77?.riding)return;
  if(kind==='vinyl'&&(!station||station.owner!==root||rat.position.distanceTo(station.pos)>3))return sayToast('Use your record player at home.');
  if(kind==='radio'&&(!radioAnchor57||radioAnchor57.owner!==root||rat.position.distanceTo(radioAnchor57.pos)>3))return sayToast('Walk up to a radio first.');
  const choices=pool(kind);if(!choices.length)return sayToast('Find a classical record first.');if(index!==undefined&&!choices.includes(index))return;
  source=kind;if(kind==='headphones'){data().wear=true;save();}anchor=kind==='vinyl'?station:kind==='radio'?radioAnchor57:null;
  music69.index=index??choices[0];music69.unlocked=true;music69.pending=false;music69.blocked=false;piano.enabled=true;radio.on=kind==='radio';setTrack69();musicTick69();syncMusicMute192();
 }
 musicTick69=function(){if(source&&!valid())stop();const allowed=valid()&&piano.enabled&&voiceOn&&!document.hidden&&['scavenge','explore','house','inside','heaven','home'].includes(phase);if(!allowed){music69.el?.pause();return;}const el=musicElement69();el.volume=music69.volume*(speech69.current?.3:1);if(el.paused&&!music69.pending&&!music69.blocked){music69.pending=true;el.play().then(()=>{music69.pending=false;if(!valid()||!piano.enabled||!voiceOn||document.hidden)el.pause();}).catch(()=>{music69.pending=false;music69.blocked=true;sayToast('Music could not play. Tap the source again to retry.');});}};
 nextMusic190=function(){if(!valid())return;const options=pool().filter(i=>i!==music69.index);if(!options.length)return;music69.index=options[Math.floor(Math.random()*options.length)];setTrack69();musicTick69();};
 chooseMusic69=function(i){if(valid())start(source,i);else sayToast('Use a radio, record player or your found headphones.');};
 syncMusicMute192=function(){const text=source?(piano.enabled?'Pause music':'Resume music'):'Music collection';$('musicMute').textContent=text;const b=$('heavenMusicMute192');if(b)b.textContent=text;};
 toggleMusicMute192=function(){if(!valid())return menu();piano.enabled=!piano.enabled;music69.blocked=false;musicTick69();syncMusicMute192();};
 function menu(kind){const d=data(),count=Object.keys(d.records).filter(k=>d.records[k]).length,buttons=[];
  if(kind==='vinyl')records.forEach((r,i)=>{if(d.records[r.id])buttons.push(['Play '+r.title,()=>{start('vinyl',baseCount+i);closeModal();}]);});
  if(d.headphones){buttons.push([d.wear?'Remove headphones':'Wear headphones',()=>{d.wear=!d.wear;if(!d.wear&&source==='headphones')stop();save();menu(kind);}]);buttons.push(['Play through headphones',()=>{start('headphones');closeModal();}]);}
  if(valid()){buttons.push([piano.enabled?'Pause music':'Resume music',()=>{toggleMusicMute192();menu(kind);}]);buttons.push(['Next song',()=>{nextMusic190();menu(kind);}]);buttons.push(['Stop music',()=>{stop();menu(kind);}]);}
  buttons.push(['Volume · '+Math.round(music69.volume*100)+'%',()=>{music69.volume=music69.volume>=.16?.06:music69.volume+.04;musicTick69();menu(kind);}]);
  buttons.push(['Show next find on map',()=>openYard201(!d.headphones?'headphones227':records.find(r=>!d.records[r.id])?.id||'home')]);buttons.push(['Close',closeModal]);
  modal(kind==='vinyl'?'Pip’s record player':'Music collection',`<p>${d.headphones?'✓ Headphones found':'Mission: find Pip’s walnut headphones near the yard path.'}</p><p>${count} / 10 classical vinyls found. Bring records to your crafted record player. Headphones let you listen while exploring. Nothing starts until you press Play.</p><p>${source?source+' · '+(piano.enabled?'Playing':'Paused')+': '+music69.tracks[music69.index]?.title:'Music off'}</p><p><a href="music-credits227.html" target="_blank" rel="noopener">All ten recordings and licence credits</a></p>`+records.map(r=>`<p>${d.records[r.id]?'✓':'○'} ${r.composer} — ${r.title}<br><small>${d.records[r.id]?'In your collection':r.clue}</small></p>`).join(''),buttons);
 }
 musicMenu69=menu;$('pianoToggle').onclick=()=>menu();$('musicMute').onclick=toggleMusicMute192;
 const stationUse=useStation65;useStation65=function(entry){if(entry.p.id!=='recordplayer65')return stationUse(entry);station={owner:root,pos:rat.position.clone()};menu('vinyl');};
 const vintage=vinylMenu60;vinylMenu60=function(){if(!home.recordFixed60)return vintage();const entry=hs?.placed?.find(e=>e.p.id==='turntable60'&&Math.hypot(rat.position.x-e.p.x,rat.position.z-e.p.z)<1.6);if(!entry)return sayToast('Walk up to your vintage turntable.');station={owner:root,pos:rat.position.clone()};menu('vinyl');};
 playVinyl65=function(i){start('vinyl',baseCount+i);};
 radioPlay=function(){start(car77?.riding?'car':'radio');$('rplay').textContent='Stop';$('rnow').textContent=music69.tracks[music69.index]?.title||'Radio off';};
 radioStop=function(){originalStop();if(source==='radio'||source==='car')stop();};radioNext=function(){if(source==='radio'||source==='car')nextMusic190();};
 $('rnext').onclick=()=>radioNext();$('rfile').parentNode.style.display='none';$('rlist').textContent='Shared game soundtrack + collected classical records';
 // A contextual pickup, independent of the nearby salvage interaction.
 const prompt=document.createElement('button');prompt.className='btn';prompt.style.cssText='position:fixed;left:50%;bottom:170px;transform:translateX(-50%);z-index:29;max-width:230px;display:none';document.body.appendChild(prompt);
 function collect(){if(!near||car77?.riding)return false;const p=near,d=data();if(p.id==='headphones227'){d.headphones=true;sayToast('Headphones found! Equip them from Music collection.');}else{d.records[p.id]=true;sayToast('Vinyl found · '+p.title);}p.g.visible=false;near=null;prompt.style.display='none';save();sfx.pickup();return true;}
 prompt.onclick=collect;const oldGrab=grab;grab=function(){if(!collect())return oldGrab();};
 function build(){world=root;pickups.forEach(p=>{p.g.parent?.remove(p.g);p.g.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose();}});});pickups=[];if(phase!=='scavenge')return;
  const definitions=[{id:'headphones227',title:'Walnut headphones',x:7.5,z:20.8},...records];
  for(const def of definitions){const g=new THREE.Group();g.name=def.title;g.position.set(def.x,.07,def.z);let m;
   if(def.id==='headphones227'){m=createPipHeadphones227(THREE);m.scale.setScalar(2.1);m.position.y=.13;g.add(m);}else{const sleeve=new THREE.Mesh(new THREE.BoxGeometry(.28,.012,.28),new THREE.MeshStandardMaterial({color:[0x8a6446,0x617c6d,0x8b7560][pickups.length%3],roughness:.9}));g.add(sleeve);m=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,.008,24),new THREE.MeshStandardMaterial({color:0x20231f,roughness:.45}));m.position.set(.065,.014,0);g.add(m);const label=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.009,16),new THREE.MeshStandardMaterial({color:0xd7bc7e}));label.position.copy(m.position);label.position.y+=.004;g.add(label);}
   g.userData.noInk=true;root.add(g);pickups.push({...def,g});
  }
 }
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);if(world!==root)build();elapsed+=dt;if(elapsed<.15)return;elapsed=0;near=null;const d=data();for(const p of pickups){const found=p.id==='headphones227'?d.headphones:d.records[p.id];p.g.visible=!found;if(!found&&rat&&!car77?.riding&&rat.position.distanceTo(p.g.position)<.9)near=p;}
  prompt.style.display=near&&gameplayActive()&&!photo.active?'block':'none';if(near)prompt.textContent='Pick up '+near.title;musicTick69();};
 window.music227={start,stop,menu,collect,data,records,get source(){return source;},get pickups(){return pickups;},get title(){return source?music69.tracks[music69.index]?.title:'RADIO OFF';},toggleCar(){if(source==='car'&&piano.enabled)stop();else start('car');},nextCar(){if(source!=='car')start('car');else nextMusic190();},destinations(){const d=data();return [{id:'headphones227',icon:'♫',name:'Walnut headphones',x:7.5,z:20.8,detail:'Find the headphones beside the yard path. Pick them up, then equip and press Play in Music collection.',unavailable:d.headphones},...records.map(r=>({...r,icon:'♪',name:r.title,detail:r.clue+' · collect this classical record for your record player.',unavailable:!!d.records[r.id]}))];}};
 const objectives=openObjectives200;openObjectives200=function(){objectives();const b=document.createElement('button');b.className='btn';b.textContent='Headphones & ten vinyls';b.onclick=()=>menu();$('modalActions').prepend(b);};
 syncMusicMute192();
})();
