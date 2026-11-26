import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
const origin=process.argv[2]||'http://localhost:4181';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));const result=[];
await mkdir('seo/evidence/studio',{recursive:true});
for(const [name,path] of [['home','/'],['api-key','/aws-bedrock-api-key/'],['refund','/refund/'],['cart','/cart/'],['checkout','/checkout/']]){
 await page.goto(origin+path,{waitUntil:'networkidle'});
 if(name==='home'){await page.mouse.move(600,400);await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--pointer-x')),'600px');await page.evaluate(()=>window.scrollTo(0,800));await page.waitForTimeout(200);assert.ok(Number(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--reading-progress')))>0);await page.evaluate(()=>window.scrollTo(0,0));}
 if(name==='cart'){await page.evaluate(()=>localStorage.setItem('cloudssupply-cart-v1',JSON.stringify([{id:103,qty:2}])));await page.reload({waitUntil:'networkidle'});}
 await page.screenshot({path:'seo/evidence/studio/'+name+'-desktop.png'});result.push({page:path,status:'PASS'});
}
await page.goto(origin+'/checkout/');await page.locator('input[value="BEP20"]').check();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Create payment instructions'}).click();await page.getByRole('heading',{name:'Your payment details.'}).waitFor();await page.screenshot({path:'seo/evidence/studio/payment-desktop.png'});result.push({test:'BEP20 payment instructions render',status:'PASS'});
await page.setViewportSize({width:320,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:'seo/evidence/studio/payment-mobile.png'});
const reduced=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce',isMobile:true,hasTouch:true});await reduced.goto(origin+'/',{waitUntil:'networkidle'});assert.equal(await reduced.locator('.studio-pointer-glow').evaluate(e=>getComputedStyle(e).display),'none');assert.equal(await reduced.locator('.studio-hero-image').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await reduced.locator('.studio-featured').evaluate(e=>getComputedStyle(e).opacity),'1');await reduced.screenshot({path:'seo/evidence/studio/home-mobile.png'});result.push({test:'reduced motion and touch effects disabled',status:'PASS'});assert.deepEqual(errors,[]);await writeFile('seo/evidence/studio/motion-qa.json',JSON.stringify({errors,results:result},null,2));console.log('Studio motion, reduced motion, screenshots and BEP20 checks PASS');await browser.close();
