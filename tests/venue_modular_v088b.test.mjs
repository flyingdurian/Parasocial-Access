import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {MODULAR_GATES,MODULAR_PROPS,MODULAR_BLOCKERS,MODULAR_TV_BOUNDS,MODULAR_TV_PROJECTION,MODULAR_ATLAS} from '../src/venue-geometry-v088b.js';
import {MODULAR_VENUE_FILES,modularVenueReady,modularStageMode,drawModularVenue} from '../src/venue-rig-v088b.js';
import {VENUE_GATES,VENUE_STAGE,VENUE_OBSTACLES,isVenueWalkable} from '../src/venue-nav.js';
const asset=name=>new URL('../assets/'+name,import.meta.url);

test('seven modular assets keep the empty stage and independent entrance/booth layers',()=>{
 const names=Object.values(MODULAR_VENUE_FILES);
 assert.equal(names.length,7);
 for(const file of names){
  const url=asset(file);assert(existsSync(url),file);
  assert.equal(readFileSync(url).toString('ascii',8,12),'WEBP',file);
  assert(file.includes('vibrant-v088b')||file.includes('v088c'));
 }
});

test('every independent booth shares hitbox coordinates with the navigation map',()=>{
 assert.equal(VENUE_OBSTACLES,MODULAR_BLOCKERS);
 for(const name of ['merch','food','vending','photo','checkin']){
  const p=MODULAR_PROPS[name],hit=VENUE_OBSTACLES.find(o=>o.name===name);
  assert(hit&&p.solid);
  assert(hit.x>=p.x&&hit.y>=p.y&&hit.x+hit.w<=p.x+p.w+2&&hit.y+hit.h<=p.y+p.h+3);
 }
 for(const side of ['left','right']){
  const gate=MODULAR_GATES[side];
  assert.equal(VENUE_GATES[side],gate);
  assert(gate.check[0]+13>=gate.art.x&&gate.check[0]+13<=gate.art.x+gate.art.w);
  assert(!isVenueWalkable(...gate.check),side+' unauthorized');
  assert(isVenueWalkable(...gate.check,true),side+' badge verified');
  assert(isVenueWalkable(...gate.inside,true),side+' reached inside');
 }
 assert(!isVenueWalkable(211,115),'velvet rope blocks off-lane crossing');
 assert(isVenueWalkable(260,115),'center guest aisle remains walkable');
 assert(VENUE_STAGE.debate[0]<VENUE_STAGE.stairs[0]&&VENUE_STAGE.exchange[0]>VENUE_STAGE.stairs[0]);
 assert.equal(VENUE_STAGE.exchange[1],55,'fan waits in front of the signing table after the stairs');
});

test('LCD projection fits inside the re-anchored empty stage shell',()=>{
 const s=MODULAR_PROPS.stage,tv=MODULAR_TV_BOUNDS;
 assert(tv.x>=s.x&&tv.y>=s.y&&tv.x+tv.w<=s.x+s.w&&tv.y+tv.h<=s.y+s.h);
 const m=MODULAR_TV_PROJECTION;
 assert(m.e>=tv.x&&m.f>=tv.y);
 assert(m.e+100*m.a>=tv.x&&m.e+100*m.a<=tv.x+tv.w+2);
 assert(!('fixedFurniture' in MODULAR_PROPS),'all chairs and desks removed for v0.8.8d');
 assert.equal(modularStageMode({departures:[]}), 'fixed');
 assert.equal(modularStageMode({departures:[{stageVisit:'exchange',debater:true}]}),'fixed');
 assert.equal(modularStageMode({departures:[{stageVisit:'exchange',debater:false}]}),'fixed');
});
function mockCtx(){
 const calls=[];let depth=0;
 const ctx={
  calls,get depth(){return depth;},
  save(){depth++;},restore(){depth--;assert(depth>=0);},
  drawImage(...args){calls.push({type:'image',args});},
  createLinearGradient(){return {addColorStop(){}};},
  beginPath(){},rect(){},clip(){},fillRect(){},fillText(){},translate(){},transform(){},moveTo(){},lineTo(){},quadraticCurveTo(){},stroke(){},ellipse(){},fill(){},rotate(){}
 };
 return ctx;
}
test('gate hardware stays fixed while only glass flaps change state',()=>{
 const image={complete:true,naturalWidth:1700,naturalHeight:941};
 const images=Object.fromEntries(Object.keys(MODULAR_VENUE_FILES).map(k=>[k,image]));
 assert(modularVenueReady(images));
 const idle={elapsed:0,gateControllers:{left:{openedAt:-10,openUntil:-10},right:{openedAt:-10,openUntil:-10}},departures:[]};
 const ctx=mockCtx();
 assert(drawModularVenue(ctx,images,idle,0));
 assert.equal(ctx.depth,0);
 assert(ctx.calls.filter(c=>c.args[1]===MODULAR_ATLAS.gate.open.x&&c.args[3]===MODULAR_ATLAS.gate.open.w).length===2);
 assert.equal(Object.prototype.hasOwnProperty.call(images,'furniture'),false);
 const admitted={...idle,elapsed:3,gateControllers:{left:{openedAt:2.5,openUntil:5},right:idle.gateControllers.right},
  departures:[{stageVisit:'exchange',debater:true}]};
 const open=mockCtx();drawModularVenue(open,images,admitted,0);
 assert.equal(open.depth,0);
 assert(open.calls.filter(c=>c.args[1]===MODULAR_ATLAS.gate.open.x&&c.args[3]===MODULAR_ATLAS.gate.open.w).length===2);
 assert.equal(ctx.calls.length,open.calls.length,'gate open never swaps architectural source frames');
});


test('v0.8.8d decision cards cannot introduce nested scrollbars',()=>{
 const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
 const sandbox=readFileSync(new URL('../src/irl-sandbox-v085.css',import.meta.url),'utf8');
 assert(css.includes('v0.8.8d: restore fast, fully readable decisions'));
 assert(sandbox.includes('v0.8.8d: non-scrollable'));
 assert(/\.irl-world-speech\{[^}]*overflow-y:visible/.test(css));
 assert(/\.harness-prompt\{[^}]*overflow-y:visible/.test(sandbox));
});
