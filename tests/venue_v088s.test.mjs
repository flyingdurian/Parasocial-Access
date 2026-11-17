import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {DGG_EMOTES,drawDggEmote} from '../src/dgg-emotes-v085.js';
import {drawPaintedGate,MODULAR_VENUE_FILES} from '../src/venue-rig-v088b.js';
import {drawVenueFeedback} from '../src/venue-effects-v086.js';

const newEvent=()=>{const event=new IRLEvent({progress:{irlRecords:{destinyMeet:{attempts:0}}}});event.begin();event.nextArrival=1e5;return event;};

test('consecutive debates preserve original crowd activities rather than invalid return destinations',()=>{
 const event=newEvent(),person=event.crowd[0];
 person.entryPhase=null;person.target='merch';person.station='entrance';person.dwell=0;
 const debater={debater:true,stageVisit:'exchange',exchangeClock:5,kind:2};
 event.departures=[debater];event.crowdTick(.1);
 assert(person.debateWatching);assert.equal(person.beforeDebate.target,'merch');
 person.x=265;person.y=101;
 event.departures=[];event.crowdTick(.1);
 assert.equal(person.target,'return');assert(person.returnFromDebate);
 event.departures=[debater];event.crowdTick(.1);
 assert(person.debateWatching);assert.equal(person.beforeDebate.target,'merch');
 event.departures=[];
 for(let i=0;i<400;i++){event.crowdTick(.1);if(!person.returnFromDebate)break;}
 assert(!person.returnFromDebate,'returns to original activity');
 assert.notEqual(person.target,'return');assert.notEqual(person.target,'debate');
});

test('stale or corrupted crowd targets never throw during ordinary movement',()=>{
 const event=newEvent(),person=event.crowd[0];
 person.entryPhase=null;person.dwell=0;person.target='return';person.station='entrance';person.returnFromDebate=null;person.roamTo=null;
 assert.doesNotThrow(()=>event.crowdTick(.1));
 assert.equal(person.target,'roam');assert(Array.isArray(person.roamTo));
 person.target='roam';person.roamTo=undefined;person.dwell=0;
 assert.doesNotThrow(()=>event.crowdTick(.1));
 assert(Array.isArray(person.roamTo));
});

test('eleven transparent emote atlas positions with no circle mask or border',()=>{
 assert.equal(DGG_EMOTES.length,11);
 assert(DGG_EMOTES.includes('dggL'));
 const calls=[],ctx={drawImage:(...args)=>calls.push(['image',...args]),arc:()=>calls.push(['circle']),stroke:()=>calls.push(['border']),fillRect:()=>calls.push(['rect'])};
 const image={complete:true,naturalWidth:1448,naturalHeight:1086};
 assert(drawDggEmote(ctx,image,'Abathur',17,24,14));
 assert.deepEqual(calls,[['image',image,724,724,362,362,17,24,14,14]]);
 for(const file of ['irl-dgg-emotes11-v088s.webp','irl-dggl-emote-v088s.webp','irl-ticket-clerk-walk-v088s.webp']){
  const path=new URL('../assets/'+file,import.meta.url);
  assert(existsSync(path));assert.equal(readFileSync(path).toString('ascii',8,12),'WEBP');
 }
 assert.equal(MODULAR_VENUE_FILES.clerkWalk,'irl-ticket-clerk-walk-v088s.webp');
});

test('animated gate uses only existing painted plate fragments and zero independent door panels',()=>{
 const calls=[],plate={naturalWidth:1672,naturalHeight:941},ctx={
  save(){},restore(){},beginPath(){},rect(){},clip(){},drawImage:(...args)=>calls.push(['image',...args]),fillRect:(...args)=>calls.push(['rect',...args])
 };
 const closed={elapsed:6,gateControllers:{left:{openedAt:-10,openUntil:-10},right:{openedAt:-10,openUntil:-10}}};
 const open={elapsed:6,gateControllers:{left:{openedAt:5,openUntil:7},right:{openedAt:5,openUntil:7}}};
 drawPaintedGate(ctx,plate,closed,'left');
 assert.equal(calls.filter(c=>c[0]==='image').length,3);
 assert(calls.every(c=>c[0]==='image'&&c[1]===plate));
 calls.length=0;drawPaintedGate(ctx,plate,open,'left');
 assert.equal(calls.filter(c=>c[0]==='image').length,1,'fully open painted rail is concealed, leaving only the carpet restoration');
});

test('stale debate feedback cannot render floating teal rectangles over the stage after victory',()=>{
 const labels=[],ctx={save(){},restore(){},fillRect(){},fillText:s=>labels.push(s),measureText:s=>({width:s.length*3})};
 drawVenueFeedback(ctx,[{x:267,y:49,text:'STAGE SECURE',ttl:1},{x:75,y:130,text:'CHECKED',ttl:1}],null,{departures:[]});
 assert.deepEqual(labels,['CHECKED']);
});
