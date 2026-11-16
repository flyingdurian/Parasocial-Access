/* Destiny event only. The six illustrated badges are original fan-art cues,
   not redistributed copies of proprietary streaming emote files. */
export const DGG_EMOTES=Object.freeze(['YEE','PEPE','dggL','OMEGALUL','NODDERS','PepoThink']);
export function dggEmoteFor(seed){return DGG_EMOTES[Math.abs(Math.trunc(seed))%DGG_EMOTES.length];}
export function drawDggEmote(ctx,image,name,x,y,size=18,mascot=null){
 if(name==='dggL'&&mascot?.complete&&mascot.naturalWidth){ctx.drawImage(mascot,x,y,size,size);return true;}
 const index=DGG_EMOTES.indexOf(name);
 if(index<0||!image?.complete||!image.naturalWidth)return false;
 const sw=image.naturalWidth/3,sh=image.naturalHeight/2;
 ctx.save();
 ctx.beginPath();ctx.arc(x+size/2,y+size/2,size/2,0,Math.PI*2);ctx.clip();
 ctx.fillStyle='#272942';ctx.fillRect(x,y,size,size);
 ctx.drawImage(image,(index%3)*sw,Math.floor(index/3)*sh,sw,sh,x,y,size,size);
 ctx.restore();
 ctx.strokeStyle='#fff1c2';ctx.lineWidth=1.15;ctx.beginPath();ctx.arc(x+size/2,y+size/2,size/2,0,Math.PI*2);ctx.stroke();
 return true;
}

// Render the literal chat token dggL as the supplied mascot, not plain letters.
export function measureInlineDggL(ctx,content,mascot,size=8){
 const parts=String(content??'').split(/(dggL)/g);
 return parts.reduce((width,part)=>width+(part==='dggL'&&mascot?.naturalWidth?size:ctx.measureText(part).width),0);
}
export function drawInlineDggL(ctx,content,x,y,mascot,size=8){
 let cursor=x;
 for(const part of String(content??'').split(/(dggL)/g)){
  if(part==='dggL'&&mascot?.naturalWidth){
   ctx.drawImage(mascot,cursor,y-size+1,size,size);cursor+=size;
  }else{ctx.fillText(part,cursor,y);cursor+=ctx.measureText(part).width;}
 }
 return cursor-x;
}
