/* Diegetic 384x216 effects over the new empty-gate, blank-LED base art. */
import {venueStageQueueSpot} from './venue-nav.js';
import {stageDialogueBeat} from './irl-debates-v088.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const VENUE_LED_SCREEN=Object.freeze({x:241,y:16,w:84,h:30});

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
 const waiting=(event.departures||[]).filter(g=>g.stageVisit==='queued');
 if(!waiting.length)return;
 ctx.save();ctx.textAlign='center';ctx.font='bold 5.5px monospace';
 ctx.fillStyle='#fff0b3';ctx.strokeStyle='#1a142bc7';ctx.lineWidth=2;
 ctx.strokeText('MEET LINE',266,91);ctx.fillText('MEET LINE',266,91);
 for(let i=0;i<Math.min(waiting.length,7);i++){
  const [x,y]=venueStageQueueSpot(i),feetX=x+17,feetY=y+41;
  ctx.strokeStyle=i===0?'#ffe1a5':'#a6deec88';ctx.lineWidth=i===0?1.6:1;
  ctx.beginPath();ctx.ellipse(feetX,feetY,13,4.5,0,0,Math.PI*2);ctx.stroke();
 }
 ctx.restore();
}

export function drawStageConversation(ctx,event){
 const guest=event.departures?.find(g=>g.stageVisit==='exchange');
 const dialogue=stageDialogueBeat(guest);if(!dialogue)return;
 const person=dialogue.speaker==='destiny'?{x:event.hostX,y:event.hostY}:guest;
 const anchorX=person.x+16,anchorY=person.y+1,w=86,h=26;
 const x=clamp(anchorX-w/2,3,384-w-3),y=clamp(anchorY-h-6,2,216-h-3);
 ctx.save();ctx.globalAlpha=.96;
 ctx.fillStyle='#141a34';ctx.fillRect(x+2,y+2,w,h);
 ctx.fillStyle=dialogue.speaker==='destiny'?'#d8f8ff':'#fff4da';ctx.fillRect(x,y,w,h);
 ctx.strokeStyle=dialogue.speaker==='destiny'?'#62cfe1':'#ec9eb6';ctx.lineWidth=1.5;ctx.strokeRect(x+.6,y+.6,w-1.2,h-1.2);
 ctx.fillStyle='#4d396a';ctx.font='bold 4.5px monospace';ctx.fillText(dialogue.speaker==='destiny'?'DESTINY':guest.name.slice(0,16),x+4,y+6);
 ctx.fillStyle='#252940';ctx.font='bold 5.3px sans-serif';
 const words=dialogue.text.split(' ');let row='',rows=[];
 for(const word of words){if((row+' '+word).length>27){rows.push(row);row=word;}else row+=(row?' ':'')+word;}
 if(row)rows.push(row);
 for(let i=0;i<Math.min(rows.length,2);i++)ctx.fillText(rows[i],x+4,y+13+i*7,w-8);
 ctx.fillStyle=dialogue.speaker==='destiny'?'#d8f8ff':'#fff4da';ctx.beginPath();ctx.moveTo(clamp(anchorX-4,x+4,x+w-14),y+h-1);ctx.lineTo(anchorX,Math.min(anchorY,y+h+7));ctx.lineTo(clamp(anchorX+4,x+14,x+w-4),y+h-1);ctx.fill();
 ctx.restore();
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
