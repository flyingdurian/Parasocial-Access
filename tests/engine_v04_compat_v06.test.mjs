import assert from 'node:assert/strict';
import {RushEngine,WORLD_DEFS,UPGRADES,CONTRACTS,SAVE_KEY,PRIOR_KEY,CASES} from '../src/engine.js';
import {generateLevel,generateSession,GENERATOR_STATS} from '../src/generator.js';
let n=0;const check=(v,s)=>{n++;assert.ok(v,s)};
const blank=()=>({version:3,credits:0,worlds:[{unlocked:0,stars:[0,0,0,0,0],best:[0,0,0,0,0],upgrades:{}},{unlocked:0,stars:[0,0,0,0,0],best:[0,0,0,0,0],upgrades:{}},{unlocked:0,stars:[0,0,0,0],best:[0,0,0,0],upgrades:{}}],arenaUnlocked:false,marketUnlocked:false,mastery:[],recent:[],recentMeta:[],history:[],sessions:0,totalReviewed:0,bestCombo:0});
const make=()=>{const e=new RushEngine();e.progress=blank();return e};
check(WORLD_DEFS.length===4,'three distinct worlds');check(GENERATOR_STATS.families===56,'expanded v04 scenario families');check(GENERATOR_STATS.authoredTemplates===308,'260 curated templates');check(CASES.length===126,'preserved legacy content');check(CONTRACTS.length===3,'three contracts');check(Object.values(UPGRADES).every(x=>x.length===4),'four equipment families per world');
for(let seed=1;seed<=100;seed++)for(let world=0;world<3;world++){
 const all=generateSession(seed,world),items=all.flatMap(x=>x.cases),expected=WORLD_DEFS[world].levelsConfig.reduce((a,v)=>a+v.count,0);
 check(all.length===WORLD_DEFS[world].levels,`level count ${world}`);check(items.length===expected,`case count ${world}`);
 check(new Set(items.map(x=>x.text)).size===items.length,`no text repeats in world ${world} seed ${seed}`);
 check(items.every(x=>['approve','flag','remove'].includes(x.verdict)),`verdict integrity ${world}`);
 check(items.every(x=>WORLD_DEFS[world].formats.includes(x.format)),`platform identity ${world}`);
 check(items.every(x=>x.text.length>10&&x.text.length<179),`readable text bounds ${world}`);
 check(JSON.stringify(all)===JSON.stringify(generateSession(seed,world)),`determinism ${world}`);
 if(world===2){const rings=items.filter(x=>x.campaign);check(rings.length>=8,'linked fraud campaigns authored');check(rings.every(x=>x.verdict==='remove'),'fraud rings safe batch rule');}
}
const e=make();check(!e.start(1,0,111),'arena initially locked');check(!e.start(2,0,111),'market initially locked');check(!e.start(0,4,111),'levels gated');
function clear(e,world,level,seed,contract=null){check(e.start(world,level,seed,contract),`level ${world}:${level} start`);let steps=0;while(e.mode==='playing'&&steps++<1000){if(e.queue.length){const c=e.queue[0];e.answer(c.verdict,c.id);}else e.update(.12);}check(e.mode==='results',`level ${world}:${level} finishes`);check(e.results.stars===3,`perfect ${world}:${level}, ${JSON.stringify(e.results)}`);return e.results;}
for(let world=0;world<3;world++)for(let level=0;level<WORLD_DEFS[world].levels;level++)clear(e,world,level,321+world*100+level);
check(e.progress.arenaUnlocked,'arena unlocked');check(e.progress.marketUnlocked,'market unlocked after arena');check(e.worldFinished(0)&&e.worldFinished(1)&&e.worldFinished(2),'all worlds finished');check(e.progress.history.length===14,'all runs recorded');
const market=make();market.progress.arenaUnlocked=true;market.progress.marketUnlocked=true;
check(market.start(2,0,939), 'market starts');check(market.queue.length===3,'three visible listings');
const linked=market.queue.find(x=>x.campaign);check(linked,'linked item appears immediately');check(market.select(linked.id),'select linked listing');
check(market.marketMatches().length===2,'two matching checkout routes');const oldScore=market.score,oldQueue=market.queue.length;const batch=market.batchRemove(linked.id);check(batch?.count===2,'two cleared at once');check(market.queue.length===oldQueue-2,'one action clears two');check(market.score>oldScore+180,'batch awards meaningful score');check(market.wrong===0,'no innocent seller removed');check(!market.batchRemove(),'no invalid batch without pair');
// Old full queue logic dropped the SELECTED item while its timer still showed time.
const fair=make();fair.progress.arenaUnlocked=true;fair.progress.worlds[1].unlocked=4;check(fair.start(1,4,989),'last arena starts');const protectedId=fair.focus;let witnessedFull=false;
for(let steps=0;steps<80&&fair.mode==='playing';steps++){
 const focus=fair.queue.find(x=>x.id===protectedId);if(!focus||focus.age>=focus.life-.08)break;
 if(fair.queue.length>=fair.capacity)witnessedFull=true;
 fair.update(.1);
 if(fair.mode==='playing'&&fair.queue.find(x=>x.id===protectedId)?.age<fair.queue.find(x=>x.id===protectedId)?.life-.05)check(fair.queue.some(x=>x.id===protectedId),'selected target survives arrivals until deadline');
}
check(witnessedFull,'queue reached full capacity while selected protected');
const stale=make();stale.progress.arenaUnlocked=true;stale.start(1,0,555);const staleId=stale.focus;stale.queue=stale.queue.filter(x=>x.id!==staleId);const before=stale.queue.length;const wrong=stale.wrong;check(stale.answer('remove',staleId)===null,'stale input rejected');check(stale.queue.length===before&&stale.wrong===wrong,'stale action never hits next message');
const filter=make();filter.progress.arenaUnlocked=true;filter.progress.worlds[1].unlocked=4;filter.progress.worlds[1].upgrades.autofilter=3;filter.start(1,3,42);const focus=filter.queue[0];focus.verdict='remove';focus.scenario='raid';const other=filter.queue[1];other.verdict='remove';other.scenario='raid';filter.clock=filter.clockMax*.55;filter.autofilterAt=0;filter.update(.1);check(filter.queue.some(x=>x.id===focus.id),'Auto-Mod never removes selected message');check(!filter.queue.some(x=>x.id===other.id),'Auto-Mod catches unselected raid spam');
const end=make();end.progress.credits=9000;check(end.buy(0,'scanner'),'purchased scanner');check(end.buy(0,'scanner'),'purchased second scanner');for(let level=0;level<5;level++)clear(end,0,level,7000+level);check(end.start(0,4,8001,'bare'),'bare-metal contract starts');check(end.rank(0,'scanner')===0,'purchased equipment disabled during bare contract');let count=0;while(end.mode==='playing'&&count++<800){if(end.queue.length)end.answer(end.queue[0].verdict);else end.update(.1);}check(end.results.stars>=2,'bare contract successful');check(end.results.masteryAward===220,'mastery pays credit reward');check(end.masteryCompleted(0,'bare'),'mastery persists');check(end.start(0,4,8002,'bare'),'contract replay allowed');while(end.mode==='playing'){if(end.queue.length)end.answer(end.queue[0].verdict);else end.update(.12)}check(end.results.masteryAward===0,'mastery cannot farm first-time reward');
// Migrate real v0.2 saves rather than wiping purchased ranks or stars.
const old={version:2,credits:1240,worlds:[{unlocked:4,best:[1,2,3,4,5],stars:[3,3,3,3,3],upgrades:{scanner:3}},{unlocked:4,best:[1,1,1,1,2],stars:[3,3,3,2,1],upgrades:{freeze:2}}],arenaUnlocked:true,sessions:3,totalReviewed:90,recent:[],history:[]};
globalThis.localStorage={getItem:key=>key===PRIOR_KEY?JSON.stringify(old):null,setItem:()=>{}};
const migrated=new RushEngine();check(migrated.progress.version===8,'new schema');check(migrated.progress.credits===1240,'credits retained');check(migrated.rank(0,'scanner')===3&&migrated.rank(1,'freeze')===2,'equipment retained');check(migrated.progress.worlds[0].stars.every(x=>x===3),'star migration retained');check(migrated.progress.marketUnlocked,'third world unlock inferred from previous completed arena');
console.log(`RUSH v0.3 ENGINE GREEN: ${n} assertions / 100 seeded sessions × 3 worlds / Fair Play + 14 levels + market batches + mastery + save migration`);
