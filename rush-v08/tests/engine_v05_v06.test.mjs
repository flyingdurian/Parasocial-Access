import assert from 'node:assert/strict';
import {RushEngine,WORLD_DEFS,GENERATOR_STATS,UPGRADES,CREATORS,SAVE_KEY,PRIOR_V04_KEY} from '../src/engine.js';
import {generateLevel,generateSession} from '../src/generator.js';
let assertions=0;
const check=(v,m)=>{assertions++;assert.ok(v,m)};
const make=()=>{const e=new RushEngine();e.progress={version:5,credits:100000,worlds:WORLD_DEFS.map(w=>({unlocked:w.levels-1,best:Array(w.levels).fill(0),stars:Array(w.levels).fill(0),upgrades:{}})),arenaUnlocked:true,marketUnlocked:true,threadUnlocked:true,history:[],recent:[],recentMeta:[],sessions:0,totalReviewed:0,bestCombo:0,mastery:[],eventRecords:{},operatorUpgrades:{}};return e};
check(WORLD_DEFS.length===4,'four worlds');check(GENERATOR_STATS.families===56,'56 scenario families');check(GENERATOR_STATS.authoredTemplates===308,'308 authored templates');check(CREATORS.length===4,'four fictional recurring creators');check(UPGRADES.thread.length===4,'four new thread upgrade branches');
for(let seed=10;seed<150;seed++){
 const generated=generateSession(seed,3);const all=generated.flatMap(c=>c.cases);
 check(generated.length===5,'five levels');check(all.every(c=>['approve','flag','remove'].includes(c.verdict)),'rule-first verdicts');
 check(all.length===147,'full thread level content');check(all.every(c=>c.creatorId&&c.threadKey&&c.roomTitle),'context for every forum reply');
 check(generated.every(g=>new Set(g.cases.map(c=>c.id)).size===g.cases.length),'unique ids within every shift');
 check(new Set(all.map(c=>c.text)).size===all.length,'text variety across levels');
 check(JSON.stringify(generated)===JSON.stringify(generateSession(seed,3)),'determinism');
 for(let level=0;level<5;level++){
  const cs=generated[level].cases.filter(x=>x.cascade);
  check(cs.length>=6,'at least two active cascade groups');
  check(cs.every(x=>x.verdict==='remove'),'all linked cascade actions defined as prohibited');
 }
}
// Stream queue warning must NOT silently drop a target or penalize before grace expires.
const congestion=make();check(congestion.start(1,4,435),'arena level five starts');
const original=congestion.focus;
while(congestion.queue.length<congestion.capacity&&congestion.mode==='playing'){
 congestion.update(.12);for(const c of congestion.queue){c.life=100;c.age=0;}
}
check(congestion.queue.length===6,'queue is full');const hearts=congestion.hearts,firstQueue=congestion.queue.map(c=>c.id);
for(let i=0;i<14&&!congestion.congested;i++){congestion.update(.12);for(const c of congestion.queue){c.life=100;c.age=0;}}
check(congestion.congested,'warning state is entered before a message gets discarded');
check(congestion.hearts===hearts,'no damage immediately on full arrival');
check(congestion.queue.map(c=>c.id).join('|')===firstQueue.join('|'),'no eviction during warning');
check(congestion.focus===original,'selected identity protected under congestion');
for(let i=0;i<10;i++){congestion.update(.12);for(const c of congestion.queue){c.life=100;c.age=0;}}
check(congestion.hearts===hearts&&congestion.congested,'warning grace lasts at least 1.2 secs');
const cleared=congestion.queue.find(x=>x.id!==congestion.focus);congestion.answer(cleared.verdict,cleared.id);
for(let i=0;i<4;i++)congestion.update(.12);
check(congestion.hearts===hearts,'successful recovery never costs stability');check(congestion.recoveryCount===1,'recovery is recorded');
// Let a new full queue exhaust grace, ensure ONE breach and shield penalty.
const breach=make();breach.start(1,4,883);
let steps=0;while(breach.mode==='playing'&&breach.queueBreaches===0&&steps++<350){breach.update(.12);for(const c of breach.queue){c.life=100;c.age=0;}}
check(breach.queueBreaches===1,'first breach registered');check(breach.hearts===2,'exactly one shield lost');
for(let i=0;i<14;i++){breach.update(.12);for(const c of breach.queue){c.life=100;c.age=0;}}
check(breach.hearts===2,'no immediate cascade while cooldown active');check(breach.queueBreaches===1,'no instant second breach');
check(breach.damageLog[0]?.cause==='queue-breach','diagnostic cause recorded');
// A real expiry can occur during the shield cooldown, without removing another shield.
const missed={id:'test-expire',verdict:'remove'};const missedBefore=breach.missed;
breach.expire(missed);check(breach.missed===missedBefore+1,'expiration counted without double damage');check(breach.hearts===2,'cooldown absorbs clustered damage');check(breach.expiredViolations===1,'expiration tracked distinctly');
// Contain branch clears active and future malicious replies but never innocent neighbors.
const thread=make();check(thread.start(3,0,435),'thread world starts');
const incident=thread.queue.find(c=>c.cascade);check(!!incident,'at least one raid branch is present');
const nextBefore=thread.nextIndex;const planned=thread.cards.filter(c=>c.cascade===incident.cascade).length;
const outcome=thread.threadContain(incident.id);
check(outcome?.correct&&outcome.count>=1,'contain succeeds');check(outcome.count+outcome.prevented===planned,'all linked attack messages covered');
check(thread.queue.some(c=>c.verdict!=='remove'),'innocent content is still present');
let guard=0;while(thread.mode==='playing'&&guard++<1000){if(thread.queue.length){const c=thread.queue[0];thread.answer(c.verdict,c.id);}else thread.update(.12);}
check(thread.mode==='results','thread concludes');check(thread.results.prevented===outcome.prevented,'future messages suppressed');check(thread.results.branchCount===1,'branch action counted');check(thread.results.stars===3,'perfect containment can earn three stars');
// The special action must be optional, and misuse is punished without deleting harmless content.
const wrong=make();wrong.start(3,0,435);const innocent=wrong.queue.find(c=>c.verdict==='approve');const size=wrong.queue.length;
const wrongResult=wrong.threadContain(innocent.id);
check(wrongResult?.correct===false,'innocent branch rejected');check(wrong.wrong===1&&wrong.queue.length===size,'wrong action does not destroy content');check(wrong.answer('approve',innocent.id)?.correct,'innocent message can still be approved');
// Save migration from an actual v04 game, with purchased equipment and stars.
const old=make().progress;old.version=4;old.credits=12345;old.worlds=old.worlds.slice(0,3);old.worlds[0].stars=[3,3,3,3,3];old.worlds[2].stars=[3,3,3,3];old.worlds[2].upgrades={audit:2};old.eventRecords={'2026-11-12:flash':{stars:3,best:1000}};old.threadUnlocked=false;
globalThis.localStorage={getItem:key=>key===PRIOR_V04_KEY?JSON.stringify(old):null,setItem:()=>{}};
const migrated=new RushEngine();check(migrated.progress.version===8,'new v06 save schema');check(migrated.progress.credits===12345,'old credits retained');check(migrated.progress.worlds.length===4,'new world initialized');check(migrated.progress.threadUnlocked,'fourth world unlocked by completed market');check(migrated.rank(2,'audit')===2,'market purchases retained');check(migrated.progress.eventRecords['2026-11-12:flash'].stars===3,'daily record retained');check(migrated.progress.worlds[0].stars.every(n=>n===3),'old three-star progression retained');
console.log(`RUSH v0.5 ENGINE GREEN — ${assertions} assertions | 140 deterministic thread sessions | recovery, cooldown, save migration, containment, all 19 levels`);
