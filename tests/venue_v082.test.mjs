import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {VENUE_STATIONS,isVenueWalkable,venueRoute,moveVenue} from '../src/venue-nav.js';
import {graphicsCanvasScale,normalizeGraphics,saveGraphics} from '../src/graphics-v082.js';
import {poseFrame,stageAction} from '../src/sprite-animation.js';
import {DESTINY_IRL_SCENARIOS,ambientLine} from '../src/irl-lore-v082.js';
import {IRLEvent} from '../src/irl-v07.js';

const places=Object.values(VENUE_STATIONS);
for(const a of places)for(const b of places){
 assert.ok(isVenueWalkable(...a)&&isVenueWalkable(...b),'every station is on the floor');
 const route=venueRoute(...a,...b);
 const actor={x:a[0],y:a[1]};
 for(let i=0;i<300&&Math.hypot(actor.x-b[0],actor.y-b[1])>1.5;i++){
  moveVenue(actor,...b,.1,65);
  assert.ok(isVenueWalkable(actor.x,actor.y),'moving actor must not cross a wall, stage or counter');
 }
 assert.ok(Math.hypot(actor.x-b[0],actor.y-b[1])<1.6,'every pair of venue stations must connect');
 assert.ok(route.length>0);
}

assert.ok(graphicsCanvasScale({mode:'bilinear',pixelStrength:35})>2.5);
assert.equal(graphicsCanvasScale({mode:'nearest',pixelStrength:100}),1);
assert.deepEqual(normalizeGraphics({mode:'invalid',pixelStrength:900,showNav:'true'}),{mode:'bilinear',pixelStrength:100,showNav:true,texture:'off',textureStrength:25,chaos:false,crt:false,chatterMuted:false});
const store=new Map(),fakeStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
assert.equal(saveGraphics({mode:'nearest',pixelStrength:15},fakeStorage).pixelStrength,15);
assert.ok([...Array(12)].every((_,kind)=>poseFrame('walk',300,kind)>=0&&poseFrame('walk',300,kind)<8));
assert.notEqual(stageAction(1,0),stageAction(1,3));
assert.ok(DESTINY_IRL_SCENARIOS.length>=18);
assert.match(ambientLine('mic',1),/sample|context|PepoThink/i);

const engine={progress:{credits:0,irlRecords:{},creators:{destiny:{xp:0}}},save(){}};
const event=new IRLEvent(engine);event.begin();
assert.ok(event.cards.length>=20);
assert.ok(Math.max(...event.crowd.map(p=>p.x))-Math.min(...event.crowd.map(p=>p.x))>260,'crowd starts distributed across venue');
for(let i=0;i<event.crowd.length;i++)for(let j=i+1;j<event.crowd.length;j++){
 const a=event.crowd[i],b=event.crowd[j];
 assert.ok(Math.abs(a.x-b.x)>=26||Math.abs(a.y-b.y)>=31,'attendees should not start in a stacked pile');
}
for(let i=0;i<80;i++)event.crowdTick(.1);
assert.ok(event.crowd.every(p=>isVenueWalkable(p.x,p.y)));

const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
assert.match(ui,/setupGraphicsCanvas\(canvas,graphics\)/);
assert.match(ui,/stageAction\(irl\.phase/);
assert.match(ui,/createGraphicsPanel\(/);
for(const name of ['host','photographer','security'])
 assert.ok(existsSync(new URL('../assets/irl-'+name+'-poses.webp',import.meta.url)),'animated pose asset: '+name);
console.log('VENUE v0.8.2 NAV/GRAPHICS/ANIMATION/LORE: PASS');
