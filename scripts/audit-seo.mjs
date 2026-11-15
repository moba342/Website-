import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {seoPages,metadataFor} from '../.ssr/entry-server.js';
const aws=JSON.parse(await readFile('src/aws-products.json','utf8'));
const cloud=JSON.parse(await readFile('src/cloud-service-products.json','utf8'));
const starters=JSON.parse(await readFile('src/starter-products.json','utf8'));
const productsById=new Map([...aws,...cloud.flatMap(p=>p.variants),...starters].map(p=>[String(p.id),p]));
const failures=[],titles=new Set(),descriptions=new Set(),rows=[];
const xmlEscape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=s=>s.replace(/<[^>]+>/g,' ').replaceAll('&amp;','&').replace(/\s+/g,' ').trim();
const fileFor=path=>resolve('dist','.'+path,'index.html');
for(const page of seoPages){
 const meta=metadataFor(page.route),html=await readFile(fileFor(page.path),'utf8');
 const check=(ok,issue)=>{if(!ok)failures.push(page.path+': '+issue)};
 const headings=[...html.matchAll(/<h1(?:\s[^>]*)?>(.*?)<\/h1>/gs)];
 check(headings.length===1,'expected one H1');
 check((html.match(/<title>/g)||[]).length===1,'expected one title');
 check(html.includes('<title>'+xmlEscape(meta.title)+'</title>'),'title does not match metadata');
 check(html.includes('name="description" content="'+xmlEscape(meta.description)+'"'),'missing description');
 check(!titles.has(meta.title),'duplicate title');titles.add(meta.title);
 check(!descriptions.has(meta.description),'duplicate description');descriptions.add(meta.description);
 check((html.match(/rel="canonical"/g)||[]).length===1&&html.includes('rel="canonical" href="'+meta.url+'"'),'invalid canonical');
 check(!html.includes('content="noindex'),'unexpected noindex');
 const schema=JSON.parse(html.match(/id="page-schema">(.*?)<\/script>/s)?.[1]||'null');
 check(!!schema,'missing structured data');
 const graph=schema?.['@graph']||[];
 if(page.type==='product'){
  const item=graph.find(item=>item['@type']==='Product');
  check(!!item,'missing Product structured data');
  const original=productsById.get(item?.sku);
  check(!!original&&item.name===original.name,'product identity mismatch');
  check(original?.price==null?!item?.offers:item?.offers?.price===original.price&&item.offers.priceCurrency==='USD','structured price mismatch');
  check(html.includes('editorial-guide'),'missing original article');
  const crumb=graph.find(item=>item['@type']==='BreadcrumbList');check(crumb?.itemListElement.length===4,'incomplete product breadcrumb');
 }
 for(const [key,url] of [...html.matchAll(/href="([^"#]+)(?:#[^"]*)?"/g)]){
  if(!url.startsWith('/')||url.startsWith('//'))continue;
  const clean=url.split('?')[0];
  try{await access(clean.endsWith('/')?fileFor(clean):resolve('dist','.'+clean))}catch{check(false,'broken internal link '+url)}
 }
 check(html.includes('property="og:image:alt"'),'missing social image description');
 rows.push([page.type,meta.url,meta.title,meta.title.length,meta.description,meta.description.length,text(headings[0]?.[1]||''),graph.map(n=>n['@type']).join('; ')]);
}
const csv=fields=>fields.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',');
await mkdir('reports',{recursive:true});await writeFile('reports/on-page-seo.csv',[['Type','URL','Title','Title characters','Description','Description characters','H1','Structured data'],...rows].map(csv).join('\n')+'\n');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log(`SEO audit passed: ${rows.length} pages have one H1, unique metadata, canonical URLs, structured data, and working internal links. Report: reports/on-page-seo.csv`);
