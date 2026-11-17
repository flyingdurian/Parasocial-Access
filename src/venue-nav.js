import {MODULAR_STAGE,MODULAR_GATES,MODULAR_BLOCKERS} from './venue-geometry-v088b.js';
/* Convention hall navigation, measured in 384 x 216 illustration coordinates.
   Positions are the top-left of a 27-34px character; obstacles are padded so
   feet and shadows do not cross stage faces, booth counters or turnstiles. */
export const VENUE_W=384;
export const VENUE_H=216;
export const VENUE_CELL=8;
export const VENUE_STATIONS=Object.freeze({
 entrance:[184,139],merch:[55,73],claw:[166,65],snacks:[133,73],photo:[321,83],
 signing:[248,107],line:[249,119],mic:[313,98],help:[184,116],
 quiet:[95,143],exit:[43,145]
});
// Central opening directly between the railings, below Destiny's stage steps.
// Sprite coordinates are TOP-LEFT; the visible floor contact is ~33px lower.
// The central front-of-line contact point is just below the painted stairs.
export const VENUE_STAGE=MODULAR_STAGE;
export const VENUE_GATES=MODULAR_GATES;
export const VENUE_OBSTACLES=MODULAR_BLOCKERS;
const C=VENUE_W/VENUE_CELL,R=Math.ceil(232/VENUE_CELL); // entrance paths extend just below the canvas
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function isVenueWalkable(x,y,gateAccess=false){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<8||x>358||y<51||y>228)return false;
 // Path anchors are sprite top-left, but obstruction contact happens at feet.
 // Testing top-left alone let characters appear to walk through the desk.
 const feetX=x+16,feetY=y+35;
 // Narrow-looking but physically clear 39–43px scanner lanes, matched to
 // the 30px character envelopes in the actual v0.8.8h baked plate.
 // Feet, not sprite top-lefts, must remain inside a clear authorized lane.
 if(feetY>=183){
  const inGate=(feetX>=86&&feetX<=123)||(feetX>=255&&feetX<=296);
  if(!gateAccess||!inGate)return false;
 }
 // The current plate has ONE short rope, represented by MODULAR_BLOCKERS.
 // Explicit post/planter solids in MODULAR_BLOCKERS cover the entire prop
 // footprint, including the image's top. No collision-only sliding gates.
 return !VENUE_OBSTACLES.some(o=>feetX>=o.x&&feetX<o.x+o.w&&feetY>=o.y&&feetY<o.y+o.h);
}
const center=([c,r])=>[c*VENUE_CELL+VENUE_CELL/2,r*VENUE_CELL+VENUE_CELL/2];
const key=(c,r)=>r*C+c;
const decode=k=>[k%C,Math.floor(k/C)];
const passCell=(c,r,gateAccess=false)=>c>=0&&c<C&&r>=0&&r<R&&isVenueWalkable(...center([c,r]),gateAccess);
export function venueSegmentClear(ax,ay,bx,by,gateAccess=false){
 const length=Math.hypot(bx-ax,by-ay),steps=Math.max(1,Math.ceil(length/2));
 for(let i=0;i<=steps;i++)if(!isVenueWalkable(ax+(bx-ax)*i/steps,ay+(by-ay)*i/steps,gateAccess))return false;
 return true;
}
export function snapVenue(x,y,gateAccess=false){
 if(isVenueWalkable(x,y,gateAccess))return [x,y];
 const cx=clamp(Math.floor(x/VENUE_CELL),0,C-1),cy=clamp(Math.floor(y/VENUE_CELL),0,R-1);
 let best=null,dist=Infinity;
 for(let r=0;r<R;r++)for(let c=0;c<C;c++){
  if(!passCell(c,r,gateAccess))continue;
  const [nx,ny]=center([c,r]),d=(nx-x)**2+(ny-y)**2;
  if(d<dist){best=[nx,ny];dist=d;}
 }
 return best||[cx*VENUE_CELL+4,cy*VENUE_CELL+4];
}
export function venueRoute(x,y,toX,toY,gateAccess=false){
 const [startX,startY]=snapVenue(x,y,gateAccess),[endX,endY]=snapVenue(toX,toY,gateAccess);
 // Coarse-grid cell centers can be blocked when an exact floor target is
 // walkable (notably at y146, just above the 183px gate crossing).
 const cellFor=(x,y)=>{
  const cx=Math.floor(x/VENUE_CELL),cy=Math.floor(y/VENUE_CELL);
  for(let radius=0;radius<=4;radius++){
   let best=null,dist=Infinity;
   for(let row=cy-radius;row<=cy+radius;row++)for(let col=cx-radius;col<=cx+radius;col++){
    if(!passCell(col,row,gateAccess))continue;
    const [px,py]=center([col,row]);
    if(!venueSegmentClear(x,y,px,py,gateAccess))continue;
    const d=(px-x)**2+(py-y)**2;
    if(d<dist){dist=d;best=key(col,row);}
   }
   if(best!==null)return best;
  }
  return key(Math.floor(x/VENUE_CELL),Math.floor(y/VENUE_CELL));
 };
 const from=cellFor(startX,startY),end=cellFor(endX,endY);
 if(from===end)return [[endX,endY]];
 const queue=[from],seen=new Int32Array(C*R).fill(-1);seen[from]=from;
 const directions=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
 let found=false;
 for(let head=0;head<queue.length&&!found;head++){
  const cur=queue[head],[col,row]=decode(cur);
  for(const [dx,dy] of directions){
   const nc=col+dx,nr=row+dy;
   if(!passCell(nc,nr,gateAccess)||(dx&&dy&&(!passCell(col+dx,row,gateAccess)||!passCell(col,row+dy,gateAccess))))continue;
   const next=key(nc,nr);if(seen[next]!==-1)continue;
   seen[next]=cur;if(next===end){found=true;break;}queue.push(next);
  }
 }
 if(!found)return [[startX,startY]];
 const cells=[end];for(let k=end;k!==from;){k=seen[k];cells.push(k);}
 cells.reverse();
 // Greedy line-of-sight smoothing keeps turns natural without cutting through
 // the stage, stairs or counters. Sample the whole segment, not only its ends.
 const waypoints=cells.slice(1).map(k=>center(decode(k)));
 waypoints.push([endX,endY]);
 const path=[];let last=[startX,startY],index=0;
 while(index<waypoints.length){
  let furthest=index;
  for(let j=waypoints.length-1;j>index;j--)if(venueSegmentClear(...last,...waypoints[j],gateAccess)){furthest=j;break;}
  path.push(waypoints[furthest]);last=waypoints[furthest];index=furthest+1;
 }
 return path;
}
export function moveVenue(actor,targetX,targetY,dt,speed=30){
 const oldX=actor.x,oldY=actor.y;
 const gateAccess=!!actor.gateAccess;
 const endpoint=snapVenue(targetX,targetY,gateAccess),destination=endpoint.map(v=>Math.round(v*2)/2).join(':')+':'+Number(gateAccess);
 if(actor.routeTo!==destination||!actor.route?.length){
  actor.route=venueRoute(actor.x,actor.y,...endpoint,gateAccess);
  actor.routeTo=destination;
  const last=actor.route.at(-1);
  actor.routeBlocked=!!last&&Math.hypot(last[0]-endpoint[0],last[1]-endpoint[1])>2;
 }
 let remaining=Math.max(0,dt)*speed;
 while(remaining>0&&actor.route.length){
  const [x,y]=actor.route[0],dx=x-actor.x,dy=y-actor.y,d=Math.hypot(dx,dy);
  if(d>remaining){actor.x+=dx/d*remaining;actor.y+=dy/d*remaining;remaining=0;}
  else{actor.x=x;actor.y=y;remaining-=d;actor.route.shift();}
 }
 const arrived=!actor.routeBlocked&&Math.hypot(actor.x-endpoint[0],actor.y-endpoint[1])<1.5;
 const dx=actor.x-oldX,dy=actor.y-oldY,moved=Math.hypot(dx,dy);
 actor.stepDistance=(actor.stepDistance||0)+moved;
 actor.turnTimer=Math.max(0,(actor.turnTimer||0)-dt);
 if(moved>0.001){
  actor.heading=Math.atan2(dy,dx);
  const direction=Math.abs(dy)>Math.abs(dx)*.8?(dy<0?'north':'south'):(dx<0?'west':'east');
  if(actor.direction&&actor.direction!==direction){actor.turnTimer=.1;actor.stepDistance=0;}
  actor.direction=direction;
  // Only reverse the horizontal-facing art on an actual lateral segment.
  // Destination-based facing was wrong whenever the route temporarily looped.
  if(Math.abs(dx)>Math.abs(dy)*.7&&Math.abs(dx)>0.2){
   const next=dx<0?-1:1;
   if(actor.facing!=null&&actor.facing!==next)actor.turnTimer=.12;
   actor.facing=next;
  }else if(direction==='north'||direction==='south')actor.facing=1;
 }
 actor.walking=!arrived&&moved>0.001;
 if(!actor.walking)actor.stepDistance=0;
 return arrived;
}
export function venueQueueSpot(index){
 // Ambient foot-traffic waits in a separate open side aisle, never directly
 // on top of the ticket counter or the dedicated stage serpentine ropes.
 const slot=((index%18)+18)%18,row=slot%6,col=Math.floor(slot/6);
 return [160+col*15,97+row*10];
}
// Straight approach with a short side-turn around the illustrated velvet rope.
// No phantom three-row serpentine barriers exist on the new unified plate.
export const VENUE_STAGE_SERPENTINE=Object.freeze([
 [183,125],[202,120],[221,115],[225,108],[232,106],[248,102],[253,82]
].map(point=>Object.freeze(point)));
const stageLengths=[0];for(let i=1;i<VENUE_STAGE_SERPENTINE.length;i++)stageLengths.push(stageLengths[i-1]+Math.hypot(VENUE_STAGE_SERPENTINE[i][0]-VENUE_STAGE_SERPENTINE[i-1][0],VENUE_STAGE_SERPENTINE[i][1]-VENUE_STAGE_SERPENTINE[i-1][1]));
export const VENUE_STAGE_QUEUE_LENGTH=stageLengths.at(-1);
export function venueStagePoint(distance){
 const d=clamp(distance,0,VENUE_STAGE_QUEUE_LENGTH);
 for(let i=1;i<stageLengths.length;i++)if(d<=stageLengths[i]){
  const t=(d-stageLengths[i-1])/(stageLengths[i]-stageLengths[i-1]);
  return [VENUE_STAGE_SERPENTINE[i-1][0]+t*(VENUE_STAGE_SERPENTINE[i][0]-VENUE_STAGE_SERPENTINE[i-1][0]),VENUE_STAGE_SERPENTINE[i-1][1]+t*(VENUE_STAGE_SERPENTINE[i][1]-VENUE_STAGE_SERPENTINE[i-1][1])];
 }
 return [...VENUE_STAGE_SERPENTINE.at(-1)];
}
export function venueStageQueueSpot(index){return venueStagePoint(VENUE_STAGE_QUEUE_LENGTH-clamp(index,0,14)*11);}
export function moveVenueSerpentineQueue(actor,index,dt,speed=23){
 const target=clamp(VENUE_STAGE_QUEUE_LENGTH-index*11,0,VENUE_STAGE_QUEUE_LENGTH);
 actor.stageQueueProgress=clamp(actor.stageQueueProgress??0,0,VENUE_STAGE_QUEUE_LENGTH);
 actor.stageQueueProgress=Math.min(target,actor.stageQueueProgress+Math.max(0,dt)*speed);
 const [x,y]=venueStagePoint(actor.stageQueueProgress);
 moveStageActor(actor,x,y,dt,Math.max(speed,48));
 return Math.abs(actor.stageQueueProgress-target)<.5&&Math.hypot(actor.x-x,actor.y-y)<1.5;
}
// Authorized stage guests follow a dedicated, visible corridor through the
// staircase. This path is never available to general-purpose roaming NPCs.
export function moveStageActor(actor,targetX,targetY,dt,speed=25){
 const oldX=actor.x,oldY=actor.y,dx=targetX-oldX,dy=targetY-oldY;
 const distance=Math.hypot(dx,dy),step=Math.min(distance,Math.max(0,dt)*speed);
 if(distance>0){actor.x+=dx/distance*step;actor.y+=dy/distance*step;}
 actor.stepDistance=(actor.stepDistance||0)+step;
 actor.walking=distance>1&&step>0;
 if(step>.01){
  actor.heading=Math.atan2(dy,dx);
  actor.direction=Math.abs(dy)>Math.abs(dx)*.8?(dy<0?'north':'south'):(dx<0?'west':'east');
  actor.facing=Math.abs(dx)>Math.abs(dy)*.7?(dx<0?-1:1):1;
 }
 if(!actor.walking)actor.stepDistance=0;
 return distance<=1.5;
}
// The full accessible connected floor is a roamable space. Build the reachable
// cell set once; don't perform a separate path search per idle NPC every tick.
let roamCells;
function connectedRoamCells(){
 if(roamCells)return roamCells;
 const [sx,sy]=snapVenue(100,160),start=key(Math.floor(sx/VENUE_CELL),Math.floor(sy/VENUE_CELL));
 const queue=[start],seen=new Set(queue),result=[];
 for(let i=0;i<queue.length;i++){
  const k=queue[i],[col,row]=decode(k),[x,y]=center([col,row]);
  if(y<180&&x>=17&&x<=349&&!(x>160&&x<312&&y>92&&y<162))result.push([x,y]);
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nc=col+dx,nr=row+dy,next=key(nc,nr);
   if(!seen.has(next)&&passCell(nc,nr)){seen.add(next);queue.push(next);}
  }
 }
 roamCells=result;
 return roamCells;
}
export function venueStationApproachPoint(name,id=0,visit=0){
 const station=VENUE_STATIONS[name];if(!station)return null;
 // Photo visitors stop immediately beside the booth entrance before stepping inside.
 if(name==='photo')return snapVenue(330+(id%2)*3,64+(visit%3)*2);
 if(!['merch','claw','snacks','photo','entrance','help','quiet','mic'].includes(name))return station;
 const offsets=[[0,0],[-13,0],[13,0],[-23,6],[23,6],[-8,10],[8,10]];
 const idx=Math.abs((id*13+visit*17)|0)%offsets.length;
 for(let i=0;i<offsets.length;i++){
  const [dx,dy]=offsets[(idx+i)%offsets.length];
  if(isVenueWalkable(station[0]+dx,station[1]+dy))return [station[0]+dx,station[1]+dy];
 }
 return station;
}
// Semi-elliptical concert pit DIRECTLY beneath the visible stage. Coordinates
// are sprite top-left; their feet are +35px lower. The shorter back row is
// adjacent to the riser and the wider front rows spread toward the audience.
// Avoid the left-side stalls, the photo booth and the entrance turnstiles.
const DEBATE_AUDIENCE_SPOTS=Object.freeze([
 [221,82],[238,82],[255,82],[272,82],[289,82],[306,82],
 [211,96],[227,96],[243,96],[259,96],[275,96],[291,96],[307,96],[323,96],
 [201,112],[217,112],[233,112],[249,112],[265,112],[281,112],[297,112],[313,112],[329,112],
 [191,129],[208,129],[225,129],[242,129],[259,129],[276,129],[293,129],[310,129],[327,129],[344,129]
]);
export function venueDebateAudienceSpot(index){
 const point=DEBATE_AUDIENCE_SPOTS[((index%DEBATE_AUDIENCE_SPOTS.length)+DEBATE_AUDIENCE_SPOTS.length)%DEBATE_AUDIENCE_SPOTS.length];
 return isVenueWalkable(...point)?[...point]:snapVenue(...point);
}
export function venueRoamPoint(seed){
 const cells=connectedRoamCells();if(!cells.length)return [109,155];
 let n=(Number(seed)||0)>>>0;
 n=Math.imul(n^(n>>>16),0x85ebca6b)>>>0;
 n=Math.imul(n^(n>>>13),0xc2b2ae35)>>>0;
 return cells[((n^(n>>>16))>>>0)%cells.length];
}
