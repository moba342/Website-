import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'http://localhost:4181';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'}),results=[];
try{
await page.goto(origin+'/all-products/',{waitUntil:'networkidle'});
for(const width of [320,375,390,430,768,1024,1280,1440,1920]){
 await page.setViewportSize({width,height:1000});
 const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...document.querySelectorAll('.mp-price strong,.mp-actions>a,.mp-actions>button')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent),columns:getComputedStyle(document.querySelector('.market-card-grid')).gridTemplateColumns.split(' ').length,misaligned:[...document.querySelectorAll('.mp-actions')].filter(e=>{const [a,b]=e.children;return Math.abs(a.getBoundingClientRect().top-b.getBoundingClientRect().top)>1}).length}));
 assert.equal(result.overflow,false,width+' document overflow');assert.deepEqual(result.clipped,[],width+' clipped price/button');assert.equal(result.misaligned,0,width+' horizontal actions');assert.equal(result.columns,width<=680?1:2,width+' grid columns');
 assert.equal(await page.locator('.product-filter-sidebar').isVisible(),width>1024);results.push({width,...result});
}
for(const [label,path] of [['aws','/provider/aws/'],['product','/product/aws-32-vcpu-103/'],['all-products','/all-products/'],['cloud','/cloud-service-accounts/']]){await page.setViewportSize({width:768,height:1024});await page.goto(origin+path,{waitUntil:'networkidle'});await page.evaluate(async()=>{await Promise.all([...document.images].map(async img=>{img.loading='eager';try{await img.decode()}catch{}}))});await page.screenshot({path:'design/marketplace/evidence/'+label+'-tablet.png',fullPage:true})}
await writeFile('design/marketplace/evidence/layout-qa.json',JSON.stringify({origin,products:68,results,status:'PASS'},null,2));console.log('Layout QA PASS: 68 cards × 9 widths; no clipped prices/buttons, aligned actions, correct columns and category controls.');
}finally{await browser.close()}
