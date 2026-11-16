import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {selectDebateTopic,judgeStageDebate,stageDialogueBeat,fanInteractionKind,DESTINY_DEBATE_TOPICS} from '../src/irl-debates-v088.js';
import {VENUE_LED_SCREEN} from '../src/venue-effects-v086.js';
import {VENUE_STAGE,venueStageQueueSpot,isVenueWalkable,VENUE_GATES} from '../src/venue-nav.js';

const engine=()=>({progress:{credits:0,irlRecords:{},creators:{destiny:{xp:0}}},save(){}});
const inProject=path=>new URL('../'+path,import.meta.url);
const simulateStage=(row,action)=>{
 const event=new IRLEvent(engine());event.cards=[row];event.begin();event.add();
 const guest=event.selected;assert(guest);event.resolve(guest,true,action);
 let shown=false,flashed=false,spoke=false;
 for(let i=0;i<900&&event.mode==='playing';i++){
  event.tick(.1);
  shown ||= event.tvEvent?.type===(action==='debate'?'debate':fanInteractionKind(guest));
  flashed ||= event.cameraFlashes.length>0;
  spoke ||= event.departures.some(d=>stageDialogueBeat(d)?.text);
 }
 return {event,shown,flashed,spoke};
};

test('v0.8.8 hall uses a native illustrated LED and unpainted gates in both entry points',()=>{
 const hall=inProject('assets/irl-hall-open-v088.webp');
 assert(existsSync(hall));assert.equal(readFileSync(hall).toString('ascii',8,12),'WEBP');
 assert(VENUE_LED_SCREEN.x>=238&&VENUE_LED_SCREEN.x<=244);
 assert(VENUE_LED_SCREEN.y<=17&&VENUE_LED_SCREEN.w>=80&&VENUE_LED_SCREEN.h<=33);
 const ui=readFileSync(inProject('src/ui.js'),'utf8');
 const sandbox=readFileSync(inProject('src/irl-sandbox-v085.js'),'utf8');
 for(const code of [ui,sandbox]){
  assert(code.includes('irl-hall-open-v088.webp'));
  assert(code.includes('drawStageQueueGuides(')&&code.includes('drawStageConversation('));
  assert(code.includes('data-action="debate"'));
 }
 for(const gate of Object.values(VENUE_GATES)){
  assert(!isVenueWalkable(...gate.check));
  assert(isVenueWalkable(...gate.check,true));
 }
});

test('third six-person roster has idle, four-step walk, north walk and four reaction sheets',()=>{
 for(const suffix of ['', '-walk4','-back4','-react4']){
  const file=inProject('assets/irl-cast-set-c'+suffix+'.webp');
  assert(existsSync(file));assert.equal(readFileSync(file).toString('ascii',8,12),'WEBP');
 }
 const sprite=readFileSync(inProject('src/sprite-animation.js'),'utf8');
 assert(sprite.includes('kind<=29'));
 const e=new IRLEvent(engine());e.addCrowdSet(3);
 assert.deepEqual(e.crowd.slice(-6).map(actor=>actor.kind),[24,25,26,27,28,29]);
});

test('stage is centered at the stair opening with orderly, separate fan/debate sides',()=>{
 assert.deepEqual(venueStageQueueSpot(0),VENUE_STAGE.staging);
 for(let i=1;i<6;i++)assert(venueStageQueueSpot(i)[1]>venueStageQueueSpot(i-1)[1]);
 assert(VENUE_STAGE.debate[0]>VENUE_STAGE.stairs[0]);
 assert(VENUE_STAGE.exchange[0]>VENUE_STAGE.stairs[0]);
 const photo=simulateStage(['welcome','Snapshot Fan','Please take a picture!','A fan patiently requests a photograph.','Valid pass.'],'welcome');
 assert(photo.shown&&photo.flashed&&photo.spoke);
 assert.equal(photo.event.stageCompleted,1);
 const autograph=simulateStage(['welcome','Autograph Collector','Can you sign this fan print?','A harmless autograph request.','Valid pass.'],'welcome');
 assert(autograph.shown&&autograph.spoke);
 assert.equal(autograph.event.stageCompleted,1);
});

test('critics alternate fictional topical exchanges with deterministic performance-based outcomes',()=>{
 assert(DESTINY_DEBATE_TOPICS.length>=7);
 const critic={name:'Philosophy Critic',text:'Your first premise is false!',cue:'I object on metaethics.',serial:3};
 const topic=selectDebateTopic(critic,0);
 assert.equal(topic.id,'ethics');
 const speech={...critic,debater:true,stageVisit:'exchange',exchangeDuration:5.2,exchangeClock:5.2,debateTopic:topic};
 assert.equal(stageDialogueBeat(speech).speaker,'guest');
 speech.exchangeClock=3.5;assert.equal(stageDialogueBeat(speech).speaker,'destiny');
 speech.exchangeClock=1.8;assert.equal(stageDialogueBeat(speech).speaker,'guest');
 const good={vibe:94,correct:16,errors:0,lost:0,visitors:[],arrivals:[],levelIndex:0,run:0};
 const bad={...good,vibe:25,correct:0,errors:8,lost:4,levelIndex:2};
 assert.equal(judgeStageDebate(good,{...critic,debateTopic:topic}).won,true);
 assert.equal(judgeStageDebate(bad,{...critic,debateTopic:topic}).won,false);
 const run=simulateStage(['debate','Policy Debater','My chart says otherwise!','A polite critic asks for an open discussion.','No danger.'],'debate');
 assert(run.shown&&run.spoke&&run.event.debateHistory.length===1);
 assert.equal(run.event.stageCompleted,1);
});

test('fifth action gets a distinct bloodsports treatment without changing other world save keys',()=>{
 const css=readFileSync(inProject('src/style.css'),'utf8');
 const sandboxCss=readFileSync(inProject('src/irl-sandbox-v085.css'),'utf8');
 assert(css.includes('BLOODSPORTS CHALLENGE')&&css.includes('.irl-debate-row button:focus-visible'));
 assert(sandboxCss.includes('.harness-controls button.debate-key'));
 const src=readFileSync(inProject('src/engine.js'),'utf8');
 assert(src.includes("SAVE_KEY='feedfall:rush-hour:off-the-feed:v07'"));
});
