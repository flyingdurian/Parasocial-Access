/* Modular saturated indigo/magenta evening-convention renderer. No painted legacy props.
   Atlas crop boxes are independent sprites in one binary file per prop family. */
import {MODULAR_PROPS,MODULAR_GATES,MODULAR_TV_PROJECTION,MODULAR_ATLAS} from './venue-geometry-v088b.js';

const FILES=Object.freeze({
 hall:'irl-hall-vibrant-v088b.webp',
 stage:'irl-stage-shell-v088c.webp',
 gate:'irl-gate-atlas-v088c.webp',
 planters:'irl-entrance-planters-v088c.webp',
 booths:'irl-booth-atlas-vibrant-v088b.webp',
 furniture:'irl-stage-furniture-vibrant-v088b.webp',
 checkin:'irl-checkin-v088c.webp'
});
export function loadModularVenueAssets(){
 const assets={};
 for(const [key,file] of Object.entries(FILES)){
  const image=new Image();
  image.src='/assets/'+file;
  assets[key]=image;
 }
 return assets;
}
export const modularVenueReady=assets=>!!assets&&Object.keys(FILES).every(key=>assets[key]?.complete&&assets[key]?.naturalWidth>0);

const draw=(ctx,image,bounds,source)=>{
 if(!image?.naturalWidth)return;
 if(source)ctx.drawImage(image,source.x,source.y,source.w,source.h,bounds.x,bounds.y,bounds.w,bounds.h);
 else ctx.drawImage(image,bounds.x,bounds.y,bounds.w,bounds.h);
};
// The stage is intentionally fixed; gameplay changes actor poses, not furniture.
export function modularStageMode(){return 'fixed';}
function drawStageQueueRopes(ctx){
 // A walkable central aisle connects the front-of-line to the stairs.
 ctx.save();
 for(const side of [0,1]){
  const x=side?298:236;
  const points=[[x,118],[x+(side?2:-2),137],[x+(side?5:-5),158]];
  ctx.lineWidth=1.1;ctx.strokeStyle='#d2a2da';ctx.beginPath();
  points.forEach(([px,py],i)=>i?ctx.lineTo(px,py-7):ctx.moveTo(px,py-7));ctx.stroke();
  for(const [px,py] of points){
   ctx.fillStyle='rgba(11,8,33,.38)';ctx.fillRect(px-2,py+1,5,2);
   ctx.fillStyle='#523a68';ctx.fillRect(px-1.3,py-9,2.6,11);
   ctx.fillStyle='#f7cc8a';ctx.fillRect(px-1.5,py-10,3,2);
   ctx.fillStyle='#a76ec3';ctx.fillRect(px-1.2,py-6,2.4,1);
  }
 }
 ctx.restore();
}
function drawContactShadow(ctx,bounds,alpha=.25){
 ctx.save();ctx.fillStyle='rgba(15,9,41,'+alpha+')';ctx.beginPath();
 ctx.ellipse(bounds.x+bounds.w/2,bounds.y+bounds.h-.8,bounds.w*.45,2.3,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
function openness(event,side){
 const gate=event?.gateControllers?.[side];
 if(!gate)return 0;
 return Math.max(0,Math.min(1,4*(event.elapsed-gate.openedAt),3*(gate.openUntil-event.elapsed)));
}
function drawGate(ctx,atlas,event,side){
 const frame=MODULAR_GATES[side].art,open=openness(event,side);
 // The state texture changes only when its physical crossing controller opens.
 draw(ctx,atlas,frame,MODULAR_ATLAS.gate[open>.35?'open':'closed']);
 // Small badge display: neutral amber means waiting, green means admitted.
 ctx.save();
 ctx.fillStyle=open>.35?'#80c7a0':'#e5bd7f';
 ctx.fillRect(frame.x+(side==='left'?8:8),frame.y+10,2,1);
 ctx.restore();
}
function livePortrait(ctx,asset,x,y,height=31){
 if(!asset?.naturalWidth||!asset?.naturalHeight)return false;
 const sw=asset.naturalWidth/4,sh=asset.naturalHeight/2;
 // Both portraits use the same physical height, irrespective of atlas resolution.
 const aspect=sw/sh,dw=Math.min(22,height*aspect);
 ctx.drawImage(asset,0,0,sw,sh,x-dw/2,y,dw,height);
 return true;
}
function drawBoothActivity(ctx,event,t){
 const points={merch:[55,90],snacks:[147,94],vending:[24,128],photo:[348,130]};
 for(const person of event?.crowd||[]){
  const point=points[person.station];
  if(!point||!(person.dwell>0)||!person.boothActivity)continue;
  const sparkle=Math.floor((t/210+person.id)%3),x=point[0],y=point[1];
  ctx.fillStyle=sparkle===0?'#ffe8a1':'#b9f8ec';
  ctx.fillRect(x-1,y-3,2,7);ctx.fillRect(x-4,y,8,1);
  if(person.station==='photo'&&sparkle===0){ctx.fillStyle='rgba(255,248,218,.45)';ctx.fillRect(x-7,y-8,14,13);}
 }
}
export function drawModularTV(ctx,event,t,streams={}){
 const projection=MODULAR_TV_PROJECTION;
 const feed=event?.tvEvent?.ttl>0?event.tvEvent:null;
 ctx.save();
 ctx.transform(projection.a,projection.b,projection.c,projection.d,projection.e,projection.f);
 ctx.beginPath();ctx.rect(0,0,100,56);ctx.clip();
 // Broadcast slate, not holographic neon. Image is mapped to the panel's
 // measured parallelogram, so footage does not distort on the room canvas.
 const grad=ctx.createLinearGradient(0,0,100,56);
 grad.addColorStop(0,'#19143c');grad.addColorStop(1,'#363373');
 ctx.fillStyle=grad;ctx.fillRect(0,0,100,56);
 ctx.fillStyle='#c7b9ff';ctx.fillRect(4,4,92,1);
 ctx.fillStyle='#d5a5f0';ctx.fillRect(4,5,24,1);
 ctx.textBaseline='alphabetic';ctx.textAlign='center';
 if(feed?.type==='photo'){
  ctx.fillStyle='#efe1ff';ctx.fillRect(5,7,57,43);
  ctx.save();ctx.beginPath();ctx.rect(6,8,55,38);ctx.clip();
  livePortrait(ctx,streams.host,23,12,31);
  const guest=streams.poses?.[feed.guestKind]||streams.cast;
  livePortrait(ctx,guest,45,12,31);
  ctx.restore();
  ctx.fillStyle='#fff';ctx.font='bold 9px system-ui';ctx.fillText('PHOTO OP',79,21,32);
  ctx.fillStyle='#d1f6e1';ctx.font='bold 6px system-ui';ctx.fillText('DUO SNAP',79,31,35);
  ctx.save();ctx.translate(33,44);ctx.rotate(-.08);
  ctx.font='italic bold 7px cursive';ctx.fillStyle='#2c2461';ctx.fillText('Destiny ✦',0,0,48);ctx.restore();
 }else if(feed?.type==='autograph'){
  ctx.fillStyle='#f5f1e8';ctx.fillRect(9,10,82,36);
  ctx.fillStyle='#526175';ctx.font='italic bold 13px cursive';ctx.fillText('Destiny ✦',50,31,74);
  ctx.fillStyle='#4d836f';ctx.font='bold 8px system-ui';ctx.fillText('FAN MOMENT',50,41,74);
 }else if(feed?.type==='debate'){
  ctx.fillStyle='#f3f5f6';ctx.font='bold 10px system-ui';ctx.fillText('DEBATE RESULT',50,18,92);
  ctx.fillStyle=feed.won?'#a7e0bc':'#ffc0ae';ctx.font='900 23px system-ui';
  ctx.fillText(feed.won?'WIN':'LOSS',50,40,94);
  ctx.fillStyle='#ecf1f2';ctx.font='7px system-ui';ctx.fillText(String(feed.topicTitle||'LIVE DISCUSSION').slice(0,23),50,50,89);
 }else{
  ctx.fillStyle='#e8eff0';ctx.font='bold 13px system-ui';ctx.fillText('DGG LIVE',50,24,94);
  ctx.fillStyle='#dfc4ff';ctx.font='bold 8px system-ui';ctx.fillText('MEET & GREET',50,37,89);
  ctx.fillStyle='#e8eff0';ctx.font='6px system-ui';ctx.fillText('CONVENTION CAM',50,46,89);
 }
 ctx.restore();
}
export function drawModularVenue(ctx,assets,event,t,streams={}){
 if(!modularVenueReady(assets))return false;
 ctx.save();
 draw(ctx,assets.hall,{x:0,y:0,w:384,h:216});
 drawContactShadow(ctx,MODULAR_PROPS.stage,.38);
 draw(ctx,assets.stage,MODULAR_PROPS.stage);
 // Back-wall fixtures share a common floor plane and render back-to-front.
 for(const name of ['vending','merch','food','photo']){
  drawContactShadow(ctx,MODULAR_PROPS[name],.22);
  draw(ctx,assets.booths,MODULAR_PROPS[name],MODULAR_ATLAS[name]);
 }
 drawStageQueueRopes(ctx);
 drawContactShadow(ctx,MODULAR_PROPS.checkin,.34);
 draw(ctx,assets.checkin,MODULAR_PROPS.checkin);
 for(const side of ['left','right'])drawGate(ctx,assets.gate,event,side);
 draw(ctx,assets.planters,{x:0,y:146,w:60,h:70},MODULAR_ATLAS.planter.left);
 draw(ctx,assets.planters,{x:324,y:146,w:60,h:70},MODULAR_ATLAS.planter.right);
 drawBoothActivity(ctx,event,t);
 drawModularTV(ctx,event,t,streams);
 // Two permanent microphone stations; no mode-dependent furniture swaps.
 draw(ctx,assets.furniture,MODULAR_PROPS.fixedFurniture,MODULAR_ATLAS.debate);
 ctx.restore();
 return true;
}
export {FILES as MODULAR_VENUE_FILES};
