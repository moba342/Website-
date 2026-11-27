import React from 'react';
import PlatformLogo from './PlatformLogo.jsx';
import {providerHref} from './catalog-data.js';
export default function ProviderMarquee({providers}){return <section className="provider-ribbon marquee-container" aria-label="Cloud provider collection"><div className="container ribbon-heading"><span>INDEPENDENT MARKETPLACE / YOUR PLATFORM, YOUR CHOICE</span></div><div className="marquee-track">{[0,1].map(copy=><div className="marquee-group" key={copy} aria-hidden={copy===1?true:undefined}>{providers.map(p=><a key={p.slug} href={providerHref(p)} tabIndex={copy===1?-1:undefined}><PlatformLogo slug={p.slug}/><span>{p.name.replace('Amazon Web Services','AWS').replace('Microsoft ','')}</span></a>)}</div>)}</div></section>}
