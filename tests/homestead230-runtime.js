(async()=>{
 const check=(v,m)=>{if(!v)throw Error(m);},step=(n=40)=>{for(let i=0;i<n;i++){rat.userData.job67=null;tickWorld38(.05);}};
 closeModal();sc=null;startScavenge();await new Promise(r=>setTimeout(r,100));step(4);
 check(homestead230.designs.length===20,'Twenty designs');check(new Set(homestead230.designs.map(d=>d.name)).size===20,'Unique names');
 check(!music227.destinations().some(d=>d.id.startsWith('record')),'Unfound records leak on map');check(music227.source===null,'No auto music');
 const yard=[...homestead230.finds.map(f=>({id:f.def.id,p:f.g.position})),...music227.pickups.filter(p=>p.id!=='headphones227').map(p=>({id:p.id,p:p.g.position}))];
 const reachable=[];for(const f of yard){let yes=false;for(let j=0;j<8;j++){const to=f.p.clone(),from=to.clone().add(new THREE.Vector3(Math.cos(j*Math.PI/4)*.5,0,Math.sin(j*Math.PI/4)*.5));resolveGeometry62(to,from);if(to.distanceTo(f.p)<.25)yes=true;}check(yes,'Blocked surface collectible '+f.id);reachable.push(f.id);}
 const f=homestead230.finds[0];rat.position.copy(f.g.position);step(4);check(homestead230.begin(),'Mint pickup');check(homestead230.state().mints[f.def.id],'Mint saved');check(homestead230.state().equipped===f.def.id,'Mint equipped');
 rat.position.copy(homestead230.woodNodes[0].g.position);step(4);home.tools??={};delete home.tools.axe230;check(!homestead230.begin(),'Axe gate');home.tools.axe230=true;const logs=inv.log230||0;check(homestead230.begin(),'Chop starts');step();check(inv.log230===logs+1,'One branch per chop');check(homestead230.state().wood[0]===1,'Saved harvest');
 delete home.tools.saw230;check(stationMessage(CRAFT.sawplanks230).includes('saw'),'Saw gate');home.tools.saw230=true;
 sewer211.enter('yard');step(4);check(homestead230.finds.length===10,'Ten underground mints');check(music227.pickups.length===5,'Five underground records');
 const layout=sewerLayout211();for(const p of [...homestead230.finds.map(f=>f.g.position),...music227.pickups.map(f=>f.g.position)])check(layout.inside(p.x,p.z,.26),'Sewer collectible in wall '+p.toArray());
 startHouse();await new Promise(r=>setTimeout(r,100));closeModal();sc=null;step(4);
 const bench={id:'workbench',x:0,z:0,rot:0};home.placed.push(bench);spawnPlaced(bench);rat.position.set(0,0,1);rat.userData.job67=null;inv.log230=2;const beforePlanks=inv.plank230||0;check(performCraft('sawplanks230',1),'Saw recipe works at bench');check(inv.log230===1&&inv.plank230===beforePlanks+4,'Saw yield and cost');rat.userData.job67=null;
 check(HW===16&&HD===12,'Larger floor');const boards=hs.house.userData.boards230;check(boards.length===60,'60 individual boards '+boards.length);check(boards.filter(b=>b.wall).length===36,'36 paintable wall boards');
 const board=boards.find(b=>b.id==='back-0-0');rat.position.set(board.x,0,board.z+1);step(4);home.tools.hammer230=true;inv.plank230=2;inv.nail=2;const previous=Object.keys(homestead230.state().boards).length;check(homestead230.begin(),'Repair starts');step();check(Object.keys(homestead230.state().boards).length===previous+1,'One board repaired');check(inv.plank230===1&&inv.nail===1,'Exact repair cost');
 const repaired=boards.find(b=>homestead230.state().boards[b.id]);check(repaired.wall,'Wall repaired');homestead230.state().mode='paint';home.tools.brush230=true;inv.paint230=2;step(4);check(homestead230.begin(),'Paint starts');step();check(homestead230.state().paint[repaired.id]==='sage','Paint saved');check(inv.paint230===1,'One paint dose');
 const persisted=JSON.stringify(homestead230.state());rebuildHouse();check(JSON.stringify(homestead230.state())===persisted,'Rebuild keeps progress');check(hs.house.userData.boards230.find(b=>b.id===repaired.id).group.children[0].material.color.getHex()===0x809377,'Paint survives rebuild');
 homestead230.menu();check($('modalBody').innerHTML.includes('60'),'Journal renders');closeModal();
 report.homestead230={designs:20,surfaceReachable:reachable.length,sewerFinds:15,boards:60,exactRepairAndPaintCosts:true,savedProgress:true,toolGates:true};
})()
