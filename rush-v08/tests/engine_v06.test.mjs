import assert from 'node:assert/strict';
import {RushEngine, WORLD_DEFS, NETWORK_CREATORS,CREATOR_EVENTS,CREATOR_UPGRADES,SAVE_KEY,PRIOR_V05_KEY} from '../src/engine.js';
import {creatorLevel} from '../src/creators-v06.js';
import {createIdentityCases} from '../src/creator-identity-v061.js';
let checks=0;const ok=(x,m)=>{checks++;assert.ok(x,m)};
const unlocked=()=>({version:7,credits:50000,worlds:WORLD_DEFS.map(w=>({unlocked:w.levels-1,best:Array(w.levels).fill(0),stars:Array(w.levels).fill(0),upgrades:{}})),arenaUnlocked:true,marketUnlocked:true,threadUnlocked:true,history:[],recent:[],recentMeta:[],sessions:0,totalReviewed:0,bestCombo:0,mastery:[],eventRecords:{},operatorUpgrades:{}});
let raw=new Map();globalThis.localStorage={getItem:k=>raw.get(k)||null,setItem:(k,v)=>raw.set(k,v)};
ok(NETWORK_CREATORS.length===3,'three active creators');ok(CREATOR_EVENTS.length===9,'nine events');ok(CREATOR_UPGRADES.length===2,'two upgrade branches');
for(const c of NETWORK_CREATORS){
 let e=new RushEngine();e.progress={...e.progress,...unlocked(),creators:e.progress.creators};
 ok(e.creatorEvents(c.id).length===3,'three chapters for creator');ok(!e.creatorEvents(c.id)[0].locked,'first event available');
 ok(e.creatorEvents(c.id)[1].locked&&e.creatorEvents(c.id)[2].locked,'chapter gating');
 ok(e.startCreatorEvent(c.id+'-feed'),'starter event launches');
 ok(e.activeCreatorEvent?.creator===c.id,'active creator identity preserved');
 const first=e.cards.map(x=>x.text);ok(e.cards.some(x=>x.creatorId===c.id),'channel-themed content');
 ok(e.cards.every(x=>['approve','flag','remove'].includes(x.verdict)),'rule-first outcomes');
 ok(new Set(e.cards.map(x=>x.id)).size===e.cards.length,'event IDs unique');
 for(let z=0;z<1500&&e.mode==='playing';z++){
  if(e.signatureActive){const x=e.emoteTrain.current;e.routeEmote(x.match?'merge':'route')}else if(e.tournament?.breakRemaining>0)e.update(.12);else if(e.queue.length){const x=e.queue[0];e.answer(x.verdict,x.id)}else e.update(.12)
 }
 ok(e.mode==='results'&&e.results.cleared,'creator event completes');ok(e.results.creatorName===c.name,'named creator results');
 ok(e.worldState(0).stars.every(x=>x===0),'creator run cannot inflate campaign');
 ok(e.creatorState(c.id).xp>0,'creator XP earned');ok(e.creatorState(c.id).records[c.id+'-feed'].stars===3,'creator medal recorded');
 ok(e.progress.credits>50000,'event awards credits');
 ok(e.startCreatorEvent(c.id+'-feed'),'replay allowed');ok(e.cards.map(x=>x.text).join('~')!==first.join('~'),'creator content rotates on each completed run');
 e.go('creators');ok(e.mode==='creators','hub is navigable');
 const b=new RushEngine();b.progress={...b.progress,...unlocked(),creators:b.progress.creators};
 const before=b.progress.credits;ok(b.buyCreator(c.id,'buffer'),'buffer can be purchased');ok(b.creatorRank(c.id,'buffer')===1,'upgrade rank saved');ok(b.progress.credits<before,'spending credits deducts');
 ok(b.startCreatorEvent(c.id+'-feed'),'upgrade test starts');ok(b.capacity===[4,5,6,8][b.rank(0,'buffer')]+1,'buff raises capacity');
}
const samples=[{id:'x',verdict:'approve',text:'Original',format:'micro'},{id:'y',verdict:'flag',text:'Original 2',format:'forum'},{id:'z',verdict:'remove',text:'Original 3',format:'chat'},{id:'c',verdict:'remove',text:'Checkout',campaign:'C1',format:'market'},{id:'d',verdict:'remove',text:'Phishing',cascade:'T1',format:'forum'}];
for(const c of NETWORK_CREATORS){const a=createIdentityCases(samples,c.id,c.id+'-feed');const b=createIdentityCases(samples,c.id,c.id+'-feed');ok(JSON.stringify(a)===JSON.stringify(b),'stable persona content');ok(a.every((x,i)=>x.verdict===samples[i].verdict),'persona never changes verdict');ok(a[3].campaign==='C1'&&a[4].cascade==='T1','group evidence protected');}
ok(creatorLevel(0)===1&&creatorLevel(70)===2&&creatorLevel(160)===3&&creatorLevel(300)===4&&creatorLevel(500)===5,'creator tiers');
const old={...unlocked(),version:5};raw=new Map([[PRIOR_V05_KEY,JSON.stringify(old)]]);const migrated=new RushEngine();ok(migrated.progress.version===8,'migrates schema');ok(migrated.progress.credits===old.credits,'credits survive');ok(Object.keys(migrated.progress.creators).length===3,'new profile defaults');ok(migrated.progress.worlds.length===4,'prior world progression intact');
migrated.save();ok(JSON.parse(raw.get(SAVE_KEY)).version===8,'new save key');ok(JSON.parse(raw.get(PRIOR_V05_KEY)).version===5,'previous v05 save left untouched');
console.log(`RUSH v0.6 ENGINE GREEN — ${checks} assertions | creator missions, buffs, route gating, stable variants, no campaign bypass, migration`);
