/* Original game-local illustrations; transparent silhouette emotes with no
   circular chat badges, independent of the walking dggL venue mascot. */
export const DGG_EMOTES=Object.freeze(['YEE','PEPE','dggL','OMEGALUL','NODDERS','PepoThink','DuckerZ','AngelThump','ShrimpleAs','COPIUM','Abathur']);
export function dggEmoteFor(seed){return DGG_EMOTES[Math.abs(Math.trunc(seed))%DGG_EMOTES.length];}
export function drawDggEmote(ctx,image,name,x,y,size=18,mascot=null){
 const index=DGG_EMOTES.indexOf(name);
 if(index<0)return false;
 if(!image?.complete||!image.naturalWidth){
  if(name==='dggL'&&mascot?.complete&&mascot.naturalWidth){ctx.drawImage(mascot,x,y,size,size);return true;}
  return false;
 }
 const sw=image.naturalWidth/4,sh=image.naturalHeight/3;
 ctx.drawImage(image,(index%4)*sw,Math.floor(index/4)*sh,sw,sh,x,y,size,size);
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
