/* Destiny event only. The six illustrated badges are original fan-art cues,
   not redistributed copies of proprietary streaming emote files. */
export const DGG_EMOTES=Object.freeze(['YEE','PEPE','dggL','OMEGALUL','NODDERS','PepoThink']);
export function dggEmoteFor(seed){return DGG_EMOTES[Math.abs(Math.trunc(seed))%DGG_EMOTES.length];}
export function drawDggEmote(ctx,image,name,x,y,size=18){
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
