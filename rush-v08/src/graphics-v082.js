export const GRAPHICS_KEY='feedfall:rush-hour:graphics:v082';
const defaults=Object.freeze({mode:'bilinear',pixelStrength:35,showNav:false,texture:'off',textureStrength:25,chaos:false,crt:false,chatterMuted:false});
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function normalizeGraphics(value={}){
 return {
  mode:value.mode==='nearest'?'nearest':'bilinear',
  pixelStrength:clamp(Number.isFinite(+value.pixelStrength)?Number(value.pixelStrength):35,0,100),
  showNav:!!value.showNav,
  texture:['off','dither','chromatic'].includes(value.texture)?value.texture:'off',
  textureStrength:clamp(Number.isFinite(+value.textureStrength)?Number(value.textureStrength):25,0,100),
  chaos:!!value.chaos,
  crt:!!value.crt,
  chatterMuted:!!value.chatterMuted
 };
}
export function applyVenueTexture(ctx,canvas,settings,time){
 const {texture,textureStrength}=normalizeGraphics(settings);
 if(texture==='off'||textureStrength===0)return;
 ctx.save();
 if(texture==='chromatic'){
  // Very faint RGB-edge bloom; low-opacity image shifts, no expensive pixel readback.
  ctx.globalCompositeOperation='screen';ctx.filter='hue-rotate(148deg) saturate(180%)';
  ctx.globalAlpha=textureStrength*.0014;ctx.drawImage(canvas,1.1,0,384,216);
  ctx.filter='hue-rotate(310deg) saturate(160%)';ctx.drawImage(canvas,-1.1,0,384,216);
 }else{
  // Stable screen-space noise; deterministic positions avoid random-frame flicker.
  const count=Math.round(35+textureStrength*1.8);ctx.globalAlpha=.06+textureStrength*.0012;
  for(let i=0;i<count;i++){
   const x=(i*173+Math.floor(time/1200)*3)%384,y=(i*97+i*i*13)%216;
   ctx.fillStyle=i%3?'#21102e':'#ffdfa7';ctx.fillRect(x,y,1,1);
  }
 }
 ctx.restore();
}
// Reusable curved CRT lens. Canvas input is copied before resampling so source
// and destination never alias; barrel curvature is intentionally restrained.
const crtBuffers=new WeakMap();
export function applyVenueCRT(ctx,canvas,settings){
 if(!normalizeGraphics(settings).crt)return;
 let buffer=crtBuffers.get(canvas);
 if(!buffer){buffer=document.createElement('canvas');crtBuffers.set(canvas,buffer);}
 if(buffer.width!==canvas.width)buffer.width=canvas.width;
 if(buffer.height!==canvas.height)buffer.height=canvas.height;
 const source=buffer.getContext('2d');source.drawImage(canvas,0,0);
 ctx.save();ctx.setTransform(1,0,0,1,0,0);
 const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
 const step=Math.max(2,Math.round(h/60));
 for(let y=0;y<h;y+=step){
  const v=Math.abs((y+step/2)/h*2-1),inset=w*(.006+.026*v*v);
  ctx.drawImage(buffer,0,y,w,Math.min(step,h-y),inset,y,w-2*inset,Math.min(step+1,h-y));
 }
 const vignette=ctx.createRadialGradient(w/2,h/2,w*.17,w/2,h/2,w*.65);
 vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(3,1,20,.43)');
 ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
 ctx.fillStyle='rgba(0,0,0,.045)';for(let y=0;y<h;y+=Math.max(4,Math.round(h/145)))ctx.fillRect(0,y,w,1);
 ctx.restore();
}
export function loadGraphics(storage=globalThis.localStorage){
 try{return normalizeGraphics(JSON.parse(storage?.getItem(GRAPHICS_KEY)||'{}'));}
 catch{return {...defaults};}
}
export function saveGraphics(settings,storage=globalThis.localStorage){
 const safe=normalizeGraphics(settings);
 try{storage?.setItem(GRAPHICS_KEY,JSON.stringify(safe));}catch{}
 return safe;
}
export function graphicsCanvasScale(settings){
 // Old deployment used 384x216 (1x) and pixelated CSS scaling. By default
 // v0.8.2 keeps ~2.6x of the source image detail while HUD text stays native.
 return 1+(100-normalizeGraphics(settings).pixelStrength)*.025;
}
export function setupGraphicsCanvas(canvas,settings){
 const safe=normalizeGraphics(settings),scale=graphicsCanvasScale(safe);
 const width=Math.round(384*scale),height=Math.round(216*scale);
 if(canvas.width!==width)canvas.width=width;
 if(canvas.height!==height)canvas.height=height;
 canvas.style.imageRendering=safe.mode==='nearest'?'pixelated':'auto';
 const ctx=canvas.getContext('2d');
 if(!ctx)return null;
 ctx.setTransform(canvas.width/384,0,0,canvas.height/216,0,0);
 ctx.imageSmoothingEnabled=safe.mode!=='nearest';
 if(ctx.imageSmoothingEnabled)ctx.imageSmoothingQuality='high';
 return ctx;
}
