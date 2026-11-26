import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
let count=0;for(const dir of ['src','scripts','tests'])for(const file of await readdir(dir))if(/\.(js|mjs)$/.test(file)){const r=spawnSync(process.execPath,['--check',dir+'/'+file],{encoding:'utf8'});if(r.status){console.error(r.stderr);process.exit(r.status);}count++;}
console.log(`Syntax checks passed: ${count} JavaScript modules. JSX is parsed by the production build. No TypeScript or configured lint pipeline is present.`);
