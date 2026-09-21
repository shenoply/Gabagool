/* Articulated canvas roof, responsive cabin foley and a lived-in wall home. */
(()=>{
 const T=THREE,V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),clamp=T.MathUtils.clamp;
 const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
 function mesh(g,geo,mat,name,p=V()){const o=new T.Mesh(geo,mat);o.name=name;o.position.copy(p);o.userData.noInk=true;o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
 const material=(color,metalness=0,roughness=.8)=>new T.MeshStandardMaterial({color,metalness,roughness});
 function bar(g,a,b,r,mat,name){const o=mesh(g,new T.CylinderGeometry(r,r,1,8),mat,name);link(o,a,b);return o;}
 function link(o,a,b){o.position.copy(a).add(b).multiplyScalar(.5);o.scale.y=a.distanceTo(b);o.quaternion.setFromUnitVectors(V(0,1,0),b.clone().sub(a).normalize());}
 function foley(kind){if(!voiceOn)return;const ac=sfxCtx();if(!ac)return;ac.resume().catch(()=>{});const duration=kind==='open'?.32:kind==='close'?.18:.065,now=ac.currentTime;
  const buffer=ac.createBuffer(1,Math.ceil(ac.sampleRate*duration),ac.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/data.length*5);
  const source=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();source.buffer=buffer;filter.type='lowpass';filter.frequency.value=kind==='close'?650:kind==='open'?1400:2400;gain.gain.value=kind==='close'?.18:.075;source.connect(filter).connect(gain).connect(ac.destination);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
  if(kind==='open'){const osc=ac.createOscillator(),g=ac.createGain();osc.type='triangle';osc.frequency.setValueAtTime(190,now);osc.frequency.linearRampToValueAtTime(95,now+.3);g.gain.setValueAtTime(.017,now);g.gain.exponentialRampToValueAtTime(.0001,now+.3);osc.connect(g).connect(ac.destination);osc.start();osc.stop(now+.32);osc.onended=()=>{osc.disconnect();g.disconnect();};}
 }
 function roofRig(c){const a=c.cabin219;if(a.soft241)return;a.roof.visible=false;const g=new T.Group();g.name='Articulated canvas soft top';c.visual.add(g);
  const cloth=material(0x4d5948,0,.98),metal=material(0x899385,.72,.29);cloth.side=T.DoubleSide;
  const geometry=new T.PlaneGeometry(1,.9,24,36);geometry.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(25*37*3),3));
  const canvas=mesh(g,geometry,cloth,'Gathering canvas');canvas.frustumCulled=false;
  const weave=document.createElement('canvas');weave.width=weave.height=64;const wc=weave.getContext('2d');wc.fillStyle='#6b7057';wc.fillRect(0,0,64,64);wc.strokeStyle='#575e49';wc.lineWidth=1;for(let n=0;n<64;n+=4){wc.beginPath();wc.moveTo(n,0);wc.lineTo(n,64);wc.moveTo(0,n);wc.lineTo(64,n);wc.stroke();}cloth.map=new T.CanvasTexture(weave);cloth.map.wrapS=cloth.map.wrapT=T.RepeatWrapping;cloth.map.repeat.set(9,9);cloth.map.encoding=T.sRGBEncoding;
  const rear=new T.Group();rear.name='Folding rear canvas and window';rear.position.set(0,.55,-.76);g.add(rear);
  const shape=new T.Shape();shape.moveTo(-.49,0);shape.lineTo(.49,0);shape.lineTo(.505,.40);shape.quadraticCurveTo(0,.47,-.505,.40);shape.closePath();const hole=new T.Path();hole.moveTo(-.28,.14);hole.lineTo(-.28,.31);hole.lineTo(.28,.31);hole.lineTo(.28,.14);hole.closePath();shape.holes.push(hole);mesh(rear,new T.ShapeGeometry(shape),cloth,'Rear canvas with window aperture');
  mesh(rear,new T.PlaneGeometry(.56,.17),new T.MeshStandardMaterial({color:0xa5babe,roughness:.18,transparent:true,opacity:.35,side:T.DoubleSide,depthWrite:false}),'Soft top rear window',V(0,.225,0));
  const rods=[];for(let side of [-1,1])for(let j=0;j<3;j++){const lower=bar(g,V(),V(0,1,0),.011,metal,'Pivoted lower roof link'),upper=bar(g,V(),V(0,1,0),.009,metal,'Pivoted upper roof link');const pin=mesh(g,new T.SphereGeometry(.017,8,6),metal,'Roof hinge pin');rods.push({side,j,lower,upper,pin});}
  const bows=[];for(let j=0;j<4;j++){const points=new Float32Array(25*3),geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(points,3));const line=new T.Line(geo,new T.LineBasicMaterial({color:0xc8c2a6}));line.name='Canvas stitched bow';line.frustumCulled=false;g.add(line);bows.push(line);}
  const header=bar(g,V(-.46,.96,.125),V(.46,.96,.125),.015,metal,'Roof front latch rail');
  a.soft241={g,canvas,rods,bows,header,rear,last:-1};
 }
 function roofPoint(u,v,amount){const unfurl=smooth((amount-.2)/.8),lift=smooth(amount/.65),z=-.76+v*(.045+.84*unfurl),arch=.035*(1-u*u)*lift;
  const y=.56+.395*lift+arch+(1-unfurl)*(.028*Math.sin(v*Math.PI*8)+.01*v)+Math.sin(Math.PI*amount)*.065*v;
  return V(u*(.46+.045*(1-v)),y,z);
 }
 function updateRoof(c){const a=c.cabin219,r=a.soft241;if(Math.abs(r.last-a.roofValue)<.00001)return;r.last=a.roofValue;
  r.rear.scale.y=.08+.92*smooth(a.roofValue/.65);const pos=r.canvas.geometry.attributes.position;for(let j=0;j<=36;j++)for(let i=0;i<=24;i++){const p=roofPoint(i/12-1,j/36,a.roofValue);pos.setXYZ(j*25+i,p.x,p.y,p.z);}pos.needsUpdate=true;r.canvas.geometry.computeVertexNormals();
  for(const [j,line]of r.bows.entries()){const p=line.geometry.attributes.position;for(let i=0;i<=24;i++){const v=roofPoint(i/12-1,j/3,a.roofValue);p.setXYZ(i,v.x,v.y+.004,v.z);}p.needsUpdate=true;}
  for(const k of r.rods){const base=V(k.side*.49,.55,-.77),end=roofPoint(k.side,(k.j+1)/3,a.roofValue),joint=base.clone().lerp(end,.5);joint.z-=.10*Math.sin(Math.PI*a.roofValue);joint.y+=.025;link(k.lower,base,joint);link(k.upper,joint,end);k.pin.position.copy(joint);}
  link(r.header,roofPoint(-1,1,a.roofValue),roofPoint(1,1,a.roofValue));
 }
 // A low-cost painted environment gives metal proper highlights without six extra scene renders.
 const envCanvas=document.createElement('canvas');envCanvas.width=512;envCanvas.height=256;const ctx=envCanvas.getContext('2d');const sky=ctx.createLinearGradient(0,0,0,256);sky.addColorStop(0,'#79a8b4');sky.addColorStop(.46,'#e5e5bd');sky.addColorStop(.53,'#647552');sky.addColorStop(1,'#343e31');ctx.fillStyle=sky;ctx.fillRect(0,0,512,256);ctx.fillStyle='#f9f1d2';ctx.fillRect(60,40,130,24);ctx.fillRect(330,65,105,18);for(let i=0;i<13;i++){ctx.fillStyle=i%2?'#536548':'#78875e';ctx.beginPath();ctx.ellipse(i*44,133,19,30+i%4*8,0,0,Math.PI*2);ctx.fill();}
 const env=new T.CanvasTexture(envCanvas);env.mapping=T.EquirectangularReflectionMapping;env.encoding=T.sRGBEncoding;
 function coachwork(c){roofRig(c);c.visual.traverse(o=>{if(!o.isMesh)return;for(const m of (Array.isArray(o.material)?o.material:[o.material])){if(!m.isMeshStandardMaterial||m.userData.refined241)return;m.userData.refined241=true;if(m.metalness>.2){m.envMap=env;m.envMapIntensity=.42;m.roughness=Math.max(.25,m.roughness*.9);m.needsUpdate=true;}}});
  const chrome=material(0xb9c4b8,.8,.23);chrome.envMap=env;for(const side of [-1,1])for(let i=0;i<7;i++)bar(c.visual,V(side*.51,.44,.33+i*.067),V(side*.51,.48,.35+i*.067),.004,chrome,'Bonnet cooling louvre');
  c.refined241={doors:c.cabin219.doors.map(d=>d.value),lights:c.lights206};
 }
 const oldHouse=makeHouse;makeHouse=function(s){const g=oldHouse(s),decor=new T.Group();decor.name='Pip’s keepsakes';g.add(decor);const wood=material(0x765337),cream=material(0xddcc9f),green=material(0x73916a),clay=material(0xa4694e);
  function box(w,h,d,x,y,z,m=wood,name='Salvaged keepsake'){return mesh(decor,new T.BoxGeometry(w,h,d),m,name,V(x,y,z));}
  // Small wall-mounted details leave all floor routes and repair targets accessible.
  box(1.35,.65,.08,5.15,2.05,-HD/2+.2,wood,'Corkboard frame');box(1.23,.53,.02,5.15,2.05,-HD/2+.25,material(0xa7895c),'Corkboard');
  for(let i=0;i<3;i++){const n=box(.27,.32,.014,4.77+i*.38,2.08,-HD/2+.27,cream,'Pip’s paper notes');n.rotation.z=(i-1)*.12;mesh(decor,new T.SphereGeometry(.022,8,6),clay,'Map pin',V(4.77+i*.38,2.22,-HD/2+.3));}
  for(let i=0;i<5;i++){const book=box(.13,.25+i%2*.08,.23,-5.2+i*.15,1.84,-HD/2+.32,[green,clay,cream][i%3],'Watermarked pocket book');book.rotation.z=i===4?-.13:0;}
  const pot=mesh(decor,new T.CylinderGeometry(.12,.085,.18,10),clay,'Thimble herb pot',V(2.78,.73,-HD/2+.25));for(let i=0;i<5;i++){const leaf=mesh(decor,new T.SphereGeometry(1,8,6),green,'Mint leaf',V(2.78+Math.sin(i*2.4)*.08,.88+i*.022,-HD/2+.25+Math.cos(i)*.06));leaf.scale.set(.06,.10,.025);leaf.rotation.z=i*.8;}
  const lineMat=material(0xa38b65);bar(decor,V(-1.4,2.6,-HD/2+.22),V(.3,2.48,-HD/2+.22),.012,lineMat,'Twine keepsake line');for(let i=0;i<3;i++)box(.23,.27,.013,-1.14+i*.52,2.36-i*.035,-HD/2+.25,[cream,green,clay][i],'Hanging postcards');
  const lamp=g.userData.wallHome239;const lamps=[];g.traverse(o=>{if(o.isPointLight)lamps.push({o,intensity:o.intensity});});lamp.lamps241=lamps;
  return g;
 };
 const homeButtons=document.createElement('div');homeButtons.id='homeDetails241';homeButtons.style.cssText='position:fixed;left:12px;bottom:180px;display:none;gap:6px;z-index:4';document.body.appendChild(homeButtons);
 function button(label,fn){const b=document.createElement('button');b.className='btn';b.textContent=label;b.style.cssText='font:12px Georgia;padding:9px 12px';b.onclick=fn;homeButtons.appendChild(b);return b;}
 const lightButton=button('Lights',()=>{home.lights241=home.lights241===false;save();foley('switch');});
 const doorButton=button('Close door',()=>{if(phase==='house'&&world60?.door){home.doorOpen60=false;foley('close');}});
 let homeDoor=null,doorAngle=Math.PI/2,doorWas=false;
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);const active=gameplayActive()&&!document.hidden;homeButtons.style.display=phase==='house'&&active&&!hs?.sel?'flex':'none';if(!active)return;dt=clamp(dt,0,.05);
  if(phase==='house'&&hs?.house){const h=hs.house.userData.wallHome239;for(const l of h?.lamps241||[])l.o.intensity=home.lights241===false?0:l.intensity;for(const entry of hs.placed||[])entry.m.traverse(l=>{if(l.isPointLight){l.userData.base241??=l.intensity;l.intensity=home.lights241===false?0:l.userData.base241;}});for(const l of hs.lights||[])if(l.isLight){l.userData.base241??=l.intensity;l.intensity=home.lights241===false?0:l.userData.base241;}lightButton.textContent=home.lights241===false?'Lights on':'Lights off';
   const d=world60?.door;if(d){if(d!==homeDoor){homeDoor=d;doorAngle=Math.PI/2;doorWas=!!home.doorOpen60;}if(home.doorOpen60&&!doorWas)foley('open');doorWas=!!home.doorOpen60;doorAngle=T.MathUtils.damp(doorAngle,home.doorOpen60?0:Math.PI/2,7,dt);d.rotation.y=doorAngle;doorButton.style.display=home.doorOpen60?'block':'none';}}
  const c=car77;if(!c||c.owner!==root||!c.cabin219)return;if(!c.refined241)coachwork(c);updateRoof(c);const r=c.refined241;
  c.cabin219.doors.forEach((d,i)=>{if(r.doors[i]<=.001&&d.value>.001)foley('open');if(r.doors[i]>.001&&d.value<=.001)foley('close');r.doors[i]=d.value;});if(r.lights!==c.lights206){foley('switch');r.lights=c.lights206;}
 };
 window.refinements241={roofPoint,updateRoof,foley};
})();
