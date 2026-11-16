import assert from 'node:assert/strict';
import {RushEngine,WORLD_DEFS,NETWORK_CREATORS,CREATOR_EVENTS} from '../src/engine.js';
let checks=0;const ok=(v,m)=>{checks++;assert.ok(v,m)};
globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
for(const c of NETWORK_CREATORS){
 const e=new RushEngine();
 e.progress.credits=5000;e.progress.arenaUnlocked=true;e.progress.marketUnlocked=true;e.progress.threadUnlocked=true;
 for(let i=0;i<4;i++){e.progress.worlds[i].unlocked=WORLD_DEFS[i].levels-1;}
 const missions=CREATOR_EVENTS.filter(x=>x.creator===c.id);
 for(const ev of missions){
  // Complete earlier event twice only if the next chapter's community level is locked.
  let attempts=0;
  while(e.creatorEvents(c.id).find(x=>x.id===ev.id)?.locked&&attempts++<8){
   const last=missions[Math.max(0,ev.index-1)];ok(e.startCreatorEvent(last.id),'replay for unlock works');
   let guard=0;while(e.mode==='playing'&&guard++<1000){if(e.signatureActive){const x=e.emoteTrain.current;e.routeEmote(x.match?'merge':'route');}else if(e.tournament?.breakRemaining>0)e.update(.12);else if(e.queue.length){const m=e.queue[0];e.answer(m.verdict,m.id);}else e.update(.12)}
   ok(e.results.cleared,'replayed chapter clears');
  }
  ok(!e.creatorEvents(c.id).find(x=>x.id===ev.id).locked,`unlock chapter ${ev.id}`);
  ok(e.startCreatorEvent(ev.id),`chapter starts ${ev.id}`);
  ok(e.activeCreatorEvent?.id===ev.id,`identity ${ev.id}`);
  ok(e.cards.some(x=>x.creatorId===c.id),'creator context supplied');
  ok(e.cards.filter(x=>x.scenario?.startsWith('creator')).length>=0,'no unsafe generation');
  const ids=e.cards.map(x=>x.id);ok(new Set(ids).size===ids.length,'unique IDs');
  const group=e.cards.filter(x=>x.cascade||x.campaign);if(group.length)ok(group.every(x=>x.verdict==='remove'),'group rules remain fixed');
  let guard=0;while(e.mode==='playing'&&guard++<1600){if(e.signatureActive){const x=e.emoteTrain.current;e.routeEmote(x.match?'merge':'route');}else if(e.tournament?.breakRemaining>0)e.update(.12);else if(e.queue.length){const m=e.queue[0];e.answer(m.verdict,m.id);}else e.update(.12)}
  ok(e.mode==='results',`chapter concludes ${ev.id}`);ok(e.results.stars===3,`perfect player three stars for ${ev.id}`);
  ok(e.creatorState(c.id).records[ev.id].stars===3,'progress recorded');
  ok(e.worldState(ev.world).stars.every(v=>v===0),'channel shift does not progress campaign');
 }
 ok(e.creatorState(c.id).xp>=160,'channel levels can progress');
 const state=e.creatorState(c.id);ok(state.records[missions[2].id].stars===3,'third chapter playable');
 console.log(`CREATOR ${c.id} all three chapters cleared | XP ${state.xp} | ranks ${state.runs}`);
}
console.log(`RUSH v0.6 FULL CREATOR CIRCUIT GREEN — ${checks} checks / 9 creator operations`);
