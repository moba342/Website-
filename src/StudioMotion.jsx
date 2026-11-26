import React,{useEffect} from 'react';
/** Progressive enhancement: the server-rendered storefront stays visible without JS. */
export default function StudioMotion({route}){
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  const root=document.documentElement;
  let frame=0,scrollFrame=0;
  const move=e=>{if(!fine.matches||reduced.matches)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   root.style.setProperty('--pointer-x',e.clientX+'px');root.style.setProperty('--pointer-y',e.clientY+'px');
   const card=e.target.closest('.studio-card,.product,.cloud-provider-card,.detail-related');
   if(card){const b=card.getBoundingClientRect();card.style.setProperty('--card-x',e.clientX-b.left+'px');card.style.setProperty('--card-y',e.clientY-b.top+'px');}
  });};
  const scroll=()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;root.style.setProperty('--reading-progress',max>0?Math.min(1,scrollY/max):0);document.body.classList.toggle('studio-scrolled',scrollY>30);});};
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,{passive:true});scroll();
  const targets=document.querySelectorAll('[data-reveal],.product,.cloud-provider-card,.detail-related,.editorial-guide>section,.contact-methods>a');
  let observer;
  if(!reduced.matches&&'IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}},{threshold:.06});targets.forEach((el,i)=>{el.style.setProperty('--reveal-delay',Math.min(i%3,2)*65+'ms');el.classList.add('will-reveal');observer.observe(el);});}
  return()=>{observer?.disconnect();targets.forEach(el=>el.classList.remove('will-reveal','is-revealed'));window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll);cancelAnimationFrame(frame);cancelAnimationFrame(scrollFrame);};
 },[route]);
 return <><div className="studio-pointer-glow" aria-hidden="true"/><div className="studio-reading-progress" aria-hidden="true"/></>;
}
