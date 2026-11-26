import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const origin=process.argv[2]||'http://localhost:4173',label=process.argv[3]||'local';
const targets=[['home','/'],['category','/aws-standard/'],['provider','/provider/google-cloud/'],['product','/product/aws-32-vcpu-103/'],['products','/all-products/']];
await mkdir('seo/lighthouse',{recursive:true});const summary=[];
for(const mode of ['mobile','desktop'])for(const [name,path] of targets){
 const output='seo/lighthouse/'+label+'-'+mode+'-'+name;
 const args=['node_modules/lighthouse/cli/index.js',origin+path,'--output=json','--output=html','--output-path='+output,'--chrome-flags=--headless','--only-categories=performance,accessibility,best-practices,seo','--quiet'];
 if(mode==='desktop')args.push('--preset=desktop');
 const code=await new Promise(resolve=>{const p=spawn(process.execPath,args,{env:{...process.env,CHROME_PATH:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'},stdio:['ignore','ignore','pipe']});p.stderr.on('data',d=>process.stderr.write(d));p.on('exit',resolve);});
 if(code!==0){summary.push({mode,name,url:origin+path,status:'FAIL',exitCode:code});continue;}
 const r=JSON.parse(await readFile(output+'.report.json','utf8'));
 const scores=Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)]));
 const metrics=Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','interactive'].map(k=>[k,r.audits[k]?.numericValue??null]));
 const failures=Object.entries(r.audits).filter(([k,a])=>a.score!=null&&a.score<1&&!['informative','notApplicable','manual'].includes(a.scoreDisplayMode)).map(([id,a])=>({id,title:a.title,score:a.score,display:a.displayValue||'',details:a.details}));
 summary.push({mode,name,url:origin+path,status:'TESTED',scores,metrics,failures,report:output+'.report.html',lighthouseVersion:r.lighthouseVersion,fetchTime:r.fetchTime});
 console.log(label,mode,name,JSON.stringify(scores));
 await writeFile('seo/evidence/lighthouse-'+label+'.json',JSON.stringify(summary,null,2)+'\n');
}
