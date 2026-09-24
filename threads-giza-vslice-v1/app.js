
const h = React.createElement;
const {useEffect,useMemo,useRef,useState} = React;

const ASSETS = {
  seller:"https://gcdn.picsart.com/cloud-storage/5cea8ab5-f185-4d2d-9314-cf570394b9bc.jpg",
  samira:"https://gcdn.picsart.com/cloud-storage/2071022e-8301-40a5-8248-2d230729d835.jpg",
  yusuf:"https://gcdn.picsart.com/cloud-storage/0f7e1602-3213-47dc-b324-cfa112d9bf44.jpg",
  mariam:"https://gcdn.picsart.com/cloud-storage/a32d508e-957c-4b56-b07e-d4d1116b8afc.jpg",
  narrator:"https://gcdn.picsart.com/editing-temp/9cd8ee4c-5e01-4641-8485-cb6da8c41b39.mpeg",
  music:"https://gcdn.picsart.com/editing-temp/4df84a5e-6382-42c4-9dd4-7ae2fce5675d.mp3",
  samiraVoice:"https://gcdn.picsart.com/cloud-storage/f555bedf-61a8-415b-af2c-b5214ada3b2d.wav",
  yusufVoice:"https://gcdn.picsart.com/cloud-storage/c7e8b606-2706-4a7d-bf84-c8b6643b4d4b.wav"
};

const RUGS = [
  {id:"desert",name:"Desert Star",origin:"Anatolia",material:"Wool",age:"1920s",condition:"Good",size:"Medium",colour:"Faded crimson",rarity:"Uncommon",prov:"Likely",cost:42,min:85,max:118,ask:112,traits:["balanced","restrained","warm"],desc:"A geometric wool rug with disciplined colour and a calm central medallion.",img:"https://gcdn.picsart.com/cloud-storage/d9e05209-1242-4384-bf5d-204f107368cf.jpg"},
  {id:"medina",name:"Red Medina",origin:"Egypt",material:"Wool",age:"c.1915",condition:"Fair",size:"Medium",colour:"Deep red",rarity:"Common",prov:"Likely",cost:31,min:62,max:86,ask:82,traits:["bold","durable"],desc:"Dense red field, practical pile and visible wear along one edge.",img:"https://gcdn.picsart.com/cloud-storage/83b23e6b-d725-4c5a-9ec8-4d58e20191cb.jpg"},
  {id:"golden",name:"Golden Palm",origin:"Egypt",material:"Wool",age:"c.1920",condition:"Good",size:"Small",colour:"Gold",rarity:"Uncommon",prov:"Uncertain",cost:36,min:72,max:104,ask:98,traits:["bright","decorative"],desc:"Warm gold ground with palm-inspired motifs; attractive but its workshop history is uncertain.",img:"https://gcdn.picsart.com/cloud-storage/a412a450-4e30-43d0-bb50-891cabb6b0a7.jpg"},
  {id:"cedar",name:"Cedar Caravan",origin:"Levant",material:"Wool",age:"c.1905",condition:"Worn",size:"Large",colour:"Earth",rarity:"Rare",prov:"Disputed",cost:27,min:55,max:120,ask:105,traits:["aged","character"],desc:"A large travel-worn rug with repaired fringe and disputed caravan provenance.",img:"https://gcdn.picsart.com/cloud-storage/517ebfe3-ea2f-4bab-a5ad-33a0bb532f7e.jpg"},
  {id:"damascus",name:"Damascus Rose",origin:"Syria",material:"Silk blend",age:"c.1890",condition:"Very Good",size:"Small",colour:"Rose",rarity:"Rare",prov:"Likely",cost:72,min:145,max:190,ask:178,traits:["refined","rare","delicate"],desc:"A refined rose-toned piece with unusually fine detailing and a delicate handle.",img:"https://gcdn.picsart.com/cloud-storage/eddf7d20-a8ad-4c33-b01f-6e2d69dae150.jpg"},
  {id:"cairo",name:"Cairo Garden",origin:"Egypt",material:"Wool",age:"c.1910",condition:"Good",size:"Medium",colour:"Indigo",rarity:"Uncommon",prov:"Documented",cost:48,min:92,max:132,ask:126,traits:["cool","technical","documented"],desc:"Documented Cairene workshop piece with cool indigo accents and even weave.",img:"https://gcdn.picsart.com/cloud-storage/16a794ef-5ab7-4a6e-95fd-622e26753be5.jpg"}
];

const BUYERS = {
  samira:{id:"samira",name:"Samira",img:ASSETS.samira,voice:ASSETS.samiraVoice,opening:"I am furnishing a receiving room. I want something beautiful, but not something that announces its price before its taste.",room:"A room for family and guests. Warm, elegant, restrained. Nothing loud.",budget:"I care more about choosing well than spending cheaply, but I dislike being pushed.",counter:92},
  yusuf:{id:"yusuf",name:"Yusuf",img:ASSETS.yusuf,voice:ASSETS.yusufVoice,opening:"I run rooms for travellers. I need something that survives shoes, dust and cleaning.",room:"A hotel sitting room. Many feet. No fragile showpiece.",budget:"If it cannot earn its place, it is too expensive.",counter:76},
  mariam:{id:"mariam",name:"Mariam",img:ASSETS.mariam,voice:null,opening:"We have just moved into our first home. I want the room to feel settled, not expensive.",room:"A small sitting room. Morning light, pale walls, family around it.",budget:"We are careful with money. I would rather buy one thing we keep for years.",counter:84}
};

const SAVE_KEY = "threads-fortune-giza-v1";
const INITIAL = {
  version:1,cash:120,reputation:0,day:1,screen:"opening",tutorialDone:false,buyerId:"samira",
  inventory:["desert","medina","golden"],
  relationships:{
    samira:{visits:0,purchases:0,spent:0,affinity:0,lastRug:null,tier:"New"},
    yusuf:{visits:0,purchases:0,spent:0,affinity:0,lastRug:null,tier:"New"},
    mariam:{visits:0,purchases:0,spent:0,affinity:0,lastRug:null,tier:"New"}
  },
  ledger:[{id:1,day:1,label:"Opening cash",amount:120,type:"opening"}],
  supplierTrust:0,restored:{},
  audio:{dialogue:true,music:true,sfx:true,ambience:true}
};

function loadGame(){
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(s && s.version===1) return Object.assign({},INITIAL,s,{audio:Object.assign({},INITIAL.audio,s.audio||{})});
  }catch(e){}
  return INITIAL;
}
function rug(id){return RUGS.find(function(r){return r.id===id})}
function money(n){return Math.round(n)+" pt"}
function useGame(){
  const pair=useState(loadGame);
  const g=pair[0],setG=pair[1];
  useEffect(function(){localStorage.setItem(SAVE_KEY,JSON.stringify(g))},[g]);
  const patch=function(p){setG(function(x){return typeof p==="function"?p(x):Object.assign({},x,p)})};
  return [g,patch];
}

function Opening(props){
  const g=props.g,patch=props.patch;
  const playingState=useState(false),playing=playingState[0],setPlaying=playingState[1];
  const capState=useState("Giza, 1925."),caption=capState[0],setCaption=capState[1];
  const nar=useRef(null),mus=useRef(null),timer=useRef(null);
  function stop(){
    [nar.current,mus.current].forEach(function(a){if(a){a.pause();a.currentTime=0}});
    if(timer.current) clearInterval(timer.current);
  }
  useEffect(function(){return stop},[]);
  function finish(){stop();setPlaying(false);patch({screen:"gate"})}
  function start(){
    setPlaying(true);
    if(g.audio.dialogue && nar.current) nar.current.play().catch(function(){});
    if(g.audio.music && mus.current){mus.current.volume=.2;mus.current.play().catch(function(){})}
    const lines=[
      "Giza, 1925.",
      "A man begins with a borrowed corner of the bazaar, three rugs, a cat, and barely enough money to survive.",
      "Every rug has a history. Every customer wants something different.",
      "Profit becomes tomorrow's stock.",
      "Reputation opens roads to other cities."
    ];
    let i=0;setCaption(lines[0]);
    timer.current=setInterval(function(){i+=1;if(i<lines.length)setCaption(lines[i]);else finish()},5500);
  }
  return h("div",{className:"opening-shell"},
    h("audio",{ref:nar,src:ASSETS.narrator,preload:"auto"}),
    h("audio",{ref:mus,src:ASSETS.music,preload:"auto",loop:true}),
    h("div",{className:"opening-art "+(playing?"playing":"")},
      h("div",{className:"sun-disc"}),h("div",{className:"pyramid p1"}),h("div",{className:"pyramid p2"}),h("div",{className:"bazaar-sil"}),h("div",{className:"dust"})
    ),
    h("div",{className:"opening-vignette"}),
    h("div",{className:"opening-copy"},h("div",{className:"eyebrow"},"A merchant story"),h("h1",null,"Threads of Fortune"),h("p",null,playing?caption:"Giza · 1925")),
    !playing?h("button",{className:"primary opening-btn",onClick:start},"PLAY OPENING"):h("button",{className:"skip",onClick:finish},"Skip")
  );
}

function Gate(props){
  return h("div",{className:"day-gate"},
    h("div",{className:"gate-art"},h("div",{className:"pyramid p1"}),h("div",{className:"pyramid p2"}),h("div",{className:"dust"})),
    h("div",{className:"gate-card"},
      h("div",{className:"eyebrow"},"10 March 1925 · Giza"),
      h("h1",null,"DAY ONE"),
      h("p",null,"A borrowed corner. Three rugs. One chance to begin."),
      h("button",{className:"primary",onClick:function(){props.patch({screen:"stall",buyerId:"samira"})}},"BEGIN DAY ONE")
    )
  );
}

function Settings(props){
  const g=props.g,patch=props.patch;
  function toggle(k){
    patch(function(x){
      const a=Object.assign({},x.audio);
      a[k]=!a[k];
      return Object.assign({},x,{audio:a});
    });
  }
  return h("div",{className:"settings"},
    h("h3",null,"Audio"),
    ["dialogue","music","sfx","ambience"].map(function(k){
      return h("label",{key:k},h("span",null,k.charAt(0).toUpperCase()+k.slice(1)),h("input",{type:"checkbox",checked:g.audio[k],onChange:function(){toggle(k)}}));
    }),
    h("button",{className:"primary",onClick:props.close},"Done")
  );
}

function HUD(props){
  const g=props.g;
  return h("div",{className:"hud"},
    h("div",null,h("b",null,"Giza"),h("span",null,"1925 · Day "+g.day)),
    h("div",{className:"hud-stat"},h("b",null,String(g.cash)),h("span",null,"Piastres")),
    h("div",{className:"hud-stat"},h("b",null,String(g.reputation)),h("span",null,"Reputation")),
    h("button",{className:"gear",onClick:props.openSettings},"⚙")
  );
}

function Meter(props){
  return h("label",null,props.label,h("i",{style:{width:Math.max(0,Math.min(100,props.v))+"%"}}));
}

function Encounter(props){
  const g=props.g,patch=props.patch;
  const buyer=BUYERS[g.buyerId]||BUYERS.samira;
  const tutorial=!g.tutorialDone && buyer.id==="samira";
  const stageS=useState("discovery"),stage=stageS[0],setStage=stageS[1];
  const intS=useState(45),interest=intS[0],setInterest=intS[1];
  const trustS=useState(48),trust=trustS[0],setTrust=trustS[1];
  const patS=useState(82),patience=patS[0],setPatience=patS[1];
  const selS=useState(null),selected=selS[0],setSelected=selS[1];
  const sellS=useState("Good morning. Take your time."),sellerLine=sellS[0],setSellerLine=sellS[1];
  const buyS=useState(buyer.opening),buyerLine=buyS[0],setBuyerLine=buyS[1];
  const tutS=useState(tutorial?1:0),tutorialStep=tutS[0],setTutorialStep=tutS[1];
  const offS=useState(null),offer=offS[0],setOffer=offS[1];
  const voice=useRef(null);

  useEffect(function(){
    setStage("discovery");setSelected(null);setOffer(null);setBuyerLine(buyer.opening);setSellerLine("Good morning. Take your time.");setTutorialStep(tutorial?1:0);
    patch(function(x){
      const rel=Object.assign({},x.relationships[buyer.id]);
      rel.visits=(rel.visits||0)+1;
      return Object.assign({},x,{relationships:Object.assign({},x.relationships,{[buyer.id]:rel})});
    });
    if(g.audio.dialogue && buyer.voice){voice.current=new Audio(buyer.voice);voice.current.play().catch(function(){})}
    return function(){if(voice.current) voice.current.pause()};
  },[buyer.id]);

  const owned=g.inventory.map(rug).filter(Boolean).slice(0,3);
  let coach=stage.charAt(0).toUpperCase()+stage.slice(1);
  if(tutorial){
    if(tutorialStep===1) coach="Start with the buyer, not the rug. Ask about the room.";
    else if(tutorialStep===2) coach="Now choose a rug that fits what she told you. Present Desert Star.";
    else if(tutorialStep===3) coach="Look closely before you speak. Inspect the rug.";
    else if(tutorialStep===4) coach="Samira values taste and story more than technical boasting.";
    else if(tutorialStep===5) coach="Negotiate without making the room feel like an auction.";
  }

  function askRoom(){
    setSellerLine("Tell me about the room you are furnishing.");
    setBuyerLine(buyer.room);setInterest(function(v){return v+6});setTrust(function(v){return v+5});setStage("qualification");
    if(tutorialStep===1)setTutorialStep(2);
  }
  function askBudget(){
    setSellerLine("What figure did you have in mind?");
    setBuyerLine(buyer.budget);setPatience(function(v){return v-(buyer.id==="samira"?10:3)});setTrust(function(v){return v-(buyer.id==="samira"?4:0)});setStage("qualification");
  }
  function choose(id){
    if(tutorial && tutorialStep===2 && id!=="desert"){
      setBuyerLine("Beautiful, but stronger than what I described.");setInterest(function(v){return v-6});return;
    }
    setSelected(id);
    const r=rug(id);
    setSellerLine("Let me put this one where the light catches it.");
    if(buyer.id==="samira" && id==="desert") setBuyerLine("The colours are quieter than I expected. That is good.");
    else if(buyer.id==="yusuf" && r.traits.indexOf("durable")>=0) setBuyerLine("This feels practical. Tell me how it wears.");
    else setBuyerLine("Let me see it properly.");
    setStage("presentation");
    if(tutorialStep===2 && id==="desert") setTutorialStep(3);
  }
  function inspect(){
    if(!selected)return;
    props.openInspect(selected,function(){if(tutorialStep===3)setTutorialStep(4)});
  }
  function story(){
    if(!selected)return;
    setSellerLine("Its strength is not noise. The pattern rewards a second look, and its history is something I can defend without invention.");
    setTrust(function(v){return v+13});setInterest(function(v){return v+(buyer.id==="samira"?14:6)});setPatience(function(v){return v-3});
    setBuyerLine(buyer.id==="samira"?"That is exactly how I prefer to buy—without theatre. What are you asking?":"And the price?");
    setStage("bargaining");if(tutorialStep===4)setTutorialStep(5);
  }
  function craft(){
    setSellerLine("Look at the weave density and how evenly the pile has worn.");
    setTrust(function(v){return v+8});setInterest(function(v){return v+(buyer.id==="yusuf"?12:4)});setPatience(function(v){return v-4});
    setBuyerLine(buyer.id==="yusuf"?"That matters to me. Give me your figure.":"Useful. But I am choosing for a room, not a workshop.");setStage("bargaining");
  }
  function homePitch(){
    setSellerLine("Imagine it after years of mornings and family visits—the room settling around it.");
    setInterest(function(v){return v+(buyer.id==="mariam"?14:5)});setTrust(function(v){return v+8});
    setBuyerLine(buyer.id==="mariam"?"That is what I want. Something that becomes ours.":"Go on.");setStage("bargaining");
  }
  function completeSale(n){
    const r=rug(selected);
    setBuyerLine("Agreed. Wrap it carefully.");setSellerLine("You have chosen well.");setStage("close");
    setTimeout(function(){
      patch(function(x){
        const rel=Object.assign({},x.relationships[buyer.id]);
        rel.purchases+=1;rel.spent+=n;rel.affinity+=8;rel.lastRug=r.name;rel.tier=rel.purchases>=2?"Regular":"Familiar";
        return Object.assign({},x,{
          cash:x.cash+n,reputation:x.reputation+2,inventory:x.inventory.filter(function(id){return id!==selected}),
          tutorialDone:x.tutorialDone || buyer.id==="samira",
          ledger:x.ledger.concat([{id:Date.now(),day:x.day,label:"Sold "+r.name+" to "+buyer.name,amount:n,type:"sale"}]),
          relationships:Object.assign({},x.relationships,{[buyer.id]:rel})
        });
      });
    },500);
  }
  function walk(){
    setBuyerLine("Not today. Thank you for showing me.");setSellerLine("Of course. My door remains open.");setStage("walk");
  }
  function makeOffer(n,kind){
    if(!selected)return;
    setOffer(n);
    setSellerLine(kind==="hold"?"I would rather keep it than misprice it. "+money(n)+" is fair.":"I can make it "+money(n)+".");
    const threshold=buyer.id==="samira"?94:(buyer.id==="yusuf"?72:82);
    const score=interest+trust+patience/2-(n-threshold)*1.2;
    if(score>125) completeSale(n);
    else if(score>98){setBuyerLine("I could do "+money(Math.min(n-6,buyer.counter))+".");setPatience(function(v){return v-8});setInterest(function(v){return v+2})}
    else{setBuyerLine("No. That is more than the rug means to me.");setPatience(function(v){return v-18});if(patience<35)walk()}
  }
  function acceptCounter(){completeSale(Math.min(offer-6,buyer.counter))}
  function nextBuyer(){
    const ids=["samira","yusuf","mariam"],i=ids.indexOf(buyer.id);
    patch({buyerId:ids[(i+1)%ids.length]});
  }

  const price=selected?rug(selected).ask:0;
  let actions=[];
  if(stage==="discovery" || stage==="qualification"){
    actions=[["◉","Ask about room",askRoom,tutorial&&tutorialStep===1],["¤","Ask budget",askBudget,false],["⌁","Invite to browse",function(){setBuyerLine("Show me what you think fits.");setStage("presentation")},false]];
  }else if(stage==="presentation"){
    actions=[["✦","Tell its story",story,tutorial&&tutorialStep===4],["▦","Explain craft",craft,false],["⌂","Place in the home",homePitch,false],["⌕","Inspect rug",inspect,tutorial&&tutorialStep===3]];
  }else if(stage==="bargaining"){
    actions=[["£","Ask "+money(price),function(){makeOffer(price,"ask")},false],["↘","Concede "+money(Math.max(price-12,1)),function(){makeOffer(Math.max(price-12,1),"concede")},false],["◆","Hold firm",function(){makeOffer(price,"hold")},false],offer?["✓","Accept counter",acceptCounter,false]:["×","Let buyer walk",walk,false]];
  }else{
    actions=[["→","Next customer",nextBuyer,false],["▤","Open ledger",function(){props.setTab("ledger")},false],["▣","Inventory",function(){props.setTab("inventory")},false]];
  }

  return h("div",{className:"encounter"},
    h(HUD,{g:g,openSettings:props.openSettings}),
    h("div",{className:"scene"},
      h("div",{className:"canopy"}),h("div",{className:"lantern l1"},"◈"),h("div",{className:"lantern l2"},"◈"),
      h("div",{className:"pyramids"},h("i"),h("i")),h("div",{className:"crowd"}),
      h("img",{className:"character seller",src:ASSETS.seller,alt:"Merchant"}),
      h("img",{className:"character buyer",src:buyer.img,alt:buyer.name}),
      h("div",{className:"seller-bubble"},h("b",null,"Hassan"),sellerLine),
      h("div",{className:"buyer-bubble"},h("b",null,buyer.name),buyerLine),
      selected?h("div",{className:"rug-presented"},h("img",{src:rug(selected).img,alt:rug(selected).name})):null,
      h("div",{className:"cat"},h("span",null,"🐈"),h("b",null,"Saffron")),
      h("div",{className:"meters"},h(Meter,{label:"Interest",v:interest}),h(Meter,{label:"Trust",v:trust}),h(Meter,{label:"Patience",v:patience})),
      h("div",{className:"coach"},h("span",null,"◆"),coach)
    ),
    h("div",{className:"rug-strip"},
      owned.map(function(r){return h("button",{key:r.id,className:"rug-card "+(selected===r.id?"active ":"")+(tutorial&&tutorialStep===2&&r.id==="desert"?"pulse":""),onClick:function(){choose(r.id)}},
        h("img",{src:r.img,alt:r.name}),h("span",null,h("b",null,r.name),h("small",null,r.origin+" · "+r.material))
      )}),
      h("button",{className:"inspect-mini "+(tutorial&&tutorialStep===3?"pulse":""),disabled:!selected,onClick:inspect},"⌕",h("small",null,"Inspect"))
    ),
    h("div",{className:"actions"},
      actions.slice(0,4).map(function(a,i){return h("button",{key:i,className:a[3]?"pulse":"",onClick:a[2]},h("b",null,a[0]),h("span",null,a[1]))})
    ),
    h("div",{className:"bottom-nav"},
      h("button",{className:"active"},"◉",h("span",null,"Stall")),
      h("button",{onClick:function(){props.setTab("inventory")}},"▣",h("span",null,"Inventory")),
      h("button",{onClick:function(){props.setTab("supplier")}},"♜",h("span",null,"Rashid")),
      h("button",{onClick:function(){props.setTab("ledger")}},"▤",h("span",null,"Ledger"))
    )
  );
}

function RugViewer(props){
  const r=rug(props.id);
  const zoomS=useState(1),zoom=zoomS[0],setZoom=zoomS[1];
  const rotS=useState(0),rot=rotS[0],setRot=rotS[1];
  const revS=useState(false),rev=revS[0],setRev=revS[1];
  const posS=useState({x:0,y:0}),pos=posS[0],setPos=posS[1];
  const drag=useRef(null);
  useEffect(function(){if(props.onInspected)props.onInspected()},[]);
  function start(e){const p=e.touches?e.touches[0]:e;drag.current={x:p.clientX-pos.x,y:p.clientY-pos.y}}
  function move(e){if(!drag.current)return;const p=e.touches?e.touches[0]:e;setPos({x:p.clientX-drag.current.x,y:p.clientY-drag.current.y})}
  function end(){drag.current=null}
  return h("div",{className:"modal-backdrop"},
    h("div",{className:"panel rug-viewer"},
      h("button",{className:"x",onClick:props.onClose},"×"),
      h("div",{className:"rv-head"},h("div",null,h("div",{className:"eyebrow"},r.origin+" · "+r.age),h("h2",null,r.name)),h("div",{className:"pill"},r.condition+" · "+r.rarity)),
      h("div",{className:"rug-stage",onMouseDown:start,onMouseMove:move,onMouseUp:end,onMouseLeave:end,onTouchStart:start,onTouchMove:move,onTouchEnd:end},
        h("img",{className:rev?"reverse":"",draggable:false,src:r.img,alt:r.name,style:{transform:"translate("+pos.x+"px,"+pos.y+"px) scale("+zoom+") rotate("+rot+"deg)"}}),
        rev?h("div",{className:"reverse-label"},"Simulated reverse · not a photograph"):null
      ),
      h("div",{className:"viewer-tools"},
        h("button",{onClick:function(){setZoom(Math.min(3,zoom+.25))}},"＋"),
        h("button",{onClick:function(){setZoom(Math.max(1,zoom-.25))}},"−"),
        h("button",{onClick:function(){setRot((rot+90)%360)}},"↻ Rotate"),
        h("button",{onClick:function(){setRev(!rev)}},rev?"Front":"Simulated reverse"),
        h("span",null,Math.round(zoom*100)+"%")
      ),
      h("div",{className:"rug-facts"},
        h("div",null,h("b",null,r.material),h("span",null,"Material")),
        h("div",null,h("b",null,r.prov),h("span",null,"Provenance")),
        h("div",null,h("b",null,money(r.min)+"–"+money(r.max)),h("span",null,"Market band"))
      ),
      h("p",{className:"desc"},r.desc+" Fringe: "+(r.condition==="Worn"?"uneven and repaired":"sound")+". Weave: "+(r.material.indexOf("Silk")>=0?"fine":"medium-fine")+".")
    )
  );
}

function ScreenShell(props){
  return h("div",{className:"game-shell"},
    h("div",{className:"screen scroll-screen"},props.children),
    h("div",{className:"bottom-nav"},
      h("button",{onClick:function(){props.setTab("stall")}},"◉",h("span",null,"Stall")),
      h("button",{onClick:function(){props.setTab("inventory")}},"▣",h("span",null,"Inventory")),
      h("button",{onClick:function(){props.setTab("supplier")}},"♜",h("span",null,"Rashid")),
      h("button",{onClick:function(){props.setTab("ledger")}},"▤",h("span",null,"Ledger"))
    )
  );
}

function Inventory(props){
  const g=props.g,patch=props.patch;
  function restore(id){
    const r=rug(id);if(g.cash<12)return;
    patch(function(x){
      const rest=Object.assign({},x.restored);rest[id]=true;
      return Object.assign({},x,{cash:x.cash-12,restored:rest,ledger:x.ledger.concat([{id:Date.now(),day:x.day,label:"Restored "+r.name,amount:-12,type:"restoration"}])});
    });
  }
  return h(ScreenShell,{setTab:props.setTab},
    h("div",{className:"screen-head"},h("div",null,h("div",{className:"eyebrow"},"Your stock"),h("h2",null,"Inventory"),h("p",null,g.inventory.length+" rugs · "+money(g.cash)+" cash")),h("button",{onClick:function(){props.setTab("stall")}},"Back to stall")),
    h("div",{className:"inventory-list"},g.inventory.map(function(id){
      const r=rug(id);
      return h("div",{className:"inv",key:id},
        h("img",{src:r.img,alt:r.name}),
        h("div",null,h("h3",null,r.name),h("p",null,r.origin+" · "+r.material+" · "+(g.restored[id]?"Restored":r.condition)),h("small",null,"Market "+money(r.min)+"–"+money(r.max)+" · Provenance "+r.prov)),
        h("div",{className:"inv-actions"},h("button",{onClick:function(){props.openInspect(id)}},"Inspect"),r.condition==="Worn"&&!g.restored[id]?h("button",{disabled:g.cash<12,onClick:function(){restore(id)}},"Restore 12pt"):null)
      );
    }))
  );
}

function Supplier(props){
  const g=props.g,patch=props.patch;
  const pool=useMemo(function(){
    return RUGS.filter(function(r){return g.inventory.indexOf(r.id)<0}).sort(function(a,b){return ((a.id.charCodeAt(0)+g.day)%7)-((b.id.charCodeAt(0)+g.day)%7)}).slice(0,4);
  },[g.day,g.inventory.join(",")]);
  function buy(id){
    const r=rug(id),cost=Math.max(1,r.cost-(g.supplierTrust>=3?4:0));if(g.cash<cost)return;
    patch(function(x){return Object.assign({},x,{cash:x.cash-cost,inventory:x.inventory.concat([id]),supplierTrust:x.supplierTrust+1,ledger:x.ledger.concat([{id:Date.now(),day:x.day,label:"Bought "+r.name+" from Rashid",amount:-cost,type:"purchase"}])})});
  }
  return h(ScreenShell,{setTab:props.setTab},
    h("div",{className:"screen-head"},h("div",null,h("div",{className:"eyebrow"},"Supplier · Giza"),h("h2",null,"Uncle Rashid"),h("p",null,"“Good rugs disappear faster than excuses.” · Trust "+g.supplierTrust)),h("button",{onClick:function(){props.setTab("stall")}},"Back")),
    h("div",{className:"supplier-grid"},pool.map(function(r){
      const c=Math.max(1,r.cost-(g.supplierTrust>=3?4:0));
      return h("div",{className:"supplier-item",key:r.id},h("img",{src:r.img,alt:r.name}),h("div",null,h("h3",null,r.name),h("p",null,r.condition+" · "+r.material+" · "+r.rarity),h("small",null,r.id==="cedar"?"Cheap because the edge needs work. Might reward patience.":"I bought it well. You can do the same.")),h("button",{disabled:g.cash<c,onClick:function(){buy(r.id)}},"Buy ",money(c)));
    })),
    h("div",{className:"note"},"Stock rotates by day. At trust 3, Rashid begins giving a small relationship discount.")
  );
}

function Ledger(props){
  const g=props.g;
  const sales=g.ledger.filter(function(e){return e.type==="sale"}).reduce(function(a,e){return a+e.amount},0);
  const costs=-g.ledger.filter(function(e){return e.type==="purchase"||e.type==="restoration"}).reduce(function(a,e){return a+e.amount},0);
  return h(ScreenShell,{setTab:props.setTab},
    h("div",{className:"screen-head"},h("div",null,h("div",{className:"eyebrow"},"Business book"),h("h2",null,"Ledger"),h("p",null,"Every coin should explain itself.")),h("button",{onClick:function(){props.setTab("stall")}},"Back")),
    h("div",{className:"ledger-summary"},h("div",null,h("b",null,g.cash),h("span",null,"Cash")),h("div",null,h("b",null,sales),h("span",null,"Sales")),h("div",null,h("b",null,costs),h("span",null,"Stock / repair"))),
    h("div",{className:"ledger-paper"},g.ledger.slice().reverse().map(function(e){return h("div",{className:"entry",key:e.id},h("span",null,"Day "+e.day),h("b",null,e.label),h("strong",{className:e.amount>=0?"plus":"minus"},(e.amount>=0?"+":"")+money(e.amount)))}))
  );
}

function App(){
  const gp=useGame(),g=gp[0],patch=gp[1];
  const tabS=useState("stall"),tab=tabS[0],setTab=tabS[1];
  const inS=useState(null),inspect=inS[0],setInspect=inS[1];
  const cbS=useState(null),inspectedCb=cbS[0],setInspectedCb=cbS[1];
  const stS=useState(false),settings=stS[0],setSettings=stS[1];
  function openInspect(id,cb){setInspect(id);setInspectedCb(function(){return cb||null})}
  if(g.screen==="opening") return h(Opening,{g:g,patch:patch});
  if(g.screen==="gate") return h(Gate,{patch:patch});
  let main;
  if(tab==="inventory") main=h(Inventory,{g:g,patch:patch,setTab:setTab,openInspect:openInspect});
  else if(tab==="supplier") main=h(Supplier,{g:g,patch:patch,setTab:setTab});
  else if(tab==="ledger") main=h(Ledger,{g:g,setTab:setTab});
  else main=h(Encounter,{g:g,patch:patch,openInspect:openInspect,setTab:setTab,openSettings:function(){setSettings(true)}});
  return h("div",{className:"game-shell"},
    main,
    settings?h(Settings,{g:g,patch:patch,close:function(){setSettings(false)}}):null,
    inspect?h(RugViewer,{id:inspect,onInspected:inspectedCb,onClose:function(){setInspect(null);setInspectedCb(null)}}):null
  );
}

ReactDOM.render(h(App),document.getElementById("root"));
