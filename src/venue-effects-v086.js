import {MODULAR_TV_BOUNDS} from './venue-geometry-v088b.js';
import {drawInlineDggL} from './dgg-emotes-v085.js';
/* Diegetic 384x216 effects over the new empty-gate, blank-LED base art. */
import {venueStageQueueSpot} from './venue-nav.js';
import {stageDialogueBeat} from './irl-debates-v088.js';
import {wrapMeasuredText,drawBubblePointer} from './irl-atmosphere-v083.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const VENUE_LED_SCREEN=MODULAR_TV_BOUNDS;

export function drawVenueGates(ctx,hall,event){
 // Backward-compatible repair for previously deployed hall art. Sampling uses
 // source-image dimensions, not 384px canvas coordinates (the old bug drew
 // unrelated pixels from the top-left of the original high-resolution image).
 if(hall?.complete&&hall.naturalWidth&&!/open-v0(?:87|88)/.test(String(hall.src))){
  const sx=hall.naturalWidth/384,sy=hall.naturalHeight/216;
  for(const [x,sourceY,width] of [[91,158,23],[244,158,23]]){
   ctx.drawImage(hall,x*sx,sourceY*sy,width*sx,15*sy,x,184,width,15);
  }
 }
 for(const side of ['left','right']){
  const gate=event.gateControllers?.[side];if(!gate)continue;
  const open=clamp(Math.min((event.elapsed-gate.openedAt)*4,(gate.openUntil-event.elapsed)*3),0,1);
  const x=side==='left'?88:241,y=185,width=side==='left'?28:27;
  ctx.save();
  const span=(width-4)*.5*(1-open),pivotY=y+3;
  ctx.strokeStyle='#2b3048';ctx.lineWidth=2.9;ctx.beginPath();
  ctx.moveTo(x+2,pivotY+1);ctx.lineTo(x+2+span,pivotY+1);
  ctx.moveTo(x+width-2,pivotY+1);ctx.lineTo(x+width-2-span,pivotY+1);
  ctx.stroke();
  ctx.strokeStyle='#d3e1e6';ctx.lineWidth=1.4;ctx.beginPath();
  ctx.moveTo(x+2,pivotY);ctx.lineTo(x+2+span,pivotY);
  ctx.moveTo(x+width-2,pivotY);ctx.lineTo(x+width-2-span,pivotY);
  ctx.stroke();
  ctx.fillStyle=open>.1?'#8bffdb':'#ffb778';
  ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=3;ctx.fillRect(x+1,y-3,2.5,3);ctx.fillRect(x+width-3.5,y-3,2.5,3);
  // Scanner lights and a raised, sliding arm are separate from the hall image.
  ctx.shadowBlur=0;ctx.fillStyle=open>.5?'#b4ffe5':'#ffccaa';
  ctx.fillRect(x-1,y-1,2,4);ctx.fillRect(x+width-1,y-1,2,4);
  if(open>.7){ctx.globalAlpha=.65;ctx.font='bold 4.6px monospace';ctx.fillText('✓ PASS',x+width/2-9,y-5);}
  ctx.restore();
 }
}

const roundRect=(ctx,x,y,w,h,r)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
export function drawVenueScreens(ctx,event,t,images={}){
 const seconds=t/1000,display=event.tvEvent&&event.tvEvent.ttl>0?event.tvEvent:null;
 // The *illustrated* LED is x≈241..325, y≈16..46. Do not add a second TV
 // at (267,27): that was covering microphone furniture and the stage lights.
 const {x,y,w,h}=VENUE_LED_SCREEN;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
 const background=ctx.createLinearGradient(x,y,x+w,y+h);
 background.addColorStop(0,display?.type==='debate'?'#542567':'#111c4e');background.addColorStop(1,display?.type==='debate'?'#1f1043':'#253579');
 ctx.fillStyle=background;ctx.fillRect(x,y,w,h);
 ctx.globalAlpha=.26;for(let row=y+1;row<y+h;row+=2){ctx.fillStyle='#8e84f4';ctx.fillRect(x,row,w,.3);}ctx.globalAlpha=1;
 const screenGuest=(kind,tx,ty)=>{
  const sheet=kind>=12?images.extra?.[Math.floor((kind-12)/6)]:images.cast;
  if(!sheet?.naturalWidth)return;
  const columns=kind>=12?6:4,rows=kind>=12?2:3,index=kind>=12?(kind-12)%6:kind;
  ctx.drawImage(sheet,(index%columns)*sheet.naturalWidth/columns,Math.floor(index/columns)*sheet.naturalHeight/rows,
   sheet.naturalWidth/columns,sheet.naturalHeight/rows,tx,ty,12,18);
 };
 ctx.textAlign='center';
 if(display?.type==='photo'){
  ctx.fillStyle='#fff8e0';ctx.fillRect(249,18,31,25);ctx.fillStyle='#b886d2';ctx.fillRect(251,20,27,19);
  if(images.host?.naturalWidth){
   const sw=images.host.naturalWidth/4,sh=images.host.naturalHeight/2;
   ctx.drawImage(images.host,0,0,sw,sh,251,20,12,18);
  }else{ctx.fillStyle='#ffd39c';ctx.fillRect(253,24,9,14);}
  screenGuest(display.guestKind??2,264,20);
  ctx.fillStyle='#fbe8ff';ctx.font='bold 7px monospace';ctx.fillText('FAN PHOTO',303,29);
  ctx.fillStyle='#ffdf8f';ctx.font='bold 5px monospace';ctx.fillText('♥ SNAPSHOT!',303,38);
 }else if(display?.type==='autograph'){
  ctx.fillStyle='#fff5dc';ctx.fillRect(255,19,56,24);
  ctx.strokeStyle='#a68a65';ctx.lineWidth=.8;ctx.strokeRect(256,20,54,22);
  ctx.fillStyle='#66487d';ctx.font='italic bold 10px cursive';ctx.fillText('Steven B.',283,35);
  ctx.strokeStyle='#b25d93';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(267,38);ctx.bezierCurveTo(277,41,293,35,306,38);ctx.stroke();
  ctx.fillStyle='#fff1a5';ctx.font='bold 4.7px monospace';ctx.fillText('SIGNED ✦',317,44);
 }else if(display?.type==='debate'){
  const win=display.won;
  ctx.fillStyle=win?'#9affd1':'#ffafc7';ctx.font='900 9px monospace';ctx.fillText('DEBATE',283,27);
  ctx.shadowColor=win?'#71ffee':'#ff638d';ctx.shadowBlur=7;
  ctx.fillStyle=win?'#e9ff83':'#ffb6df';ctx.font='900 15px monospace';ctx.fillText(win?'WON!':'LOST!',283,41);ctx.shadowBlur=0;
  ctx.fillStyle='#fff3c4';ctx.font='bold 4px monospace';ctx.fillText('✦ '+(display.topicTitle||'BLOODSPORTS')+' ✦',283,45,80);
  for(let i=0;i<5;i++){const sx=x+4+i*19,sy=18+Math.sin(seconds*8+i)*3;ctx.fillStyle=win?'#a9ffb7':'#ffa4c2';ctx.fillRect(sx,sy,2,2);}
 }else{
  ctx.fillStyle='#f6e2ff';ctx.font='900 11px monospace';ctx.fillText('DGG LIVE',283,31);
  ctx.fillStyle='#8effe5';ctx.font='bold 5.6px monospace';ctx.fillText(Math.floor(seconds*2)%2?'✦ YEE vs PEPE ✦':'● CONVENTION CAM',283,40);
 }
 ctx.fillStyle='#ffffff19';ctx.fillRect(x,y,w,1);
 ctx.restore();
 // Keep the secondary feeds' centered labels local to this drawing pass.
 ctx.save();
 // The two smaller feeds carry distinct rolling camera/merch content.
 for(const screen of [{x:343,y:134,w:24,h:11,label:'PHOTO'},{x:74,y:68,w:18,h:10,label:'MERCH'}]){
  ctx.fillStyle='#10142a';ctx.fillRect(screen.x-1,screen.y-1,screen.w+2,screen.h+2);
  ctx.fillStyle=Math.floor(seconds*1.7)%2?'#263c72':'#6a2c76';ctx.fillRect(screen.x,screen.y,screen.w,screen.h);
  ctx.fillStyle='#bffff1';ctx.font='bold 4.4px monospace';ctx.textAlign='center';ctx.fillText(screen.label,screen.x+screen.w/2,screen.y+5);
  ctx.fillStyle='#ffc9ee';ctx.fillRect(screen.x+4,screen.y+7,Math.floor((screen.w-8)*(seconds%2)/2),1);
 }
 ctx.restore();
}

export function drawStageQueueGuides(ctx,event){
 // v0.8.8h draws the ACTUAL velvet ropes in the unified venue plate, so the
 // old unexplained foot-circles were redundant UI clutter. No overlay.
}

export function drawStageConversation(ctx,event,layout=null,mascot=null){
 const guest=event.departures?.find(g=>g.stageVisit==='exchange');
 const dialogue=stageDialogueBeat(guest);if(!dialogue)return null;
 const person=dialogue.speaker==='destiny'?{x:event.hostX,y:event.hostY}:guest;
 // A stage speaker owns the bubble ABOVE THEIR OWN HEAD. The earlier hard
 // clamp to x=140..210 teleported the challenger dialogue across the set.
 const anchorX=person.x+16,anchorY=person.y+(dialogue.speaker==='destiny'?1:5),w=84;
 ctx.save();ctx.textAlign='left';ctx.textBaseline='alphabetic';
 ctx.font='bold 4.6px sans-serif';
 const lines=wrapMeasuredText(ctx,dialogue.text,w-10,4);
 const h=11+Math.max(1,lines.length)*6;
 const placed={x:clamp(anchorX-w/2,2,382-w),y:clamp(anchorY-h-8,2,213-h),w,h};
 // Use the narrow strip ABOVE the screen bezel when a raised-stage actor
 // stands directly in front of the televised backdrop.
 if(placed.x<MODULAR_TV_BOUNDS.x+MODULAR_TV_BOUNDS.w&&placed.x+placed.w>MODULAR_TV_BOUNDS.x&&placed.y<MODULAR_TV_BOUNDS.y+MODULAR_TV_BOUNDS.h&&placed.y+placed.h>MODULAR_TV_BOUNDS.y){
  placed.y=Math.max(2,MODULAR_TV_BOUNDS.y-placed.h-3);
 }
 // Reserve only for later speech, never let TV/ambient overlays displace a speaker.
 layout?.reserve(placed);
 if(!placed){ctx.restore();return null;}
 const {x,y}=placed,background=dialogue.speaker==='destiny'?'#d8f8ff':'#fff4da';
 ctx.globalAlpha=.96;ctx.fillStyle='#141a34';ctx.fillRect(x+2,y+2,w,h);
 ctx.fillStyle=background;ctx.fillRect(x,y,w,h);
 ctx.strokeStyle=dialogue.speaker==='destiny'?'#62cfe1':'#ec9eb6';ctx.lineWidth=1.5;ctx.strokeRect(x+.6,y+.6,w-1.2,h-1.2);
 ctx.fillStyle='#4d396a';ctx.font='bold 4.5px monospace';
 ctx.fillText(dialogue.speaker==='destiny'?'DESTINY':String(guest.name||'GUEST').slice(0,16),x+4,y+6,w-8);
 ctx.fillStyle='#252940';ctx.font='bold 4.6px sans-serif';
 ctx.save();ctx.beginPath();ctx.rect(x+3,y+9,w-6,h-10);ctx.clip();
 lines.forEach((line,i)=>drawInlineDggL(ctx,line,x+4,y+12+i*6,mascot,7));
 ctx.restore();
 drawBubblePointer(ctx,{x,y,w,h},anchorX,anchorY,background);
 ctx.restore();
 return placed;
}

// Reserve the actual speaker's area before canvas crowd/chat bubbles place
// themselves; drawing the stage conversation later keeps it above sprites.
export function reserveStageSpeech(layout,event){
 const guest=event?.departures?.find(g=>g.stageVisit==='exchange');
 if(!guest||!layout)return null;
 const turn=stageDialogueBeat(guest);
 const speaker=turn?.speaker==='destiny'?{x:event.hostX,y:event.hostY}:guest;
 if(!speaker)return null;
 const ax=speaker.x+16,ay=speaker.y+(turn.speaker==='destiny'?1:5);
 const rect={x:clamp(ax-42,2,298),y:clamp(ay-40,2,174),w:84,h:35};
 if(rect.x<MODULAR_TV_BOUNDS.x+MODULAR_TV_BOUNDS.w&&rect.x+rect.w>MODULAR_TV_BOUNDS.x&&rect.y<MODULAR_TV_BOUNDS.y+MODULAR_TV_BOUNDS.h&&rect.y+rect.h>MODULAR_TV_BOUNDS.y)rect.y=2;
 return layout.reserve(rect);
}

// Diegetic, unmistakably different 5-second fan encounters: an actual print
// and pen for signing, a posed duo facing the physical tripod for photos.
export function drawStageFanInteraction(ctx,event,t){
 const guest=event?.departures?.find(g=>g.stageVisit==='exchange'&&!g.debater);
 if(!guest)return false;
 const progress=Math.max(0,Math.min(1,1-guest.exchangeClock/Math.max(.1,guest.exchangeDuration)));
 const cx=(event.hostX+guest.x+30)/2,cy=Math.max(event.hostY,guest.y)+21;
 ctx.save();
 if(guest.fanKind==='autograph'){
  const x=cx-7,y=cy;
  ctx.save();ctx.translate(x,y);ctx.rotate(-.09);
  ctx.fillStyle='#fff2de';ctx.fillRect(0,0,14,10);
  ctx.strokeStyle='#80587b';ctx.lineWidth=.65;ctx.strokeRect(.4,.4,13.2,9.2);
  ctx.strokeStyle='#6c3a9c';ctx.beginPath();ctx.moveTo(3,5);
  ctx.quadraticCurveTo(4+progress*4,2,9,4+Math.sin(progress*9)*1.2);ctx.stroke();
  ctx.restore();
  if(progress<.8){ctx.save();ctx.translate(x+11-progress*7,y-5+progress*4);ctx.rotate(.3);ctx.fillStyle='#f6dc7e';ctx.fillRect(0,0,1.3,10);ctx.fillStyle='#253053';ctx.fillRect(0,7,1.3,3);ctx.restore();}
  if(progress>.78){ctx.fillStyle='#f9d7a5';ctx.font='bold 5px sans-serif';ctx.fillText('SIGNED ✦',cx-13,cy-8);}
 }else{
  ctx.textAlign='center';ctx.fillStyle='#fdf1b8';ctx.font='bold 6px sans-serif';
  if(progress>.26&&progress<.91)ctx.fillText('♥ SAY CHEESE ♥',cx,Math.min(event.hostY,guest.y)-5);
  // The venue plate already depicts the tripod at stage right; only animate
  // its record light, never spawn a second hovering camera asset.
  ctx.fillStyle=progress>.71&&progress<.81?'#fff6d3':'#ef6d96';
  ctx.fillRect(VENUE_LED_SCREEN.x+81,56,2,2);
 }
 ctx.restore();return true;
}

export function drawDebateCombatEffects(ctx,event,t){
 const challenger=event?.departures?.find(g=>g.debater&&g.stageVisit==='exchange');
 if(challenger){
  const pulse=challenger.clashPulse||0;
  if(pulse>0){
   const strength=challenger.clashPower||0,alpha=Math.min(1,pulse/.22);
   // Vocal impacts travel as a comic effect, not as character lunges.
   const centerX=(Math.floor((challenger.exchangeDuration-challenger.exchangeClock)/.69)%2?challenger.x+14:event.hostX+15),centerY=49;
   ctx.save();ctx.globalAlpha=alpha;
   ctx.strokeStyle=strength===2?'#ffe18e':strength===0?'#c0d4fa':'#fd9bb4';
   ctx.lineWidth=strength===2?2.2:1.2;
   for(let i=0;i<9;i++){
    const theta=i*Math.PI*2/9+t*.0004,length=6+(strength*3);
    ctx.beginPath();ctx.moveTo(centerX+Math.cos(theta)*4,centerY+Math.sin(theta)*4);
    ctx.lineTo(centerX+Math.cos(theta)*length,centerY+Math.sin(theta)*length);ctx.stroke();
   }
   ctx.fillStyle=strength===2?'#ffefb3':strength===0?'#c4d4ff':'#ffb6d9';
   ctx.font='900 '+(strength===2?9:6)+'px monospace';ctx.textAlign='center';
   ctx.fillText(strength===2?'BAM!':strength===0?'...':'POW!',centerX,centerY-13);
   ctx.restore();
  }
 }
}

// Fictional, non-graphic slapstick intervention. Only triggered for a
// correctly classified danger event; wrong calls never strike a bystander.
export function drawSecurityComic(ctx,event,t){
 for(const guard of event?.guardPositions||[]){
  const task=guard.task;if(task?.phase!=='engage'||task.action!=='security')continue;
  const guest=event.visitors.find(p=>p.id===task.guestId);
  if(!guest||guest.type!=='security')continue;
  const beat=Math.floor(task.remaining/.3),rise=Math.sin(t*.019+guest.serial)*2.6;
  const x=guest.x+15,y=guest.y-7+rise;
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*.007)*.13);
  ctx.fillStyle=beat%2?'#f5d4fc':'#ffebb1';ctx.strokeStyle='#552a68';ctx.lineWidth=.85;
  ctx.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2,r=i%2?11:15;const px=Math.cos(a)*r,py=Math.sin(a)*r*.65;if(!i)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.closePath();ctx.fill();ctx.stroke();
  ctx.textAlign='center';ctx.fillStyle='#48204b';ctx.font='900 8px system-ui';ctx.fillText(beat%2?'BONK!':'POW!',0,3);ctx.restore();
 }
}

// Shared bounded transaction/decision feedback; never overflow the hall LCD
// or create a giant free-floating debug label at the edge of the scene.
export function drawVenueFeedback(ctx,effects=[],mascot=null){
 for(const effect of effects){
  if(effect.kind==='booth')continue;
  const label=String(effect.text||'');if(!label)continue;
  ctx.save();
  ctx.font='900 5.6px ui-monospace,monospace';
  const width=Math.min(97,Math.max(22,Math.ceil(ctx.measureText(label).width)+9));
  const x=clamp(effect.x-width/2,3,381-width);
  const y=clamp(effect.y,12,205);
  ctx.globalAlpha=clamp((effect.ttl||1)*.75,.3,.91);
  ctx.fillStyle='rgba(19,21,46,.91)';ctx.fillRect(x,y-9,width,12);
  ctx.fillStyle=effect.color||'#d2edfb';ctx.fillRect(x,y-9,width,1);
  ctx.fillStyle='#fff8e5';
  drawInlineDggL(ctx,label,x+4,y,mascot,7);
  ctx.restore();
 }
}

export function drawVenueRush(ctx,event,t){
 const rush=event.mode==='playing'&&(event.phase===2||(event.session==='endless'&&event.wave%3===0));
 if(!rush)return;
 ctx.save();
 const fixtures=[[57,68],[82,53],[145,58],[170,54],[196,172],[224,172],[242,18],[267,18],[296,18],[321,18],[350,111],[356,157],[25,146]];
 for(let i=0;i<fixtures.length;i++){
  const [x,y]=fixtures[i],cycle=t/530+i*.87,color=i%3===0?'255,123,210':i%3===1?'94,230,255':'255,210,124';
  const pulse=.17+.12*(1+Math.sin(cycle))/2,swirl=Math.sin(t/900+i*1.7)*17;
  const reach=i<4?36:i<7?28:62;
  const beam=ctx.createLinearGradient(x,y,x+swirl,y+reach);
  beam.addColorStop(0,`rgba(${color},${pulse})`);beam.addColorStop(1,`rgba(${color},0)`);
  ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+swirl-reach*.35,y+reach);ctx.lineTo(x+swirl+reach*.35,y+reach);ctx.closePath();ctx.fill();
  ctx.fillStyle=`rgba(${color},${.37+Math.sin(cycle)*.1})`;ctx.beginPath();ctx.arc(x,y,1.4,0,Math.PI*2);ctx.fill();
 }
 // Wisps of stage fog, kept light enough to preserve NPC readability.
 for(let i=0;i<5;i++){
  const x=230+i*24+Math.sin(t/2400+i*1.8)*12,y=70+(i%2)*12;
  const haze=ctx.createRadialGradient(x,y,2,x,y,27);
  haze.addColorStop(0,'rgba(240,188,255,.085)');haze.addColorStop(1,'rgba(190,155,220,0)');
  ctx.fillStyle=haze;ctx.fillRect(x-27,y-27,54,54);
 }
 ctx.restore();
}

export function drawCameraFlashes(ctx,event){
 for(const flash of event.cameraFlashes||[]){
  const alpha=clamp(flash.ttl/.28,0,1),radius=12+(1-alpha)*14;
  ctx.save();ctx.globalCompositeOperation='screen';
  const g=ctx.createRadialGradient(flash.x,flash.y,1,flash.x,flash.y,radius);
  g.addColorStop(0,`rgba(255,255,255,${alpha*.98})`);
  g.addColorStop(.22,`rgba(255,248,220,${alpha*.75})`);
  g.addColorStop(1,'rgba(255,245,210,0)');
  ctx.fillStyle=g;ctx.fillRect(flash.x-radius,flash.y-radius,radius*2,radius*2);
  ctx.globalAlpha=alpha*.8;ctx.fillStyle='#fff';ctx.fillRect(flash.x-7,flash.y-.5,14,1);ctx.fillRect(flash.x-.5,flash.y-7,1,14);
  ctx.restore();
 }
}
