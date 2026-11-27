import catalogRedirects from './catalog-redirects.json';
export const pageRoutes=['home','all-products','cloud-service-accounts','aws-standard','bedrock-api','aws-bedrock-api-key','aws-account-configurator','contact','faq','refund'];
export const utilityRoutes=['cart','checkout'];
export const isPageRoute=route=>pageRoutes.includes(route)||utilityRoutes.includes(route)||/^(product|provider)\/[a-z0-9-]+$/.test(route);
export function routeHref(route){return !route||route==='home'?'/':'/'+route.replace(/^\/+|\/+$/g,'')+'/';}
export function readRoute(){
  if(typeof window==='undefined')return 'home';
  const legacy=window.location.hash.slice(1);
  if(isPageRoute(legacy))return legacy;
  return window.location.pathname.replace(/^\/+|\/+$/g,'')||'home';
}
export function navigate(target){
  const cleanPath='/'+target.replace(/^#|^\/+|\/+$/g,'')+'/';
  const redirected=catalogRedirects.find(rule=>rule.source===cleanPath);
  if(redirected)target=redirected.destination;
  const route=target.replace(/^#|^\/+|\/+$/g,'')||'home';
  window.history.pushState(null,'',routeHref(route));
  window.dispatchEvent(new PopStateEvent('popstate'));
}
export function installNavigation(onRoute){
  const update=()=>{
    let route=readRoute();
    const redirected=catalogRedirects.find(rule=>rule.source===routeHref(route));
    if(redirected){route=redirected.destination.replace(/^\/+|\/+$/g,'')||'home';window.history.replaceState(null,'',routeHref(route));}
    if(isPageRoute(window.location.hash.slice(1)))window.history.replaceState(null,'',routeHref(route));
    onRoute(route);
  };
  const click=event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest?.('a[href]');
    if(!link||link.target||link.hasAttribute('download'))return;
    const url=new URL(link.href,window.location.href);
    if(url.origin!==window.location.origin||url.search||url.hash)return;
    const route=url.pathname.replace(/^\/+|\/+$/g,'')||'home';
    if(!isPageRoute(route))return;
    event.preventDefault();navigate(route);
  };
  update();
  window.addEventListener('popstate',update);
  window.addEventListener('hashchange',update);
  document.addEventListener('click',click);
  return()=>{window.removeEventListener('popstate',update);window.removeEventListener('hashchange',update);document.removeEventListener('click',click);};
}
