import pageSeo from './page-seo.json';
import productSeo from './product-seo.json';
import providerSeo from './provider-seo.json';
export {pageSeo,productSeo,providerSeo};
export const normalizeKeyword=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function keywordConfig(route,product,provider){return product?productSeo[product.id]:provider?providerSeo[provider.slug]:pageSeo[route]||null;}
