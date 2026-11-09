// Biblioteca piloto v1. Dibujo puro: todo depende de t, estado y parámetros.
// Las copias de base/ conservan los recursos de los vídeos existentes.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const estados = ['Reposo', 'En marcha', 'Resultado'];
  const registro = [];
  function llaveAtlas(s,x,y){
    rect(s,x+1,y,5,7,P3.contorno);rect(s,x,y+1,7,5,P3.contorno);
    rect(s,x+1,y+1,5,5,P3.dorado);rect(s,x+2,y+2,3,3,P3.contorno);rect(s,x+1,y+1,4,1,P3.crema);
    rect(s,x+6,y+2,11,4,P3.contorno);rect(s,x+5,y+3,11,2,P3.dorado);rect(s,x+6,y+3,10,1,P3.crema);
    for(const dx of [12,15]){rect(s,x+dx,y+5,2,3,P3.contorno);rect(s,x+dx,y+5,1,2,P3.dorado);}
  }
  function cajaFuerteAtlas(s,x,y,t,e){cajaFuerte3(s,x,y,t,{abierta:e===2,alarma:e===1});if(e===2){rect(s,x+15,y+1,6,12,P3.contorno);rect(s,x+16,y+2,4,10,P3.metal);rect(s,x+16,y+2,1,10,P3.metalLuz);rect(s,x+18,y+6,1,2,P3.dorado);}}
  const add = (id, nombre, tema, conceptos, tamano, pintar, variantes = estados) => registro.push({id,nombre,tema,conceptos,tamano,pintar,estados:variantes,version:'1.0.0',origen:'Dibujo propio · El Gato Mista'});
  add('mista','MISTA','Común',['narrador','reacción'],[32,34],(s,x,y,t,e)=>gato(s,x,y,{t,pose:['pie','senalar','celebrar'][e],hablando:e===1}),['Escucha','Explica','Celebra']);
  add('robot','Robot agente','IA',['agente','trabajo','error'],[12,15],(s,x,y,t,e)=>robot3(s,x+1,y+2,t,{cara:['dormido','pensar','error'][e],trabaja:e===1,herramienta:e===1}),['Espera','Trabaja','Error']);
  add('cerebro','Cerebro','IA',['modelo','pensamiento'],[11,9],(s,x,y,t,e)=>{cerebro3(s,x+1,y+1,t,{brilla:e>0});if(e===2)check3(s,x+8,y,P3.verde);});
  add('bucle','Bucle','IA',['proceso','repetición','error'],[11,11],(s,x,y,t,e)=>bucle3(s,x+1,y+1,t,{gira:e===1,roto:e===2}),['Preparado','Iterando','Interrumpido']);
  add('cartucho','Cartucho','Videojuegos',['skill','habilidad','carga'],[9,12],(s,x,y,t,e)=>{cartucho3(s,x+1,y+1+(e===1?Math.floor(t*3)%2:0),[P3.azul,P3.naranja,P3.verde][e]);if(e===2)check3(s,x+5,y,P3.verde);},['Disponible','Cargando','Equipado']);
  add('moneda','Moneda','Videojuegos',['recompensa','valor'],[9,10],(s,x,y,t,e)=>{moneda3(s,x+2,y+3-(e===1?Math.floor(t*4)%3:0));if(e===2){rect(s,x,y+7,9,1,P3.dorado);rect(s,x+4,y,1,1,P3.blanco);}},['Guardada','Recogida','Recompensa']);
  add('caja-fuerte','Caja fuerte','IA',['seguridad','acceso'],[23,17],(s,x,y,t,e)=>cajaFuerteAtlas(s,x+1,y+2,t,e),['Cerrada','Alarma','Abierta']);
  add('ingeniero','Ingeniero','IA',['persona','trabajo'],[13,18],(s,x,y,t,e)=>ingeniero3(s,x+2,y+2,t,{portatil:e!==0,pillado:e===2}),['Espera','Trabaja','Sorpresa']);
  add('extension','Extensión','IA',['software','puerta','seguridad'],[17,15],(s,x,y,t,e)=>extension3(s,x+1,y+3,t,{puerta:e}),['Cerrada','Entreabierta','Abierta']);
  add('llave','Llave','Videojuegos',['acceso','permiso'],[21,15],(s,x,y,t,e)=>{llaveAtlas(s,x+2,y+2-(e===1?Math.floor(t*2)%2:0));if(e===2)check3(s,x+15,y+11,P3.verde);},['Preparada','Usando','Acceso']);
  add('reloj','Reloj','Común',['tiempo','espera'],[13,13],(s,x,y,t,e)=>reloj3(s,x+1,y+1,e===0?0:t,{velocidad:e===2?3:1}),['Detenido','En marcha','Acelerado']);
  add('chip','Chip','IA',['procesamiento','cómputo'],[14,14],(s,x,y,t,e)=>{chip3(s,x+2,y+2,e===0?0:t);if(e===2)check3(s,x+10,y,P3.verde);});
  add('terminal','Terminal','IA',['código','respuesta'],[23,17],(s,x,y,t,e)=>terminal3(s,x+1,y+1,e===0?0:t,{color:e===2?P3.verde:P3.azul}),['Espera','Procesa','Responde']);
  add('matraz','Matraz','Ciencia',['experimento','reacción'],[11,16],(s,x,y,t,e)=>matraz3(s,x+2,y+5,t,{activo:e===1,color:[P3.azul,P3.naranja,P3.verde][e]}),['Preparado','Reacción','Resultado']);
  add('microscopio','Microscopio','Ciencia',['observar','analizar'],[13,14],(s,x,y,t,e)=>{microscopio3(s,x+1,y+2,{activo:e>0});if(e===2)check3(s,x+9,y,P3.verde);},['Reposo','Observando','Hallazgo']);
  add('reactivo','Reactivo','Ciencia',['sustancia','mezcla'],[7,10],(s,x,y,t,e)=>{bote3(s,x+2,y+4,[P3.azul,P3.naranja,P3.verde][e]);if(e===1)rect(s,x+3,y+2-Math.floor(t*3)%2,1,1,P3.blanco);},['Preparado','Mezcla','Resultado']);
  add('documento','Documento','Común',['información','archivo','búsqueda'],[12,16],(s,x,y,t,e)=>papel3(s,x+2,y+4,t,{activo:e===1,sello:e===2?P3.verde:null}),['Archivado','En tránsito','Validado']);
  add('caja','Caja','Común',['memoria','almacén','paquete'],[16,13],(s,x,y,t,e)=>{caja3(s,x+2,y+3,t,{activo:e===1});if(e===2)check3(s,x+7,y+5,P3.verde);},['Guardada','Recibiendo','Completa']);
  add('libros','Libros','Común',['conocimiento','fuentes'],[15,12],(s,x,y,t,e)=>{libros3(s,x+1,y+4);if(e===1)rect(s,x+2+Math.floor(t*3)%8,y+1,2,1,P3.dorado);if(e===2)check3(s,x+10,y,P3.verde);},['Biblioteca','Consulta','Encontrado']);
  add('taza','Taza','Común',['espera','ambiente'],[9,13],(s,x,y,t,e)=>taza3(s,x+1,y+7,e===0?0:t*(e===2?1.5:1)),['Quieta','Vapor','Vapor rápido']);
  add('lupa','Lupa','Común',['búsqueda','revisión'],[16,15],(s,x,y,t,e)=>{lupa3(s,x+1+(e===1?Math.floor(t*3)%3:0),y+1);if(e===2)check3(s,x+3,y+3,P3.verde);},['Preparada','Buscando','Encontrado']);
  add('raton','Ratón de laboratorio','Ciencia',['organismo','observación'],[12,10],(s,x,y,t,e)=>{raton3(s,x+2,y+4,t,{activo:e===1});if(e===2)check3(s,x+8,y,P3.verde);},['Reposo','Movimiento','Observado']);
  add('jaula','Hábitat de laboratorio','Ciencia',['experimento','organismo'],[32,25],(s,x,y,t,e)=>{jaula3(s,x+1,y+1,t,{activo:e===1});if(e===2)check3(s,x+26,y+22,P3.verde);},['Reposo','Rueda activa','Observación']);
  add('monitor','Monitor','Común',['pantalla','datos','comparación'],[22,18],(s,x,y,t,e)=>monitor3(s,x+1,y+1,20,13,{dibujo:(g,a,b,w,h)=>{if(e>0)for(let k=0;k<3;k++)rect(g,a+2+k*4,b+h-2-((k+1)*2),2,(k+1)*2,e===2?P3.verde:P3.azul);if(e===1)rect(g,a+1+Math.floor(t*5)%(w-2),b+1,1,1,P3.blanco);}}),['Apagado','Leyendo','Comparativa']);

  const fondos = [
    {id:'despacho',nombre:'Despacho de MISTA',tema:'Común',conceptos:['conocimiento','memoria','trabajo']},
    {id:'laboratorio',nombre:'Laboratorio',tema:'Ciencia',conceptos:['experimento','observación']},
    {id:'servidores',nombre:'Sala de servidores',tema:'IA',conceptos:['procesamiento','red']},
    {id:'azotea',nombre:'Azotea nocturna',tema:'Videojuegos',conceptos:['mundo','exploración','ciudad']}
  ];
  const conceptos = [
    {id:'mensaje',nombre:'Petición y respuesta',descripcion:'Un mensaje viaja, se procesa y vuelve.',pasos:['Enviar','Procesar','Responder'],objetos:['documento','robot'],tema:'IA'},
    {id:'memoria',nombre:'Llenar una memoria',descripcion:'Un espacio admite información hasta alcanzar su límite.',pasos:['Hay espacio','Se llena','No cabe más'],objetos:['caja','documento'],tema:'IA'},
    {id:'buscar',nombre:'Buscar y encontrar',descripcion:'Una búsqueda recorre varias opciones y encuentra una.',pasos:['Explorar','Comparar','Encontrar'],objetos:['libros','lupa'],tema:'Ciencia'},
    {id:'acceso',nombre:'Abrir un acceso',descripcion:'Una llave cambia el estado de una puerta o un permiso.',pasos:['Bloqueado','Validar llave','Acceso abierto'],objetos:['caja-fuerte','llave'],tema:'Videojuegos'},
    {id:'comparar',nombre:'Comparar resultados',descripcion:'Dos alternativas se muestran con la misma escala.',pasos:['Opción A','Opción B','Comparar'],objetos:['monitor','matraz'],tema:'Ciencia'},
    {id:'ciclo',nombre:'Recorrer un ciclo',descripcion:'Preparar, actuar y comprobar; después, repetir.',pasos:['Preparar','Actuar','Comprobar'],objetos:['robot','cartucho'],tema:'Videojuegos'}
  ];
  const group = (parent,attrs={}) => {const g=document.createElementNS(NS,'g');for(const [k,v]of Object.entries(attrs))g.setAttribute(k,v);parent.append(g);return g;};
  function text(svg,x,y,value,size=4,color='#f5f7fb',anchor='start'){
    const n=document.createElementNS(NS,'text');Object.entries({x,y,fill:color,'font-family':'Mono','font-size':size,'font-weight':600,'text-anchor':anchor}).forEach(([k,v])=>n.setAttribute(k,v));n.textContent=value;svg.append(n);return n;
  }
  function objeto(svg,id,x,y,t,estado=1){const r=registro.find(a=>a.id===id);r.pintar(svg,Math.round(x),Math.round(y),t,Math.max(0,Math.min(2,estado)));}
  function tarjeta(svg,id,t,estado=1){svg.replaceChildren();const r=registro.find(a=>a.id===id),w=Math.max(20,r.tamano[0]+4),h=Math.max(20,r.tamano[1]+4);svg.setAttribute('viewBox',`0 0 ${w} ${h}`);objeto(svg,id,(w-r.tamano[0])/2,(h-r.tamano[1])/2,t,estado);}
  function fondo(svg,id,t,formato='largo',visibles={}){
    const W=formato==='short'?90:160,H=formato==='short'?160:90;
    svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const capas={};for(const n of ['lejos','medio','brillo','delante'])capas[n]=group(svg,{'data-capa':n,style:visibles[n]===false?'display:none':''});
    capas.lejos.style.filter='blur(0.8px)';capas.delante.style.filter='blur(1px)';capas.brillo.style.filter='blur(0.65px)';capas.brillo.style.opacity='.28';
    const opts=formato==='short'?{suelo:118,mesa:103}:{suelo:66,mesa:58,mesaX:0,fondoMesa:3};
    if(formato==='short')escenario3(id,capas,t,opts);
    else ({laboratorio:laboratorioH,despacho:despachoH,servidores:servidoresH,azotea:azoteaH}[id])(capas,t,opts);
    return {W,H,capas};
  }
  const temas={IA:{fondo:'servidores',actor:'robot',pieza:'documento',c:'#5b8cff'},Ciencia:{fondo:'laboratorio',actor:'microscopio',pieza:'matraz',c:'#1fd69a'},Videojuegos:{fondo:'azotea',actor:'robot',pieza:'cartucho',c:'#ff8a3d'}};
  function escena(svg,id,t,opciones={}){
    const formato=opciones.formato||'largo',short=formato==='short',concepto=conceptos.find(c=>c.id===id)||conceptos[0];
    const tema=opciones.tema||concepto.tema,cfg=temas[tema],{W,H,capas}=fondo(svg,opciones.fondo||cfg.fondo,t,formato,opciones.capas);
    const fg=group(svg,{'data-capa':'explicacion'}), fase=Math.min(2,Math.floor((t%6)/2)), f=(t%2)/2;
    // Composición independiente: pizarra arriba y MISTA abajo en vertical; a su lado en horizontal.
    const x=short?7:51,y=short?40:27,w=short?68:99,h=short?37:34;
    rect(fg,x,y,w,h,P3.contorno);rect(fg,x+1,y+1,w-2,h-2,'#1c2436');rect(fg,x+1,y+1,w-2,1,P3.metalLuz);
    const a=x+7,b=x+w-23,cy=y+11;
    if(id==='mensaje'){
      objeto(fg,cfg.actor,b,cy,t,fase===1?1:0);
      const dx=fase===0?a+Math.round(f*(b-a-15)):fase===1?b-15:b-15-Math.round(f*(b-a-15));
      objeto(fg,cfg.pieza,dx,cy,t,fase===1?1:fase===2?2:0);
      linea(fg,a+3,cy+18,b+3,cy+18,P3.metalLuz);rect(fg,dx+3,cy+18,2,1,cfg.c);
    } else if(id==='memoria'){
      const cells=6,count=Math.min(7,Math.floor((t%6)*1.4));
      for(let k=0;k<cells;k++){rect(fg,x+6+k*(short?8:13),y+11,short?7:11,13,P3.metalSombra);if(k<count)rect(fg,x+7+k*(short?8:13),y+12,short?5:9,11,cfg.c);}
      text(fg,x+6,y+7,'CAPACIDAD',3);if(count>6){objeto(fg,cfg.pieza,x+w-18,y+9,t,1);aspa3(fg,x+w-9,y+7,P3.rojo);}
    } else if(id==='buscar'){
      for(let k=0;k<3;k++)objeto(fg,cfg.pieza,x+8+k*(short?17:27),y+10,t,0);
      const k=fase===2?2:Math.floor((t%4)*1.5)%3;
      objeto(fg,'lupa',x+7+k*(short?17:27),y+6,t,fase===2?2:0);
    } else if(id==='acceso'){
      objeto(fg,'caja-fuerte',b,cy-1,t,fase===2?2:0);
      objeto(fg,'llave',fase===1?a+Math.round(f*(b-a-21)):a,cy,t,fase===2?2:0);
      if(fase===2)check3(fg,b-8,cy+2,P3.verde);
    } else if(id==='comparar'){
      const vals=opciones.valores||[35,70],max=Math.max(1,...vals),bh=18;
      for(let k=0;k<2;k++){const bx=x+12+k*(short?29:42),val=vals[k],q=k===0?1:fase>0?Math.min(1,(t%6-2)*2):0,ht=Math.round(bh*val/max*q);rect(fg,bx,y+7,12,bh,'#111725');if(ht)rect(fg,bx,y+7+bh-ht,12,ht,k?P3.verde:cfg.c);text(fg,bx+6,y+31,k?'B':'A',3,P3.blanco,'middle');if(q>0)text(fg,bx+6,y+5,String(val),3,P3.blanco,'middle');}
    } else if(id==='ciclo'){
      const ids=[cfg.pieza,cfg.actor,'bucle'];for(let k=0;k<3;k++){const bx=x+7+k*(short?19:30);if(k===fase)rect(fg,bx-2,y+6,19,21,P3.metalLuz);objeto(fg,ids[k],bx,y+9,t,k===fase?1:0);}
    }
    const actor=group(svg,{'data-capa':'mista'});gato(actor,short?12:10,short?77:30,{pose:fase===2?(id==='memoria'?'sorpresa':'celebrar'):'senalar',t});
    const ui=group(svg,{'data-capa':'rotulos'});
    rect(ui,short?6:7,short?23:5,short?69:111,short?13:12,'#111725');
    text(ui,short?8:10,short?31:13,concepto.nombre,short?3.3:4.1);
    text(ui,short?8:10,short?37:19,`${tema.toUpperCase()} · EJEMPLO ILUSTRATIVO`,short?2.1:2.4,'#c3cbd9');
    const dy=short?111:71,dh=short?16:14;
    rect(ui,short?5:6,dy,short?70:148,dh,'#141c2c');rect(ui,short?5:6,dy,1,dh,cfg.c);
    const retrato=group(ui,{transform:`translate(${short?8:10} ${dy+3}) scale(0.5)`});retratoGato(retrato,0,0,{t,hablando:false});
    text(ui,short?20:23,dy+5,'MISTA',2.6,P3.naranja);
    text(ui,short?20:23,dy+11,concepto.pasos[fase],short?3.6:4);
    return {fase,concepto,tema,W,H};
  }
  window.Biblioteca={registro,fondos,conceptos,temas,tarjeta,fondo,escena,objeto,text,version:'1.0.0'};
})();
