import React,{useId,useState} from 'react';
import {Search,SlidersHorizontal} from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import {allProducts} from './catalog-data.js';
export default function ProductCatalog({items=allProducts,onAdd,title='Compare account options',eyebrow='THE ACCOUNT COLLECTION',description,headingLevel=2,searchLabel='Search products',id='products',contained=true}){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All products'),[sort,setSort]=useState('featured');const uid=useId(),Heading='h'+headingLevel;
 // Resolve raw records to enriched catalog entries without changing authoritative data.
 const products=items.map(p=>allProducts.find(v=>v.id===p.id)||p);
 const multiProvider=new Set(products.map(p=>p.providerSlug)).size>1;
 const key=p=>multiProvider?(p.category||p.provider):(p.group||p.kind||'Account options');
 const categories=['All products',...new Set(products.map(key))];
 const visible=products.filter(p=>(category==='All products'||key(p)===category)&&[p.name,p.desc,p.provider,...p.features].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
 const ordered=[...visible].sort(sort==='low'?(a,b)=>(a.price??Infinity)-(b.price??Infinity):sort==='high'?(a,b)=>(b.price??-Infinity)-(a.price??-Infinity):sort==='name'?(a,b)=>a.name.localeCompare(b.name):()=>0);
 const reset=()=>{setCategory('All products');setQuery('')};
 const options=<>{categories.map(c=><button key={c} type="button" className="product-filter-option" aria-pressed={category===c} onClick={()=>setCategory(c)}><span className="mp-radio" aria-hidden="true"/><span>{c}</span><small>{c==='All products'?products.length:products.filter(p=>key(p)===c).length}</small></button>)}</>;
 return <section className={(contained?'container ':'')+'marketplace-catalog'} id={id}>
 <div className="mp-catalog-heading"><div><div className="eyebrow">{eyebrow}</div><Heading>{title}</Heading>{description&&<p>{description}</p>}</div><label className="mp-search"><Search size={16}/><input type="search" aria-label={searchLabel} placeholder="Search products…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
 <div className="mp-catalog-layout"><aside className="product-filter-sidebar" aria-label="Product categories"><h2><SlidersHorizontal size={15}/> Categories</h2><div>{options}</div></aside>
 <div className="mp-catalog-results"><div className="mp-results-toolbar"><details className="mp-mobile-filters"><summary><SlidersHorizontal size={15}/>Categories{category!=='All products'&&<span> / {category}</span>}</summary><div>{options}</div></details><span role="status" aria-live="polite">{visible.length} {visible.length===1?'product':'products'}</span><label htmlFor={uid}>Sort by <select id={uid} aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div>
 <div className="market-card-grid">{ordered.map(p=><ProductCard key={p.id} product={p} onAdd={onAdd} headingLevel={headingLevel===1?2:3}/>)}</div>
 {!visible.length&&<div className="mp-empty"><h3>No matching products</h3><p>Try another provider, account tier or specification.</p><button className="product-details-button" onClick={reset}>Reset filters</button></div>}
 <p className="mp-catalog-note">Purchase prices are in USD. Cloud credit balances, required provider payments and usage fees are separate. Confirm current availability, account eligibility, region and quotas before payment. <a href="/contact/">Ask about a product</a>.</p>
 </div></div></section>
}
