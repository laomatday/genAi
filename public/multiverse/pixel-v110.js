(()=>{
if(window.__multiversePixelV125)return;window.__multiversePixelV125=true;

// --- Combat balance: ranged safety trades damage for distance ---
try{
  D.Human.Archer[2]=13;
  D.Human.Mage[2]=15;
  D.Spirit.Ifri[2]=16;
  D.Spirit.Sylph[2]=13;
  D.Spirit.Gnome[2]=15;
  D.Angel.base[2]=13;
}catch{}

// --- Pixel UI ---
const style=document.createElement('style');
style.textContent=`
html,body{background:#050d13!important;image-rendering:pixelated;image-rendering:crisp-edges}
canvas{image-rendering:pixelated!important;image-rendering:crisp-edges!important}
.hud{gap:6px!important;top:10px!important;left:10px!important}
.pill,.hint,.skill{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;border-radius:3px!important;border:2px solid #27546a!important;background:#071722e8!important;box-shadow:inset 0 0 0 2px #071019,3px 3px 0 #02080c!important}
.pill{padding:7px 10px!important}.hint{padding:7px 10px!important}
.skills{gap:7px!important;bottom:12px!important}.skill{border-radius:3px!important;min-width:105px!important;padding:9px 11px!important}
.skill b{font-size:13px!important}.skill small{font-size:10px!important;color:#9fc1d0!important}
.xpbar{height:6px!important;border-radius:0!important;background:#102832!important}.xpfill{border-radius:0!important;background:linear-gradient(90deg,#49e4d4 0 65%,#ffe05c 65%)!important}
#menu,#human,#spirit,#over{background:rgba(2,8,13,.84)!important;backdrop-filter:none!important}
.panel{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;border-radius:4px!important;border:2px solid #28556b!important;background:#06131eea!important;box-shadow:7px 7px 0 #02070b!important}
.panel h1{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;letter-spacing:-.05em!important;text-shadow:3px 3px 0 #03101a!important}
.card{border-radius:3px!important;border:2px solid #254d61!important;background:#0b2230e8!important;box-shadow:3px 3px 0 #02080c!important;transition:none!important}
.card:hover{transform:translate(-2px,-2px)!important;box-shadow:5px 5px 0 #02080c!important;border-color:#66d8d1!important}
.main-summon{border-radius:3px!important;box-shadow:3px 3px 0 #02080c!important}
.pixel-version{position:fixed;right:12px;bottom:82px;z-index:8;padding:5px 8px;border:2px solid #3c7688;background:#061722e8;color:#8ff1dc;font:800 10px ui-monospace,monospace;box-shadow:3px 3px 0 #02080c;pointer-events:none}
`;
document.head.appendChild(style);
const ver=document.createElement('div');ver.className='pixel-version';ver.textContent='PIXEL ART v1.25 · RICH SCENE';document.body.appendChild(ver);
const hint=document.querySelector('.hint');if(hint)hint.textContent='A/D · Space · Click combo · 1/2/3 skill · K dash · PIXEL v1.25';

// --- Low-resolution render target (640x360 -> 1280x720) ---
const PC=document.createElement('canvas');PC.width=640;PC.height=360;
const P2=PC.getContext('2d');P2.imageSmoothingEnabled=false;
X.imageSmoothingEnabled=false;
const S=2, GW=640, GH=360, GG=310;
const q2=v=>Math.round(v/S);
const snap=(v,g=1)=>Math.round(v/g)*g;
function rect(x,y,w,h,c){P2.fillStyle=c;P2.fillRect(snap(x),snap(y),Math.ceil(w),Math.ceil(h))}
function outlineRect(x,y,w,h,fill,stroke='#061017',o=2){rect(x-o,y-o,w+o*2,h+o*2,stroke);rect(x,y,w,h,fill)}
function line(x1,y1,x2,y2,c,w=1){P2.strokeStyle=c;P2.lineWidth=w;P2.beginPath();P2.moveTo(snap(x1)+.5,snap(y1)+.5);P2.lineTo(snap(x2)+.5,snap(y2)+.5);P2.stroke()}
function pxCircle(cx,cy,r,c){P2.fillStyle=c;const rr=Math.max(1,Math.floor(r));for(let y=-rr;y<=rr;y++)for(let x=-rr;x<=rr;x++)if(x*x+y*y<=rr*rr)P2.fillRect(snap(cx+x),snap(cy+y),1,1)}
function label(text,x,y,c='#e8ffff',size=6,center=true){P2.font=`700 ${size}px monospace`;P2.textAlign=center?'center':'left';P2.fillStyle='#02080c';P2.fillText(text,x+1,y+1);P2.fillStyle=c;P2.fillText(text,x,y)}
function hpbar(e,color){const x=q2(e.x),y=q2(e.y)-8,w=Math.max(18,q2(e.w));outlineRect(x,y,w,4,'#0a1419','#020609',1);rect(x+1,y+1,Math.max(0,(w-2)*e.hp/e.max),2,color)}

function bgRuins(){
  rect(0,0,GW,GH,'#04121a');
  for(let r=90;r>0;r-=10){const a=Math.max(0.01,(95-r)/400);P2.globalAlpha=a;pxCircle(430,62,r,'#1d6570')}P2.globalAlpha=1;
  pxCircle(480,44,24,'#b7e9e8');pxCircle(486,40,19,'#d6f6f0');
  rect(0,98,GW,108,'#08252c');
  for(let i=0;i<13;i++){let x=i*55+(i%2)*9,h=48+(i%5)*16;rect(x,98-h,10,h,'#061c24');rect(x-7,98-h+8,24,5,'#08232b');if(i%3===0)tri(x-4,98-h,x+5,98-h-16,x+14,98-h,'#061a22','#061a22')}
  for(let i=0;i<5;i++){const x=135+i*82;outlineRect(x,116,58,116,'#0d3440','#061a23',4);rect(x+12,137,34,95,'#071d27');P2.strokeStyle='#174954';P2.lineWidth=3;P2.beginPath();P2.arc(x+29,142,17,Math.PI,0);P2.stroke()}
  for(let i=0;i<3;i++){const x=268+i*78;rect(x,153,5,87,'#4fb8c1');rect(x+5,153,2,87,'#a5eee5');P2.globalAlpha=.22;rect(x-4,153,15,88,'#72ddd5');P2.globalAlpha=1}
  rect(0,0,38,285,'#020a0e');rect(602,0,38,290,'#02090d');
  for(let i=0;i<7;i++){line(24+i*13,0,12+i*15,82+(i%3)*25,'#05262a',4);line(620-i*12,0,631-i*13,90+(i%4)*22,'#05262a',4)}
  for(let i=0;i<24;i++){const x=(i*31)%640;rect(x,0,3,28+(i%6)*8,'#062026');if(i%4===0){rect(x-4,22+(i%6)*8,10,3,'#0a3b35')}}
  outlineRect(552,188,55,122,'#0a2833','#06151c',4);outlineRect(561,199,37,108,'#123e55','#092232',3);rect(569,211,21,92,'#2b85aa');rect(575,218,10,82,'#77d9e3');
  for(const x of [520,614]){rect(x,215,3,36,'#442918');pxCircle(x+1,211,4,'#ff7d35');pxCircle(x+1,207,2,'#ffd16a')}
  for(const x of [405,451]){rect(x,104,3,54,'#392619');rect(x+3,111,19,29,'#6a2436');tri(x+3,140,x+12,149,x+22,140,'#6a2436','#6a2436')}
  for(let x=0;x<GW;x+=11){rect(x,286-(x%33?0:4),13,8,x%22?'#0a3a34':'#0c5042')}
  pixelBridge('#102f35','#4d7f7c');
  rect(0,317,GW,43,'#061a22');line(0,333,GW,333,'#66e3d0',1);for(let x=0;x<GW;x+=22){rect(x,340+(x%44?2:0),12,1,'#24666a');if(x%66===0)rect(x+3,346,6,1,'#4fb3aa')}
  motes('#93ffc2');
}
function bgGoblin(){
  rect(0,0,GW,GH,'#06140f');
  for(let r=110;r>0;r-=12){P2.globalAlpha=.025;pxCircle(430,72,r,'#2b8f87')}P2.globalAlpha=1;
  pxCircle(470,45,22,'#9bdbd5');pxCircle(475,41,17,'#c9efea');
  rect(0,82,GW,128,'#0a2921');
  for(let i=0;i<12;i++){const x=20+i*55;rect(x,70+(i%3)*10,8,170,'#071a14');pxCircle(x+4,70+(i%3)*10,19,'#0b2b20')}
  for(let i=0;i<4;i++){const x=210+i*82;outlineRect(x,104,52,110,'#0d302b','#061912',3);rect(x+10,124,32,90,'#071c18')}
  for(const [a,b,y] of [[35,205,181],[245,430,214]]){line(a,y,b,y,'#4a321e',2);for(let x=a;x<b;x+=18)rect(x,y-4,13,5,'#523824')}
  for(let i=0;i<4;i++){const x=85+i*142;tri(x,GG,x+35,GG-56-(i%2)*8,x+70,GG,'#6a3b29','#29180f');tri(x+7,GG,x+35,GG-46,x+63,GG,'#8a4a34','#8a4a34');rect(x+31,GG-19,8,19,'#22120d')}
  for(let i=0;i<4;i++){const x=58+i*154;rect(x,126+(i%2)*12,4,80,'#402819');rect(x+4,134+(i%2)*12,22,36,i%2?'#8e3040':'#735126');rect(x+9,148+(i%2)*12,10,8,'#d2bb87')}
  for(const x of [470,565]){rect(x,210,5,100,'#3a281a');rect(x+34,210,5,100,'#3a281a');for(let y=218;y<304;y+=14)rect(x+6,y,28,4,'#4b3421');rect(x-6,202,50,9,'#2e1d13');rect(x+1,196,36,7,'#4d3320');pxCircle(x+19,190,4,'#ff7430');pxCircle(x+19,187,2,'#ffd063')}
  for(let i=0;i<6;i++){const x=55+i*105;rect(x,GG-25,3,25,'#4a2d18');pxCircle(x+1,GG-29,4,'#ff7631');pxCircle(x+1,GG-33,2,'#ffd36a')}
  for(let i=0;i<9;i++)tri(15+i*73,GG,21+i*73,GG-18,27+i*73,GG,'#38271b','#38271b');
  for(let x=0;x<GW;x+=10){rect(x,287-(x%30?0:5),12,8,x%20?'#0a3b30':'#0c4c3c')}
  pixelBridge('#123128','#54775a');
  rect(0,317,GW,43,'#061914');line(0,334,GW,334,'#63d6ad',1);for(let x=0;x<GW;x+=24)rect(x,343,10,1,'#25584c');
  motes('#86ff9f');
}
function pixelBridge(base,trim){rect(0,GG-7,GW,11,'#07110f');rect(0,GG-6,GW,7,base);rect(0,GG-6,GW,2,trim);for(let x=0;x<GW;x+=26){rect(x,GG+1,4,22,'#0a1b18');rect(x+4,GG+4,16,2,trim);rect(x+7,GG+8,2,8,trim)}}
function motes(c){for(let i=0;i<34;i++){const x=(i*53+Math.floor(t*.08))%GW,y=40+(i*37)%250;rect(x,y,1+(i%4===0?1:0),1+(i%4===0?1:0),c)}}
function tri(x1,y1,x2,y2,x3,y3,fill,stroke){P2.fillStyle=fill;P2.strokeStyle=stroke;P2.lineWidth=2;P2.beginPath();P2.moveTo(x1,y1);P2.lineTo(x2,y2);P2.lineTo(x3,y3);P2.closePath();P2.fill();P2.stroke()}

function playerSprite(){
  const cls=id(),x=q2(P.x)+q2(P.w)/2,y=q2(P.y),bob=P.ground?Math.round(Math.sin(t*.08)):0,dir=P.dir>=0?1:-1,attack=P.atk>0;
  const base=cfg()[4];
  rect(x-9,GG-4,18,3,'#0008');
  outlineRect(x-7,y+13+bob,14,14,'#26323b','#061017',2);outlineRect(x-6,y+27+bob,5,10,base,'#061017',2);outlineRect(x+1,y+27+bob,5,10,base,'#061017',2);
  outlineRect(x-6,y+2+bob,12,11,base,'#061017',2);rect(x+(dir>0?1:-4),y+6+bob,2,3,'#071017');
  rect(x-10,y+17+bob,4,3,'#dff7f4');rect(x+6,y+17+bob,4+(attack?4:0),3,'#dff7f4');
  if(cls==='Knight'){outlineRect(x-13,y+15+bob,7,12,'#77a7b9','#d8f4f4',1);line(x+9,y+16+bob,x+dir*(attack?18:14),y+(attack?9:3)+bob,'#e9ffff',2);rect(x-6,y-1+bob,12,3,'#a9c6d0')}
  else if(cls==='Fighter'){outlineRect(x-15,y+14+bob,7,7,'#e99158','#ffd7bb',1);outlineRect(x+8,y+14+bob,7,7,'#e99158','#ffd7bb',1)}
  else if(cls==='Archer'){tri(x-7,y+4+bob,x,y-5+bob,x+7,y+4+bob,'#244838','#071017');P2.strokeStyle='#d1aa70';P2.lineWidth=2;P2.beginPath();P2.arc(x+11*dir,y+16+bob,7,dir>0?-1.1:2.0,dir>0?1.1:4.2);P2.stroke()}
  else if(cls==='Mage'){tri(x-8,y+4+bob,x,y-7+bob,x+8,y+4+bob,'#6f67cc','#071017');line(x+10*dir,y+12+bob,x+13*dir,y+28+bob,'#d4c6ff',2);pxCircle(x+10*dir,y+10+bob,3,'#b88cff')}
  else if(cls==='Demon'){tri(x-6,y+2+bob,x-11,y-7+bob,x-2,y+2+bob,'#b52f35','#071017');tri(x+6,y+2+bob,x+11,y-7+bob,x+2,y+2+bob,'#b52f35','#071017')}
  else if(cls==='Ifri'){for(let i=-1;i<=1;i++)tri(x+i*5,y+2+bob,x+i*5+2,y-8-Math.round(Math.sin(t*.22+i)*2)+bob,x+i*5+4,y+2+bob,'#ff7036','#6a2414')}
  else if(cls==='Sylph'){outlineRect(x-13,y+12+bob,5,10,'#7ff5dd','#1f5e5b',1);outlineRect(x+8,y+12+bob,5,10,'#7ff5dd','#1f5e5b',1)}
  else if(cls==='Gnome'){for(let i=0;i<4;i++){const a=t*.05+i*1.57;pxCircle(x+Math.round(Math.cos(a)*13),y+13+Math.round(Math.sin(a)*7)+bob,2,'#bda27e')}}
  else if(cls==='Angel'){pxCircle(x,y-2+bob,7,'#e9e0a8');rect(x-6,y-3+bob,12,4,'#071017');line(x-14,y+14+bob,x-23,y+4+bob,'#fff0c1',2);line(x+14,y+14+bob,x+23,y+4+bob,'#fff0c1',2)}
  if(P.armor){outlineRect(x-7,y+14+bob,14,10,'#0000',P.armor.color,1)}
  label('PLAYER',x,y-4+bob,'#e9ffff',6);
}

function slimeSprite(e){const x=q2(e.x),y=q2(e.y),w=q2(e.w),h=q2(e.h),b=Math.round(Math.abs(Math.sin(e.tm*.12))*3);rect(x+2,y+h-7-b,w-4,7,e.type==='b'?'#3f78db':'#38b9c9');rect(x+5,y+4-b,w-10,h-8,e.type==='b'?'#65a1f2':'#67dce3');rect(x+8,y+2-b,w-16,3,'#98f7ef');rect(x+Math.floor(w*.35),y+Math.floor(h*.35)-b,2,3,'#071017');rect(x+Math.floor(w*.62),y+Math.floor(h*.35)-b,2,3,'#071017');if(e.type==='b'){tri(x+w*.22,y+2-b,x+w*.35,y-12-b,x+w*.48,y+2-b,'#f0c44e','#7a5620');tri(x+w*.45,y+2-b,x+w*.62,y-13-b,x+w*.78,y+2-b,'#f0c44e','#7a5620')}hpbar(e,e.type==='b'?'#ffd55d':'#70edf2')}
function goblinSprite(e){const x=q2(e.x),y=q2(e.y),w=q2(e.w),h=q2(e.h),cx=x+w/2,bob=Math.round(Math.sin(e.tm*.13));const skin=e.type==='gking'?'#80ad49':e.type==='gc'?'#719a40':'#72a449';rect(cx-8,y+7+bob,16,13,skin);rect(cx-11,y+11+bob,4,5,'#577b36');rect(cx+7,y+11+bob,4,5,'#577b36');rect(cx-4,y+12+bob,2,2,'#10170d');rect(cx+3,y+12+bob,2,2,'#10170d');const cloth=e.type==='gm'?'#5f3f91':e.type==='gking'?'#7e273d':e.type==='gc'?'#9b472c':e.type==='ga'?'#73512e':'#526238';outlineRect(cx-7,y+20+bob,14,h-22,cloth,'#10170d',1);rect(cx-7,y+h-3,5,3,'#342719');rect(cx+2,y+h-3,5,3,'#342719');
  if(e.type==='gk'){rect(cx-8,y+5+bob,16,4,'#9aa3a0');outlineRect(cx+8,y+22+bob,6,11,'#708180','#c9d8d5',1);line(cx-8,y+24+bob,cx-15,y+12+bob,'#d5dfdc',2)}
  else if(e.type==='ga'){line(cx+9,y+22+bob,cx+14,y+15+bob,'#d0aa6d',1);line(cx+14,y+15+bob,cx+14,y+29+bob,'#d0aa6d',1);rect(cx-12,y+20+bob,4,14,'#493420')}
  else if(e.type==='gm'){tri(cx-8,y+7+bob,cx,y-5+bob,cx+8,y+7+bob,'#7c59ae','#2a1d42');line(cx+10,y+20+bob,cx+14,y+35+bob,'#caa4ff',2);pxCircle(cx+10,y+18+bob,3,'#b77cff')}
  else if(e.type==='gc'){rect(cx-10,y+4+bob,20,5,'#4b5551');line(cx+11,y+23+bob,cx+22,y+8+bob,'#ff9e57',3);rect(cx-17,y+20+bob,8,h-22,'#8e3926');rect(cx+9,y+20+bob,8,h-22,'#8e3926')}
  else if(e.type==='gking'){tri(cx-10,y+5+bob,cx-6,y-8+bob,cx-1,y+4+bob,'#f2c84f','#7c5520');tri(cx,y+4+bob,cx+5,y-10+bob,cx+10,y+5+bob,'#f2c84f','#7c5520');rect(cx-14,y+20+bob,28,h-22,'#71253a');line(cx+13,y+22+bob,cx+22,y+5+bob,'#ffd55c',3);pxCircle(cx+23,y+4+bob,3,'#ffd55c')}
  hpbar(e,e.type==='gking'?'#ffd55c':e.type==='gc'?'#ff9e57':'#9dd966');label(e.name||'GOBLIN',cx,y-7,'#e8f0d0',e.type==='gking'||e.type==='gc'?6:5)}

function projectileSprite(b){const x=q2(b.x),y=q2(b.y);if(b.shape==='arrow'){line(x-6,y,x+5,y,b.c,1);tri(x+5,y,x+1,y-2,x+1,y+2,b.c,b.c)}else if(b.shape==='shock'){rect(x-6,y-2,12,4,b.c)}else{pxCircle(x,y,Math.max(2,q2(b.r)),b.c)}}
function fxSprite(f){const x=q2(f.x),y=q2(f.y);if(f.type==='txt'||f.type==='xp'){label(f.z,x,y,f.c||'#fff',7)}else if(f.type==='combo'){label(f.z,x,y,f.c||'#fff',f.z.includes('3')?10:8)}else if(f.type==='banner'){label(f.z,x,y,f.c||'#fff',14)}else if(f.type==='arc'){const r=Math.max(6,q2(f.r));for(let i=0;i<8;i++){const a=(f.dir>0?-.9:2.2)+i*.22;rect(x+Math.cos(a)*r,y+Math.sin(a)*r,2,2,f.c)}}else if(f.type==='boom'||f.type==='ring'||f.type==='shield'){const r=Math.max(5,q2(f.r)+(18-f.life)*2);for(let a=0;a<6.2;a+=.45)rect(x+Math.cos(a)*r,y+Math.sin(a)*r,2,2,f.c)}else if(f.type==='spike'){tri(x-5,y,x,y-30,x+5,y,f.c,f.c)}else if(f.type==='beam'){rect(x-5,40,10,GG-40,f.c)}else if(f.type==='drop'){line(x,y-45,x,y,f.c,2)}else if(f.type==='trail'){rect(x,y,26,39,f.c)}}

draw=function(){
  P2.clearRect(0,0,GW,GH);
  if(stage===1)bgRuins();else bgGoblin();
  E.forEach(e=>{if(e.type==='s'||e.type==='b')slimeSprite(e);else goblinSprite(e)});
  B.forEach(projectileSprite);F.forEach(fxSprite);if(on)playerSprite();
  X.save();X.setTransform(1,0,0,1,0,0);X.clearRect(0,0,W,H);X.imageSmoothingEnabled=false;X.drawImage(PC,0,0,GW,GH,0,0,W,H);X.restore();
};

// --- Gameplay v1.25: double jump + slower basic attack ---
let __jumpPrev=false,__airJumpUsed=false;
const __oldUpdV125=upd;
upd=function(){
  const jump=!!(K.w||K.arrowup||K[' ']);
  if(on&&jump&&!__jumpPrev&&!P.ground&&!__airJumpUsed){const d=cfg();P.vy=-d[1]*.92;P.ground=0;__airJumpUsed=true;try{fx('ring',P.x+P.w/2,P.y+P.h/2,'#64dfff',24)}catch{}}
  __oldUpdV125();if(P.ground)__airJumpUsed=false;__jumpPrev=jump;
};
const __oldBasicV125=basic;
basic=function(){if(P.atk)return;__oldBasicV125();if(P.atk>0)P.atk=Math.ceil(P.atk*1.20);if(P.win>0)P.win=Math.max(P.win,30)};
const __oldStV125=st;st=function(...args){__jumpPrev=false;__airJumpUsed=false;return __oldStV125(...args)};
})();