import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const origin=process.argv[2]||'http://localhost:4173';
const allPages=JSON.parse(await readFile('seo/evidence/page-manifest.json','utf8'));
const manifest=process.argv.includes('--smoke')?allPages.filter(p=>['/','/aws-standard/','/provider/google-cloud/','/product/aws-32-vcpu-103/','/all-products/'].includes(p.path)):allPages;
const output=origin.startsWith('http://localhost')?'seo/evidence/browser-qa.json':'seo/evidence/browser-qa-live.json';
const widths=[320,375,390,768,1024,1440,1920],results=[],errors=[];
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const ctx=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
await mkdir('seo/evidence/screenshots',{recursive:true});
try{
 for(const entry of manifest){
  await page.goto(origin+entry.path,{waitUntil:'networkidle'});
  assert.equal(await page.locator('main h1').count(),1,entry.path+' H1');
  assert.equal(await page.locator('meta[property="og:type"]').getAttribute('content'),entry.socialType,entry.path+' hydrated social type');
  assert.equal(await page.locator('head link[rel="canonical"]').getAttribute('href'),'https://cloudssupply.site'+entry.path);
  for(const width of widths){
   await page.setViewportSize({width,height:1000});
   await page.waitForTimeout(40);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   if(overflow){const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&getComputedStyle(e).position!=='fixed').slice(0,8).map(e=>({tag:e.tagName,class:e.className,right:e.getBoundingClientRect().right})));errors.push(entry.path+' overflow at '+width+': '+JSON.stringify(offenders));}
  }
  if(['/','/aws-standard/','/provider/google-cloud/','/product/aws-32-vcpu-103/','/all-products/'].includes(entry.path)){
   await page.setViewportSize({width:390,height:900});await page.screenshot({path:'seo/evidence/screenshots/'+(entry.route==='home'?'home':entry.route.replaceAll('/','-'))+'-mobile.png',fullPage:true});
  }
  results.push({path:entry.path,responsiveWidths:widths,status:'TESTED'});
 }
 await page.setViewportSize({width:390,height:900});await page.goto(origin+'/');
 const toggle=page.getByRole('button',{name:'Toggle navigation'});await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
 await page.locator('#main-navigation').getByRole('link',{name:'Contact',exact:true}).click();await page.waitForURL('**/contact/');
 assert.equal(await page.locator('.contact-methods').getByRole('link',{name:/PHONE/}).getAttribute('href'),'tel:+14582624274');
 assert.ok((await page.locator('.contact-methods').getByRole('link',{name:/TELEGRAM/}).getAttribute('href')).startsWith('https://t.me/Eljh_Miller'));
 results.push({test:'mobile menu and contact links',status:'PASS'});
 await page.goto(origin+'/provider/aws/');
 const options=page.locator('.variation-list input[type="radio"]');await options.nth(2).check();
 assert.ok((await page.locator('.variation-name').innerText()).includes('32'));
 const qty=page.locator('.variation-quantity-row input');await qty.fill('2');
 await page.getByRole('button',{name:'Add to cart',exact:true}).click();await page.waitForURL('**/cart/');
 assert.ok((await page.locator('.shop-cart-items').innerText()).includes('AWS 32 vCPU'));
 assert.ok((await page.locator('.shop-summary').innerText()).includes('70.00 USDT'));
 await page.reload();assert.equal(await page.getByRole('spinbutton',{name:'AWS 32 vCPU quantity',exact:true}).inputValue(),'2');
 await page.getByRole('button',{name:'Increase AWS 32 vCPU quantity'}).click();assert.ok((await page.locator('.shop-summary').innerText()).includes('105.00 USDT'));
 await page.getByRole('link',{name:'Continue to checkout'}).click();await page.waitForURL('**/checkout/');
 await page.locator('input[value="TRC20"]').check();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Create payment instructions'}).click();
 await page.getByRole('heading',{name:'Your payment details.'}).waitFor();assert.equal(await page.locator('#payment-address').inputValue(),'TVQmggCyZymbEV3JqFcTznUZCWdcZrNXZY');
 const ref=await page.locator('.payment-reference strong').innerText();await page.reload();assert.equal(await page.locator('.payment-reference strong').innerText(),ref);
 await page.locator('#transaction-hash').fill('invalid');assert.equal(await page.getByRole('button',{name:'Prepare Telegram payment receipt'}).isDisabled(),true);
 await page.locator('#transaction-hash').fill('c'.repeat(64));await page.evaluate(()=>{window.open=url=>{window.__receipt=url;return null;};});
 await page.getByRole('button',{name:'Prepare Telegram payment receipt'}).click();const receipt=new URL(await page.evaluate(()=>window.__receipt)).searchParams.get('text');
 assert.ok(receipt.includes(ref)&&receipt.includes('105.00 USDT')&&receipt.includes('TRC20'));
 results.push({test:'variation selection, quantity, cart persistence, checkout, TRC20, receipt draft without sending',status:'PASS'});
 await page.goto(origin+'/cart/');await page.getByRole('button',{name:'Remove AWS 32 vCPU'}).click();await page.getByRole('heading',{name:'Your cart is ready for your next idea.'}).waitFor();
 await page.evaluate(()=>localStorage.setItem('cloudssupply-cart-v1',JSON.stringify([{id:117,qty:1},{id:103,qty:1,price:0}])));await page.reload();assert.equal(await page.locator('.shop-summary .shop-main-action').getAttribute('aria-disabled'),'true');
 await page.goto(origin+'/checkout/');await page.getByRole('heading',{name:'Your order needs a price confirmation.'}).waitFor();
 results.push({test:'remove item, quote-only cart blocks payment, tampered stored price ignored',status:'PASS'});
 await page.goto(origin+'/cart/');await page.evaluate(()=>{localStorage.clear();});await page.goto(origin+'/');
 await page.locator('.studio-product-card').first().getByRole('button',{name:/^Add To Card:/}).click();await page.waitForURL('**/checkout/');assert.ok((await page.locator('.payment-order-lines').innerText()).length>0);
 results.push({test:'homepage direct-checkout CTA retains selected product',status:'PASS'});
 assert.deepEqual(errors,[],'browser console or layout errors');
 await writeFile(output,JSON.stringify({origin,viewportWidths:widths,pagesTested:manifest.length,errors,results},null,2)+'\n');
 console.log('Browser QA passed:',manifest.length,'routes at',widths.length,'viewport widths, plus navigation, variations, cart, checkout and receipt tests. No payment or message was sent.');
}catch(e){errors.push(e.message);await writeFile(output,JSON.stringify({origin,pagesTested:results.length,errors,results},null,2)+'\n');throw e;}finally{await browser.close();}
