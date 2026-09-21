/* Mobile interaction ownership, compact driving and a playable restoration lesson. */
(()=>{
 const css=document.createElement('style');css.textContent=`
 body.menu-open65> :not(#ui):not(canvas):not(script):not(style):not(link){display:none!important;visibility:hidden!important;pointer-events:none!important}
 body.menu-open65 #ui> :not(#modal){display:none!important;visibility:hidden!important;pointer-events:none!important}
 body.menu-open65 #modal,body.menu-open65 #modal *{visibility:visible!important}
 body.menu-open65 #modal{z-index:1000!important;background:#10251ee8!important}
 body.menu-open65 #modal section{max-height:94dvh!important;overflow:auto!important}
 #outsideView221{display:none!important}
 body #speed209{right:16px!important;bottom:174px!important;font-size:11px!important}
 body #carContext220{top:auto!important;bottom:235px!important}
 body #mirrorDone220{top:auto!important;bottom:235px!important;max-width:190px!important;font-size:11px!important}
 body #cockpit205{width:164px!important;display:grid!important;grid-template-columns:1fr 1fr;gap:7px!important;bottom:max(16px,env(safe-area-inset-bottom))!important;right:12px!important}
 body #cockpit205[hidden]{display:none!important}
 body #cockpit205 .cockpit205-quick{grid-column:1 / 3;grid-row:1;display:flex;gap:5px!important;width:164px!important;height:44px!important}
 body #cockpit205 #ignition211,body #cockpit205 #handbrake223,body #cockpit205 #exitCar220{width:100%!important;min-width:0!important;height:44px!important;min-height:44px!important;padding:5px!important;font:600 11px/1.2 system-ui!important;white-space:normal!important;border-radius:11px!important;flex:none!important}
 body #cockpit205 #ignition211{grid-column:1;grid-row:2}body #cockpit205 #handbrake223{grid-column:2;grid-row:2}
 body #cockpit205 #exitCar220{grid-column:1;grid-row:3}
 body #cockpit205 .cockpit205-main{grid-column:2;grid-row:3;width:100%!important;height:48px!important;flex:none!important}
 body #cockpit205 .cockpit205-drift{width:48px!important;height:48px!important;min-height:48px!important;border-radius:14px!important}
 body #cockpit205 .cockpit205-drift svg{width:18px!important;height:18px!important}
 body #cockpit205 .cockpit205-drawer{grid-column:1 / 3;bottom:166px!important;max-height:calc(100dvh - 190px)!important}
 body #homesteadAction230,body #supply231{left:50%!important;bottom:300px!important;width:auto!important;max-width:180px!important;min-height:44px!important;padding:8px 12px!important;border:1px solid #d4c59d66!important;border-radius:11px!important;background:#203d34ee!important;color:#f1dfb8!important;font:600 12px/1.3 system-ui!important;box-sizing:border-box;z-index:32!important}
 body #lesson219{width:min(280px,calc(100vw - 24px))!important;font:12px/1.35 system-ui!important}
 body #workLesson231{position:fixed;top:12px;left:12px;right:12px;max-width:320px;padding:10px 12px;z-index:70;background:#19382ff2;color:#f4e4bf;border:1px solid #d5bb8377;border-radius:13px;font:12px/1.4 system-ui;box-sizing:border-box}
 #workLesson231[hidden]{display:none!important}#workLesson231 p{margin:6px 0}#workLesson231 button{font:600 12px system-ui;min-height:36px;padding:6px 10px;border-radius:8px;margin:3px 6px 0 0;background:#e6d3a6;color:#213b30;border:0}
 body.work-practice231 #quickLizard209,body.work-practice231 #hud,body.work-practice231 #survival,body.work-practice231 #craftBook,body.work-practice231 #menu65,body.work-practice231 #navigation201,body.work-practice231 #geckoWhistle193,body.work-practice231 #lesson219{display:none!important}
 @media(max-height:520px){body #workLesson231{max-width:260px;font-size:11px;max-height:40vh;overflow:auto}body #homesteadAction230,body #supply231{bottom:170px!important;left:40%!important}}
 `;document.head.appendChild(css);
 const quick=cockpit205.hud.querySelector('.cockpit205-quick'),view=quick.children[1];view.onpointerdown=e=>{e.preventDefault();e.stopPropagation();roadsterControls203.setView(roadsterControls203.viewIndex===0?2:0);};view.onclick=null;
 // A ground setting around the open-front home, never an empty floating slab.
 const startHome=startHouse;startHouse=function(){startHome();const g=new THREE.Group();g.name='Home garden surround';const soil=MT(0x5e6542,'soil',12,12),stone=MT(0x655e4c,'cobble',3,1),wood=MT(0x62452e,'wood',2,1);
  const floor=box(110,.3,110,soil);floor.position.y=-.55;g.add(floor);const base=box(HW+.5,.32,HD+.5,stone);base.position.y=-.24;g.add(base);
  for(let i=0;i<18;i++){const angle=i*2.399,r=13+(i%5)*2.1;const rock=sph(.65+(i%3)*.22,stone,7,5);rock.scale.set(1,.55,1.3);rock.position.set(Math.sin(angle)*r,-.05,Math.cos(angle)*r);g.add(rock);}
  for(let i=0;i<14;i++){const x=-22+i*3.4;const post=box(.3,4,.3,wood);post.position.set(x,1.45,-17);g.add(post);for(const y of [.5,1.6,2.7]){const rail=box(3.4,.36,.12,wood);rail.position.set(x+1.6,y,-17);g.add(rail);}}
  for(const [x,z] of [[-16,-10],[17,-13],[-20,10],[20,8]]){const trunk=cyl(.48,.7,9,wood,8);trunk.position.set(x,3.8,z);g.add(trunk);const leaves=sph(4.6,M(0x4e6243),8,6);leaves.position.set(x,9,z);leaves.scale.set(1,.7,1);g.add(leaves);}
  for(let i=0;i<10;i++){const p=box(.8,.08,.6,stone);p.position.set(-HW/2-1-i*.85,-.34,DOORZ+Math.sin(i)*.12);g.add(p);}
  root.add(g);root.userData.homeGarden231=g;scene.background.set(0x91a08b);scene.fog=new THREE.Fog(0x91a08b,30,65);
 };
 const makeBefore=makeHouse;makeHouse=function(state){const g=makeBefore(state);for(const b of g.userData.boards230||[]){const before=b.refresh;b.refresh=function(){before();const d=homestead230.state();if(d.paint[b.id])return;const m=MT(d.boards[b.id]?0x967044:0x635b43,'wood',b.wall?3:1,b.wall?1:4);m.color.setHex(d.boards[b.id]?0xb99a72:0x82775e);b.group.children.forEach(o=>{if(o.geometry?.parameters?.width>.1)o.material=m;});};b.refresh();}return g;};
 const data=()=>{home.workshop231??={step:0,started:false,done:false,supplies:{stick:5,pebble:3,string:3,foil:3,nail:3,fiber:3,water:1,sap:1,leaf:2}};return home.workshop231;};
 const steps=[
  {title:'Find the starter salvage tin',text:'Outside in Pip’s lane, find the small wooden tray marked TOOLS near the home path. Walk to it and tap Take tool supplies. It contains the materials for your first tools.',target:[7.2,21.8],test:()=>!!data().collected},
  {title:'Craft your pebble axe',text:'An axe chops fallen branches into usable wood. Make it with 2 matchsticks, 2 pebbles and 1 string. Tap Open recipe below, then Make.',recipe:'axe230',test:()=>!!home.tools?.axe230},
  {title:'Chop a fallen branch',text:'Follow the guide to a short pile of brown branches. Stand beside it and tap Chop fallen branch. Trees and furniture cannot be chopped. Each action gives one seasoned branch.',target:[-5.5,20],test:()=>!!inv.log230||Object.values(homestead230.state().wood).some(n=>n>0)},
  {title:'Make a hammer',text:'The hammer fixes boards and makes nails from foil. Craft it with 1 matchstick, 1 pebble and 1 string.',recipe:'hammer230',test:()=>!!home.tools?.hammer230},
  {title:'Use the yard workbench',text:'Walk to the existing yard workbench, following the guide. Stand close to its tabletop. You can later craft your own workbench for home.',target:()=>yard76?.bench?.position,test:()=>courtyardReady76()},
  {title:'Craft the tin-tooth saw',text:'Stay beside the workbench. Make a saw using 2 foil scraps, 2 nails and 1 matchstick. The saw turns branches into building planks.',recipe:'saw230',test:()=>!!home.tools?.saw230},
  {title:'Saw four planks',text:'Still at the workbench, open this recipe and saw 1 seasoned branch into 4 planks. Keep one nail for the repair.',recipe:'sawplanks230',test:()=>!!inv.plank230||Object.keys(homestead230.state().boards).length>0},
  {title:'Repair one board at home',text:'Tap Home to return. Walk beside a broken floor or wall board. Tap Replace board: it uses 1 plank and 1 nail. Your hammer is used automatically.',home:true,test:()=>Object.keys(homestead230.state().boards).length>0},
  {title:'Craft your paintbrush',text:'A brush paints repaired wall boards. Make it from 1 matchstick, 3 plant fibres and 1 string.',recipe:'brush230',test:()=>!!home.tools?.brush230},
  {title:'Mix wall paint',text:'Mix 1 water, 1 sap and 2 leaves into 6 paint doses. Each dose paints one wall board.',recipe:'mixpaint230',test:()=>!!inv.paint230||Object.keys(homestead230.state().paint).length>0},
  {title:'Paint a repaired wall',text:'Repair a wall board first if you only repaired the floor. Open Work settings, choose Paint mode and a colour, then walk to the repaired wall and tap Paint board.',settings:true,test:()=>Object.keys(homestead230.state().paint).length>0}
 ];
 let active=false,owner=null,supply=null,guide=null,near=false,elapsed=0,last='';
 const card=document.createElement('section');card.id='workLesson231';card.hidden=true;document.body.appendChild(card);
 const take=document.createElement('button');take.id='supply231';take.className='btn';take.style.cssText='position:fixed;transform:translateX(-50%);display:none';document.body.appendChild(take);
 function target(){const t=steps[data().step]?.target;if(!t)return null;const p=typeof t==='function'?t():t;return p?.isVector3?p:new THREE.Vector3(p?.[0]||0,0,p?.[1]||0);}
 function recipe(id){closeModal();filter65='all';query65='';craftReady82=false;pickRecipe65(id);}
 function render(){if(!active)return;const s=steps[data().step],ready=s.test();card.innerHTML='<strong>Tools · '+(data().step+1)+' / '+steps.length+' — '+s.title+'</strong><p>'+s.text+'</p><div id="workButtons231"></div>';const actions=$('workButtons231');const add=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.onclick=fn;actions.appendChild(b);};
  if(s.target&&phase!=='scavenge')add('Go to yard',()=>{closeModal();startScavenge();});if(s.target&&phase==='scavenge')add('Face work area',()=>{const p=target();if(p){gameCam.yaw=Math.atan2(rat.position.x-p.x,rat.position.z-p.z);gameCam.ready=false;}});if(s.target&&phase==='scavenge'){const p=target();if(p){const distance=document.createElement('span');distance.id='workDistance231';distance.textContent=Math.round(rat.position.distanceTo(p))+' m to work area';actions.appendChild(distance);}}if(s.recipe)add('Open recipe',()=>recipe(s.recipe));if(s.home)add('Go home',()=>{closeModal();homestead230.state().mode='repair';startHouse();});if(s.settings)add('Work settings',()=>homestead230.menu());if(ready)add('Done ✓ · Next',advance);add('Pause',pause);last=String(data().step)+ready+phase;
 }
 function start(reset=false){closeModal();tutorial219.pause();if(reset)data().step=0;data().started=true;active=true;card.hidden=false;document.body.classList.add('work-practice231');save();render();}
 function pause(){active=false;card.hidden=true;document.body.classList.remove('work-practice231');if(guide)guide.visible=false;save();}
 function advance(){if(!steps[data().step]?.test())return false;data().step++;if(data().step>=steps.length){data().done=true;data().step=0;pause();sayToast('Restoration practice complete. Replay it from Craft or Tutorial.');}else render();save();return true;}
 function supplies(){if(!near||!gameplayActive())return false;let count=0;for(const [id,n]of Object.entries(data().supplies)){const amount=Math.min(n,Math.max(0,bagCapacity()-totalBag()));if(amount){inv[id]=(inv[id]||0)+amount;data().supplies[id]-=amount;count+=amount;}}if(count)data().collected=true;save();bag();sayToast(count?'Tool supplies collected. Open the axe recipe to begin.':'Bag full. Store some supplies at home and return for the rest.');return count>0;}
 take.onclick=supplies;
 function build(){owner=root;supply=null;guide=null;if(phase!=='scavenge')return;const g=new THREE.Group();g.position.set(7.2,0,21.8);const tray=box(.7,.16,.45,MT(0x7e6140,'wood',2,1));tray.position.y=.08;g.add(tray);for(let i=0;i<4;i++){const part=cyl(.035,.035,.48,wood,6);part.rotation.z=1.2;part.position.set((i-1.5)*.12,.22,0);g.add(part);}const sign=markerText('TOOLS');sign.position.set(0,.7,0);sign.scale.setScalar(.5);g.add(sign);root.add(g);supply=g;
  guide=new THREE.Group();const ring=new THREE.Mesh(new THREE.TorusGeometry(.45,.025,5,24),M(0xd3ba78));ring.rotation.x=Math.PI/2;ring.position.y=.035;guide.add(ring);const flag=markerText('TOOL PRACTICE');flag.position.y=.95;flag.scale.setScalar(.45);guide.add(flag);root.add(guide);
 }
 function menu(){modal('Tools & home repairs',steps.map((s,i)=>'<p><b>'+(i+1)+'. '+s.title+'</b><br>'+s.text+'</p>').join(''),[['Start guided practice',()=>start(true)],['Resume practice',()=>start()],['Close',closeModal]]);}
 const purposeBefore=craftPurpose40;craftPurpose40=function(id,c){return ({axe230:'Chop the short fallen-branch piles in the yard. Stand beside one and tap Chop branch. Each branch can be sawn into four planks.',hammer230:'Repair broken home boards with one plank and one nail. Also straighten foil scraps into six nails using Craft.',saw230:'Use this beside a workbench to turn one seasoned branch into four building planks. Find branches by chopping fallen wood.',brush230:'Paint repaired wall boards at home. Choose Paint mode and a colour in Work settings, then tap Paint board.',sawplanks230:'One chopped branch becomes four planks. Requires your tin-tooth saw and a nearby workbench.',mixpaint230:'Makes six paint doses. Each dose colours one repaired wall board using your fibre paintbrush.'})[id]||purposeBefore(id,c);};
 const craftBefore=openCraftBook;openCraftBook=function(){craftBefore();Array.from($('modalActions').children).forEach(b=>{if(b.textContent==='Home renovation guide')b.remove();});const b=document.createElement('button');b.className='btn';b.textContent=active?'Return to tool lesson':'Learn tools · guided practice';b.onclick=active?closeModal:menu;if(craftDetail40)$('modalActions').appendChild(b);else $('modalActions').prepend(b);};$('craftBook').onclick=()=>openCraftBook();
 const tutorialMenu=tutorial219.menu;tutorial219.menu=function(){tutorialMenu();const b=document.createElement('button');b.className='btn';b.textContent='Tools & crafting practice';b.onclick=menu;$('modalActions').prepend(b);};
 const menuBefore=menu65;menu65=function(){menuBefore();const b=document.createElement('button');b.className='btn';b.textContent='Tools & crafting tutorial';b.onclick=menu;$('modalActions').prepend(b);};$('menu65').onclick=menu65;
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);const workButton=$('homesteadAction230');if(workButton){const text=workButton.textContent;if(text.startsWith('Replace this board')){workButton.textContent='Repair board';workButton.title='Uses one plank and one nail; requires your hammer';}else if(text.startsWith('Paint this board'))workButton.textContent='Paint board';else if(text==='Chop fallen branch')workButton.textContent='Chop branch';}view.textContent='Cockpit';view.setAttribute('aria-pressed',String(roadsterControls203.viewIndex!==0));view.title=roadsterControls203.viewIndex===0?'Enter cockpit':'Return to outside camera';$('ignition211').textContent=car77?.ignition206?'Stop engine':'Start engine';$('handbrake223').textContent=car77?.handbrake?'Brake on':'Handbrake';
  if(owner!==root)build();elapsed+=dt;if(elapsed<.15)return;elapsed=0;near=!!supply&&!!rat&&!car77?.riding&&rat.position.distanceTo(supply.position)<1.25&&Object.values(data().supplies).some(n=>n>0);take.style.display=near&&gameplayActive()?'block':'none';take.textContent='Take tool supplies';if(supply)supply.visible=Object.values(data().supplies).some(n=>n>0);
  if(active){const s=steps[data().step],key=String(data().step)+s.test()+phase;if(key!==last)render();card.hidden=!!car77?.riding;const p=target();const label=$('workDistance231');if(label&&p&&rat)label.textContent=Math.round(rat.position.distanceTo(p))+' m to work area';if(guide){guide.visible=!!p&&!car77?.riding;if(p)guide.position.copy(p);}}
 };
 window.workshop231={start,pause,advance,menu,supplies,data,steps,get active(){return active;},get supply(){return supply;}};
})();
