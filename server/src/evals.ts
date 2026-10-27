import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runMockAgent } from './agents/mock.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../tests/agent-evals');
let total=0,passed=0;
for(const agent of ['triage','payroll','fatigue','insights','mediator'] as const){
 const cases=JSON.parse(fs.readFileSync(path.join(root,`${agent}.json`),'utf8')) as Array<{id:string;input:{text:string}}>;let local=0;
 for(const c of cases){try{const result=runMockAgent({agent,text:c.input.text,language:'English'});if(result.validation==='valid'&&result.output!==undefined){passed++;local++}}catch(e){console.error(`${c.id}: failed`,e);}
 total++;
 }
 console.log(`${agent}: ${local}/${cases.length} passed`);
}
console.log(`Mock agent evals: ${passed}/${total} passed`);
if(passed!==total)process.exitCode=1;
