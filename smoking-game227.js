(()=>{
 let smoke=null,actor=null,owner=null,wasCar=false,headset=null,headsetOwner=null;
 function dispose(){if(car77?.driver225)car77.driver225.angle=null;if(smoke){smoke.stop();smoke.g.parent?.remove(smoke.g);smoke.g.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}smoke=null;actor=owner=null;}
 function toggle(){if(smoke?.active){dispose();return;}if(!rat?.userData.pipBones||!gameplayActive()||rat.userData.air||rat.userData.swim66)return sayToast('Stand still or park first.');if(car77?.riding&&Math.abs(car77.speed)>.08)return sayToast('Park to use the lighter.');smoke=createPipSmoke227(THREE,root);actor=rat;owner=root;wasCar=!!car77?.riding;smoke.start();sayToast('Pip takes out his cigarette and lighter.');}
 function valid(){if(smoke&&(owner!==root||actor!==rat||wasCar!==!!car77?.riding||rat.userData.air||rat.userData.swim66))dispose();return !!smoke?.active;}
 function poseCar(d,dt){if(valid()&&wasCar)smoke.pose(d.study.model,d.study.bones,car77.g,dt,true);}
 const make=makeRat;makeRat=function(){const g=make(),animate=g.animate;g.animate=function(...args){animate(...args);if(g===rat&&valid()&&!wasCar)smoke.pose(g,g.userData.pipBones,g,args[0]||1/60);};return g;};
 const tick=tickWorld38;tickWorld38=function(dt){tick(dt);valid();if(smoke)smoke.g.visible=gameplayActive()&&!photo.active;
  const playing=!!home.music227?.headphones&&!!home.music227?.wear,driver=car77?.riding&&car77.driver225&&!cockpit223.entering?car77.driver225.study:null,b=driver?.bones||rat?.userData.pipBones;
  if(headsetOwner!==root){headset?.parent?.remove(headset);headset=null;headsetOwner=root;}if(playing&&b?.Head){if(!headset){headset=createPipHeadphones227(THREE);root.add(headset);}rat.updateWorldMatrix(true,true);driver?.model.updateWorldMatrix(true,true);const V=()=>new THREE.Vector3(),head=b.Head.getWorldPosition(V()),forward=(b.headfront||b.Head).getWorldPosition(V()).sub(head).normalize(),right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),forward).normalize(),up=new THREE.Vector3().crossVectors(forward,right);headset.position.copy(root.worldToLocal(head.addScaledVector(up,.022).addScaledVector(forward,-.008)));headset.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,forward));headset.visible=!car77?.riding||roadsterControls203.viewIndex===0;}else if(headset)headset.visible=false;
 };
 window.pipSmoke205={toggle,dispose,pose(){},get state(){return valid()?smoke:null;}};window.smokingGame227={poseCar,get active(){return valid()&&wasCar;}};
})();
