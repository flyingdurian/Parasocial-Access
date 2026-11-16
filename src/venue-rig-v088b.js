/* Modular saturated indigo/magenta evening-convention renderer. No painted legacy props.
   Atlas crop boxes are independent sprites in one binary file per prop family. */
import {MODULAR_PROPS,MODULAR_GATES,MODULAR_TV_PROJECTION,MODULAR_ATLAS} from './venue-geometry-v088b.js';

const FILES=Object.freeze({
 hall:'irl-hall-v088e.webp',
 stage:'irl-stage-shell-v088e.webp',
 entrance:'irl-entrance-v088e.webp',
 ropes:'irl-stage-queue-ropes-v088c.webp',
 booths:'irl-booth-atlas-vibrant-v088b.webp'
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
// Pre-mask stray legacy crimson pixels baked behind the left rail of the otherwise
// clean alpha stage. The processed bitmap is cached once per loaded Image.
const cleanedStageCache=new WeakMap();
function drawStageShell(ctx,image,bounds){
 if(!image?.naturalWidth)return;
 if(typeof document==='undefined'){draw(ctx,image,bounds);return;}
 let clean=cleanedStageCache.get(image);
 if(!clean){
  try{
   const canvas=document.createElement('canvas');
   canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
   const c=canvas.getContext('2d',{willReadFrequently:true});
   c.drawImage(image,0,0);
   const frame=c.getImageData(0,0,canvas.width,canvas.height);
   const pixels=frame.data,limitX=Math.floor(canvas.width*.215);
   for(let y=Math.floor(canvas.height*.34);y<Math.floor(canvas.height*.89);y++){
    for(let x=0;x<limitX;x++){
     const i=(y*canvas.width+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
     if(a>0&&r>155&&g<65&&b<95&&r>g*2.3&&r>b*1.8)pixels[i+3]=0;
    }
   }
   c.putImageData(frame,0,0);clean=canvas;
  }catch{clean=image;}
  cleanedStageCache.set(image,clean);
 }
 ctx.drawImage(clean,bounds.x,bounds.y,bounds.w,bounds.h);
}
// The stage is intentionally fixed; gameplay changes actor poses, not furniture.
export const MODULAR_CAMERA_SCALE=.965;
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
 const open=openness(event,side);
 // The scanner pillars, planters and check-in are one static entrance bitmap.
 // Controller state changes ONLY these anchored retractable translucent flaps.
 const center=side==='left'?112:275;
 const y=178,flapWidth=Math.max(0,8.5*(1-open));
 ctx.save();
 if(flapWidth>.1){
  ctx.fillStyle='rgba(187,228,242,.75)';
  ctx.fillRect(center-8.5,y,flapWidth,11);
  ctx.fillRect(center+8.5-flapWidth,y,flapWidth,11);
  ctx.fillStyle='rgba(245,254,255,.86)';
  ctx.fillRect(center-8.5+flapWidth-.7,y,.7,11);
  ctx.fillRect(center+8.5-flapWidth,y,.7,11);
 }
 ctx.fillStyle=open>.35?'#7ef0ac':'#f4d58a';
 ctx.fillRect(center-16,y-7,1.8,2);
 ctx.fillRect(center+14,y-7,1.8,2);
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
 const anchors={merch:[81,104],snacks:[155,104],vending:[23,107],photo:[346,139]};
 const labels={merch:'+1 MERCH',snacks:'+1 SNACK',vending:'+1 DRINK',photo:'+1 PHOTO'};
 for(const fx of event?.effects||[]){
  if(fx.kind!=='booth')continue;
  const point=anchors[fx.station];if(!point)continue;
  const age=1-Math.max(0,Math.min(1,fx.ttl/(fx.maxTtl||1.15)));
  const y=point[1]-5-age*6,alpha=Math.min(.85,fx.ttl*1.8);
  const label=labels[fx.station];
  ctx.save();ctx.globalAlpha=alpha;
  ctx.font='bold 5.4px ui-monospace,monospace';ctx.textAlign='center';
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
  ctx.fillStyle='#e8eff0';ctx.font='bold 13px system-ui';ctx.fillText('DGG LIVE',50,24,94);
  ctx.fillStyle='#dfc4ff';ctx.font='bold 8px system-ui';ctx.fillText('MEET & GREET',50,37,89);
  ctx.fillStyle='#e8eff0';ctx.font='6px system-ui';ctx.fillText('CONVENTION CAM',50,46,89);
 }
 ctx.restore();
}
export function drawModularVenue(ctx,assets,event,t,streams={}){
 if(!modularVenueReady(assets))return false;
 ctx.save();
 draw(ctx,assets.hall,{x:-7,y:-4,w:398,h:224});
 drawContactShadow(ctx,MODULAR_PROPS.stage,.43);
 drawStageShell(ctx,assets.stage,MODULAR_PROPS.stage);
 // Back-wall fixtures share a common floor plane and render back-to-front.
 for(const name of ['vending','merch','food','photo']){
  drawContactShadow(ctx,MODULAR_PROPS[name],.22);
  draw(ctx,assets.booths,MODULAR_PROPS[name],MODULAR_ATLAS[name]);
 }
 draw(ctx,assets.ropes,MODULAR_PROPS.queueRopes);
 // One physically continuous entrance layer ensures the pillars never wander.
 draw(ctx,assets.entrance,MODULAR_PROPS.entrance);
 for(const side of ['left','right'])drawGate(ctx,event,side);
 drawBoothActivity(ctx,event);
 drawModularTV(ctx,event,t,streams);
 // The stage remains empty pending later dedicated furniture design.
 ctx.restore();
 return true;
}
export {FILES as MODULAR_VENUE_FILES};
