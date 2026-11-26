import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=async p=>JSON.parse(await readFile(p,'utf8'));
test('SEO implementation preserves all existing catalog identities, prices and specifications',async()=>{
 const fixture=await load('seo/baseline/catalog-lock.json'),aws=await load('src/aws-products.json'),cloud=await load('src/cloud-service-products.json'),starters=await load('src/starter-products.json');
 const products=[...aws,...cloud.flatMap(p=>p.variants),...starters];
 assert.equal(cloud.length+1,fixture.providers);
 assert.deepEqual(products.map(p=>({id:p.id,name:p.name,price:p.price,features:p.features})),fixture.products);
 assert.equal(new Set(products.map(p=>p.id)).size,products.length);
});
test('canonical host redirects exclude existing noindex alias payment drafts',async()=>{
 const config=await load('vercel.json'),rule=config.redirects.find(r=>r.has?.some(h=>h.value==='buyaws-account.vercel.app'));
 assert.equal(rule.permanent,true);assert.ok(rule.source.includes('(?!cart/'));
 assert.equal(config.trailingSlash,true);assert.equal(config.rewrites,undefined);
});
