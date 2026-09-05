(()=>{
if(window.__multiverseMenuVisualV101)return;
window.__multiverseMenuVisualV101=true;

const style=document.createElement('style');
style.textContent=`
#menu{
  background:
    radial-gradient(circle at 66% 36%,rgba(61,255,207,.18),transparent 22%),
    radial-gradient(circle at 32% 62%,rgba(35,151,173,.22),transparent 30%),
    linear-gradient(180deg,#041119 0%,#082b34 58%,#031016 100%) !important;
  overflow:hidden;
}
#menu:before{
  content:"";position:absolute;inset:-10%;pointer-events:none;opacity:.7;
  background:
    radial-gradient(ellipse at 75% 8%,rgba(0,0,0,.85) 0 12%,transparent 13%),
    radial-gradient(ellipse at 83% 16%,rgba(0,0,0,.78) 0 10%,transparent 11%),
    radial-gradient(ellipse at 18% 85%,rgba(0,0,0,.65) 0 16%,transparent 17%);
  filter:blur(1px);
}
#menu:after{
  content:"";position:absolute;left:0;right:0;bottom:8%;height:2px;
  background:linear-gradient(90deg,transparent,#8effd9 15%,#8effd9 85%,transparent);
  box-shadow:0 0 24px #63ffd8aa,0 18px 60px #63ffd833;
  opacity:.5;
}
#menu .panel{
  position:relative;z-index:2;width:min(980px,94vw);
  border:0;background:transparent;box-shadow:none;padding:24px 30px 34px;
}
#menu .panel:before{
  content:"";position:absolute;inset:0;z-index:-1;border-radius:26px;
  background:linear-gradient(180deg,rgba(4,18,28,.42),rgba(2,10,16,.18));
  border:1px solid rgba(126,235,226,.12);
  backdrop-filter:blur(3px);
}
#menu h1{
  font-size:clamp(42px,6vw,72px);letter-spacing:-.045em;line-height:.92;
  margin:0 0 10px;text-shadow:0 0 32px rgba(123,255,228,.22);
}
#menu h1:after{
  content:"VISUAL v1.1";display:inline-block;margin-left:12px;vertical-align:middle;
  padding:5px 9px;border:1px solid #7ee9dd55;border-radius:999px;
  font-size:10px;letter-spacing:.16em;color:#9affdf;background:#081c24aa;
}
#menu .panel>p{
  max-width:560px;color:#b8d6dc;font-size:14px;margin:0 0 4px;
}
#menu .grid{
  grid-template-columns:repeat(4,1fr);gap:12px;margin-top:18px;
}
#menu .card{
  min-height:132px;position:relative;overflow:hidden;padding:20px 18px 17px;
  border:1px solid rgba(115,220,210,.22);
  background:linear-gradient(160deg,rgba(16,48,58,.82),rgba(5,20,29,.9));
  box-shadow:0 18px 38px rgba(0,0,0,.2);
  transition:.18s ease;
}
#menu .card:before{
  content:"";position:absolute;width:90px;height:90px;right:-18px;top:-22px;border-radius:50%;
  background:radial-gradient(circle,rgba(101,255,215,.2),transparent 70%);
  transform:scale(.75);transition:.18s ease;
}
#menu .card:hover{
  transform:translateY(-5px);border-color:#8ffff0aa;
  box-shadow:0 18px 50px rgba(0,0,0,.35),0 0 26px rgba(98,255,223,.1);
}
#menu .card:hover:before{transform:scale(1.15)}
#menu .card b{font-size:20px;letter-spacing:-.02em}
#menu .card .sm{color:#aac4c9;line-height:1.45}
#menu .main-summon{
  border-color:#755ba855;background:linear-gradient(135deg,rgba(36,27,65,.9),rgba(19,22,44,.9));
  box-shadow:0 12px 32px rgba(0,0,0,.24);
}
#human,#spirit,#over{
  background:
    radial-gradient(circle at 50% 34%,rgba(66,229,207,.12),transparent 28%),
    linear-gradient(180deg,#04131c,#061b25 60%,#020a10)!important;
}
#human .panel,#spirit .panel,#over .panel{
  border-color:#315b7077;background:linear-gradient(180deg,rgba(8,28,39,.94),rgba(4,15,23,.96));
  box-shadow:0 30px 90px #0008;
}
.menu-mote{
  position:absolute;z-index:1;width:4px;height:4px;border-radius:50%;
  background:#9affc6;box-shadow:0 0 14px #7dffc6;
  animation:menuFloat var(--dur) linear infinite;opacity:.45;pointer-events:none;
}
@keyframes menuFloat{
  0%{transform:translate(var(--x),105vh) scale(.6);opacity:0}
  12%{opacity:.55}
  100%{transform:translate(calc(var(--x) + var(--drift)),-12vh) scale(1.2);opacity:0}
}
.menu-vine{
  position:absolute;z-index:1;pointer-events:none;border:8px solid #06151a;border-left:0;border-bottom:0;
  border-radius:0 100% 0 0;opacity:.9;
}
.menu-vine.v1{right:-40px;top:-80px;width:310px;height:430px;transform:rotate(8deg)}
.menu-vine.v2{left:-90px;bottom:-180px;width:280px;height:360px;transform:rotate(188deg)}
@media(max-width:800px){
  #menu .grid{grid-template-columns:1fr 1fr}
  #menu h1{font-size:44px}
}
`;
document.head.appendChild(style);

const menu=document.getElementById('menu');
if(menu){
  for(let i=0;i<28;i++){
    const m=document.createElement('i');m.className='menu-mote';
    m.style.setProperty('--x',`${(i*37)%96}vw`);
    m.style.setProperty('--drift',`${-40+(i%9)*10}px`);
    m.style.setProperty('--dur',`${7+(i%8)}s`);
    m.style.animationDelay=`-${(i%10)*.7}s`;
    menu.appendChild(m);
  }
  for(const c of ['v1','v2']){const v=document.createElement('i');v.className='menu-vine '+c;menu.appendChild(v)}
}

const hint=document.querySelector('.hint');
if(hint)hint.textContent='A/D · Space · Click combo · 1/2/3 skill · K dash · R reset · VISUAL v1.1';
})();