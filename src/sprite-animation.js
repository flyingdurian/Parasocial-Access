/* 4x2 pose atlases are additive; approved static 4x3 crowd atlas is immutable. */
export const SPRITE_POSES=Object.freeze(['idle','talk','point','laugh','think','cheer','argue','mic']);
export const POSE_INDEX=Object.freeze({
 idle:0,walk:0,talk:1,point:2,laugh:3,think:4,impatient:4,
 cheer:5,argue:6,heckle:6,mic:7
});
const SPECIAL=Object.freeze({
 0:{idle:0,walk:1,talk:3,laugh:4,heckle:5,point:6,cheer:7,argue:5,impatient:0,think:5,mic:3},
 1:{idle:0,walk:1,talk:3,laugh:4,heckle:5,point:6,cheer:7,argue:5,impatient:0,think:0},
 3:{idle:0,walk:1,talk:3,laugh:7,heckle:5,point:4,cheer:7,argue:5,impatient:0,think:5,mic:3}
});
export const VENUE_STRIDE=2.9;
// Art-audit note (v0.8.8v): several generated atlas cells contain opaque
// fragments of their NEIGHBOUR'S pose. In particular, set-C's rear rows
// contain the previous row's feet above the next character's head. Trimming
// the whole top band would also cut real hair, so erase only disconnected
// alpha islands in the affected cells, preserving the authored artwork.
const cleanedAtlases=new WeakMap();
export function findAtlasBleedIslands(data,width,height,columns,rows,profile){
 const cw=Math.floor(width/columns),ch=Math.floor(height/rows),removed=[];
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const seen=new Uint8Array(cw*ch),queue=new Int32Array(cw*ch);
  const alphaAt=(x,y)=>data[((row*ch+y)*width+col*cw+x)*4+3];
  for(let seed=0;seed<seen.length;seed++){
   const startX=seed%cw,startY=Math.floor(seed/cw);
   if(seen[seed]||alphaAt(startX,startY)<145)continue;
   let head=0,tail=1,minX=startX,maxX=startX,minY=startY,maxY=startY;
   seen[seed]=1;queue[0]=seed;
   while(head<tail){
    const p=queue[head++],x=p%cw,y=Math.floor(p/cw);
    minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
     if(!dx&&!dy)continue;
     const nx=x+dx,ny=y+dy;
     if(nx<0||nx>=cw||ny<0||ny>=ch)continue;
     const np=ny*cw+nx;
     if(!seen[np]&&alphaAt(nx,ny)>=145){seen[np]=1;queue[tail++]=np;}
    }
   }
   const topFoot=profile==='set-c-rear'&&row>0&&minY<=1&&maxY<=37&&tail>=145&&tail<5000;
   const sideBleed=profile==='set-b-walk'&&col>=2&&col<=4&&minX>=239&&maxX>=253&&tail>=18&&tail<1200;
   const signBleed=profile==='original-stage-a'&&col===3&&minX>=236&&maxX>=253&&tail>=150&&tail<1600;
   if(topFoot||sideBleed||signBleed){
    const pixels=Array.from(queue.subarray(0,tail));
    removed.push({row,col,area:tail,minX,minY,maxX,maxY,pixels});
   }
  }
 }
 return removed;
}
function sanitizedAtlas(sheet,profile){
 if(!profile||typeof document==='undefined'||!sheet?.naturalWidth)return sheet;
 let entry=cleanedAtlases.get(sheet);
 if(entry?.profile===profile)return entry.canvas;
 const canvas=document.createElement('canvas');
 canvas.width=sheet.naturalWidth;canvas.height=sheet.naturalHeight;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 if(!ctx)return sheet;
 ctx.drawImage(sheet,0,0);
 const image=ctx.getImageData(0,0,canvas.width,canvas.height),rgba=image.data;
 const islands=findAtlasBleedIslands(rgba,canvas.width,canvas.height,6,4,profile);
 const cw=canvas.width/6,ch=canvas.height/4;
 for(const island of islands){
  // Erase selected opaque pixels and only their low-alpha antialias fringe.
  // A rectangular crop would slice the NEXT sprite's real head as well.
  for(const p of island.pixels){
   const x=island.col*cw+p%cw,y=island.row*ch+Math.floor(p/cw);
   rgba[(y*canvas.width+x)*4+3]=0;
   for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
    const nx=x+ox,ny=y+oy;
    if(nx<island.col*cw||nx>=(island.col+1)*cw||ny<island.row*ch||ny>=(island.row+1)*ch)continue;
    const a=(ny*canvas.width+nx)*4+3;
    if(rgba[a]<145)rgba[a]=0;
   }
  }
 }
 ctx.putImageData(image,0,0);
 cleanedAtlases.set(sheet,{profile,canvas});
 return canvas;
}
export function poseFrame(state,time=0,kind=0,motion=null){
 if(state==='walk'&&(kind===1||kind===3))return Math.floor((motion?.stepDistance??time/60)/VENUE_STRIDE)%2?2:1;
 const base=SPECIAL[kind]?.[state]??POSE_INDEX[state]??0;
 // Held poses avoid the unrelated idle-flash that used to make Destiny and
 // nearby crowds twitch while speaking. Action transitions are story-driven.
 return base;
}
export function walkCycleFrame(distance=0){return ((Math.floor(Math.max(0,distance)/VENUE_STRIDE)%4)+4)%4;}
export function venueSpriteGeometry(x,y,w,h,motion=null){
 const footX=x+w/2,footY=Number.isFinite(motion?.groundY)?motion.groundY+h:y+h;
 const t=Math.max(0,Math.min(1,(footY-74)/144));
 const scale=Math.max(.91,Math.min(1.05,.91+.14*t));
 const gait=motion?.walking&&Number.isFinite(motion.stepDistance)?Math.max(0,Math.sin(motion.stepDistance/VENUE_STRIDE*Math.PI/2)):0;
 // Near-zero gait variation: no visible 'moon bounce' or floating feet.
 const bob=gait*.14;
 return {x:footX-w*scale/2,y:y+h-h*scale-bob,w:w*scale,h:h*scale,footX,footY,scale,bob};
}
export function drawContactShadow(ctx,geometry,time=0,lighting='hall'){
 // Sprite atlases contain small transparent foot padding. Two soft, offset
 // light-source shadows plus a compact contact core visually join the shoes
 // to the stage/floor; geometry remains fixed during bob and hype jumps.
 const depth=Math.max(0,Math.min(1,(geometry.footY-68)/150));
 const lit=lighting==='stage';
 const focus=lit?.90:.62;
 const drift=Math.sin(time*.00056+geometry.footX*.06);
 const shift=(lit?2.2:1.2)*drift;
 const y=geometry.footY-(lit?2.6:1.7);
 const radius=Math.max(3.4,geometry.w*(lit?.25:.29)*(0.94+depth*.12));
 ctx.save();
 // Stage follow-spots drift from one truss to the other during a debate.
 // Their translucent directional cast is distinct from the shoe contact core.
 if(lit){
  const beam=Math.sin(time*.00037+geometry.footX*.009);
  ctx.fillStyle='rgba(22,9,47,.13)';ctx.beginPath();
  ctx.ellipse(geometry.footX+beam*7,y+2.6,radius*1.48,2.0,beam*.14,0,Math.PI*2);ctx.fill();
 }
 ctx.fillStyle=lit?'rgba(27,11,45,.19)':'rgba(18,12,38,.15)';
 ctx.beginPath();ctx.ellipse(geometry.footX+shift*2,y+.25,radius*1.32,2.5+depth,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=`rgba(8,6,29,${focus})`;
 ctx.beginPath();ctx.ellipse(geometry.footX,y,radius*.83,Math.max(1.2,geometry.h*.044),0,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
export function drawVenueCharacter(ctx,baseAtlas,poseAtlas,kind,state,time,x,y,w=35,h=43,walkAtlas=null,extraAtlases=null,walk4Atlases=null,motion=null,back4Atlases=null,stagePoseAtlases=null,reactionAtlases=null,originalWalk4Atlases=null,originalBack4Atlases=null,newCastAtlases=null,cosplayAtlases=null){
 const facing=motion?.facing===-1?-1:1;
 const flip=facing===-1;
 // A rear-facing concert spectator must stay rear-facing while cheering or
 // arguing. Front-only reaction sheets made the pit appear to watch the player.
 const spectatingBack=!!(motion?.debateWatching&&motion?.debateArrived&&motion?.direction==='north');
 const backReactionRow=state==='point'?2:state==='argue'||state==='heckle'?3:state==='cheer'||state==='laugh'?(Math.floor(time/230)%2?1:3):1;
 const paint=(image,sx,sy,sw,sh)=>{
  if(flip){ctx.save();ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(image,sx,sy,sw,sh,0,0,w,h);ctx.restore();}
  else ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h);
 };
 // Six new full-direction cosplayers: four authored foot phases each for
 // front, side and rear movement plus four front-facing reaction states.
 if(kind>=36&&kind<42){
  const action=state!=='walk'&&state!=='idle';
  const back=motion?.direction==='north'||spectatingBack;
  const moving=state==='walk';
  const sheet=back?cosplayAtlases?.back:action?cosplayAtlases?.react:moving&&motion?.direction==='south'?cosplayAtlases?.front:moving?cosplayAtlases?.walk:cosplayAtlases?.react;
  if(sheet?.complete&&sheet.naturalWidth>0){
   const frame=back&&spectatingBack?backReactionRow:action?(state==='talk'||state==='mic'?0:state==='cheer'||state==='laugh'?1:state==='point'?2:3):moving?walkCycleFrame(motion?.stepDistance??time/18):0;
   const cw=sheet.naturalWidth/6,ch=sheet.naturalHeight/4;
   paint(sheet,(kind-36)*cw,frame*ch,cw,ch);
   return true;
  }
  kind=2;
 }
 // Six additional 4-row character sheets: rear walk, side walk, front reactions.
 if(kind>=30&&kind<36){
  const action=state!=='walk'&&state!=='idle';
  const rear=motion?.direction==='north';
  const sheet=spectatingBack&&newCastAtlases?.back?.naturalWidth?newCastAtlases.back:action||state==='idle'&&!rear?newCastAtlases?.react:rear?newCastAtlases?.back:newCastAtlases?.walk;
  if(sheet?.complete&&sheet.naturalWidth>0){
   const row=spectatingBack&&sheet===newCastAtlases?.back?backReactionRow:action?(state==='talk'||state==='mic'?0:state==='cheer'||state==='laugh'?1:state==='point'?2:3):state==='walk'?walkCycleFrame(motion?.stepDistance??time/18):0;
   const cw=sheet.naturalWidth/6,ch=sheet.naturalHeight/4;
   paint(sheet,(kind-30)*cw,row*ch,cw,ch);
   return true;
  }
  kind=2; // artwork loading fallback
 }
 if(kind>=12&&kind<=29){
  const sheetIndex=Math.floor((kind-12)/6);
  const action=state!=='walk'&&state!=='idle';
  const reaction=action&&!spectatingBack?reactionAtlases?.[sheetIndex]:null;
  const rear=motion?.direction==='north'&&(state==='walk'||state==='idle'||spectatingBack);
  const directional=rear?back4Atlases?.[sheetIndex]:walk4Atlases?.[sheetIndex];
  const sheet=spectatingBack&&directional?.naturalWidth?directional:reaction?.naturalWidth?reaction:(state==='walk'||rear)&&directional?.naturalWidth?directional:extraAtlases?.[sheetIndex];
  if(sheet?.complete&&sheet.naturalWidth>0){
   const col=(kind-12)%6,rows=sheet===reaction||sheet===walk4Atlases?.[sheetIndex]||sheet===back4Atlases?.[sheetIndex]?4:2;
   const row=spectatingBack&&sheet===back4Atlases?.[sheetIndex]?backReactionRow:sheet===reaction?state==='talk'||state==='mic'?0:state==='cheer'||state==='laugh'?1:state==='point'?2:3:state==='walk'?(rows===4?walkCycleFrame(motion?.stepDistance??time/18):Math.floor((motion?.stepDistance??time/60)/VENUE_STRIDE)%2):0;
   const cw=sheet.naturalWidth/6,ch=sheet.naturalHeight/rows;
   const profile=sheetIndex===2&&sheet===back4Atlases?.[2]?'set-c-rear':sheetIndex===1&&sheet===walk4Atlases?.[1]?'set-b-walk':null;
   paint(sanitizedAtlas(sheet,profile),col*cw,row*ch,cw,ch);
   return true;
  }
  kind=2; // temporary visible fallback during image loading, never broken art.
 }
 // The original 12 cast members now have the same four authored steps and
 // actual north-facing sheets as the later expansion sets.
 if(kind>=0&&kind<12&&(spectatingBack||state==='walk'||(state==='idle'&&motion?.direction==='north'))){
  const group=Math.floor(kind/6);
  const rear=motion?.direction==='north';
  const sheet=rear?originalBack4Atlases?.[group]:originalWalk4Atlases?.[group];
  if(sheet?.complete&&sheet.naturalWidth){
   const sw=sheet.naturalWidth/6,sh=sheet.naturalHeight/4;
   const row=spectatingBack?backReactionRow:state==='walk'?walkCycleFrame(motion?.stepDistance??time/18):1;
   paint(sheet,(kind%6)*sw,row*sh,sw,sh);
   return true;
  }
 }
 if(poseAtlas?.complete&&poseAtlas.naturalWidth>0&&poseAtlas.naturalHeight>0){
  const frame=poseFrame(state,time,kind,motion),col=frame%4,row=Math.floor(frame/4);
  const cw=poseAtlas.naturalWidth/4,ch=poseAtlas.naturalHeight/2;
  paint(poseAtlas,col*cw,row*ch,cw,ch);
  return true;
 }
 // Original cast gets authored action poses during face-to-face encounters.
 // Keep the approved idle/walk atlas and the host/guard's dedicated poses.
 if(kind>=0&&kind<12&&state!=='idle'&&state!=='walk'){
  const sheet=stagePoseAtlases?.[Math.floor(kind/6)];
  if(sheet?.complete&&sheet.naturalWidth>0){
   const row=state==='talk'||state==='mic'?1:state==='cheer'||state==='laugh'?2:state==='point'||state==='argue'||state==='heckle'?3:0;
   const cw=sheet.naturalWidth/6,ch=sheet.naturalHeight/4;
   paint(sanitizedAtlas(sheet,kind<6?'original-stage-a':null),(kind%6)*cw,row*ch,cw,ch);
   return true;
  }
 }
 if(!baseAtlas?.complete||!baseAtlas.naturalWidth)return false;
 const cell=baseAtlas.naturalWidth/4;
 const walking=state==='walk'&&walkAtlas?.complete&&walkAtlas.naturalWidth>0&&Math.floor((motion?.stepDistance??time/55)/VENUE_STRIDE)%2===1;
 const sheet=walking?walkAtlas:baseAtlas;
 const cw=sheet.naturalWidth/4,ch=sheet.naturalHeight/3;
 paint(sheet,(kind%4)*cw,Math.floor(kind/4)*ch,cw,ch);
 return false;
}
export function stageAction(phase,seconds,queuePressure=0,mood='idle'){
 // During bloodsports do not override the final boss with queue-pressure idle talk.
 if(mood==='argue'||mood==='heckle')return mood;
 if(mood==='surge'||queuePressure>=3)return 'point';
 if(mood==='nod')return 'cheer';
 if(mood==='concern')return 'think';
 if(mood==='point')return 'point';
 if(mood==='talk')return 'talk';
 if(mood==='mic')return 'mic';
 const beat=seconds%13;
 if(beat>=3&&beat<5)return 'talk';   // acknowledges the entering line
 if(beat>=5&&beat<7)return 'think';  // a visible wristwatch check
 if(beat>=7&&beat<11)return 'mic';   // sustained PA address at the mic
 if(phase===3&&beat>=11)return 'point';
 return 'idle';
}
export function stagePosition(action,seconds=0,meeting=false){
 // The baked stage's LCD spans x233..303 and its legend occupies the right
 // third. Destiny stays on the LEFT performance zone; the visiting guest
 // uses the right exchange spot. No five-stop pacing across the display.
 if(meeting)return {x:198,y:32};
 if(action==='mic')return {x:203,y:32};
 const route=[{x:198,y:32},{x:202,y:32},{x:206,y:32},{x:200,y:32}];
 return route[Math.floor(seconds/5)%route.length];
}
