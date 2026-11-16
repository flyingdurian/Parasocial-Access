/* Modular saturated indigo/magenta evening-convention renderer. No painted legacy props.
   Atlas crop boxes are independent sprites in one binary file per prop family. */
import {MODULAR_PROPS,MODULAR_GATES,MODULAR_TV_PROJECTION,MODULAR_ATLAS} from './venue-geometry-v088b.js';

const FILES=Object.freeze({
 hall:'irl-hall-vibrant-v088b.webp',
 stage:'irl-stage-shell-vibrant-v088b.webp',
 gate:'irl-gate-atlas-vibrant-v088b.webp',
 booths:'irl-booth-atlas-vibrant-v088b.webp',
 furniture:'irl-stage-furniture-vibrant-v088b.webp',
 checkin:'irl-checkin-vibrant-v088b.webp'
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
export function modularStageMode(event){
 const active=event?.departures?.find(g=>['exchange','climbStairs','approach'].includes(g.stageVisit))||
  event?.departures?.find(g=>g.stageVisit==='queued');
 return active?.debater?'debate':'signing';
}
function drawFloorRails(ctx){
 // Continuous physical perimeter, but gaps match both authorized gate lanes.
 ctx.save();
 for(const [a,b] of [[0,72],[122,137],[279,384]]){
  ctx.fillStyle='#2b2950';ctx.fillRect(a,184,b-a,2);
  ctx.fillStyle='#dfbb85';ctx.fillRect(a,183,b-a,1);
  ctx.fillStyle='#352954';ctx.fillRect(a,193,b-a,1.3);
  ctx.fillStyle='#b786cc';ctx.fillRect(a,192,b-a,.6);
  for(let x=a+1;x<b;x+=26){
   ctx.fillStyle='#554573';ctx.fillRect(x,178,3,20);
   ctx.fillStyle='#f4c289';ctx.fillRect(x+.4,179,.7,17);
   ctx.fillStyle='#332349';ctx.fillRect(x-1,196,5,2);
  }
 }
 ctx.restore();
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
function livePortrait(ctx,asset){
 if(!asset?.naturalWidth||!asset?.naturalHeight)return;
 const sw=asset.naturalWidth/4,sh=asset.naturalHeight/2;
 // Fixed source aspect ratio: letterbox portrait within the livestream frame.
 ctx.save();
 ctx.beginPath();ctx.rect(8,8,24,39);ctx.clip();
 const aspect=sw/sh,dh=35,dw=dh*aspect;
 ctx.drawImage(asset,0,0,sw,sh,20-dw/2,9,dw,dh);
 ctx.restore();
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
  ctx.fillStyle='#efe1ff';ctx.fillRect(5,7,32,43);
  livePortrait(ctx,streams.host);
  ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.fillText('PHOTO OP',68,23,59);
  ctx.fillStyle='#c4e2d2';ctx.font='bold 8px system-ui';ctx.fillText('SNAPSHOT',68,35,58);
 }else if(feed?.type==='autograph'){
  ctx.fillStyle='#f5f1e8';ctx.fillRect(9,10,82,36);
  ctx.fillStyle='#526175';ctx.font='italic bold 14px cursive';ctx.fillText('SIGNED',50,31,74);
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
 draw(ctx,assets.stage,MODULAR_PROPS.stage);
 for(const name of ['merch','food','vending','photo'])
  draw(ctx,assets.booths,MODULAR_PROPS[name],MODULAR_ATLAS[name]);
 draw(ctx,assets.checkin,MODULAR_PROPS.checkin);
 drawFloorRails(ctx);
 for(const side of ['left','right'])drawGate(ctx,assets.gate,event,side);
 drawModularTV(ctx,event,t,streams);
 const debate=modularStageMode(event)==='debate';
 draw(ctx,assets.furniture,
  MODULAR_PROPS[debate?'debateFurniture':'signingFurniture'],
  MODULAR_ATLAS[debate?'debate':'signing']);
 ctx.restore();
 return true;
}
export {FILES as MODULAR_VENUE_FILES};