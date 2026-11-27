/** Progressive enhancement. One observer handles both initial and dynamically filtered cards. */
export function initializeProductAnimations(root=document){
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(!('IntersectionObserver' in window)||media.matches)return ()=>{};
 const tracked=new Set();
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}},{threshold:.08});
 const scan=()=>{root.querySelectorAll('.product-card:not(.reveal)').forEach((card,index)=>{card.style.setProperty('--reveal-delay',(index%2)*80+'ms');card.classList.add('reveal');tracked.add(card);observer.observe(card)});for(const card of tracked)if(!card.isConnected){observer.unobserve(card);tracked.delete(card)}};
 document.documentElement.classList.add('motion-ready');scan();
 const mutation=new MutationObserver(scan);mutation.observe(root,{childList:true,subtree:true});
 const finish=()=>{observer.disconnect();mutation.disconnect();for(const card of tracked){card.classList.remove('reveal','is-visible');card.style.removeProperty('--reveal-delay')}tracked.clear();document.documentElement.classList.remove('motion-ready');media.removeEventListener('change',changed)};
 const changed=()=>{if(media.matches)finish()};media.addEventListener('change',changed);
 return finish;
}
