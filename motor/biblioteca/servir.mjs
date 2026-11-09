// Servidor local con rutas permitidas; no publica el resto del repositorio.
import {createServer} from 'node:http';
import {createReadStream,statSync} from 'node:fs';
import {resolve,join,extname,sep} from 'node:path';
const root=resolve(import.meta.dirname,'../..');
const allowed=['motor/biblioteca/v1','marca/fuentes','.runtime/biblioteca/v1'].map(p=>join(root,p));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.ttf':'font/ttf','.png':'image/png','.mp4':'video/mp4','.md':'text/plain; charset=utf-8'};
const server=createServer((req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  const url=new URL(req.url,'http://localhost');const pathname=decodeURIComponent(url.pathname);
  const path=resolve(root,'.'+(pathname==='/'?'/motor/biblioteca/v1/index.html':pathname));
  if(!allowed.some(p=>path.startsWith(p+sep))||!mime[extname(path)]){res.writeHead(403).end('Ruta no disponible');return;}
  const stat=statSync(path);if(!stat.isFile()){res.writeHead(404).end();return;}
  const headers={'Content-Type':mime[extname(path)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
  if(req.headers.range){const m=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!m){res.writeHead(416).end();return;}const start=Number(m[1]),end=m[2]?Math.min(Number(m[2]),stat.size-1):stat.size-1;if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});if(req.method==='HEAD')res.end();else createReadStream(path,{start,end}).pipe(res);return;}
  res.writeHead(200,{...headers,'Content-Length':stat.size});if(req.method==='HEAD')res.end();else createReadStream(path).pipe(res);
 }catch{res.writeHead(404).end('No encontrado');}
});
server.listen(Number(process.env.BIBLIOTECA_PORT||0),'127.0.0.1',()=>console.log(`http://127.0.0.1:${server.address().port}/motor/biblioteca/v1/index.html`));
