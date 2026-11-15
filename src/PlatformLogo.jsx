import React from 'react';
import './platform-logos.css';
export default function PlatformLogo({slug}){return <span className={'platform-logo platform-logo-'+slug} aria-hidden="true"><img src={'/logos/on-dark/'+slug+'.svg'} alt="" width="44" height="28" loading="lazy" decoding="async"/></span>}
