import React, {useEffect, useRef, useState} from 'react';
import {Check, ChevronDown} from 'lucide-react';

const money = value => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(value);

export default function AccountVariantSelect({provider, value, onChange}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const search = useRef({text:'', time:0});
  const selected = provider.variants.findIndex(variant => variant.id === value);
  const id = 'variant-' + provider.slug;
  const choose = index => {
    onChange(provider.variants[index].id);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const closeOutside = event => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) root.current?.querySelector('[data-active="true"]')?.scrollIntoView({block:'nearest'});
  }, [open, active]);

  function handleKey(event) {
    const last = provider.variants.length - 1;
    if (['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        setActive(event.key === 'Home' ? 0 : event.key === 'End' ? last : selected);
        setOpen(true);
      } else if (event.key === 'Enter' || event.key === ' ') choose(active);
      else setActive(index => event.key === 'Home' ? 0 : event.key === 'End' ? last : Math.max(0, Math.min(last, index + (event.key === 'ArrowDown' ? 1 : -1))));
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      search.current.text = (now - search.current.time < 700 ? search.current.text : '') + event.key.toLowerCase();
      search.current.time = now;
      const index = provider.variants.findIndex(variant => variant.variant.toLowerCase().startsWith(search.current.text));
      if (index >= 0) {setActive(index); setOpen(true);}
    }
  }

  const variant = provider.variants[selected];
  return <div className="account-variant-select" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button type="button" id={id} className="account-variant-trigger" role="combobox"
      aria-label={provider.name + ' account variant'} aria-haspopup="listbox"
      aria-expanded={open} aria-controls={open ? id + '-options' : undefined}
      aria-activedescendant={open ? id + '-option-' + active : undefined}
      onKeyDown={handleKey} onClick={() => {setActive(selected); setOpen(!open);}}>
      <span>{variant.variant}{variant.price != null ? ' — ' + money(variant.price) : ' — Request quote'}</span>
      <ChevronDown size={16} aria-hidden="true"/>
    </button>
    {open && <ul className="account-variant-menu" id={id + '-options'} role="listbox" aria-label={provider.name + ' account variants'}>
      {provider.variants.map((option, index) => <li key={option.id} id={id + '-option-' + index}
        role="option" aria-selected={index === selected} data-active={index === active}
        onPointerDown={event => event.preventDefault()} onPointerMove={() => setActive(index)} onClick={() => choose(index)}>
        <Check size={14} aria-hidden="true" className={index === selected ? '' : 'variant-check-hidden'}/>
        <span>{option.variant}</span><small>{option.price == null ? 'Request quote' : money(option.price)}</small>
      </li>)}
    </ul>}
  </div>;
}
