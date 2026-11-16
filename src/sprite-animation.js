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
export function poseFrame(state,time=0,kind=0,motion=null){
 if(state==='walk'&&(kind===1||kind===3))return Math.floor((motion?.stepDistance??time/60)/VENUE_STRIDE)%2?2:1;
 const base=SPECIAL[kind]?.[state]??POSE_INDEX[state]??0;
 // Held poses avoid the unrelated idle-flash that used to make Destiny and
 // nearby crowds twitch while speaking. Action transitions are story-driven.
 return base;
}
export function walkCycleFrame(distance=0){return ((Math.floor(Math.max(0,distance)/VENUE_STRIDE)%4)+4)%4;}
export function venueSpriteGeometry(x,y,w,h,motion=null){
 const footX=x+w/2,footY=y+h;
 const t=Math.max(0,Math.min(1,(footY-74)/144));
 const scale=Math.max(.91,Math.min(1.05,.91+.14*t));
 const gait=motion?.walking&&Number.isFinite(motion.stepDistance)?Math.max(0,Math.sin(motion.stepDistance/VENUE_STRIDE*Math.PI/2)):0;
 // Near-zero gait variation: no visible 'moon bounce' or floating feet.
 const bob=gait*.14;
 return {x:footX-w*scale/2,y:footY-h*scale-bob,w:w*scale,h:h*scale,footX,footY,scale,bob};
}
export function drawContactShadow(ctx,geometry){
 ctx.save();ctx.fillStyle='rgba(9,8,22,.56)';ctx.beginPath();ctx.ellipse(geometry.footX,geometry.footY+1,Math.max(5,geometry.w*.30),Math.max(1.5,geometry.h*.072),0,0,Math.PI*2);ctx.fill();ctx.restore();
}
export function drawVenueCharacter(ctx,baseAtlas,poseAtlas,kind,state,time,x,y,w=35,h=43,walkAtlas=null,extraAtlases=null,walk4Atlases=null,motion=null,back4Atlases=null,stagePoseAtlases=null,reactionAtlases=null,originalWalk4Atlases=null,originalBack4Atlases=null){
 const facing=motion?.facing===-1?-1:1;
 const flip=facing===-1;
 const paint=(image,sx,sy,sw,sh)=>{
  if(flip){ctx.save();ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(image,sx,sy,sw,sh,0,0,w,h);ctx.restore();}
  else ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h);
 };
 if(kind>=12&&kind<=29){
  const sheetIndex=Math.floor((kind-12)/6);
  const action=state!=='walk'&&state!=='idle';
  const reaction=action?reactionAtlases?.[sheetIndex]:null;
  const rear=motion?.direction==='north'&&(state==='walk'||state==='idle');
  const directional=rear?back4Atlases?.[sheetIndex]:walk4Atlases?.[sheetIndex];
  const sheet=reaction?.naturalWidth?reaction:(state==='walk'||rear)&&directional?.naturalWidth?directional:extraAtlases?.[sheetIndex];
  if(sheet?.complete&&sheet.naturalWidth>0){
   const col=(kind-12)%6,rows=sheet===reaction||sheet===walk4Atlases?.[sheetIndex]||sheet===back4Atlases?.[sheetIndex]?4:2;
   const row=sheet===reaction?state==='talk'||state==='mic'?0:state==='cheer'||state==='laugh'?1:state==='point'?2:3:state==='walk'?(rows===4?walkCycleFrame(motion?.stepDistance??time/18):Math.floor((motion?.stepDistance??time/60)/VENUE_STRIDE)%2):0;
   const cw=sheet.naturalWidth/6,ch=sheet.naturalHeight/rows;
   paint(sheet,col*cw,row*ch,cw,ch);
   return true;
  }
  kind=2; // temporary visible fallback during image loading, never broken art.
 }
 // The original 12 cast members now have the same four authored steps and
 // actual north-facing sheets as the later expansion sets.
 if(kind>=0&&kind<12&&(state==='walk'||(state==='idle'&&motion?.direction==='north'))){
  const group=Math.floor(kind/6);
  const rear=motion?.direction==='north';
  const sheet=rear?originalBack4Atlases?.[group]:originalWalk4Atlases?.[group];
  if(sheet?.complete&&sheet.naturalWidth){
   const sw=sheet.naturalWidth/6,sh=sheet.naturalHeight/4;
   const row=state==='walk'?walkCycleFrame(motion?.stepDistance??time/18):1;
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
   paint(sheet,(kind%6)*cw,row*ch,cw,ch);
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
 if(meeting)return {x:204,y:44};
 if(action==='mic')return {x:211,y:44};
 const route=[{x:204,y:44},{x:208,y:44},{x:212,y:44},{x:206,y:44}];
 return route[Math.floor(seconds/5)%route.length];
}
