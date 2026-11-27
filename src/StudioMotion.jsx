import React,{useEffect,useState} from 'react';
/** Progressive enhancement: the server-rendered storefront stays visible without JS. */
export default function StudioMotion({route}){
 const[paused,setPaused]=useState(false);
 useEffect(()=>{document.documentElement.classList.toggle('motion-paused',paused);return()=>document.documentElement.classList.remove('motion-paused')},[paused]);
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  const root=document.documentElement;
  const clickLayer=document.querySelector('.studio-click-layer');
  let frame=0,scrollFrame=0;
  const halos=new Map();
  const click=e=>{
   if(root.classList.contains('motion-paused')||!clickLayer||reduced.matches||e.button!==0||e.target.closest('input,textarea,select'))return;
   if(halos.size>=5){const [node,timer]=halos.entries().next().value;clearTimeout(timer);node.remove();halos.delete(node);}
   const halo=document.createElement('span');halo.className='studio-click-halo';halo.setAttribute('aria-hidden','true');halo.style.setProperty('--click-x',e.clientX+'px');halo.style.setProperty('--click-y',e.clientY+'px');clickLayer.appendChild(halo);
   const timer=setTimeout(()=>{halo.remove();halos.delete(halo);},700);halos.set(halo,timer);
  };
  const move=e=>{if(!fine.matches||reduced.matches)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   root.style.setProperty('--pointer-x',e.clientX+'px');root.style.setProperty('--pointer-y',e.clientY+'px');
   const card=e.target.closest('.studio-card,.studio-path,.product,.cloud-provider-card,.detail-related,.contact-methods>a,.variation-box');
   if(card){const b=card.getBoundingClientRect();card.style.setProperty('--card-x',e.clientX-b.left+'px');card.style.setProperty('--card-y',e.clientY-b.top+'px');}
  });};
  const scroll=()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;root.style.setProperty('--reading-progress',max>0?Math.min(1,scrollY/max):0);document.body.classList.toggle('studio-scrolled',scrollY>30);});};
  window.addEventListener('pointerdown',click,{passive:true});window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,{passive:true});scroll();
  const targets=document.querySelectorAll('[data-reveal],.product,.cloud-provider-card,.detail-related,.editorial-guide>section,.contact-methods>a');
  let observer;
  if(!reduced.matches&&'IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}},{threshold:.06});targets.forEach((el,i)=>{el.style.setProperty('--reveal-delay',Math.min(i%3,2)*65+'ms');el.classList.add('will-reveal');observer.observe(el);});}
  return()=>{window.removeEventListener('pointerdown',click);halos.forEach((timer,node)=>{clearTimeout(timer);node.remove();});halos.clear();observer?.disconnect();targets.forEach(el=>el.classList.remove('will-reveal','is-revealed'));window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll);cancelAnimationFrame(frame);cancelAnimationFrame(scrollFrame);};
 },[route]);
 return <><button className="motion-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Resume motion':'Pause motion'}</button><div className="studio-click-layer" aria-hidden="true"/><div className="studio-pointer-glow" aria-hidden="true"/><div className="studio-reading-progress" aria-hidden="true"/></>;
}
