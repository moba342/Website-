import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});
after(()=>server.close());
const cart=await server.ssrLoadModule('/src/cart-state.js');
const orders=await server.ssrLoadModule('/src/order-draft.js');
const config=await server.ssrLoadModule('/src/payment-config.js');
const {allProducts}=await server.ssrLoadModule('/src/catalog-data.js');
const storage=new Map();
globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const paid=allProducts.find(p=>p.id>=100&&p.price!=null);
const line={id:paid.id,qty:2};
test('stored cart uses current catalog prices and rejects unknown or invalid entries',()=>{
 const items=cart.normalizeCart([{...line,price:0,name:'Injected'}, {id:-1,qty:1},{id:paid.id,qty:1.5}]);
 assert.equal(items.length,1);assert.equal(items[0].price,paid.price);assert.equal(items[0].name,paid.name);
 assert.equal(cart.cartSummary(items).totalCents,Math.round(paid.price*100)*2);
 assert.equal(cart.normalizeCart(null).length,0);
 assert.equal(cart.normalizeCart([{id:paid.id,qty:90},{id:paid.id,qty:20}])[0].qty,99);
 for(const qty of ['',0,-1,1.5,100,NaN])assert.equal(cart.validQuantity(qty),false);
});
test('cart persistence migrates legacy data, handles corruption and stores only IDs and quantities',()=>{
 storage.clear();storage.set('cloudcart-cart',JSON.stringify([{...line,price:0}]));
 assert.equal(cart.loadCart()[0].price,paid.price);cart.saveCart(cart.loadCart());
 assert.deepEqual(JSON.parse(storage.get(cart.CART_KEY)),[line]);assert.equal(storage.has('cloudcart-cart'),false);
 storage.set(cart.CART_KEY,'broken');assert.deepEqual(cart.loadCart(),[]);
});
test('quote and scope confirmation items block the entire payment',()=>{
 for(const p of allProducts.filter(p=>p.price==null||p.id<100)){
  const items=[line,{id:p.id,qty:1}];assert.equal(cart.cartSummary(items).canPay,false);
  assert.throws(()=>orders.createOrderDraft(items,'BEP20'));
 }
 assert.equal(cart.cartSummary([]).canPay,false);
});
test('only the authorized BEP20 address is enabled; drafts freeze exact catalog totals',()=>{
 assert.equal(config.findPaymentNetwork('BEP20').address,'0x3bdb1efb243d1afcdf9780a84b5326e65dacf6c6');
 assert.equal(config.isConfiguredNetwork(config.findPaymentNetwork('TRC20')),false);
 assert.throws(()=>orders.createOrderDraft([line],'TRC20'));
 const order=orders.createOrderDraft([line],'BEP20',' @buyer ',' notes ');
 assert.match(order.id,/^CS-[A-F0-9]{16}$/);assert.equal(order.totalCents,Math.round(paid.price*100)*2);
 assert.equal(order.contact,'@buyer');assert.equal(order.notes,'notes');assert.equal(orders.draftPaymentIssue(order),'');
 assert.ok(orders.draftPaymentIssue({...order,address:'0x'+'0'.repeat(40)}));
 assert.ok(orders.draftPaymentIssue({...order,totalCents:1}));
 assert.ok(orders.draftPaymentIssue({...order,items:[{...order.items[0],unitCents:1}]}));
});
test('receipt includes complete order and hash but does not declare payment confirmed',()=>{
 const order=orders.createOrderDraft([line],'BEP20'),hash='0x'+'a'.repeat(64);
 assert.throws(()=>orders.paymentReceiptUrl(order,'bad'));
 const url=new URL(orders.paymentReceiptUrl(order,hash)),text=url.searchParams.get('text');
 assert.equal(url.origin,'https://t.me');assert.equal(url.pathname,'/Eljh_Miller');
 for(const value of [order.id,order.address,hash,paid.name,cart.usdt(order.totalCents)])assert.ok(text.includes(value));
 assert.ok(text.includes('please review'));assert.equal(order.status,undefined);
 const large=orders.createOrderDraft(allProducts.filter(p=>p.id>=100&&p.price!=null).map(p=>({id:p.id,qty:99})),'BEP20','buyer','x'.repeat(500));
 const compact=new URL(orders.paymentReceiptUrl(large,hash)).searchParams.get('text');
 assert.ok(compact.length<=3400);for(const item of large.items)assert.ok(compact.includes('#'+item.id+':'));
});
test('draft storage resumes reference, retains transaction hash and surfaces write errors',()=>{
 storage.clear();const order=orders.createOrderDraft([line],'BEP20');orders.saveOrderDraft({...order,txHash:'0x'+'b'.repeat(64)});
 assert.equal(orders.loadOrderDrafts()[0].id,order.id);assert.ok(orders.loadOrderDrafts()[0].txHash);
 const original=localStorage.setItem;localStorage.setItem=()=>{throw new Error('Storage unavailable');};
 assert.throws(()=>orders.saveOrderDraft(order));localStorage.setItem=original;
});

test('malformed saved drafts are ignored instead of rendered as payment instructions',()=>{
 storage.clear();storage.set('cloudssupply-order-drafts-v1',JSON.stringify([{id:'CS-BROKEN',items:[null]}]));
 assert.deepEqual(orders.loadOrderDrafts(),[]);
});
