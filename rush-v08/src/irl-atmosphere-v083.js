/* Lightweight Canvas equivalents of warm point lighting and drifting particles. */
export function drawStageAtmosphere(ctx,time,phase=1){
 const pulse=.82+.18*Math.sin(time/850),crowd=Math.min(1,phase/3);
 ctx.save();
 const glow=ctx.createRadialGradient(286,47,2,286,55,115);
 glow.addColorStop(0,`rgba(255,202,111,${(.20+.07*crowd)*pulse})`);
 glow.addColorStop(.45,`rgba(255,163,70,${.08*pulse})`);
 glow.addColorStop(1,'rgba(255,172,74,0)');
 ctx.fillStyle=glow;ctx.fillRect(188,0,190,153);
 // Stable golden particles seeded by index rather than per-frame randomness.
 for(let i=0;i<31;i++){
  const drift=(time*(.004+i%5*.0016)+i*23)%124;
  const x=226+(i*47%120)+Math.sin(time/2300+i*4)*4;
  const y=114+(i*17%20)-drift;
  if(y<10||y>137)continue;
  ctx.globalAlpha=(.12+(i%4)*.065)*(.82+.18*Math.sin(time/650+i));
  ctx.fillStyle=i%3===0?'#fff8c9':'#ffd48e';
  ctx.fillRect(x,y,i%7===0?1.3:.75,i%7===0?1.3:.75);
 }
 ctx.restore();
}
export function ambientEmote(line,seed){
 const emotes=['dggL','YEE','PEPE','PepoThink','NODDERS','OMEGALUL'];
 return seed%4===0?`${line} ${emotes[Math.abs(seed*7)%emotes.length]}`:line;
}
export function bubbleTier(queueIndex,focus=false){
 if(focus)return 1;
 return queueIndex===0?.95:queueIndex===1?.88:queueIndex===2?.81:.48;
}
// Chaos Mode applies to QUEUED DECISION prompts only. It must never change
// ambient speech bubbles, their frequency, or their typewriter sound timing.
export function decisionBubbleStyle(index,focus=false){
 return focus?{alpha:1,scale:1}:{alpha:bubbleTier(index),scale:[.93,.87,.83,.58][Math.min(3,Math.max(0,index))]};
}
export function drawQueuedDecisionBubble(ctx,content,x,y,index,type='welcome'){
 const {alpha,scale}=decisionBubbleStyle(index);
 if(!content)return;
 const miniature=index>=3;
 const text=String(content).replace(/\s+/g,' ').trim();
 const width=miniature?92:163;
 const lines=[];
 if(!miniature){
  let current='';for(const word of text.split(' ')){
   if(current&&current.length+word.length+1>39){lines.push(current);current=word;}else current+=(current?' ':'')+word;
  }if(current)lines.push(current);
 }
 const height=miniature?17:12+Math.max(1,lines.length)*8;
 ctx.save();ctx.globalAlpha=alpha;
 const bx=Math.max(4,Math.min(384-width*scale-4,x-width*scale/2));
 const by=Math.max(6,y-(height+12)*scale);
 ctx.translate(bx,by);ctx.scale(scale,scale);
 ctx.fillStyle='rgba(10,12,34,.65)';ctx.fillRect(3,3,width,height);
 const border=index===0?'#7decf2':index===1?'#e2b3f7':index===2?'#ffd18f':'#70647f';
 ctx.fillStyle=miniature?'#312b47':type==='security'?'#fff0e7':'#fff9eb';ctx.fillRect(0,0,width,height);
 ctx.strokeStyle=border;ctx.lineWidth=2;ctx.strokeRect(.5,.5,width-1,height-1);
 ctx.fillStyle=miniature?'#d9cbea':'#322f49';ctx.font=miniature?'bold 7px system-ui,sans-serif':'bold 7.2px system-ui,sans-serif';
 if(miniature)ctx.fillText('◷ QUEUED · '+(index+2),6,12,width-12);
 else lines.forEach((line,i)=>ctx.fillText(line,6,11+i*8,width-12));
 // The pointer always touches the owner, even while boxes change tiers.
 const tailX=Math.max(5,Math.min(width-9,(x-bx)/scale));
 ctx.fillStyle=miniature?'#312b47':'#fff9eb';ctx.beginPath();ctx.moveTo(tailX-4,height-1);ctx.lineTo(tailX,height+8);ctx.lineTo(tailX+4,height-1);ctx.fill();
 ctx.restore();
}
export function drawAmbientBubble(ctx,content,x,y,opacity=1,max=45){
 if(!content||opacity<=0)return;
 ctx.save();ctx.globalAlpha=opacity;ctx.font='bold 5.8px system-ui,sans-serif';
 const text=String(content).slice(0,max),width=Math.min(155,ctx.measureText(text).width+10);
 const bx=Math.max(2,Math.min(382-width,x-width/2)),by=Math.max(7,y-16);
 ctx.fillStyle='#fff9ef';ctx.fillRect(bx,by,width,11);
 ctx.fillStyle='#344052';ctx.fillText(text,bx+5,by+7.5);
 ctx.restore();
}
