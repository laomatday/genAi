(()=>{
if(window.__MVA_LITE132)return;window.__MVA_LITE132=true;

// Performance-first: remove artificial hit-stop spikes and keep physics at native rAF speed.
try{D.Human.Archer[2]=13;D.Human.Mage[2]=15;D.Spirit.Ifri[2]=16;D.Spirit.Sylph[2]=13;D.Spirit.Gnome[2]=15;D.Angel.base[2]=13}catch{}
const _dmg=dmg;dmg=function(...a){const r=_dmg(...a);stop=Math.min(stop,1);shake=Math.min(shake,2);return r};
const _basic=basic;basic=function(){if(P.atk)return;_basic();if(P.atk>0)P.atk=Math.ceil(P.atk*1.15);if(P.win>0)P.win=Math.max(P.win,28)};

let room=1,depth=1,encounter=false,cleared=false;
let theme={name:'Sảnh Bị Lãng Quên',accent:'#66eadc',pack:['s','s','gk']};
const ROOMS=[
 {name:'Sảnh Bị Lãng Quên',accent:'#66eadc',pack:['s','s','gk']},
 {name:'Hang Nấm Phát Sáng',accent:'#7cf4a6',pack:['s','gm','s']},
 {name:'Hành Lang Xương',accent:'#d9e8df',pack:['gk','ga','gk']},
 {name:'Đường Hầm Goblin',accent:'#ffb25b',pack:['gk','ga','gm']},
 {name:'Lò Rèn Golem',accent:'#d89c65',pack:['gc','s']},
 {name:'Kho Báu Bị Nguyền',accent:'#c090ff',pack:['gking']}
];
const NAMES={s:['CAVE SLIME','TOXIC SLIME','DARK SLIME'],gk:['SKELETON GUARD','GOBLIN KNIGHT','DUNGEON GUARD'],ga:['BONE ARCHER','GOBLIN ARCHER','CAVE HUNTER'],gm:['CULTIST MAGE','GOBLIN MAGE','RUNE CASTER'],gc:['STONE GOLEM'],gking:['WRAITH WARDEN']};

const mini=document.createElement('div');mini.id='dungeonMini132';mini.style.cssText='position:fixed;right:14px;top:58px;z-index:7;padding:7px 9px;border:1px solid #365f6b;background:#06141ccc;color:#dffcff;font:700 11px ui-monospace,monospace;border-radius:8px;pointer-events:none';document.body.appendChild(mini);
function refreshMini(){const i=(room-1)%6;mini.innerHTML='<b style="color:'+theme.accent+'">HẦM NGỤC · TẦNG '+depth+'</b><br>PHÒNG '+room+' · '+theme.name+'<br><span style="opacity:.7;letter-spacing:2px">'+Array.from({length:6},(_,j)=>j<i?'◆':j===i?'⬢':'◇').join(' ')+'</span>'}
function diff(){return 1+(room-1)*.035+(depth-1)*.15}
function spawn(type,x,idx){const sc=diff(),m={s:[64,46,55,12,9],gk:[58,76,110,20,16],ga:[54,72,82,20,16],gm:[54,72,92,24,18],gc:[82,98,340,80,45],gking:[96,112,680,160,110]}[type],hp=Math.round(m[2]*sc),names=NAMES[type]||['MONSTER'];E.push({type,name:names[idx%names.length],x,y:G-m[1],w:m[0],h:m[1],hp,max:hp,tm:0,hit:0,burn:0,slow:0,k:0,reward:Math.round(m[4]*sc),xp:Math.round(m[3]*sc),summon:0})}
function startRoom(){stage=3;phase=0;boss=0;E=[];B=[];F=[];P.x=82;P.y=G-P.h;P.vx=P.vy=0;P.inv=Math.max(P.inv,45);theme=ROOMS[(room-1)%ROOMS.length];encounter=false;cleared=false;refreshMini();banner('PHÒNG '+room+' — '+theme.name,theme.accent)}
function trigger(){if(encounter||cleared)return;encounter=true;theme.pack.forEach((type,i)=>spawn(type,570+i*190,i+room));banner(theme.pack.length===1?'BOSS ROOM':'PHÁT HIỆN QUÁI VẬT',theme.pack.length===1?'#ffd060':theme.accent)}
function nextRoom(){room++;depth=1+Math.floor((room-1)/6);P.hp=Math.min(P.max,P.hp+Math.round(P.max*.12));startRoom()}

let jumpPrev=false,airJump=false;
const _st=st;st=function(...a){const r=_st(...a);room=1;depth=1;jumpPrev=false;airJump=false;startRoom();return r};
const _hud=hud;hud=function(){_hud();if(stage===3)stageui.textContent='Hầm ngục · Phòng '+room+' · '+theme.name};
const _upd=upd;upd=function(){
 if(on){const jump=!!(K.w||K.arrowup||K[' ']);if(jump&&!jumpPrev&&!P.ground&&!airJump){P.vy=-cfg()[1]*.92;airJump=true;F.push({type:'ring',x:P.x+P.w/2,y:P.y+P.h/2,c:'#63ddff',life:10,r:20})}jumpPrev=jump;if(stage===3&&!encounter&&!cleared&&P.x>325)trigger()}
 _upd();
 if(P.ground)airJump=false;
 if(stage===3&&on){if(encounter&&!cleared&&E.length===0){cleared=true;P.hp=Math.min(P.max,P.hp+Math.round(P.max*.08));banner('PHÒNG ĐÃ DỌN SẠCH · ĐI TỚI CỔNG →','#8fffd4')}if(encounter&&!cleared)P.x=Math.min(P.x,W-P.w-150);if(cleared&&P.x>W-P.w-115)nextRoom();if(F.length>36)F.splice(0,F.length-36);if(B.length>36)B.splice(0,B.length-36)}
};

// Add only very cheap dungeon markers on top of the original renderer: no offscreen canvas, no frame copying.
const _draw=draw;draw=function(){_draw();if(stage!==3||!on)return;X.save();if(!encounter&&!cleared){X.fillStyle='#eaffffb8';X.font='700 13px ui-monospace,monospace';X.fillText('ĐI SÂU HƠN →',235,210)}if(encounter&&!cleared){X.fillStyle='#e8564620';X.fillRect(W-140,120,12,G-120)}if(cleared){const px=W-85,py=G-75;X.strokeStyle=theme.accent;X.lineWidth=4;X.beginPath();X.ellipse(px,py,22,48,0,0,7);X.stroke()}X.restore()};

// Mobile controls only on touch-capable devices.
if(('ontouchstart'in window||navigator.maxTouchPoints>0)&&!document.getElementById('liteTouch132')){const z=document.createElement('div');z.id='liteTouch132';z.style.cssText='position:fixed;left:10px;right:10px;bottom:10px;z-index:15;display:flex;justify-content:space-between;pointer-events:none';const mk=t=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='pointer-events:auto;width:56px;height:56px;border-radius:14px;border:1px solid #4f9db2;background:#071925d9;color:#fff;font:700 17px monospace';return b};const l=document.createElement('div'),r=document.createElement('div');l.style.cssText=r.style.cssText='display:flex;gap:8px';const a=mk('◀'),d=mk('▶'),j=mk('▲'),atk=mk('⚔'),s1=mk('1'),s2=mk('2'),s3=mk('3'),ds=mk('K');l.append(a,d,j);r.append(atk,s1,s2,s3,ds);z.append(l,r);document.body.appendChild(z);const bind=(b,k,fn)=>{const on=e=>{e.preventDefault();if(fn)fn();else K[k]=1},off=e=>{e.preventDefault();if(!fn)K[k]=0};b.onpointerdown=on;b.onpointerup=off;b.onpointercancel=off;b.onpointerleave=off};bind(a,'a');bind(d,'d');bind(j,' ');bind(atk,null,basic);bind(s1,null,sk1);bind(s2,null,sk2);bind(s3,null,sk3);bind(ds,'k')}

const hint=document.querySelector('.hint');if(hint)hint.textContent='A/D · Space double jump · Click combo · 1/2/3 skill · K dash · PERFORMANCE v1.32';
const tag=document.createElement('div');tag.style.cssText='position:fixed;right:14px;bottom:48px;z-index:11;padding:6px 9px;border:1px solid #3b6c79;border-radius:8px;background:#06151ddd;color:#9fffe2;font:700 11px ui-monospace,monospace';tag.textContent='v1.32 · NATIVE 60FPS · NO FRAME COPY';document.body.appendChild(tag);
})();