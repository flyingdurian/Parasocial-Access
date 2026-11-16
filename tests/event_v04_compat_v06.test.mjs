import assert from 'node:assert/strict';
import {RushEngine,WORLD_DEFS,OPERATOR_UPGRADES,SAVE_KEY,PRIOR_KEY,EVENT_DEFS} from '../src/engine.js';
import {currentOperations,eventSeed,dailyKey} from '../src/events-v04.js';
import {SCENARIO_FAMILIES,GENERATOR_STATS,generateLevel} from '../src/generator.js';
let n=0;const check=(a,msg)=>{n++;assert.ok(a,msg)};
const blank=()=>({version:4,credits:0,worlds:WORLD_DEFS.map(w=>({unlocked:0,stars:Array(w.levels).fill(0),best:Array(w.levels).fill(0),upgrades:{}})),arenaUnlocked:false,marketUnlocked:false,history:[],recent:[],recentMeta:[],sessions:0,totalReviewed:0,bestCombo:0,mastery:[],eventRecords:{},operatorUpgrades:{}});
const make=()=>{const e=new RushEngine();e.progress=blank();return e};
const finish=e=>{let guard=0;while(e.mode==='playing'&&guard++<2000){if(e.queue.length){const c=e.queue[0];e.answer(c.verdict,c.id)}else e.update(.1);}check(e.mode==='results','finite completion');return e.results;};
check(GENERATOR_STATS.families===56,'48 scenario families');check(GENERATOR_STATS.authoredTemplates===308,'260 authored templates');check(EVENT_DEFS.length===3,'three events');check(OPERATOR_UPGRADES.length===2,'two permanent tool branches');
check(EVENT_DEFS.every(x=>x.spotlight.length>0),'events have content focus');
for(let i=0;i<60;i++){
 const date=new Date(Date.UTC(2026,0,1+i)),operations=currentOperations(date);
 check(operations.length===3,'daily event count');
 check(new Set(operations.map(x=>x.seed)).size===3,'daily event seeds differ by world');
 check(JSON.stringify(operations)===JSON.stringify(currentOperations(date)),'daily event determinism');
 check(operations.every(x=>x.day===date.toISOString().slice(0,10)),'day normalized UTC');
}
const e=make();check(e.operations()[0].locked===false,'feed event unlocked initially');check(e.operations()[1].locked,'Arena event locked before arena');check(e.operations()[2].locked,'Market event locked before market');
check(!e.startEvent('broadcast'),'locked event rejected');check(!e.startEvent('market-sweep'),'market event rejected');check(!e.startEvent('unknown-event'),'unknown event rejected');
check(e.startEvent('flash'),'can start Flash Flood from beginning');check(e.flashEvent,'Flash modifier applied');check(e.activeEvent.id==='flash','active event id');check(e.configuration.cases.length===e.configuration.count,'event case count');check(e.queue[0].life===5.1,'flash deadline per post');
let starting=e.queue[0].id;for(let i=0;i<44&&e.mode==='playing'&&e.queue[0]?.id===starting;i++)e.update(.12);
check(e.eventTimedOut===1,'flash post expires after deadline');check(e.queue[0].id!==starting,'fresh post after expiration');const priorWrong=e.wrong;check(e.answer('remove',starting)===null,'stale timed-out post rejected');check(e.wrong===priorWrong,'stale response does not affect replacement');
const e2=make();check(e2.startEvent('flash'),'restart daily operation');check(e2.pulseCost===8,'base pulse requires eight correct calls');check(e2.pulseCharge===0,'starts empty');
for(let i=0;i<8;i++)e2.answer(e2.queue[0].verdict,e2.queue[0].id);
check(e2.pulseCharge===8,'eight successful decisions charge pulse');check(e2.triggerPulse(),'can trigger full Focus Pulse');check(e2.pulsing,'pulse active');check(e2.pulseUses===1,'pulse recorded');check(e2.pulseCharge===0,'pulse consumed');check(!e2.triggerPulse(),'no double pulse');
const beforeClock=e2.clock,beforeLife=e2.queue[0].age;e2.update(.12);check(e2.clock>beforeClock-.07,'pulse slows global shift time');check(e2.queue[0].age<beforeLife+.08,'pulse slows deadlines');
let wait=0;while(e2.pulsing&&wait++<180)e2.update(.12);check(!e2.pulsing,'pulse expires automatically');
const e3=make();e3.progress.credits=4000;
for(const u of OPERATOR_UPGRADES){for(let rank=1;rank<=3;rank++)check(e3.buyOperator(u.id),`${u.id} upgraded ${rank}`);check(!e3.buyOperator(u.id),'max rank enforced');}
check(e3.pulseCost===5,'coil reduces decisions for Pulse');check(e3.pulseDuration===7,'capacitor increases Pulse duration');check(e3.progress.credits<4000,'upgrades consume currency');
check(e3.startEvent('flash'),'upgraded player starts event');const timer=e3.clock;for(let i=0;i<5;i++)e3.answer(e3.queue[0].verdict,e3.queue[0].id);check(e3.pulseCharge===5,'upgraded coil charges in five');check(e3.triggerPulse(),'upgraded pulse activates');check(e3.pulseRemaining===7,'duration upgrade applied');
const bare=make();bare.progress.operatorUpgrades={coil:3,capacitor:3};bare.progress.worlds[0].stars=[1,1,1,1,1];bare.progress.worlds[0].unlocked=4;check(bare.start(0,4,1294,'bare'),'bare-metal mastery launches');check(bare.operatorRank('coil')===0&&bare.operatorRank('capacitor')===0,'all universal equipment disabled in bare mastery');check(bare.pulseCost===8&&bare.pulseDuration===3.5,'base Pulse remains for bare mastery');
// Event replay uses the SAME case order and content for the entire UTC day.
const same=make();check(same.startEvent('flash'),'seeded challenge starts');const a=same.cards.map(x=>[x.text,x.verdict,x.id]);finish(same);check(same.startEvent('flash'),'same challenge rerun');check(JSON.stringify(a)===JSON.stringify(same.cards.map(x=>[x.text,x.verdict,x.id])),'same-day content replay invariant');
// Rewards go to medals improved, not repeated purchases of the same rank.
let res=finish(same);check(res.eventTitle==='FLASH FLOOD','event receipt attached');check(res.eventDay===dailyKey(),'event day stamped');check(res.eventMedals===3,'perfect operation grants gold medal');check(res.eventBonus===0,'replayed gold medal cannot farm bonus');
const eventKey=`${dailyKey()}:flash`;check(same.progress.eventRecords[eventKey]?.stars===3,'daily medal saved');check(same.progress.eventRecords[eventKey]?.attempts===2,'attempt count increments');
// New event can pay incremental medals once, retaining rewards on repeat.
const prize=make();prize.startEvent('flash');res=finish(prize);check(res.eventBonus===3*currentOperations()[0].bonus,'first gold medal pays triple event bonus');const credits=prize.progress.credits;prize.startEvent('flash');res=finish(prize);check(res.eventBonus===0,'replaying gold bonus is zero');check(prize.progress.credits>credits,'base credits still earned for replay');
const arena=make();arena.progress.arenaUnlocked=true;arena.progress.worlds[1].unlocked=4;check(arena.startEvent('broadcast'),'Broadcast Storm unlocked');check(arena.activeEvent.id==='broadcast','event variant');const selected=arena.focus,selectedLife=arena.queue.find(c=>c.id===selected).life;for(let i=0;i<42;i++){const c=arena.queue.find(x=>x.id===selected);if(!c||arena.mode!=='playing'||c.age>c.life-.2)break;arena.update(.12);check(arena.queue.some(x=>x.id===selected),'selected message protected under event pressure');}check(arena.activeEvent.rule.includes('Selected'),'fair-play note accurate');
const market=make();market.progress.arenaUnlocked=true;market.progress.marketUnlocked=true;market.progress.worlds[2].unlocked=3;check(market.startEvent('market-sweep'),'Market event unlocked');check(market.queue.some(x=>x.campaign),'linked ring appears on first page');const selectedRing=market.queue.find(x=>x.campaign);market.select(selectedRing.id);check(market.marketMatches().length===3,'three verified linked listings visible');const before=market.queue.length;const batch=market.batchRemove(selectedRing.id);check(batch.count===3,'three scams cleared by one deliberate batch');check(market.queue.length===before-3,'all verified matches removed');check(market.wrong===0,'batch contains no harmless listing');
// Strict v0.3 -> v0.4 migration, preserving user's progress and world upgrades.
const old={version:3,credits:1533,worlds:[{unlocked:4,stars:[3,3,3,3,3],best:[101,102,103,104,105],upgrades:{scanner:2}},{unlocked:4,stars:[1,2,3,2,1],best:[10,20,30,40,50],upgrades:{freeze:2}},{unlocked:1,stars:[1,1,0,0],best:[22,33,0,0],upgrades:{audit:3}}],arenaUnlocked:true,marketUnlocked:true,history:[{x:'existing'}],mastery:['0:bare'],recent:['prior post'],sessions:11,totalReviewed:605};
const store=new Map([[PRIOR_KEY,JSON.stringify(old)]]);globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
const migrated=new RushEngine();check(migrated.progress.version===8,'v4 schema');check(migrated.progress.credits===1533,'retains credits');check(migrated.progress.worlds[0].stars.every(x=>x===3),'retains stars');check(migrated.rank(2,'audit')===3,'retains Market upgrades');check(migrated.progress.sessions===11,'retains runs');check(migrated.progress.mastery.includes('0:bare'),'retains mastery');check(migrated.progress.worlds[2].unlocked===1,'retains level unlocks');check(migrated.operatorRank('coil')===0&&migrated.operatorRank('capacitor')===0,'new universal upgrades start empty');check(migrated.progress.eventRecords&&Object.keys(migrated.progress.eventRecords).length===0,'new event records clean');
console.log(`EVENT CIRCUIT v0.4 GREEN: ${n} assertions · daily seeds · fixed challenges · Pulse mechanics · Fair Play · rewards · Market trio · v0.3 migration`);
