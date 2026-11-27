import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(p,'utf8'));
test('complete catalog matches all 68 merchant prices across 14 providers',async()=>{
 const expected=await load('tests/fixtures/merchant-catalog-2026-11-27.json'),aws=await load('src/aws-products.json'),cloud=await load('src/cloud-service-products.json'),starters=await load('src/starter-products.json');
 const products=[...aws,...cloud.flatMap(p=>p.variants),...starters];assert.equal(products.length,68);assert.equal(cloud.length+1,14);assert.equal(starters.length,0);assert.equal(new Set(products.map(p=>p.id)).size,68);
 const details=list=>list.map(p=>({id:p.id,name:p.name,price:p.price,provider:p.provider,group:p.group})).sort((a,b)=>a.id-b.id);
 assert.deepEqual(details(products),details(expected));
 assert.equal(products.find(p=>p.id===310).price,7550);assert.equal(products.find(p=>p.id===129).price,1099);assert.equal(products.find(p=>p.id===130).price,1099);
});
test('updated product links redirect to live catalog URLs and retired providers have replacements',async()=>{
 const redirects=await load('src/catalog-redirects.json'),v=await load('vercel.json');assert.ok(redirects.length>0);assert.equal(new Set(redirects.map(p=>p.source)).size,redirects.length);
 for(const r of redirects){assert.notEqual(r.source,r.destination);assert.ok(v.redirects.some(p=>p.source===r.source&&p.destination===r.destination&&p.permanent));assert.ok(!redirects.some(p=>p.source===r.destination),'No redirect chains');}
});
test('canonical host redirects exclude existing noindex alias payment drafts',async()=>{
 const config=await load('vercel.json'),rule=config.redirects.find(r=>r.has?.some(h=>h.value==='buyaws-account.vercel.app'));
 assert.equal(rule.permanent,true);assert.ok(rule.source.includes('(?!cart/'));
 assert.equal(config.trailingSlash,true);assert.equal(config.rewrites,undefined);
});
