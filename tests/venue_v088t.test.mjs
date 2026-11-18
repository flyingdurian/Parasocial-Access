import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IRLEvent} from '../src/irl-v07.js';
import {IRL_ENDLESS,endlessWaveGuests} from '../src/irl-progression-v085.js';
import {drawTicketClerk,drawVenueMascot,drawPaintedGate} from '../src/venue-rig-v088b.js';
import {MODULAR_TV_BOUNDS,MODULAR_TV_PROJECTION} from '../src/venue-geometry-v088b.js';
import {drawVenueCharacter} from '../src/sprite-animation.js';

const engine=()=>({progress:{irlRecords:{destinyMeet:{attempts:0}}}});
const image={naturalWidth:1536,naturalHeight:1024,complete:true};
function canvas(){
 const calls=[];
 return {calls,globalAlpha:1,save(){calls.push(['save']);},restore(){calls.push(['restore']);},beginPath(){},rect(...x){calls.push(['clipRect',...x]);},clip(){},ellipse(){},fill(){},stroke(){},fillRect(...x){calls.push(['rect',...x]);},drawImage(...x){calls.push(['image',...x]);},fillText(...x){calls.push(['text',...x]);},translate(...x){calls.push(['translate',...x]);},scale(...x){calls.push(['scale',...x]);}};
}

test('six cosplay regulars join original cast with four distinct transparent directional atlases',()=>{
 const e=new IRLEvent(engine());
 assert.deepEqual(e.crowd.filter(g=>g.kind>=36&&g.kind<42).map(g=>g.kind),[36,37,38,39,40,41]);
 const atlas={walk:image,back:{...image},front:{...image},react:{...image}};
 for(const [dir,expected] of [['north','back'],['south','front'],['east','walk'],['west','walk']]){
  const c=canvas();
  drawVenueCharacter(c,null,null,38,'walk',0,0,0,27,34,null,null,null,{direction:dir,stepDistance:9},null,null,null,null,null,null,atlas);
  assert(c.calls.some(call=>call[0]==='image'&&call[1]===atlas[expected]),`${dir} must use ${expected}`);
 }
 const c=canvas();
 drawVenueCharacter(c,null,null,41,'cheer',0,0,0,27,34,null,null,null,{direction:'south'},null,null,null,null,null,null,atlas);
 assert(c.calls.some(call=>call[0]==='image'&&call[1]===atlas.react));
 for(const dir of ['walk','back','front','react']){
  const data=readFileSync(`assets/irl-cosplay-six-${dir}-v088t.webp`);
  assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');
  assert(data.byteLength>100_000,'production artwork is not a placeholder');
 }
});

test('mascot hearts are world-anchored after mirrored drawing and never roam onto stage',()=>{
 const e=new IRLEvent(engine()),c=canvas();
 e.mascot.facing=-1;e.mascot.heartBurst=.9;e.mascot.x=144;e.mascot.y=138;
 drawVenueMascot(c,{mascot:{naturalWidth:150,naturalHeight:160}},e,2000);
 const mirrored=c.calls.findIndex(call=>call[0]==='scale'&&call[1]===-1);
 const restored=c.calls.findIndex((call,i)=>i>mirrored&&call[0]==='restore');
 const firstHeart=c.calls.findIndex(call=>call[0]==='text'&&call[1]==='♥');
 assert(mirrored>=0&&restored>mirrored&&firstHeart>restored,'hearts render after closing the local sprite mirroring transform');
 for(let i=0;i<1400;i++){e.elapsed+=.1;e.mascotTick(.1);assert(e.mascot.y>=122);}
});

test('clerk stays regular-sized and scanner leaves fill vertical door height using baked art',()=>{
 const c=canvas(),clerk={naturalWidth:1774,naturalHeight:887,complete:true};
 drawTicketClerk(c,{clerk,clerkWalk:clerk},{elapsed:8,ticketClerk:{x:179,y:153,walking:true,direction:'south',lastScanAt:-99}});
 assert(c.calls.some(call=>call[0]==='image'&&call.at(-2)===19&&call.at(-1)===35));
 const gateCanvas=canvas(),plate={naturalWidth:1672,naturalHeight:941};
 const closed={elapsed:4,gateControllers:{left:{openedAt:-10,openUntil:-10}}};
 drawPaintedGate(gateCanvas,plate,closed,'left',true);
 assert(gateCanvas.calls.some(call=>call[0]==='clipRect'&&call[2]===182.7&&call[4]===15.9));
 assert(gateCanvas.calls.filter(call=>call[0]==='image').every(call=>call[1]===plate),'no replacement gate sprites');
});

test('new endless wave floods ticket gates, gives more cases, and has a distinct music cue',()=>{
 const e=new IRLEvent(engine(),{mode:'endless'});e.begin();
 assert.equal(e.wave,1);assert.equal(e.cards.length,10);assert.equal(e.waveStartedAt,0);
 for(let i=0;i<30;i++)e.tick(.1);
 assert(e.next>=2,'opening surge injects multiple decision guests through ticket gates');
 e.startNextWave();
 assert.equal(e.wave,2);
 assert(e.crowd.some(p=>p.entryPhase==='enter'&&p.y>210),'newcomers physically enter from gates');
 assert(e.cards.length>=endlessWaveGuests(1)+endlessWaveGuests(2));
 assert.equal(IRL_ENDLESS.maxLiveDecisions,9,'later wave prompt pressure stays bounded');
 const audio=readFileSync('src/audio.js','utf8');
 assert(audio.includes("'convention-wave'"));assert(audio.includes('irlWaveStart(event)'));
});

test('stale pink Q&A bars are gone and broadcast fills the bezel a little more',()=>{
 const ui=readFileSync('src/ui.js','utf8');
 assert(!ui.includes('fillRect(276,44,12,2)'));
 assert(!ui.includes('fillRect(300,50,6,2)'));
 assert(!ui.includes("ctx.fillStyle='#ffae8b';ctx.fillRect"));
 assert(MODULAR_TV_BOUNDS.w>=72&&MODULAR_TV_BOUNDS.h>=33);
 assert(MODULAR_TV_PROJECTION.a>=.72&&MODULAR_TV_PROJECTION.d>=.59);
});
