import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {IRL_ENDLESS,endlessWaveGuests,endlessArrivalInterval,endlessLiveDecisions} from '../src/irl-progression-v085.js';
import {venueDebateAudienceSpot,isVenueWalkable} from '../src/venue-nav.js';
import {drawSecurityComic} from '../src/venue-effects-v086.js';

const engine=()=>({progress:{irlRecords:{destinyMeet:{attempts:0}},creators:{destiny:{xp:0}},credits:0},save(){}});

test('stage audience fills a broad U across both wings, not one concentrated clump',()=>{
 const spots=Array.from({length:36},(_,i)=>venueDebateAudienceSpot(i));
 assert.equal(new Set(spots.map(p=>p.join(','))).size,36);
 assert(spots.every(([x,y])=>isVenueWalkable(x,y)));
 assert(Math.min(...spots.map(p=>p[0]))<200,'left wing filled');
 assert(Math.max(...spots.map(p=>p[0]))>340,'right wing filled');
 assert(spots.some(([,y])=>y>128),'middle of the arena filled');
});

test('endless wave density scales but stays bounded and safety strikes are documented',()=>{
 assert.equal(endlessWaveGuests(1),9);
 assert(endlessWaveGuests(9)>=endlessWaveGuests(3)*2);
 assert(endlessWaveGuests(20)<=32);
 assert.equal(endlessLiveDecisions(1),4);
 assert(endlessLiveDecisions(9)>=8);
 assert(endlessLiveDecisions(99)<=IRL_ENDLESS.maxLiveDecisions);
 assert(endlessArrivalInterval(9)<endlessArrivalInterval(1));
 assert.equal(IRL_ENDLESS.safetyWarnings,3);
});

test('correct actions accrue arcade combos with a bonus every fifth call',()=>{
 const e=new IRLEvent(engine());e.begin();
 for(let i=0;i<5;i++){
  const g={id:'combo-'+i,serial:i,kind:1,type:'check',name:'Verifier',text:'Pass?',cue:'Ticket',x:166,y:126,station:'entrance'};
  e.visitors.push(g);e.resolve(g,true,'check');
 }
 assert.equal(e.combo,5);
 assert.equal(e.bestCombo,5);
 assert(e.score>600,'fifth correct decision awards bonus');
 e.resolve({id:'wrong',serial:44,kind:1,type:'welcome',name:'Guest',text:'',cue:'',x:166,y:126,station:'signing'},false,'check');
 assert.equal(e.combo,0,'wrong call breaks streak');
});

test('ticket clerk walks an independently simulated patrol with a new transparent sprite sheet',()=>{
 const e=new IRLEvent(engine());e.begin();e.clock=500;e.nextArrival=999;
 const start=e.ticketClerk.x;
 for(let i=0;i<230;i++)e.tick(.1);
 assert.notEqual(e.ticketClerk.x,start);
 assert(e.ticketClerk.x>=160&&e.ticketClerk.x<=215);
 assert(statSync('assets/irl-ticket-clerk-walk-v088q.webp').size>1000);
 const src=readFileSync('src/venue-rig-v088b.js','utf8');
 assert(src.includes("clerkWalk:'irl-ticket-clerk-walk-v088q.webp'"));
});

test('VERIFY pauses for an in-person investigation before resolving',()=>{
 const e=new IRLEvent(engine());e.begin();e.nextArrival=999;
 e.cards=[['check','Badge Holder','Please verify me','Volunteer list','help']];e.next=0;e.add();
 const g=e.visitors[0],staff=e.freeWorker('check');
 g.x=staff.x;g.y=staff.y;
 assert(e.action('check'));
 for(let i=0;i<12&&staff.task?.phase!=='engage';i++)e.tick(.1);
 assert.equal(staff.task?.phase,'engage');
 assert(e.visitors.includes(g),'visitor remains present while documents are checked');
 for(let i=0;i<14;i++)e.tick(.1);
 assert(e.finished.some(p=>p.id===g.id&&p.success),'completed only after inspection');
});

test('REDIRECT escorts a disruptive guest through a gate instead of returning them to the hall',()=>{
 const e=new IRLEvent(engine());e.begin();e.nextArrival=999;e.clock=500;
 e.cards=[['redirect','Aisle Blocker','I am blocking the line','Disruptive critic','help']];e.next=0;e.add();
 const g=e.visitors[0],worker=e.freeWorker('redirect');g.x=worker.x;g.y=worker.y;
 assert(e.action('redirect'));
 for(let i=0;i<250;i++)e.tick(.1);
 assert(e.finished.some(p=>p.id===g.id&&p.success));
 assert(!e.crowd.some(p=>p.id===1000+g.serial),'redirected guest is not rejoined as a happy attendee');
 assert(e.score>=140,'escort gets a meaningful arcade bonus');
});

test('SECURITY performs a staged confrontation only for an actual danger case',()=>{
 const e=new IRLEvent(engine());e.begin();e.nextArrival=999;e.clock=500;
 e.cards=[['security','Hazard','A genuine fictional threat','Credible risk','help']];e.next=0;e.add();
 const g=e.visitors[0],guard=e.freeWorker('security');g.x=guard.x;g.y=guard.y;
 assert(e.action('security'));
 let confronted=false;
 for(let i=0;i<280;i++){
  e.tick(.1);
  confronted ||=guard.task?.phase==='engage'&&guard.task?.remaining>0;
 }
 assert(confronted,'guard actually conducts a short staged intervention');
 assert(e.finished.some(p=>p.id===g.id&&p.success));
 assert(!e.crowd.some(p=>p.id===1000+g.serial),'credible danger is not invited back to mingle');
});

test('security comic scene is conditional on actual substantiated danger',()=>{
 const calls=[];
 const ctx={save(){},restore(){},translate(){},rotate(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){},fillText(text){calls.push(text);}};
 const guard={task:{phase:'engage',action:'security',guestId:'s1',remaining:1.2}};
 const guest={id:'s1',serial:1,x:160,y:120,type:'security'};
 drawSecurityComic(ctx,{guardPositions:[guard],visitors:[guest]},1000);
 assert(calls.some(text=>text==='BONK!'||text==='POW!'));
 calls.length=0;guest.type='welcome';drawSecurityComic(ctx,{guardPositions:[guard],visitors:[guest]},1000);
 assert.equal(calls.length,0);
});

test('live camera paints before user-only speech overlays on both routes',()=>{
 for(const file of ['src/ui.js','src/irl-sandbox-v085.js']){
  const src=readFileSync(file,'utf8');
  const capture=src.indexOf('captureLiveAudienceFrame(ctx,liveAudienceFrame');
  const crowdOverlay=src.indexOf('for(const g of '+(file.endsWith('ui.js')?'irl.crowd':'event.crowd')+')',capture);
  assert(capture>0&&crowdOverlay>capture,file+' draws bubbles after capture');
  assert(src.includes('drawSecurityComic'));
 }
 const ui=readFileSync('src/ui.js','utf8');
 assert(!ui.includes('irl-relaxed-hint'));
 assert(ui.includes('id="irl-combo"'));
 assert(!ui.includes('● LIVE EXCHANGE'));
 const combat=readFileSync('src/venue-effects-v086.js','utf8');
 assert(!combat.includes("ctx.fillText(verdict.won?'DEBATE WON'"));
});
