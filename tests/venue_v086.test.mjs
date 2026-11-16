import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {VENUE_GATES,VENUE_STAGE,isVenueWalkable,venueRoamPoint,venueRoute,moveVenue} from '../src/venue-nav.js';
import {normalizeGraphics,saveGraphics,loadGraphics} from '../src/graphics-v082.js';
import {venueSpriteGeometry} from '../src/sprite-animation.js';

const engine=()=>({progress:{credits:0,irlRecords:{},creators:{destiny:{xp:0}}},save(){}});
const step=(event,count=500,callback=()=>{})=>{for(let i=0;i<count&&event.mode==='playing';i++){event.tick(.1);callback(event);}};

test('roam targets span the full connected venue while respecting props',()=>{
 const points=Array.from({length:250},(_,i)=>venueRoamPoint(i*109+19));
 assert(points.every(([x,y])=>isVenueWalkable(x,y)));
 assert(Math.min(...points.map(p=>p[0]))<40&&Math.max(...points.map(p=>p[0]))>325);
 assert(Math.min(...points.map(p=>p[1]))<95&&Math.max(...points.map(p=>p[1]))>135);
 for(const dest of points.slice(0,50)){const end=venueRoute(100,130,...dest).at(-1);assert(Math.hypot(end[0]-dest[0],end[1]-dest[1])<2);}
});
test('gate only unlocks after ticket pose; returns closed when cleared',()=>{
 const e=new IRLEvent(engine());e.begin();e.add({throughGate:true});
 const guest=e.arrivals[0],gate=guest.gate;
 assert.equal(e.gateControllers[gate.id].openUntil,-10);
 let ticket=false,opened=false;
 step(e,270,()=>{ticket ||=guest.entryPhase==='ticket';opened ||=e.gateControllers[gate.id].openUntil>e.elapsed;});
 assert(ticket&&opened);
 assert.equal(e.gateControllers[gate.id].openUntil<e.elapsed,true);
});
test('welcomed photo fan meets host, triggers screen and rejoins venue',()=>{
 const e=new IRLEvent(engine());e.begin();e.add();const g=e.selected;g.type='welcome';e.resolve(g,true,'welcome');e.next=e.cards.length;
 let picture=false,flash=false;
 step(e,520,()=>{picture ||=e.tvEvent?.type==='photo';flash ||=e.cameraFlashes.length>0;});
 assert(picture&&flash);assert.equal(e.stageCompleted,1);
 assert(e.crowd.some(c=>c.id===1000+g.serial));
});
test('critic gets an arcade debate TV outcome with host returning center',()=>{
 const e=new IRLEvent(engine());e.begin();e.add();const g=e.selected;g.type='debate';g.name='Friendly Debate Critic';e.resolve(g,true,'debate');e.next=e.cards.length;
 let result=false,center=false;
 step(e,500,()=>{if(e.tvEvent?.type==='debate')result=true;if(e.departures.some(v=>v.stageVisit==='exchange')&&Math.abs(e.hostX-260)<3)center=true;});
 assert(result&&center);
 assert(VENUE_STAGE.debate[0]<VENUE_STAGE.stairs[0]);
});
test('security removal exits permanently and never reenters ambient crowd',()=>{
 const e=new IRLEvent(engine());e.begin();e.add();const g=e.selected;g.type='security';
 assert(e.action('security'));e.next=e.cards.length;
 let evicted=false,gateOpened=false;
 step(e,750,()=>{evicted ||=e.departures.some(d=>d.stageVisit==='evicted');gateOpened ||=Object.values(e.gateControllers).some(v=>v.openUntil>e.elapsed);});
 assert(evicted&&gateOpened);assert(!e.departures.some(d=>d.id===g.id));
 assert(!e.crowd.some(c=>c.id===1000+g.serial));
});
test('walk frame stops at feet with negligible bob, audio mute and CRT persist',()=>{
 const actor={x:100,y:130,facing:1};moveVenue(actor,105,130,.1,25);assert(actor.walking);
 for(let i=0;i<20;i++)moveVenue(actor,105,130,.1,25);
 assert(!actor.walking&&actor.stepDistance===0);
 const geometry=venueSpriteGeometry(100,160,30,40,{walking:true,stepDistance:1.5});
 assert(geometry.bob<.2);assert(geometry.footY===200);
 const storage={value:'',getItem(){return this.value;},setItem(_k,v){this.value=v;}};
 saveGraphics({crt:true,chatterMuted:true},storage);
 assert(loadGraphics(storage).crt&&loadGraphics(storage).chatterMuted);
 assert(!normalizeGraphics({}).crt&&!normalizeGraphics({}).chatterMuted);
});
test('renderer keeps chatter and emotes exclusive, supports world-space effects',()=>{
 const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
 const harness=readFileSync(new URL('../src/irl-sandbox-v085.js',import.meta.url),'utf8');
 const effects=readFileSync(new URL('../src/venue-effects-v086.js',import.meta.url),'utf8');
 assert.match(ui,/!roomIsSpeaking&&g\.emoteTime>0/);
 assert.match(harness,/!roomIsSpeaking&&g\.speechTime<=0&&g\.emoteTime>0/);
 assert.match(ui,/irl\.elapsed>=10/);
 for(const source of [ui,harness])for(const functionName of ['drawVenueRush','drawVenueGates','drawVenueScreens','drawCameraFlashes','applyVenueCRT'])assert(source.includes(functionName));
 assert.match(effects,/DEBATE/);assert.match(effects,/SIGNED/);
});
