/* v0.8.8h unified plate, interactive TV, tickets, gate glass and dust motes. */
import {MODULAR_PROPS,MODULAR_GATES,MODULAR_TV_PROJECTION,MODULAR_BLOCKERS} from './venue-geometry-v088b.js';

const FILES=Object.freeze({plate:'irl-venue-baked-v088h.webp',clerk:'irl-ticket-clerk-v088h.webp'});
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
export const MODULAR_CAMERA_SCALE=1;
export const venueCameraPoint=(x,y)=>({x:192+(x-192)*MODULAR_CAMERA_SCALE,y:108+(y-108)*MODULAR_CAMERA_SCALE});
export const venueCameraUnproject=(x,y)=>({x:192+(x-192)/MODULAR_CAMERA_SCALE,y:108+(y-108)/MODULAR_CAMERA_SCALE});
export function applyModularVenueCamera(ctx){ctx.translate(192,108);ctx.scale(MODULAR_CAMERA_SCALE,MODULAR_CAMERA_SCALE);ctx.translate(-192,-108);}
export function modularStageMode(){return 'fixed';}
function drawContactShadow(ctx,bounds,alpha=.25){
 ctx.save();ctx.fillStyle='rgba(15,9,41,'+alpha+')';ctx.beginPath();
 ctx.ellipse(bounds.x+bounds.w/2,bounds.y+bounds.h-.8,bounds.w*.45,2.3,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
function openness(event,side){
 const gate=event?.gateControllers?.[side];
 if(!gate)return 0;
 return Math.max(0,Math.min(1,4*(event.elapsed-gate.openedAt),3*(gate.openUntil-event.elapsed)));
}
function drawGate(ctx,event,side){
  const open=openness(event,side),lane=MODULAR_GATES[side].lane;
  // Static scanner pillars are baked; only two thin glass leaves retract
  // horizontally INTO their own pillar, never translating the gate structure.
  const width=(lane.right-lane.left)/2,glass=width*(1-open);
  ctx.save();
  if(glass>.15){
    ctx.fillStyle='rgba(177,235,246,.27)';
    ctx.fillRect(lane.left,lane.top+8,glass,13);
    ctx.fillRect(lane.right-glass,lane.top+8,glass,13);
    ctx.fillStyle='rgba(231,251,253,.62)';
    ctx.fillRect(lane.left+glass-.6,lane.top+8,.6,13);
    ctx.fillRect(lane.right-glass,lane.top+8,.6,13);
  }
  ctx.fillStyle=open>.55?'#70f3c0':'#f1d38e';
  ctx.fillRect(lane.left-4,lane.top+2,1.4,2);
  ctx.fillRect(lane.right+2,lane.top+2,1.4,2);
  ctx.restore();
}
// A single, non-roaming staff member behind the desk, deliberately rendered
// under the baked foreground counter mask applied after all walking actors.
export function drawTicketClerk(ctx,assets,event){
 if(!assets?.clerk?.naturalWidth||!event?.ticketClerk)return;
 const worker=event.ticketClerk;
 ctx.save();ctx.drawImage(assets.clerk,worker.x,worker.y,29,36);
 const scanned=(event.elapsed-worker.lastScanAt)<.55;
 if(scanned){
  ctx.globalAlpha=Math.max(0,1-(event.elapsed-worker.lastScanAt)/.55)*.66;
  ctx.fillStyle='#b8fff2';ctx.fillRect(worker.x+19,worker.y+19,3,2);
 }
 ctx.restore();
}
// Independent tiny atmosphere layer: only near light sources, independent of
// character simulation and fully cosmetic. No particles on the UI overlays.
export function drawVenueDustMotes(ctx,t){
 const lights=[[75,15,10,7],[325,15,11,8],[71,63,15,9],[345,66,13,10],[234,70,8,5],[267,70,8,5],[294,70,8,5]];
 ctx.save();
 for(let l=0;l<lights.length;l++){
  const [cx,cy,rx,ry]=lights[l];
  for(let i=0;i<5;i++){
   const seed=l*31+i*71;const drift=t*(.37+(seed%7)*.09);
   const x=cx+Math.sin(seed*1.57+drift)*rx,y=cy+Math.cos(seed*.71+drift*.6)*ry-(drift*1.4)%3;
   const glow=.08+.12*(.5+.5*Math.sin(t*.9+seed));
   ctx.globalAlpha=glow;ctx.fillStyle=l>=4?'#f5caac':'#fee6c3';
   ctx.fillRect(Math.round(x),Math.round(y),i%4===0?1.2:.7,i%3===0?1.1:.6);
  }
 }
 ctx.restore();
}
export function drawStageDebateUplight(ctx,event,t){
 const debate=event?.departures?.some(g=>g.debater&&g.stageVisit==='exchange');
 if(!debate)return;
 ctx.save();
 for(const [x,y] of [[235,74],[268,74],[296,74]]){
  const grad=ctx.createRadialGradient(x,y,1,x,y-7,19);
  grad.addColorStop(0,'rgba(246,166,255,.22)');grad.addColorStop(1,'rgba(128,88,215,0)');
  ctx.globalAlpha=.70+.25*Math.sin(t*3+x);ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(x,y-8,10,20,0,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
}
function livePortrait(ctx,asset,x,y,height=31,col=0,row=0,cols=4,rows=2){
 if(!asset?.naturalWidth||!asset?.naturalHeight)return false;
 const sw=asset.naturalWidth/cols,sh=asset.naturalHeight/rows;
 const aspect=sw/sh,dw=Math.min(22,height*aspect);
 ctx.drawImage(asset,col*sw,row*sh,sw,sh,x-dw/2,y,dw,height);
 return true;
}
function liveFanPortrait(ctx,streams,kind,x,y){
 // A cast-atlas fallback must crop the REAL guest cell; the top-left cell is Destiny.
 if(kind>=12&&kind<=29){
  const group=Math.floor((kind-12)/6),sheet=streams.extra?.[group];
  if(sheet?.naturalWidth)return livePortrait(ctx,sheet,x,y,31,(kind-12)%6,0,6,2);
 }
 if(kind>=1&&kind<12){
  const pose=streams.poses?.[kind];
  if(pose?.naturalWidth&&pose!==streams.host)return livePortrait(ctx,pose,x,y);
 }
 const safeKind=Number.isInteger(kind)&&kind>=1&&kind<12?kind:2;
 return livePortrait(ctx,streams.cast,x,y,31,safeKind%4,Math.floor(safeKind/4),4,3);
}
function drawBoothActivity(ctx,event){
 // Tiny contextual receipts that read as rewards; no unlabeled circles or notes.
 const anchors={merch:[57,103],snacks:[133,100],vending:[178,95],photo:[350,105]};
 const labels={merch:'+1 MERCH',snacks:'+1 SNACK',vending:'+1 DRINK',photo:'+1 PHOTO'};
 for(const fx of event?.effects||[]){
  if(fx.kind!=='booth')continue;
  const point=anchors[fx.station];if(!point)continue;
  const age=1-Math.max(0,Math.min(1,fx.ttl/(fx.maxTtl||1.15)));
  const y=point[1]-6-age*4,alpha=Math.min(.63,fx.ttl*1.35);
  const label=labels[fx.station];
  ctx.save();ctx.globalAlpha=alpha;
  ctx.font='bold 4.5px ui-monospace,monospace';ctx.textAlign='center';
  const width=Math.ceil(ctx.measureText(label).width+7);
  ctx.fillStyle='rgba(24,20,46,.78)';ctx.fillRect(point[0]-width/2,y-7,width,10);
  ctx.fillStyle='#dfb66f';ctx.fillRect(point[0]-width/2,y-7,width,1);
  ctx.fillStyle='#fff1cc';ctx.fillText(label,point[0],y);
  ctx.restore();
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
  // Translucent broadcast-glass wash instead of an opaque white photo card.
  ctx.save();ctx.beginPath();ctx.rect(6,8,56,38);ctx.clip();
  const wash=ctx.createLinearGradient(6,8,62,46);
  wash.addColorStop(0,'rgba(186,124,222,.24)');
  wash.addColorStop(.55,'rgba(91,74,159,.32)');
  wash.addColorStop(1,'rgba(44,49,100,.06)');
  ctx.fillStyle=wash;ctx.fillRect(6,8,56,38);
  ctx.globalAlpha=.96;
  livePortrait(ctx,streams.host,23,12,31);
  liveFanPortrait(ctx,streams,feed.guestKind,45,12);
  ctx.globalAlpha=1;
  ctx.restore();
  ctx.fillStyle='#fff';ctx.font='bold 9px system-ui';ctx.fillText('PHOTO OP',79,21,32);
  ctx.fillStyle='#d1f6e1';ctx.font='bold 6px system-ui';ctx.fillText('DUO SNAP',79,31,35);
  ctx.save();ctx.translate(33,44);ctx.rotate(-.08);
  ctx.font='italic bold 7px cursive';ctx.fillStyle='#ffdb9c';ctx.fillText('Destiny ✦',0,0,48);ctx.restore();
 }else if(feed?.type==='autograph'){
  ctx.fillStyle='rgba(226,192,243,.10)';ctx.fillRect(9,10,82,36);
  ctx.fillStyle='#f6d99d';ctx.font='italic bold 13px cursive';ctx.fillText('Destiny ✦',50,31,74);
  ctx.fillStyle='#d5f1e1';ctx.font='bold 8px system-ui';ctx.fillText('FAN MOMENT',50,41,74);
 }else if(feed?.type==='debate'){
  ctx.fillStyle='#f3f5f6';ctx.font='bold 10px system-ui';ctx.fillText('DEBATE RESULT',50,18,92);
  ctx.fillStyle=feed.won?'#a7e0bc':'#ffc0ae';ctx.font='900 23px system-ui';
  ctx.fillText(feed.won?'WIN':'LOSS',50,40,94);
  ctx.fillStyle='#ecf1f2';ctx.font='7px system-ui';ctx.fillText(String(feed.topicTitle||'LIVE DISCUSSION').slice(0,23),50,50,89);
 }else{
  // The physical Destiny sprite crosses the LCD's left edge. Keep the idle
  // broadcast slate entirely within the TV's right-hand text-safe region.
  ctx.fillStyle='#e8eff0';ctx.font='bold 10px system-ui';ctx.fillText('DGG LIVE',77,19,41);
  ctx.fillStyle='#dfc4ff';ctx.font='bold 6px system-ui';ctx.fillText('MEET & GREET',77,29,40);
  ctx.fillStyle='#e8eff0';ctx.font='4.9px system-ui';ctx.fillText('CONVENTION CAM',77,37,42);
 }
 ctx.restore();
}
export function drawModularVenue(ctx,assets,event,t,streams={}){
  if(!modularVenueReady(assets))return false;
  ctx.save();
  // ONE baked perspective: no stage/booth/entrance sprites, no overscan,
  // no layered prop offsets. Gameplay lives in the plate's 384x216 UV map.
  draw(ctx,assets.plate,{x:0,y:0,w:384,h:216});
  drawVenueDustMotes(ctx,t);
  drawStageDebateUplight(ctx,event,t);
  for(const side of ['left','right'])drawGate(ctx,event,side);
  drawBoothActivity(ctx,event);
  drawModularTV(ctx,event,t,streams);
  ctx.restore();
  return true;
}
export function drawBakedForegroundOccluders(ctx,assets){
  if(!modularVenueReady(assets))return;
  // Reuse pixels from the SAME baked image for foreground depth masking.
  // This makes people pass behind the counter/posts without separate art.
  for(const block of MODULAR_BLOCKERS){
    if(!(block.name==='checkin'||block.name.startsWith('entrance')||block.name.includes('scanner')))continue;
    // The counter has a raised illustrated countertop 5px above its solid
    // floor hitbox; mask the clerk's legs behind the actual drawn front face.
    const mask=block.name==='checkin'?{x:block.x,y:block.y-5,w:block.w,h:block.h+5}:block;
    ctx.save();ctx.beginPath();ctx.rect(mask.x,mask.y,mask.w,mask.h);ctx.clip();
    draw(ctx,assets.plate,{x:0,y:0,w:384,h:216});
    ctx.restore();
  }
}
export {FILES as MODULAR_VENUE_FILES};
