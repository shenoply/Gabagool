const assert=require('assert'),{step}=require('../vehiclePhysics219.js');
function run(hz,seconds,input,tune){const c={speed:0,steer:0};let z=0,yaw=0;for(let i=0;i<hz*seconds;i++){const r=step(c,input,1/hz,tune);z+=c.speed/hz;yaw+=r.yawRate/hz;}return {...c,z,yaw};}
const input={throttle:1,steer:0,engine:true},a=run(30,8,input),b=run(120,8,input);
assert(Math.abs(a.speed-b.speed)<.02&&Math.abs(a.z-b.z)<.25,'Frame-rate dependent motion');
assert(a.speed<7.81&&a.speed>5,'Unbounded or sluggish top speed');
let c={speed:5,steer:0};step(c,{throttle:-1,steer:0,engine:true},1/60);assert(c.speed>4.8,'Instant reverse');
for(let i=0;i<180;i++)step(c,{throttle:-1,steer:0,engine:true},1/60);assert(c.speed<0&&c.speed>=-2.2,'Reverse does not work');
c={speed:4,steer:1};const y=step(c,{throttle:1,steer:1,engine:true},1/60).yawRate;assert(Math.abs(y*c.speed)<=3.3,'Excessive cornering');
c={speed:0,steer:0};for(let i=0;i<100;i++)step(c,{...input,blocked:true},1/60);assert(c.speed===0,'Interlock does not stop acceleration');
c={speed:4,steer:0};for(let i=0;i<60;i++)step(c,{throttle:0,steer:0,engine:true},1/60);assert(c.speed>3,'Coasting stops too abruptly');
console.log('Physics: acceleration, braking/reverse, coasting, cornering, interlock and 30/120Hz consistency passed',a.speed.toFixed(2));
