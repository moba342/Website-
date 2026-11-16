import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {dashboardSpecs} from '../src/dashboard-specs.js';
const read=async name=>JSON.parse(await readFile('src/'+name,'utf8'));
const products=[...await read('aws-products.json'),...(await read('cloud-service-products.json')).flatMap(p=>p.variants),...await read('starter-products.json')];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const trim=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
await mkdir('public/products/dashboards',{recursive:true});
for(const p of products){
 const spec=dashboardSpecs(p),name=esc(trim(p.name,62)),provider=esc(p.provider),credit=esc(spec.credit),vcpu=esc(spec.vcpu);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="680" viewBox="0 0 1000 680" role="img" aria-labelledby="title description">
 <title id="title">${esc(p.name)} — illustrative account dashboard</title>
 <desc id="description">Catalog credit tier: ${credit}. Listed vCPU limit: ${vcpu}. Illustration only; actual balance, eligibility, and regional quotas require confirmation.</desc>
 <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#172b48"/><stop offset="1" stop-color="#0b172b"/></linearGradient><linearGradient id="card" x2="0" y2="1"><stop stop-color="#1a3455"/><stop offset="1" stop-color="#11243e"/></linearGradient></defs>
 <rect x="1" y="1" width="998" height="678" rx="22" fill="url(#bg)" stroke="#36577e" stroke-width="2"/>
 <path d="M1 80H999" stroke="#36577e"/>
 <rect x="30" y="24" width="31" height="31" rx="9" fill="#2672ed"/><path d="M37 45h16m-13-7h10" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
 <g font-family="Arial,Helvetica,sans-serif"><text x="75" y="46" fill="#ecf5ff" font-size="21" font-weight="700">CloudsSupply</text>
 <rect x="765" y="24" width="203" height="32" rx="16" fill="#203a59" stroke="#41628b"/><text x="866" y="45" fill="#a7cdff" text-anchor="middle" font-size="12" letter-spacing="1.2">ILLUSTRATIVE PREVIEW</text>
 <text x="42" y="126" fill="#8db8ec" font-size="14" letter-spacing="2">ACCOUNT OVERVIEW</text>
 <text x="42" y="166" fill="#f0f6ff" font-size="28" font-weight="700">${provider}</text>
 <text x="42" y="198" fill="#9eb9db" font-size="18">${name}</text>
 <rect x="42" y="234" width="446" height="212" rx="14" fill="url(#card)" stroke="#365a81"/>
 <rect x="512" y="234" width="446" height="212" rx="14" fill="url(#card)" stroke="#365a81"/>
 <circle cx="81" cy="275" r="17" fill="#234b64"/><text x="81" y="282" text-anchor="middle" fill="#72dcd1" font-size="22">$</text>
 <text x="110" y="281" fill="#bfd5ef" font-size="19">Credit balance</text>
 <text x="68" y="347" fill="#d9fff6" font-size="48" font-weight="700">${credit}</text>
 <text x="68" y="383" fill="#8fb2d3" font-size="16">${spec.credit==='Not listed'?'Confirm available credits with support':'Listed credit tier · eligibility applies'}</text>
 <path d="M68 413H462" stroke="#2e506b" stroke-width="7" stroke-linecap="round"/>
 <rect x="540" y="258" width="30" height="30" rx="6" fill="#224c7d"/><rect x="548" y="266" width="14" height="14" rx="2" fill="none" stroke="#80baff" stroke-width="2"/>
 <text x="582" y="281" fill="#bfd5ef" font-size="19">vCPU limit</text>
 <text x="538" y="347" fill="#b5d8ff" font-size="48" font-weight="700">${vcpu}</text>
 <text x="538" y="383" fill="#8fb2d3" font-size="16">${spec.vcpu==='Not listed'?'Confirm compute quotas with support':'Listed account tier · confirm region'}</text>
 <path d="M538 413H932" stroke="#2d4e75" stroke-width="7" stroke-linecap="round"/>
 <rect x="42" y="472" width="916" height="86" rx="12" fill="#101f35" stroke="#304968"/>
 <circle cx="77" cy="515" r="7" fill="#61afff"/>
 <text x="99" y="506" fill="#d5e7fc" font-size="17">${spec.rpm?'Bedrock request tier: '+esc(spec.rpm):'Account specifications, clearly presented'}</text>
 <text x="99" y="535" fill="#8da9cc" font-size="15">${spec.rpm?'Model access and request quotas require confirmation.':'Review credit terms and service quotas before ordering.'}</text>
 <path d="M42 590H958" stroke="#304968"/>
 <text x="42" y="620" fill="#aac5e8" font-size="15">Illustration only — not a screenshot or proof of account balance.</text>
 <text x="42" y="647" fill="#7e9abf" font-size="14">Actual credits, expiry, eligibility, and quotas must be confirmed for your order.</text>
 </g></svg>`;
 await writeFile(`public/products/dashboards/${p.id}.svg`,svg);
}
console.log(`Generated ${products.length} original catalog dashboard illustrations.`);
