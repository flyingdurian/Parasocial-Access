import test from 'node:test';
import assert from 'node:assert/strict';
import {IRLEvent} from '../src/irl-v07.js';
import {DEBATE_CHAT_LINES,debateExchangeDuration} from '../src/irl-debates-v088.js';
import {drawModularVenue} from '../src/venue-rig-v088b.js';
import {MODULAR_PROPS,MODULAR_GATES} from '../src/venue-geometry-v088b.js';
import {sound} from '../src/audio.js';

function fakeCtx(){
 const calls=[];
 return {calls,globalAlpha:1,
  save(){calls.push(['save']);},restore(){calls.push(['restore']);},
  beginPath(){},rect(...x){calls.push(['rect',...x]);},clip(){},
  fillRect(...x){calls.push(['fillRect',...x]);},strokeRect(){},stroke(){},fill(){},
  ellipse(){},translate(){},scale(){},rotate(){},transform(){},moveTo(){},lineTo(){},
  drawImage(...x){calls.push(['drawImage',...x]);},fillText(){},
  measureText(s){return {width:s.length*3}},
  createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}
 };
}
const assets={plate:{complete:true,naturalWidth:1672,naturalHeight:941},clerk:{complete:true,naturalWidth:150,naturalHeight:190}};

test('v088k cabinet animation is glass-clipped and never paints a second fixture',()=>{
 const prop=MODULAR_PROPS.claw;
 const event={elapsed:5,clawMachine:{activeUntil:6.5},effects:[],gateControllers:{},departures:[]};
 const ctx=fakeCtx();
 assert(drawModularVenue(ctx,assets,event,5000,{}));
 assert(ctx.calls.some(c=>c[0]==='rect'&&c[1]===prop.x+2&&c[2]===prop.y+9&&c[3]===prop.w-4));
 assert.equal(ctx.calls.filter(c=>c[0]==='drawImage').length,1,'one baked background only');
 for(const gate of Object.values(MODULAR_GATES))
  assert(gate.lane.right-gate.lane.left>=39&&gate.lane.right-gate.lane.left<=43);
});

test('v088k boss scene generates energy layers and sparks during live debate',()=>{
 const ctx=fakeCtx();
 const event={elapsed:7,hostX:204,hostY:44,departures:[{debater:true,stageVisit:'exchange',x:239,y:44,kind:2,exchangeClock:8,hostAuraActive:true,challengerAuraActive:true}],gateControllers:{}};
 assert(drawModularVenue(ctx,assets,event,7000,{}));
 assert(ctx.calls.filter(c=>c[0]==='fillRect').length>85,'multi-layer flames and spark particles render');
 assert.equal(ctx.calls.filter(c=>c[0]==='drawImage').length,1,'only one world plate');
});

test('v088k boss stances stay aggressive and chat rotates rapidly across a 15–20s round',()=>{
 const engine={progress:{irlRecords:{destinyMeet:{attempts:0}}}};
 const event=new IRLEvent(engine,{level:0});
 event.begin();event.nextArrival=999;event.clock=500;
 event.add({throughGate:false});
 const guest=event.visitors[0];event.resolve(guest,true,'debate');
 const challenger=event.departures.at(-1);
 assert(debateExchangeDuration(challenger,0)>=15&&debateExchangeDuration(challenger,0)<=20);
 const poses=new Set(),hostPoses=new Set();
 let peakChat=0,chatLines=0,exchanging=false;
 for(let i=0;i<800;i++){
  event.tick(.1);
  if(challenger.stageVisit==='exchange'){
   exchanging=true;
   assert(['argue','point','heckle'].includes(challenger.exchangeAction));
   assert(['argue','point','heckle'].includes(event.hostMood));
   poses.add(challenger.exchangeAction);hostPoses.add(event.hostMood);
   peakChat=Math.max(peakChat,challenger.hypeBeat);
   chatLines+=event.debateChat.length>0?1:0;
  }
  if(event.tvEvent?.type==='debate')break;
 }
 assert(exchanging);
 assert(poses.size>=2&&hostPoses.size>=2,'both actors change aggressive poses');
 assert(peakChat>=8,'hype chatter is frequent throughout the 15–20 second round');
 assert(chatLines>20,'crowd chatter is visible across the round');
 for(const line of ["Let Foodshop's debate!","Classic bridge burning","Vegas stream when?","Any gifters?","BINGO!","Mr. Redacted inbound"])
  assert(DEBATE_CHAT_LINES.includes(line));
 assert(DEBATE_CHAT_LINES.length>=65,'large rotating meme bank');
});

test('v088k audio cues are beat-driven and never emitted per animation frame',()=>{
 const intro=sound.irlDebateIntro,clash=sound.irlDebateClash,outro=sound.irlDebateOutro;
 let starts=0,impacts=0,finishes=0;
 sound.irlDebateIntro=()=>starts++;sound.irlDebateClash=()=>impacts++;sound.irlDebateOutro=()=>finishes++;
 try{
  const event={paused:false,departures:[{id:1,serial:2,debater:true,stageVisit:'exchange',hypeBeat:0}]};
  for(let i=0;i<30;i++)sound.irlDebateTick(event);
  assert.equal(starts,1);assert.equal(impacts,0);
  event.departures[0].hypeBeat=1;
  for(let i=0;i<30;i++)sound.irlDebateTick(event);
  assert.equal(impacts,1);
  event.departures.length=0;event.tvEvent={type:'debate',won:true};
  sound.irlDebateTick(event);sound.irlDebateTick(event);
  assert.equal(finishes,1);
 }finally{
  sound.irlDebateIntro=intro;sound.irlDebateClash=clash;sound.irlDebateOutro=outro;
 }
});
