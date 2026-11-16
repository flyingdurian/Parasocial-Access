/* Modular saturated indigo/magenta evening-convention renderer. No painted legacy props.
   Atlas crop boxes are independent sprites in one binary file per prop family. */
import {MODULAR_PROPS,MODULAR_GATES,MODULAR_TV_PROJECTION,MODULAR_ATLAS} from './venue-geometry-v088b.js';

const FILES=Object.freeze({
 hall:'irl-hall-vibrant-v088b.webp',
 stage:'irl-stage-shell-v088c.webp',
 gate:'irl-gate-atlas-v088c.webp',
 planters:'irl-entrance-planters-v088c.webp',
 ropes:'irl-stage-queue-ropes-v088c.webp',
 booths:'irl-booth-atlas-vibrant-v088b.webp',
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
function drawGate(ctx,atlas,event,side){
 const frame=MODULAR_GATES[side].art,open=openness(event,side);
 // Fixed scanner posts: state changes may retract glass, not translate hardware.
 draw(ctx,atlas,frame,MODULAR_ATLAS.gate.open);
 ctx.save();
 const flapWidth=Math.max(0,9*(1-open));
 ctx.fillStyle='rgba(177,218,242,.74)';
 if(flapWidth>.15){
  ctx.fillRect(frame.x+16,frame.y+12,flapWidth,10);
  ctx.fillRect(frame.x+34-flapWidth,frame.y+12,flapWidth,10);
  ctx.fillStyle='rgba(238,250,255,.83)';
  ctx.fillRect(frame.x+16+flapWidth-.7,frame.y+12,.7,10);
  ctx.fillRect(frame.x+34-flapWidth,frame.y+12,.7,10);
 }
 ctx.fillStyle=open>.35?'#8df4b1':'#ffdb9e';
 ctx.fillRect(frame.x+9,frame.y+11,2,2);
 ctx.fillRect(frame.x+40,frame.y+11,2,2);
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
function drawEntranceJoinery(ctx){
 ctx.save();
 // These four independent low wall panels stop at the two authorized gate lanes.
 for(const [x,right] of [[58,76],[119,140],[230,236],[279,321]]){
  const w=right-x;
  ctx.fillStyle='#30274e';ctx.fillRect(x,196,w,17);
  ctx.fillStyle='#715c86';ctx.fillRect(x,196,w,1.3);
  ctx.fillStyle='#f0ae6c';ctx.fillRect(x,197,w,1);
  ctx.fillStyle='#251f40';ctx.fillRect(x,211,w,2);
  ctx.fillStyle='rgba(169,137,196,.18)';ctx.fillRect(x+2,200,Math.max(0,w-4),7);
 }
 ctx.restore();
}
function drawBoothActivity(ctx,event,t){
 // Venue transactions get anchored icon particles, never raw floating debug labels.
 const points={merch:[57,92],snacks:[150,94],vending:[27,126],photo:[351,130]};
 const glyph={merch:'★',snacks:'♪',vending:'◆',photo:'✦'};
 for(const fx of event?.effects||[]){
  if(fx.kind!=='booth')continue;
  const point=points[fx.station];if(!point)continue;
  const age=1-Math.max(0,Math.min(1,fx.ttl/(fx.maxTtl||1.15)));
  const x=point[0]+Math.sin(age*8+(fx.seed||0))*.7,y=point[1]-5-age*9;
  ctx.save();ctx.globalAlpha=Math.min(1,fx.ttl*2);
  ctx.fillStyle='rgba(42,28,75,.8)';ctx.beginPath();ctx.arc(x,y,7.4,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=fx.station==='photo'?'#b3eafb':'#f3be73';ctx.lineWidth=1.1;ctx.stroke();
  ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='#fff0b5';ctx.fillText(glyph[fx.station],x,y+.3);
  for(let i=0;i<3;i++){
   const px=x+Math.cos(i*2.094+age*3)*(8+age*3),py=y+Math.sin(i*2.094+age*3)*5;
   ctx.fillStyle=i===0?'#ffde9a':'#b1dff4';ctx.fillRect(px,py,1.7,1.7);
  }
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
  const guest=streams.poses?.[feed.guestKind]||streams.cast;
  livePortrait(ctx,guest,45,12,31);
  ctx.globalAlpha=1;
  ctx.restore();
  ctx.fillStyle='#fff';ctx.font='bold 9px system-ui';ctx.fillText('PHOTO OP',79,21,32);
  ctx.fillStyle='#d1f6e1';ctx.font='bold 6px system-ui';ctx.fillText('DUO SNAP',79,31,35);
  ctx.save();ctx.translate(33,44);ctx.rotate(-.08);
  ctx.font='italic bold 7px cursive';ctx.fillStyle='#ffdb9c';ctx.fillText('Destiny ✦',0,0,48);ctx.restore();
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
 draw(ctx,assets.hall,{x:-7,y:-4,w:398,h:224});
 drawContactShadow(ctx,MODULAR_PROPS.stage,.43);
 drawStageShell(ctx,assets.stage,MODULAR_PROPS.stage);
 // Back-wall fixtures share a common floor plane and render back-to-front.
 for(const name of ['vending','merch','food','photo']){
  drawContactShadow(ctx,MODULAR_PROPS[name],.22);
  draw(ctx,assets.booths,MODULAR_PROPS[name],MODULAR_ATLAS[name]);
 }
 draw(ctx,assets.ropes,MODULAR_PROPS.queueRopes);
 drawEntranceJoinery(ctx);
 drawContactShadow(ctx,MODULAR_PROPS.checkin,.34);
 draw(ctx,assets.checkin,MODULAR_PROPS.checkin);
 for(const side of ['left','right'])drawGate(ctx,assets.gate,event,side);
 draw(ctx,assets.planters,{x:-5,y:141,w:89,h:75},MODULAR_ATLAS.planter.left);
 draw(ctx,assets.planters,{x:282,y:141,w:107,h:75},MODULAR_ATLAS.planter.right);
 drawBoothActivity(ctx,event,t);
 drawModularTV(ctx,event,t,streams);
 // The stage remains empty pending later dedicated furniture design.
 ctx.restore();
 return true;
}
export {FILES as MODULAR_VENUE_FILES};
