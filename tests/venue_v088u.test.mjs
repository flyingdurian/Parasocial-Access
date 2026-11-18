import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {captureLiveAudienceFrontFrame,drawPaintedGate,drawTicketClerk,isNearSideGateArrival} from '../src/venue-rig-v088b.js';

const engine=()=>({progress:{irlRecords:{destinyMeet:{attempts:0}}}});
function fakeContext(){
 const calls=[];
 return {calls,save(){},restore(){},beginPath(){},clip(){},rect(){},fillRect(...args){calls.push(['rect',...args]);},drawImage(...args){calls.push(['image',...args]);},fillText(){},translate(){},scale(){},createLinearGradient(){return {addColorStop(){}};}};
}

test('fixed grates sit behind all actors; near-side ticket arrivals pass in front of the original gate',()=>{
 const plate={naturalWidth:1672,naturalHeight:941},closed={elapsed:4,gateControllers:{left:{openedAt:-10,openUntil:-10}}};
 const back=fakeContext(),front=fakeContext();
 drawPaintedGate(back,plate,closed,'left',false);
 drawPaintedGate(front,plate,closed,'left',true);
 assert(back.calls.some(call=>call[0]==='rect'&&call[1]===70&&call[3]===15));
 assert(!front.calls.some(call=>call[0]==='rect'&&call[1]===70));
 assert(isNearSideGateArrival({entryPhase:'ticket',y:176},'arrival',38));
 assert(isNearSideGateArrival({entryPhase:'enter',y:225},'crowd',34));
 assert(!isNearSideGateArrival({entryPhase:'inside',y:161},'arrival',38));
 assert(!isNearSideGateArrival({entryPhase:null,y:176},'arrival',38));
 for(const path of ['src/ui.js','src/irl-sandbox-v085.js']){
  const content=readFileSync(path,'utf8');
  assert(content.indexOf('drawBakedForegroundOccluders(')<content.lastIndexOf('for(const actor of nearSideArrivals)paintActor(actor)'),`${path}: incoming sprites must draw after the barrier pass`);
 }
});

test('clerk respects source proportions and desk amenities occlude passersby',()=>{
 const ctx=fakeContext(),asset={naturalWidth:1774,naturalHeight:887,complete:true};
 drawTicketClerk(ctx,{clerk:asset,clerkWalk:asset},{elapsed:9,ticketClerk:{x:180,y:150,lastScanAt:-50,walking:false}});
 assert(ctx.calls.some(call=>call[0]==='image'&&call.at(-2)===19&&call.at(-1)===35));
 const src=readFileSync('src/venue-rig-v088b.js','utf8');
 assert(src.includes('[180.5,172.5,18,14.5]'),'monitor must have a separate topmost foreground mask');
 assert(src.includes('[216.5,174,7.5,12]'),'sanitizer must be independently masked');
});

test('all on-stage guests face Destiny, and photo/autograph TV cards persist for viewing',()=>{
 const src=readFileSync('src/irl-v07.js','utf8');
 assert(src.includes("g.facing=-1;g.direction='west'"));
 assert(src.includes('ttl:4.6,maxTtl:4.6'));
 const e=new IRLEvent(engine());e.begin();e.nextArrival=999;e.clock=500;
 e.cards=[['welcome','Fan','Sign my poster','Poster signing','signing']];e.next=0;e.add();
 const guest=e.visitors[0];guest.x=180;guest.y=120;
 assert(e.action('welcome'));
 for(let i=0;i<400&&e.departures[0]?.stageVisit!=='exchange';i++)e.tick(.1);
 assert.equal(e.departures[0]?.stageVisit,'exchange');
 assert.equal(e.departures[0]?.facing,-1);
});

test('live stage-front audience frame renders the actual watching crowd and shot timing is longer',()=>{
 const frame={width:176,height:78,getContext(){return fakeContext();}};
 const crowd=[{id:1,kind:36,x:215,y:118,debateWatching:true,debateArrived:true,animation:'cheer',walking:false}];
 const cast={naturalWidth:1536,naturalHeight:1024,complete:true};
 const front={...cast};
 const rendered=captureLiveAudienceFrontFrame(frame,{crowd},{cast,cosplay:{react:front}},3200);
 assert(rendered);
 const rig=readFileSync('src/venue-rig-v088b.js','utf8');
 assert(rig.includes('Math.floor(t/2700)'));
 assert(rig.includes('liveRivalFacingDestiny'));
 assert(rig.includes('audienceFrontFrame'));
 assert(rig.includes("'DEBATE STARTING SOON'"));
});
