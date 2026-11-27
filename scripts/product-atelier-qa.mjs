import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'http://localhost:4181';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'}),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
await mkdir('seo/evidence/atelier',{recursive:true});
try{
 for(const [name,path] of [['product','/product/aws-32-vcpu-103/'],['catalog','/all-products/']]){
  await page.goto(origin+path,{waitUntil:'networkidle'});
  for(const width of [320,375,390,768,1024,1440,1920]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(40);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,path+' overflow at '+width);}
  await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:'seo/evidence/atelier/'+name+'-desktop.png'});
  await page.setViewportSize({width:390,height:900});await page.screenshot({path:'seo/evidence/atelier/'+name+'-mobile.png'});
  results.push({path,status:'PASS',widths:[320,375,390,768,1024,1440,1920]});
 }
 await page.goto(origin+'/product/aws-32-vcpu-103/');
 await page.locator('.atelier-related').getByRole('link',{name:'Details: AWS 64 vCPU',exact:true}).click();await page.waitForURL('**/product/aws-64-vcpu-104/');assert.ok((await page.locator('main h1').innerText()).includes('64'));
 await page.getByRole('spinbutton',{name:'AWS 64 vCPU order quantity',exact:true}).fill('2');await page.locator('.atelier-purchase').getByRole('button',{name:'Add to cart: AWS 64 vCPU',exact:true}).click();await page.waitForURL('**/cart/');assert.ok((await page.locator('.shop-cart-items').innerText()).includes('AWS 64 vCPU'));assert.ok((await page.locator('.shop-summary').innerText()).includes('220.00 USDT'));
 results.push({test:'independent related-product navigation, quantity and cart',status:'PASS'});
 await page.goto(origin+'/product/aws-32-vcpu-103/');await page.locator('.product-card-purchase').getByRole('link',{name:'Details: AWS 32 vCPU',exact:true}).click();await page.waitForTimeout(150);assert.ok(await page.locator('#product-article').isVisible());const articleBounds=await page.locator('#product-article').boundingBox();assert.ok(articleBounds.y>=0&&articleBounds.y<450,'Guide navigation scrolls to the article');assert.ok((await page.locator('.editorial-guide').innerText()).length>400);assert.equal(await page.locator('.atelier-related .product-card .mp-description').count(),3);
 results.push({test:'original article retained and section navigation works; related cards preserve descriptions',status:'PASS'});
 await page.goto(origin+'/product/aws-bedrock-256-vcpus-10k-rpm-117/');assert.equal(await page.locator('.atelier-purchase .mp-price strong').innerText(),'$900.00');results.push({test:'updated Bedrock variation price shown',status:'PASS'});
 assert.deepEqual(errors,[]);await writeFile('seo/evidence/atelier/qa.json',JSON.stringify({origin,results,errors},null,2)+'\n');console.log('Atelier layout, variants, cart, guide navigation and pricing checks PASS');
}finally{await browser.close();}
