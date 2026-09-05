(()=>{
if(window.__multiverseSummonLoaded)return;
window.__multiverseSummonLoaded=true;

const style=document.createElement('style');
style.textContent=`
#summonOverlay{display:none;position:fixed;inset:0;z-index:30;place-items:center;background:#050a12e8;color:#eefaff;font-family:system-ui}
.su-panel{width:min(720px,92vw);padding:26px;border:1px solid #755ca8;border-radius:20px;background:radial-gradient(circle at 50% 10%,#2c2447 0,#111c2b 48%,#09131d 100%);box-shadow:0 30px 90px #000b}
.su-head{display:flex;justify-content:space-between;gap:16px;align-items:center}
.su-kicker{font-size:11px;letter-spacing:.18em;color:#c6b3ff;font-weight:800}
.su-title{margin:3px 0;font-size:30px}
.su-count{text-align:right;font-weight:900}.su-count small{display:block;opacity:.55;font-weight:500}
.su-tabs{display:flex;justify-content:center;gap:8px;margin:18px 0}
.su-tab{border:1px solid #735fa6;background:#161d30;color:#fff;border-radius:999px;padding:8px 18px;font-weight:900}
.su-tab.locked{opacity:.3}
.su-wheel{height:225px;display:grid;place-items:center;position:relative;overflow:hidden}
.su-wheel:before,.su-wheel:after{content:"";position:absolute;border-radius:50%;animation:suSpin linear infinite}
.su-wheel:before{width:360px;height:360px;border:1px solid #8f73cf55;box-shadow:0 0 70px #8f73cf18 inset;animation-duration:8s}
.su-wheel:after{width:235px;height:235px;border:1px dashed #efd36d66;animation-duration:5s;animation-direction:reverse}
@keyframes suSpin{to{transform:rotate(360deg)}}
.su-card{z-index:2;width:285px;min-height:166px;padding:18px;border:2px solid #8b9098;border-radius:18px;background:#0c1724ef;text-align:center;box-shadow:0 18px 45px #0008;transition:.12s}
.su-icon{width:64px;height:62px;margin:0 auto 9px;position:relative;border:4px solid currentColor;border-radius:16px 16px 24px 24px}
.su-icon:before,.su-icon:after{content:"";position:absolute;top:7px;width:20px;height:40px;border:4px solid currentColor}
.su-icon:before{left:-22px;border-right:0;border-radius:16px 0 0 18px}.su-icon:after{right:-22px;border-left:0;border-radius:0 16px 18px 0}
.su-name{font-size:20px;font-weight:950}.su-rarity{font-size:12px;font-weight:950;letter-spacing:.13em;margin-top:3px}
.su-stats{font-size:13px;opacity:.84;margin-top:7px}.su-equip{font-size:12px;opacity:.72;text-align:center;margin:8px 0 14px}
.su-actions{display:flex;gap:9px;justify-content:center;flex-wrap:wrap}.su-btn{padding:11px 18px;border-radius:12px;border:1px solid #715ca3;background:#1b2340;color:#fff;font-weight:900;cursor:pointer}
.su-btn.primary{background:linear-gradient(135deg,#7658d1,#ad69dc);border-color:#c4a7ff}.su-btn.gold{background:linear-gradient(135deg,#84671e,#c19632);border-color:#f0d36b}.su-btn:disabled{opacity:.35;cursor:not-allowed}
.su-rates{text-align:center;font-size:11px;opacity:.5;margin-top:15px}
.r-common{color:#bdc3ca}.r-uncommon{color:#78db90}.r-rare{color:#69b4ff}.r-epic{color:#bd7cff}.r-legendary{color:#ffd55e}
`;
document.head.appendChild(style);

const wrap=document.createElement('div');
wrap.id='summonOverlay';
wrap.innerHTML=`
<div class="su-panel">
  <div class="su-head">
    <div><div class="su-kicker">BOSS REWARD</div><h2 class="su-title">SUMMON</h2><div id="suBoss" style="opacity:.72">Boss defeated</div></div>
    <div class="su-count"><span id="suCount">0 lượt</span><small>1 boss = 1 lượt quay</small></div>
  </div>
  <div class="su-tabs"><button class="su-tab">GIÁP</button><button class="su-tab locked" disabled>UNITS · SOON</button></div>
  <div class="su-wheel"><div class="su-card r-common" id="suCard"><div class="su-icon"></div><div class="su-name" id="suName">BOSS REWARD</div><div class="su-rarity" id="suRarity">ARMOR SUMMON</div><div class="su-stats" id="suStats">Dùng lượt thưởng để quay giáp.</div></div></div>
  <div class="su-equip" id="suEquipped">Đang trang bị: Không có giáp</div>
  <div class="su-actions"><button class="su-btn primary" id="suRoll">QUAY GIÁP · 1 LƯỢT</button><button class="su-btn gold" id="suEquip" style="display:none">TRANG BỊ</button><button class="su-btn" id="suContinue" style="display:none">TIẾP TỤC</button></div>
  <div class="su-rates">Tỉ lệ: Common 48% · Uncommon 27% · Rare 15% · Epic 8% · Legendary 2%</div>
</div>`;
document.body.appendChild(wrap);

const ARMORS=[
 {name:'Traveler Leather',rar:'COMMON',cls:'r-common',color:'#bdc3ca',w:48,hp:12,atk:0},
 {name:'Iron Guard',rar:'UNCOMMON',cls:'r-uncommon',color:'#78db90',w:27,hp:22,atk:.03},
 {name:'Runic Mail',rar:'RARE',cls:'r-rare',color:'#69b4ff',w:15,hp:34,atk:.07},
 {name:'Dragon Scale Plate',rar:'EPIC',cls:'r-epic',color:'#bd7cff',w:8,hp:50,atk:.11},
 {name:'Celestial Aegis',rar:'LEGENDARY',cls:'r-legendary',color:'#ffd55e',w:2,hp:76,atk:.17}
];
const el=id=>document.getElementById(id);
let rolling=false,result=null,resumeState=1,modalOpen=false;

function ensureSummonState(){
 if(!P||typeof P!=='object')return;
 if(P.spins==null)P.spins=0;
 if(P.armorAtk==null)P.armorAtk=1;
 if(P.armor===undefined)P.armor=null;
}
function statText(a){return `+${a.hp} Max HP${a.atk?` · +${Math.round(a.atk*100)}% ATK`:''}`}
function pickArmor(){let r=Math.random()*100,c=0;for(const a of ARMORS){c+=a.w;if(r<c)return a}return ARMORS[0]}
function showArmor(a){
 const card=el('suCard');
 card.className='su-card '+a.cls;card.style.borderColor=a.color;
 el('suName').textContent=a.name;el('suRarity').textContent=a.rar;el('suRarity').style.color=a.color;el('suStats').textContent=statText(a);
}
function refreshSummonText(){
 ensureSummonState();
 el('suCount').textContent=(P.spins||0)+' lượt';
 el('suEquipped').textContent='Đang trang bị: '+(P.armor?P.armor.name+' · '+statText(P.armor):'Không có giáp');
}
function recalcArmorStats(){
 if(!P?.baseMax)return;
 const oldMax=P.max||P.baseMax;
 P.armorAtk=1+(P.armor?.atk||0);
 P.max=Math.round(P.baseMax+((P.lv||1)-1)*12+(P.armor?.hp||0));
 P.hp=Math.min(P.max,P.hp+Math.max(0,P.max-oldMax));
}
function bossName(e){return e.type==='b'?'SLIME KING':e.type==='gc'?'GOBLIN CHIEF':e.type==='gking'?'GOBLIN KING':'BOSS'}
function openSummon(name){
 ensureSummonState();resumeState=on;modalOpen=true;on=0;result=null;
 wrap.style.display='grid';el('suBoss').textContent=name+' đã bị đánh bại';
 refreshSummonText();
 const card=el('suCard');card.className='su-card r-common';card.style.borderColor='#8b9098';
 el('suName').textContent='BOSS REWARD';el('suRarity').textContent='ARMOR SUMMON';el('suRarity').style.color='#c7b6ff';el('suStats').textContent='Dùng 1 lượt để quay giáp.';
 el('suRoll').style.display='inline-block';el('suRoll').disabled=!(P.spins>0);
 el('suEquip').style.display='none';el('suEquip').disabled=false;el('suEquip').textContent='TRANG BỊ';
 el('suContinue').style.display='none';
}
function grantSpin(e){
 ensureSummonState();
 if(e.spinGranted||!['b','gc','gking'].includes(e.type))return;
 e.spinGranted=1;P.spins++;
 setTimeout(()=>openSummon(bossName(e)),80);
}
function roll(){
 ensureSummonState();if(rolling||P.spins<=0)return;
 rolling=true;P.spins--;refreshSummonText();el('suRoll').disabled=true;
 let n=0;
 const timer=setInterval(()=>{
   showArmor(ARMORS[Math.floor(Math.random()*ARMORS.length)]);
   if(++n>=16){
     clearInterval(timer);result=pickArmor();showArmor(result);
     el('suEquip').style.display='inline-block';el('suContinue').style.display='inline-block';
     el('suRoll').style.display=P.spins>0?'inline-block':'none';el('suRoll').disabled=false;rolling=false;
   }
 },72);
}
function equip(){
 if(!result)return;
 P.armor={...result};recalcArmorStats();refreshSummonText();
 el('suEquip').textContent='ĐÃ TRANG BỊ';el('suEquip').disabled=true;
 try{hud()}catch{}
}
function close(){
 if(rolling)return;
 wrap.style.display='none';modalOpen=false;on=resumeState;
 try{hud()}catch{}
}
el('suRoll').onclick=roll;el('suEquip').onclick=equip;el('suContinue').onclick=close;

const oldSt=st;
st=function(...args){oldSt(...args);ensureSummonState();P.spins=0;P.armor=null;P.armorAtk=1;refreshSummonText();};

const oldKill=killReward;
killReward=function(e){
 const fresh=!e.rewarded;
 oldKill(e);
 if(fresh)grantSpin(e);
};

const oldDmg=dmg;
dmg=function(e,v,c='#fff',k=0){ensureSummonState();return oldDmg(e,v*(P.armorAtk||1),c,k)};

const oldGain=gainXP;
gainXP=function(v){
 const oldMax=P?.max||0;oldGain(v);ensureSummonState();
 if(P.armor){P.max=Math.round(P.baseMax+((P.lv||1)-1)*12+(P.armor.hp||0));P.armorAtk=1+(P.armor.atk||0);if(P.max>oldMax)P.hp=Math.min(P.max,P.hp+(P.max-oldMax))}
};

const armorPill=document.createElement('div');armorPill.className='pill';armorPill.id='armorPill';document.querySelector('.hud')?.appendChild(armorPill);
const oldHud=hud;
hud=function(){
 oldHud();ensureSummonState();
 armorPill.textContent='Summon '+(P.spins||0)+' · Giáp '+(P.armor?P.armor.rar:'—');
};

const oldHero=hero;
hero=function(){
 oldHero();
 if(!P?.armor)return;
 X.save();X.strokeStyle=P.armor.color;X.lineWidth=4;X.globalAlpha=.9;
 X.strokeRect(P.x+14,P.y+29,26,27);
 X.beginPath();X.moveTo(P.x+14,P.y+31);X.lineTo(P.x+6,P.y+41);X.moveTo(P.x+40,P.y+31);X.lineTo(P.x+48,P.y+41);X.stroke();X.restore();
};

const hint=document.querySelector('.hint');if(hint)hint.textContent='A/D · Space · Click combo · 1/2/3 skill · K dash · R reset · v0.9.0';
ensureSummonState();
})();
