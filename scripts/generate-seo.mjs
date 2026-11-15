import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {seoPages,metadataFor,socialMetadata,renderPage} from '../.ssr/entry-server.js';
const origin='https://www.cloudssupply.site';
const template=await readFile('dist/index.html','utf8');
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function html(route){const meta=metadataFor(route);let head=`<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"/><meta name="robots" content="${meta.robots}"/><link rel="canonical" href="${meta.url}"/>`;
const social=socialMetadata(meta);
for(const [key,value] of Object.entries(social.properties))head+=`<meta property="${key}" content="${escape(value)}"/>`;
for(const [key,value] of Object.entries(social.names))head+=`<meta name="${key}" content="${escape(value)}"/>`;
head+=`<script type="application/ld+json" id="page-schema">${JSON.stringify(meta.schema).replaceAll('<','\\u003c')}</script>`;
return template.replace(/<title>.*?<\/title>/s,'').replace(/<meta name="description"[^>]*>/,'').replace('</head>',head+'</head>').replace('<body>','<body class="midnight-site" data-page="'+escape(route)+'">').replace('<div id="root"></div>','<div id="root">'+renderPage(route)+'</div>');}
for(const page of seoPages){const path=resolve('dist','.'+page.path,'index.html');await mkdir(dirname(path),{recursive:true});await writeFile(path,html(page.route));}
await writeFile('dist/404.html',html('not-found'));
const xmlHeader='<?xml version="1.0" encoding="UTF-8"?>\n';
for(const [type,name] of [['page','pages'],['provider','providers'],['product','products']]){const urls=seoPages.filter(p=>p.type===type).map(p=>`  <url><loc>${escape(origin+p.path)}</loc></url>`).join('\n');await writeFile(`dist/${name}-sitemap.xml`,xmlHeader+'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'\n</urlset>\n');}
const index=xmlHeader+'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+['pages','providers','products'].map(name=>`  <sitemap><loc>${origin}/${name}-sitemap.xml</loc></sitemap>`).join('\n')+'\n</sitemapindex>\n';
await writeFile('dist/sitemap_index.xml',index);await writeFile('dist/sitemap.xml',index);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap_index.xml\n`);
await writeFile('dist/product-page-index.json',JSON.stringify({productPages:seoPages.filter(p=>p.type==='product').map(p=>({name:p.name,url:origin+p.path})),providerPages:seoPages.filter(p=>p.type==='provider').map(p=>({name:p.name,url:origin+p.path}))},null,2)+'\n');
console.log(`Pre-rendered ${seoPages.length} pages with canonical metadata and three sitemaps.`);
