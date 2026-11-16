import {cartSummary,unitCents,usdt} from './cart-state.js';
import {findPaymentNetwork,isConfiguredNetwork,validTransactionHash} from './payment-config.js';
import {contactDetails} from './contact-details.js';
const ORDER_KEY='cloudssupply-order-drafts-v1';
const validSavedOrder=o=>o?.version===1&&typeof o.id==='string'&&/^CS-[A-Z0-9-]+$/.test(o.id)&&typeof o.address==='string'&&typeof o.network==='string'&&Number.isSafeInteger(o.totalCents)&&o.totalCents>0&&Array.isArray(o.items)&&o.items.length>0&&o.items.every(p=>Number.isInteger(p?.id)&&typeof p.name==='string'&&Number.isInteger(p.qty)&&p.qty>=1&&p.qty<=99&&Number.isSafeInteger(p.unitCents)&&p.unitCents>=0)&&(!o.contact||typeof o.contact==='string')&&(!o.notes||typeof o.notes==='string')&&(!o.txHash||typeof o.txHash==='string');
export function loadOrderDrafts(){try{const value=JSON.parse(localStorage.getItem(ORDER_KEY)||'[]');return Array.isArray(value)?value.filter(validSavedOrder).slice(0,10):[];}catch{return [];}}
export function saveOrderDraft(order){const orders=loadOrderDrafts().filter(o=>o.id!==order.id);localStorage.setItem(ORDER_KEY,JSON.stringify([order,...orders].slice(0,10)));}
export function createOrderDraft(cart,networkId,contact='',notes=''){
 const summary=cartSummary(cart),network=findPaymentNetwork(networkId);
 if(!summary.canPay)throw new Error('Confirm the price and scope of every item before making a payment.');
 if(!isConfiguredNetwork(network))throw new Error('This payment network is not available. Choose an available network.');
 if(!globalThis.crypto?.getRandomValues)throw new Error('Open the secure website to create an order reference.');
 const bytes=crypto.getRandomValues(new Uint8Array(8));
 const id='CS-'+Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
 return {version:1,id,createdAt:new Date().toISOString(),network:network.id,address:network.address,token:'USDT',totalCents:summary.totalCents,contact:contact.trim().slice(0,120),notes:notes.trim().slice(0,500),items:summary.items.map(p=>({id:p.id,name:p.name,qty:p.qty,unitCents:unitCents(p)}))};
}
export function draftPaymentIssue(order){
 if(!order||order.version!==1)return 'The saved payment draft could not be restored. Please create a new order.';
 const network=findPaymentNetwork(order.network);
 if(!isConfiguredNetwork(network)||order.address!==network.address)return 'The receiving details have changed. Contact support with this order reference before transferring.';
 const summary=cartSummary(order.items);
 if(!summary.canPay||summary.items.length!==order.items.length||summary.totalCents!==order.totalCents||summary.items.some(p=>p.name!==order.items.find(item=>item.id===p.id)?.name||unitCents(p)!==order.items.find(item=>item.id===p.id)?.unitCents))return 'The catalog details or price have changed. Contact support with this order reference before transferring.';
 return '';
}
export function paymentReceiptUrl(order,hash){
 const txid=hash.trim();if(!validTransactionHash(txid,order.network))throw new Error('Enter the transaction hash for the selected network.');
 const header=['Hello, please review my USDT payment.','Order reference: '+order.id,'Network: '+order.network+' · USDT','Receiving address: '+order.address,'Order amount: '+usdt(order.totalCents)+' USDT'];
 const footer=['Transaction hash: '+txid,order.contact?'Contact: '+order.contact:'',order.notes?'Notes: '+order.notes:'','Please check the transaction, token, network, amount, and order details before confirming delivery.'].filter(Boolean);
 const full=order.items.map(p=>p.name+'\nProduct ID: '+p.id+' · Qty: '+p.qty+' · Unit: '+usdt(p.unitCents)+' USDT');
 let text=[...header,...full,...footer].join('\n\n');
 if(text.length>3400)text=[...header,'Items (catalog ID, quantity, unit USDT):',...order.items.map(p=>'#'+p.id+': '+p.qty+' × '+usdt(p.unitCents)+' USDT'),...footer].join('\n\n');
 if(text.length>3400)throw new Error('Contact support with your saved order details and transaction hash.');

 return contactDetails.telegram+'?text='+encodeURIComponent(text);
}
