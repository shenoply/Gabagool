(async()=>{
 const check=(v,m)=>{if(!v)throw Error(m);},step=()=>{for(let i=0;i<5;i++)tickWorld38(.05);};closeModal();sc=null;startScavenge();await new Promise(r=>setTimeout(r,100));step();
 check(tutorial219.chapters.car.length===5,'Car lesson not shortened');check(!tutorial219.chapters.car.some(s=>['carView','outside'].includes(s[0])),'Camera tasks remain');
 workshop231.start(true);check(workshop231.active,'Tool lesson starts');step();check(workshop231.active,'Foot tutorial interrupted tools');
 inv={};rat.position.copy(workshop231.supply.position);step();check(workshop231.supplies(),'Starter tin');check(totalBag()<=bagCapacity(),'Tin overflow');check(workshop231.steps[0].test(),'Supplies step');check(workshop231.advance(),'Advance supplies');closeModal();rat.userData.job67=null;
 check(performCraft('axe230'),'Axe recipe');check(workshop231.steps[1].test(),'Axe progress');check(workshop231.advance(),'Advance axe');const before=totalBag();step();check(!workshop231.supplies(),'Supplies duplicated');check(before===totalBag(),'Repeat tin duplicated inventory');
 workshop231.pause();startHouse();step();check(!!root.userData.homeGarden231,'Missing home surroundings');check(!!scene.fog,'Missing home horizon');check(hs.house.userData.boards230.length===60,'House repairs lost');
 renderer.readRenderTargetPixels=()=>{};openCraftBook();check(document.body.classList.contains('menu-open65'),'Craft lacks modal ownership');check($('modalActions').textContent.includes('guided practice'),'Missing guide in craft');closeModal();check(!document.body.classList.contains('menu-open65'),'HUD not restored');
 report.usability231={carLessonSteps:5,toolPracticeSteps:workshop231.steps.length,starterSuppliesFinite:true,axeCrafted:true,homeGarden:true,craftGuide:true};
})()
