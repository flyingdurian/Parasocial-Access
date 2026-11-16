import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {DESTINY_LORE_BEATS,DESTINY_LORE_CARDS,DESTINY_LORE_GROUPS,loreAmbientLine,loreStageLine} from '../src/irl-lore-v084.js';
import {decisionBubbleStyle} from '../src/irl-atmosphere-v083.js';
import {walkCycleFrame,drawVenueCharacter,poseFrame,stageAction} from '../src/sprite-animation.js';
import {VENUE_STAGE,VENUE_STATIONS,isVenueWalkable,venueRoute,venueSegmentClear,moveVenue} from '../src/venue-nav.js';
import {IRLEvent,IRL_SCENARIOS} from '../src/irl-v07.js';

assert.equal(DESTINY_LORE_BEATS.length,74);
assert.deepEqual(DESTINY_LORE_GROUPS,{politics:14,media:12,emotes:16,community:12,venue:12,evidence:8});
assert.equal(new Set(DESTINY_LORE_BEATS.map(x=>x.id)).size,74);
assert.equal(DESTINY_LORE_CARDS.length,74);
for(const beat of DESTINY_LORE_BEATS){
 assert.ok(['welcome','redirect','check','security'].includes(beat.action));
 assert.ok(isVenueWalkable(...VENUE_STATIONS[beat.station]));
 assert.ok(IRL_SCENARIOS.some(s=>s[7]===beat.id));
}
assert.ok(loreAmbientLine('mic',11,3).length>8);
assert.notEqual(loreStageLine({category:'politics',debater:false},0),loreStageLine({category:'politics',debater:false},1));
assert.deepEqual(decisionBubbleStyle(0,true),{alpha:1,scale:1});
assert.ok(decisionBubbleStyle(0).alpha>decisionBubbleStyle(1).alpha);
assert.ok(decisionBubbleStyle(1).scale>decisionBubbleStyle(2).scale);
assert.notEqual(stageAction(1,3),stageAction(1,8));
assert.equal(poseFrame('talk',0,0),poseFrame('talk',900,0),'host pose should not flash into idle');
assert.deepEqual([0,3,6,9].map(walkCycleFrame),[0,1,2,3]);

for(const file of ['irl-cast-set-a-walk4.webp','irl-cast-set-b-walk4.webp','irl-cast-set-a-back4.webp','irl-cast-set-b-back4.webp','irl-cast-stage-a.webp','irl-cast-stage-b.webp'])assert.ok(existsSync(new URL('../assets/'+file,import.meta.url)));
const moves=[];const ctx={drawImage(...args){moves.push(args)},save(){},restore(){},translate(){},scale(){}};
const sheet={complete:true,naturalWidth:1536,naturalHeight:1024};
assert.equal(drawVenueCharacter(ctx,null,null,12,'walk',1,8,9,30,40,null,null,[sheet,sheet],{stepDistance:9,facing:-1}),true);
assert.equal(moves.length,1);
assert.equal(moves[0][2],3*256,'frame three must take row four of the 4-frame sheet');
const backSheet={complete:true,naturalWidth:1536,naturalHeight:1024,id:'rear'};
drawVenueCharacter(ctx,null,null,12,'walk',1,8,9,30,40,null,null,[sheet,sheet],{stepDistance:6,direction:'north'},[backSheet,backSheet]);
assert.equal(moves.at(-1)[0],backSheet,'walking north must use authored rear-view frames');
const stageSheet={complete:true,naturalWidth:1536,naturalHeight:1024};
for(const [kind,action,row] of [[4,'talk',1],[4,'cheer',2],[8,'point',3],[11,'argue',3]]){
 drawVenueCharacter(ctx,null,null,kind,action,5,8,9,30,40,null,null,null,null,null,[stageSheet,stageSheet]);
 assert.equal(moves.at(-1)[2],row*256,'on-stage '+action+' should use its own authored action row');
}

assert.ok(isVenueWalkable(...VENUE_STAGE.floor),'regular floor approach must be accessible');
assert.ok(!isVenueWalkable(...VENUE_STAGE.exchange),'stage platform must remain blocked for ordinary roaming');
for(const a of Object.values(VENUE_STATIONS))for(const b of Object.values(VENUE_STATIONS)){
 let current=a;
 for(const next of venueRoute(...a,...b)){assert.ok(venueSegmentClear(...current,...next));current=next;}
}
const turn={x:300,y:150,facing:1};moveVenue(turn,280,150,.1,25);
assert.equal(turn.facing,-1,'real route displacement must drive horizontal facing');
assert.ok(turn.walking&&turn.stepDistance>0);
const north={x:300,y:150};moveVenue(north,300,100,.1,25);assert.equal(north.direction,'north');

const make=()=>{const e=new IRLEvent({progress:{irlRecords:{},creators:{destiny:{xp:0}},credits:0},save(){}});e.begin();return e;};
const stage=make();
stage.add();stage.resolve(stage.selected,true,'welcome');
stage.add();stage.resolve(stage.selected,true,'welcome');
stage.next=stage.cards.length;
const visited=new Set(),exchangeSizes=[];let queueDuringExchange=false;
for(let i=0;i<1100&&stage.stageCompleted<2;i++){
 stage.tick(.1);
 const active=stage.departures.filter(g=>g.stageVisit==='exchange');
 exchangeSizes.push(active.length);
 if(active.length&&stage.departures.some(g=>g.stageVisit==='queued'))queueDuringExchange=true;
 for(const guest of stage.departures)if(guest.stageVisit)visited.add(guest.stageVisit);
 if(stage.stageCompleted<2)assert.equal(stage.mode,'playing','game must not finish while stage guests are pending');
}
assert.ok(queueDuringExchange,'second welcomed visitor queues during first exchange');
for(const state of ['approach','climbStairs','exchange','leaveStage','leaveStairs','queued','rejoin'])assert.ok(visited.has(state),'stage visitor traverses '+state);
assert.ok(exchangeSizes.every(n=>n<=1),'only one person may interact with Destiny at a time');
assert.equal(stage.stageCompleted,2);
for(let i=0;i<300&&stage.mode!=='results';i++)stage.tick(.1);
assert.equal(stage.mode,'results','stage queue must finish before victory');
assert.equal(stage.result.clear,true);

const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
assert.ok(ui.includes('g.speechTime>0&&ambientBubbles===0'),'ambient chatter must stay single-bubble and chaos-independent');
assert.ok(ui.includes('drawQueuedDecisionBubble(ctx,waiting[i].text'),'chaos only tiers pending decisions');
assert.ok(!ui.includes('stageSafeBubblePosition'),'stage activity may not re-anchor the selected guest textbox');
console.log('VENUE v0.8.4: PASS');
