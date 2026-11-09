const consultaBiblioteca=new URLSearchParams(location.search);
const svgBiblioteca=document.querySelector('#escena');
window.seek=function(t){
  if(!Number.isFinite(t)||t<0)throw new Error('Tiempo inválido');
  t=Math.floor(t*12)/12;
  const demo=consultaBiblioteca.get('demo')==='1',i=Math.floor(t/6)%6;
  const id=demo?Biblioteca.conceptos[i].id:consultaBiblioteca.get('concepto')||'mensaje';
  const formato=consultaBiblioteca.get('formato')||'largo',opts={formato,tema:consultaBiblioteca.get('tema')||undefined};
  if(demo&&t>=6&&t%6<.4){
    const W=formato==='short'?90:160,H=formato==='short'?160:90,dx=Math.round(W*(t%6)/.4);
    svgBiblioteca.replaceChildren();svgBiblioteca.setAttribute('viewBox',`0 0 ${W} ${H}`);
    for(const [cid,x,tiempo]of [[Biblioteca.conceptos[(i+5)%6].id,-dx,5.9],[id,W-dx,t]]){
      const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('x',x);s.setAttribute('width',W);s.setAttribute('height',H);svgBiblioteca.append(s);Biblioteca.escena(s,cid,tiempo,opts);
    }
  }else Biblioteca.escena(svgBiblioteca,id,t,opts);
};
window.claveFotograma=t=>String(Math.floor(t*12));
window.seek(0);
