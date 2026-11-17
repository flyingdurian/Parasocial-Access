import {drawInlineDggL,measureInlineDggL} from './dgg-emotes-v085.js';
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
 return focus?{alpha:1,scale:1}:{alpha:bubbleTier(index),scale:[.77,.69,.62,.58][Math.min(3,Math.max(0,index))]};
}
// Shared canvas-space layout for stage conversations, ambient bubbles and
// queued decisions. All coordinates refer to the 384×216 venue, irrespective
// of the physical resolution chosen by the graphics settings.
const clampBubble=(v,a,b)=>Math.max(a,Math.min(b,v));
export const bubbleRectsOverlap=(a,b,gap=2)=>a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;
/* A focused review card may track a floor guest without covering Destiny's
   live stage animation. Prefer a nearby head anchor, then shift into vacant
   space if the host/TV occupies that area. All values are CSS pixels. */
export function placeFocusedVenuePrompt(width,height,anchorX,anchorY,boxW,boxH,reserved=[]){
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const placements=[
  [anchorX-boxW*.48,anchorY-boxH-15],
  [anchorX-boxW*.80,anchorY-boxH-15],
  [anchorX-boxW-16,anchorY-boxH*.58],
  [anchorX+16,anchorY-boxH*.58],
  [anchorX-boxW*.48,anchorY+16]
 ];
 let fallback=null,fallbackOverlaps=Infinity;
 for(const [cx,cy] of placements){
  const left=clamp(cx,4,Math.max(4,width-boxW-4));
  const top=clamp(cy,4,Math.max(4,height-boxH-4));
  const box={x:left,y:top,w:boxW,h:boxH};
  const overlaps=reserved.filter(r=>bubbleRectsOverlap(box,r,7)).length;
  const tail=clamp(anchorX-left,12,Math.max(12,boxW-18));
  const result={left,top,tail,attached:Math.abs(anchorX-(left+tail))<45};
  if(!overlaps)return result;
  if(overlaps<fallbackOverlaps){fallback=result;fallbackOverlaps=overlaps;}
 }
 return fallback??{left:4,top:4,tail:12,attached:false};
}

export function createBubbleLayout(reserved=[]){
 const occupied=[];
 const reserve=rect=>{
  if(rect&&[rect.x,rect.y,rect.w,rect.h].every(Number.isFinite)&&rect.w>0&&rect.h>0)occupied.push({...rect});
  return rect;
 };
 reserved.forEach(reserve);
 return {
  reserve,
  get occupied(){return occupied.map(rect=>({...rect}));},
  // Spoken lines must stay next to their OWN actor. A dropped bubble is less
  // confusing than one teleported across the venue to the only empty corner.
  placeNear(anchorX,anchorY,w,h){
   const positions=[
    [anchorX-w*.5,anchorY-h-7],
    [anchorX-w*.72,anchorY-h-9],
    [anchorX-w*.28,anchorY-h-9],
    [anchorX-w*.5,anchorY+9]
   ];
   for(const [x,y] of positions){
    const rect={x:clampBubble(x,2,382-w),y:clampBubble(y,2,214-h),w,h};
    const tipX=clampBubble(anchorX,rect.x,rect.x+w);
    const tipY=clampBubble(anchorY,rect.y,rect.y+h);
    if(Math.hypot(anchorX-tipX,anchorY-tipY)>12)continue;
    if(!occupied.some(other=>bubbleRectsOverlap(rect,other,1))){reserve(rect);return rect;}
   }
   return null;
  },
  place(anchorX,anchorY,w,h){
   if(!(w>0&&h>0&&w<=378&&h<=210))return null;
   const candidates=[
    [anchorX-w/2,anchorY-h-9],
    [anchorX-w-12,anchorY-h/2],
    [anchorX+12,anchorY-h/2],
    [anchorX-w/2,anchorY+12],
    [anchorX-w/2-25,anchorY-h-17],
    [anchorX-w/2+25,anchorY-h-17],
    [3,anchorY-h-9],
    [381-w,anchorY-h-9]
   ];
   for(const [cx,cy] of candidates){
    const rect={x:clampBubble(cx,3,381-w),y:clampBubble(cy,3,213-h),w,h};
    if(!occupied.some(other=>bubbleRectsOverlap(rect,other))){reserve(rect);return rect;}
   }
   return null;
  }
 };
}
export function reserveCanvasOverlay(layout,canvas,overlay){
 if(!layout||!canvas||!overlay||overlay.hidden)return null;
 const c=canvas.getBoundingClientRect(),r=overlay.getBoundingClientRect();
 if(!c.width||!c.height||!r.width||!r.height)return null;
 const rect={x:(r.left-c.left)*384/c.width,y:(r.top-c.top)*216/c.height,w:r.width*384/c.width,h:r.height*216/c.height};
 layout.reserve(rect);
 return rect;
}
export function fitMeasuredText(ctx,value,maxWidth,marker='…'){
 const text=String(value??'');
 if(ctx.measureText(text).width<=maxWidth)return text;
 let fitted='';
 for(const character of text){
  if(ctx.measureText(fitted+character+marker).width>maxWidth)break;
  fitted+=character;
 }
 return fitted+marker;
}
export function wrapMeasuredText(ctx,value,maxWidth,maxLines=3){
 const text=String(value??'').replace(/\s+/g,' ').trim();
 if(!text)return [];
 const lines=[];let current='';
 for(const word of text.split(' ')){
  if(ctx.measureText(word).width>maxWidth){
   if(current){lines.push(current);current='';}
   let chunk='';
   for(const character of word){
    if(chunk&&ctx.measureText(chunk+character).width>maxWidth){lines.push(chunk);chunk=character;}
    else chunk+=character;
   }
   current=chunk;
   continue;
  }
  const candidate=current?current+' '+word:word;
  if(current&&ctx.measureText(candidate).width>maxWidth){lines.push(current);current=word;}
  else current=candidate;
 }
 if(current)lines.push(current);
 if(lines.length>maxLines){
  const visible=lines.slice(0,maxLines);
  visible[maxLines-1]=fitMeasuredText(ctx,visible[maxLines-1]+'…',maxWidth);
  return visible;
 }
 return lines;
}
export function drawBubblePointer(ctx,box,anchorX,anchorY,color){
 const {x,y,w,h}=box;ctx.fillStyle=color;ctx.beginPath();
 if(anchorY>=y+h){
  const tx=clampBubble(anchorX,x+8,x+w-8);
  ctx.moveTo(tx-4,y+h-1);ctx.lineTo(tx,Math.min(anchorY,y+h+8));ctx.lineTo(tx+4,y+h-1);
 }else if(anchorY<=y){
  const tx=clampBubble(anchorX,x+8,x+w-8);
  ctx.moveTo(tx-4,y+1);ctx.lineTo(tx,Math.max(anchorY,y-8));ctx.lineTo(tx+4,y+1);
 }else if(anchorX<x){
  const ty=clampBubble(anchorY,y+7,y+h-7);
  ctx.moveTo(x+1,ty-4);ctx.lineTo(Math.max(anchorX,x-8),ty);ctx.lineTo(x+1,ty+4);
 }else{
  const ty=clampBubble(anchorY,y+7,y+h-7);
  ctx.moveTo(x+w-1,ty-4);ctx.lineTo(Math.min(anchorX,x+w+8),ty);ctx.lineTo(x+w-1,ty+4);
 }
 ctx.fill(); // canvas fills the triangle implicitly; tolerates minimal test contexts
}
export function drawQueuedDecisionBubble(ctx,content,x,y,index,type='welcome',layout=null,mascot=null){
 if(!content)return null;
 const {alpha,scale}=decisionBubbleStyle(index),miniature=index>=3;
 const text=String(content).replace(/\s+/g,' ').trim();
 const width=miniature?65:94;
 ctx.save();ctx.textAlign='left';ctx.textBaseline='alphabetic';
 ctx.font=miniature?'bold 6px system-ui,sans-serif':'bold 6.2px system-ui,sans-serif';
 const lines=miniature?[]:wrapMeasuredText(ctx,text,width-12,2);
 const height=miniature?16:10+Math.max(1,lines.length)*7;
 const outerW=width*scale,outerH=(height+8)*scale;
 const placed=layout?layout.place(x,y,outerW,outerH):{
  x:clampBubble(x-outerW/2,4,380-outerW),
  y:clampBubble(y-(height+12)*scale,4,212-outerH),w:outerW,h:outerH
 };
 if(!placed){ctx.restore();return null;}
 const bx=placed.x,by=placed.y;ctx.globalAlpha=alpha;
 ctx.translate(bx,by);ctx.scale(scale,scale);
 ctx.fillStyle='rgba(10,12,34,.65)';ctx.fillRect(3,3,width,height);
 const border=index===0?'#7decf2':index===1?'#e2b3f7':index===2?'#ffd18f':'#70647f';
 const background=miniature?'#312b47':type==='security'?'#fff0e7':'#fff9eb';
 ctx.fillStyle=background;ctx.fillRect(0,0,width,height);
 ctx.strokeStyle=border;ctx.lineWidth=2;ctx.strokeRect(.5,.5,width-1,height-1);
 ctx.fillStyle=miniature?'#d9cbea':'#322f49';
 if(miniature)ctx.fillText('◷ QUEUED · '+(index+2),6,12,width-12);
 else{
  ctx.beginPath();ctx.rect(4,3,width-8,height-5);ctx.clip();
  lines.forEach((line,i)=>drawInlineDggL(ctx,line,6,10+i*7,mascot,8));
 }
 ctx.restore();
 ctx.save();ctx.globalAlpha=alpha;
 drawBubblePointer(ctx,{x:bx,y:by,w:outerW,h:height*scale},x,y,background);
 ctx.restore();
 return placed;
}
// Short comic-style shout above an actual spectator, never broadcast on TV.
export function drawDebateShout(ctx,person,layout=null){
 const ttl=person?.debateSpeechTime||0;
 if(ttl<=0||!person?.debateSpeech)return null;
 const max=1.85,elapsed=max-ttl;
 const message=String(person.debateSpeech);
 ctx.save();ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.font='bold 5.5px system-ui,sans-serif';
 const width=Math.min(78,Math.max(42,ctx.measureText(message).width/2+11));
 const parts=wrapMeasuredText(ctx,message,width-13,Number.POSITIVE_INFINITY);
 const height=8+parts.length*7;
 const x=person.x+14,y=person.y-5-Math.min(4,elapsed*5);
 // Never bypass a declined collision placement: the fallback used to render
 // an unreserved shout on top of its speaker or the selected decision card.
 const box=layout?layout.placeNear(x,y,width,height):{x:Math.max(2,Math.min(382-width,x-width/2)),y:Math.max(1,y-height-3),w:width,h:height};
 if(!box||Math.abs(box.x+box.w/2-x)>61||Math.abs(box.y+box.h-y)>46){ctx.restore();return null;}
 ctx.globalAlpha=Math.max(0,Math.min(1,ttl/.3));
 const angry=person.animation==='argue'||person.animation==='heckle';
 const wobble=Math.sin(elapsed*22+(person.id||0))*.7,accent=angry?'#ed6996':'#67d8ed';
 ctx.save();ctx.translate(box.x+width/2,box.y+height/2);ctx.rotate(wobble*.023);
 const bw=width/2,bh=height/2;
 ctx.beginPath();ctx.moveTo(-bw+3,-bh);ctx.lineTo(-bw+12,-bh-2);ctx.lineTo(0,-bh);ctx.lineTo(bw-7,-bh-2);ctx.lineTo(bw,-bh+3);ctx.lineTo(bw+2,0);ctx.lineTo(bw,bh-3);ctx.lineTo(bw-10,bh+2);ctx.lineTo(-bw+7,bh);ctx.lineTo(-bw-2,bh-4);ctx.lineTo(-bw,0);ctx.closePath?.();
 ctx.fillStyle=angry?'#fff0e7':'#f5f8ff';ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle=accent;ctx.stroke();
 // Ink-like radiating ticks make reactions energetic without floating labels.
 for(let ray=0;ray<4;ray++){const sign=ray%2?1:-1,ry=(ray<2?-bh:bh)-sign;ctx.beginPath();ctx.moveTo(sign*(bw+2),ry);ctx.lineTo(sign*(bw+4+Math.sin(elapsed*21)*1.5),ry+(ray<2?-3:3));ctx.stroke();}
 ctx.fillStyle='#262a49';for(let i=0;i<parts.length;i++)ctx.fillText(parts[i],-bw+6,-bh+9+i*7,width-12);
 ctx.restore();drawBubblePointer(ctx,box,x,y,accent);
 ctx.restore();return box;
}
export function drawAmbientBubble(ctx,content,x,y,opacity=1,max=45,layout=null,mascot=null){
 if(!content||opacity<=0)return null;
 ctx.save();ctx.globalAlpha=opacity;ctx.textAlign='left';ctx.textBaseline='alphabetic';
 ctx.font='bold 5.8px system-ui,sans-serif';
 const text=String(content).replace(/\s+/g,' ').trim();
 // Let a line finish. A fixed 28-character slice caused 'I brought a sig…'
 // even though the speaker had the full sentence in their simulation state.
 const width=Math.min(86,Math.max(43,measureInlineDggL(ctx,text,mascot,8)+10));
 const lines=wrapMeasuredText(ctx,text,width-10,Number.POSITIVE_INFINITY);
 const height=6+Math.max(1,lines.length)*7;
 const placed=layout?layout.placeNear(x,y,width,height):{
  x:clampBubble(x-width/2,2,382-width),y:clampBubble(y-height-7,2,213-height),w:width,h:height
 };
 if(!placed){ctx.restore();return null;}
 ctx.fillStyle='#fff9ef';ctx.fillRect(placed.x,placed.y,width,height);
 ctx.save();ctx.beginPath();ctx.rect(placed.x+4,placed.y+1,width-8,height-2);ctx.clip();
 ctx.fillStyle='#344052';lines.forEach((line,i)=>drawInlineDggL(ctx,line,placed.x+5,placed.y+8+i*7,mascot,8));
 ctx.restore();drawBubblePointer(ctx,placed,x,y,'#fff9ef');ctx.restore();
 return placed;
}
