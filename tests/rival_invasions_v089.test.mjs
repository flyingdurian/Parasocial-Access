import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {
 RIVALS_V089,RIVAL_BY_ID_V089,RIVAL_WAVES_V089,BATTLE_COMMANDS_V089,
 BATTLE_TURNS_V089,TURN_DURATION_MS_V089,pickRivalInvasionV089,
 createRivalBattleV089,enterRivalArenaV089,getRivalCueV089,
 resolveRivalTurnV089,leaveRivalArenaV089,
} from '../src/rival-invasions-v089.js';

const ids=['foodshops','jordan-peterson','ben-shapiro','dan-saltman','hasan-piker','mrmouton'];

test('roster order, unique identities and approved rivalry dynamics',()=>{
 assert.deepEqual(RIVALS_V089.map(r=>r.id),ids);
 assert.equal(new Set(ids).size,6);
 assert.deepEqual(RIVALS_V089.map(r=>r.signature),[
  'Receipt Avalanche','Infinite Premise','Premise Blitz',
  'Sarcasm Ricochet','Audience Surge','Friendly Tangent']);
 assert.deepEqual(RIVALS_V089.filter(r=>r.dynamic==='friend-competitive').map(r=>r.id),
  ['foodshops','dan-saltman','mrmouton']);
 assert.deepEqual(RIVALS_V089.filter(r=>r.dynamic==='scorched-earth').map(r=>r.id),['hasan-piker']);
 assert(RIVALS_V089.every(r=>r.pressure>=1));
 assert(RIVAL_BY_ID_V089['hasan-piker'].maxHp>RIVAL_BY_ID_V089['mrmouton'].maxHp);
});

test('six source art atlases are real alpha PNGs with their own 4x4 geometry',()=>{
 for(const rival of RIVALS_V089){
  assert(existsSync(rival.asset.path),`Missing sheet: ${rival.id}`);
  const png=readFileSync(rival.asset.path);
  assert.equal(png.subarray(1,4).toString('ascii'),'PNG');
  assert.equal(png.readUInt32BE(16),rival.asset.width);
  assert.equal(png.readUInt32BE(20),rival.asset.height);
  assert.equal(png[25],6,`${rival.id}: PNG RGBA color type required`);
  assert.equal(rival.asset.columns*rival.asset.rows,16);
  assert.equal(rival.asset.rowsMeaning.length,4);
 }
});

test('rivals appear at waves 6,10,14,18 without repeats or surprise waves',()=>{
 assert.deepEqual(RIVAL_WAVES_V089,[6,10,14,18]);
 assert.equal(pickRivalInvasionV089({wave:7}),null);
 let seen=[];
 for(const wave of RIVAL_WAVES_V089){
  const rival=pickRivalInvasionV089({wave,seed:17,seenIds:seen});
  assert(rival);assert(!seen.includes(rival.id));seen.push(rival.id);
 }
 assert.equal(seen.length,4);
 assert(seen.includes('hasan-piker'),'final wave reserves eligible Hasan confrontation');
 assert.deepEqual(pickRivalInvasionV089({wave:10,seed:19,seenIds:[]}),
  pickRivalInvasionV089({wave:10,seed:19,seenIds:[]}));
 assert.equal(pickRivalInvasionV089({wave:10,seenIds:ids}),null);
});

test('VS introduction must finish before combat and return follows result',()=>{
 const intro=createRivalBattleV089({rivalId:'foodshops'});
 assert.equal(intro.status,'vs');assert.equal(getRivalCueV089(intro),null);
 assert.throws(()=>resolveRivalTurnV089(intro,{command:'read_room',timingMs:0}));
 assert.throws(()=>leaveRivalArenaV089(intro));
 const active=enterRivalArenaV089(intro);
 assert.equal(active.status,'active');assert.equal(intro.status,'vs','pure state preserves input');
 assert.throws(()=>enterRivalArenaV089(active));
});

test('relaxed mode explains the cue; expert mode hides answer and shortens window',()=>{
 const relaxed=getRivalCueV089(enterRivalArenaV089(createRivalBattleV089({rivalId:'ben-shapiro'})));
 const expert=getRivalCueV089(enterRivalArenaV089(createRivalBattleV089({rivalId:'ben-shapiro',mode:'expert'})));
 assert.equal(relaxed.counter,expert.counter);
 assert.equal(relaxed.revealCounter,true);
 assert.equal(expert.revealCounter,false);
 assert(expert.windowMs<relaxed.windowMs);
 assert.equal(relaxed.durationMs,3000);
});

test('timing and cue matching are player-controlled, not a random outcome',()=>{
 let state=enterRivalArenaV089(createRivalBattleV089({rivalId:'jordan-peterson'}));
 const cue=getRivalCueV089(state);
 const perfect=resolveRivalTurnV089(state,{command:cue.counter,timingMs:120});
 const mismatch=BATTLE_COMMANDS_V089.find(x=>x!==cue.counter);
 const missed=resolveRivalTurnV089(state,{command:mismatch,timingMs:120});
 const tooLate=resolveRivalTurnV089(state,{command:cue.counter,timingMs:1900});
 assert(perfect.rivalHp<missed.rivalHp);
 assert(perfect.destinyHp>missed.destinyHp);
 assert.equal(tooLate.history[0].hit,false);
 assert.equal(perfect.history[0].perfect,true);
 assert.equal(state.turn,0,'resolving does not mutate incoming battle');
});

test('every rival plays a six-beat complete victory run and can return safely',()=>{
 for(const id of ids){
  let state=enterRivalArenaV089(createRivalBattleV089({rivalId:id,seed:42}));
  while(state.status==='active'){
   const cue=getRivalCueV089(state);
   state=resolveRivalTurnV089(state,{command:cue.counter,timingMs:100});
   assert(state.turn<=BATTLE_TURNS_V089);
  }
  assert.equal(state.result,'victory',`${id} is winnable with perfect play`);
  assert(state.elapsedMs<=BATTLE_TURNS_V089*TURN_DURATION_MS_V089);
  assert.equal(state.history.length,state.turn);
  assert.equal(leaveRivalArenaV089(state).status,'returned');
 }
});

test('every rival can win on sustained player misses, Hasan applies highest pressure',()=>{
 const damages=[];
 for(const id of ids){
  let s=enterRivalArenaV089(createRivalBattleV089({rivalId:id}));
  const firstCue=getRivalCueV089(s);
  s=resolveRivalTurnV089(s,{command:BATTLE_COMMANDS_V089.find(x=>x!==firstCue.counter),timingMs:2000});
  damages.push([id,100-s.destinyHp]);
  while(s.status==='active')s=resolveRivalTurnV089(s,{command:getRivalCueV089(s).counter,timingMs:2700});
  assert.equal(s.result,'defeat',`${id} wins if player misses every turn`);
 }
 assert(damages.find(([id])=>id==='hasan-piker')[1]>damages.find(([id])=>id==='dan-saltman')[1]);
});

test('signature attack on beat four is specific to each rival',()=>{
 for(const id of ids){
  let s=enterRivalArenaV089(createRivalBattleV089({rivalId:id,mode:'expert'}));
  for(let i=0;i<3;i++)s=resolveRivalTurnV089(s,{command:getRivalCueV089(s).counter,timingMs:100});
  const cue=getRivalCueV089(s);
  assert.equal(cue.isSignature,true);
  assert.equal(cue.label,RIVAL_BY_ID_V089[id].signature.toUpperCase());
  assert.equal(cue.counter,RIVAL_BY_ID_V089[id].sigCommand);
 }
});

test('special attack becomes available by mastery; consumes meter',()=>{
 let s=enterRivalArenaV089(createRivalBattleV089({rivalId:'hasan-piker'}));
 assert.equal(resolveRivalTurnV089(s,{command:'special',timingMs:100}).history[0].hit,false);
 for(let i=0;i<4;i++)s=resolveRivalTurnV089(s,{command:getRivalCueV089(s).counter,timingMs:100});
 assert(s.meter>=60);
 const upgraded=resolveRivalTurnV089(s,{command:'special',timingMs:100});
 assert(upgraded.history.at(-1).special);
 assert(upgraded.history.at(-1).dealt>=37);
 assert(upgraded.meter<s.meter);
});

test('invalid user inputs fail closed and do not damage shared venue state',()=>{
 for(const rivalId of ['unknown',null])assert.throws(()=>createRivalBattleV089({rivalId}));
 assert.throws(()=>createRivalBattleV089({rivalId:'foodshops',mode:'unhinged'}));
 assert.throws(()=>createRivalBattleV089({rivalId:'foodshops',seed:-1}));
 assert.throws(()=>pickRivalInvasionV089({wave:6,seed:-1}));
 const s=enterRivalArenaV089(createRivalBattleV089({rivalId:'foodshops'}));
 for(const timingMs of [NaN,Infinity,-1,3001])assert.throws(()=>resolveRivalTurnV089(s,{command:'show_receipts',timingMs}));
 assert.throws(()=>resolveRivalTurnV089(s,{command:'ban',timingMs:100}));
 assert.equal(s.turn,0);
});

test('simultaneous knockout does not award a false win',()=>{
 const s={...enterRivalArenaV089(createRivalBattleV089({rivalId:'hasan-piker'})),
  destinyHp:1,rivalHp:1,turn:5,meter:85};
 const done=resolveRivalTurnV089(s,{command:'special',timingMs:100});
 assert.equal(done.destinyHp,0);
 assert.equal(done.rivalHp,0);
 assert.equal(done.result,'defeat');
});
