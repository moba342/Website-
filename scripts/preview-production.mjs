import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {brotliCompressSync,gzipSync,constants} from 'node:zlib';
const args=process.argv.slice(2),port=Number(args[args.indexOf('--port')+1])||4173,root=resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8'};
createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost'),host=req.headers.host?.split(':')[0],pathname=decodeURIComponent(url.pathname);
 if(['cloudssupply.site','buyaws-account.vercel.app'].includes(host)){res.writeHead(308,{Location:'https://www.cloudssupply.site'+pathname+url.search});res.end();return;}
 if(pathname==='/home/'||pathname==='/home'){res.writeHead(308,{Location:'/'+url.search});res.end();return;}
 let path=resolve(root,'.'+pathname);if(!path.startsWith(root+'/')&&path!==root){res.writeHead(403);res.end();return;}
 let info;try{info=await stat(path);}catch{}
 if(info?.isDirectory()){if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'+url.search});res.end();return;}path=resolve(path,'index.html');}
 let content,status=200;try{content=await readFile(path);}catch{content=await readFile(resolve(root,'404.html'));path=resolve(root,'404.html');status=404;}
 const headers={'Content-Type':mime[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Vary':'Accept-Encoding'};
 const accept=req.headers['accept-encoding']||'';if(/\.(html|js|css|svg|xml|txt|json)$/.test(path)){if(accept.includes('br')){content=brotliCompressSync(content,{params:{[constants.BROTLI_PARAM_QUALITY]:5}});headers['Content-Encoding']='br';}else if(accept.includes('gzip')){content=gzipSync(content);headers['Content-Encoding']='gzip';}}
 headers['Content-Length']=content.length;res.writeHead(status,headers);res.end(req.method==='HEAD'?undefined:content);
 }catch{res.writeHead(500);res.end('Preview server error');}
}).listen(port,'127.0.0.1',()=>console.log('Production preview: http://localhost:'+port));
