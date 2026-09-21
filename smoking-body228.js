function smoothStudyNormals(THREE,g){
 g.computeVertexNormals();const p=g.attributes.position,n=g.attributes.normal;
 if(!g.userData.smoothGroups){const groups=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*10000)).join(',');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);}g.userData.smoothGroups=[...groups.values()].filter(group=>group.length>1);}
 for(const group of g.userData.smoothGroups){let x=0,y=0,z=0;for(const i of group){x+=n.getX(i);y+=n.getY(i);z+=n.getZ(i);}const length=Math.hypot(x,y,z)||1;for(const i of group)n.setXYZ(i,x/length,y/length,z/length);}n.needsUpdate=true;
}
/* Preserve neck and tail. Close only the hidden head, with boundary triangulation. */
function createStudyInsideBody228(THREE,mesh){
 const full=mesh.geometry,si=full.attributes.skinIndex,sw=full.attributes.skinWeight,hidden=new Set(),attrs=full.attributes,keys=Object.keys(attrs),count=attrs.position.count;
 mesh.skeleton.bones.forEach((b,i)=>{for(let p=b;p;p=p.parent)if(/^head/i.test(p.name)){hidden.add(i);break;}});
 const visible=i=>{let w=0;for(let k=0;k<4;k++)if(hidden.has(si.array[i*4+k]))w+=sw.array[i*4+k];return w<.25;};
 const weld=new Map(),ids=[],representatives=[],edges=new Map(),keep=[];
 for(let i=0;i<count;i++){const p=attrs.position,key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*10000)).join(',');if(!weld.has(key)){weld.set(key,weld.size);representatives.push(i);}ids[i]=weld.get(key);}
 for(let i=0;i<(full.index?full.index.count:count);i+=3){const tri=[0,1,2].map(k=>full.index?full.index.getX(i+k):i+k);if(!tri.every(visible))continue;keep.push(...tri);for(let k=0;k<3;k++){const a=ids[tri[k]],b=ids[tri[(k+1)%3]],key=a<b?a+':'+b:b+':'+a;if(edges.has(key))edges.delete(key);else edges.set(key,[a,b]);}}
 const next=new Map();for(const [a,b]of edges.values()){if(!next.has(a))next.set(a,[]);next.get(a).push(b);}
 const arrays=Object.fromEntries(keys.map(k=>[k,Array.from(attrs[k].array)])),patches=[],copies=[];
 while(next.size){const start=next.keys().next().value,loop=[start];let at=start;for(let n=0;n<10000;n++){const list=next.get(at);if(!list?.length)break;const to=list.pop();if(!list.length)next.delete(at);at=to;if(at===start)break;loop.push(at);}if(at!==start||loop.length<3)continue;
  const vertices=loop.map(id=>representatives[id]);
  // Ear clipping follows the concave boundary; a centre fan crosses its notches.
  const axes=[0,1,2].map(axis=>({axis,min:Math.min(...vertices.map(i=>attrs.position.array[i*3+axis])),max:Math.max(...vertices.map(i=>attrs.position.array[i*3+axis]))})).sort((a,b)=>(b.max-b.min)-(a.max-a.min));
  const contour=vertices.map(i=>new THREE.Vector2(attrs.position.array[i*3+axes[0].axis],attrs.position.array[i*3+axes[1].axis]));
  const triangles=THREE.ShapeUtils.triangulateShape(contour,[]);let reverse=false,found=false;
  for(const tri of triangles){for(let k=0;k<3;k++){const a=tri[k],b=tri[(k+1)%3];if((a+1)%vertices.length===b){reverse=true;found=true;break;}if((b+1)%vertices.length===a){found=true;break;}}if(found)break;}
  const uv=i=>[.135+(attrs.position.array[i*3+axes[0].axis]-(axes[0].min+axes[0].max)/2)/Math.max(.001,axes[0].max-axes[0].min)*.016,.26+(attrs.position.array[i*3+axes[1].axis]-(axes[1].min+axes[1].max)/2)/Math.max(.001,axes[1].max-axes[1].min)*.020];
  const rim=vertices.map(source=>{const index=arrays.position.length/3;for(const key of keys){if(key==='uv')arrays[key].push(...uv(source));else for(let k=0;k<attrs[key].itemSize;k++)arrays[key].push(attrs[key].array[source*attrs[key].itemSize+k]);}copies.push({index,source});return index;});
  for(const tri of triangles){const t=reverse?[tri[2],tri[1],tri[0]]:tri;keep.push(...t.map(i=>rim[i]));}patches.push({vertices,triangles});
 }
 const inside=new THREE.BufferGeometry();for(const key of keys)inside.setAttribute(key,new THREE.BufferAttribute(new attrs[key].array.constructor(arrays[key]),attrs[key].itemSize,attrs[key].normalized));inside.setIndex(keep);smoothStudyNormals(THREE,inside);
 function sync(refreshNormals=true){const p=inside.attributes.position;p.array.set(full.attributes.position.array);for(const {index,source}of copies)for(let k=0;k<3;k++)p.array[index*3+k]=p.array[source*3+k];mesh.skeleton.update();
  p.needsUpdate=true;if(refreshNormals)smoothStudyNormals(THREE,inside);
 }

 return {mesh,full,inside,sync,patches};
}
