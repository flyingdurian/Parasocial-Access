import {CASES,SURFACES,seededShuffle} from './content.js';
import {WORLD_DEFS,generateLevel,GENERATOR_STATS} from './generator.js';
import {EVENT_DEFS,OPERATOR_UPGRADES,currentOperations,eventSeed,dailyKey} from './events-v04.js';
import {CREATORS} from './scenarios-v05.js';
import {NETWORK_CREATORS, CREATOR_EVENTS, CREATOR_UPGRADES, creatorLevel, createCreatorSave} from './creators-v06.js';
import {createIdentityCases,makeEmoteScript} from './creator-identity-v061.js';
export {CASES,SURFACES,WORLD_DEFS,GENERATOR_STATS,EVENT_DEFS,OPERATOR_UPGRADES,CREATORS,NETWORK_CREATORS,CREATOR_EVENTS,CREATOR_UPGRADES,currentOperations};
export const SAVE_KEY='feedfall:rush-hour:off-the-feed:v07';
// Deliberately stable across minor releases on the same origin. Development
// access is separate from achievements, stars, creator XP, and purchases.
export const DEV_KEY='feedfall:rush-hour:developer-access';
export const SAVE_BACKUP_KEY='feedfall:rush-hour:pre-import-backup';
export const PRIOR_V061_KEY='feedfall:rush-hour:creator-identity:v061';
export const PRIOR_V06_KEY='feedfall:rush-hour:creator-network:v06';
export const PRIOR_V05_KEY='feedfall:rush-hour:thread-frontier:v05';
export const PRIOR_V04_KEY='feedfall:rush-hour:event-circuit:v04';
export const PRIOR_KEY='feedfall:rush-hour:beyond-pattern:v03';
export const PRIOR2_KEY='feedfall:rush-hour:channel-shift:v02';
export const LEGACY_KEY='feedfall:rush-hour:preview-v01';
export const UPGRADES={
 feed:[
  {id:'scanner',icon:'⌁',name:'SPECTRUM SCANNER',tag:'CLARITY',desc:['Highlights obvious fraud cues.','Highlights unverified-source cues.','Highlights impersonation and threat cues.'],cost:[95,210,470]},
  {id:'buffer',icon:'▤',name:'QUEUE BUFFER',tag:'CAPACITY',desc:['Five pending messages.','Six pending messages.','Eight pending messages.'],cost:[100,235,520]},
  {id:'relay',icon:'⚡',name:'RAPID RELAY',tag:'MOMENTUM',desc:['Every fourth correct call earns a second.','Every third correct call earns 1.4 seconds.','Every third call earns two seconds.'],cost:[120,260,570]},
  {id:'shield',icon:'◈',name:'ERROR DAMPENER',tag:'SURVIVAL',desc:['One additional overflow shield.','Two additional shields.','Three additional shields.'],cost:[100,230,495]}
 ],
 arena:[
  {id:'lens',icon:'◎',name:'CHAT RADAR',tag:'RECOGNITION',desc:['Highlights likely harmful messages.','Also highlights uncertain messages.','Adds stronger, readable category tags.'],cost:[110,250,535]},
  {id:'cooling',icon:'❄',name:'LATENCY BUFFER',tag:'REACTION',desc:['Messages linger 0.8 seconds longer.','Messages linger 1.8 seconds longer.','Messages linger 3 seconds longer.'],cost:[115,265,575]},
  {id:'autofilter',icon:'◇',name:'AUTO-MOD FILTER',tag:'PROTECTION',desc:['Catches one raid spam per 10 seconds.','Catches one every 7 seconds.','Catches one every 5 seconds.'],cost:[140,310,690]},
  {id:'freeze',icon:'Ⅱ',name:'EMERGENCY PAUSE',tag:'TACTICAL',desc:['One 3-second chat freeze per level.','Two 3-second freezes per level.','Two 5-second freezes per level.'],cost:[125,275,600]}
 ],
 market:[
  {id:'sieve',icon:'⌗',name:'MATCH SIEVE',tag:'BATCH',desc:['Matching scam rings award +25 batch points.','Batch bonus rises to +55.','Batch bonus rises to +100.'],cost:[110,280,620]},
  {id:'staging',icon:'▥',name:'LISTING STACK',tag:'CAPACITY',desc:['Hold seven listings.','Hold eight listings.','Hold ten listings.'],cost:[125,295,665]},
  {id:'audit',icon:'◈',name:'SELLER AUDIT',tag:'CLARITY',desc:['Highlight duplicate checkout routes.','Show coordinated seller markers.','Emphasize suspicious payment instructions.'],cost:[115,280,590]},
  {id:'safety',icon:'◇',name:'BUYER PROTECTION',tag:'SURVIVAL',desc:['Gain one extra stability shield.','Gain two extra shields.','Gain three extra shields.'],cost:[100,255,575]}
 ],
 thread:[
  {id:'trace',icon:'⌁',name:'BRANCH TRACER',tag:'CONTEXT',desc:['Highlight repeated reply signatures.','Emphasize cross-posted campaign IDs.','Improve cascading reply visibility.'],cost:[130,295,645]},
  {id:'stack',icon:'▤',name:'THREAD CACHE',tag:'CAPACITY',desc:['Hold six replies.','Hold seven replies.','Hold nine replies.'],cost:[125,285,610]},
  {id:'contain',icon:'✦',name:'CASCADE CONTROL',tag:'INTERVENTION',desc:['Containment awards +40 bonus points.','Containment awards +90 bonus points.','Containment awards +160 bonus points.'],cost:[150,345,750]},
  {id:'guard',icon:'◈',name:'COMMUNITY SHIELD',tag:'SURVIVAL',desc:['One extra stability shield.','Two extra shields.','Three extra shields.'],cost:[105,250,550]}
 ]
};
export const CONTRACTS=[
 {id:'precision',name:'PRECISION RUN',desc:'Finish with at least 96% accuracy.',reward:160},
 {id:'streak',name:'COMBO SPECIALIST',desc:'Reach a 10× combo before completing the shift.',reward:175},
 {id:'bare',name:'BARE METAL',desc:'Earn at least 2 stars with all purchased equipment disabled.',reward:220}
];
const blankWorld=(count)=>({unlocked:0,best:Array(count).fill(0),stars:Array(count).fill(0),upgrades:{}});
const defaults=()=>({version:8,creators:Object.fromEntries(NETWORK_CREATORS.map(c=>[c.id,createCreatorSave()])),credits:0,worlds:[blankWorld(5),blankWorld(5),blankWorld(4),blankWorld(5)],arenaUnlocked:false,marketUnlocked:false,threadUnlocked:false,history:[],recent:[],recentMeta:[],sessions:0,totalReviewed:0,bestCombo:0,mastery:[],eventRecords:{},irlRecords:{},operatorUpgrades:{}});
function migrate(p){let v=defaults();
 if(p&&[2,3,4,5,6,7,8].includes(p.version)){
  v={...v,...p,version:8};v.creators=Object.fromEntries(NETWORK_CREATORS.map(c=>[c.id,{...createCreatorSave(),...(p.creators?.[c.id]||{}),upgrades:{...(p.creators?.[c.id]?.upgrades||{})},records:{...(p.creators?.[c.id]?.records||{})},milestones:[...(p.creators?.[c.id]?.milestones||[])]}]));v.worlds=defaults().worlds.map((w,i)=>({...w,...(p.worlds?.[i]||{}),best:[...w.best].map((_,j)=>p.worlds?.[i]?.best?.[j]||0),stars:[...w.stars].map((_,j)=>p.worlds?.[i]?.stars?.[j]||0),upgrades:{...(p.worlds?.[i]?.upgrades||{})}}));
  v.mastery=Array.isArray(p.mastery)?p.mastery:[];
  v.marketUnlocked=!!(p.marketUnlocked||v.worlds[1].stars[4]>0);v.threadUnlocked=!!(p.threadUnlocked||v.worlds[2].stars[3]>0);
  v.eventRecords=(p.eventRecords&&typeof p.eventRecords==='object'&&!Array.isArray(p.eventRecords))?p.eventRecords:{};
  v.operatorUpgrades=(p.operatorUpgrades&&typeof p.operatorUpgrades==='object')?p.operatorUpgrades:{};
  v.irlRecords=(p.irlRecords&&typeof p.irlRecords==='object'&&!Array.isArray(p.irlRecords))?p.irlRecords:{};
  return v;
 }
 if(p?.completed){v.credits=p.credits||0;v.sessions=p.sessions||0;v.totalReviewed=p.totalReviewed||0;v.legacyStars=[...p.completed];for(const old of p.purchased||[])if(['scanner','buffer','relay','shield'].includes(old))v.worlds[0].upgrades[old]=1;v.legacyMigrated=true;}
 return v;
}
function load(){try{for(const key of [SAVE_KEY,PRIOR_V061_KEY,PRIOR_V06_KEY,PRIOR_V05_KEY,PRIOR_V04_KEY,PRIOR_KEY,PRIOR2_KEY,LEGACY_KEY]){const raw=localStorage.getItem(key);if(raw){const p=JSON.parse(raw);if(p)return migrate(p);}}}catch{}return defaults();}
const emptyDev=()=>({worldLevels:[-1,-1,-1,-1],creators:false});
function validateDev(input){const result=emptyDev();if(!input||typeof input!=='object')return result;
 if(Array.isArray(input.worldLevels))result.worldLevels=result.worldLevels.map((_,i)=>Number.isInteger(input.worldLevels[i])?Math.max(-1,Math.min(WORLD_DEFS[i].levels-1,input.worldLevels[i])):-1);
 result.creators=input.creators===true;return result;
}
function loadDev(){try{return validateDev(JSON.parse(localStorage.getItem(DEV_KEY)||'null'));}catch{return emptyDev();}}
function validateImportedSave(raw){if(!raw||raw.kind!=='feedfall-rush-save'||raw.schema!==1||!raw.progress||typeof raw.progress!=='object'||![2,3,4,5,6,7,8].includes(raw.progress.version))throw new Error('Not a compatible Feedfall save backup.');
 if(!Array.isArray(raw.progress.worlds)||raw.progress.worlds.length!==WORLD_DEFS.length||!Number.isFinite(raw.progress.credits)||raw.progress.credits<0)throw new Error('The backup is incomplete or damaged.');
 for(let i=0;i<WORLD_DEFS.length;i++){const world=raw.progress.worlds[i];if(!world||!Array.isArray(world.stars)||!Array.isArray(world.best)||world.stars.length!==WORLD_DEFS[i].levels||world.best.length!==WORLD_DEFS[i].levels)throw new Error('The backup has invalid world records.');}
 return {progress:migrate(raw.progress),devAccess:validateDev(raw.devAccess)};
}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const pct=(a,b)=>b?Math.round(a/b*100):0;
export class RushEngine{
 constructor(){this.progress=load();this.devAccess=loadDev();this.world=0;this.level=0;this.mode='home';this.listeners=new Set();this.clock=0;this.cards=[];this.queue=[];this.nextIndex=0;this.arrive=0;this.interval=2;this.hearts=3;this.capacity=4;this.creatorLifetimeBonus=0;
  this.combo=0;this.bestCombo=0;this.score=0;this.correct=0;this.wrong=0;this.missed=0;this.passive=0;this.handled=0;this.overflow=0;this.raid=false;this.lastOutcome=null;this.results=null;this.focus=null;this.freezeUntil=0;this.freezes=0;this.clockMax=60;this.shieldConsumed=0;this.attempt=0;this.soundEnabled=true;this.slowMode=false;this.autofilterAt=0;this.lastExpired=null;this.batchCount=0;this.totalRequired=0;this.totalAuto=0;this.danger=0;this.recentSeed=0;this.activeContract=null;this.lastExpired=null;this.batchCount=0;this.activeEvent=null;this.pulseCharge=0;this.pulseRemaining=0;this.pulseUses=0;this.eventTimedOut=0;this.bufferGrace=0;this.congested=false;this.damageCooldown=0;this.bufferCooldown=0;this.queueBreaches=0;this.expiredViolations=0;this.recoveryCount=0;this.suppressedCascades=new Set();this.prevented=0;this.branchCount=0;this.damageLog=[];this.activeCreatorEvent=null;this.pendingCreatorEvent=null;this.emoteTrain=null;this.momentum=0;this.communityCelebrations=0;this.tournament=null;this.debateProgress=new Map();this.debateClashes=0;this.creatorBonuses=0;}
 subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
 emit(type='update',data={}){for(const fn of this.listeners)fn({type,...data});}
 save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(this.progress))}catch{}}
 saveDev(){try{localStorage.setItem(DEV_KEY,JSON.stringify(this.devAccess));}catch{}this.emit('dev-access');}
 campaignMaxUnlocked(){return this.progress.threadUnlocked?3:this.progress.marketUnlocked?2:this.progress.arenaUnlocked?1:0;}
 worldAvailable(world){return Number.isInteger(world)&&world>=0&&world<WORLD_DEFS.length&&(world<=this.campaignMaxUnlocked()||(this.devAccess.worldLevels[world]??-1)>=0);}
 levelAccess(world){return Math.max(world<=this.campaignMaxUnlocked()?(this.worldState(world)?.unlocked??-1):-1,this.devAccess.worldLevels[world]??-1);}
 levelUnlocked(world,level){return this.worldAvailable(world)&&level>=0&&level<WORLD_DEFS[world].levels&&level<=this.levelAccess(world);}
 devUnlockNext(world){if(!Number.isInteger(world)||world<0||world>=WORLD_DEFS.length)return false;const next=Math.min(WORLD_DEFS[world].levels-1,this.levelAccess(world)+1);this.devAccess.worldLevels[world]=Math.max(this.devAccess.worldLevels[world],next);this.saveDev();return true;}
 devUnlockAll(){this.devAccess={worldLevels:WORLD_DEFS.map(w=>w.levels-1),creators:true};this.saveDev();}
 devUnlockCreators(){this.devAccess.creators=true;this.saveDev();}
 devClear(){this.devAccess=emptyDev();try{localStorage.removeItem(DEV_KEY);}catch{}this.emit('dev-access');}
 devGrantCredits(amount){if(!Number.isInteger(amount)||amount<=0||amount>10000)return false;this.progress.credits+=amount;this.save();this.emit('dev-credits');return true;}
 exportSave(){return JSON.stringify({kind:'feedfall-rush-save',schema:1,exportedAt:new Date().toISOString(),progress:this.progress,devAccess:this.devAccess},null,2);}
 importSave(raw){const parsed=validateImportedSave(JSON.parse(raw));try{localStorage.setItem(SAVE_BACKUP_KEY,this.exportSave());}catch{}this.progress=parsed.progress;this.devAccess=parsed.devAccess;this.save();this.saveDev();this.emit('save-import');return true;}
 rank(world,id){if(this.activeContract==='bare'&&this.mode==='playing'&&world===this.world)return 0;return this.progress.worlds[world]?.upgrades?.[id]||0}
 has(id){return this.rank(this.world,id)>0}
 operatorRank(id){if(this.activeContract==='bare'&&this.mode==='playing')return 0;return Math.max(0,Math.min(3,this.progress.operatorUpgrades?.[id]||0))}
 get pulseCost(){return [8,7,6,5][this.operatorRank('coil')]}
 get pulseDuration(){return [3.5,4.5,5.5,7][this.operatorRank('capacitor')]}
 get pulsing(){return this.pulseRemaining>0}
 triggerPulse(){if(this.mode!=='playing'||this.pulsing||this.frozen||this.signatureActive||!!this.tournament?.breakRemaining||this.pulseCharge<this.pulseCost)return false;this.pulseCharge=0;this.pulseRemaining=this.pulseDuration;this.pulseUses++;this.emit('pulse-start',{duration:this.pulseDuration});return true;}
 buyOperator(id){const u=OPERATOR_UPGRADES.find(x=>x.id===id);if(!u)return false;const rank=this.operatorRank(id),cost=u.cost[rank];if(rank>=3||this.progress.credits<cost)return false;this.progress.credits-=cost;this.progress.operatorUpgrades[id]=rank+1;this.save();this.emit('operator-purchase',{upgrade:u,rank:rank+1});return true;}
 operations(){return currentOperations().map(op=>({...op,locked:!this.worldAvailable(op.world),record:this.progress.eventRecords?.[op.recordKey]||null}));}
 startEvent(id,date=new Date()){const op=currentOperations(date).find(x=>x.id===id);if(!op||!this.worldAvailable(op.world))return false;const level=Math.min(op.level,this.levelAccess(op.world));return this.start(op.world,level,op.seed,null,op);}
 worldState(n=this.world){return this.progress.worlds[n]}
 maxUnlocked(){return Math.max(this.campaignMaxUnlocked(),...this.devAccess.worldLevels.map((level,i)=>level>=0?i:0));}
 worldFinished(world){return this.worldState(world)?.stars.every(n=>n>0)||false}
 masteryCompleted(world,id){return this.progress.mastery.includes(`${world}:${id}`)}
 creatorState(id){return this.progress.creators?.[id]||createCreatorSave();}
 creatorRank(id,upgrade){return Math.max(0,Math.min(3,this.creatorState(id).upgrades?.[upgrade]||0));}
 creatorEvents(id){const state=this.creatorState(id),level=creatorLevel(state.xp);return CREATOR_EVENTS.filter(e=>e.creator===id).map(e=>({...e,record:state.records[e.id]||null,locked:!this.devAccess.creators&&(!this.levelUnlocked(e.world,e.level)||(e.index>0&&(level<e.index+1||!(state.records[CREATOR_EVENTS.find(pr=>pr.creator===id&&pr.index===e.index-1)?.id]?.stars>0))))}));}
 buyCreator(id,upgrade){const def=NETWORK_CREATORS.find(c=>c.id===id),item=CREATOR_UPGRADES.find(u=>u.id===upgrade);if(!def||!item)return false;const state=this.progress.creators[id],rank=this.creatorRank(id,upgrade),cost=item.cost[rank];if(rank>=3||this.progress.credits<cost)return false;this.progress.credits-=cost;state.upgrades[upgrade]=rank+1;this.save();this.emit('creator-purchase',{creator:id,upgrade,rank:rank+1});return true;}
 startCreatorEvent(id){const ev=CREATOR_EVENTS.find(e=>e.id===id);if(!ev||this.creatorEvents(ev.creator).find(x=>x.id===id)?.locked)return false;this.pendingCreatorEvent=ev;try{return this.start(ev.world,ev.level,ev.seed,null,null);}finally{this.pendingCreatorEvent=null;}}
 start(world=0,level=0,seed=null,contractId=null,eventSpec=null){if(!this.levelUnlocked(world,level)&&!(this.pendingCreatorEvent&&this.devAccess.creators&&world>=0&&world<WORLD_DEFS.length&&level>=0&&level<WORLD_DEFS[world].levels))return false;
  if(contractId&&(!CONTRACTS.some(c=>c.id===contractId)||!this.worldFinished(world)))return false;
  const creatorEvent=this.pendingCreatorEvent||null;this.creatorRunCycle=0;this.activeCreatorEvent=creatorEvent;this.emoteTrain=null;this.momentum=0;this.communityCelebrations=0;this.tournament=null;this.debateProgress=new Map();this.debateClashes=0;this.creatorBonuses=0;this.world=world;this.level=level;this.activeContract=contractId;this.activeEvent=eventSpec;this.pulseCharge=0;this.pulseRemaining=0;this.pulseUses=0;this.eventTimedOut=0;this.bufferGrace=0;this.congested=false;this.damageCooldown=0;this.bufferCooldown=0;this.queueBreaches=0;this.expiredViolations=0;this.recoveryCount=0;this.suppressedCascades=new Set();this.prevented=0;this.branchCount=0;this.damageLog=[];this.recentSeed=seed??((Date.now()^Math.floor(Math.random()*999999))>>>0);this.attempt++;this.configuration=generateLevel(this.recentSeed,world,level,(eventSpec||creatorEvent)?[]:[...this.progress.recent,...(this.progress.recentMeta||[])],eventSpec?{spotlight:eventSpec.spotlight}:null);
  if(eventSpec?.id==='market-sweep'){
   const cards=this.configuration.cases;for(let k=0;k<3;k++){const anchor=cards[1+k*9],slot=3+k*9;if(anchor?.campaign&&cards[slot])cards[slot]={...anchor,id:`circuit-ring-${eventSpec.seed}-${k}`,serial:undefined,text:`Collector deal: transfer your deposit through ${anchor.campaignLabel} to reserve this item.`,author:`@express_shop${k+1}`,memoryKey:`event-ring|${eventSpec.seed}|${k}`};}
  }
  if(creatorEvent){this.creatorRunCycle=this.creatorState(creatorEvent.creator).runs;this.configuration.cases=createIdentityCases(this.configuration.cases,creatorEvent.creator,creatorEvent.id,this.creatorRunCycle);this.configuration.title=creatorEvent.title;}
  this.cards=this.configuration.cases;this.queue=[];this.nextIndex=0;this.clockMax=this.configuration.seconds+(eventSpec?.id==='flash'?11:eventSpec?.id==='broadcast'?10:5);this.clock=this.clockMax;this.arrive=0;this.interval=this.configuration.interval*(eventSpec?.id==='broadcast'?.88:eventSpec?.id==='market-sweep'?.91:1);this.hearts=3+(world===0?this.rank(0,'shield'):world===2?this.rank(2,'safety'):world===3?this.rank(3,'guard'):0);this.capacity=world===0?[4,5,6,8][this.rank(0,'buffer')]:world===2?[6,7,8,10][this.rank(2,'staging')]:world===3?[5,6,7,9][this.rank(3,'stack')]:6;if(creatorEvent){const cbuf=this.creatorRank(creatorEvent.creator,'buffer'),desk=this.creatorRank(creatorEvent.creator,'desk');this.capacity+=cbuf;this.clockMax+=[0,5,9,14][desk];this.clock=this.clockMax;this.interval*=creatorEvent.creator==='glitch'?.96:creatorEvent.creator==='destiny'?.98:1;this.creatorLifetimeBonus=[0,.5,1.2,2.0][desk];}else this.creatorLifetimeBonus=0;this.combo=0;this.bestCombo=0;this.score=0;this.correct=0;this.wrong=0;this.missed=0;this.passive=0;this.handled=0;this.overflow=0;this.raid=false;this.lastOutcome=null;this.results=null;this.focus=null;this.freezeUntil=0;this.freezes=world===1?[0,1,2,2][this.rank(1,'freeze')]:0;this.slowMode=false;this.autofilterAt=0;this.lastExpired=null;this.batchCount=0;this.totalRequired=this.cards.filter(x=>x.verdict!=='approve').length;this.totalAuto=this.cards.filter(x=>x.verdict==='approve').length;if(creatorEvent?.creator==='destiny'&&this.stream){this.emoteTrain={active:false,started:false,script:makeEmoteScript(this.recentSeed+this.creatorRunCycle*1297),index:0,current:null,timer:0,combo:12,peak:12,correct:0,broken:0,milestones:[],milestoneScore:0};}
  if(creatorEvent?.creator==='glitch')this.tournament={round:1,breakRemaining:0,clutches:0,roundStreak:0,peakStreak:0,roundBonusAwarded:false};
  this.mode='playing';this.progress.sessions++;this.save();this.spawn();if(world===1)this.spawn();if(world===2){this.spawn();this.spawn();if(eventSpec?.id==='market-sweep')this.spawn();}if(world===3){this.spawn();this.spawn();this.spawn();}this.emit('shift-start');return true;}
 get stream(){return this.world===1}
 get market(){return this.world===2}
 get threaded(){return this.world===3}
 get frozen(){return this.freezeUntil>0}
 get flashEvent(){return this.activeEvent?.id==='flash'}
 // A stability impact starts a genuine cooldown; concurrent arrivals cannot remove
 // the remaining shields instantly. Diagnostics preserve the original cause.
 impact(cause){
  this.damageLog.push({cause,at:this.clockMax-this.clock});
  if(this.damageCooldown>0){this.emit('impact-absorbed',{cause});return false;}
  this.hearts--;this.damageCooldown=2.25;this.emit('impact',{cause,hearts:this.hearts});
  if(this.hearts<=0)this.complete('overload');return true;
 }
 spawn(){
  while(this.nextIndex<this.cards.length&&this.threaded&&this.suppressedCascades.has(this.cards[this.nextIndex].cascade)){
   const suppressed=this.cards[this.nextIndex++];this.prevented++;this.correct++;this.handled++;this.score+=65;this.emit('branch-prevented',{case:suppressed});
  }
  if(this.nextIndex>=this.cards.length)return false;
  // Unlike v0.4, a full Live Arena queue holds the incoming message
  // upstream rather than discarding a live message without warning.
  if(this.stream&&this.queue.length>=this.capacity){
   if(!this.congested){this.congested=true;this.bufferGrace=2.2;this.emit('congestion-start');}
   return false;
  }
  const c={...this.cards[this.nextIndex],serial:this.nextIndex+1,age:0,life:(this.stream?6.5+(.35*(4-this.level))+[0,.9,2.0,3.2][this.rank(1,'cooling')]+this.creatorLifetimeBonus:this.flashEvent?5.1:this.threaded?8.7:999)};this.nextIndex++;
  if(this.queue.length>=this.capacity){
   if(this.market||this.threaded){const dropIndex=this.queue.findIndex(x=>x.id!==this.focus);
    if(dropIndex<0){this.nextIndex--;return false;}
    const dropped=this.queue.splice(dropIndex,1)[0];this.expire(dropped);this.emit('overflow',{case:dropped});
   }else{this.overflow++;this.queueBreaches++;this.emit('overflow',{case:c});this.impact('feed-overload');if(this.mode!=='playing')return false;this.queue.shift();}
   if(this.mode!=='playing')return false;
  }
  this.queue.push(c);
  // A full Open Feed buffer evicts the oldest card, which may have been the
  // selected card. Never leave focus attached to an item that no longer
  // exists: it previously deadlocked every action until the shift failed.
  if(!this.queue.some(item=>item.id===this.focus)){
   this.focus=this.queue[0]?.id??null;
   this.emit('focus',{id:this.focus});
  }
  this.emit('arrival',{case:c});return true;
 }
 expire(c){
  if(c.verdict==='approve'){this.passive++;this.score+=8;this.emit('safe-passed',{case:c});}
  else{this.missed++;this.expiredViolations++;this.combo=0;this.emit('miss',{case:c});this.impact('expired-violation');}
 }
 // When the player clears room during a warning, admit the held message
 // and report a recovery. If they fail for 2.2s, breach exactly once and
 // install a cooldown before another queue penalty is possible.
 updateCongestion(dt,pace){
  if(!this.stream)return;
  this.damageCooldown=Math.max(0,this.damageCooldown-dt);
  this.bufferCooldown=Math.max(0,this.bufferCooldown-dt);
  if(this.congested){
   if(this.queue.length<this.capacity){this.congested=false;this.bufferGrace=0;this.recoveryCount++;this.arrive=Math.max(this.arrive,pace);this.emit('congestion-recovered');}
   else if(this.bufferCooldown===0){
    this.bufferGrace=Math.max(0,this.bufferGrace-dt);
    if(this.bufferGrace===0){
     const i=this.queue.findIndex(x=>x.id!==this.focus);
     if(i>=0){const lost=this.queue.splice(i,1)[0];this.queueBreaches++;this.overflow++;if(lost.verdict!=='approve'){this.missed++;this.combo=0;}else this.passive++;
      this.emit('overflow',{case:lost,breach:true});this.impact('queue-breach');}
     this.congested=false;this.bufferGrace=0;this.bufferCooldown=2.35;this.arrive=0;
    }
   }
  }
 }
 get creatorId(){return this.activeCreatorEvent?.creator||null;}
 get signatureActive(){return !!this.emoteTrain?.active;}
 startEmoteTrain(){if(this.mode!=='playing'||!this.emoteTrain||this.emoteTrain.started)return false;
  const e=this.emoteTrain;e.started=true;e.active=true;e.index=0;e.current=e.script[0];e.timer=3.4;
  this.emit('emote-start',{combo:e.combo});return true;
 }
 routeEmote(action){const e=this.emoteTrain;if(this.mode!=='playing'||!e?.active||!['merge','route'].includes(action))return null;
  const current=e.current,correct=current.match=== (action==='merge');
  if(correct){e.correct++;if(current.match){e.combo+=current.gain;e.peak=Math.max(e.peak,e.combo);this.score+=65;
    for(const milestone of [25,50,100])if(e.combo>=milestone&&!e.milestones.includes(milestone)){
      e.milestones.push(milestone);const bonus=milestone===100?500:milestone===50?240:100;this.score+=bonus;e.milestoneScore+=bonus;this.emit('emote-milestone',{milestone,bonus});
    }
  }else this.score+=35;
  }else{e.broken++;e.combo=0;this.score=Math.max(0,this.score-65);}
  this.emit('emote-answer',{correct,action,token:current.token,combo:e.combo});
  e.index++;if(e.index>=e.script.length){e.active=false;e.current=null;this.emit('emote-end',{peak:e.peak,correct:e.correct,broken:e.broken});}
  else{e.current=e.script[e.index];e.timer=3.4;this.emit('emote-next',{step:e.index});}
  return {correct,combo:e.combo,ended:!e.active};
 }
 tickSignature(dt){
  if(this.emoteTrain?.active){this.emoteTrain.timer-=dt;
   if(this.emoteTrain.timer<=0){this.emoteTrain.broken++;this.emoteTrain.combo=0;this.emoteTrain.index++;
    if(this.emoteTrain.index>=this.emoteTrain.script.length){this.emoteTrain.active=false;this.emoteTrain.current=null;this.emit('emote-end',{peak:this.emoteTrain.peak,correct:this.emoteTrain.correct,broken:this.emoteTrain.broken});}
    else{this.emoteTrain.current=this.emoteTrain.script[this.emoteTrain.index];this.emoteTrain.timer=3.4;this.emit('emote-next',{step:this.emoteTrain.index});}
   }return true;
  }
  if(this.tournament?.breakRemaining>0){this.tournament.breakRemaining=Math.max(0,this.tournament.breakRemaining-dt);
   if(!this.tournament.breakRemaining)this.emit('tournament-resume',{round:this.tournament.round});return true;
  }
  return false;
 }
 applyCreatorVerdict(c,correct){if(!this.activeCreatorEvent)return;
  if(this.creatorId==='nova'){
   this.momentum=Math.max(0,Math.min(100,this.momentum+(correct?(c.verdict==='approve'?20:13):-28)));
   this.emit('community-momentum',{momentum:this.momentum});
   if(this.momentum>=100){this.momentum=12;this.communityCelebrations++;this.score+=185;this.creatorBonuses+=185;this.clock=Math.min(this.clockMax+6,this.clock+2);
    this.emit('community-celebration',{number:this.communityCelebrations,bonus:185});}
  }
  if(this.creatorId==='destiny'&&c.debateId){let data=this.debateProgress.get(c.debateId)||{correct:0,total:0};data.total++;if(correct)data.correct++;this.debateProgress.set(c.debateId,data);
   if(data.total===2&&data.correct===2){this.debateClashes++;this.score+=145;this.creatorBonuses+=145;this.emit('debate-clash',{count:this.debateClashes,bonus:145});}}
  if(this.creatorId==='glitch'&&this.tournament){const t=this.tournament;t.roundStreak=correct?t.roundStreak+1:0;t.peakStreak=Math.max(t.peakStreak,t.roundStreak);
   if(t.round===3&&t.roundStreak>=4&&!t.roundBonusAwarded){t.roundBonusAwarded=true;t.clutches++;this.score+=275;this.creatorBonuses+=275;this.emit('tournament-clutch',{bonus:275,round:3});}
   const threshold=Math.ceil(this.cards.length/3);const newRound=this.handled>=threshold*2?3:this.handled>=threshold?2:1;
   if(newRound>t.round){t.round=newRound;t.breakRemaining=2;t.roundStreak=0;t.roundBonusAwarded=false;
     this.interval*=.82;this.emit('tournament-break',{round:t.round});}
  }
 }
 update(dt){if(this.mode!=='playing')return;dt=clamp(dt,0,.12);if(this.tickSignature(dt))return;
  if(this.pulseRemaining>0){this.pulseRemaining=Math.max(0,this.pulseRemaining-dt);dt*=.36;if(this.pulseRemaining===0)this.emit('pulse-end');}
  this.clock-=dt;if(!this.stream)this.damageCooldown=Math.max(0,this.damageCooldown-dt);if(this.clock<=0){this.clock=0;this.complete('time');return;}
  const elapsed=this.clockMax-this.clock,raid=this.stream&&this.level>=1&&(this.activeEvent?.id==='broadcast'?((elapsed>this.clockMax*.13&&elapsed<this.clockMax*.56)||(elapsed>this.clockMax*.66&&elapsed<this.clockMax*.96)):((elapsed>this.clockMax*.31&&elapsed<this.clockMax*.53)||(this.level>=3&&elapsed>this.clockMax*.72&&elapsed<this.clockMax*.91)));if(raid!==this.raid){this.raid=raid;this.emit('raid',{on:raid});}
  if(this.stream&&this.freezeUntil>0){this.freezeUntil=Math.max(0,this.freezeUntil-dt);if(this.freezeUntil===0)this.emit('unfreeze');return;}
  this.arrive+=dt;const pace=this.raid?this.interval*(this.level>=3?.76:.82):this.interval;this.updateCongestion(dt,pace);if(this.mode!=='playing')return;let n=0;while(this.arrive>=pace&&n++<3){if(this.stream&&(this.congested||this.bufferCooldown>0)){this.arrive=Math.min(this.arrive,pace);break;}this.arrive-=pace;if(this.nextIndex<this.cards.length)this.spawn();if(this.mode!=='playing')return;if(this.congested){this.arrive=Math.min(this.arrive,pace);break;}}
  if(this.flashEvent){
   for(const c of this.queue)c.age+=dt;
   const c=this.queue[0];if(c&&c.age>=c.life){this.queue.shift();this.focus=null;this.lastExpired=c.id;this.eventTimedOut++;this.emit('focus-expired',{case:c});this.expire(c);if(this.mode!=='playing')return;this.arrive=0;this.spawn();}
  }
  if(this.stream){
   const rate=[0,10,7,5][this.rank(1,'autofilter')];if(rate>0&&this.raid&&elapsed-this.autofilterAt>=rate){const i=this.queue.findIndex(x=>x.id!==this.focus&&x.verdict==='remove'&&x.scenario==='raid');if(i>=0){const c=this.queue.splice(i,1)[0];this.autofilterAt=elapsed;this.correct++;this.handled++;this.progress.totalReviewed++;this.score+=50;this.emit('autofilter',{case:c});}}
   for(const c of this.queue)c.age+=dt*(this.congested?.57:1);
   for(let i=this.queue.length-1;i>=0;i--)if(this.queue[i]?.age>=this.queue[i]?.life){const c=this.queue.splice(i,1)[0];if(c.id===this.focus){this.focus=null;this.lastExpired=c.id;this.emit('focus-expired',{case:c});}this.expire(c);if(this.mode!=='playing')return;}
   if(this.queue.length&&!this.queue.some(x=>x.id===this.focus)){this.focus=this.queue[0].id;this.emit('focus',{id:this.focus});}
  }
  if(this.nextIndex>=this.cards.length&&this.queue.length===0)this.complete('cleared');}
 target(id){if(!this.stream&&!this.market&&!this.threaded){const current=id?this.queue.find(c=>c.id===id):this.queue[0];if(!current&&id&&id===this.focus&&this.queue.length){this.focus=this.queue[0].id;this.emit('focus',{id:this.focus});}return current||null;}const targetId=id??this.focus;return targetId?this.queue.find(c=>c.id===targetId):null;}
 select(id){if((!this.stream&&!this.market&&!this.threaded)||this.mode!=='playing'||!this.queue.some(x=>x.id===id))return false;this.focus=id;this.emit('focus',{id});return true;}
 answer(decision,id=null){if(this.mode!=='playing'||this.signatureActive||!!this.tournament?.breakRemaining||!['approve','flag','remove'].includes(decision))return null;const c=this.target(id);if(!c){this.emit('stale-action',{id:id??this.focus});return null;}
  const index=this.queue.indexOf(c);if(index<0)return null;this.queue.splice(index,1);this.focus=this.queue[0]?.id||null;
  const correct=decision===c.verdict;this.handled++;this.progress.totalReviewed++;let points=0;const oldCombo=this.combo;
  if(correct){this.correct++;this.combo++;this.pulseCharge=Math.min(this.pulseCost,this.pulseCharge+1);this.bestCombo=Math.max(this.bestCombo,this.combo);points=Math.round((decision==='flag'?85:100)*(1+Math.min(3,Math.floor((this.combo-1)/4))*.5));this.score+=points;
   const rank=this.rank(0,'relay');if(!this.stream&&rank>0&&this.combo%([999,4,3,3][rank])===0){const amount=[0,1,1.4,2][rank];this.clock=Math.min(this.clockMax+6,this.clock+amount);this.emit('relay',{seconds:amount});}
  }else{this.wrong++;this.combo=0;this.score=Math.max(0,this.score-45);}
  this.applyCreatorVerdict(c,correct);this.lastOutcome={case:c,decision,correct,points,combo:this.combo,truth:c.verdict,streakBroken:!correct&&oldCombo>=3};this.emit('verdict',this.lastOutcome);
  if(this.emoteTrain&&!this.emoteTrain.started&&this.handled>=7)this.startEmoteTrain();
  if(!this.stream&&!this.queue.length&&this.nextIndex<this.cards.length){this.arrive=0;this.spawn();}
  if(this.nextIndex===this.cards.length&&this.queue.length===0)this.complete('cleared');this.save();return this.lastOutcome;}
 threadContain(id=this.focus){
  if(!this.threaded||this.mode!=='playing')return null;
  const c=this.target(id);if(!c)return null;
  if(c.verdict!=='remove'||!c.cascade){this.wrong++;this.combo=0;this.score=Math.max(0,this.score-70);this.emit('branch-error',{case:c});return {correct:false,count:0,prevented:0};}
  if(this.suppressedCascades.has(c.cascade))return null;
  this.suppressedCascades.add(c.cascade);const linked=this.queue.filter(x=>x.cascade===c.cascade);
  const future=this.cards.slice(this.nextIndex).filter(x=>x.cascade===c.cascade).length;
  let count=0;for(const x of linked){const result=this.answer('remove',x.id);if(result)count++;}
  this.branchCount++;const bonus=[40,90,160,240][this.rank(3,'contain')];this.score+=bonus;
  this.emit('branch-contained',{case:c,count,prevented:future,bonus});
  return {correct:true,count,prevented:future,bonus};
 }
 marketMatches(id=this.focus){if(!this.market)return [];const current=this.target(id);if(!current?.campaign)return [];return this.queue.filter(c=>c.campaign===current.campaign);}
 batchRemove(id=this.focus){if(!this.market||this.mode!=='playing')return null;const matches=this.marketMatches(id);if(matches.length<2||matches.some(c=>c.verdict!=='remove'))return null;
  const label=matches[0].campaignLabel;let points=0;let count=0;
  const bonus=[0,25,55,100][this.rank(2,'sieve')]||0;this.score+=bonus+matches.length*15;
  for(const c of matches){if(this.mode!=='playing')break;const r=this.answer('remove',c.id);if(r){count++;points+=r.points;}}
  this.batchCount+=count;
  this.emit('batch',{count,bonus:bonus+count*15,label});return {count,bonus,label};
 }
 triggerFreeze(){if(!this.stream||this.mode!=='playing'||this.freezes<=0||this.frozen||this.pulsing||this.signatureActive||!!this.tournament?.breakRemaining)return false;this.freezes--;const rank=this.rank(1,'freeze');this.freezeUntil=rank===3?5:3;this.emit('freeze',{seconds:this.freezeUntil});return true;}
 complete(reason){if(this.mode!=='playing')return;this.mode='results';const total=this.correct+this.wrong+this.missed;const accuracy=total?this.correct/total:0;
  const threshold=this.stream?this.totalRequired:this.configuration.count;
  const covered=this.stream?this.correct+this.wrong+this.missed:this.handled;
  const cleared=reason==='cleared'||(covered>=Math.floor(threshold*(this.stream?.63:.67))&&accuracy>=.58&&this.hearts>0);
  const threeAcc=this.stream?.84:this.threaded?.86:.90,allowedMisses=this.stream?Math.min(3,1+Math.floor(this.level/2)):this.market||this.threaded?2:0;
  const three=cleared&&accuracy>=threeAcc&&this.missed<=allowedMisses&&(this.stream||this.market||this.threaded?this.queueBreaches<=allowedMisses: this.overflow<=1);
  const stars=three?3:cleared&&accuracy>=.72?2:cleared?1:0;
  const pay=Math.max(20,Math.round(this.correct*4.5+this.passive*1.2+this.score/200+stars*34+(cleared?25:0)));
  this.progress.credits+=pay;this.progress.bestCombo=Math.max(this.progress.bestCombo,this.bestCombo);
  const w=this.worldState();if(!this.activeEvent&&!this.activeCreatorEvent){w.best[this.level]=Math.max(w.best[this.level],this.score);w.stars[this.level]=Math.max(w.stars[this.level],stars);
   if(cleared){w.unlocked=Math.max(w.unlocked,Math.min(WORLD_DEFS[this.world].levels-1,this.level+1));if(this.world===0&&this.level===4)this.progress.arenaUnlocked=true;if(this.world===1&&this.level===4)this.progress.marketUnlocked=true;if(this.world===2&&this.level===3)this.progress.threadUnlocked=true;}
  }
  let creatorBonus=0,creatorXp=0,creatorMilestone='',creatorRecord=null,creatorProfile=null;
  if(this.activeCreatorEvent){
   const ev=this.activeCreatorEvent;creatorProfile=NETWORK_CREATORS.find(c=>c.id===ev.creator);
   const state=this.progress.creators[ev.creator],old=state.records[ev.id]||{best:0,stars:0,attempts:0};
   creatorBonus=Math.max(0,stars-old.stars)*65;
   creatorXp=cleared?35+stars*10:12;
   state.xp+=creatorXp;state.runs++;
   state.records[ev.id]={best:Math.max(old.best,this.score),stars:Math.max(old.stars,stars),attempts:old.attempts+1};
   creatorRecord=state.records[ev.id];
   for(const [minXp,name,reward] of [[70,'COMMUNITY PARTNER',100],[160,'TRUSTED MODERATOR',175],[300,'NETWORK SPECIALIST',250]]){
    if(state.xp>=minXp&&!state.milestones.includes(name)){state.milestones.push(name);creatorBonus+=reward;creatorMilestone=name;}
   }
   this.progress.credits+=creatorBonus;
  }
  let masteryAward=0,masteryName='';
  if(this.activeContract&&cleared){const contract=CONTRACTS.find(c=>c.id===this.activeContract);
   const completed=this.activeContract==='precision'?accuracy>=.96:this.activeContract==='streak'?this.bestCombo>=10:this.activeContract==='bare'?stars>=2:false;
   if(completed&&!this.masteryCompleted(this.world,this.activeContract)){
    this.progress.mastery.push(`${this.world}:${this.activeContract}`);masteryAward=contract.reward;masteryName=contract.name;this.progress.credits+=masteryAward;
   }
  }
  let eventBonus=0,eventMedals=0,eventRecord=null;
  if(this.activeEvent){
   const key=this.activeEvent.recordKey,old=this.progress.eventRecords[key]||{best:0,stars:0,attempts:0};
   eventMedals=stars;eventBonus=Math.max(0,stars-old.stars)*this.activeEvent.bonus;
   this.progress.eventRecords[key]={best:Math.max(old.best,this.score),stars:Math.max(old.stars,stars),attempts:old.attempts+1,latest:Date.now(),world:this.world};
   eventRecord=this.progress.eventRecords[key];this.progress.credits+=eventBonus;
   const entries=Object.entries(this.progress.eventRecords).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,75);this.progress.eventRecords=Object.fromEntries(entries);
  }
  this.progress.recent=[...this.progress.recent,...this.cards.map(c=>c.text)].slice(-220);
  this.progress.recentMeta=[...(this.progress.recentMeta||[]),...this.cards.map(c=>c.memoryKey).filter(Boolean)].slice(-180);
  this.progress.history=[...this.progress.history,{world:this.world,level:this.level,stars,score:this.score,reason,time:Date.now(),creatorId:this.activeCreatorEvent?.creator||null,contract:this.activeContract,queueBreaches:this.queueBreaches,expiredViolations:this.expiredViolations,recoveries:this.recoveryCount}].slice(-45);
  this.save();this.results={reason,cleared,stars,creatorIdentity:{emotePeak:this.emoteTrain?.peak||0,emoteCorrect:this.emoteTrain?.correct||0,emoteBroken:this.emoteTrain?.broken||0,debateClashes:this.debateClashes,communityCelebrations:this.communityCelebrations,tournamentClutches:this.tournament?.clutches||0,creatorBonuses:this.creatorBonuses},creatorEventTitle:this.activeCreatorEvent?.title||null,creatorName:creatorProfile?.name||null,creatorChannel:creatorProfile?.channel||null,creatorXp,creatorBonus,creatorMilestone,creatorRecord,creatorLevel:creatorProfile?creatorLevel(this.creatorState(creatorProfile.id).xp):0,score:this.score,accuracy,correct:this.correct,wrong:this.wrong,missed:this.missed,passive:this.passive,handled:this.handled,total:this.cards.length,earned:pay+masteryAward+eventBonus+creatorBonus,eventBonus,eventMedals,eventRecord,eventTitle:this.activeEvent?.title||null,eventDay:this.activeEvent?.day||null,pulseUses:this.pulseUses,eventTimedOut:this.eventTimedOut,overflow:this.overflow,queueBreaches:this.queueBreaches,expiredViolations:this.expiredViolations,recoveries:this.recoveryCount,prevented:this.prevented,branchCount:this.branchCount,damageLog:this.damageLog.slice(-12),bestCombo:this.bestCombo,credits:this.progress.credits,allowedMisses,threeAccuracy:Math.round(threeAcc*100),starReason:stars===3?'THREE STARS EARNED':!cleared?'STABILITY OR COVERAGE TOO LOW':accuracy<threeAcc?`THREE STARS: ${Math.round(threeAcc*100)}% ACCURACY NEEDED`:this.missed>allowedMisses?`THREE STARS: MAX ${allowedMisses} MISSED VIOLATIONS`:`THREE STARS: MAX ${allowedMisses} QUEUE BREACHES`,masteryName,masteryAward,contract:this.activeContract};this.emit('shift-end',{results:this.results});
 }
 buy(world,id){const u=UPGRADES[WORLD_DEFS[world]?.id]?.find(v=>v.id===id);if(!u)return false;const w=this.worldState(world);const rank=w.upgrades[id]||0;if(rank>=3||this.progress.credits<u.cost[rank]||!this.worldAvailable(world))return false;const price=u.cost[rank];this.progress.credits-=price;w.upgrades[id]=rank+1;this.save();this.emit('purchase',{upgrade:u,rank:rank+1});return true;}
 go(view){if(!['home','shop','events','creators','debug'].includes(view))return;this.mode=view;this.emit('update');}
}
export const engine=new RushEngine();
