import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {avatarPath,AVATAR_COUNT} from '../src/avatars-v083.js';
import {normalizeGraphics} from '../src/graphics-v082.js';
import {ambientEmote,bubbleTier} from '../src/irl-atmosphere-v083.js';
import {stageAction} from '../src/sprite-animation.js';
import {isVenueWalkable,venueQueueSpot} from '../src/venue-nav.js';
import {IRLEvent} from '../src/irl-v07.js';

for(let i=0;i<300;i++)assert.match(avatarPath(i,[]),/^\/assets\/avatars\/\d+\.webp$/);
assert.equal(avatarPath(Number.NaN,[]),'/assets/avatars/0.webp');
assert.equal(avatarPath(19,[]),'/assets/avatars/1.webp');
assert.equal(avatarPath(0,['embedded']), 'embedded');
assert.equal(AVATAR_COUNT,18);
for(let i=0;i<AVATAR_COUNT;i++)assert.ok(existsSync(new URL(`../assets/avatars/${i}.webp`,import.meta.url)));

assert.deepEqual(normalizeGraphics({texture:'chromatic',textureStrength:900,chaos:true}).textureStrength,100);
assert.equal(normalizeGraphics({texture:'bad'}).texture,'off');
assert.equal(normalizeGraphics({}).chaos,false);
assert.ok(bubbleTier(0)>bubbleTier(1)&&bubbleTier(1)>bubbleTier(2));
assert.equal(bubbleTier(0,true),1);
assert.match(ambientEmote('test',4),/dggL|YEE|PEPE|PepoThink|NODDERS|OMEGALUL/);
assert.equal(stageAction(2,0,5),'point');
assert.equal(stageAction(2,0,0,'nod'),'cheer');
for(let i=0;i<8;i++)assert.ok(isVenueWalkable(...venueQueueSpot(i)));

const make=()=>{const e=new IRLEvent({progress:{irlRecords:{},creators:{destiny:{xp:0}},credits:0},save(){}});e.begin();return e;};
const crowd=make();crowd.next=6;crowd.tick(.1);
assert.equal(crowd.crowd.length,19);
assert.equal(crowd.crowd[13].kind,12);
crowd.next=14;crowd.tick(.1);
assert.equal(crowd.crowd.length,31);
assert.equal(crowd.crowd[24].kind,23);
assert.equal(crowd.crowd[30].kind,29);
assert.ok(crowd.crowd.every(p=>isVenueWalkable(p.x,p.y,!!p.gateAccess)));
for(let i=0;i<crowd.crowd.length;i++)for(let j=i+1;j<crowd.crowd.length;j++){
 const a=crowd.crowd[i],b=crowd.crowd[j];
 if(a.entryPhase||b.entryPhase)continue; // gate arrivals queue offscreen before opening
 assert.ok(Math.abs(a.x-b.x)>=19||Math.abs(a.y-b.y)>=25,'phase crowd spawns should not stack on each other');
}
const initial=crowd.guardPositions.map(g=>[g.x,g.y]);
for(let i=0;i<170;i++)crowd.tick(.1);
assert.ok(crowd.guardPositions.some((g,i)=>Math.hypot(g.x-initial[i][0],g.y-initial[i][1])>4),'patrol guards must actually relocate');

const welcome=make();welcome.add();const g=welcome.selected;assert.equal(g.type,'welcome');
welcome.resolve(g,true,'welcome');
assert.equal(welcome.departures[0].stageVisit,'queued');
welcome.tick(.1);
assert.equal(welcome.departures[0].stageVisit,'queued','welcomed guests must physically walk to the visible stage line before advancing');
assert.ok(welcome.hostUntil>welcome.elapsed);

const incident=make();const threat={id:'threat',type:'security',name:'Test Case',text:'Fictional threat',cue:'confirmed warning',check:'verified by staff',age:0,life:20,x:210,y:132,kind:2};
incident.visitors=[threat];incident.focus=threat.id;
incident.resolve(threat,false,'welcome');
assert.ok(incident.incidentFade>0);
assert.equal(incident.mode,'playing');
for(let i=0;i<16;i++)incident.tick(.1);
assert.equal(incident.mode,'results');
assert.equal(incident.result.stars,0);

for(const file of ['irl-cast-walk.webp','irl-cast-set-a.webp','irl-cast-set-b.webp'])assert.ok(existsSync(new URL('../assets/'+file,import.meta.url)),file);
const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
for(const needle of ['avatarError','applyVenueTexture','drawStageAtmosphere','irl-arcade-stamp','irlAdditionalSets'])assert.ok(ui.includes(needle));
console.log('VENUE v0.8.3: PASS');
