import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {MODULAR_GATES,MODULAR_PROPS,MODULAR_BLOCKERS,MODULAR_TV_BOUNDS} from '../src/venue-geometry-v088b.js';
import {MODULAR_VENUE_FILES,modularVenueReady,modularStageMode,drawModularVenue,drawModularTV,drawBakedForegroundOccluders,drawTicketClerk} from '../src/venue-rig-v088b.js';
import {stagePosition} from '../src/sprite-animation.js';
import {VENUE_GATES,VENUE_STAGE,VENUE_OBSTACLES,isVenueWalkable,venueRoute,venueQueueSpot,venueStageQueueSpot,venueStationApproachPoint,VENUE_STAGE_SERPENTINE,VENUE_STAGE_QUEUE_LENGTH,venueStagePoint,moveVenueSerpentineQueue} from '../src/venue-nav.js';
import {IRLEvent} from '../src/irl-v07.js';
import {issueVenueTicket,hasVenueTicket,processVenueTicket} from '../src/venue-tickets-v088h.js';

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
  createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}
 };
}
const assets={plate:{complete:true,naturalWidth:1672,naturalHeight:941},clerk:{complete:true,naturalWidth:150,naturalHeight:190}};
test('new unified WebP and transparent staff stay modular under one perspective',()=>{
 const files=Object.values(MODULAR_VENUE_FILES);
 assert.deepEqual(files,['irl-venue-baked-v088h.webp','irl-ticket-clerk-v088h.webp']);
 for(const file of files){
  const url=new URL('../assets/'+file,import.meta.url);
  assert(existsSync(url),file+' available');
  const header=readFileSync(url).subarray(0,12);
  assert.equal(header.toString('ascii',0,4),'RIFF');
  assert.equal(header.toString('ascii',8,12),'WEBP');
 }
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
 assert(!isVenueWalkable(299,163,true),'right scanner collision is solid');
});

test('both gated lanes remain proportional and enforce physical admission',()=>{
 for(const side of ['left','right']){
  const gate=MODULAR_GATES[side],centerX=(gate.lane.left+gate.lane.right)/2;
  assert.equal(VENUE_GATES[side],gate);
  assert(gate.lane.right-gate.lane.left>=37&&gate.lane.right-gate.lane.left<=44,'visual opening remains close to full sprite plus clearance');
  assert(!isVenueWalkable(centerX-16,165,false),'closed to guests without access');
  assert(isVenueWalkable(centerX-16,165,true),'sprite feet clear the lane');
  const path=venueRoute(...gate.spawn,...gate.inside,true);
  assert(Math.hypot(path.at(-1)[0]-gate.inside[0],path.at(-1)[1]-gate.inside[1])<9);
 }
 assert(!isVenueWalkable(149,165,true),'no entrance side bypass');
 const ctx=paintContext();
 const event={elapsed:2,ticketClerk:{x:179,y:153,lastScanAt:1,processed:1},gateControllers:{
  left:{openedAt:1.9,openUntil:4},right:{openedAt:1.9,openUntil:4}
 }};
 assert(drawModularVenue(ctx,assets,event,2,{}));
 assert.equal(ctx.depth,0);
 // The unified environment plate is rendered once; the worker is intentionally
 // depth-sorted after crowd actors but before the counter's baked occlusion.
 assert.equal(ctx.calls.filter(c=>c[0]==='drawImage').length,1);
 const scene=ctx.calls.find(c=>c[0]==='drawImage');
 assert.deepEqual(scene.slice(2),[0,0,384,216]);
 drawTicketClerk(ctx,assets,event);
 assert.equal(ctx.calls.filter(c=>c[0]==='drawImage').length,2);
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
 assert(VENUE_STAGE_QUEUE_LENGTH>280);
 assert(VENUE_STAGE_SERPENTINE.length>=10);
 for(let i=0;i<12;i++){
  const [x,y]=venueStageQueueSpot(i);
  assert(x>=180&&x<=302&&y>=68&&y<=127);
 }
 const actor={x:VENUE_STAGE_SERPENTINE[0][0],y:VENUE_STAGE_SERPENTINE[0][1]};
 let maxProgress=0,turns=0,oldDirection=null;
 for(let i=0;i<400;i++){
  const done=moveVenueSerpentineQueue(actor,0,.1,23);
  if(actor.direction!==oldDirection&&oldDirection){turns++;}oldDirection=actor.direction;
  assert(actor.stageQueueProgress>=maxProgress);maxProgress=actor.stageQueueProgress;
  if(done)break;
 }
 assert(Math.hypot(actor.x-venueStagePoint(VENUE_STAGE_QUEUE_LENGTH)[0],actor.y-venueStagePoint(VENUE_STAGE_QUEUE_LENGTH)[1])<2);
 assert(turns>=4,'guest visibly switches directions at the rope ends');
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

test('ticket consumption happens exactly once, at inside crossing, not at ticket check',()=>{
 const guest={id:'test'},clerk={processed:0,lastScanAt:-1};
 issueVenueTicket(guest,42);
 assert.equal(guest.ticket.remaining,1);
 assert(hasVenueTicket(guest));
 assert(processVenueTicket(guest,clerk,1.4));
 assert.equal(guest.ticket.remaining,0);
 assert.equal(guest.gatePasses,1);
 assert.equal(clerk.processed,1);
 assert(!processVenueTicket(guest,clerk,2.1));
 assert.equal(clerk.processed,1);
 assert(!hasVenueTicket(guest));
});

test('scripted arrival, crowd arrivals, and permanent clerk share ticket economy',()=>{
 const engine={progress:{irlRecords:{destinyMeet:{attempts:0}}}};
 const event=new IRLEvent(engine,{mode:'standard',level:0});event.begin();event.nextArrival=999;
 event.add({throughGate:true});
 const guest=event.arrivals.at(-1);assert(guest.ticket?.remaining===1);
 event.addCrowdSet(1);const ambient=event.crowd.filter(g=>g.entryPhase);
 assert(ambient.length>=1&&ambient.every(g=>g.ticket?.remaining===1));
 assert.equal(event.ticketClerk.x,179);
 for(let i=0;i<400;i++){event.tick(.1);if(guest.entryPhase==='floor'&&ambient.every(g=>!g.entryPhase))break;}
 assert.equal(guest.ticket.remaining,0,'highlighted attendee entered through one gate');
 assert.equal(guest.gatePasses,1);
 assert(ambient.every(g=>g.ticket.remaining===0),'ambient guests were admitted');
 assert.equal(event.ticketClerk.processed,1+ambient.length);
 const count=event.ticketClerk.processed;
 for(let i=0;i<25;i++)event.tick(.1);
 assert.equal(event.ticketClerk.processed,count,'no double charge on subsequent ticks');
});

test('photo guests traverse the serpentine line and face a stage tripod snapshot',()=>{
 const engine={progress:{irlRecords:{destinyMeet:{attempts:0}}}};
 const event=new IRLEvent(engine,{mode:'standard',level:0});event.begin();event.nextArrival=999;event.clock=500;
 event.add({throughGate:false});
 const guest=event.visitors[0];event.resolve(guest,true,'welcome');
 const actor=event.departures.at(-1);actor.fanKind='photo';
 let sawQueue=false,sawTripodFlash=false,sawPhotoTv=false;
 for(let i=0;i<550;i++){
  event.tick(.1);
  sawQueue||=!!actor.stageQueueProgress;
  sawTripodFlash||=event.cameraFlashes.some(f=>Math.abs(f.x-(VENUE_STAGE.tripod[0]+14))<1);
  sawPhotoTv||=event.tvEvent?.type==='photo';
  if(event.stageCompleted>0)break;
 }
 assert(sawQueue,'stage-bound guest enters serpentines rather than a direct-line queue');
 assert(sawTripodFlash,'snapshot triggered by physical stage tripod');
 assert(sawPhotoTv,'dynamic TV receives the single-fan photo result');
 assert(event.stageCompleted>0,'stage line completes without deadlock');
});
