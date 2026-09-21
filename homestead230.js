/* Found-object crafting, hidden collections and persistent, individual home repairs. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 const state=()=>{home.homestead230??={mints:{},equipped:null,boards:{},paint:{},wood:{},colour:'sage',mode:'repair'};return home.homestead230;};
 const colours={sage:0x809377,cream:0xd6c7a6,blue:0x6d8c96,clay:0xac7861};
 const names=['Garden mint','Peppermint heart','Spearmint star','Winter pine','Citrus slice','Moon mint','Lucky clover','Little mushroom','Teapot mint','Pip’s paw','Sewer fish','Walnut acorn','Tiny house','Wild flower','Butterfly balm','Rain cloud','Bottle mint','Diamond frost','Venice boat','Vintage disc'];
 const palette=[0x608967,0xaa7c78,0xb3ac72,0x3e6856,0xd7b16a,0x9babb2,0x5d845e,0xa86f58,0x769c97,0xc79686,0x6a9795,0x927047,0xb98c68,0xb896b0,0x9280a3,0x88a7ae,0x588370,0xa0beb4,0x996c47,0x566659];
 const locations=[['yard',-6.4,18.4],['yard',13.2,18.2],['yard',-11,29],['yard',-17.5,24],['yard',9.3,31.5],['yard',-3,12],['yard',6.7,48.9],['yard',2.8,52],['yard',6.8,56.8],['yard',2.8,59.5],['sewer',-11.3,25.5],['sewer',13,9.7],['sewer',13.3,25.4],['sewer',-10.6,13.3],['sewer',-21,39.8],['sewer',21.3,39.5],['sewer',-21.2,51.4],['sewer',17,55.8],['sewer',3,63.8],['sewer',15.3,35.5]];
 const clues=['The sewing scraps hide something that is not thread.','Search the clutter near old tools.','A damp corner near the pool holds a dry leaf.','Something fragrant lies near the gecko’s side of the garden.','Packaging on the northern garden edge hides a charm.','Search low among the older yard scraps.','A discarded carton beyond the first blocks.','Among scraps on the quieter roadside.','The road leads north; keep watching its edges.','Near the far end of the city approach.','The maintenance loop has a dry pocket.','An eastern bend hides a small surprise.','Look near the old pump chamber.','The western junction catches litter.','Follow the far western canal.','Explore the long eastern canal.','The west stores are not empty.','Search beyond the north-eastern stores.','The far cistern has a final corner.','A narrow eastern service branch.'];
 const designs=names.map((name,i)=>({id:'mint'+(i+1),name,colour:palette[i],zone:locations[i][0],x:locations[i][1],z:locations[i][2],clue:clues[i],i}));
 function mat(c){return new THREE.MeshStandardMaterial({color:c,roughness:.88});}
 function mesh(g,geo,m,x=0,y=0,z=0){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.userData.noInk=true;g.add(o);return o;}
 function cube(g,w,h,d,m,x=0,y=0,z=0){return mesh(g,new THREE.BoxGeometry(w,h,d),m,x,y,z);}
 function disc(g,r,m,x=0,y=0,sx=1,sy=1){const o=mesh(g,new THREE.CylinderGeometry(r,r,.045,20),m,x,y,0);o.rotation.x=Math.PI/2;o.scale.set(sx,1,sy);return o;}
 function poly(g,points,m){const s=new THREE.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return mesh(g,new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:false}),m);}
 function mintModel(i){const g=new THREE.Group(),m=mat(palette[i]),light=mat(0xe4d6b1),dark=mat(0x374d3b);g.name=names[i];
  const star=(n,a=.4,b=.19)=>Array.from({length:n*2},(_,j)=>[Math.sin(j*Math.PI/n)*(j%2?b:a),Math.cos(j*Math.PI/n)*(j%2?b:a)]);
  switch(i){
   case 0:poly(g,[[0,.46],[-.24,.24],[-.28,-.1],[0,-.43],[.28,-.1],[.24,.24]],m);cube(g,.018,.63,.055,light);break;
   case 1:{const s=new THREE.Shape();s.moveTo(0,-.4);s.bezierCurveTo(-.7,.05,-.3,.7,0,.25);s.bezierCurveTo(.3,.7,.7,.05,0,-.4);mesh(g,new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:false}),m);break;}
   case 2:poly(g,star(5),m);break;
   case 3:poly(g,[[0,.5],[-.3,.12],[-.16,.12],[-.4,-.24],[-.08,-.24],[-.08,-.43],[.08,-.43],[.08,-.24],[.4,-.24],[.16,.12],[.3,.12]],m);break;
   case 4:disc(g,.38,m);disc(g,.3,light);for(let j=0;j<6;j++){const a=cube(g,.015,.53,.06,m);a.rotation.z=j*Math.PI/3;}break;
   case 5:poly(g,[[.15,.45],[-.17,.35],[-.36,.05],[-.28,-.27],[.05,-.42],[.3,-.24],[.04,-.25],[-.1,-.08],[-.09,.19]],m);break;
   case 6:for(const [x,y] of [[-.17,.16],[.17,.16],[-.17,-.13],[.17,-.13]])disc(g,.22,m,x,y);cube(g,.045,.3,.05,dark,0,-.3);break;
   case 7:cube(g,.14,.44,.05,light,0,-.12);disc(g,.33,m,0,.15,1,.65);for(const x of [-.16,0,.16])disc(g,.043,light,x,.18);break;
   case 8:disc(g,.29,m);cube(g,.16,.08,.05,light,0,.32);poly(g,[[.2,.05],[.45,.25],[.4,-.13],[.18,-.14]],m);mesh(g,new THREE.TorusGeometry(.17,.035,6,16),light,-.3,.03);break;
   case 9:disc(g,.23,m,0,-.12,1,.8);for(const [x,y] of [[-.26,.15],[-.1,.31],[.1,.31],[.26,.15]])disc(g,.09,m,x,y);break;
   case 10:disc(g,.3,m,0,0,1.2,.65);poly(g,[[-.26,0],[-.48,.2],[-.48,-.2]],m);disc(g,.035,light,.19,.06);break;
   case 11:disc(g,.25,m,0,-.1,.9,1.3);disc(g,.29,dark,0,.14,1,.4);cube(g,.05,.13,.05,light,0,.28);break;
   case 12:cube(g,.53,.45,.05,m,0,-.1);poly(g,[[-.37,.13],[0,.46],[.37,.13]],light);cube(g,.12,.22,.055,dark,0,-.2);break;
   case 13:for(let j=0;j<6;j++)disc(g,.16,m,Math.sin(j*Math.PI/3)*.25,Math.cos(j*Math.PI/3)*.25);disc(g,.13,light);break;
   case 14:for(const x of [-1,1]){disc(g,.25,m,x*.23,.15,.9,1);disc(g,.17,m,x*.2,-.2);}cube(g,.055,.48,.06,light);break;
   case 15:for(const [x,y,r] of [[-.22,0,.18],[0,.12,.25],[.24,0,.18]])disc(g,r,m,x,y);cube(g,.48,.18,.05,m,0,-.06);for(const x of [-.2,0,.2])poly(g,[[x,-.25],[x-.04,-.36],[x+.04,-.36]],light);break;
   case 16:poly(g,[[-.09,.4],[.09,.4],[.09,.18],[.22,.08],[.22,-.38],[-.22,-.38],[-.22,.08],[-.09,.18]],m);cube(g,.38,.15,.055,light,0,-.12);break;
   case 17:poly(g,[[0,.43],[.32,0],[0,-.43],[-.32,0]],m);poly(g,[[0,.3],[.19,0],[0,-.3],[-.19,0]],light);break;
   case 18:poly(g,[[-.45,.12],[.45,.12],[.27,-.18],[-.27,-.18]],m);const paddle=cube(g,.04,.62,.055,light,0,.1);paddle.rotation.z=-.6;break;
   case 19:disc(g,.36,m);mesh(g,new THREE.TorusGeometry(.26,.012,5,24),light);disc(g,.1,light);disc(g,.024,dark);break;
  }
  return g;
 }
 const timber=mat(0x65472e),iron=mat(0x777f78);
 function toolModel(kind){const g=new THREE.Group();cube(g,.055,.65,.055,timber,0,.28);if(kind==='axe230')poly(g,[[-.05,.54],[.22,.65],[.24,.39],[-.05,.43]],iron);else if(kind==='saw230'){const pts=[[-.03,.48],[.35,.48],[.4,.18]];for(let j=7;j>=0;j--)pts.push([j*.05,.2+(j%2)*.055]);poly(g,pts,iron);}else if(kind==='brush230'){cube(g,.2,.13,.065,iron,0,.54);cube(g,.19,.17,.06,mat(colours[state().colour]),0,.66);}else cube(g,.27,.13,.12,iron,0,.54);return g;}
 ITEMS.log230={name:'Seasoned branch',r:.35,build(){const g=new THREE.Group();const o=mesh(g,new THREE.CylinderGeometry(.13,.16,.7,9),timber,0,.15);o.rotation.z=Math.PI/2;return g;}};
 ITEMS.plank230={name:'Sawn plank',r:.4,build(){const g=new THREE.Group();cube(g,.8,.07,.2,mat(0xa47e50),0,.05);return g;}};
 ITEMS.paint230={name:'Natural wall paint',r:.2,build(){const g=new THREE.Group();mesh(g,new THREE.CylinderGeometry(.16,.14,.2,12),iron,0,.1);mesh(g,new THREE.CylinderGeometry(.145,.145,.01,12),mat(colours[state().colour]),0,.205);return g;}};
 for(const [id,name,needs,bench] of [['axe230','Pebble axe',{stick:2,pebble:2,string:1},false],['hammer230','Salvage hammer',{stick:1,pebble:1,string:1},false],['saw230','Tin-tooth saw',{foil:2,nail:2,stick:1},true],['brush230','Fibre paintbrush',{stick:1,fiber:3,string:1},false]])CRAFT[id]={name,needs,bench,tool:true,r:.4,build:()=>toolModel(id)};
 Object.assign(CRAFT,{sawplanks230:{name:'Saw four planks',needs:{log230:1},bench:true,requiredTool230:'saw230',result:'plank230',amount:4,r:.4,build:ITEMS.plank230.build},salvagenails230:{name:'Straighten six fixings',needs:{foil:1},requiredTool230:'hammer230',result:'nail',amount:6,r:.3,build:ITEMS.nail.build},mixpaint230:{name:'Mix six coats of paint',needs:{water:1,sap:1,leaf:2},result:'paint230',amount:6,r:.2,build:ITEMS.paint230.build}});
 const hintBefore=craftHint40;craftHint40=function(id){return ({log230:'Chop fallen branches with your pebble axe',plank230:'Saw seasoned branches at a workbench',paint230:'Mix water, sap and leaves in Craft'})[id]||hintBefore(id);};
 const stationBefore=stationMessage;stationMessage=function(c){if(c.requiredTool230&&!home.tools?.[c.requiredTool230])return 'Craft a '+CRAFT[c.requiredTool230].name+' first';return stationBefore(c);};
 // Rebuild the house shell while preserving furniture, inventory and front-door systems.
 const houseBefore=makeHouse;
 makeHouse=function(s){const g=houseBefore(s);g.children.forEach(o=>{o.visible=false;});if(g.userData.parts.door)g.userData.parts.door.visible=true;
  const d=state(),boards=[],sub=mat(0x302e27),frame=mat(0x514534);cube(g,HW,.15,HD,sub,0,-.14);
  function board(id,x,y,z,w,h,depth,wall=false,turn=0){const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=turn;g.add(group);
   const entry={id,group,x,y,z,wall,refresh(){while(group.children.length){const o=group.children[0];group.remove(o);o.geometry?.dispose();if(o.material!==iron)o.material?.dispose();}
    const d=state(),ok=!!d.boards[id],finish=d.paint[id]?colours[d.paint[id]]:ok?0xad8558:0x6c6550,m=mat(finish);
    if(ok){cube(group,w,h,depth,m);for(const nx of [-w*.4,w*.4])cube(group,.035,wall?.035:.01,wall?.015:.035,iron,nx,wall?h*.35:h/2+.006,wall?depth/2+.006:0);}
    else{const plank=cube(group,w*(wall?.7:.72),h,depth,m,-w*.12);plank.rotation.z=wall?.035:0;plank.rotation.y=wall?0:.026;const broken=cube(group,w*.13,h,depth,m,w*.4,wall?-.06:0);broken.rotation.z=wall?-.08:0;}
   }};entry.refresh();group.userData.board230=entry;boards.push(entry);
  }
  // Twenty-four individually replaceable floor boards; thirty-six wall boards.
  for(let x=0;x<12;x++)for(let z=0;z<2;z++)board('floor-'+x+'-'+z,-HW/2+(x+.5)*HW/12,.005,-HD/2+(z+.5)*HD/2,HW/12-.035,.09,HD/2-.05);
  for(let section=0;section<4;section++)for(let row=0;row<4;row++)board('back-'+section+'-'+row,-HW/2+(section+.5)*HW/4,.4+row*.74,-HD/2,HW/4-.025,.69,.14,true);
  for(const side of [-1,1]){const spans=side===-1?[[-HD/2,DOORZ-.7],[DOORZ+.7,HD/2]]:[[-HD/2,-HD/6],[-HD/6,HD/6],[HD/6,HD/2]];
   spans.forEach(([lo,hi],section)=>{for(let row=0;row<4;row++)board('side-'+side+'-'+section+'-'+row,side*HW/2,.4+row*.74,(lo+hi)/2,hi-lo-.03,.69,.14,true,side===1?-Math.PI/2:Math.PI/2);});
  }
  // Structural studs preserve the exact existing doorway clearance.
  for(const x of [-HW/2,0,HW/2])cube(g,.17,3.3,.2,frame,x,1.55,-HD/2);
  for(const x of [-HW/2,HW/2])for(const z of [-HD/2,0,HD/2])cube(g,.18,3.3,.18,frame,x,1.55,z);
  for(const z of [DOORZ-.78,DOORZ+.78])cube(g,.18,2.6,.14,frame,-HW/2,1.3,z);cube(g,.18,.18,1.7,frame,-HW/2,2.6,DOORZ);
  cube(g,HW,.18,.18,frame,0,3.12,-HD/2);g.userData.boards230=boards;return g;
 };
 const woodSites=[[-5.5,20],[12,20],[-10,27],[6.8,34],[6.7,45],[2.8,49],[6.5,54],[2.8,58]];
 let owner=null,zone=null,finds=[],woodNodes=[],near=null,timer=0,job=null,cabin=null,equipped=null;
 const button=document.createElement('button');button.className='btn';button.id='homesteadAction230';button.style.cssText='position:fixed;left:50%;bottom:180px;transform:translateX(-50%);z-index:31;max-width:260px;display:none';document.body.appendChild(button);
 const zoneNow=()=>window.sewer211?.active?'sewer':phase==='scavenge'?'yard':phase==='house'?'house':null;
 function clutter(parent,i){const m=mat(i%2?0x756c54:0x998973);const a=cube(parent,.44,.012,.32,m,.16,.032,-.1);a.rotation.z=.12;a.rotation.y=i*.71;const b=cube(parent,.28,.055,.035,timber,-.19,.07,.08);b.rotation.y=-.6;}
 function rebuild(){owner=root;zone=zoneNow();finds=[];woodNodes=[];near=null;if(!['yard','sewer'].includes(zone))return;
  designs.filter(d=>d.zone===zone).forEach(d=>{if(state().mints[d.id])return;const g=new THREE.Group();g.position.set(d.x,.06,d.z);const m=mintModel(d.i);m.scale.setScalar(.25);m.rotation.x=-Math.PI/2;g.add(m);clutter(g,d.i);root.add(g);finds.push({kind:'mint',def:d,g});});
  // A weathered sleeve partly under litter, no glow or map pin.
  window.music227?.pickups.forEach((p,i)=>{if(p.id!=='headphones227'&&!p.g.userData.hidden230){clutter(p.g,i+3);p.g.userData.hidden230=true;}});
  if(zone==='yard')woodSites.forEach(([x,z],i)=>{const hits=state().wood[i]||0;if(hits>=9)return;const g=new THREE.Group();g.position.set(x,0,z);for(let j=0;j<3;j++){const log=mesh(g,new THREE.CylinderGeometry(.08,.12,.8+j*.14,8),timber,(j-1)*.16,.13+j*.035,0);log.rotation.set(Math.PI/2,0,(j-1)*.2);}root.add(g);woodNodes.push({kind:'wood',id:i,g});});
 }
 function distance(p){return Math.hypot(rat.position.x-p.x,rat.position.z-p.z);}
 function chooseNear(){near=null;if(!rat||car77?.riding||job||!gameplayActive()||photo.active||rat.userData.job67?.lock)return;
  let best=1.4;for(const f of [...finds,...woodNodes]){const dist=distance(f.g.position),range=f.kind==='mint'?.48:1.2;if(f.g.visible&&dist<range&&dist<best){near=f;best=dist;}}
  if(zone==='house'&&hs?.house){let best=2.25;for(const b of hs.house.userData.boards230||[]){const d=state(),done=d.boards[b.id],paint=d.paint[b.id];if(d.mode==='paint'?(!done||!b.wall||paint===d.colour):done)continue;const dist=distance(b);if(dist<best){best=dist;near={kind:done?'paint':'repair',b,g:b.group};}}}
 }
 function begin(){chooseNear();if(!near)return false;const n=near,d=state();if(n.kind==='mint'){d.mints[n.def.id]=true;d.equipped=n.def.id;n.g.visible=false;save();sfx.pickup();sayToast(n.def.name+' · '+Object.keys(d.mints).length+'/20. Equipped in your car.');near=null;return true;}
  const tool=n.kind==='wood'?'axe230':n.kind==='paint'?'brush230':'hammer230';if(!home.tools?.[tool]){sayToast('Craft a '+CRAFT[tool].name+' in Craft → Tools.');return false;}
  const cost=n.kind==='repair'?{plank230:1,nail:1}:n.kind==='paint'?{paint230:1}:{};
  if(Object.entries(cost).some(([k,v])=>materialCount(k)<v)){sayToast(n.kind==='repair'?'Needs one sawn plank and one nail.':'Mix natural wall paint in Craft.');return false;}
  if(n.kind==='wood'&&totalBag()+1>bagCapacity()){sayToast('Make room for one branch in your bag.');return false;}
  const actor=rat,world=root;actor.rotation.y=Math.atan2(n.g.position.x-actor.position.x,n.g.position.z-actor.position.z);
  const prop=toolModel(tool);prop.scale.setScalar(.35);root.add(prop);job={n,cost,actor,world,prop,t:0,colour:d.colour};
  sequence67(actor,[n.kind==='wood'?'Craft_Hammer_Loop':n.kind==='paint'?'Craft_Saw_Loop':'Craft_Hammer_Loop'],{duration:1.5,lock:true});button.style.display='none';return true;
 }
 function updateJob(dt){if(!job)return;const j=job;if(root!==j.world||rat!==j.actor){j.prop.parent?.remove(j.prop);job=null;return;}if(!gameplayActive()||photo.active)return;j.t+=Math.min(dt,.05);
  // The lightweight tool follows the animated original right hand when available.
  j.actor.updateMatrixWorld(true);const hand=j.actor.userData.pipBones?.RightHand;if(hand)hand.getWorldPosition(j.prop.position);else{j.prop.position.copy(j.actor.position).add(V(Math.sin(j.actor.rotation.y)*.3,.5,Math.cos(j.actor.rotation.y)*.3));}
  j.prop.rotation.set(Math.sin(j.t*13)*.8,j.actor.rotation.y,0);
  if(j.t<1.5)return;j.prop.parent?.remove(j.prop);job=null;
  if(j.n.kind==='wood'){if(totalBag()+1>bagCapacity())return;inv.log230=(inv.log230||0)+1;state().wood[j.n.id]=(state().wood[j.n.id]||0)+1;j.n.g.scale.setScalar(1-state().wood[j.n.id]/12);if(state().wood[j.n.id]>=9)j.n.g.visible=false;sayToast('Seasoned branch collected · saw it into four planks.');}
  else if(consumeMaterials(j.cost)){if(j.n.kind==='repair')state().boards[j.n.b.id]=true;else state().paint[j.n.b.id]=j.colour;j.n.b.refresh();sayToast(j.n.kind==='repair'?'One board replaced and nailed down.':'One wall board painted.');}
  bag();save();sfx.craft();
 }
 function equipCharm(){const c=car77?.driver225?.cabin;if(!c||c===cabin&&equipped===state().equipped)return;cabin=c;equipped=state().equipped;const d=designs.find(d=>d.id===equipped&&state().mints[d.id]);if(!d)return;
  c.charm.children.slice().forEach(o=>{if(o.name==='Collected mint'){c.charm.remove(o);o.traverse(m=>{m.geometry?.dispose();m.material?.dispose();});}else o.visible=false;});const g=new THREE.Group();g.name='Collected mint';const string=mesh(g,new THREE.CylinderGeometry(.0007,.0007,.065,6),mat(0xd8c9a6),0,-.0325);const m=mintModel(d.i);m.scale.setScalar(.07);m.position.y=-.091;g.add(m);c.charm.add(g);
 }
 function menu(){const d=state();modal('Pip’s restoration journal',`<p>Your larger home starts flood-damaged. Walk to a broken board, then use the repair prompt. Each board needs one plank and one nail. Repaired walls can be painted individually: switch Work mode below to Paint.</p><p>Craft an axe and hammer from scavenged materials. Chop fallen branches beside the yard and city approach. Make a tin-tooth saw at a workbench, then turn each branch into four planks. Foil becomes six nails with your hammer. Make a fibre brush and mix water, sap and leaves into paint.</p><p>Repairs: ${Object.keys(d.boards).length}/60 · Painted boards: ${Object.keys(d.paint).length}/36<br>Mint charms: ${Object.keys(d.mints).length}/20. No tracking pins: search low, inspect litter and explore the distant sewer branches.</p>`,[['Craft tools & materials',()=>{closeModal();bookFilter='all';craftMade40=null;craftDetail40=false;openCraftBook();}],['Work mode · '+(d.mode==='paint'?'Paint':'Repair'),()=>{d.mode=d.mode==='paint'?'repair':'paint';save();menu();}],['Mint collection',collection],['Paint colour · '+d.colour,()=>{const keys=Object.keys(colours);d.colour=keys[(keys.indexOf(d.colour)+1)%keys.length];save();menu();}],['Vinyl collection',()=>music227.menu()],['Close',closeModal]]);}
 function collection(){const d=state();modal('Twenty hidden mint charms',designs.map(a=>`<p>${d.mints[a.id]?'✓':'○'} <b>${a.name}</b><br><small>${d.mints[a.id]?'Found':a.clue}</small></p>`).join(''),[...designs.filter(a=>d.mints[a.id]).map(a=>[(d.equipped===a.id?'✓ ':'Hang ')+a.name,()=>{d.equipped=a.id;save();equipCharm();collection();}]),['Back',menu],['Close',closeModal]]);}
 button.onclick=begin;
 // Keep Grab available for furniture, doors and salvage; repairs use their own contextual prompt.
 const finishesBefore=finishes65;finishes65=function(field){if(field==='wall'||field==='floor'){state().mode=field==='wall'?'paint':'repair';return menu();}return finishesBefore(field);};
 const homeMenuBefore=homeMenu63;homeMenu63=function(){homeMenuBefore();const b=document.createElement('button');b.className='btn';b.textContent='Repair boards & paint';b.onclick=menu;$('modalActions').prepend(b);};
 const beforeObjectives=openObjectives200;openObjectives200=function(){beforeObjectives();const b=document.createElement('button');b.className='btn';b.textContent='Home repairs & mint collection';b.onclick=menu;$('modalActions').prepend(b);};
 const houseStartBefore=startHouse;startHouse=function(){houseStartBefore();if(!state().introduced){state().introduced=true;save();sayToast('Your flood-damaged home · open Home → Repair boards & paint for the restoration guide.');}};
 const beforeCraft=openCraftBook;openCraftBook=function(){beforeCraft();const b=document.createElement('button');b.className='btn';b.textContent='Home renovation guide';b.onclick=menu;$('modalActions').prepend(b);};
 const beforeTick=tickWorld38;tickWorld38=function(dt){beforeTick(dt);if(owner!==root||zone!==zoneNow())rebuild();updateJob(dt);timer+=dt;if(timer<.15)return;timer=0;equipCharm();chooseNear();button.style.display=near?'block':'none';if(near)button.textContent=near.kind==='mint'?'Collect '+near.def.name:near.kind==='wood'?'Chop fallen branch':near.kind==='repair'?'Replace this board · 1 plank + 1 nail':'Paint this board · '+state().colour;};
 window.homestead230={state,designs,mintModel,menu,collection,begin,rebuild,get finds(){return finds;},get woodNodes(){return woodNodes;},get job(){return job;}};
})();
