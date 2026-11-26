import {spawnSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
const origin=process.argv[2]||'http://localhost:4173',label=process.argv[3]||'local',canonical='https://www.cloudssupply.site';
const manifest=JSON.parse(await readFile('seo/evidence/page-manifest.json','utf8')),pages=[];
const hash=s=>createHash('sha256').update(s).digest('hex');
function walk(n,fn){fn(n);for(const c of n.childNodes||[])walk(c,fn);}
function elements(n,tag){const out=[];walk(n,c=>{if(c.tagName===tag)out.push(c)});return out;}
const attrs=n=>Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value]));
function text(n){if(!n)return '';if(['script','style'].includes(n.tagName))return '';return(n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join(' ')).replace(/\s+/g,' ').trim();}
const normalize=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function request(url,follow=false,method='GET'){
 const args=['-sS','--max-time','30',...(method==='HEAD'?['-I']:['-D','-']),...(follow?['-L','--max-redirs','5']:[]),'-w','\n__FINAL_URL__=%{url_effective}',url];
 const r=spawnSync('curl',args,{encoding:'utf8',maxBuffer:5*1024*1024});
 if(r.status!==0)return {url,error:r.stderr,status:null};
 const effectiveUrl=r.stdout.match(/\n__FINAL_URL__=(.*)$/)?.[1],raw=r.stdout.replace(/\n__FINAL_URL__=.*$/,'');
 const chunks=raw.split(/\r?\n\r?\n/),headers=[];while(chunks[0]?.startsWith('HTTP/'))headers.push(chunks.shift());
 const body=chunks.join('\n\n'),last=headers.at(-1)||'';
 return {url,effectiveUrl,status:Number(last.match(/HTTP\/\S+ (\d+)/)?.[1]),headers:last,chain:headers.map(h=>({status:Number(h.match(/HTTP\/\S+ (\d+)/)?.[1]),location:h.match(/\nlocation:\s*([^\r\n]+)/i)?.[1]||null})),body};
}
const assets=new Set(),known=new Set(manifest.map(p=>p.path)),pageSet=new Set(manifest.filter(p=>p.type!=='utility').map(p=>canonical+p.path));
for(const p of manifest){
 const r=request(origin+p.path),issues=[];
 if(r.status!==200)issues.push('HTTP '+r.status);
 const doc=parse(r.body||''),head=elements(doc,'head')[0],main=elements(doc,'main')[0],metas=elements(head,'meta').map(attrs),h1=elements(main,'h1'),links=elements(head,'link').map(attrs).filter(a=>a.rel==='canonical'),visible=text(main);
 if(text(elements(head,'title')[0])!==p.title)issues.push('title mismatch');if(metas.find(a=>a.name==='description')?.content!==p.description)issues.push('description mismatch');if(h1.length!==1||text(h1[0])!==p.h1)issues.push('H1 mismatch');
 if(links.length!==1||links[0].href!==canonical+p.path)issues.push('canonical mismatch');if(metas.find(a=>a.name==='robots')?.content!==p.robots)issues.push('robots mismatch');if(/x-robots-tag:\s*noindex/i.test(r.headers||'')&&p.type!=='utility')issues.push('public noindex header');
 if(metas.find(a=>a.property==='og:type')?.content!==p.socialType)issues.push('social page type mismatch');
 if(hash(visible)!==p.visibleHash)issues.push('visible content differs from tested production build');
 if(p.primary&&!normalize(visible).includes(normalize(p.primary)))issues.push('primary keyword not visible');
 for(const secondary of p.secondary||[])if(!normalize(visible).includes(normalize(secondary)))issues.push('secondary keyword not visible: '+secondary);
 for(const node of [...elements(head,'script'),...elements(head,'link')]){const a=attrs(node),url=a.src||a.href;if(url?.startsWith('/'))assets.add(url.split('?')[0]);}
 const graph=[];for(const script of elements(head,'script'))if(attrs(script).type==='application/ld+json')try{graph.push(...JSON.parse((script.childNodes||[]).map(c=>c.value||'').join(''))['@graph']);}catch{issues.push('invalid JSON-LD');}
 if(hash(JSON.stringify(graph))!==p.schemaHash)issues.push('schema differs from validated build');
 for(const image of elements(doc,'img')){const a=attrs(image);if(!('alt' in a))issues.push('missing image alt');if(a.src?.startsWith('/'))assets.add(a.src.split('?')[0]);}
 for(const link of elements(doc,'a').map(attrs)){if(!link.href?.startsWith('/')||link.href.startsWith('//'))continue;const path=link.href.split('#')[0].split('?')[0];if(path&&!known.has(path))assets.add(path);}
 pages.push({path:p.path,status:r.status,result:issues.length?'FAIL':'PASS',issues,error:r.error||null});
}
const missing=request(origin+'/nonexistent-seo-test-route/'),files=[];
for(const path of ['/robots.txt','/sitemap_index.xml','/pages-sitemap.xml','/providers-sitemap.xml','/products-sitemap.xml','/googlee9c6c6adb26b90ba.html']){const r=request(origin+path);files.push({path,status:r.status,body:r.body,error:r.error});}
const assetResults=[];for(const path of assets){const r=request(origin+path,false,'HEAD');assetResults.push({path,status:r.status,error:r.error||null});}
const redirects=[],candidates=label==='live'?['https://buyaws-account.vercel.app/','http://cloudssupply.site/','https://cloudssupply.site/','http://www.cloudssupply.site/','https://cloudssupply.site/product/aws-32-vcpu-103/?utm_source=seo-test','https://buyaws-account.vercel.app/product/aws-32-vcpu-103/?utm_source=seo-test',origin+'/home/?utm_source=seo-test',origin+'/product/aws-32-vcpu-103']: [origin+'/home/?utm_source=seo-test',origin+'/product/aws-32-vcpu-103'];
for(const url of candidates){const r=request(url,true,'HEAD');redirects.push({url,status:r.status,effectiveUrl:r.effectiveUrl,chain:r.chain,error:r.error||null,loop:!!r.error?.includes('redirect')});}
const xp=new XMLParser(),sitemapUrls=[];let sitemapValid=true;
for(const f of files.filter(f=>/\/(pages|providers|products)-sitemap.xml/.test(f.path))){if(XMLValidator.validate(f.body||'')!==true){sitemapValid=false;continue;}const entries=xp.parse(f.body).urlset.url;for(const p of Array.isArray(entries)?entries:[entries])sitemapUrls.push(p.loc);}
const sitemapIndex=files.find(f=>f.path==='/sitemap_index.xml')?.body||'';
let indexValid=XMLValidator.validate(sitemapIndex)===true;
if(indexValid){const entries=xp.parse(sitemapIndex).sitemapindex?.sitemap;const children=(Array.isArray(entries)?entries:[entries]).filter(Boolean).map(s=>s.loc);indexValid=children.length===3&&['pages','providers','products'].every(name=>children.includes(canonical+'/'+name+'-sitemap.xml'));}
const failures=pages.filter(p=>p.result!=='PASS').map(p=>({path:p.path,issues:p.issues}));
if(!indexValid)failures.push({reason:'Live sitemap index XML/origin mismatch'});
if(missing.status!==404||!missing.body?.includes('noindex, follow'))failures.push({path:'/nonexistent-seo-test-route/',reason:'Expected genuine noindex 404'});
if(!sitemapValid||sitemapUrls.length!==pageSet.size||new Set(sitemapUrls).size!==pageSet.size||sitemapUrls.some(url=>!pageSet.has(url)))failures.push({reason:'Live sitemap membership mismatch'});
if(files.some(f=>f.status!==200))failures.push({reason:'Required robots/sitemap/verification file missing'});
if(!files.find(f=>f.path==='/robots.txt')?.body.includes('Sitemap: '+canonical+'/sitemap_index.xml'))failures.push({reason:'robots.txt sitemap mismatch'});
for(const a of assetResults)if(a.status!==200)failures.push({path:a.path,reason:'Missing linked asset'});
for(const r of redirects){if(r.status!==200||r.error||!r.chain?.slice(0,-1).every(h=>[301,308].includes(h.status)))failures.push({url:r.url,reason:'TLS/redirect chain failed'});if(r.effectiveUrl&&r.url.includes('utm_source=')&&!r.effectiveUrl.includes('utm_source=seo-test'))failures.push({url:r.url,reason:'Query parameter not preserved'});}
const aliasUtilities=[];if(label==='live')for(const path of ['/cart/','/checkout/']){const r=request('https://buyaws-account.vercel.app'+path);aliasUtilities.push({path,status:r.status,noindex:r.body?.includes('noindex, follow')});if(r.status!==200||!r.body?.includes('noindex, follow'))failures.push({path,reason:'Existing alias browser-local cart/order route was not preserved'});}
const results={origin,label,pages,missingPage:{status:missing.status,noindex:missing.body?.includes('noindex, follow')},files,assets:assetResults,redirects,aliasUtilities,indexValid,sitemapValid,sitemapCount:sitemapUrls.length,failures};
await writeFile('seo/evidence/http-'+label+'.json',JSON.stringify(results,null,2)+'\n');console.log(label+' HTTP/content audit:',pages.length,'routes;',failures.length,'failures; assets:',assetResults.length,'; sitemap:',sitemapUrls.length,'; 404:',missing.status);
if(failures.length){console.error(JSON.stringify(failures.slice(0,12)));process.exitCode=1;}
