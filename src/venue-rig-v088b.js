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
 const span=lane.right-lane.left,leaf=(span/2-.4)*(1-open),top=lane.top+7;
 // The rail and fixed scanner posts stay in place; two slotted steel/glass
 // shutters telescope into their posts. Open clearance equals the full lane.
 ctx.save();
 ctx.fillStyle='rgba(22,36,54,.64)';ctx.fillRect(lane.left-1,top+14,span+2,2);
 ctx.fillStyle='rgba(173,200,214,.72)';ctx.fillRect(lane.left,top+14,span,.7);
 if(leaf>.15){
  for(const sideIndex of [0,1]){
   const x=sideIndex===0?lane.left:lane.right-leaf;
   ctx.fillStyle='rgba(45,67,86,.78)';ctx.fillRect(x,top,leaf,14);
   ctx.fillStyle='rgba(171,226,243,.37)';ctx.fillRect(x+.8,top+1,Math.max(0,leaf-1.6),12);
   ctx.fillStyle='rgba(222,239,238,.82)';
   for(let j=0;j<3;j++)ctx.fillRect(x,top+2+j*4,leaf,.8);
   ctx.fillStyle='rgba(38,53,71,.85)';
   for(let j=0;j<2;j++)ctx.fillRect(x+2+j*6,top+2,1.2,10);
   ctx.fillStyle='#e5f7ff';
   ctx.fillRect(sideIndex===0?x+leaf-.8:x,top,.8,14);
  }
 }
 const pulse=.65+.25*Math.sin((event?.elapsed||0)*9);
 ctx.fillStyle=open>.55?'rgba(90,255,195,'+pulse+')':'#ffd08c';
 ctx.fillRect(lane.left-4,lane.top+2,1.4,2.4);
 ctx.fillRect(lane.right+2,lane.top+2,1.4,2.4);
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
function drawFighterAura(ctx,x,y,t,boss=false){
 const primary=boss?'89,210,255':'236,110,255',core=boss?'255,214,126':'250,180,255';
 const pulse=.72+.22*Math.sin(t*7+(boss?0:2));
 ctx.save();ctx.globalCompositeOperation='screen';
 const halo=ctx.createRadialGradient(x,y+3,3,x,y,30);
 halo.addColorStop(0,'rgba('+primary+','+(.29*pulse)+')');
 halo.addColorStop(1,'rgba('+primary+',0)');
 ctx.fillStyle=halo;ctx.beginPath();ctx.ellipse(x,y,19,27,0,0,Math.PI*2);ctx.fill();
 // Hard-edged stepped energy flames retain the pixel-art look.
 for(let j=0;j<14;j++){
  const angle=j*2.39996+t*.43,rad=12+Math.sin(j*9+t*6)*4;
  const px=Math.round(x+Math.cos(angle)*rad),py=Math.round(y+Math.sin(angle)*rad*1.45);
  ctx.fillStyle='rgba('+primary+','+(.45+.4*pulse)+')';
  ctx.fillRect(px,py,1.6+(j%3),2+(j%4));
 }
 for(const side of [-1,1]){
  ctx.fillStyle='rgba('+core+','+(.72*pulse)+')';
  const sway=Math.sin(t*6+side*2)*3;
  ctx.fillRect(Math.round(x+side*13+sway),Math.round(y-18),2,9);
  ctx.fillRect(Math.round(x+side*10+sway),Math.round(y-24),2,5);
 }
 ctx.restore();
}
export function drawStageDebateUplight(ctx,event,t){
 const debater=event?.departures?.find(g=>g.debater&&g.stageVisit==='exchange');
 if(!debater)return;
 ctx.save();
 for(const [x,y] of [[235,74],[268,74],[296,74]]){
  const grad=ctx.createRadialGradient(x,y,1,x,y-7,19);
  grad.addColorStop(0,'rgba(246,166,255,.22)');grad.addColorStop(1,'rgba(128,88,215,0)');
  ctx.globalAlpha=.70+.25*Math.sin(t*3+x);ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(x,y-8,10,20,0,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
 // Glows are behind the actual sprites; the clipped television paints above.
 drawFighterAura(ctx,(event.hostX??204)+16,(event.hostY??44)+19,t,true);
 drawFighterAura(ctx,debater.x+16,debater.y+20,t,false);
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
 const anchors={merch:[57,103],claw:[39,120],snacks:[133,100],vending:[178,95],photo:[350,105]};
 const labels={merch:'+1 MERCH',claw:'+1 PRIZE',snacks:'+1 SNACK',vending:'+1 DRINK',photo:'+1 PHOTO'};
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
  // Discrete register/dispense/camera pixels, not floating fixture sprites.
  ctx.fillStyle=fx.station==='photo'?'#f6faff':fx.station==='claw'?'#9fffe7':'#ffdca0';
  ctx.fillRect(point[0]-5,y-14+Math.floor(age*3),2,2);
  ctx.fillRect(point[0]+4,y-12-Math.floor(age*3),1.5,2);
  ctx.restore();
 }
 // The transparent glass shows a working grapple and prize drop only while
 // a visitor is at the left-aisle cabinet; no duplicate machine sprite.
 if((event?.clawMachine?.activeUntil||0)>(event?.elapsed||0)){
  const progress=1-(event.clawMachine.activeUntil-event.elapsed)/2.3;
  const swing=Math.round(31+Math.sin(progress*7)*5),drop=progress<.5?progress*15:(1-progress)*15;
  ctx.save();ctx.beginPath();ctx.rect(23,109,25,19);ctx.clip();
  ctx.fillStyle='rgba(146,251,255,.2)';ctx.fillRect(24,110,23,17);
  ctx.fillStyle='#d8f6ff';ctx.fillRect(swing,109,1.2,4+drop);
  ctx.fillStyle='#f5d79c';ctx.fillRect(swing-2,113+drop,2.2,2.2);ctx.fillRect(swing+1,113+drop,2.2,2.2);
  if(progress>.65){ctx.fillStyle='#ffc7ec';ctx.fillRect(swing-2,120-(progress-.65)*14,5,4);}
  ctx.restore();
 }
}
export function drawModularTV(ctx,event,t,streams={}){
 const projection=MODULAR_TV_PROJECTION;
 const feed=event?.tvEvent?.ttl>0?event.tvEvent:null;
 const debate=event?.departures?.find(g=>g.debater&&g.stageVisit==='exchange');
 ctx.save();
 ctx.transform(projection.a,projection.b,projection.c,projection.d,projection.e,projection.f);
 ctx.beginPath();ctx.rect(0,0,100,56);ctx.clip();
 // Broadcast slate, not holographic neon. Image is mapped to the panel's
 // measured parallelogram, so footage does not distort on the room canvas.
 const grad=ctx.createLinearGradient(0,0,100,56);
 grad.addColorStop(0,'#19143c');grad.addColorStop(1,'#363373');
 ctx.fillStyle=grad;ctx.fillRect(0,0,100,56);
 // A second inset clip protects the upper bezel and suppresses edge artifacts.
 ctx.beginPath();ctx.rect(2,2,96,52);ctx.clip();
 ctx.fillStyle='#c7b9ff';ctx.fillRect(4,4,92,1);
 ctx.fillStyle='#d5a5f0';ctx.fillRect(4,5,24,1);
 ctx.textBaseline='alphabetic';ctx.textAlign='center';
 if(debate){
  // Live arcade broadcast: a close-up of the two fighters, health bars,
  // 6–12 second round clock, and a community chat crawl.
  ctx.fillStyle='rgba(8,11,37,.62)';ctx.fillRect(3,7,94,45);
  ctx.fillStyle='#ffe098';ctx.font='900 6px ui-monospace,monospace';ctx.fillText('FINAL BOSS',74,14,40);
  ctx.fillStyle='#a4e5ff';ctx.fillRect(5,4,42,2.4);
  ctx.fillStyle='#fa9dfe';ctx.fillRect(53,4,42,2.4);
  ctx.fillStyle='#bdefff';ctx.font='900 7px monospace';ctx.fillText('VS',50,21);
  ctx.save();ctx.beginPath();ctx.rect(6,10,53,36);ctx.clip();
  livePortrait(ctx,streams.host,22,12,36);
  liveFanPortrait(ctx,streams,debate.kind,47,12);
  ctx.restore();
  ctx.font='900 5px ui-monospace,monospace';ctx.fillStyle='#b7f8ff';ctx.fillText('DESTINY',77,23,38);
  ctx.fillStyle='#ffd9ff';ctx.fillText(String(debate.name||'CHALLENGER').toUpperCase().slice(0,16),77,31,39);
  const live=event?.debateChat?.at(-1)?.text||'BLOODSPORTS LIVE';
  ctx.fillStyle='#fff0a5';ctx.font='bold 5px ui-monospace,monospace';ctx.fillText(live,77,41,39);
  ctx.fillStyle='#ffffff';ctx.font='900 7px ui-monospace,monospace';ctx.fillText('00:'+String(Math.max(0,Math.ceil(debate.exchangeClock))).padStart(2,'0'),77,49,36);
 }else if(feed?.type==='photo'){
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
  const age=(feed.maxTtl||2.4)-feed.ttl,slam=Math.min(1,age/.23);
  const accent=feed.won?'#81ffbf':'#ff86bf';
  ctx.fillStyle='rgba(15,12,46,.9)';ctx.fillRect(4,8,92,42);
  ctx.fillStyle=accent;ctx.fillRect(6,10,88*slam,2);
  ctx.fillStyle='#f9e6ba';ctx.font='900 7px ui-monospace,monospace';ctx.fillText('BLOODSPORTS // K.O.',50,20,89);
  ctx.fillStyle=accent;ctx.font='900 '+Math.round(16+7*slam)+'px ui-monospace,monospace';
  ctx.fillText(feed.won?'DEBATE WON':'DEBATE LOST',50,38,92);
  ctx.fillStyle='#f1f6ff';ctx.font='bold 5.5px ui-monospace,monospace';
  ctx.fillText(String(feed.topicTitle||'LIVE DEBATE').slice(0,24),49,46,74);
  ctx.fillStyle='#fff0a2';ctx.fillText(String(feed.score??0)+' PTS',86,51,22);
  if(age<.14){ctx.globalAlpha=(.14-age)/.14*.55;ctx.fillStyle='#fff';ctx.fillRect(7,12,86,31);ctx.globalAlpha=1;}
 }else{
  // The physical Destiny sprite crosses the LCD's left edge. Keep the idle
  // broadcast slate entirely within the TV's right-hand text-safe region.
  ctx.fillStyle='#e8eff0';ctx.font='bold 10px system-ui';ctx.fillText('DGG LIVE',77,19,41);
  ctx.fillStyle='#dfc4ff';ctx.font='bold 6px system-ui';ctx.fillText('MEET & GREET',77,29,40);
  ctx.fillStyle='#e8eff0';ctx.font='4.9px system-ui';ctx.fillText('CONVENTION CAM',77,37,42);
 }
 if(feed&&(feed.type==='photo'||feed.type==='autograph')){
  const age=(feed.maxTtl||1.9)-feed.ttl;
  if(age<.13){ctx.globalAlpha=Math.max(0,(.13-age)/.13)*.4;ctx.fillStyle='#fff';ctx.fillRect(9,10,82,33);ctx.globalAlpha=1;}
 }
 // Translucent CRT scanlines remain strictly inside the physical LCD.
 ctx.globalAlpha=.12;ctx.fillStyle='#a2bdff';
 for(let y=8;y<54;y+=4)ctx.fillRect(3,y,94,.35);
 ctx.globalAlpha=1;
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
