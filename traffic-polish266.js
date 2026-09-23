/* Build 266: proper red-light queues, smoother following gaps, road markings. */
(()=>{
 let owner=null,clock=0,markings=null;
 function ensure266(){
  const s=window.city204?.state;if(!s?.collision||s.owner!==root)return false;
  if(owner!==root){owner=root;clock=0;if(markings?.parent)markings.parent.remove(markings);markings=new THREE.Group();markings.name='Build 266 road markings';root.add(markings);
   const c=window.cityTraffic261,signals=c?.signals||[];
   const white=new THREE.MeshBasicMaterial({color:0xd6d0bb});
   const yellow=new THREE.MeshBasicMaterial({color:0xc9ad55});
   const laneX=(c?.traffic||[]).map(t=>t.lane).filter(Number.isFinite);
   if(laneX.length){const xmin=Math.min(...laneX),xmax=Math.max(...laneX),mid=(xmin+xmax)/2;const b=s.collision.bounds;
    for(let z=b.min.z+12;z<b.max.z-10;z+=8){const m=new THREE.Mesh(new THREE.BoxGeometry(.11,.012,3.1),yellow);m.position.set(mid,.025,z);m.userData.noInk=true;markings.add(m);}
   }
   for(const sig of signals){for(let k=-2;k<=2;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(.65,.012,.14),white);m.position.set(sig.position.x+k*.75,.028,sig.position.z-2.9);m.userData.noInk=true;markings.add(m);}}
  }
  return true;
 }
 function polish266(dt){
  if(!ensure266())return;clock+=dt;const c=window.cityTraffic261,traffic=c?.traffic||[],signals=c?.signals||[];if(!traffic.length)return;
  const red=(clock%12)<5.5;
  for(const t of traffic){
   const ahead=traffic.find(o=>o!==t&&o.dir===t.dir&&Math.abs(o.lane-t.lane)<.6&&((o.g.position.z-t.g.position.z)*t.dir)>0&&((o.g.position.z-t.g.position.z)*t.dir)<18);
   if(ahead){const gap=((ahead.g.position.z-t.g.position.z)*t.dir)-(ahead.halfL||3.3)-(t.halfL||3.3);if(gap<2.4)t.speed=Math.min(t.speed,0);else if(gap<5.5)t.speed=Math.min(t.speed,.7);else if(gap<8)t.speed=Math.min(t.speed,1.6);}
   if(red&&signals.length){const s=signals.reduce((a,b)=>Math.abs(b.position.z-t.g.position.z)<Math.abs(a.position.z-t.g.position.z)?b:a,signals[0]);const gap=(s.position.z-t.g.position.z)*t.dir;
    if(gap>0&&gap<11)t.speed=Math.min(t.speed,Math.max(0,(gap-4.7)*.45));
    if(gap>0&&gap<=4.8){t.speed=0;t.g.position.z=s.position.z-t.dir*4.8;}
   }
  }
 }
 const tick0=tickWorld38;tickWorld38=function(dt){tick0(dt);if(phase!=='scavenge'){owner=null;clock=0;if(markings?.parent)markings.parent.remove(markings);markings=null;return;}if(gameplayActive()&&!document.hidden)polish266(Math.min(.05,dt));};
 window.trafficPolish266={};
})();