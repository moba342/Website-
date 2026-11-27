import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'http://localhost:4181';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await mkdir('seo/evidence/footer-cards',{recursive:true});
const results=[];
try{
 for(const [name,path] of [['home','/'],['products','/all-products/'],['cloud','/cloud-service-accounts/'],['product','/product/aws-32-vcpu-103/']]){
  await page.goto(origin+path,{waitUntil:'networkidle'});
  assert.equal(await page.locator('.studio-card-content>p,.product-body>p,.cloud-provider-body>p,.detail-related>div>p').count(),0,'No product card descriptions');
  assert.equal(await page.locator('.premium-footer-services>a').count(),13);
  assert.equal(await page.locator('.premium-footer-contact a[href="tel:+14582624274"]').count(),1);
  assert.equal(await page.locator('.premium-footer-contact a[href="https://t.me/Eljh_Miller"]').count(),1);
  await page.locator('.premium-footer-art img').scrollIntoViewIfNeeded();await page.locator('.premium-footer-art img').evaluate(e=>e.decode());assert.equal(await page.locator('.premium-footer-art img').evaluate(e=>e.complete&&e.naturalWidth>0),true);
  for(const width of [320,375,390,768,1024,1440,1920]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(30);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,path+' overflow '+width);}
  if(name==='product')assert.ok((await page.locator('.detail-description').innerText()).length>80,'Keep full product introduction');
  results.push({path,status:'PASS'});
 }
 await page.goto(origin+'/');await page.setViewportSize({width:1440,height:1100});await page.locator('.premium-footer-invitation').scrollIntoViewIfNeeded();await page.screenshot({path:'seo/evidence/footer-cards/footer-desktop.png',fullPage:false});await page.locator('.premium-footer-grid').screenshot({path:'seo/evidence/footer-cards/footer-menu-desktop.png',style:'header,.delivery-bottom-dock,.studio-reading-progress{visibility:hidden!important}'});
 await page.setViewportSize({width:390,height:900});await page.locator('.premium-footer-grid').screenshot({path:'seo/evidence/footer-cards/footer-menu-mobile.png',style:'header,.delivery-bottom-dock,.studio-reading-progress{visibility:hidden!important}'});
 await page.setViewportSize({width:1440,height:1000});await page.locator('.studio-product-grid').scrollIntoViewIfNeeded();await page.locator('.studio-product-grid').screenshot({path:'seo/evidence/footer-cards/cards-desktop.png',style:'header,.delivery-bottom-dock,.studio-reading-progress{visibility:hidden!important}'});
 assert.deepEqual(errors,[]);await writeFile('seo/evidence/footer-cards/qa.json',JSON.stringify({origin,results,errors,widths:[320,375,390,768,1024,1440,1920]},null,2)+'\n');console.log('Footer links, artwork, compact cards and responsive checks PASS');
}finally{await browser.close();}
