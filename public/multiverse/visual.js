(()=>{
if(window.__multiverseVisualV100)return;
window.__multiverseVisualV100=true;

const ink = '#07121b';
const glow = (c,b=18)=>{X.shadowColor=c;X.shadowBlur=b};
const clearGlow=()=>{X.shadowBlur=0;X.shadowColor='transparent'};
function rr(x,y,w,h,r,fill,stroke=ink,lw=3){
  X.beginPath();
  X.moveTo(x+r,y); X.lineTo(x+w-r,y); X.quadraticCurveTo(x+w,y,x+w,y+r);
  X.lineTo(x+w,y+h-r); X.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  X.lineTo(x+r,y+h); X.quadraticCurveTo(x,y+h,x,y+h-r);
  X.lineTo(x,y+r); X.quadraticCurveTo(x,y,x+r,y); X.closePath();
  X.fillStyle=fill; X.fill(); if(stroke){X.strokeStyle=stroke;X.lineWidth=lw;X.stroke()}
}
function gradient(x,y,h,a,b){
  const g=X.createLinearGradient(x,y,x,y+h); g.addColorStop(0,a); g.addColorStop(1,b); return g;
}
function motes(count, areaTop=70, areaBottom=560, color='#8affc4'){
  for(let i=0;i<count;i++){
    const xx=(i*97+t*.22*(1+(i%3)*.2))%W;
    const yy=areaTop+((i*59)%Math.max(1,areaBottom-areaTop))+Math.sin(t*.035+i)*8;
    const r=1.2+(i%4)*.35;
    X.globalAlpha=.18+(i%5)*.09; glow(color,8); X.fillStyle=color; X.beginPath(); X.arc(xx,yy,r,0,Math.PI*2); X.fill(); clearGlow();
  }
  X.globalAlpha=1;
}
function branch(x,y,len,ang,width,color){
  X.save();X.translate(x,y);X.rotate(ang);X.strokeStyle=color;X.lineCap='round';X.lineWidth=width;
  X.beginPath();X.moveTo(0,0);X.quadraticCurveTo(len*.35,-len*.15,len,0);X.stroke();X.restore();
}
function leafCluster(x,y,s,c){
  X.fillStyle=c;
  for(let i=0;i<14;i++){
    const a=i*2.4, rr2=s*(.4+(i%5)*.08), px=x+Math.cos(a)*rr2, py=y+Math.sin(a)*rr2*.6;
    X.beginPath();X.ellipse(px,py,s*.12,s*.2,a*.2,0,Math.PI*2);X.fill();
  }
}
function ornateBridge(){
  X.fillStyle='#18353a';X.strokeStyle='#06141d';X.lineWidth=5;X.fillRect(0,G-11,W,19);X.strokeRect(0,G-11,W,19);
  X.strokeStyle='#367378';X.lineWidth=3;
  for(let x=0;x<W;x+=58){
    X.beginPath();X.moveTo(x+8,G+9);X.quadraticCurveTo(x+19,G+42,x+29,G+12);X.quadraticCurveTo(x+40,G+42,x+51,G+10);X.stroke();
  }
  for(const x of [120,420,760,1080]){
    X.fillStyle='#143038';X.strokeStyle='#06141d';X.lineWidth=4;X.fillRect(x,G+4,18,96);X.strokeRect(x,G+4,18,96);
  }
  X.strokeStyle='#214c52';X.lineWidth=6;X.beginPath();X.moveTo(820,G+9);X.quadraticCurveTo(1000,G+115,1180,G+8);X.stroke();
  X.strokeStyle='#122c32';X.lineWidth=3;
  for(let i=0;i<5;i++){X.beginPath();X.arc(990+i*32,G+58-i*5,18+i*2,.2,2.8);X.stroke()}
}
const oldBg=bg;
bg=function(){
  if(stage===1){
    let g=gradient(0,0,H,'#061722','#0a3440');X.fillStyle=g;X.fillRect(0,0,W,H);
    X.globalAlpha=.34;X.fillStyle='#05131d';
    for(let i=0;i<7;i++){let x=i*210-50;X.beginPath();X.ellipse(x,300,130,210,.2,0,Math.PI*2);X.fill()}
    X.globalAlpha=1;
    for(let i=0;i<4;i++){const x=260+i*260;const lg=X.createRadialGradient(x,340,20,x,340,220);lg.addColorStop(0,'#43ffd133');lg.addColorStop(1,'#43ffd100');X.fillStyle=lg;X.fillRect(x-240,80,480,520)}
    X.fillStyle='#07141b';X.beginPath();X.moveTo(1000,0);X.bezierCurveTo(930,130,955,300,900,500);X.lineTo(W,620);X.lineTo(W,0);X.closePath();X.fill();
    X.strokeStyle='#133942';X.lineWidth=20;for(let i=0;i<5;i++){X.beginPath();X.moveTo(1070+i*32,0);X.quadraticCurveTo(980+i*35,210,1040+i*45,560);X.stroke()}
    leafCluster(1110,70,70,'#0d473a'); leafCluster(1170,110,58,'#11543f');
    glow('#74e8ff',18);X.strokeStyle='#244e5b';X.fillStyle='#0a2330';X.lineWidth=8;X.beginPath();X.moveTo(1120,610);X.lineTo(1120,420);X.quadraticCurveTo(1185,355,1250,420);X.lineTo(1250,610);X.closePath();X.fill();X.stroke();clearGlow();
    X.fillStyle='#21485d';X.globalAlpha=.55;X.fillRect(1142,447,84,148);X.globalAlpha=1;
    X.strokeStyle='#0b3129';X.lineWidth=6;for(let i=0;i<15;i++){let x=840+i*30;X.beginPath();X.moveTo(x,G);X.quadraticCurveTo(x-8,G-35,x+Math.sin(i)*12,G-68-(i%3)*14);X.stroke()}
    ornateBridge();
    const wg=X.createLinearGradient(0,G+22,0,H);wg.addColorStop(0,'#7affd433');wg.addColorStop(1,'#0e3a4600');X.fillStyle=wg;X.fillRect(0,G+20,W,H-G-20);
    X.strokeStyle='#9affdd77';X.lineWidth=2;X.beginPath();X.moveTo(0,688);for(let x=0;x<W;x+=40)X.lineTo(x,688+Math.sin(t*.04+x*.03)*2);X.stroke();
    motes(42,80,650,'#93ffbc');
  }else{
    let g=gradient(0,0,H,'#071812','#17352d');X.fillStyle=g;X.fillRect(0,0,W,H);
    for(const [x,y,r] of [[420,280,330],[800,250,260]]){const rg=X.createRadialGradient(x,y,25,x,y,r);rg.addColorStop(0,'#4effc733');rg.addColorStop(1,'#4effc700');X.fillStyle=rg;X.fillRect(x-r,y-r,r*2,r*2)}
    X.fillStyle='#091710';X.globalAlpha=.62;
    for(let i=0;i<9;i++){const x=30+i*160;X.fillRect(x,180,24,440);X.beginPath();X.arc(x+12,180,64,0,Math.PI*2);X.fill()}
    X.globalAlpha=1;
    X.fillStyle='#07120f';X.beginPath();X.moveTo(1010,0);X.bezierCurveTo(930,150,975,310,930,470);X.bezierCurveTo(900,540,940,580,1000,620);X.lineTo(W,620);X.lineTo(W,0);X.closePath();X.fill();
    X.strokeStyle='#163a2b';X.lineWidth=18;
    for(let i=0;i<5;i++){X.beginPath();X.moveTo(1080+i*34,0);X.quadraticCurveTo(1010+i*22,180,1050+i*43,530);X.stroke()}
    X.globalAlpha=.78;
    for(let i=0;i<5;i++){let x=150+i*225;X.fillStyle=i%2?'#5b331f':'#694027';X.beginPath();X.moveTo(x,G);X.lineTo(x+58,G-100-(i%2)*18);X.lineTo(x+118,G);X.closePath();X.fill();X.fillStyle='#25160e';X.fillRect(x+50,G-24,16,24)}
    X.globalAlpha=1;
    for(let i=0;i<4;i++){let x=80+i*300;X.fillStyle='#51351c';X.fillRect(x,330,8,155);X.fillStyle=i%2?'#973343':'#8e713a';X.beginPath();X.moveTo(x+8,340);X.lineTo(x+64,350);X.lineTo(x+8,378);X.closePath();X.fill()}
    glow('#5effc7',16);X.strokeStyle='#224d39';X.lineWidth=8;X.fillStyle='#0a251c';X.beginPath();X.moveTo(1030,G);X.lineTo(1030,425);X.quadraticCurveTo(1090,355,1155,425);X.lineTo(1155,G);X.closePath();X.fill();X.stroke();clearGlow();
    for(let i=0;i<5;i++){let x=155+i*220;X.fillStyle='#3b2617';X.fillRect(x-3,G-23,6,23);glow('#ffad4a',10);X.fillStyle='#ffad4a';X.beginPath();X.arc(x,G-29,7+Math.sin(t*.18+i)*2,0,Math.PI*2);X.fill();X.fillStyle='#ff6b35';X.beginPath();X.arc(x,G-33,4,0,Math.PI*2);X.fill();clearGlow()}
    leafCluster(1180,620,55,'#0d3e2b');leafCluster(920,610,46,'#113f2b');
    ornateBridge();
    const wg=X.createLinearGradient(0,G+28,0,H);wg.addColorStop(0,'#5affc31e');wg.addColorStop(1,'#07261e00');X.fillStyle=wg;X.fillRect(0,G+20,W,H-G-20);
    X.strokeStyle='#71f5c855';X.beginPath();X.moveTo(0,688);for(let x=0;x<W;x+=40)X.lineTo(x,688+Math.sin(t*.035+x*.035)*2);X.stroke();
    motes(48,60,660,'#82ff9b');
  }
};

function wing(side,flap,col){
  X.save();X.strokeStyle=col;X.lineWidth=3;
  for(let i=0;i<4;i++){X.beginPath();X.moveTo(side*(12+i*2),-7+i*2);X.quadraticCurveTo(side*(24+flap*.35+i*2),-18+i*3,side*(40+flap+i*4),-31+i*5);X.stroke()}
  X.restore();
}
function shield(x,y,s,fill,stroke){
  X.fillStyle=fill;X.strokeStyle=stroke;X.lineWidth=3;X.beginPath();X.moveTo(x-s,y-s*.9);X.lineTo(x+s,y-s*.9);X.lineTo(x+s*.8,y+s*.55);X.lineTo(x,y+s);X.lineTo(x-s*.8,y+s*.55);X.closePath();X.fill();X.stroke()
}
hero=function(){
  const d=cfg(), cls=id(), bob=P.ground?Math.sin(t*.085)*2.2:0, run=P.ground?Math.sin(t*.42)*6.5:0, flap=Math.sin(t*.34)*7;
  X.save(); if(P.inv&&Math.floor(P.inv/4)%2===0)X.globalAlpha=.42; X.translate(P.x+27,P.y+40+bob);
  if(!P.ground)X.rotate(P.vx*.018);
  X.fillStyle='#07121b';X.beginPath();X.moveTo(-11,-8);X.quadraticCurveTo(-22,15,-19,35);X.lineTo(19,35);X.quadraticCurveTo(22,14,11,-8);X.closePath();X.fill();
  glow(d[4],18);X.fillStyle=d[4];X.strokeStyle=ink;X.lineWidth=3;X.beginPath();X.roundRect(-13,-33,26,23,8);X.fill();X.stroke();clearGlow();
  X.fillStyle='#07121b';X.beginPath();X.ellipse(-5,-22,2.5,4,0,0,Math.PI*2);X.ellipse(5,-22,2.5,4,0,0,Math.PI*2);X.fill();
  rr(-15,-9,30,29,7,gradient(-15,-9,29,d[4],'#1a2730'));
  X.fillStyle=d[4];X.strokeStyle=ink;X.lineWidth=3;rr(-17+run*.12,20,12,18,4,d[4]);rr(5-run*.12,20,12,18,4,d[4]);
  let sw=P.atk?Math.sin((20-P.atk)*.32)*18*P.dir:run*.35;X.strokeStyle='#eefcff';X.lineWidth=4;X.beginPath();X.moveTo(-12,-1);X.lineTo(-24,-2-run*.18);X.moveTo(12,-1);X.lineTo(23+sw,-3-Math.abs(sw)*.17);X.stroke();

  if(cls==='Knight'){shield(-29,4,11,'#9ebfd5','#eaf7ff');X.strokeStyle='#f0fbff';X.beginPath();X.moveTo(21+sw,-8);X.lineTo(36+sw,-33);X.stroke();X.fillStyle='#bdcfda';X.fillRect(-11,-39,22,6)}
  else if(cls==='Fighter'){X.fillStyle='#ffae72';X.strokeStyle='#ffe6cf';rr(-31,-7,11,13,4,'#ffae72','#ffe6cf',2);rr(21+sw,-9,12,14,4,'#ffae72','#ffe6cf',2)}
  else if(cls==='Archer'){X.fillStyle='#244838';X.beginPath();X.moveTo(-14,-29);X.lineTo(0,-45);X.lineTo(14,-29);X.closePath();X.fill();X.strokeStyle='#d6b77d';X.lineWidth=3;X.beginPath();X.arc(23,-7,13,-1.15,1.15);X.stroke();X.beginPath();X.moveTo(28,-19);X.lineTo(28,6);X.stroke()}
  else if(cls==='Mage'){X.fillStyle='#778bff';X.beginPath();X.moveTo(-15,-27);X.lineTo(0,-48);X.lineTo(15,-27);X.closePath();X.fill();X.strokeStyle='#d9e6ff';X.lineWidth=4;X.beginPath();X.moveTo(22,-20);X.lineTo(22,7);X.stroke();glow('#b0c9ff',12);X.fillStyle='#b0c9ff';X.beginPath();X.arc(22,-25,6+Math.sin(t*.22),0,Math.PI*2);X.fill();clearGlow()}
  else if(cls==='Demon'){X.strokeStyle='#ff6464';X.lineWidth=4;X.beginPath();X.moveTo(-9,-33);X.lineTo(-20,-48);X.moveTo(9,-33);X.lineTo(20,-48);X.stroke();X.strokeStyle='#ff8a80';X.beginPath();X.moveTo(22+sw,-5);X.lineTo(38+sw,-16);X.stroke()}
  else if(cls==='Ifri'){for(let i=0;i<3;i++){let f=Math.sin(t*.27+i)*4;glow('#ff8345',9);X.strokeStyle='#ff7136';X.lineWidth=3;X.beginPath();X.moveTo(-14+i*10,-31);X.lineTo(-10+i*10,-44-f);X.lineTo(-6+i*10,-31);X.stroke();clearGlow()}}
  else if(cls==='Sylph'){X.strokeStyle='#86ffe1';X.lineWidth=3;X.globalAlpha=.9;X.beginPath();X.ellipse(-24,-4,13,18+Math.sin(t*.44)*5,-.5,0,Math.PI*2);X.ellipse(24,-4,13,18-Math.sin(t*.44)*5,.5,0,Math.PI*2);X.stroke();X.globalAlpha=1}
  else if(cls==='Gnome'){X.fillStyle='#ccb08d';for(let i=0;i<4;i++){let a=t*.06+i*1.55;X.beginPath();X.arc(Math.cos(a)*20,-16+Math.sin(a)*11,5,0,Math.PI*2);X.fill()}}
  else if(cls==='Angel'){X.strokeStyle='#fff1bd';X.lineWidth=4;X.beginPath();X.arc(0,-40,15,0,Math.PI*2);X.stroke();wing(-1,flap,'#fff1bd');wing(1,flap,'#fff1bd');X.beginPath();X.moveTo(20+sw,-16);X.lineTo(36+sw,-38);X.stroke()}
  if(P.armor){X.strokeStyle=P.armor.color;X.lineWidth=3;X.strokeRect(-14,-10,28,28)}
  X.font='700 11px system-ui';X.textAlign='center';X.fillStyle='#eaffff';X.fillText('PLAYER',0,-57);
  X.restore();
};

goblin=function(e){
  X.save();let bob=Math.sin(e.tm*.13)*2,cx=e.x+e.w/2,yy=e.y+bob;if(e.hit&&Math.floor(e.hit/2)%2===0)X.globalAlpha=.55;
  const boss=e.type==='gc'||e.type==='gking', skin1=e.type==='gking'?'#8fbd57':boss?'#7dac48':'#79a84b', skin2=e.type==='gking'?'#55752d':boss?'#4d6a29':'#506e2f';
  X.fillStyle='#0006';X.beginPath();X.ellipse(cx,G-2,e.w*.42,7,0,0,Math.PI*2);X.fill();
  X.fillStyle=gradient(cx-e.w*.3,yy,e.h*.5,skin1,skin2);X.strokeStyle='#10200e';X.lineWidth=3;X.beginPath();X.ellipse(cx,yy+23,e.w*(boss?.31:.28),boss?25:22,0,0,Math.PI*2);X.fill();X.stroke();
  X.fillStyle=skin2;for(const s of [-1,1]){X.beginPath();X.moveTo(cx+s*e.w*.22,yy+15);X.lineTo(cx+s*e.w*.45,yy+4);X.lineTo(cx+s*e.w*.28,yy+29);X.closePath();X.fill();X.stroke()}
  X.fillStyle='#10160e';X.fillRect(cx-13,yy+20,5,4);X.fillRect(cx+8,yy+20,5,4);X.fillRect(cx-5,yy+31,10,3);
  if(boss){X.strokeStyle='#e7d6a2';X.lineWidth=2;X.beginPath();X.moveTo(cx-11,yy+35);X.lineTo(cx-5,yy+30);X.lineTo(cx,yy+36);X.stroke()}
  const cloth=e.type==='gm'?'#5e438e':e.type==='gking'?'#7c2841':e.type==='gc'?'#9d452c':e.type==='ga'?'#714d2d':'#4d5c37';
  rr(cx-e.w*.23,yy+45,e.w*.46,e.h-49,7,gradient(cx,yy+45,e.h-49,cloth,'#17130f'),'#20170f',3);
  X.fillStyle='#3d311d';X.fillRect(cx-17,yy+e.h-5,11,5);X.fillRect(cx+6,yy+e.h-5,11,5);
  if(e.type==='gk'){
    X.fillStyle='#9ba5a6';X.beginPath();X.moveTo(cx-24,yy+5);X.lineTo(cx+24,yy+5);X.lineTo(cx+18,yy+18);X.lineTo(cx-18,yy+18);X.closePath();X.fill();
    shield(cx+25,yy+58,11,'#77898c','#d3dfdf');X.strokeStyle='#d9e1df';X.lineWidth=4;X.beginPath();X.moveTo(cx-19,yy+49);X.lineTo(cx-37,yy+23);X.stroke()
  } else if(e.type==='ga'){
    X.strokeStyle='#d4b77d';X.lineWidth=3;X.beginPath();X.arc(cx+24,yy+49,16,-1.2,1.2);X.stroke();X.beginPath();X.moveTo(cx+29,yy+35);X.lineTo(cx+29,yy+64);X.stroke();
    X.fillStyle='#4f3523';X.fillRect(cx-28,yy+30,9,30);X.strokeStyle='#a88251';for(let i=0;i<3;i++){X.beginPath();X.moveTo(cx-24+i*3,yy+29);X.lineTo(cx-21+i*3,yy+14);X.stroke()}
  } else if(e.type==='gm'){
    X.fillStyle='#8561b0';X.beginPath();X.moveTo(cx-25,yy+12);X.lineTo(cx,yy-20);X.lineTo(cx+23,yy+12);X.closePath();X.fill();
    X.strokeStyle='#caa8ff';X.lineWidth=4;X.beginPath();X.moveTo(cx+25,yy+40);X.lineTo(cx+34,yy+72);X.stroke();glow('#c9a0ff',13);X.fillStyle='#c9a0ff';X.beginPath();X.arc(cx+23,yy+34,7+Math.sin(t*.2),0,Math.PI*2);X.fill();clearGlow()
  } else if(e.type==='gc'){
    X.fillStyle='#4a5050';X.beginPath();X.moveTo(cx-31,yy);X.lineTo(cx+31,yy);X.lineTo(cx+25,yy+16);X.lineTo(cx-25,yy+16);X.closePath();X.fill();
    X.strokeStyle='#ffa259';X.lineWidth=6;X.beginPath();X.moveTo(cx+30,yy+50);X.lineTo(cx+52,yy+15);X.stroke();X.fillStyle='#c7c1b7';X.beginPath();X.arc(cx+54,yy+12,8,0,Math.PI*2);X.fill()
  } else if(e.type==='gking'){
    X.fillStyle='#f0c64f';X.beginPath();X.moveTo(cx-30,yy+2);X.lineTo(cx-19,yy-28);X.lineTo(cx-4,yy-4);X.lineTo(cx+12,yy-31);X.lineTo(cx+30,yy+2);X.closePath();X.fill();
    X.fillStyle='#6a1f37';X.globalAlpha=.72;X.beginPath();X.moveTo(cx-39,yy+47);X.lineTo(cx-54,yy+e.h);X.lineTo(cx+54,yy+e.h);X.lineTo(cx+39,yy+47);X.closePath();X.fill();X.globalAlpha=1;
    X.strokeStyle='#ffd65c';X.lineWidth=5;X.beginPath();X.moveTo(cx+35,yy+44);X.lineTo(cx+52,yy+9);X.stroke();glow('#ffd65c',11);X.beginPath();X.arc(cx+54,yy+4,9+Math.sin(t*.15),0,Math.PI*2);X.stroke();clearGlow()
  }
  X.fillStyle='#061018cc';X.fillRect(e.x,e.y-18,e.w,7);X.fillStyle=e.type==='gking'?'#ffd65c':e.type==='gc'?'#ff9e5b':'#a6df70';X.fillRect(e.x,e.y-18,e.w*Math.max(0,e.hp)/e.max,7);
  X.restore();
};

const oldSlime=slime;
slime=function(e){
  let b=Math.abs(Math.sin(e.tm*.12))*(e.type==='b'?8:5);X.save();if(e.hit&&Math.floor(e.hit/2)%2===0)X.globalAlpha=.58;
  X.fillStyle=gradient(e.x,e.y-b,e.h,e.type==='b'?'#85b9ff':'#88f4fb',e.type==='b'?'#3567d0':'#36b5c9');X.strokeStyle='#0b2b64';X.lineWidth=5;
  X.beginPath();X.moveTo(e.x+5,e.y+e.h-b);X.quadraticCurveTo(e.x,e.y+5-b,e.x+e.w/2,e.y+3-b);X.quadraticCurveTo(e.x+e.w,e.y+5-b,e.x+e.w-5,e.y+e.h-b);X.closePath();X.fill();X.stroke();
  X.fillStyle='#fff';X.fillRect(e.x+e.w*.35,e.y+e.h*.33-b,5,7);X.fillRect(e.x+e.w*.63,e.y+e.h*.33-b,5,7);X.globalAlpha=.35;X.beginPath();X.arc(e.x+e.w*.36,e.y+e.h*.24-b,8,0,Math.PI*2);X.fill();X.globalAlpha=1;
  if(e.type==='b'){glow('#f6ce57',10);X.fillStyle='#f6ce57';X.beginPath();X.moveTo(e.x+38,e.y-b);X.lineTo(e.x+55,e.y-28-b);X.lineTo(e.x+75,e.y-b);X.lineTo(e.x+98,e.y-31-b);X.lineTo(e.x+118,e.y-b);X.fill();clearGlow()}
  X.fillStyle='#061018bb';X.fillRect(e.x,e.y-12,e.w,6);X.fillStyle=e.type==='b'?'#ffd85e':'#72eef7';X.fillRect(e.x,e.y-12,e.w*Math.max(0,e.hp)/e.max,6);X.restore()
};

const h=document.querySelector('.hint');if(h)h.textContent='A/D · Space · Click combo · 1/2/3 skill · K dash · R reset · visual v1.0';
})();