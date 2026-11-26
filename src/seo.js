import {allProducts,allProviders,findProduct,findProvider,productHref,providerHref} from './catalog-data.js';
import {routeHref,pageRoutes,utilityRoutes} from './router.js';
import {siteUrl,siteName,indexingAllowed} from './site-config.js';
import {pageSeo} from './seo-keywords.js';
import {faqs} from './faqs.js';
import productSeo from './product-seo.json';
import providerSeo from './provider-seo.json';
import {apiKeyTitle,apiKeyDescription,apiKeyFaqs} from './api-key-content.js';
import {homepageTitle,homepageDescription,featuredAwsIds,homepageFaqs} from './homepage-seo.js';
const pages=Object.fromEntries(Object.entries(pageSeo).map(([route,copy])=>[route,[copy.h1,copy.description]]));
const utilityMetadata={cart:['Shopping Cart','Review your cloud account products and quantities before USDT checkout.'],checkout:['USDT Checkout','Review your order, select an available USDT network, and submit the transaction hash for manual confirmation.']};
export const utilityPages=utilityRoutes.map(route=>({route,path:routeHref(route),type:'utility'}));
const providerDescriptions={
 aws:'Compare AWS trial, compute, credit, Bedrock API, and Kiro account variations. Review prices and choose an original guide for your intended configuration.',
 'google-cloud':'Compare Google Cloud prepaid, Pay As You Go, and credit account variations. Review account prices, required provider payments, and individual guides.',
 azure:'Explore Azure trial, Pay-As-You-Go, $1K Tier 1, and $5K credit account options. Compare listed prices, account conditions, and original product guides.',
 digitalocean:'Review the DigitalOcean three-Droplet account option, listed price, resource allowances, billing considerations, and the original product guide.',
 linode:'Explore the Linode trial account with a listed $100 credit benefit. Review account pricing, trial eligibility, credit conditions, and product guidance.',
 ovhcloud:'Compare the OVHcloud account option labeled 34 vCPUs. Review its listed price and the compute, regional, and billing details to clarify before ordering.',
 oracle:'Review the Oracle Cloud free-trial account listing labeled $300. Explore the account price, trial conditions, and original guide before ordering.',
 hetzner:'Explore the Hetzner five-server account listing. Review account pricing, resource allowances, billing conditions, and the individual product guide.',
 'amazon-ses':'Compare Amazon SES SMTP account listings with 50K and 100K sending-limit labels. Review prices, limit conditions, and email setup guides.',
 upcloud:'Review the UpCloud account with a listed $500 credit benefit. Explore pricing, funding conditions, billing requirements, and the original product guide.',
 atlantic:'Explore the Atlantic Cloud free-trial account option. Review pricing, trial requirements, resource allowances, and the original product guide.',
 alibaba:'Review the Alibaba Cloud free-trial account listing. Explore its price, regional and billing requirements, and original guidance for account selection.',
 'aws-marketplace':'Explore the AWS Marketplace account option and listed price. Review purchasing permissions, account requirements, and the original product guide.'
};
const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
export const seoPages=[...pageRoutes.map(route=>({route,path:routeHref(route),type:'page',name:pages[route][0]})),...allProviders.map(p=>({route:'provider/'+p.slug,path:providerHref(p),type:'provider',name:p.title})),...allProducts.map(p=>({route:'product/'+p.pageSlug,path:productHref(p),type:'product',name:p.name}))];
function collectionItems(route,provider){
 if(provider)return provider.variants;
 if(route==='home')return featuredAwsIds.map(id=>allProducts.find(p=>p.id===id));
 if(route==='cloud-service-accounts')return allProviders.filter(p=>p.slug!=='aws');
 if(route==='all-products')return allProducts;
 const aws=allProviders.find(p=>p.slug==='aws').variants;
 if(route==='aws-account-configurator')return aws;
 if(route==='aws-bedrock-api-key')return aws.filter(p=>p.kind==='Amazon Bedrock');
 if(route==='bedrock-api')return aws.filter(p=>['Amazon Bedrock','AI development'].includes(p.kind));
 if(route==='aws-standard')return aws.filter(p=>!['Amazon Bedrock','AI development'].includes(p.kind));
 return [];
}
export function metadataFor(route){
 const product=findProduct(route),provider=findProvider(route),known=!!product||!!provider||!!pages[route]||!!utilityMetadata[route];
 const data=product?productSeo[product.id]:null,providerCopy=provider?providerSeo[provider.slug]:null;
 const title=product?(data?.h1||product.name):provider?(providerCopy?.h1||provider.title):pages[route]?.[0]||utilityMetadata[route]?.[0]||'Page not found';
 const description=product?(data?.description||product.desc):provider?(providerCopy?.description||providerDescriptions[provider.slug]||provider.guide.summary):pages[route]?.[1]||utilityMetadata[route]?.[1]||'The requested page could not be found. Browse our cloud account catalog.';
 const pageTitle=product?(data?.title||product.name+' | '+siteName):providerCopy?providerCopy.title:pageSeo[route]?.title||title+' | '+siteName;
 const url=siteUrl+routeHref(route),image=siteUrl+(product?.image||provider?.image||'/products/premium/cloud-console-v2.jpg');
 const imageAlt=(product?.name||provider?.name||'CloudsSupply cloud accounts')+' — cloud infrastructure illustration';
 const organization={'@type':'Organization','@id':siteUrl+'/#organization',name:siteName,url:siteUrl+'/',logo:{'@type':'ImageObject',url:siteUrl+'/brand/cloudssupply-wordmark.webp',width:700,height:176},telephone:'+14582624274',sameAs:['https://t.me/Eljh_Miller'],contactPoint:{'@type':'ContactPoint',telephone:'+14582624274',contactType:'customer support',url:siteUrl+'/contact/'}};
 const items=collectionItems(route,provider);
 const webPage={'@type':product?'ItemPage':route==='contact'?'ContactPage':route==='faq'?'FAQPage':items.length?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:pageTitle,description,inLanguage:'en',isPartOf:{'@id':siteUrl+'/#website'}};
 const graph=[organization,{'@type':'WebSite','@id':siteUrl+'/#website',url:siteUrl+'/',name:siteName,inLanguage:'en',publisher:{'@id':organization['@id']}},webPage];
 const productNode=p=>{const productUrl=siteUrl+productHref(p);const item={'@type':p.id<100?'Service':'Product','@id':productUrl+'#product',name:p.name,description:p.desc,image:siteUrl+p.image,sku:String(p.id),brand:{'@type':'Brand',name:p.provider},url:productUrl};if(p.id<100){delete item.sku;delete item.brand;item.identifier=String(p.id);item.provider={'@id':organization['@id']};item.serviceType=p.name;}if(p.price!=null&&p.id>=100)item.offers={'@type':'Offer',url:productUrl,price:p.price,priceCurrency:'USD',seller:{'@id':organization['@id']}};return item;};
 if(product){const item=productNode(product);graph.push(item);webPage.mainEntity={'@id':item['@id']};const questions=productSeo[product.id]?.faqs||[];if(questions.length){const faq={'@type':'FAQPage','@id':url+'#product-faq',mainEntity:questions.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};graph.push(faq);webPage.hasPart={'@id':faq['@id']};}}
 if(route==='home'){
  graph.push(...items.map(productNode));
  const faq={'@type':'FAQPage','@id':url+'#aws-faq',mainEntity:homepageFaqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
  graph.push(faq);webPage.hasPart={'@id':faq['@id']};
 }

 if(route==='aws-bedrock-api-key'){
  graph.push(...items.map(productNode));
  const faq={'@type':'FAQPage','@id':url+'#api-key-faq',mainEntity:apiKeyFaqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};graph.push(faq);webPage.hasPart={'@id':faq['@id']};
 }
 if(items.length){const list={'@type':'ItemList','@id':url+'#collection',name:product?product.name:title,numberOfItems:items.length,itemListElement:items.map((p,index)=>({'@type':'ListItem',position:index+1,name:p.title||p.name,url:siteUrl+(p.variants?providerHref(p):productHref(p))}))};graph.push(list);webPage.mainEntity={'@id':list['@id']};}
 if(route==='faq')webPage.mainEntity=faqs.map(([question,answer])=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}));
 if(known&&route!=='home'){
  const crumbs=[['Home','/']];
  if(route==='aws-bedrock-api-key')crumbs.push(['AWS Bedrock API','/bedrock-api/']);
  if(product||provider)crumbs.push(['Products','/all-products/']);
  if(product){const group=allProviders.find(p=>p.slug===product.providerSlug);if(group)crumbs.push([group.name,providerHref(group)]);}
  crumbs.push([product?.name||provider?.name||title,routeHref(route)]);
  const breadcrumb={'@type':'BreadcrumbList','@id':url+'#breadcrumbs',itemListElement:crumbs.map(([name,path],index)=>({'@type':'ListItem',position:index+1,name,item:siteUrl+path}))};graph.push(breadcrumb);webPage.breadcrumb={'@id':breadcrumb['@id']};
 }
 return {title:pageTitle,description,url,image,imageAlt,robots:known&&indexingAllowed&&!utilityRoutes.includes(route)?'index, follow, max-image-preview:large':'noindex, follow',schema:{'@context':'https://schema.org','@graph':graph}};
}
export function socialMetadata(m){return {
 properties:{'og:title':m.title,'og:description':m.description,'og:url':m.url,'og:image':m.image,'og:image:alt':m.imageAlt,'og:type':m.schema['@graph'].some(node=>node['@type']==='Product')?'product':'website','og:site_name':siteName,'og:locale':'en_US'},
 names:{'twitter:card':'summary_large_image','twitter:title':m.title,'twitter:description':m.description,'twitter:image':m.image,'twitter:image:alt':m.imageAlt}
};}
export function applyPageMetadata(route){
 const m=metadataFor(route);document.title=m.title;
 function meta(attr,key,content){let el=document.head.querySelector(`meta[${attr}="${key}"]`);if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.append(el)}el.content=content;}
 meta('name','description',m.description);meta('name','robots',m.robots);
 const social=socialMetadata(m);for(const [key,value] of Object.entries(social.properties))meta('property',key,value);for(const [key,value] of Object.entries(social.names))meta('name',key,value);
 let canonical=document.head.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical)}canonical.href=m.url;
 let schema=document.getElementById('page-schema');if(!schema){schema=document.createElement('script');schema.type='application/ld+json';schema.id='page-schema';document.head.append(schema)}schema.textContent=JSON.stringify(m.schema);
}
