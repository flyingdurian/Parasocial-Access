import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {VENUE_GATES,VENUE_STAGE,isVenueWalkable,venueRoute,venueSegmentClear,venueRoamPoint,venueStageQueueSpot,moveVenue} from '../src/venue-nav.js';
import {VENUE_STRIDE,walkCycleFrame,venueSpriteGeometry,stageAction,drawVenueCharacter} from '../src/sprite-animation.js';
import {decisionBubbleStyle,bubbleTier} from '../src/irl-atmosphere-v083.js';
import {IRL_LEVELS,endlessWaveGuests,endlessArrivalInterval} from '../src/irl-progression-v085.js';

const engine=()=>({progress:{credits:0,creators:{destiny:{xp:0}},irlRecords:{}},save(){this.saves=(this.saves||0)+1;}});
test('isolation route avoids global world or main UI imports',()=>{
 const code=readFileSync(new URL('../src/irl-sandbox-v085.js',import.meta.url),'utf8');
 assert.doesNotMatch(code,/from ['"]\.\/engine\.js['"]|from ['"]\.\/ui\.js['"]/);
 assert.match(code,/new IRLEvent\(engine/);
});
test('gate traversal is offscreen, follows gate channels, preserves solid posts',()=>{
 for(const gate of Object.values(VENUE_GATES)){
  assert(gate.spawn[1]>216);
  for(const anchor of [gate.spawn,gate.check,gate.inside])assert(isVenueWalkable(...anchor,true),anchor.toString());
  assert(!isVenueWalkable(...gate.check),'Unapproved traffic cannot use a gate');
  const route=venueRoute(...gate.spawn,...gate.inside,true);
  assert(route.length>0);
  let from=gate.spawn;
  for(const point of route){assert(venueSegmentClear(...from,...point,true));from=point;}
 }
 assert(!isVenueWalkable(142,202));
 assert(!isVenueWalkable(90,202));
});
test('stage stairs are restricted to authorized guests; the line begins at the landing',()=>{
 assert(isVenueWalkable(...VENUE_STAGE.floor));
 assert(VENUE_STAGE.staging[1]+33<120,'Line head must be next to the painted stair landing');
 assert(VENUE_STAGE.debate[0]<VENUE_STAGE.stairs[0]&&VENUE_STAGE.exchange[0]>VENUE_STAGE.stairs[0]);
 for(let i=1;i<4;i++)assert(venueStageQueueSpot(i)[1]>venueStageQueueSpot(i-1)[1]);
});
test('floor roaming samples disperse beyond original hotspots',()=>{
 const points=Array.from({length:110},(_,i)=>venueRoamPoint(i*47813+71));
 assert(points.every(point=>isVenueWalkable(...point)));
 assert(new Set(points.map(p=>Math.floor(p[0]/40)+':'+Math.floor(p[1]/20))).size>=12);
});
test('walk cadence, bob and scaling are foot anchored and capped',()=>{
 assert.equal(walkCycleFrame(0),0);assert.equal(walkCycleFrame(VENUE_STRIDE),1);assert.equal(walkCycleFrame(2*VENUE_STRIDE),2);
 const far=venueSpriteGeometry(60,70,32,40,{walking:false,stepDistance:0});
 const near=venueSpriteGeometry(60,170,32,40,{walking:false,stepDistance:0});
 assert(near.scale>far.scale);
 assert(far.scale>=.84&&near.scale<=1.14);
 assert.equal(far.y+far.h,far.footY);
 assert.equal(near.y+near.h,near.footY);
 const walking=venueSpriteGeometry(60,170,32,40,{walking:true,stepDistance:VENUE_STRIDE});
 assert(walking.bob>0&&walking.bob<2);
 assert.equal(walking.footY,near.footY);
});
test('all decision tiers differ; primary is 100% and ambient separate',()=>{
 assert.equal(decisionBubbleStyle(0,true).alpha,1);
 assert.equal(bubbleTier(0,true),1);
 const levels=[0,1,2,3].map(index=>decisionBubbleStyle(index));
 for(let i=1;i<levels.length;i++){assert(levels[i].scale<levels[i-1].scale);assert(levels[i].alpha<levels[i-1].alpha);}
 const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
 assert(!ui.includes('stageSafeBubblePosition'));
 assert.match(ui,/drawQueuedDecisionBubble\(ctx,waiting\[i\]\.text,waiting\[i\]\.x/);
 assert.match(ui,/drawAmbientBubble\(ctx,visible,g\.x\+13,g\.y,\.86\)/);
});
test('entry check stops the actor in ticket pose before decision promotion',()=>{
 const e=new IRLEvent(engine());e.begin();e.add({throughGate:true});
 assert.equal(e.arrivals.length,1);assert.equal(e.visitors.length,0);
 const guest=e.arrivals[0];assert(guest.y>216);
 let sawTicket=false,visible=false;
 for(let i=0;i<420;i++){
  e.tick(.1);if(guest.entryPhase==='ticket'){sawTicket=true;assert.equal(guest.animation,'point');}
  if(e.visitors.includes(guest)){visible=true;break;}
 }
 assert(sawTicket&&visible);
 assert.equal(guest.entryPhase,null);
});
test('welcomed guests form a single file queue and take turns at stage',()=>{
 const e=new IRLEvent(engine());e.begin();
 for(let i=0;i<3;i++){e.add();const g=e.visitors.at(-1);g.type='welcome';e.resolve(g,true,'welcome');}
 assert.equal(e.departures.length,3);
 let sawExchange=false;
 for(let i=0;i<450;i++){e.tick(.1);if(e.departures.some(g=>g.stageVisit==='exchange'))sawExchange=true;}
 assert(sawExchange);
 assert(e.stageCompleted>0);
});
test('three levels ramp and endless waves have survival records',()=>{
 assert.deepEqual(IRL_LEVELS.map(l=>l.guests),[20,26,32]);
 const e=new IRLEvent(engine(),{mode:'endless'});e.begin();
 assert.equal(e.wave,1);assert.equal(e.cards.length,endlessWaveGuests(1));
 assert(endlessArrivalInterval(3)<endlessArrivalInterval(1));
 const old=e.cards.length;e.startNextWave();assert.equal(e.wave,2);assert.equal(e.cards.length,old+endlessWaveGuests(2));
 e.score=940;e.end(false);
 assert.equal(e.engine.progress.irlRecords.destinyMeet.endless.highScore,940);
 assert.equal(e.engine.progress.irlRecords.destinyMeet.endless.highestWave,2);
});
test('all six members of all three expansion sets have authored reaction atlases',()=>{
 const file=readFileSync(new URL('../src/sprite-animation.js',import.meta.url),'utf8');
 assert.match(file,/kind>=12&&kind<=29/);
 assert.match(file,/reactionAtlases\?\.\[sheetIndex\]/);
 const shell=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
 assert(shell.includes('irl-cast-set-a-react4.webp')&&shell.includes('irl-cast-set-b-react4.webp')&&shell.includes('irl-cast-set-c-react4.webp'));
});
test('original 12 characters also use complete 4-frame front and back sheets',()=>{
 for(const file of ['irl-cast-original-a-walk4.webp','irl-cast-original-b-walk4.webp','irl-cast-original-a-back4.webp','irl-cast-original-b-back4.webp'])assert(existsSync(new URL('../assets/'+file,import.meta.url)));
 const front={complete:true,naturalWidth:1536,naturalHeight:1024,id:'front'},back={...front,id:'back'},paints=[];
 const ctx={save(){},restore(){},translate(){},scale(){},drawImage(...args){paints.push(args);}};
 drawVenueCharacter(ctx,null,null,7,'walk',1,8,9,30,40,null,null,null,{walking:true,stepDistance:VENUE_STRIDE*2,turnTimer:0,direction:'south'},null,null,null,[front,front],[back,back]);
 assert.equal(paints.at(-1)[0],front);assert.equal(paints.at(-1)[2],2*256);
 drawVenueCharacter(ctx,null,null,7,'walk',1,8,9,30,40,null,null,null,{walking:true,stepDistance:VENUE_STRIDE*3,turnTimer:0,direction:'north'},null,null,null,[front,front],[back,back]);
 assert.equal(paints.at(-1)[0],back);assert.equal(paints.at(-1)[2],3*256);
});
test('Destiny lore archive stays inside Destiny venue code, not other creators',()=>{
 const irl=readFileSync(new URL('../src/irl-v07.js',import.meta.url),'utf8');
 const engineSource=readFileSync(new URL('../src/engine.js',import.meta.url),'utf8');
 assert.match(irl,/DESTINY_LORE_CARDS/);
 assert(!engineSource.includes('DESTINY_LORE_CARDS'));
 assert.equal(stageAction(2,6,0,'talk'),'talk');
});
