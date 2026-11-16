import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {MODULAR_GATES,MODULAR_PROPS,MODULAR_BLOCKERS,MODULAR_TV_BOUNDS} from '../src/venue-geometry-v088b.js';
import {MODULAR_VENUE_FILES,modularVenueReady,modularStageMode,drawModularVenue,drawModularTV,drawBakedForegroundOccluders} from '../src/venue-rig-v088b.js';
import {stagePosition} from '../src/sprite-animation.js';
import {VENUE_GATES,VENUE_STAGE,VENUE_OBSTACLES,isVenueWalkable,venueRoute,venueQueueSpot,venueStageQueueSpot,venueStationApproachPoint} from '../src/venue-nav.js';

function paintContext(){
 const calls=[];let depth=0;
 return {calls,get depth(){return depth;},globalAlpha:1,
  save(){depth++},restore(){depth--;assert(depth>=0)},
  beginPath(){},rect(...a){calls.push(['clipRect',...a])},clip(){},
  fillRect(...a){calls.push(['fillRect',...a])},strokeRect(){},fill(){},stroke(){},
  ellipse(){},translate(){},scale(){},rotate(){},transform(){},moveTo(){},lineTo(){},
  drawImage(...a){calls.push(['drawImage',...a])},
  fillText(...a){calls.push(['text',...a])},
  measureText(s){return {width:String(s).length*3.2}},
  createLinearGradient(){return {addColorStop(){}}}
 };
}
const assets={plate:{complete:true,naturalWidth:1672,naturalHeight:941}};
test('one original unified WebP contains every static fixture',()=>{
 const files=Object.values(MODULAR_VENUE_FILES);
 assert.deepEqual(files,['irl-venue-baked-v088g.webp']);
 const url=new URL('../assets/'+files[0],import.meta.url);
 assert(existsSync(url),'single baked plate available');
 const header=readFileSync(url).subarray(0,12);
 assert.equal(header.toString('ascii',0,4),'RIFF');
 assert.equal(header.toString('ascii',8,12),'WEBP');
 assert(modularVenueReady(assets));
 assert.equal(modularStageMode(),'fixed');
});

test('booths and check-in use solid contact footprints, with sprite-scale entrance',()=>{
 assert.equal(VENUE_OBSTACLES,MODULAR_BLOCKERS);
 for(const name of ['merch','food','vending','photo','checkin']){
  const p=MODULAR_PROPS[name],hit=VENUE_OBSTACLES.find(o=>o.name===name);
  assert(hit&&p.solid, name+' blocker exists');
  assert(hit.x>=p.x&&hit.y>=p.y&&hit.x+hit.w<=p.x+p.w+2);
 }
 // A 30x38 actor is taller than the waist-height desk or waist-high scanners.
 assert(MODULAR_PROPS.checkin.h>=30&&MODULAR_PROPS.checkin.h<=41);
 assert(MODULAR_PROPS.entrance.h<55);
 assert(!isVenueWalkable(170,170,true),'check-in collision is solid');
 assert(!isVenueWalkable(47,162,true),'left planter collision is solid');
 assert(!isVenueWalkable(41,163,true),'left scanner collision is solid');
 assert(!isVenueWalkable(295,163,true),'right scanner collision is solid');
});

test('two wide scanner lanes are fixed, authorized and non-clipping',()=>{
 for(const side of ['left','right']){
  const gate=MODULAR_GATES[side],centerX=(gate.lane.left+gate.lane.right)/2;
  assert.equal(VENUE_GATES[side],gate);
  assert(gate.lane.right-gate.lane.left>=54,'gate opening remains >=54 world units');
  assert(!isVenueWalkable(centerX-16,165,false),'closed to guests without access');
  assert(isVenueWalkable(centerX-16,165,true),'sprite feet clear the lane');
  const path=venueRoute(...gate.spawn,...gate.inside,true);
  assert(Math.hypot(path.at(-1)[0]-gate.inside[0],path.at(-1)[1]-gate.inside[1])<9);
 }
 assert(!isVenueWalkable(149,165,true),'no entrance side bypass');
 const ctx=paintContext();
 const event={elapsed:2,gateControllers:{
  left:{openedAt:1.9,openUntil:4},right:{openedAt:1.9,openUntil:4}
 }};
 assert(drawModularVenue(ctx,assets,event,2,{}));
 assert.equal(ctx.depth,0);
 // The plate is rendered once. No stage, gate pillars, booth props or planters get shifted.
 assert.equal(ctx.calls.filter(c=>c[0]==='drawImage').length,1);
 const scene=ctx.calls.find(c=>c[0]==='drawImage');
 assert.deepEqual(scene.slice(2),[0,0,384,216]);
});

test('stage and queues remain navigable, with grounded on-plate geometry',()=>{
 assert(MODULAR_PROPS.stage.y+MODULAR_PROPS.stage.h<=102);
 assert(MODULAR_PROPS.merch.y+MODULAR_PROPS.merch.h<=108);
 assert(MODULAR_PROPS.food.y+MODULAR_PROPS.food.h<=108);
 assert(VENUE_STAGE.debate[0]<VENUE_STAGE.stairs[0]);
 assert(VENUE_STAGE.exchange[0]>VENUE_STAGE.stairs[0]);
 const queue=new Set();
 for(let i=0;i<18;i++){
  const [x,y]=venueQueueSpot(i);queue.add(x+','+y);
  assert(isVenueWalkable(x,y), 'queue spot '+i+' open');
 }
 assert.equal(queue.size,18);
 for(let i=0;i<12;i++){
  const [x,y]=venueStageQueueSpot(i);
  assert(x>=230&&x<=290&&y<150);
 }
 for(const name of ['merch','snacks','vending','photo']){
  assert(venueStationApproachPoint(name,6,2));
 }
});

test('TV/photo feed is clipped to one on-plate screen; no opaque card',()=>{
 assert(MODULAR_TV_BOUNDS.x>=MODULAR_PROPS.stage.x);
 const ctx=paintContext(),fakePortrait={naturalWidth:256,naturalHeight:256};
 const event={tvEvent:{ttl:2,type:'photo',guestKind:2}};
 drawModularTV(ctx,event,0,{host:fakePortrait,poses:[null,null,fakePortrait],cast:fakePortrait});
 assert.equal(ctx.depth,0);
 assert.equal(ctx.calls.filter(c=>c[0]==='drawImage').length,2,'exactly one host, one fan');
 assert(ctx.calls.some(c=>c[0]==='clipRect'&&c[1]===0&&c[2]===0&&c[3]===100&&c[4]===56));
 assert.equal(ctx.calls.filter(c=>c[0]==='fillRect'&&c[1]===0&&c[2]===0&&c[3]===100&&c[4]===56).length,1,'only the LCD base is full-size; no second opaque photo tile');
 const mask=paintContext();
 drawBakedForegroundOccluders(mask,assets);
 assert.equal(mask.depth,0);
 assert(mask.calls.filter(c=>c[0]==='drawImage').length>=5,'foreground uses source pixels rather than separate props');
});

test('Destiny keeps his pacing and debate pose left of the broadcast title',()=>{
 for(let t=0;t<180;t+=2.5){
  for(const action of ['idle','mic']){
   const pose=stagePosition(action,t,false);
   assert(pose.x>=200&&pose.x<=216&&pose.y>=40&&pose.y<=46);
  }
  assert.equal(stagePosition('talk',t,true).x,204);
 }
});
