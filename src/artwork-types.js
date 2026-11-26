export function artworkType(p){
  const text=[p.name,p.kind,p.variant,p.provider,p.category,p.slug].filter(Boolean).join(' ');
  if(/marketplace/i.test(text))return 'marketplace';
  if(/SMTP|Amazon SES|amazon-ses/i.test(text))return 'smtp';
  if(/Kiro/i.test(text))return 'kiro';
  if(/Bedrock|AI development|Claude/i.test(text))return 'ai';
  if(/free[ -]?trial|getting started/i.test(text))return 'trial';
  if(/credit|prepaid/i.test(text))return 'credits';
  if(/vCPU|droplet|server account|cloud compute/i.test(text)||p.category==='AWS'||p.provider==='Amazon Web Services'||p.slug==='aws')return 'compute';
  return 'network';
}
export const artworkImage=p=>'/products/premium/cloud-console-v2-1200.webp';
export const artworkDescriptions={trial:'cloud trial access key and open portal',compute:'cloud compute server stack',credits:'cloud credit account',ai:'Bedrock AI neural processor',kiro:'Kiro developer code terminal',smtp:'SMTP email server and envelope',marketplace:'cloud software storefront',network:'multicloud infrastructure network'};
