/* Repair-linked cracks and chipped plaster; leaves saved restoration progress intact. */
(()=>{
 const T=THREE,original=makeHouse;
 makeHouse=function(s){const house=original(s),ink=new T.MeshStandardMaterial({color:0x756957,roughness:1}),chip=new T.MeshStandardMaterial({color:0xaba08a,roughness:1,side:T.DoubleSide});
 for(const b of house.userData.boards230||[]){const damage=new T.Group();damage.name='Repair damage '+b.id;house.add(damage);damage.position.copy(b.group.position);damage.rotation.copy(b.group.rotation);
 const seed=[...b.id].reduce((n,c)=>n+c.charCodeAt(0),0),flip=seed%2?1:-1;
 function crack(points){const ps=points.map(([x,y])=>b.wall?new T.Vector3(x*1.65,y*1.5,.175):new T.Vector3(x,.063,y));for(let i=1;i<ps.length;i++){const d=ps[i].clone().sub(ps[i-1]),m=new T.Mesh(new T.CylinderGeometry(.009,.014,d.length(),5),ink);m.position.copy(ps[i]).add(ps[i-1]).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());damage.add(m);}}

 if(b.wall){crack([[-.27,.3],[-.16,.18],[-.19,.06],[-.03,-.03],[.01,-.22],[.15,-.31]].map(([x,y])=>[x*flip,y]));crack([[-.03,-.03],[.20,.04],[.30,.01]].map(([x,y])=>[x*flip,y]));}
 else{crack([[-.35,-1.15],[-.22,-.76],[-.25,-.35],[-.11,.05],[-.17,.48],[.02,.89]]);crack([[-.25,-.35],[.03,-.21],[.12,-.02]]);}
 const sh=new T.Shape();sh.moveTo(-.10,0);sh.lineTo(-.05,.09);sh.lineTo(.05,.065);sh.lineTo(.14,.015);sh.lineTo(.07,-.025);sh.lineTo(-.03,-.04);sh.closePath();const flake=new T.Mesh(new T.ShapeGeometry(sh),chip);if(b.wall)flake.position.set(.15*flip,-.30,.162);else{flake.rotation.x=-Math.PI/2;flake.position.set(-.16,.061,.48);}flake.scale.setScalar(b.wall?2.3:1.8);damage.add(flake);
 const refresh=b.refresh;b.refresh=function(){refresh();damage.visible=!homestead230.state().boards[b.id];};b.refresh();
 }
 return house;};
})();
