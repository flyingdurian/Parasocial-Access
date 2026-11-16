import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {MODULAR_GATES,MODULAR_PROPS,MODULAR_BLOCKERS,MODULAR_TV_BOUNDS,MODULAR_TV_PROJECTION,MODULAR_ATLAS} from '../src/venue-geometry-v088b.js';
import {MODULAR_VENUE_FILES,modularVenueReady,modularStageMode,drawModularVenue} from '../src/venue-rig-v088b.js';
import {VENUE_GATES,VENUE_STAGE,VENUE_OBSTACLES,isVenueWalkable} from '../src/venue-nav.js';
const asset=name=>new URL('../assets/'+name,import.meta.url);

test('seven modular assets mix stable hall/booths with corrected entrance and stage',()=>{
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
 assert(VENUE_STAGE.debate[0]<VENUE_STAGE.stairs[0]&&VENUE_STAGE.exchange[0]>VENUE_STAGE.stairs[0]);
 assert.equal(VENUE_STAGE.exchange[1],55,'fan waits in front of the signing table after the stairs');
});

test('LCD content and stage furnishings sit inside the modular stage shell',()=>{
 const s=MODULAR_PROPS.stage,tv=MODULAR_TV_BOUNDS;
 assert(tv.x>=s.x&&tv.y>=s.y&&tv.x+tv.w<=s.x+s.w&&tv.y+tv.h<=s.y+s.h);
 const m=MODULAR_TV_PROJECTION;
 assert(m.e>=tv.x&&m.f>=tv.y);
 assert(m.e+100*m.a>=tv.x&&m.e+100*m.a<=tv.x+tv.w+2);
 for(const name of ['fixedFurniture']){
  const p=MODULAR_PROPS[name];
  assert(p.x>=s.x&&p.y>=s.y&&p.x+p.w<=s.x+s.w&&p.y+p.h<=s.y+s.h);
  assert(p.y+p.h<=84,'permanent debate desks must leave central stairs visually accessible');
 }
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
  beginPath(){},rect(){},clip(){},fillRect(){},fillText(){},translate(){},transform(){},moveTo(){},lineTo(){},stroke(){},ellipse(){},fill(){},rotate(){}{}
 };
 return ctx;
}
test('closed/open badge gates render distinctly while stage furniture remains fixed',()=>{
 const image={complete:true,naturalWidth:1700,naturalHeight:941};
 const images=Object.fromEntries(Object.keys(MODULAR_VENUE_FILES).map(k=>[k,image]));
 assert(modularVenueReady(images));
 const idle={elapsed:0,gateControllers:{left:{openedAt:-10,openUntil:-10},right:{openedAt:-10,openUntil:-10}},departures:[]};
 const ctx=mockCtx();
 assert(drawModularVenue(ctx,images,idle,0));
 assert.equal(ctx.depth,0);
 assert(ctx.calls.some(c=>c.args[1]===MODULAR_ATLAS.gate.closed.x&&c.args[3]===MODULAR_ATLAS.gate.closed.w));
 assert(ctx.calls.some(c=>c.args[1]===MODULAR_ATLAS.debate.x&&c.args[3]===MODULAR_ATLAS.debate.w));
 const admitted={...idle,elapsed:3,gateControllers:{left:{openedAt:2.5,openUntil:5},right:idle.gateControllers.right},
  departures:[{stageVisit:'exchange',debater:true}]};
 const open=mockCtx();drawModularVenue(open,images,admitted,0);
 assert.equal(open.depth,0);
 assert(open.calls.some(c=>c.args[1]===MODULAR_ATLAS.gate.open.x&&c.args[3]===MODULAR_ATLAS.gate.open.w));
 assert(open.calls.some(c=>c.args[1]===MODULAR_ATLAS.debate.x&&c.args[3]===MODULAR_ATLAS.debate.w));
 assert.equal(ctx.calls.length,open.calls.length,'no stage furniture swap or duplicate on debate');
});
