import React,{useId,useState} from 'react';
import {Check,ShoppingBag} from 'lucide-react';
import PlatformLogo from './PlatformLogo.jsx';
import {productHref} from './catalog-data.js';
import {telegramOrderUrl} from './telegram.js';
export const productMoney=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
/** One authoritative SKU per card. No invented stock, pricing or model permissions. */
export default function ProductCard({product:p,onAdd,quantityControl=false,headingLevel=3,details=true,destination='cart'}){
 const [quantity,setQuantity]=useState(1),id=useId();const qty=Number(quantity),valid=Number.isInteger(qty)&&qty>=1&&qty<=99;
 const unavailable=p.available===false||p.inStock===false||p.stockStatus==='out-of-stock';
 const confirmed=p.available===true||p.inStock===true||p.stockStatus==='in-stock';
 const priced=Number.isFinite(p.price),Heading='h'+headingLevel;
 return <article className={'product-card'+(quantityControl?' product-card-purchase':'')} data-product-id={p.id} data-price={p.price}>
 <div className="mp-card-header"><span className="mp-category"><PlatformLogo slug={p.providerSlug||'aws'}/>{p.category||p.provider} / {p.kind||'Cloud account'}</span><span className="mp-availability" data-status={unavailable?'out-of-stock':confirmed?'in-stock':'unconfirmed'}>{unavailable?'Unavailable':confirmed?'In stock':'Confirm availability'}</span></div>
 <div className="mp-title-price"><Heading className="mp-title"><a href={productHref(p)}>{p.name}</a></Heading><div className="mp-price"><strong>{priced?productMoney(p.price):'Request quote'}</strong><span>USD / account</span></div></div>
 <p className="mp-description">{p.desc}</p>
 <ul className="mp-specifications">{p.features.map(f=><li key={f}><Check size={13} aria-hidden="true"/><span>{f}</span></li>)}</ul>
 {quantityControl&&<div className="mp-quantity"><label htmlFor={id}>Quantity<input id={id} aria-label={p.name+' order quantity'} type="number" min="1" max="99" step="1" value={quantity} onChange={e=>setQuantity(e.target.value)} onBlur={()=>{if(!valid)setQuantity(1)}}/></label><span aria-live="polite">Total <strong>{priced&&valid?productMoney(p.price*qty):'—'}</strong></span></div>}
 {!valid&&<p className="mp-error" role="alert">Enter a whole number from 1 to 99.</p>}
 <div className="mp-actions"><button type="button" className="product-buy-button" disabled={!valid||unavailable||!priced} onClick={()=>onAdd(p,qty,destination)} aria-label={'Add to cart: '+p.name}><ShoppingBag size={14} aria-hidden="true"/>Add to cart</button><a className="product-details-button" href={productHref(p)+(details?'':'#product-article')} aria-label={'Details: '+p.name} onClick={details?undefined:e=>{e.preventDefault();document.getElementById('product-article')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}}>Details</a></div>
 {quantityControl&&<a className="mp-telegram" href={valid?telegramOrderUrl([{...p,qty}]):undefined} aria-disabled={!valid} onClick={e=>{if(!valid)e.preventDefault()}}>Order on Telegram</a>}
 {quantityControl&&<p className="mp-purchase-note">Account access and any included API key: 30 minutes–1 hour after order and payment confirmation. Provider usage fees are separate.</p>}
 </article>
}
