import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {VENUE_GATES,VENUE_STAGE,isVenueWalkable,venueRoamPoint,venueStageQueueSpot} from '../src/venue-nav.js';
import {decisionBubbleStyle} from '../src/irl-atmosphere-v083.js';

const engine=()=>({progress:{credits:0,irlRecords:{},creators:{destiny:{xp:0}}},save(){}});

test('v087 decision deck begins mixed and supports a distinct peaceful debate action',()=>{
 const e=new IRLEvent(engine());
 assert.equal(e.cards.length,20);
 assert.deepEqual(Object.fromEntries(['welcome','debate','redirect','check','security'].map(type=>[type,e.cards.filter(row=>row[0]===type).length])),
  {welcome:6,debate:3,redirect:5,check:4,security:2});
 assert(new Set(e.cards.slice(0,5).map(row=>row[0])).size>=4);
 const critic=e.cards.find(row=>row[0]==='debate');
 assert(critic&&/critic|debater|disagreement|policy nerd|philosophy student/i.test(critic[1]));
 e.begin();e.cards=[critic];e.next=0;e.add();
 assert(e.action('debate'));
 for(let i=0;i<100&&e.correct===0;i++)e.tick(.1);
 assert.equal(e.correct,1);
 assert(e.departures.some(guest=>guest.debater));
});

test('gates use open art, enforce privileged paths, and leave posts solid',()=>{
 assert(existsSync(new URL('../assets/irl-hall-open-v087.webp',import.meta.url)));
 for(const gate of Object.values(VENUE_GATES)){
  assert(!isVenueWalkable(...gate.spawn));
  assert(isVenueWalkable(...gate.spawn,true));
  assert(!isVenueWalkable(...gate.check));
  assert(isVenueWalkable(...gate.check,true));
 }
 assert(!isVenueWalkable(100,202,true)); // solid central kiosk
 assert(!isVenueWalkable(75,181,true)); // scanner hardware
});

test('stage queue aligns with central stairs and fan / debater stage positions differ',()=>{
 assert.deepEqual(venueStageQueueSpot(0),VENUE_STAGE.staging);
 assert(VENUE_STAGE.staging[1]+33<120);
 assert(VENUE_STAGE.debate[0]<VENUE_STAGE.stairs[0]);
 assert(VENUE_STAGE.exchange[0]>VENUE_STAGE.stairs[0]);
 for(let i=1;i<5;i++)assert(venueStageQueueSpot(i)[1]>venueStageQueueSpot(i-1)[1]);
 const e=new IRLEvent(engine());e.begin();e.add();const guest=e.selected;guest.type='welcome';e.resolve(guest,true,'welcome');e.next=e.cards.length;
 const visited=new Set();let screen=false;
 for(let i=0;i<700&&e.mode==='playing';i++){e.tick(.1);for(const d of e.departures)visited.add(d.stageVisit);screen ||= e.tvEvent?.type==='photo';}
 for(const stage of ['queued','approach','climbStairs','exchange','leaveStage','leaveStairs','rejoin'])assert(visited.has(stage),stage);
 assert(screen&&e.stageCompleted===1);
});

test('roaming covers reachable floor while excluding the closed fence',()=>{
 const points=Array.from({length:320},(_,i)=>venueRoamPoint(i*113+51));
 assert(points.every(([x,y])=>isVenueWalkable(x,y)));
 assert(Math.min(...points.map(p=>p[0]))<45&&Math.max(...points.map(p=>p[0]))>320);
 assert(points.every(([,y])=>y<150));
});

test('tiered decision prompts keep first three readable and full game offers optional 2x speed',()=>{
 for(let i=0;i<3;i++)assert(decisionBubbleStyle(i).alpha>=.8);
 assert(decisionBubbleStyle(3).alpha<decisionBubbleStyle(2).alpha);
 const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
 const harness=readFileSync(new URL('../src/irl-sandbox-v085.js',import.meta.url),'utf8');
 assert(ui.includes('data-action="debate"')&&harness.includes('data-action="debate"'));
 assert(ui.includes('irlSpeed=next')&&ui.includes("irl.tick(dt*irlSpeed)"));
 assert(ui.includes('1.5× Fast')&&ui.includes('2× Turbo'));
 assert(/irl-hall-open-v08[78]\.webp/.test(ui)&&/irl-hall-open-v08[78]\.webp/.test(harness));
});
