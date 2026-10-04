// Compilation is trusted worker code; user programs execute only in opaque sandboxes.
function compilePractice(code,typed=false,dom=false){return new Promise(resolve=>{const worker=new Worker('compiler-worker.js');const timer=setTimeout(()=>{worker.terminate();resolve({error:t().practiceTimeout});},15000);worker.onmessage=e=>{clearTimeout(timer);worker.terminate();resolve(e.data);};worker.onerror=e=>{clearTimeout(timer);worker.terminate();resolve({error:e.message});};worker.postMessage({code,typed,dom});});}
const previousPracticeRunner=runAcademyPractice;
let domPreviewDocument='',domPreviewFiles='';
function domDocument(files,code,nonce,check){
 const tests=check?`const initial=document.querySelector('#count')?.textContent;const button=document.querySelector('#increment');button?.click();button?.click();results.push({label:'Counter: 0 → 2 after two clicks',passed:initial==='0'&&document.querySelector('#count')?.textContent==='2'});`:'';
 const script=`(()=>{let steps=0;const __kachanTick=()=>{if(++steps>10000)throw Error('Execution limit exceeded');};const output=[];const console={log:(...args)=>{if(output.length<100)output.push(args.map(String).join(' ').slice(0,2000));}};try{const results=[];${code}\n${tests}\nparent.postMessage({nonce:${JSON.stringify(nonce)},result:{output,results}},'*');}catch(e){parent.postMessage({nonce:${JSON.stringify(nonce)},result:{error:String(e.message),output,results:[]}},'*');}})();`;
 return safePracticeDocument(files,script).replace("'unsafe-eval' blob:","'none'");
}
runAcademyPractice=async function(l,files,check=true){
 if(l.kind==='typescript'){
  const compiled=await compilePractice(files.js,true);if(compiled.error)return{error:compiled.error,output:[],results:[]};
  const result=await previousPracticeRunner({...l,kind:'js',checks:[]},{...files,js:compiled.code},false);
  result.output.unshift('TypeScript '+compiled.version+' · strict ✓');result.results=check?[{label:'TypeScript strict',passed:!result.error},...sourceResults(l,files)]:[];return result;
 }
 if(l.id!=='javascript-dom')return previousPracticeRunner(l,files,check);
 const compiled=await compilePractice(files.js,false,true);if(compiled.error)return{error:compiled.error,output:[],results:[]};
 domPreviewDocument=domDocument(files,compiled.code,crypto.randomUUID(),false);
 domPreviewFiles=JSON.stringify(files);
 return new Promise(resolve=>{const frame=E('iframe');frame.hidden=true;frame.setAttribute('sandbox','allow-scripts');const nonce=crypto.randomUUID();const finish=r=>{clearTimeout(timer);window.removeEventListener('message',receive);frame.remove();resolve(r);};const receive=e=>{if(e.source===frame.contentWindow&&e.data?.nonce===nonce)finish(e.data.result);};const timer=setTimeout(()=>finish({error:t().practiceTimeout,output:[],results:[]}),2000);window.addEventListener('message',receive);frame.srcdoc=domDocument(files,compiled.code,nonce,check);document.body.append(frame);});
};
const previousAcademyRender=renderAcademy;
renderAcademy=function(){previousAcademyRender();if(academy.course==='JavaScript'&&academy.selected==='javascript-dom'){
 let frame=academyPanel.querySelector('.academy-preview');if(frame&&domPreviewDocument&&domPreviewFiles===JSON.stringify(academy.states['javascript-dom']?.files)){const fresh=frame.cloneNode(false);fresh.setAttribute('sandbox','allow-scripts');fresh.srcdoc=domPreviewDocument;frame.replaceWith(fresh);frame=fresh;const reset=button(document.documentElement.lang==='uk'?'Перезапустити прев’ю':'Restart preview',()=>{frame.srcdoc=domPreviewDocument;});frame.parentElement.before(reset);}
 const editor=academyPanel.querySelector('.exercise-editors');editor?.addEventListener('input',()=>{domPreviewDocument='';if(frame){frame.setAttribute('sandbox','');frame.srcdoc=safePracticeDocument(academyState(academyLessonList().find(l=>l.id===academy.selected)).files);}});
 }};
translations.uk.practiceSafe='JavaScript ізольований від даних сайту й мережі. DOM-прев’ю виконує код з обмеженням циклів і викликів; динамічний код та таймери недоступні. TypeScript перевіряється справжнім компілятором у strict-режимі. Git — симуляція.';
translations.en.practiceSafe='JavaScript is isolated from site data and the network. DOM preview limits loops and calls; dynamic code and timers are unavailable. TypeScript uses a real compiler in strict mode. Git is simulated.';
