import React from 'react';
import './brand.css';

export default function BrandLogo() {
  return <span className="brand-logo">
    <img src="/brand/cloudssupply-wordmark-700.webp" srcSet="/brand/cloudssupply-wordmark-440.webp 440w, /brand/cloudssupply-wordmark-700.webp 700w" sizes="(max-width:400px) 174px, (max-width:760px) 220px, 260px" alt="CloudsSupply" width="700" height="176" decoding="async"/>
  </span>;
}
