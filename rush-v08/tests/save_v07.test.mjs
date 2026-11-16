import assert from 'node:assert/strict';
const store=new Map();
globalThis.localStorage={
 getItem:key=>store.get(key)??null,
 setItem:(key,value)=>store.set(key,value)
};
const {RushEngine,SAVE_KEY,PRIOR_V061_KEY,WORLD_DEFS}=await import('../src/engine.js');
let count=0;const ok=(truth,label)=>{assert.ok(truth,label);count++};
for(let i=0;i<30;i++){
 store.clear();
 const previous={
  version:7,credits:1450+i,arenaUnlocked:true,marketUnlocked:true,threadUnlocked:true,
  sessions:11+i,totalReviewed:345+i,bestCombo:13,history:[],recent:[],recentMeta:[],
  worlds:WORLD_DEFS.map((w,j)=>({unlocked:w.levels-1,best:Array(w.levels).fill(888+j),stars:Array(w.levels).fill(j===0?3:1),upgrades:{scanner:2,freeze:1}})),
  creators:{destiny:{xp:235+i,runs:8,upgrades:{desk:2},records:{'destiny-feed':{stars:3,best:5000,attempts:5}},milestones:['first']},nova:{xp:86,runs:2},glitch:{xp:91,runs:2}},
  eventRecords:{'some-event':{best:1900,stars:2,attempts:1}},operatorUpgrades:{coil:2},mastery:['0:precision']
 };
 store.set(PRIOR_V061_KEY,JSON.stringify(previous));
 const engine=new RushEngine();
 ok(engine.progress.version===8,'v0.7 schema');
 ok(engine.progress.credits===previous.credits,'credits migrated');
 ok(engine.progress.worlds[0].stars.every(x=>x===3),'campaign stars intact');
 ok(engine.progress.worlds[3].unlocked===4,'thread unlocks intact');
 ok(engine.creatorState('destiny').xp===235+i,'destiny XP preserved');
 ok(engine.creatorRank('destiny','desk')===2,'channel upgrades preserved');
 ok(engine.creatorState('destiny').records['destiny-feed'].stars===3,'medal records retained');
 ok(engine.operatorRank('coil')===2,'universal upgrade preserved');
 ok(engine.progress.irlRecords&&Object.keys(engine.progress.irlRecords).length===0,'new mode initialized independently');
 engine.save();
 ok(store.has(SAVE_KEY),'new key written');
 ok(JSON.parse(store.get(PRIOR_V061_KEY)).version===7,'old key not overwritten');
}
console.log('v0.7 SAVE MIGRATION GREEN:',count,'checks / 30 historical v0.6.1 saves');
