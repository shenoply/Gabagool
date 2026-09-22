/* Collision follows slices through the supplied city walls, never one district-sized box. */
(function(scope){
 function buildCityCollision210(THREE,group){
  group.updateWorldMatrix(true,true);const bounds=new THREE.Box3().setFromObject(group),segments=[],cells=new Map(),seen=new Set(),cellSize=2;
  const key=(x,z)=>Math.floor(x/cellSize)+','+Math.floor(z/cellSize);
  group.traverse(mesh=>{if(!mesh.isMesh||!mesh.geometry)return;
   const p=mesh.geometry.attributes.position,idx=mesh.geometry.index,points=[0,1,2].map(()=>new THREE.Vector3());
   for(let i=0;i<(idx?idx.count:p.count);i+=3){for(let k=0;k<3;k++)points[k].fromBufferAttribute(p,idx?idx.getX(i+k):i+k).applyMatrix4(mesh.matrixWorld);
    // Ground-height cross sections preserve alleys, doorways and separated buildings.
    for(const y of [.04,.10,.18,.30,.48,.75,.95]){const hits=[];for(let k=0;k<3;k++){const a=points[k],b=points[(k+1)%3];if((a.y<=y&&b.y>y)||(b.y<=y&&a.y>y)){const t=(y-a.y)/(b.y-a.y);hits.push({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});}}
     if(hits.length!==2)continue;const [a,b]=hits;if(Math.hypot(a.x-b.x,a.z-b.z)<.005)continue;const id=hits.map(p=>p.x.toFixed(3)+','+p.z.toFixed(3)).sort().join(':');if(seen.has(id))continue;seen.add(id);const s={a,b};segments.push(s);
     for(let x=Math.floor(Math.min(a.x,b.x)/cellSize);x<=Math.floor(Math.max(a.x,b.x)/cellSize);x++)for(let z=Math.floor(Math.min(a.z,b.z)/cellSize);z<=Math.floor(Math.max(a.z,b.z)/cellSize);z++){const k=x+','+z;if(!cells.has(k))cells.set(k,[]);cells.get(k).push(s);}
    }
   }
  });
  const distance=(p,a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);};
  function blocked(p,r=.2){for(let x=Math.floor((p.x-r)/cellSize);x<=Math.floor((p.x+r)/cellSize);x++)for(let z=Math.floor((p.z-r)/cellSize);z<=Math.floor((p.z+r)/cellSize);z++)for(const s of cells.get(x+','+z)||[])if(distance(p,s.a,s.b)<r)return true;return false;}
  function resolve(p,before,r=.2){const length=Math.hypot(p.x-before.x,p.z-before.z),steps=Math.max(1,Math.ceil(length/.08)),dx=p.x-before.x,dz=p.z-before.z;for(let n=1;n<=steps;n++){const q={x:before.x+dx*n/steps,z:before.z+dz*n/steps};if(blocked(q,r)){const t=(n-1)/steps;p.x=before.x+dx*t;p.z=before.z+dz*t;return true;}}return false;}
  return {bounds,segments,blocked,resolve};
 }
 scope.buildCityCollision210=buildCityCollision210;
 if(typeof module!=='undefined')module.exports=buildCityCollision210;
})(typeof window==='undefined'?globalThis:window);
