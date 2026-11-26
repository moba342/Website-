import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {parse} from 'parse5';
import {createHash} from 'node:crypto';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import {seoPages,utilityPages,metadataFor,indexingAllowed} from '../.ssr/entry-server.js';
import {pageSeo,productSeo,providerSeo,normalizeKeyword} from '../.ssr/entry-server.js';
import {siteUrl} from '../src/site-config.js';
const aws=JSON.parse(await readFile('src/aws-products.json','utf8')),cloud=JSON.parse(await readFile('src/cloud-service-products.json','utf8')),starters=JSON.parse(await readFile('src/starter-products.json','utf8'));
const products=[...aws,...cloud.flatMap(p=>p.variants),...starters],productById=new Map(products.map(p=>[String(p.id),p]));
const failures=[],warnings=[],results=[],reportRows=[],keywordRows=[],productRows=[],allLinks=new Map(),primaryTargets=new Map(),titles=new Map(),descriptions=new Map(),metadata=[];
function walk(n,fn){fn(n);for(const child of n.childNodes||[])walk(child,fn);}
function elements(root,tag){const out=[];walk(root,n=>{if(n.tagName===tag)out.push(n)});return out;}
const attrs=n=>Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value]));
function text(n){if(!n)return '';if(['script','style'].includes(n.tagName))return '';return (n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join(' ')).replace(/\s+/g,' ').trim();}
const countMap=(map,value,url)=>{const key=normalizeKeyword(value);map.set(key,[...(map.get(key)||[]),url]);};
const csv=rows=>rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
const fileFor=path=>resolve('dist','.'+path,'index.html');
for(const page of [...seoPages,...utilityPages]){
 const html=await readFile(fileFor(page.path),'utf8'),doc=parse(html),meta=metadataFor(page.route),head=elements(doc,'head')[0],main=elements(doc,'main')[0],a=elements(head,'meta').map(attrs),h1=elements(main,'h1'),canonical=elements(head,'link').map(attrs).filter(a=>a.rel==='canonical'),description=a.find(a=>a.name==='description')?.content||'',title=text(elements(head,'title')[0]),robots=a.find(a=>a.name==='robots')?.content||'',visible=text(main),isPublic=page.type!=='utility';
 const problems=[];const check=(ok,message)=>{if(!ok){problems.push(message);failures.push(page.path+': '+message)}};
 check(h1.length===1,'expected exactly one H1');check(title===meta.title,'title mismatch');check(description===meta.description&&description.length>0,'missing/mismatched description');check(canonical.length===1&&canonical[0].href===siteUrl+page.path,'invalid canonical');
 check(isPublic?robots.includes('noindex')===!indexingAllowed:robots==='noindex, follow','incorrect indexing directive');
 check(!html.includes('CloudsSupply.store'),'outdated brand');check(!html.includes('<meta name="keywords"'),'unnecessary meta keywords');
 for(const image of elements(doc,'img')){const ia=attrs(image);check('alt' in ia,'image without alt');check(!!ia.width&&!!ia.height,'image without intrinsic dimensions');const src=ia.src;if(src?.startsWith('/'))try{await access(resolve('dist','.'+src.split('?')[0]));}catch{check(false,'missing image '+src);}}
 let graph=[];for(const script of elements(head,'script')){if(attrs(script).type==='application/ld+json'){try{graph.push(...JSON.parse((script.childNodes||[]).map(x=>x.value||'').join(''))['@graph']);}catch{check(false,'invalid JSON-LD');}}}
 check(graph.some(n=>n['@type']==='Organization'),'missing Organization schema');check(graph.some(n=>n['@type']==='WebSite'),'missing WebSite schema');
 if(page.route!=='home')check(graph.some(n=>n['@type']==='BreadcrumbList'),'missing breadcrumbs');
 check(a.find(a=>a.property==='og:type')?.content===meta.socialType,'incorrect social page type');
 check(a.some(a=>a.property==='og:image:alt')&&a.some(a=>a.name==='twitter:image:alt'),'missing social descriptions');
 const links=elements(doc,'a').map(attrs).filter(a=>a.href?.startsWith('/')&&!a.href.startsWith('//')).map(a=>a.href.split('#')[0].split('?')[0]||page.path);
 allLinks.set(page.path,new Set(links));for(const path of links)try{await access(path.endsWith('/')?fileFor(path):resolve('dist','.'+path));}catch{check(false,'broken internal link '+path);}
 const product=page.type==='product'?products.find(p=>page.route.endsWith('-'+p.id)):null,provider=page.type==='provider'?page.route.split('/')[1]:null,copy=product?productSeo[product.id]:provider?providerSeo[provider]:pageSeo[page.route];
 let primaryCovered=false,secondaryCovered=0;
 if(isPublic&&['provider','product'].includes(page.type))check(!!copy,'commercial catalog record lacks SEO keyword configuration');
 if(isPublic){countMap(titles,title,page.path);countMap(descriptions,description,page.path);}
 if(copy&&isPublic){
  const primary=normalizeKeyword(copy.primaryKeyword),secondary=copy.secondaryKeywords||[];
  check(!!primary,'missing primary keyword');check(secondary.length>=3&&secondary.length<=6,'expected 3–6 secondary keywords');check(title===copy.title&&description===copy.description,'SEO configuration mismatch');check(text(h1[0])===copy.h1,'H1 configuration mismatch');
  primaryCovered=normalizeKeyword(visible).includes(primary);check(primaryCovered,'primary keyword absent from visible content');
  if(copy.intent==='commercial')check(normalizeKeyword(title).includes(primary),'primary keyword absent from title');
  if(copy.intent==='commercial')check(normalizeKeyword(description).includes(primary),'primary keyword absent from description');
  secondaryCovered=secondary.filter(s=>normalizeKeyword(visible).includes(normalizeKeyword(s))).length;
  if(copy.intent==='commercial'){const previous=primaryTargets.get(primary);check(!previous,'primary keyword also assigned to '+previous);primaryTargets.set(primary,page.path);}
  keywordRows.push([page.type,meta.url,copy.intent,copy.primaryKeyword,secondary.join('; '),copy.scope||'',primaryCovered?'PASS':'FAIL',secondaryCovered+'/'+secondary.length]);
  if(secondaryCovered<secondary.length)warnings.push(page.path+': '+secondaryCovered+'/'+secondary.length+' exact secondary phrases visible (review natural variations; do not stuff).');
 }
 for(const node of graph.filter(n=>n['@type']==='Product'||n['@type']==='Service')){
  const original=productById.get(node.sku||node.identifier);check(!!original&&node.name===original.name,'schema identity mismatch');
  const canOffer=original?.price!=null&&original.id>=100;
  check(canOffer?node.offers?.price===original.price&&node.offers?.priceCurrency==='USD':!node.offers,'unsupported or mismatched Offer');
  check(!node.aggregateRating&&!node.review&&!node.offers?.availability,'unsupported review or stock assertions');
 }
 if(product){
  check(!!copy,'product lacks keyword mapping');const node=graph.find(n=>(n.sku||n.identifier)===String(product.id));check(node?.['@type']===(product.id<100?'Service':'Product'),'incorrect catalog schema type');
  const faq=graph.find(n=>n['@id']===meta.url+'#product-faq');check(faq?.mainEntity?.length===copy?.faqs?.length&&copy.faqs.length>=3,'missing product FAQs');
  for(const [q,answer] of copy.faqs){check(visible.includes(q)&&visible.includes(answer),'FAQ schema does not match visible content');}
  check(elements(main,'article').some(n=>attrs(n).class?.includes('editorial-guide')),'missing original article');
  productRows.push([product.id,product.name,meta.url,meta.url,copy.primaryKeyword,copy.secondaryKeywords.join('; '),title,description,text(h1[0]),'Primary '+(primaryCovered?'PASS':'FAIL')+'; secondary '+secondaryCovered+'/'+copy.secondaryKeywords.length,canonical[0]?.href===meta.url?'PASS':'FAIL',node?.['@type']+(node?.offers?' + Offer':' (no supported Offer)'),robots,problems.length?'FAIL':'PASS']);
 }
 if(isPublic){const h2=elements(main,'h2');check(h2.length>0,'missing secondary headings');}
 results.push({path:page.path,type:page.type,title,description,h1:text(h1[0]),canonical:canonical[0]?.href,robots,primaryKeyword:copy?.primaryKeyword||null,primaryCovered,secondaryCovered,issues:problems});
 reportRows.push([page.type,meta.url,title,title.length,description,description.length,text(h1[0]),graph.map(n=>n['@type']).join('; ')]);
 metadata.push({route:page.route,path:page.path,type:page.type,name:page.name,title,description,h1:text(h1[0]),robots,primary:copy?.primaryKeyword||'',secondary:copy?.secondaryKeywords||[],visibleHash:createHash('sha256').update(visible).digest('hex'),socialType:meta.socialType,schemaHash:createHash('sha256').update(JSON.stringify(graph)).digest('hex')});
}
for(const [label,map] of [['title',titles],['description',descriptions]])for(const [key,urls] of map)if(urls.length>1)failures.push('Duplicate '+label+': '+urls.join(', '));
const depth=new Map([['/',0]]),queue=['/'];while(queue.length){const path=queue.shift();for(const link of allLinks.get(path)||[])if(allLinks.has(link)&&!depth.has(link)){depth.set(link,depth.get(path)+1);queue.push(link);}}
for(const p of seoPages)if(!depth.has(p.path))failures.push('Orphan public page '+p.path);
const xp=new XMLParser();let sitemapUrls=[];
for(const name of ['pages','providers','products']){const xml=await readFile('dist/'+name+'-sitemap.xml','utf8');if(XMLValidator.validate(xml)!==true)failures.push('Invalid XML '+name);const nodes=xp.parse(xml).urlset.url;for(const n of Array.isArray(nodes)?nodes:[nodes])sitemapUrls.push(n.loc);}
const expected=seoPages.map(p=>siteUrl+p.path);if(sitemapUrls.length!==expected.length||new Set(sitemapUrls).size!==expected.length||expected.some(u=>!sitemapUrls.includes(u)))failures.push('Sitemap membership mismatch');
for(const p of utilityPages)if(sitemapUrls.includes(siteUrl+p.path))failures.push('Utility URL in sitemap '+p.path);
for(const name of ['sitemap.xml','sitemap_index.xml']){const xml=await readFile('dist/'+name,'utf8');if(XMLValidator.validate(xml)!==true)failures.push('Invalid sitemap index XML');for(const child of ['pages','providers','products'])if(!xml.includes(siteUrl+'/'+child+'-sitemap.xml'))failures.push('Incorrect sitemap index origin');}
const robots=await readFile('dist/robots.txt','utf8');if(!robots.includes('Sitemap: '+siteUrl+'/sitemap_index.xml')||robots.includes('Disallow: /'))failures.push('Production robots misconfigured');
const notFound=await readFile('dist/404.html','utf8');if(!notFound.includes('noindex, follow'))failures.push('404 must be noindex');
await mkdir('seo/evidence',{recursive:true});await mkdir('reports',{recursive:true});
await writeFile('seo/KEYWORD-MAPPING.csv',csv([['Type','URL','Intent','Primary Keyword','Secondary Keywords','Scope','Primary Visible','Secondary Exact Coverage'],...keywordRows]));
await writeFile('seo/PRODUCT-SEO-REPORT.csv',csv([['Product ID','Product Name','Current URL','Optimized URL','Primary Keyword','Secondary Keywords','SEO Title','Meta Description','H1','Keyword Coverage','Canonical Status','Schema Status','Indexability','Final SEO Status'],...productRows]));
await writeFile('reports/on-page-seo.csv',csv([['Type','URL','Title','Title characters','Description','Description characters','H1','Structured data'],...reportRows.filter(r=>r[0]!=='utility')]));
await writeFile('reports/product-variant-seo.csv',csv([['Product ID','Catalog product','Canonical URL','Primary keyword','Secondary keywords','SEO title','Meta description','H1'],...productRows.map(r=>[r[0],r[1],r[3],r[4],r[5],r[6],r[7],r[8]])]));
await writeFile('seo/evidence/page-manifest.json',JSON.stringify(metadata,null,2)+'\n');
const summary={publicPages:seoPages.length,providers:cloud.length+1,products:products.length,catalogRecords:cloud.length+1+products.length,commercialMapped:primaryTargets.size,utilityPages:utilityPages.length,maxCrawlDepth:Math.max(...depth.values()),orphanPages:seoPages.filter(p=>!depth.has(p.path)).map(p=>p.path),failures,warnings,pages:results};
await writeFile('seo/evidence/static-audit.json',JSON.stringify(summary,null,2)+'\n');
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log(`SEO audit passed: ${seoPages.length} public pages, ${primaryTargets.size} unique commercial primary keywords, ${productRows.length} products, no duplicate metadata or orphan pages. Maximum crawl depth: ${summary.maxCrawlDepth}.`);
console.log(`${warnings.length} secondary-phrase coverage notes saved for editorial review.`);
