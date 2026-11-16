import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {MODULAR_GATES,MODULAR_PROPS,MODULAR_BLOCKERS,MODULAR_TV_BOUNDS,MODULAR_TV_PROJECTION,MODULAR_ATLAS} from '../src/venue-geometry-v088b.js';
import {MODULAR_VENUE_FILES,modularVenueReady,modularStageMode,drawModularVenue,drawModularTV} from '../src/venue-rig-v088b.js';
import {VENUE_GATES,VENUE_STAGE,VENUE_OBSTACLES,isVenueWalkable} from '../src/venue-nav.js';
const asset=name=>new URL('../assets/'+name,import.meta.url);

test('five live modular assets include the clean plate, stage and unified entrance',()=>{
 const names=Object.values(MODULAR_VENUE_FILES);
 assert.equal(names.length,5);
 for(const file of names){
  const url=asset(file);assert(existsSync(url),file);
  assert.equal(readFileSync(url).toString('ascii',8,12),'WEBP',file);
  assert(file.includes('vibrant-v088b')||file.includes('v088c')||file.includes('v088e'));
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
 assert(!isVenueWalkable(232,117),'stage-queue rope blocks its visible lower-left stanchion');
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
 assert(!('fixedFurniture' in MODULAR_PROPS),'all chairs and desks removed for v0.8.8e');
 assert.equal(modularStageMode({departures:[]}), 'fixed');
 assert.equal(modularStageMode({departures:[{stageVisit:'exchange',debater:true}]}),'fixed');
 assert.equal(modularStageMode({departures:[{stageVisit:'exchange',debater:false}]}),'fixed');
});
function mockCtx(){
 const calls=[],fillRects=[];let depth=0;
 const ctx={
  calls,fillRects,get depth(){return depth;},
  save(){depth++;},restore(){depth--;assert(depth>=0);},
  drawImage(...args){calls.push({type:'image',args});},
  createLinearGradient(){return {addColorStop(){}};},
  beginPath(){},rect(){},clip(){},fillRect(...args){fillRects.push(args)},fillText(){},translate(){},transform(){},moveTo(){},lineTo(){},quadraticCurveTo(){},stroke(){},ellipse(){},fill(){},rotate(){}
 };
 return ctx;
}
test('gate posts never translate between open/closed states; only glass flaps retract',()=>{
 const images=Object.fromEntries(Object.keys(MODULAR_VENUE_FILES).map(k=>[k,{complete:true,naturalWidth:1700,naturalHeight:941,key:k}]));
 assert(modularVenueReady(images));
 const idle={elapsed:0,gateControllers:{left:{openedAt:-10,openUntil:-10},right:{openedAt:-10,openUntil:-10}},effects:[],departures:[]};
 const closed=mockCtx(),opened=mockCtx();
 assert(drawModularVenue(closed,images,idle,0));
 const admitted={...idle,elapsed:3,gateControllers:{left:{openedAt:2.5,openUntil:5},right:idle.gateControllers.right}};
 assert(drawModularVenue(opened,images,admitted,0));
 assert.equal(closed.depth,0);assert.equal(opened.depth,0);
 assert.equal(closed.calls.length,opened.calls.length,'only static image layers are drawn');
 assert.equal(closed.calls.filter(c=>c.args[0]===images.entrance).length,1,'unified perimeter is one immutable bitmap');
 assert.deepEqual(closed.calls,opened.calls,'never change any architectural drawImage positions or crops');
 assert(closed.fillRects.length>opened.fillRects.length,'open state retracts its glass flaps');
 assert(!('gate' in images)&&!('checkin' in images)&&!('planters' in images),'legacy entrance layers removed');
});

test('TV crop uses exactly one real guest cell, not the cast atlas Destiny cell',()=>{
 const ctx=mockCtx();
 const host={naturalWidth:400,naturalHeight:200},cast={naturalWidth:400,naturalHeight:300};
 drawModularTV(ctx,{tvEvent:{type:'photo',guestKind:5,ttl:1}},0,{host,cast,poses:{}});
 const portraits=ctx.calls.filter(c=>c.args[0]===host||c.args[0]===cast);
 assert.equal(portraits.length,2,'exactly one host and one fan');
 const fan=portraits.find(c=>c.args[0]===cast);
 assert.deepEqual(fan.args.slice(1,5),[100,100,100,100],'fan portrait uses the guest row/column');
});

test('v0.8.8e reverts compact guest cards with no nested scrollbars',()=>{
 const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
 const sandbox=readFileSync(new URL('../src/irl-sandbox-v085.css',import.meta.url),'utf8');
 assert(css.includes('v0.8.8e: restore the compact v0.8.7 guest card benchmark'));
 assert(sandbox.includes('v0.8.8e: compact original-size venue review card'));
 assert(/\.irl-world-speech\{[^}]*overflow-y:visible/.test(css));
 assert(/\.harness-prompt\{[^}]*overflow-y:visible/.test(sandbox));
});

test('dggL cutout is an actual transparent WebP asset',()=>{
 const path=asset('irl-dggl-v088e.webp');assert(existsSync(path));
 assert.equal(readFileSync(path).toString('ascii',8,12),'WEBP');
});
