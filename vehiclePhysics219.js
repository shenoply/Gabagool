/* Kinematic bicycle yaw (wheelbase 1.029), bounded lateral acceleration and
   longitudinal forces. Reference: mathworks.com/help/robotics/ref/bicyclekinematics.html */
(function(scope){
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function step(c,input,dt,tune={}){
  dt=clamp(dt,0,.05);const v=c.speed||0,abs=Math.abs(v),sign=Math.sign(v),t=clamp(input.throttle,-1,1);
  c.steer=(c.steer||0)+(clamp(input.steer,-1,1)-(c.steer||0))*(1-Math.exp(-5*dt));
  const braking=t*v<-.015,held=!!c.handbrake||!!input.blocked;
  let a=0;
  if(held||braking)a=-sign*(held?8:5.6)*(tune.brakes||1);
  else if(input.engine)a=t*(t<0?1.8:2.6)*(tune.power||1)*(1-Math.min(.8,abs/(t<0?2.2:7.8))*.65);
  if(!held&&!braking&&abs>.001)a-=sign*(.20+.026*v*v+(c.drifting?.22:0));
  let next=v+a*dt;
  if((held||braking||!t)&&v*next<0)next=0;
  if(braking&&next===0)c.reverseWait219=.3;
  if(c.reverseWait219>0){c.reverseWait219=Math.max(0,c.reverseWait219-dt);if(abs<.01)next=0;}
  c.speed=clamp(next,-2.2,7.8*(tune.topSpeed||1));
  const maxAngle=.42/(1+abs*.13),angle=c.steer*maxAngle;
  c.steeringAngle219=angle;
  const grip=(tune.grip||1)*(c.drifting?.62:1),limit=3.2*grip/Math.max(.6,abs);
  const yawRate=clamp(c.speed*Math.tan(angle)/1.029,-limit,limit);
  return {yawRate,acceleration:a,braking:braking||held};
 }
 scope.vehiclePhysics219={step};if(typeof module!=='undefined')module.exports=scope.vehiclePhysics219;
})(typeof window!=='undefined'?window:globalThis);
