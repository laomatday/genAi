export function money(value:number){return new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0}).format(value)}
export function compactMoney(value:number){
  if(value>=1_000_000_000)return `${(value/1_000_000_000).toLocaleString("vi-VN",{maximumFractionDigits:1})}B`;
  if(value>=1_000_000)return `${(value/1_000_000).toLocaleString("vi-VN",{maximumFractionDigits:1})}M`;
  return money(value);
}
