import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {venueDebateAudienceSpot,isVenueWalkable} from '../src/venue-nav.js';
import {MODULAR_STAGE,MODULAR_GATES} from '../src/venue-geometry-v088b.js';
import {wrapMeasuredText,drawDebateShout} from '../src/irl-atmosphere-v083.js';
import {drawTicketClerk,drawStageDebateUplight} from '../src/venue-rig-v088b.js';
import {drawVenueFeedback} from '../src/venue-effects-v086.js';
import {createResilientAnimationLoop} from '../src/venue-frame-loop-v088r.js';
import {IRLEvent} from '../src/irl-v07.js';

const canvas=()=>{
 const calls=[];
 return {calls,globalAlpha:1,save(){},restore(){},beginPath(){},closePath(){},fill(){},stroke(){},clip(){},rect(){},moveTo(){},lineTo(){},rotate(){},translate(){},
  fillRect(...a){calls.push(['rect',...a]);},strokeRect(){},ellipse(...a){calls.push(['ellipse',...a]);},fillText(...a){calls.push(['text',...a]);},drawImage(...a){calls.push(['image',...a]);},
  measureText(text){return {width:String(text).length*3}},createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}};
};

test('stage semicircle uses feet not sprite origin and extends around the stair apron',()=>{
 const slots=Array.from({length:36},(_,index)=>venueDebateAudienceSpot(index));
 const feet=slots.map(([x,y])=>[x+16,y+35]);
 assert.equal(new Set(slots.map(p=>p.join(','))).size,36);
 assert(slots.every(p=>isVenueWalkable(...p)));
 assert(feet.some(([x,y])=>x<195&&y<120),'left stage wing must be occupied');
 assert(feet.some(([x,y])=>x>335&&y<120),'right stage wing must be occupied');
 assert(feet.some(([x,y])=>x>245&&x<285&&y>130),'curved outer center row must exist');
 assert(feet.every(([,y])=>y>=100&&y<=140),'no debate crowd may assemble at front entrance');
});

test('debater shoes land alongside Destiny on the illustrated front stage',()=>{
 const hostFeet=36+39,challengerFeet=MODULAR_STAGE.debate[1]+37;
 assert(Math.abs(hostFeet-challengerFeet)<=4);
 assert(challengerFeet>=74&&challengerFeet<=82);
});

test('comic dialogue never splits a word across lines even with narrow text width',()=>{
 const c=canvas(),utterance='That devastating rebuttal had frames';
 const lines=wrapMeasuredText(c,utterance,25,Infinity,false);
 assert(lines.includes('devastating'));
 assert(lines.includes('rebuttal'));
 assert.equal(lines.join(' '),utterance);
 const rendered=canvas();drawDebateShout(rendered,{id:1,x:250,y:110,debateSpeechTime:1.8,debateSpeech:utterance,animation:'argue'});
 assert.equal(rendered.calls.filter(c=>c[0]==='text').map(c=>c[1]).join(' '),utterance);
});

test('stage floor has no outlined targeting rings underneath either debater',()=>{
 const c=canvas(),event={elapsed:2,hostX:198,hostY:36,departures:[{debater:true,stageVisit:'exchange',x:285,y:40}]};
 drawStageDebateUplight(c,event,2000);
 assert.equal(c.calls.filter(call=>call[0]==='ellipse'&&call[4]<=4).length,0,'stage uplighting must not paint shallow floor target rings');
});

test('clerk frames crop transparent full-resolution atlas margins to person-sized art',()=>{
 const c=canvas(),atlas={naturalWidth:1774,naturalHeight:887,complete:true};
 drawTicketClerk(c,{clerk:atlas,clerkWalk:atlas},{elapsed:2,ticketClerk:{x:180,y:151,walking:true,direction:'south',lastScanAt:-99}});
 const image=c.calls.find(call=>call[0]==='image');
 assert(image);
 assert(image[4]<=216,'source is tightly cropped inside each 443px atlas cell');
 assert.equal(image[8],19);
 assert.equal(image[9],35);
 const ui=readFileSync('src/ui.js','utf8'),sandbox=readFileSync('src/irl-sandbox-v085.js','utf8');
 for(const src of [ui,sandbox])assert(src.includes("role:'guard',w:34,h:43"),'guards are 10-15% larger');
});

test('gate monitor does not visually stack its body on dedicated clerk',()=>{
 const e=new IRLEvent({progress:{irlRecords:{destinyMeet:{attempts:0}}}});e.begin();e.nextArrival=999;
 const monitor=e.staff[0],clerk=e.ticketClerk;
 let closest=Infinity;
 for(let i=0;i<300;i++){
  e.tick(.1);closest=Math.min(closest,Math.hypot(monitor.x-clerk.x,monitor.y-clerk.y));
 }
 assert(closest>25,'monitor patrol stays clear of the clerk silhouette');
});

test('teal feedback strips do not cross active debater or onstage TV',()=>{
 const c=canvas(),effects=[{x:267,y:40,text:'STAGE SECURE',color:'#a6ffe4',ttl:2},{x:95,y:121,text:'OUT!',ttl:2}];
 drawVenueFeedback(c,effects,null,{departures:[{debater:true,stageVisit:'exchange'}]});
 assert(c.calls.some(call=>call[0]==='text'&&call[1]==='OUT!'));
 assert(!c.calls.some(call=>call[0]==='text'&&call[1]==='STAGE SECURE'));
});

test('render exceptions cannot permanently stop the animation frame scheduler',()=>{
 const frames=[],errors=[],steps=[];
 const loop=createResilientAnimationLoop(now=>{steps.push(now);if(now===10)throw Error('temporary GPU issue');},{schedule:cb=>frames.push(cb),onError:e=>errors.push(e.message)});
 loop(10);assert.equal(frames.length,1);assert.deepEqual(errors,['temporary GPU issue']);
 frames.shift()(40);assert.deepEqual(steps,[10,40]);assert.equal(frames.length,1);
 const ui=readFileSync('src/ui.js','utf8'),sandbox=readFileSync('src/irl-sandbox-v085.js','utf8');
 for(const src of [ui,sandbox])assert(src.includes('createResilientAnimationLoop'));
});
