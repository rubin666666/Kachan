importScripts('vendor/typescript/typescript.js');
let libraries;
async function loadLibraries(){
 if(!libraries)libraries=(async()=>{const names=await fetch('vendor/typescript/libraries.json').then(r=>r.json()),files={};let next=0;await Promise.all(Array.from({length:6},async()=>{while(next<names.length){const name=names[next++];files[name]=await fetch('vendor/typescript/'+name).then(r=>{if(!r.ok)throw Error(name);return r.text();});}}));return files;})();
 return libraries;
}
function instrument(context){
 const f=context.factory,tick=()=>f.createExpressionStatement(f.createCallExpression(f.createIdentifier('__kachanTick'),undefined,[]));
 const block=b=>f.createBlock([tick(),...(ts.isBlock(b)?b.statements:[b])],true);
 const visit=node=>{
  node=ts.visitEachChild(node,visit,context);
  if(ts.isWhileStatement(node))return f.updateWhileStatement(node,node.expression,block(node.statement));
  if(ts.isDoStatement(node))return f.updateDoStatement(node,block(node.statement),node.expression);
  if(ts.isForStatement(node))return f.updateForStatement(node,node.initializer,node.condition,node.incrementor,block(node.statement));
  if(ts.isForOfStatement(node))return f.updateForOfStatement(node,node.awaitModifier,node.initializer,node.expression,block(node.statement));
  if(ts.isForInStatement(node))return f.updateForInStatement(node,node.initializer,node.expression,block(node.statement));
  if(ts.isBlock(node)&&node.parent&&ts.isFunctionLike(node.parent))return block(node);
  if(ts.isArrowFunction(node)&&!ts.isBlock(node.body))return f.updateArrowFunction(node,node.modifiers,node.typeParameters,node.parameters,node.type,node.equalsGreaterThanToken,f.createBlock([tick(),f.createReturnStatement(node.body)],true));
  return node;
 };
 return file=>ts.visitNode(file,visit);
}
self.onmessage=async e=>{try{
 const {code,typed,dom}=e.data;let diagnostics=[];
 if(typed){const libs=await loadLibraries(),options={strict:true,noEmitOnError:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,lib:['lib.es2022.d.ts','lib.dom.d.ts'],skipLibCheck:true};
 const source=code+'\nexport {};',host={getSourceFile:(name,version)=>{const text=name==='exercise.ts'?source:libs[name.replace(/^.*\//,'')];return text===undefined?undefined:ts.createSourceFile(name,text,version,true);},getDefaultLibFileName:()=> 'lib.es2022.d.ts',writeFile:()=>{},getCurrentDirectory:()=>'',getDirectories:()=>[],fileExists:name=>name==='exercise.ts'||!!libs[name],readFile:name=>name==='exercise.ts'?source:libs[name],getCanonicalFileName:n=>n,useCaseSensitiveFileNames:()=>true,getNewLine:()=> '\n'};
 const program=ts.createProgram(['exercise.ts'],options,host);diagnostics=ts.getPreEmitDiagnostics(program).map(d=>{const pos=d.file&&d.start!==undefined?d.file.getLineAndCharacterOfPosition(d.start):null;return (pos?`${pos.line+1}:${pos.character+1} `:'')+`TS${d.code}: `+ts.flattenDiagnosticMessageText(d.messageText,'\n');});}
 if(diagnostics.length){postMessage({error:diagnostics.join('\n'),diagnostics});return;}
 if(dom&&/\b(?:eval|Function|import|Worker|SharedWorker|requestAnimationFrame|setInterval|setTimeout|queueMicrotask|__kachanTick)\b/.test(code))throw Error('DOM practice: dynamic code, workers and scheduling APIs are unavailable.');
 const result=ts.transpileModule(code,{fileName:typed?'exercise.ts':'exercise.js',reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None},transformers:dom?{before:[instrument]}:undefined});
 const syntax=(result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);if(syntax.length)throw Error(syntax.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n')).join('\n'));
 postMessage({code:result.outputText,version:ts.version});
 }catch(error){postMessage({error:String(error.message)});}};
