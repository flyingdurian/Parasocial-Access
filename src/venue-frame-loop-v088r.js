// A single rendering exception must not permanently stop the venue's RAF
// driver. Schedule the next frame even when one simulation/render pass fails.
export function createResilientAnimationLoop(step,{schedule=callback=>requestAnimationFrame(callback),onError=error=>console.error(error)}={}){
 let lastReport=-Infinity;
 return function frame(now){
  try{step(now);}
  catch(error){
   // A persistent visual defect may keep throwing: log at most once per 3s,
   // while allowing a fixed asset or visibility change to resume naturally.
   if(now-lastReport>3000){lastReport=now;onError(error);}
  }finally{schedule(frame);}
 };
}
