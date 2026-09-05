(()=>{
if(window.__MVA_DUNGEON_V131)return;window.__MVA_DUNGEON_V131=true;

let dungeonRoom=1,dungeonDepth=1,dungeonEncounter=false,dungeonCleared=false;
let dungeonTheme={name:'Sảnh Bị Lãng Quên',base:1,accent:'#68e7db'};

const ROOMS=[
 {name:'Sảnh Bị Lãng Quên',base:1,accent:'#68e7db',pack:['s','s','gk']},
 {name:'Hang Nấm Phát Sáng',base:1,accent:'#71f59a',pack:['s','s','gm']},
 {name:'Hành Lang Xương',base:1,accent:'#d6e6d9',pack:['gk','gk','ga']},
 {name:'Đường Hầm Goblin',base:2,accent:'#ffb35b',pack:['gk','ga','gm']},
 {name:'Lò Rèn Golem',base:2,accent:'#d8a36c',pack:['gc','s']},
 {name:'Kho Báu Bị Nguyền',base:1,accent:'#b990ff',pack:['gking']}
];
const NAMES={s:['CAVE SLIME','TOXIC SLIME','DARK SLIME'],gk:['SKELETON GUARD','GOBLIN KNIGHT','DUNGEON GUARD'],ga:['BONE ARCHER','GOBLIN ARCHER','CAVE HUNTER'],gm:['CULTIST MAGE','GOBLIN MAGE','RUNE CASTER'],gc:['STONE GOLEM'],gking:['WRAITH WARDEN']};

const mini=document.createElement('div');mini.id='dungeon-mini';mini.style.cssText='position:fixed;right:14px;top:58px;z-index:7;padding:8px 10px;border:1px solid #3d6f7e;background:#06151dcc;color:#dffcff;font:700 11px ui-monospace,monospace;border-radius:8px;min-width:210px;pointer-events:none';document.body.appendChild(mini);
const miniTitle=document.createElement('div'),miniRoom=document.createElement('div'),miniDots=document.createElement('div');
miniRoom.style.marginTop='3px';miniDots.style.cssText='margin-top:5px;letter-spacing:2px;opacity:.8';mini.append(miniTitle,miniRoom,miniDots);
let lastStageText='';

function roomDef(){return ROOMS[(dungeonRoom-1)%ROOMS.length]}
function scale(){return 1+Math.floor((dungeonRoom-1)/6)*.18+(dungeonRoom-1)*.035}
function updateMini(){
 const i=(dungeonRoom-1)%6;
 miniTitle.style.color=dungeonTheme.accent;miniTitle.textContent='HẦM NGỤC · TẦNG '+dungeonDepth;
 miniRoom.textContent='PHÒNG '+dungeonRoom+' · '+dungeonTheme.name;
 miniDots.textContent=Array.from({length:6},(_,j)=>j<i?'◆':j===i?'⬢':'◇').join(' ');
}
function setStageText(){const s='Hầm ngục · Phòng '+dungeonRoom+' · '+dungeonTheme.name;if(s!==lastStageText){lastStageText=s;stageui.textContent=s}}
function spawn(type,x,idx){
 const sc=scale();const m={s:{w:64,h:46,hp:55,xp:12,reward:9},gk:{w:58,h:76,hp:110,xp:20,reward:16},ga:{w:54,h:72,hp:82,xp:20,reward:16},gm:{w:54,h:72,hp:92,xp:24,reward:18},gc:{w:82,h:98,hp:340,xp:80,reward:45},gking:{w:96,h:112,hp:680,xp:160,reward:110}}[type];
 const hp=Math.round(m.hp*sc),names=NAMES[type]||['MONSTER'];
 E.push({type,name:names[idx%names.length],x,y:G-m.h,w:m.w,h:m.h,hp,max:hp,tm:0,hit:0,burn:0,slow:0,k:0,reward:Math.round(m.reward*sc),xp:Math.round(m.xp*sc),summon:0});
}
function startRoom(){
 stage=3;phase=0;boss=0;E=[];B=[];F=[];P.x=82;P.y=G-P.h;P.vx=P.vy=0;P.inv=Math.max(P.inv,45);
 dungeonTheme=roomDef();dungeonEncounter=false;dungeonCleared=false;updateMini();setStageText();
 banner('PHÒNG '+dungeonRoom+' — '+dungeonTheme.name,dungeonTheme.accent);
}
function startRun(){dungeonRoom=1;dungeonDepth=1;startRoom()}
function trigger(){if(dungeonEncounter||dungeonCleared)return;dungeonEncounter=true;dungeonTheme.pack.forEach((type,i)=>spawn(type,600+i*185,i+dungeonRoom));banner(dungeonTheme.pack.length===1?'BOSS ROOM':'PHÁT HIỆN QUÁI VẬT',dungeonTheme.pack.length===1?'#ffcf69':dungeonTheme.accent)}
function nextRoom(){dungeonRoom++;dungeonDepth=1+Math.floor((dungeonRoom-1)/6);P.hp=Math.min(P.max,P.hp+Math.round(P.max*.12));startRoom()}

const oldSt=st;st=function(...a){const r=oldSt(...a);startRun();return r};
const oldHud=hud;hud=function(){oldHud();if(stage===3)setStageText()};
const oldUpd=upd;upd=function(){
 if(stage===3&&on&&!dungeonEncounter&&!dungeonCleared&&P.x>330)trigger();
 oldUpd();
 if(stage===3&&on){
   if(dungeonEncounter&&!dungeonCleared&&E.length===0){dungeonCleared=true;banner('PHÒNG ĐÃ DỌN SẠCH · ĐI TỚI CỔNG →','#8fffd4');P.hp=Math.min(P.max,P.hp+Math.round(P.max*.08))}
   if(dungeonEncounter&&!dungeonCleared)P.x=Math.min(P.x,W-P.w-150);
   if(dungeonCleared&&P.x>W-P.w-115)nextRoom();
 }
};

// Performance fix: do NOT copy a full 1280x720 canvas every skipped frame.
// Physics still runs at RAF speed; dungeon visuals render at 30 FPS by simply retaining the previous canvas frame.
const oldDraw=draw;let renderSkip=0;
function overlayDungeon(){
 X.save();
 if(!dungeonEncounter&&!dungeonCleared){
   X.strokeStyle=dungeonTheme.accent;X.globalAlpha=.26;X.setLineDash([8,8]);X.lineWidth=2;X.beginPath();X.moveTo(335,180);X.lineTo(335,G);X.stroke();X.setLineDash([]);
   X.fillStyle='#e8ffff';X.globalAlpha=.68;X.font='700 13px ui-monospace,monospace';X.fillText('ĐI SÂU HƠN →',245,210);
 }else if(dungeonEncounter&&!dungeonCleared){
   X.fillStyle='rgba(140,35,35,.16)';X.fillRect(W-140,150,14,G-150);X.strokeStyle='#ff745f';X.globalAlpha=.62;X.beginPath();X.moveTo(W-140,160);X.lineTo(W-126,G-8);X.stroke();
 }else if(dungeonCleared){
   const px=W-90,py=G-80,p=7+Math.sin(t*.09)*3;X.globalAlpha=.18;X.fillStyle=dungeonTheme.accent;X.beginPath();X.arc(px,py,42+p,0,7);X.fill();
   X.globalAlpha=.9;X.strokeStyle=dungeonTheme.accent;X.lineWidth=5;X.beginPath();X.ellipse(px,py,24,50,0,0,7);X.stroke();
   X.fillStyle='#eaffff';X.font='700 12px ui-monospace,monospace';X.textAlign='center';X.fillText('PHÒNG TIẾP THEO',px,py-62);
 }
 X.restore();
}
draw=function(){
 if(stage!==3)return oldDraw();
 renderSkip^=1;if(renderSkip)return;
 const save=stage;stage=dungeonTheme.base;oldDraw();stage=save;overlayDungeon();
};

document.documentElement.style.overscrollBehavior='none';
document.body.style.touchAction='none';
const h=document.querySelector('.hint');if(h)h.textContent='A/D · Space double jump · Click combo · 1/2/3 skill · K dash · DUNGEON v1.31';
const oldTag=document.querySelector('[data-dungeon-tag]');if(oldTag)oldTag.remove();
const tag=document.createElement('div');tag.dataset.dungeonTag='1';tag.style.cssText='position:fixed;right:14px;bottom:48px;z-index:11;padding:6px 9px;border:1px solid #4a7c8d;border-radius:8px;background:#06151ddd;color:#9fffe2;font:700 11px ui-monospace,monospace';tag.textContent='DUNGEON v1.31 · PERFORMANCE FIX';document.body.appendChild(tag);
})();