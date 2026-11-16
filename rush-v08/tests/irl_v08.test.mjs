import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';

let checks=0;
const ok=(condition,description)=>{assert.ok(condition,description);checks++;};
const fresh=()=>({progress:{credits:0,irlRecords:{},creators:{destiny:{xp:0}}},save(){}});

// One active person has a stable primary identity even as the venue fills.
for(let seed=0;seed<80;seed++){
 const game=fresh();game.progress.irlRecords.destinyMeet={best:0,stars:0,attempts:seed};
 const scene=new IRLEvent(game);scene.begin();scene.add();
 const primary=scene.focus;
 for(let i=0;i<3;i++)scene.add();
 ok(scene.focus===primary,'new arrivals must not replace an unread primary');
 ok(scene.selected?.id===primary,'selected guest matches primary');
 const action=scene.selected.type;
 ok(scene.action(action),'chosen action successfully dispatches a worker');
 ok(scene.focus!==primary,'primary moves only after an explicit dispatch');
 ok(scene.visitors.find(x=>x.id===primary).pending,'dispatched guest remains visible while staff approaches');
 const next=scene.focus;for(let i=0;i<9;i++)scene.tick(.1);
 ok(scene.focus===next,'other people and staff movement do not dislodge the next selected guest');
}

// VERIFY is not a disguised information-reveal; even an inappropriate verify
// must visibly send a worker and resolve as an incorrect action.
{
 const scene=new IRLEvent(fresh());scene.begin();scene.add();
 ok(scene.selected.type==='welcome','opening guest is ordinary');
 ok(scene.action('check'),'verify dispatch returns success');
 ok(scene.visitors[0].pending,'verify worker is en route');
 for(let i=0;i<40&&scene.finished.length===0;i++)scene.tick(.1);
 ok(scene.finished.length===1,'verify choice resolves');
 ok(scene.finished[0].success===false,'inappropriate verification costs trust');
 ok(scene.effects.some(e=>e.text.includes('WRONG CALL')),'negative result appears above person');
}

// Scene is the primary interaction surface; old ticket UI is absent.
const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
ok(ui.includes('id="irl-world-speech"'),'world-space guest speech markup');
ok(ui.includes('id="irl-speech-cue"'),'visual cue rendered beside speech');
ok(!ui.includes('id="irl-guest"'),'bottom text-based review card removed');
ok(css.includes('.irl-canvas-wrap{position:relative'),'speech bound to scene');
ok(ui.includes('irl.crowd.map(person=>({person,role:\'crowd\''),'distinct ambient sprites participate in the shared foot-depth rendering order');

console.log('OFF THE FEED v0.8 GREEN:',checks,'checks / 80 attention-stability seeds / contextual actions / world dialogue');
