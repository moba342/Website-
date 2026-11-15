import React, {useId, useState} from 'react';
import {ShoppingBag, Send, ShieldCheck, KeyRound, Clock3} from 'lucide-react';
import {telegramOrderUrl} from './telegram.js';
import './variation-box.css';

const money = n => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(n);
export default function VariationBox({variants, value, onChange, onAdd, label='Account variation'}) {
  const id = useId();
  const [quantity, setQuantity] = useState(1);
  const selected = variants.find(p => p.id === value) || variants[0];
  const qty = Number(quantity);
  const valid = Number.isInteger(qty) && qty >= 1 && qty <= 99;
  return <section className="variation-box" aria-label={label}>
    <div className="variation-summary" aria-live="polite" aria-atomic="true">
      <span className="variation-kicker">SELECTED VARIATION</span>
      <strong className="variation-price">{selected.price == null ? 'Request quote' : money(selected.price)}</strong>
      <span className="variation-name">{selected.variant || selected.name}</span>
    </div>
    <fieldset className="variation-list">
      <legend className="visually-hidden">{label}</legend>
      {variants.map(p => <label className="variation-option" key={p.id}>
        <input type="radio" name={id} value={p.id} checked={p.id === selected.id} onChange={() => onChange(p.id)}/>
        <span>{p.variant || p.name}</span>
        <strong>{p.price == null ? 'Request quote' : money(p.price)}</strong>
      </label>)}
    </fieldset>
    <div className="variation-actions">
      <div className="variation-quantity-row">
        <label htmlFor={id+'-qty'}>Quantity <input id={id+'-qty'} type="number" min="1" max="99" step="1" value={quantity} onChange={e=>setQuantity(e.target.value)} onBlur={()=>{if(!valid)setQuantity(1)}}/></label>
        <span aria-live="polite">Total <strong>{selected.price == null ? 'Quote required' : valid ? money(selected.price * qty) : '—'}</strong></span>
      </div>
      {!valid && <span className="variation-error" role="alert">Enter a whole number from 1 to 99.</span>}
      <button type="button" className="variation-add" disabled={!valid} onClick={()=>onAdd(selected,qty)}><ShoppingBag size={16}/> Add to cart</button>
      <a className="variation-telegram" href={valid ? telegramOrderUrl([{...selected,qty}]) : undefined} aria-disabled={!valid} onClick={e=>{if(!valid)e.preventDefault()}}><Send size={16}/> Order on Telegram</a>
      <p className="variation-order-note">Review your Telegram draft and send it to confirm availability and payment.</p>
    </div>
    <ul className="variation-benefits">
      <li><ShieldCheck size={14}/><span>Confirm the selected specifications before ordering.</span></li>
      <li><KeyRound size={14}/><span>Account access and any API key included in your order.</span></li>
      <li><Clock3 size={14}/><span>Delivery: 30 minutes–1 hour after order and payment confirmation.</span></li>
    </ul>
  </section>;
}
