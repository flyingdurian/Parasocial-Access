/* v0.8.8h unified plate, interactive TV, tickets, gate glass and dust motes. */
import {MODULAR_PROPS,MODULAR_GATES,MODULAR_TV_PROJECTION,MODULAR_BLOCKERS} from './venue-geometry-v088b.js';

const FILES=Object.freeze({plate:'Neon Convention Hall Claw Machine.png',clerk:'irl-ticket-clerk-v088h.webp',mascot:'Adorable blue mascot clutching a red heart.png'});
export function loadModularVenueAssets(){
 const assets={};
 for(const [key,file] of Object.entries(FILES)){
  const image=new Image();
  image.src='/assets/'+encodeURIComponent(file);
  assets[key]=image;
 }
 return assets;
}
export const modularVenueReady=assets=>!!assets&&assets.plate?.complete&&assets.plate?.naturalWidth>0&&assets.clerk?.complete&&assets.clerk?.naturalWidth>0;

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
 const span=lane.right-lane.left,waist=lane.top+11;
 const leaf=Math.max(0,(span/2-1)*(1-open));
 // Low scanner arms retract into fixed illustrated posts, with no moving walls.
 ctx.save();
 for(let i=0;i<2;i++){
  const x=i===0?lane.left:lane.right-leaf;
  if(leaf>.05){
   ctx.fillStyle='rgba(24,35,58,.82)';ctx.fillRect(x,waist+.8,leaf,3.5);
   ctx.fillStyle='#a3c8d9';ctx.fillRect(x,waist,leaf,1.2);
   ctx.fillStyle='rgba(225,245,251,.72)';ctx.fillRect(x,waist+1.5,Math.max(0,leaf-.6),.65);
  }
 }
 const pulse=.65+.25*Math.sin((event?.elapsed||0)*8);
 ctx.fillStyle=open>.65?'rgba(92,255,191,'+pulse+')':'#efc076';
 ctx.fillRect(lane.left-2.6,lane.top+3,1.6,2.6);
 ctx.fillRect(lane.right+1,lane.top+3,1.6,2.6);
 ctx.restore();
}
// A single, non-roaming staff member behind the desk, deliberately rendered
// under the baked foreground counter mask applied after all walking actors.
export function drawTicketClerk(ctx,assets,event){
 if(!assets?.clerk?.naturalWidth||!event?.ticketClerk)return;
 const worker=event.ticketClerk;
 const t=event.elapsed||0,frame=Math.floor(t*3)%4;
 const scanned=t-worker.lastScanAt<.6;
 ctx.save();
 // Four subtle counter-service keyframes: check screen, scan pass, look up,
 // rest. The desk remains a fixed collision object.
 const bob=frame===2?-.8:frame===3?-.25:0;
 const dx=frame===1?.55:0;
 ctx.drawImage(assets.clerk,worker.x+dx,worker.y+bob,29,36);
 if(scanned){
  const strength=Math.max(0,1-(t-worker.lastScanAt)/.6);
  ctx.globalAlpha=strength*.80;ctx.fillStyle='#b8fff2';
  ctx.fillRect(worker.x+18+frame%2,worker.y+20,4,2);
  ctx.fillRect(worker.x+20,worker.y+17,1.4,3);
 }else if(frame===1){
  ctx.globalAlpha=.55;ctx.fillStyle='#dff4fc';
  ctx.fillRect(worker.x+20,worker.y+20,2,1.5);
 }
 ctx.restore();
}
// Independent tiny atmosphere layer: only near light sources, independent of
// character simulation and fully cosmetic. No particles on the UI overlays.
// Independent from the baked scenery, depth-sorted with other walking sprites.
export function drawVenueMascot(ctx,assets,event,t){
 const sprite=assets?.mascot,actor=event?.mascot;
 if(!sprite?.naturalWidth||!actor)return false;
 ctx.save();
 const beat=t*.0028;
 const bob=actor.walking?Math.abs(Math.sin(beat*2.2))*1.6:Math.sin(beat)*.65;
 const w=22,h=24;
 const x=Math.round(actor.x),y=Math.round(actor.y-bob);
 ctx.fillStyle='rgba(19,13,53,.24)';
 ctx.beginPath();ctx.ellipse(x+w/2,actor.y+h-1,9,2.4,0,0,Math.PI*2);ctx.fill();
 if(actor.facing<0){ctx.translate(x+w,0);ctx.scale(-1,1);ctx.drawImage(sprite,0,y,w,h);}
 else ctx.drawImage(sprite,x,y,w,h);
 if(actor.heartBurst>0){
  const alpha=Math.min(1,actor.heartBurst/.4);
  ctx.globalAlpha=alpha;ctx.fillStyle='#ff679b';ctx.font='bold 8px sans-serif';
  for(let k=0;k<3;k++)ctx.fillText('♥',x+3+k*6,actor.y-4-Math.sin(beat*2+k)*3-(1-alpha)*5);
 }
 ctx.restore();
 return true;
}
export function drawVenueDustMotes(ctx,t){
 const lights=[[75,15,10,7],[325,15,11,8],[71,63,15,9],[345,66,13,10],[234,70,8,5],[267,70,8,5],[294,70,8,5]];
 ctx.save();
 for(let l=0;l<lights.length;l++){
  const [cx,cy,rx,ry]=lights[l];
  for(let i=0;i<5;i++){
   const seed=l*31+i*71;const drift=(t/1000)*(.37+(seed%7)*.09);
   const x=cx+Math.sin(seed*1.57+drift)*rx,y=cy+Math.cos(seed*.71+drift*.6)*ry-(drift*1.4)%3;
   const glow=.08+.12*(.5+.5*Math.sin(t*.0009+seed));
   ctx.globalAlpha=glow;ctx.fillStyle=l>=4?'#f5caac':'#fee6c3';
   ctx.fillRect(Math.round(x),Math.round(y),i%4===0?1.2:.7,i%3===0?1.1:.6);
  }
 }
 ctx.restore();
}
function drawFighterAura(ctx,x,y,t,boss=false){
 // Three glowing layers, stepped flame tongues, lightning and rising sparks.
 // Deterministic animation and fixed particle budget keep iPhone FPS stable.
 const outer=boss?'74,181,255':'214,47,105';
 const inner=boss?'255,211,92':'175,81,255';
 const highlight=boss?'234,249,255':'255,195,238';
 const sec=t/1000,phase=sec*(boss?7.6:9.4),pulse=.78+.22*Math.sin(phase);
 ctx.save();ctx.globalCompositeOperation='screen';
 for(let layer=0;layer<3;layer++){
  const rx=15+layer*4+pulse*2,ry=22+layer*4+pulse*3;
  const glow=ctx.createRadialGradient(x,y+3,2,x,y,ry);
  const color=layer===0?inner:outer;
  glow.addColorStop(0,'rgba('+color+','+(.34-.07*layer)*pulse+')');
  glow.addColorStop(.62,'rgba('+color+','+(.20-.04*layer)*pulse+')');
  glow.addColorStop(1,'rgba('+color+',0)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();
 }
 for(const side of [-1,1]){
  for(let tongue=0;tongue<7;tongue++){
   const rise=tongue*5.5,sway=Math.sin(phase*.58+tongue*1.73+side*2.3)*3.2;
   const edge=x+side*(11+tongue*.36)+sway,top=y+15-rise;
   ctx.fillStyle='rgba('+outer+','+(.46+(tongue%3)*.08)*pulse+')';
   ctx.fillRect(Math.round(edge),Math.round(top),tongue%3===0?3:2,8+(tongue%2)*3);
   ctx.fillStyle='rgba('+inner+','+(.34+.12*pulse)+')';
   ctx.fillRect(Math.round(edge-side*3),Math.round(top+3),1.4,5);
   if(tongue%2===0){
    ctx.fillStyle='rgba('+highlight+','+(.55+.30*pulse)+')';
    ctx.fillRect(Math.round(edge+side),Math.round(top-4),1.2,3.2);
   }
  }
 }
 // Electric shoulders, with distinct bright inner rim for the final boss.
 for(let bolt=0;bolt<3;bolt++){
  const side=bolt%2?-1:1,seed=phase*.37+bolt*3.7;
  const sx=Math.round(x+side*(13+bolt*2)),sy=Math.round(y-17+bolt*10);
  ctx.beginPath();ctx.moveTo(sx,sy);
  for(let segment=1;segment<=4;segment++){
   ctx.lineTo(Math.round(sx+side*(segment*2+Math.sin(seed+segment*2.8)*2)),
    Math.round(sy+segment*3.6));
  }
  ctx.lineWidth=bolt===1?1.1:.7;
  ctx.strokeStyle='rgba('+highlight+','+(.47+.39*pulse)+')';ctx.stroke();
 }
 for(let spark=0;spark<26;spark++){
  const seed=spark*17.71+(boss?3:19),climb=(sec*(9+(spark%5)*3)+seed*3)%45;
  const drift=Math.sin(seed+sec*(1.3+(spark%4)*.3));
  const px=Math.round(x+drift*(11+(spark%3)*5)),py=Math.round(y+20-climb);
  ctx.globalAlpha=(.30+.60*(1-climb/45))*pulse;
  ctx.fillStyle=spark%4===0?'rgb('+highlight+')':spark%2?'rgb('+outer+')':'rgb('+inner+')';
  ctx.fillRect(px,py,spark%6===0?2:1,spark%7===0?3:1.4);
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
  ctx.globalAlpha=.70+.25*Math.sin(t*.003+x);ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(x,y-8,10,20,0,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
 // Glows are behind the actual sprites; the clipped television paints above.
 if(debater.hostAuraActive)drawFighterAura(ctx,(event.hostX??204)+16,(event.hostY??44)+19,t,true);
 if(debater.challengerAuraActive)drawFighterAura(ctx,debater.x+16,debater.y+20,t,false);
}
function livePortrait(ctx,asset,x,y,height=31,col=0,row=0,cols=4,rows=2,maxWidth=22){
 if(!asset?.naturalWidth||!asset?.naturalHeight)return false;
 const sw=asset.naturalWidth/cols,sh=asset.naturalHeight/rows;
 const aspect=sw/sh,dw=Math.min(maxWidth,height*aspect);
 ctx.drawImage(asset,col*sw,row*sh,sw,sh,x-dw/2,y,dw,height);
 return true;
}
function liveFanPortrait(ctx,streams,kind,x,y,height=31,maxWidth=22){
 // A cast-atlas fallback must crop the REAL guest cell; the top-left cell is Destiny.
 if(kind>=12&&kind<=29){
  const group=Math.floor((kind-12)/6),sheet=streams.extra?.[group];
  if(sheet?.naturalWidth)return livePortrait(ctx,sheet,x,y,height,(kind-12)%6,0,6,2,maxWidth);
 }
 if(kind>=1&&kind<12){
  const pose=streams.poses?.[kind];
  if(pose?.naturalWidth&&pose!==streams.host)return livePortrait(ctx,pose,x,y,height,0,0,4,2,maxWidth);
 }
 const safeKind=Number.isInteger(kind)&&kind>=1&&kind<12?kind:2;
 return livePortrait(ctx,streams.cast,x,y,height,safeKind%4,Math.floor(safeKind/4),4,3,maxWidth);
}
function drawBoothActivity(ctx,event,assets){
 // Tiny contextual receipts that read as rewards; no unlabeled circles or notes.
 const anchors={merch:[57,86],claw:[181,104],snacks:[132,88],photo:[353,103]};
 const labels={merch:'MERCH SOLD',claw:'PRIZE WON',snacks:'FOOD + DRINK',photo:'PHOTO TAKEN'};
 for(const fx of event?.effects||[]){
  if(fx.kind!=='booth')continue;
  if(fx.station==='claw'&&(event?.clawMachine?.activeUntil||0)>(event?.elapsed||0)+.6)continue;
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
 // Physical station animations sit on the pictured fixtures, not on ghost props.
 for(const [name,activity] of Object.entries(event?.stationActivity||{})){
  if(!activity||activity.activeUntil<=event.elapsed)continue;
  const age=Math.max(0,activity.activeUntil-event.elapsed);
  ctx.save();
  if(name==='merch'){
   const x=49+Math.sin(age*7)*2,y=82;
   ctx.fillStyle='#f9d8ec';ctx.fillRect(x-3,y-7,6,5);
   ctx.fillStyle='#9475ea';ctx.fillRect(x-4,y-8,2,3);ctx.fillRect(x+3,y-8,2,3);
   ctx.fillStyle='#ffe2a5';ctx.fillRect(61,y-5,3,2);
  }else if(name==='snacks'){
   ctx.fillStyle='#ffd582';ctx.fillRect(129,80,9,2);
   ctx.fillStyle='#f7a65b';ctx.fillRect(130,76,6,4);
   ctx.fillStyle='#7cf5df';ctx.fillRect(140,74,3,7);
   ctx.fillStyle='#e8ffff';ctx.fillRect(141,72,1,3);
  }else if(name==='photo'){
   if(activity.flashed&&age<1.22&&age>.92){
    ctx.globalAlpha=.42;ctx.fillStyle='#f9f9ff';ctx.fillRect(342,56,35,35);
   }
   ctx.fillStyle='#e3e9ff';ctx.fillRect(368,83,6,5);
   ctx.fillStyle='#d6a4fe';ctx.fillRect(369,80,4,2);
  }
  ctx.restore();
 }
 // The ONE claw prize never respawns on the cabinet floor after pickup.
 // Pickup -> carry -> fall into the existing bottom chute.
 if((event?.clawMachine?.activeUntil||0)>(event?.elapsed||0)){
  const cabinet=MODULAR_PROPS.claw;
  const glass={x:cabinet.x+2,y:cabinet.y+9,w:cabinet.w-4,h:22};
  const p=Math.max(0,Math.min(1,1-(event.clawMachine.activeUntil-event.elapsed)/2.3));
  const pickupX=glass.x+glass.w*.47,dropX=cabinet.x+17;
  const headX=pickupX+(p>.58?Math.min(1,(p-.58)/.20)*(glass.w*.28):0);
  const headY=p<.20?glass.y+3:p<.40?glass.y+3+(p-.20)/.20*12:p<.58?glass.y+15-(p-.40)/.18*12:glass.y+3;
  const carried=p>=.40&&p<.78;
  ctx.save();ctx.beginPath();ctx.rect(glass.x,glass.y,glass.w,glass.h);ctx.clip();
  ctx.fillStyle='rgba(147,251,255,.12)';ctx.fillRect(glass.x+1,glass.y+1,glass.w-2,glass.h-2);
  if(p<.78&&assets?.mascot?.naturalWidth){
   const toyX=carried?headX-3:pickupX-3,toyY=carried?headY+4:glass.y+glass.h-7;
   ctx.drawImage(assets.mascot,toyX,toyY,6.4,7);
  }
  const grip=carried?1.6:3.1;
  ctx.fillStyle='#ccf3ff';ctx.fillRect(headX-.6,glass.y,1.2,Math.max(1,headY-glass.y));
  ctx.fillStyle='#e6f7ff';ctx.fillRect(headX-2.5,headY,5,2.5);
  ctx.fillStyle='#efcf93';ctx.fillRect(headX-3.4+grip*.38,headY+2,1.2,2.8);
  ctx.fillRect(headX+2.1-grip*.38,headY+2,1.2,2.8);
  ctx.restore();
  if(p>=.78&&assets?.mascot?.naturalWidth){
   ctx.save();ctx.beginPath();ctx.rect(cabinet.x+6,cabinet.y+34,cabinet.w-9,12);ctx.clip();
   const fall=Math.min(1,(p-.78)/.18),dropY=cabinet.y+33+fall*6;
   ctx.drawImage(assets.mascot,dropX,dropY,6.4,7);
   ctx.restore();
  }
 }
}
export function drawModularTV(ctx,event,t,streams={}){
 const projection=MODULAR_TV_PROJECTION;
 const feed=event?.tvEvent?.ttl>0?event.tvEvent:null;
 const debate=event?.departures?.find(g=>g.debater&&g.stageVisit==='exchange');
 const prelude=event?.departures?.find(g=>g.debater&&['approach','climbStairs'].includes(g.stageVisit));
 ctx.save();
 ctx.transform(projection.a,projection.b,projection.c,projection.d,projection.e,projection.f);
 ctx.beginPath();ctx.rect(0,0,100,56);ctx.clip();
 // Broadcast slate, not holographic neon. Image is mapped to the panel's
 // measured parallelogram, so footage does not distort on the room canvas.
 const grad=ctx.createLinearGradient(0,0,100,56);
 grad.addColorStop(0,'#19143c');grad.addColorStop(1,'#363373');
 ctx.fillStyle=grad;ctx.fillRect(0,0,100,56);
 // A second inset clip protects the upper bezel and suppresses edge artifacts.
 ctx.beginPath();ctx.rect(3,7,94,46);ctx.clip(); // no drawing across the top bezel
 ctx.textBaseline='alphabetic';ctx.textAlign='center';
 if(debate){
  const audience=(event.crowd||[]).filter(p=>p.debateWatching);
  // Camera director: genuinely different crops/zooms, not the same two-shot
  // with a changing label. Solo Destiny, solo critic, split-screen, crowd.
  const shot=Math.floor(t/1550)%5,crowdCam=shot===3&&audience.length>0;
  ctx.fillStyle='rgba(7,10,35,.88)';ctx.fillRect(4,9,92,43);
  ctx.fillStyle='#ffc98f';ctx.font='bold 5.2px ui-monospace,monospace';
  const label=crowdCam?'AUDIENCE CLOSE-UP':shot===0||shot===4?'DESTINY CLOSE-UP':shot===1?'CHALLENGER CLOSE-UP':'BLOODSPORTS LIVE';
  ctx.fillText(label,50,15,87);
  ctx.fillStyle='#ff637b';ctx.fillRect(7,10,2.6,2);
  ctx.save();ctx.beginPath();ctx.rect(6,17,88,29);ctx.clip();
  if(crowdCam){
   const chosen=audience[Math.floor(t/1550)%audience.length];
   liveFanPortrait(ctx,streams,chosen.kind,50,15,48,45);
   if(audience.length>2){
    liveFanPortrait(ctx,streams,audience[(audience.indexOf(chosen)+1)%audience.length].kind,17,26,25,22);
    liveFanPortrait(ctx,streams,audience[(audience.indexOf(chosen)+2)%audience.length].kind,83,26,25,22);
   }
  }else if(shot===0||shot===4){
   const cell=[6,5,6,4][Math.floor(t/300)%4];
   livePortrait(ctx,streams.host,50+Math.sin(t/360)*2,11,49,cell%4,Math.floor(cell/4),4,2,44);
  }else if(shot===1){
   liveFanPortrait(ctx,streams,debate.kind,50+Math.sin(t/340)*2,11,49,44);
  }else{
   const cell=[6,5,6][Math.floor(t/270)%3];
   livePortrait(ctx,streams.host,28,15,36,cell%4,Math.floor(cell/4),4,2,29);
   liveFanPortrait(ctx,streams,debate.kind,71,15,36,29);
  }
  ctx.restore();
  ctx.fillStyle='#f0f4ff';ctx.font='bold 5.2px ui-monospace,monospace';
  ctx.fillText(crowdCam?'CROWD IS LOSING IT':shot===0||shot===4?'FINAL BOSS':shot===1?'THE CHALLENGER':'FACE TO FACE',50,51,83);
  ctx.fillStyle='#f4f7ff';ctx.font='bold 6px ui-monospace,monospace';
  ctx.fillText(String(Math.max(0,Math.ceil(debate.exchangeClock)))+'s',91,15,13);
 }else if(prelude){
  const pulse=.5+.5*Math.sin(t/190);
  ctx.fillStyle='rgba(10,13,34,.85)';ctx.fillRect(4,9,92,43);
  ctx.fillStyle='#ffb86f';ctx.font='bold 6px ui-monospace,monospace';
  ctx.fillText('DEBATE IS ABOUT TO BEGIN...',50,21,86);
  ctx.fillStyle='rgba(125,185,255,'+(.22+.36*pulse)+')';ctx.fillRect(11,25,78,1);
  ctx.save();ctx.beginPath();ctx.rect(7,28,86,18);ctx.clip();
  livePortrait(ctx,streams.host,29,24,25,5%4,Math.floor(5/4));
  liveFanPortrait(ctx,streams,prelude.kind,72,24,25);
  ctx.restore();
  ctx.fillStyle='#f4da9e';ctx.font='bold 5px ui-monospace,monospace';
  ctx.fillText('THE CROWD IS GATHERING',50,51,87);
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
  drawBoothActivity(ctx,event,assets);
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
