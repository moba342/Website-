import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
const origin=process.argv[2]||'http://localhost:4181';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
await mkdir('design/obsidian/evidence',{recursive:true});
try{
await page.goto(origin,{waitUntil:'networkidle'});
assert.equal(await page.locator('.marquee-group').count(),2);assert.equal(await page.locator('.marquee-group[aria-hidden=true] a:not([tabindex="-1"])').count(),0);
await page.getByRole('button',{name:'Credits',exact:true}).click();assert.equal(await page.locator('.infra-metrics strong').innerText(),'5K — 100K');
await page.getByRole('button',{name:'AI access',exact:true}).click();assert.equal(await page.locator('.infra-metrics strong').innerText(),'10 — 10K RPM');
await page.getByRole('button',{name:'Compute',exact:true}).click();checks.push('Category preview shows catalog ranges');
await page.getByRole('button',{name:'Pause dashboard animation',exact:true}).click();assert.equal(await page.locator('.infra-dashboard').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
await page.getByRole('button',{name:'Play dashboard animation',exact:true}).click();
await page.getByRole('button',{name:'Pause provider animation',exact:true}).click();assert.equal(await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
await page.getByRole('button',{name:'Play provider animation',exact:true}).click();
await page.locator('.marquee-group:not([aria-hidden]) a').first().focus();assert.equal(await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');checks.push('Dashboard and marquee pause, keyboard focus pause, duplicate rail untabbable');
await page.getByRole('button',{name:'Pause motion',exact:true}).click();assert.equal(await page.locator('.infra-dashboard').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');checks.push('Global motion pause');
for(const path of ['/','/all-products/','/product/aws-32-vcpu-103/','/provider/google-cloud/','/contact/','/faq/','/refund/','/cart/','/checkout/']){
 await page.goto(origin+path,{waitUntil:'networkidle'});
 for(const w of [320,375,390,430,768,1024,1280,1440,1920]){await page.setViewportSize({width:w,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,path+' overflow '+w)}
 if(['/', '/all-products/','/product/aws-32-vcpu-103/'].includes(path)){
  await page.getByRole('button',{name:'Pause motion',exact:true}).click();await page.evaluate(async()=>{await Promise.all([...document.images].map(async img=>{img.loading='eager';try{await img.decode()}catch{}}))});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'design/obsidian/evidence/'+(path==='/'?'home':path.includes('product/aws')?'product':'catalog')+'-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'design/obsidian/evidence/'+(path==='/'?'home':path.includes('product/aws')?'product':'catalog')+'-mobile.png',fullPage:true});
 }
}
checks.push('Nine page types at all nine requested widths');
await page.emulateMedia({reducedMotion:'reduce'});await page.goto(origin,{waitUntil:'networkidle'});assert.equal(await page.locator('.infra-dashboard').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await page.locator('.motion-toggle').isVisible(),false);assert.equal(await page.locator('.studio-featured').evaluate(e=>getComputedStyle(e).opacity),'1');checks.push('Reduced motion: static dashboard, wrapped rail, visible content');
await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(origin,{waitUntil:'networkidle'});await page.locator('.studio-featured').scrollIntoViewIfNeeded();await page.waitForTimeout(850);assert.equal(await page.locator('.studio-featured').evaluate(e=>getComputedStyle(e).opacity),'1');checks.push('Scroll reveal completes');
const nojs=await browser.newContext({javaScriptEnabled:false});const plain=await nojs.newPage();await plain.goto(origin);assert.equal(await plain.locator('main h1').count(),1);assert.equal(await plain.locator('.studio-featured').evaluate(e=>getComputedStyle(e).opacity),'1');checks.push('Server-rendered content visible without JavaScript');await nojs.close();
assert.deepEqual(errors,[]);
await writeFile('design/obsidian/evidence/motion-responsive-qa.json',JSON.stringify({origin,checks,errors,status:'PASS'},null,2));console.log('Obsidian motion and responsive QA PASS');
}finally{await browser.close()}
