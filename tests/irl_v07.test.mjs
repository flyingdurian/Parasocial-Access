import assert from 'node:assert/strict';
import {IRLEvent,IRL_SCENARIOS} from '../src/irl-v07.js';
let checks=0;
function ok(x,m){assert.ok(x,m);checks++;}
const fresh=()=>({progress:{credits:120,irlRecords:{},creators:{destiny:{xp:0}}},save(){this.saved=(this.saved||0)+1;}});
ok(IRL_SCENARIOS.length>=30,'scenario pool contains variety');
ok(new Set(IRL_SCENARIOS.map(x=>x[1])).size===IRL_SCENARIOS.length,'unique character titles');
ok(IRL_SCENARIOS.filter(x=>x[0]==='welcome').length>=12,'many benign cases');
for(let seed=0;seed<100;seed++){
 const engine=fresh();engine.progress.irlRecords.destinyMeet={best:0,stars:0,attempts:seed};
 const scene=new IRLEvent(engine);ok(scene.cards.length===20,'20 arrivals per run');
 ok(new Set(scene.cards.map(x=>x[1])).size===20,'no repeated character within run');
 ok(scene.cards.slice(0,6).every(x=>x[0]!=='security'),'doors open has no hidden danger');
 const copy=new IRLEvent(engine);ok(JSON.stringify(scene.cards)===JSON.stringify(copy.cards),'same record => same sequence');
 scene.begin();let ticks=0;
 while(scene.mode==='playing'&&ticks++<4000){
   scene.tick(.1);
   const g=scene.selected;
   if(g){if(g.type==='security')scene.action('security');else scene.action(g.type);}
 }
 ok(ticks<4000,'event terminates');ok(scene.result?.clear,'perfect operator completes');
 ok(scene.result.stars===3,'perfect star award');ok(scene.result.correct===20,'all attendees handled');
 ok(scene.result.errors===0&&scene.result.lost===0,'no mistaken/forgotten guests');
 ok(engine.progress.irlRecords.destinyMeet.attempts===seed+1,'recorded attempt');
 ok(engine.progress.credits>120&&engine.progress.creators.destiny.xp>0,'rewards granted');
 ok(engine.saved===1,'single persisted completion');
}
// Non-danger false positives should cost reputation, but not immediately end play.
{
 const engine=fresh(),scene=new IRLEvent(engine);scene.begin();scene.add();
 const start=scene.vibe;scene.action('security');ok(scene.mode==='playing','wrongly escalating a normal fan not instant death');ok(scene.available===2,'one guard temporarily occupied');
 let t=0;while(scene.finished.length===0&&t++<60)scene.tick(.1);ok(scene.vibe<start,'false alarm harms trust');ok(scene.finished.length===1,'guard reached the selected visitor');
}
// Credible explicit threat, not criticism, is the critical event class.
{
 const engine=fresh(),scene=new IRLEvent(engine);scene.begin();
 const s=IRL_SCENARIOS.find(x=>x[0]==='security');scene.visitors=[{id:'risk',type:s[0],name:s[1],text:s[2],cue:s[3],check:s[4],age:0,life:23,x:100,y:150,slot:0,kind:5}];scene.focus='risk';
 scene.action('welcome');for(let i=0;i<50&&scene.mode==='playing';i++)scene.tick(.1);ok(scene.mode==='results'&&!scene.result.clear,'unanswered credible warning cancels event');ok(scene.result.stars===0,'failure earns zero stars');
}
// Pause freezes phase timer and arrivals without consuming a resource.
{
 const scene=new IRLEvent(fresh());scene.begin();const initialClock=scene.clock;scene.paused=true;scene.tick(20);
 ok(scene.elapsed===0&&scene.clock===initialClock&&scene.next===0,'manual pause holds simulation');
}
console.log('OFF THE FEED v0.7 GREEN:',checks,'checks / 100 perfect 20-person events / failure and trust / deterministic scenarios / progression');
