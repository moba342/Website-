import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin=process.argv[2]||'http://localhost:4181';
const expected=JSON.parse(await readFile('tests/fixtures/merchant-catalog-2026-11-27.json','utf8'));
const redirects=JSON.parse(await readFile('src/catalog-redirects.json','utf8'));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);
await mkdir('seo/evidence/merchant-catalog',{recursive:true});
try{
 for(const slug of new Set(expected.map(p=>p.providerSlug))){
  await page.goto(origin+'/provider/'+slug+'/',{waitUntil:'networkidle'});
  for(const item of expected.filter(p=>p.providerSlug===slug)){
   await page.locator('.variation-list input[value="'+item.id+'"]').check();assert.equal(await page.locator('.variation-price').innerText(),money(item.price),item.name);assert.ok((await page.locator('.variation-name').innerText()).includes(item.name.replace(item.provider+' — ','')));
   results.push({id:item.id,name:item.name,price:item.price,status:'PASS'});
  }
  await page.locator('.premium-artwork-logo img').first().evaluate(e=>e.decode());
 }
 const redirectResults=[];
 for(const rule of redirects){const response=await page.request.get(origin+rule.source,{maxRedirects:0});assert.equal(response.status(),308,rule.source);const target=new URL(response.headers().location,origin);assert.equal(target.pathname,rule.destination);const destination=await page.request.get(origin+rule.destination);assert.equal(destination.status(),200);redirectResults.push({source:rule.source,destination:rule.destination,status:308});}
 await page.goto(origin+'/cart/');await page.evaluate(()=>localStorage.setItem('cloudssupply-cart-v1',JSON.stringify([{id:108,qty:1},{id:104,qty:2,price:45}])));await page.reload({waitUntil:'networkidle'});await page.locator('.catalog-change-notice').waitFor();assert.ok((await page.locator('.shop-summary').innerText()).includes('220.00 USDT'));
 const oldOrder={version:1,id:'CS-PRICECHECK2026',createdAt:'2026-11-26T00:00:00.000Z',network:'BEP20',address:'0x3bdb1efb243d1afcdf9780a84b5326e65dacf6c6',token:'USDT',totalCents:4500,items:[{id:104,name:'AWS 64 vCPU',qty:1,unitCents:4500}]};await page.evaluate(o=>localStorage.setItem('cloudssupply-order-drafts-v1',JSON.stringify([o])),oldOrder);await page.goto(origin+'/checkout/?order='+oldOrder.id,{waitUntil:'networkidle'});await page.getByRole('alert').filter({hasText:'catalog details or price have changed'}).waitFor();assert.equal(await page.locator('.payment-instructions').count(),0);
 assert.deepEqual(errors,[]);await writeFile('seo/evidence/merchant-catalog/'+(origin.includes('localhost')?'local':'live')+'-qa.json',JSON.stringify({origin,providers:new Set(expected.map(p=>p.providerSlug)).size,variations:results,redirects:redirectResults,oldCartRepricing:'PASS',oldDraftReview:'PASS',errors},null,2)+'\n');console.log('Merchant catalog PASS:',results.length,'variation prices;',redirectResults.length,'redirects; cart repricing and old-draft protection.');
}finally{await browser.close();}
