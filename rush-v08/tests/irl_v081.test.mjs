import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent,IRL_SCENARIOS} from '../src/irl-v07.js';

const fresh=()=>({progress:{credits:0,irlRecords:{},creators:{destiny:{xp:0}}},save(){}});
const scene=()=>{
 const event=new IRLEvent(fresh());
 event.begin();
 event.add();
 event.nextArrival=999;
 return event;
};

// The audience visits real stations rather than oscillating in place.
{
 const event=scene();
 for(let i=0;i<600;i++)event.crowdTick(.1);
 assert.ok(event.crowd.some(person=>person.visits>1));
 assert.ok(event.crowd.every(person=>Number.isFinite(person.x)&&Number.isFinite(person.y)));
 assert.ok(event.crowdMoments>0);
}

// Orders must queue while workers are occupied, without losing the selected guest.
{
 const event=scene(),id=event.selected.id;
 event.staff.forEach(worker=>{worker.task={guestId:'already-busy',action:'welcome',travel:20};});
 assert.equal(event.action('welcome'),true);
 assert.equal(event.dispatchQueue.length,1);
 assert.ok(event.visitors.find(person=>person.id===id)?.pending);
 event.staff[0].task=null;
 event.dispatchOrders();
 assert.equal(event.dispatchQueue.length,0);
 assert.equal(event.staff[0].task?.guestId,id);
}

// Guard availability reflects actual cooldown/task state and accepts queued orders.
{
 const event=scene(),id=event.selected.id;
 event.guardPositions.forEach(guard=>{guard.cooldown=5;});
 assert.equal(event.available,0);
 assert.equal(event.action('security'),true);
 assert.equal(event.dispatchQueue.length,1);
 event.guardPositions[0].cooldown=0;
 event.dispatchOrders();
 assert.equal(event.guardPositions[0].task?.guestId,id);
 assert.equal(event.dispatchQueue.length,0);
}

// Staff visibly escort a resolved guest to a venue destination.
{
 const event=scene(),type=event.selected.type;
 assert.equal(event.action(type),true);
 for(let i=0;i<110&&!event.finished.length;i++)event.tick(.1);
 assert.equal(event.finished.length,1);
 assert.equal(event.finished[0].success,true);
 assert.ok(event.departures[0]?.station);
 assert.ok(event.departures[0]?.stageVisit==='queued'||event.departures[0]?.stageVisit==='approach'||event.staff.some(worker=>worker.task?.phase==='escort')||event.guardPositions.some(worker=>worker.task?.phase==='escort'));
}

// The synced deployment has new event writing, soundtrack and mobile safeguards.
assert.ok(IRL_SCENARIOS.some(row=>row[1]==='Source Wall Organizer'));
const audio=readFileSync(new URL('../src/audio.js',import.meta.url),'utf8');
const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
assert.match(audio,/irlDispatch\(action\)/);
assert.match(audio,/convention:\{bpm:/);
assert.match(ui,/sound\.setMode\('convention'\)/);
assert.match(ui,/irl-danger/);
assert.match(css,/safe-area-inset-bottom/);
assert.match(css,/\.irl-canvas-wrap\{aspect-ratio:4\/3\}/);

console.log('IRL v0.8.1 synced behavior: PASS');
