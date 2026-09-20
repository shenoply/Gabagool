/* Frame the complete roadster using the narrower viewport axis, including portrait phones. */
(()=>{
 const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
 let activeCar=null,walking=null,lastOutside=false;const offset=V();
 function minimumDistance(aspect,fov){const v=THREE.MathUtils.degToRad(fov)/2,h=Math.atan(Math.tan(v)*aspect);return Math.max(3.3,1.04/Math.sin(Math.min(v,h))/.78);}
 const enter=enterCar77;enterCar77=function(){const was=car77?.riding,previous={yaw:gameCam.yaw,pitch:gameCam.pitch,distance:gameCam.distance};const result=enter();if(!was&&car77?.riding){walking=previous;gameCam.yaw=car77.g.rotation.y+Math.PI+.25;gameCam.pitch=.43;gameCam.distance=minimumDistance(camera.aspect,camera.fov);gameCam.ready=false;}return result;};
 const exit=exitCar77;exitCar77=function(){const result=exit();if(!car77?.riding&&walking){Object.assign(gameCam,walking,{ready:false});walking=null;activeCar=null;}return result;};
 const before=tickGameplayCamera;tickGameplayCamera=function(dt){
  const c=car77;if(!c?.riding||roadsterControls203.viewIndex!==0||photo.active){lastOutside=false;before(dt);return;}
  $('cameraTools').style.display='none';if(!gameplayActive())return;
  const target=c.g.position.clone().add(V(0,.34,0)),minimum=minimumDistance(camera.aspect,camera.fov);
  gameCam.distance=Math.max(minimum,Number.isFinite(gameCam.distance)?gameCam.distance:minimum);
  const distance=gameCam.distance,pitch=THREE.MathUtils.clamp(gameCam.pitch,.30,1.2),solids=wallSolids();
  function candidate(yaw,elevation){const direction=V(Math.sin(yaw)*Math.cos(elevation),Math.sin(elevation),Math.cos(yaw)*Math.cos(elevation));let available=distance;
   for(const o of solids){if(o.h<.15)continue;const hit=cameraBoxHit(target,direction,distance,o);if(hit!==null)available=Math.min(available,Math.max(.85,hit-.22));}
   return {direction,available};}
  let best=candidate(gameCam.yaw,pitch);
  // Search around obstructions before allowing a wall to push the camera into Pip's face.
  if(best.available<minimum)for(const lift of [pitch,.85,1.15])for(const offset of [0,.4,-.4,.8,-.8,1.4,-1.4,Math.PI]){const next=candidate(gameCam.yaw+offset,lift);if(next.available>best.available)best=next;if(best.available>=minimum)break;}
  const desired=best.direction.clone().multiplyScalar(best.available);
  if(activeCar!==c||!lastOutside||!gameCam.ready)offset.copy(desired);else offset.lerp(desired,1-Math.exp(-dt*9));
  const ray=offset.clone().normalize();let safe=offset.length();for(const o of solids){const hit=cameraBoxHit(target,ray,safe,o);if(hit!==null)safe=Math.min(safe,Math.max(.85,hit-.22));}offset.setLength(safe);gameCam.pos.copy(target).add(offset);
  camera.position.copy(gameCam.pos);camera.lookAt(target);gameCam.ready=true;activeCar=c;lastOutside=true;
 };
 window.camera207={minimumDistance};
})();
