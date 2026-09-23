/* Build 264: city grounding, camera safety, darker traffic glass, cleaner street life. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 function inCity264(p){
   const b=window.city204?.state?.collision?.bounds;
   return !!(b&&p&&p.x>b.min.x-4&&p.x<b.max.x+4&&p.z>b.min.z-4&&p.z<b.max.z+4);
 }
 function darkGlass264(g){
   if(!g)return;
   g.traverse(o=>{
     if(!o.isMesh)return;
     const n=(o.name||'').toLowerCase();
     const mats=Array.isArray(o.material)?o.material:[o.material];
     if(/window|glass|windshield|windscreen|screen|pane/.test(n)){
       o.material=mats.map(m=>{
         if(!m)return m;
         const c=m.clone();
         if(c.color)c.color.setHex(0x1c252b);
         if('metalness' in c)c.metalness=Math.max(.15,c.metalness||0);
         if('roughness' in c)c.roughness=Math.max(.32,c.roughness||0);
         c.transparent=true;c.opacity=.78;c.depthWrite=true;
         return c;
       });
       if(!Array.isArray(o.material)&&o.material.length===1)o.material=o.material[0];
     }
   });
 }
 function refreshTrafficGlass264(){
   const c=window.cityTraffic261;
   if(!c)return;
   [...(c.traffic||[]).map(x=>x.g),...(c.parked||[])].forEach(darkGlass264);
 }
 function regroundPeople264(){}
 function cameraFloor264(){
   if(!rat||photo?.active)return;
   const focus=car77?.riding?car77.g.position:rat.position;
   if(!inCity264(focus))return;
   const floor=Math.max(.32,focus.y+.18);
   if(camera.position.y<floor){
     camera.position.y=floor;
     if(gameCam?.pos)gameCam.pos.y=floor;
   }
 }
 let stamp=0;
 const tick0=tickWorld38;
 tickWorld38=function(dt){
   tick0(dt);
   if(phase!=='scavenge')return;
   stamp+=dt;
   if(stamp>.45){stamp=0;refreshTrafficGlass264();regroundPeople264();}
 };
 const cam0=tickGameplayCamera;
 tickGameplayCamera=function(dt){cam0(dt);cameraFloor264();};
 window.cityFix264={darkGlass:refreshTrafficGlass264,groundPeople:regroundPeople264};
})();