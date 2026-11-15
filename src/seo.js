import {allProducts,allProviders,findProduct,findProvider,productHref,providerHref} from './catalog-data.js';
import {routeHref,pageRoutes} from './router.js';
import {siteUrl,siteName} from './site-config.js';
const pages={
 home:['Cloud Accounts & Bedrock API Marketplace','Compare cloud accounts, AWS Bedrock API options, cloud credits, and hosting accounts. Explore product specifications, prices, and original guides at CloudsSupply.store.'],
 'all-products':['All Cloud Products & Services','Explore every cloud account and service, with individual product guides, specifications, prices, and Telegram ordering.'],
 'cloud-service-accounts':['Cloud Service Accounts','Compare Google Cloud, Azure, DigitalOcean, Linode, Oracle Cloud, and other cloud account variations and listed prices.'],
 'aws-standard':['AWS Standard Accounts','Compare AWS trial, compute, and credit account options. Review specifications and individual product guides before choosing an account.'],
 'bedrock-api':['AWS Bedrock API Accounts','Explore AWS Bedrock API account variations, request-rate labels, compute specifications, prices, and original product guides.'],
 'aws-account-configurator':['Compare AWS Account Variations','Choose an AWS trial, compute, credit, Bedrock API, or Kiro account variation and review its price and specifications.'],
 contact:['Contact & Order Support','Contact CloudsSupply.store by phone or Telegram for product questions, order updates, account delivery, and refund requests.'],
 faq:['Frequently Asked Questions','Find answers about cloud account products, pricing, ordering on Telegram, delivery, and refund reviews.'],
 refund:['Refund Policy','Read the refund review process, order requirements, delivery information, and support contact details for CloudsSupply.store.']
};
export const seoPages=[...pageRoutes.map(route=>({route,path:routeHref(route),type:'page'})),...allProviders.map(p=>({route:'provider/'+p.slug,path:providerHref(p),type:'provider'})),...allProducts.map(p=>({route:'product/'+p.pageSlug,path:productHref(p),type:'product'}))];
export function metadataFor(route){
 const product=findProduct(route),provider=findProvider(route),known=!!product||!!provider||!!pages[route];
 const [title,description]=product?[product.name,product.desc]:provider?[provider.title,provider.guide.summary]:pages[route]||['Page not found','The requested page could not be found. Browse our cloud account catalog.'];
 const url=siteUrl+routeHref(route),image=siteUrl+(product?.image||provider?.image||'/products/premium/cloud-console-v2.jpg');
 const organization={'@type':'Organization','@id':siteUrl+'/#organization',name:siteName,url:siteUrl+'/',logo:siteUrl+'/brand/cloudssupply-logo.png',telephone:'+14582624274',sameAs:['https://t.me/Eljh_Miller']};
 const graph=[organization,{'@type':'WebSite','@id':siteUrl+'/#website',url:siteUrl+'/',name:siteName,publisher:{'@id':organization['@id']}},{'@type':'WebPage','@id':url+'#webpage',url,name:title+' | '+siteName,description,isPartOf:{'@id':siteUrl+'/#website'}}];
 if(product){const item={'@type':'Product','@id':url+'#product',name:product.name,description:product.desc,image,sku:String(product.id),brand:{'@type':'Brand',name:product.provider},url};if(product.price!=null)item.offers={'@type':'Offer',url,price:product.price,priceCurrency:'USD',seller:{'@id':organization['@id']}};graph.push(item);}
 if(known&&route!=='home')graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:siteUrl+'/'},{'@type':'ListItem',position:2,name:title,item:url}]});
 return {title:title+' | '+siteName,description,url,image,robots:known?'index, follow':'noindex, follow',schema:{'@context':'https://schema.org','@graph':graph}};
}
export function applyPageMetadata(route){
 const m=metadataFor(route);document.title=m.title;
 function meta(attr,key,content){let el=document.head.querySelector(`meta[${attr}="${key}"]`);if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.append(el)}el.content=content;}
 meta('name','description',m.description);meta('name','robots',m.robots);
 for(const [key,value] of Object.entries({'og:title':m.title,'og:description':m.description,'og:url':m.url,'og:image':m.image,'og:type':route.startsWith('product/')?'product':'website','og:site_name':siteName}))meta('property',key,value);
 for(const [key,value] of Object.entries({'twitter:card':'summary_large_image','twitter:title':m.title,'twitter:description':m.description,'twitter:image':m.image}))meta('name',key,value);
 let canonical=document.head.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical)}canonical.href=m.url;
 let schema=document.getElementById('page-schema');if(!schema){schema=document.createElement('script');schema.type='application/ld+json';schema.id='page-schema';document.head.append(schema)}schema.textContent=JSON.stringify(m.schema);
}
