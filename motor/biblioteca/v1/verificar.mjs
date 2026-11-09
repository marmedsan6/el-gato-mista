// Comprobaciones de integración del catálogo y del contrato de escena.
import {chromium} from '../../node_modules/playwright/index.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {infracciones} from '../../tests/reglas-escena.mjs';
const root=resolve(import.meta.dirname,'../../..'),dir=import.meta.dirname,out=join(root,'.runtime/biblioteca/v1');mkdirSync(out,{recursive:true});
const sha=s=>createHash('sha256').update(s).digest('hex');
const errors=[],report={};
for(const f of ['recursos.js','escena.js','escena.html'])assert.deepEqual(infracciones(readFileSync(join(dir,f),'utf8')),[],f);
const browser=await chromium.launch({executablePath:join(process.env.USERPROFILE,'AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe')});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(join(dir,'index.html')).href);await page.evaluate(()=>document.fonts.ready);assert.equal(await page.evaluate(()=>[...document.fonts].every(f=>f.status==='loaded')),true,'Fuentes locales sin cargar');
 assert.equal(await page.locator('.card').count(),6);
 await page.locator('[data-type="objetos"]').click();assert.equal(await page.locator('.card').count(),24);
 await page.locator('#buscar').fill('memoria');assert.equal(await page.locator('.card').count(),1);await page.locator('.card').click();assert.equal(await page.locator('#nombre-activo').textContent(),'Caja');
 await page.locator('#estado').selectOption('2');assert.equal(await page.evaluate(()=>catalogo.model.estado),2);
 await page.locator('#buscar').fill('zzzz');assert.equal(await page.locator('#vacio').isVisible(),true);
 await page.locator('#buscar').fill('');await page.locator('[data-type="fondos"]').click();assert.equal(await page.locator('.card').count(),4);
 await page.locator('.card').first().click();await page.locator('[data-layer="lejos"]').uncheck();assert.equal(await page.locator('#preview [data-capa="lejos"]').evaluate(n=>n.style.display),'none');await page.locator('[data-layer="lejos"]').check();
 await page.locator('[data-format="short"]').click();assert.equal(await page.locator('#preview').getAttribute('viewBox'),'0 0 90 160');
 await page.locator('[data-type="explicaciones"]').click();await page.locator('.card').first().click();await page.locator('#tema').selectOption('Ciencia');assert.equal(await page.locator('#theme-badge').textContent(),'Ciencia');
 await page.locator('#filtro-tema').selectOption('Videojuegos');assert.equal(await page.locator('.card').count(),2);await page.locator('#filtro-tema').selectOption('');
 await page.locator('[data-format="largo"]').click();await page.locator('#tema').selectOption('IA');
 await page.locator('#tiempo').fill('3.5');assert.equal(await page.evaluate(()=>catalogo.model.playing),false);
 await page.screenshot({path:join(out,'catalogo.png'),fullPage:true});
 const bounds=await page.evaluate(()=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');document.body.append(s);const bad=[];for(const r of Biblioteca.registro)for(let e=0;e<3;e++)for(const t of [0,.4,1.2,2.7,5.9]){s.replaceChildren();r.pintar(s,0,0,t,e);const b=s.getBBox();if(b.x<0||b.y<0||b.x+b.width>r.tamano[0]||b.y+b.height>r.tamano[1])bad.push({id:r.id,e,t,box:[b.x,b.y,b.width,b.height],size:r.tamano});}s.remove();return bad;});report.limitesObjetos=bounds;
 await page.locator('[data-type="objetos"]').click();await page.screenshot({path:join(out,'objetos.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:join(out,'catalogo-movil.png'),fullPage:true});
 report.interacciones='OK: pestañas, búsqueda, vacío, filtro, selección, estado, capas, formato, tema y tiempo';
 const scene=await browser.newPage({viewport:{width:640,height:360}});scene.on('pageerror',e=>errors.push(e.message));
 await scene.addInitScript(()=>{for(const [o,k]of [[window,'setTimeout'],[window,'setInterval'],[window,'requestAnimationFrame'],[Date,'now'],[performance,'now']])o[k]=()=>{throw Error('Reloj prohibido: '+k);};});
 await scene.goto(pathToFileURL(join(dir,'escena.html')).href);await scene.evaluate(()=>document.fonts.ready);assert.equal(await scene.evaluate(()=>[...document.fonts].every(f=>f.status==='loaded')),true,'Fuente de escena sin cargar');
 report.combinaciones=await scene.evaluate(()=>{const s=document.querySelector('svg');let count=0;for(const concepto of Biblioteca.conceptos)for(const formato of ['largo','short'])for(const tema of ['IA','Ciencia','Videojuegos'])for(const t of [0,2.5,5.5]){Biblioteca.escena(s,concepto.id,t,{tema,formato});const a=s.outerHTML;Biblioteca.escena(s,concepto.id,1.1,{tema,formato});Biblioteca.escena(s,concepto.id,t,{tema,formato});if(a!==s.outerHTML)throw Error('No determinista: '+concepto.id);count++;}return count;});
 await scene.evaluate(()=>seek(3.5));const a=await scene.screenshot();await scene.evaluate(()=>seek(.1));await scene.evaluate(()=>seek(3.5));assert.equal(sha(a),sha(await scene.screenshot()));report.pngDeterminista=true;
 for(const formato of ['largo','short']){await scene.setViewportSize(formato==='largo'?{width:640,height:360}:{width:360,height:640});for(const [id,t] of [['mensaje',3.5],['memoria',5.5],['buscar',5.5],['acceso',5.5],['comparar',4.5],['ciclo',3.5]]){await scene.evaluate(({id,t,formato})=>Biblioteca.escena(document.querySelector('svg'),id,t,{formato}),{id,t,formato});await scene.screenshot({path:join(out,`${formato}-${id}.png`)});}}
 report.errores=errors;writeFileSync(join(out,'verificacion.json'),JSON.stringify(report,null,2));assert.deepEqual(bounds,[],'Objetos fuera de sus límites nativos');assert.deepEqual(errors,[],'Errores del navegador');console.log(JSON.stringify(report));
}finally{await browser.close();}
