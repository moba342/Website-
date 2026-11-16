import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {seoPages,utilityPages,metadataFor} from '../.ssr/entry-server.js';
import {homepageTitle,homepageDescription,homepageH1,homepageHeadings,featuredAwsIds,homepageFaqs} from '../src/homepage-seo.js';
import {apiKeyTitle,apiKeyDescription,apiKeyH1,apiKeyFaqs} from '../src/api-key-content.js';
const productCopy=JSON.parse(await readFile('src/product-seo.json','utf8'));
const providerCopy=JSON.parse(await readFile('src/provider-seo.json','utf8'));
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
 for(const item of graph.filter(node=>node['@type']==='Product')){
  const original=productsById.get(item.sku);
  check(!!original&&item.name===original.name,'product identity mismatch');
  check(original?.price==null?!item.offers:item.offers?.price===original.price&&item.offers.priceCurrency==='USD','structured price mismatch');
 }
 if(page.route==='home'){
  check(meta.title===homepageTitle&&meta.description===homepageDescription,'homepage search copy mismatch');
  check(text(headings[0]?.[1]||'')===homepageH1,'homepage H1 mismatch');
  const h2=[...html.matchAll(/<h2(?:\s[^>]*)?>(.*?)<\/h2>/gs)].map(m=>text(m[1]));
  check(JSON.stringify(h2)===JSON.stringify(homepageHeadings),'homepage H2 structure mismatch');
  check(graph.filter(n=>n['@type']==='Product').length===featuredAwsIds.length,'homepage featured-product schema mismatch');
  check(graph.find(n=>n['@type']==='FAQPage')?.mainEntity.length===homepageFaqs.length,'homepage FAQ schema mismatch');
 }

 if(page.type==='provider'){
  const copy=providerCopy[page.route.split('/')[1]];
  if(copy){
   check(meta.title===copy.title&&meta.description===copy.description,'provider search copy mismatch');
   check(text(headings[0]?.[1]||'')===copy.h1,'provider H1 mismatch');
  }
 }
 if(page.route==='aws-bedrock-api-key'){
  check(meta.title===apiKeyTitle&&meta.description===apiKeyDescription,'API-key page search copy mismatch');
  check(text(headings[0]?.[1]||'')===apiKeyH1,'API-key page H1 mismatch');
  check(html.includes('class="api-key-article"'),'missing API-key access article');
  check(graph.find(n=>n['@type']==='FAQPage')?.mainEntity.length===apiKeyFaqs.length,'API-key FAQ schema mismatch');
 }
 if(page.type==='product'){
  const item=graph.find(item=>item['@type']==='Product');
  const copy=productCopy[item?.sku];
  if(copy){check(meta.title===copy.title&&meta.description===copy.description,'product search copy mismatch');check(text(headings[0]?.[1]||'')===copy.h1,'product H1 mismatch');}
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
for(const page of utilityPages){
 const html=await readFile(fileFor(page.path),'utf8');
 if(!/name="robots" content="noindex, follow"/.test(html))failures.push(page.path+': utility route must be noindex');
 if([...html.matchAll(/<h1\b/g)].length!==1)failures.push(page.path+': expected one H1');
 for(const name of ['pages-sitemap.xml','providers-sitemap.xml','products-sitemap.xml']){
  const xml=await readFile(resolve('dist',name),'utf8');
  if(xml.includes(metadataFor(page.route).url))failures.push(page.path+': utility route leaked into '+name);
 }
}
const productRows=seoPages.filter(page=>page.type==='product').map(page=>{const item=metadataFor(page.route).schema['@graph'].find(n=>n['@type']==='Product'),copy=productCopy[item.sku];return [item.sku,item.name,metadataFor(page.route).url,copy?.sourceProduct||'Existing service package',copy?.primaryKeyword||'',copy?.secondaryKeywords?.join('; ')||'',copy?.title||'',copy?.description||'',copy?.h1||''];});
const csv=fields=>fields.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',');
await mkdir('reports',{recursive:true});await writeFile('reports/on-page-seo.csv',[['Type','URL','Title','Title characters','Description','Description characters','H1','Structured data'],...rows].map(csv).join('\n')+'\n');
await writeFile('reports/product-variant-seo.csv',[['Product ID','Catalog product','Canonical URL','Supplied product label','Primary keyword','Secondary keywords','SEO title','Meta description','H1'],...productRows].map(csv).join('\n')+'\n');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log(`SEO audit passed: ${rows.length} pages have one H1, unique metadata, canonical URLs, structured data, and working internal links. Report: reports/on-page-seo.csv`);
