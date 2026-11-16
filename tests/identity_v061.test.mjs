import assert from 'node:assert/strict';
import {RushEngine,WORLD_DEFS,CREATOR_EVENTS,NETWORK_CREATORS,SAVE_KEY,PRIOR_V06_KEY} from '../src/engine.js';
import {createIdentityCases,makeEmoteScript} from '../src/creator-identity-v061.js';
let checks=0;const ok=(v,m)=>{checks++;assert.ok(v,m)};
const empty=()=>({version:7,credits:12000,worlds:WORLD_DEFS.map(w=>({unlocked:w.levels-1,best:Array(w.levels).fill(0),stars:Array(w.levels).fill(0),upgrades:{}})),arenaUnlocked:true,marketUnlocked:true,threadUnlocked:true,history:[],recent:[],recentMeta:[],sessions:0,totalReviewed:0,bestCombo:0,mastery:[],eventRecords:{},operatorUpgrades:{}});
const make=()=>{const e=new RushEngine();e.progress={...e.progress,...empty()};return e;};
function perfect(e){let guard=0;while(e.mode==='playing'&&guard++<2600){
 if(e.signatureActive){const x=e.emoteTrain.current;e.routeEmote(x.match?'merge':'route');}
 else if(e.tournament?.breakRemaining>0)e.update(.12);
 else if(e.queue.length){const c=e.queue[0];e.answer(c.verdict,c.id);}
 else e.update(.12);
 }ok(guard<2600,'terminates within guard');ok(e.mode==='results','results reached');return e.results;}
ok(NETWORK_CREATORS.length===3,'three creator identities');ok(CREATOR_EVENTS.length===9,'nine creator events');
for(const profile of NETWORK_CREATORS){
 const e=make();const id=profile.id;const ops=CREATOR_EVENTS.filter(x=>x.creator===id);
 for(const ev of ops){
  let unlock=0;while(e.creatorEvents(id).find(x=>x.id===ev.id)?.locked&&unlock++<9){const prior=ops[Math.max(0,ev.index-1)];ok(e.startCreatorEvent(prior.id),'prerequisite replay');perfect(e);}
  ok(!e.creatorEvents(id).find(x=>x.id===ev.id).locked,'chapter unlocked '+ev.id);ok(e.startCreatorEvent(ev.id),'start '+ev.id);
  ok(e.cards.every(c=>['approve','flag','remove'].includes(c.verdict)),'authored labels retained');
  ok(new Set(e.cards.map(c=>c.text)).size===e.cards.length,'no exact same copy inside shift');
  ok(e.cards.every(c=>c.creatorId===id),'every case belongs to selected creator');
  ok(e.cards.every(c=>!c.cascade||c.verdict==='remove')&&e.cards.every(c=>!c.campaign||c.verdict==='remove'),'linked policy labels intact');
  const initial=e.cards.map(c=>c.text).join('|');
  const result=perfect(e);ok(result.cleared&&result.stars===3,'perfect creator event '+ev.id);
  ok(e.progress.worlds[ev.world].stars.every(x=>x===0),'creator shift never upgrades campaign');
  ok(e.creatorState(id).records[ev.id].stars===3,'event medal persists');
  ok(e.startCreatorEvent(ev.id),'repeat creator event');
  const repeat=e.cards.map(c=>c.text).join('|');ok(initial!==repeat,'content rotates on repeat '+ev.id);
  perfect(e);
 }
 ok(e.creatorState(id).xp>=160,'replay yields community progression');
 console.log('CREATOR',id,'three chapters and rotating texts PASS');
}
// A normal disagreement or snark remains harmless, genuine threats actionable.
const base=Array.from({length:40},(_,i)=>({id:'b'+i,verdict:i%4===0?'flag':i%4===1?'remove':'approve',text:'placeholder'+i,format:'micro'}));
for(const id of NETWORK_CREATORS.map(x=>x.id)){
 const cases=createIdentityCases(base,id,id+'-feed');ok(cases.every((x,i)=>x.verdict===base[i].verdict),'personality never changes moderation outcomes');
 ok(cases.every(x=>x.creatorId===id),'all posts themed');ok(new Set(cases.map(x=>x.text)).size===40,'40 unique posts');
}
const destiny=make();destiny.progress.creators.destiny.xp=85;destiny.progress.creators.destiny.records['destiny-feed']={stars:3,best:500,attempts:1};
ok(destiny.startCreatorEvent('destiny-arena'),'destiny Live Arena starts');
let count=0;while(destiny.mode==='playing'&&!destiny.signatureActive&&count++<800){if(destiny.queue.length){const c=destiny.queue[0];destiny.answer(c.verdict,c.id);}else destiny.update(.12)}
ok(destiny.signatureActive,'Emote Train triggers within early shift');const e=destiny.emoteTrain;
ok(e.index===0&&e.combo===12,'starts with existing chat train');
const beforeLife=destiny.queue.map(c=>c.age);const beforeClock=destiny.clock;destiny.update(.12);ok(destiny.clock===beforeClock,'game clock frozen during Emote Train');ok(destiny.queue.every((c,i)=>c.age===beforeLife[i]),'chat lifetimes frozen during train');
ok(destiny.answer('approve',destiny.queue[0]?.id)===null,'normal moderation blocked while train open');
const initialHearts=destiny.hearts;const wrongAction=e.current.match?'route':'merge';const wrongResult=destiny.routeEmote(wrongAction);ok(wrongResult?.correct===false,'wrong emote route is detectable');ok(destiny.hearts===initialHearts,'wrong routing never bans or costs shield');
while(destiny.signatureActive){const x=destiny.emoteTrain.current;destiny.routeEmote(x.match?'merge':'route');}
ok(!destiny.signatureActive,'train concludes');ok(destiny.emoteTrain.correct>=10,'several meaningful decisions');ok(destiny.emoteTrain.peak>=100,'large ×100 combo reachable');ok(destiny.emoteTrain.milestones.includes(25)&&destiny.emoteTrain.milestones.includes(50)&&destiny.emoteTrain.milestones.includes(100),'milestone fanfare thresholds');
ok(destiny.debateClashes>=0,'debate pairs tracked without implicit moderation');perfect(destiny);
const debate=make();debate.startCreatorEvent('destiny-feed');ok(debate.cards[0].debateId===debate.cards[1].debateId,'first debate counterpoint pair');
const before=debate.score;for(let i=0;i<2;i++){const x=debate.queue[0];debate.answer(x.verdict,x.id);}ok(debate.debateClashes===1,'two correct counterpart decisions grant Clash');ok(debate.score>=before+340,'clash rewards meaningful points');
const nova=make();nova.startCreatorEvent('nova-feed');let n=0;while(n++<12&&nova.communityCelebrations<1){const c=nova.queue[0];nova.answer(c.verdict,c.id);}ok(nova.communityCelebrations>=1,'Nova festival momentum reaches celebration');ok(nova.momentum<100,'momentum meter rolls over');ok(nova.creatorBonuses>=185,'celebration adds bonus');
const glitch=make();glitch.startCreatorEvent('glitch-feed');let z=0;while(glitch.tournament.round===1&&z++<18){const c=glitch.queue[0];glitch.answer(c.verdict,c.id);}ok(glitch.tournament.round===2&&glitch.tournament.breakRemaining>0,'Glitch enters between-round break');const pausedClock=glitch.clock;glitch.update(.12);ok(glitch.clock===pausedClock,'match break pauses shift time');ok(glitch.answer('approve',glitch.queue[0]?.id)===null,'break prevents accidental moderation');perfect(glitch);ok(glitch.tournament.clutches>=1,'match point rewards four correct calls');ok(glitch.results.creatorIdentity.tournamentClutches>=1,'results show clutch medal');
// v0.6 -> v0.6.1 migration: original save remains untouched.
const saved=make().progress;saved.version=6;saved.creators.destiny.xp=194;saved.creators.nova.upgrades={desk:2};saved.creators.glitch.records['glitch-feed']={stars:2,best:900,attempts:4};
const storage=new Map([[PRIOR_V06_KEY,JSON.stringify(saved)]]);
globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const migrated=new RushEngine();ok(migrated.progress.version===8,'v061 schema version');ok(migrated.progress.credits===saved.credits,'credits retained');ok(migrated.creatorState('destiny').xp===194,'XP retained');ok(migrated.creatorRank('nova','desk')===2,'equipment retained');ok(migrated.creatorState('glitch').records['glitch-feed'].stars===2,'old event medals retained');
migrated.save();ok(JSON.parse(storage.get(SAVE_KEY)).version===8,'writes only new key');ok(JSON.parse(storage.get(PRIOR_V06_KEY)).version===6,'previous save preserved');
console.log(`RUSH v0.6.1 SIGNATURE ENGINE GREEN: ${checks} checks / 9 chapters / 3 distinctive gameplay systems / safe migration`);
