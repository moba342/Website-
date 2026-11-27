import {allProducts} from './catalog-data.js';
const catalog=new Map(allProducts.map(p=>[p.id,p]));
export const CART_KEY='cloudssupply-cart-v1';
export const MAX_QUANTITY=99;
export const validQuantity=value=>Number.isInteger(Number(value))&&Number(value)>=1&&Number(value)<=MAX_QUANTITY;
export function normalizeCart(value){
 if(!Array.isArray(value))return [];
 const quantities=new Map();
 for(const item of value){const id=Number(item?.id),qty=Number(item?.qty);if(!catalog.has(id)||!validQuantity(qty))continue;quantities.set(id,Math.min(MAX_QUANTITY,(quantities.get(id)||0)+qty));}
 return [...quantities].map(([id,qty])=>({...catalog.get(id),qty}));
}
export function loadCartReview(){try{const saved=localStorage.getItem(CART_KEY);const raw=JSON.parse(saved??localStorage.getItem('cloudcart-cart')??'[]');return {items:normalizeCart(raw),retiredCount:Array.isArray(raw)?raw.filter(p=>Number.isInteger(Number(p?.id))&&!catalog.has(Number(p.id))).length:0};}catch{return {items:[],retiredCount:0};}}
export function loadCart(){return loadCartReview().items;}
export function saveCart(items){localStorage.setItem(CART_KEY,JSON.stringify(normalizeCart(items).map(({id,qty})=>({id,qty}))));localStorage.removeItem('cloudcart-cart');}
export function addCartItem(items,product,quantity=1){
 const id=Number(product?.id);if(!catalog.has(id)||!validQuantity(quantity))throw new Error('Choose a valid product and a whole-number quantity from 1 to 99.');
 return normalizeCart([...items,{id,qty:Number(quantity)}]);
}
export function updateCartQuantity(items,id,qty){if(!validQuantity(qty))return items;return normalizeCart(items.map(p=>p.id===Number(id)?{id:p.id,qty:Number(qty)}:p));}
export const unitCents=product=>product.price==null?null:Math.round(product.price*100);
export const needsConfirmation=product=>product.price==null||product.id<100;
export function cartSummary(value){const items=normalizeCart(value),totalCents=items.reduce((sum,p)=>sum+(unitCents(p)??0)*p.qty,0);return {items,totalCents,count:items.reduce((n,p)=>n+p.qty,0),needsQuote:items.some(needsConfirmation),canPay:items.length>0&&!items.some(needsConfirmation)};}
export const usd=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export const usdt=cents=>(cents/100).toFixed(2);
