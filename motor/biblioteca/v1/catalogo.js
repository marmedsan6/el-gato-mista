// Reproductor de revisión. El reloj vive solo aquí; escena.html y recursos.js son puros.
const $=s=>document.querySelector(s),B=window.Biblioteca;
const model={tipo:'explicaciones',id:'mensaje',filtro:'explicaciones',tema:'IA',formato:'largo',t:0,estado:1,playing:!matchMedia('(prefers-reduced-motion: reduce)').matches,capas:{lejos:true,medio:true,brillo:true,delante:true}};
const all=[...B.conceptos.map(r=>({...r,tipo:'explicaciones',conceptos:r.pasos})),...B.registro.map(r=>({...r,tipo:'objetos'})),...B.fondos.map(r=>({...r,tipo:'fondos'}))];
gato($('#marca'),1,0,{t:0});
function nombreTipo(tipo){return {objetos:'OBJETO',fondos:'FONDO',explicaciones:'EXPLICACIÓN'}[tipo];}
function actual(){return all.find(r=>r.id===model.id&&r.tipo===model.tipo);}
function paint(){
  const svg=$('#preview');
  if(model.tipo==='objetos')B.tarjeta(svg,model.id,model.t,model.estado);
  else if(model.tipo==='fondos')B.fondo(svg,model.id,model.t,model.formato,model.capas);
  else B.escena(svg,model.id,model.t,{formato:model.formato,tema:model.tema,capas:model.capas});
  $('#tiempo').value=model.t;$('#reloj').textContent=`${model.t.toFixed(1)} / 6 s`;
  $('#play').textContent=model.playing?'Ⅱ':'▶';$('#play').setAttribute('aria-label',model.playing?'Pausar animación':'Reproducir animación');
  document.querySelectorAll('.step').forEach((n,i)=>n.classList.toggle('active',i===Math.floor(model.t/2)));
}
function inspect(){
  const r=actual(),obj=model.tipo==='objetos',exp=model.tipo==='explicaciones';
  $('#nombre-activo').textContent=r.nombre;$('#tipo-activo').textContent=nombreTipo(model.tipo);
  $('#theme-badge').textContent=exp?model.tema:r.tema;
  $('#descripcion').textContent=r.descripcion||(obj?`Prueba sus estados: ${r.estados.join(', ').toLowerCase()}.`:'Un escenario con profundidad. Activa y desactiva sus capas para explorar la composición.');
  $('#tema-control').hidden=!exp;$('#estado-control').hidden=!obj;$('#formato-control').hidden=obj;$('#capas-control').hidden=obj;
  $('.stage-wrap').classList.toggle('object',obj);
  $('#estado').replaceChildren();if(obj)r.estados.forEach((e,i)=>{const o=new Option(e,String(i));$('#estado').add(o);});$('#estado').value=String(model.estado);
  $('#etiquetas').textContent=(r.conceptos||[]).join(' · ');
  $('#version').textContent=`Colección 1.0${obj?' · '+r.tamano.join(' × ')+' píxeles':''} · Propuesta`;
  $('#pasos').replaceChildren();if(exp)r.pasos.forEach((s,i)=>{const el=document.createElement('div');el.className='step';const n=document.createElement('span');n.textContent=`0${i+1}`;el.append(n,document.createTextNode(s));$('#pasos').append(el);});
  $('#preview').setAttribute('aria-label',`${r.nombre}, ${obj?r.estados[model.estado]:model.formato==='short'?'composición vertical':'composición horizontal'}`);
  paint();
}
function seleccionar(r){model.tipo=r.tipo;model.id=r.id;model.t=0;model.estado=1;if(r.tipo==='explicaciones'){model.tema=r.tema;$('#tema').value=model.tema;}inspect();document.querySelectorAll('.card').forEach(n=>{const chosen=n.dataset.id===r.id&&n.dataset.type===r.tipo;n.classList.toggle('selected',chosen);n.setAttribute('aria-pressed',String(chosen));});}
function listado(){
  const q=$('#buscar').value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,''),tema=$('#filtro-tema').value;
  const lista=all.filter(r=>(model.filtro==='todos'||r.tipo===model.filtro)&&(!tema||r.tema===tema)&&`${r.nombre} ${r.tema} ${r.conceptos.join(' ')}`.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
  const grid=$('#grid');grid.replaceChildren();
  for(const r of lista){const card=document.createElement('button');card.className=`card ${r.tipo}`;card.dataset.id=r.id;card.dataset.type=r.tipo;card.classList.toggle('selected',model.id===r.id&&model.tipo===r.tipo);card.setAttribute('aria-pressed',String(model.id===r.id&&model.tipo===r.tipo));card.setAttribute('aria-label',`${r.nombre} · ${nombreTipo(r.tipo).toLowerCase()}`);
    const vis=document.createElement('div');vis.className='card-visual';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('aria-hidden','true');vis.append(svg);
    if(r.tipo==='objetos')B.tarjeta(svg,r.id,1.25,1);else if(r.tipo==='fondos')B.fondo(svg,r.id,1.25,'largo');else B.escena(svg,r.id,3.4,{tema:r.tema});
    const copy=document.createElement('div');copy.className='card-copy';const k=document.createElement('div');k.className='card-kind';k.textContent=nombreTipo(r.tipo);const tag=document.createElement('span');tag.textContent=r.tema;k.append(tag);const title=document.createElement('h3');title.textContent=r.nombre;const desc=document.createElement('p');desc.textContent=r.tipo==='objetos'?`${r.estados.length} estados · ${r.conceptos.slice(0,2).join(' / ')}`:r.tipo==='fondos'?'4 capas · horizontal y vertical':r.pasos.join(' → ');copy.append(k,title,desc);card.append(vis,copy);card.addEventListener('click',()=>seleccionar(r));grid.append(card);
  }
  $('#resultado').textContent=`${lista.length} ${lista.length===1?'recurso':'recursos'}`;$('#vacio').hidden=lista.length!==0;
}
$('#play').addEventListener('click',()=>{model.playing=!model.playing;paint();});$('#reiniciar').addEventListener('click',()=>{model.t=0;paint();});
$('#tiempo').addEventListener('input',e=>{model.playing=false;model.t=Number(e.target.value);paint();});
$('#tema').addEventListener('change',e=>{model.tema=e.target.value;inspect();});
$('#estado').addEventListener('change',e=>{model.estado=Number(e.target.value);paint();$('#preview').setAttribute('aria-label',`${actual().nombre}, ${actual().estados[model.estado]}`);});
document.querySelectorAll('[data-format]').forEach(n=>n.addEventListener('click',()=>{model.formato=n.dataset.format;document.querySelectorAll('[data-format]').forEach(b=>{b.classList.toggle('active',b===n);b.setAttribute('aria-pressed',String(b===n));});inspect();}));
document.querySelectorAll('[data-layer]').forEach(n=>n.addEventListener('change',()=>{model.capas[n.dataset.layer]=n.checked;paint();}));
document.querySelectorAll('[data-type]').forEach(n=>n.addEventListener('click',()=>{model.filtro=n.dataset.type;document.querySelectorAll('.tabs button').forEach(b=>{b.classList.toggle('active',b===n);b.setAttribute('aria-pressed',String(b===n));});listado();}));
$('#buscar').addEventListener('input',listado);$('#filtro-tema').addEventListener('change',listado);
let ultimo=0,frame=0;function tick(now){const dt=ultimo?(now-ultimo)/1000:0;ultimo=now;if(model.playing&&!document.hidden){model.t=(model.t+Math.min(dt,.15))%6;if(now-frame>80){paint();frame=now;}}requestAnimationFrame(tick);}inspect();listado();requestAnimationFrame(tick);
window.catalogo={model,seleccionar,listado,paint,all};
