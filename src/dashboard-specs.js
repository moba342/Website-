// Values describe catalog tiers, not a live account balance or a verified quota.
const creditTiers={108:1000,109:5000,110:10000,111:25000,112:50000,113:100000,301:300,304:2000,305:5000,306:25000,307:200,308:200,310:5000,312:100,314:300,318:500};
export function dashboardSpecs(product){
 const text=[product.name,...product.features].join(' ');
 const vcpu=text.match(/(\d[\d,]*)\s*vcpus?/i)?.[1];
 const rpm=text.match(/(\d+(?:K)?)\s*RPM/i)?.[1];
 const credit=creditTiers[product.id];
 return {credit:credit==null?'Not listed':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(credit),vcpu:vcpu?Number(vcpu.replaceAll(',','')).toLocaleString('en-US')+' vCPUs':'Not listed',rpm:rpm?rpm.toUpperCase()+' RPM':null};
}
