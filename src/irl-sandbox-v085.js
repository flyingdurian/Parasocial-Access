import {loadModularVenueAssets,modularVenueReady,drawModularVenue,drawBakedForegroundOccluders,drawTicketClerk,drawVenueMascot,captureLiveAudienceFrame,MODULAR_CAMERA_SCALE,applyModularVenueCamera,venueCameraPoint,venueCameraUnproject} from './venue-rig-v088b.js';
import {MODULAR_TV_BOUNDS} from './venue-geometry-v088b.js';
/* Fast isolated IRL harness: imports no main game engine, world art or UI.
   This is an additive dev route; it does not alter production save keys. */
import {IRLEvent} from './irl-v07.js';
import {IRL_LEVELS} from './irl-progression-v085.js';
import {loadGraphics,saveGraphics,setupGraphicsCanvas,applyVenueTexture,applyVenueCRT} from './graphics-v082.js';
import {createGraphicsPanel} from './graphics-panel.js';
import {drawVenueCharacter,drawContactShadow,venueSpriteGeometry,stageAction} from './sprite-animation.js';
import {drawStageAtmosphere,drawAmbientBubble,drawDebateShout,drawQueuedDecisionBubble,createBubbleLayout,reserveCanvasOverlay,placeFocusedVenuePrompt} from './irl-atmosphere-v083.js';
import {VENUE_CELL,VENUE_OBSTACLES,isVenueWalkable} from './venue-nav.js';
import {drawDggEmote,drawInlineDggL} from './dgg-emotes-v085.js';
import {sound} from './audio.js';
import {drawVenueGates,drawVenueScreens,drawVenueRush,drawCameraFlashes,drawStageConversation,reserveStageSpeech,drawStageFanInteraction,drawDebateCombatEffects,drawSecurityComic,drawStageQueueGuides,drawVenueFeedback,VENUE_LED_SCREEN} from './venue-effects-v086.js';
import {createResilientAnimationLoop} from './venue-frame-loop-v088r.js';

const root=document.querySelector('#irl-harness');
const q=(selector)=>root.querySelector(selector);
const params=new URLSearchParams(location.search);
const mode=params.get('mode')==='endless'?'endless':'standard';
const level=Math.min(IRL_LEVELS.length-1,Math.max(0,Number(params.get('level'))||0));
const storage='feedfall-irl-v085-sandbox';
let previous={};try{previous=JSON.parse(localStorage.getItem(storage)||'{}')||{};}catch{}
const engine={progress:{credits:previous.credits||0,irlRecords:previous.irlRecords||{},creators:{destiny:{xp:previous.xp||0}}},save(){const p=this.progress;localStorage.setItem(storage,JSON.stringify({credits:p.credits,irlRecords:p.irlRecords,xp:p.creators.destiny.xp}));}};
let event=new IRLEvent(engine,{mode,level});
let graphics=loadGraphics();
let speed=Math.min(8,Math.max(1,Number(params.get('speed'))||1));
const liveAudienceFrame=document.createElement('canvas');

const assets={};
const modularVenue=loadModularVenueAssets();
for(const [id,path] of Object.entries({hall:'irl-hall',cast:'irl-cast',walk:'irl-cast-walk',pose0:'irl-host-poses',pose1:'irl-photographer-poses',pose3:'irl-security-poses',additionalA:'irl-cast-set-a',additionalB:'irl-cast-set-b',additionalC:'irl-cast-set-c',walkA:'irl-cast-set-a-walk4',walkB:'irl-cast-set-b-walk4',walkC:'irl-cast-set-c-walk4',backA:'irl-cast-set-a-back4',backB:'irl-cast-set-b-back4',backC:'irl-cast-set-c-back4',stageA:'irl-cast-stage-a',stageB:'irl-cast-stage-b',reactionA:'irl-cast-set-a-react4',reactionB:'irl-cast-set-b-react4',reactionC:'irl-cast-set-c-react4',originalWalkA:'irl-cast-original-a-walk4',originalWalkB:'irl-cast-original-b-walk4',originalBackA:'irl-cast-original-a-back4',originalBackB:'irl-cast-original-b-back4',emotes:'irl-dgg-emotes6',dggl:'irl-dggl-v088e'})){
 const img=new Image();img.src='/assets/'+path+'.webp';assets[id]=img;
}
const extra=[assets.additionalA,assets.additionalB,assets.additionalC],walk4=[assets.walkA,assets.walkB,assets.walkC],back4=[assets.backA,assets.backB,assets.backC],stage=[assets.stageA,assets.stageB],reactions=[assets.reactionA,assets.reactionB,assets.reactionC],originalWalk=[assets.originalWalkA,assets.originalWalkB],originalBack=[assets.originalBackA,assets.originalBackB];
assets.hall.src='/assets/irl-hall-open-v088.webp';
assets.hall.onerror=()=>{assets.hall.onerror=()=>{assets.hall.onerror=null;assets.hall.src='/assets/irl-hall.webp';};assets.hall.src='/assets/irl-hall-open-v087.webp';};
const poses={0:assets.pose0,1:assets.pose1,3:assets.pose3};
const newCast={back:new Image(),walk:new Image(),react:new Image()};
newCast.back.src='/assets/irl-cast%20new%20sheet%201.png';
newCast.walk.src='/assets/irl-cast%20new%20sheet%202.png';
newCast.react.src='/assets/irl-cast%20new%20sheet%203.png';

root.innerHTML=`<header class="harness-head"><div><small>FEEDFALL · v0.8.8r · ISOLATED TEST ROUTE</small><h1>Destiny Meet & Greet / Venue Harness</h1></div><a href="/">← Full Game</a></header>
 <div class="harness-stats"><span>SESSION<b id="h-session"></b></span><span>TIME<b id="h-time"></b></span><span>GUESTS<b id="h-guests"></b></span><span>CROWD VIBE<b id="h-vibe"></b></span><span>SCORE<b id="h-score"></b></span><span>WAVE<b id="h-wave"></b></span></div>
 <div class="harness-stage" id="h-stage"><canvas id="h-canvas" width="384" height="216" aria-label="Interactive convention hall isolated test canvas"></canvas><div class="harness-prompt" id="h-speech" hidden><b id="h-name"></b><p id="h-text"></p><small id="h-cue"></small><small id="h-timer"></small></div><div class="harness-start" id="h-start"><h2>Direct Venue Test</h2><p>No other worlds or main menus are loaded. Choose a mode below or start the selected session.</p><button id="h-begin">▶ OPEN CONVENTION</button></div></div>
 <div class="harness-caption" id="h-caption"></div>
 <section class="harness-mobile-prompt" id="h-mobile-prompt" aria-live="polite" hidden><div><b id="h-m-name"></b><span id="h-m-timer"></span></div><p id="h-m-text"></p><small id="h-m-cue"></small></section>
 <div class="harness-controls"><button data-action="welcome">1 · WELCOME</button><button data-action="check">2 · VERIFY</button><button data-action="redirect">3 · REDIRECT</button><button data-action="debate" class="debate-key">⚔ 4 · DEBATE</button><button data-action="security">5 · SECURITY</button></div>
 <div class="harness-settings"><label for="h-mode">Scene</label><select id="h-mode"><option value="standard">Standard</option><option value="endless">Endless</option></select><label for="h-level">Level</label><select id="h-level">${IRL_LEVELS.map((l,i)=>`<option value="${i}">${i+1}: ${l.title}</option>`).join('')}</select><label for="h-speed">Test speed</label><select id="h-speed"><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option><option value="8">8×</option></select><button id="h-restart">↻ Restart</button><button id="h-pause">Ⅱ Pause</button><button id="h-nav">Grid</button></div>
 <div class="harness-foot">Use <b>G</b> for Graphics & Chaos Mode; <b>1–5</b> for actions, <b>Space</b> to pause. Click an awaiting guest to focus their prompt. This route intentionally stores test scores separately from your main save. All incidents are fictional.</div>`;
q('#h-mode').value=mode;q('#h-level').value=String(level);q('#h-speed').value=String(speed);
const gfx=createGraphicsPanel(graphics,settings=>{graphics=settings;saveGraphics(settings);});
q('.harness-stats').after(gfx.element);gfx.setActive(true);

function reset(){
 const m=q('#h-mode').value,l=Number(q('#h-level').value);
 event=new IRLEvent(engine,{mode:m,level:l});
 q('#h-start').hidden=false;q('#h-start h2').textContent=m==='endless'?'Endless Venue Survival':IRL_LEVELS[l].title;
 q('#h-start p').textContent='Direct venue testing: '+(m==='endless'?'continuous waves, breathing windows, escalating congestion':'level '+(l+1)+' with '+event.config.guests+' guests')+'.';
 update();
}
q('#h-restart').addEventListener('click',reset);
q('#h-mode').addEventListener('change',reset);
q('#h-level').addEventListener('change',reset);
q('#h-speed').addEventListener('change',()=>{speed=Number(q('#h-speed').value);});
q('#h-begin').addEventListener('click',()=>{if(event.mode==='results')reset();event.begin();sound.start();sound.setMode('convention');q('#h-start').hidden=true;});
q('#h-pause').addEventListener('click',()=>{if(event.mode==='playing')event.paused=!event.paused;update();});
q('#h-nav').addEventListener('click',()=>{graphics={...graphics,showNav:!graphics.showNav};saveGraphics(graphics);gfx.setSettings(graphics);});
for(const button of root.querySelectorAll('button[data-action]'))button.addEventListener('click',()=>{event.action(button.dataset.action);update();});
q('#h-canvas').addEventListener('click',e=>{const box=e.currentTarget.getBoundingClientRect(),px=(e.clientX-box.left)/box.width*384,py=(e.clientY-box.top)/box.height*216,world=modularVenueReady(modularVenue)?venueCameraUnproject(px,py):{x:px,y:py},x=world.x,y=world.y;const closest=event.visitors.filter(g=>!g.pending).find(g=>x>=g.x-5&&x<g.x+39&&y>=g.y-14&&y<g.y+45);if(closest)event.choose(closest.id);update();});
document.addEventListener('keydown',e=>{
 if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('select,input,textarea'))return;
 if(e.code==='Space'){e.preventDefault();if(event.mode==='playing')event.paused=!event.paused;update();}
 const action={Digit1:'welcome',Digit2:'check',Digit3:'redirect',Digit4:'debate',Digit5:'security'}[e.code];if(action){e.preventDefault();event.action(action);update();}
});

function draw(t){
 const canvas=q('#h-canvas'),ctx=setupGraphicsCanvas(canvas,graphics);
 if(!ctx)return;
 const useCamera=modularVenueReady(modularVenue);if(useCamera){ctx.save();applyModularVenueCamera(ctx);}
 const modern=drawModularVenue(ctx,modularVenue,event,t,{host:assets.pose0,poses,cast:assets.cast,extra,audienceFrame:liveAudienceFrame});
 if(!modern){ctx.fillStyle='#211a40';ctx.fillRect(0,0,384,216);ctx.fillStyle='#dfc7f4';ctx.textAlign='center';ctx.font='bold 8px monospace';ctx.fillText('LOADING VENUE',192,107);}
 drawStageQueueGuides(ctx,event);
 if(graphics.showNav){ctx.fillStyle='#ff668340';for(const o of VENUE_OBSTACLES)ctx.fillRect(o.x,o.y,o.w,o.h);ctx.fillStyle='#91f9b868';for(let y=51;y<183;y+=VENUE_CELL)for(let x=8;x<359;x+=VENUE_CELL)if(isVenueWalkable(x,y))ctx.fillRect(x,y,1,1);}
 const sprite=(kind,x,y,w,h,state,motion)=>{const box=venueSpriteGeometry(x,y,w,h,motion);drawContactShadow(ctx,box,t,motion?.stageVisit==='exchange'||kind===0?'stage':'hall');drawVenueCharacter(ctx,assets.cast,poses[kind],kind,state,t,box.x,box.y,box.w,box.h,assets.walk,extra,walk4,motion,back4,stage,reactions,originalWalk,originalBack,newCast);};
 const mood=stageAction(event.phase,event.elapsed,event.visitors.length,event.elapsed<event.hostUntil?event.hostMood:'idle');
 sprite(0,event.hostX,event.hostY,31,39,event.hostWalking&&!event.departures.some(g=>g.stageVisit==='exchange')?'walk':mood);
 const actors=[...event.crowd.map(g=>({g,role:'crowd',w:27,h:34})),...event.arrivals.map(g=>({g,role:'arrival',w:30,h:38})),...event.visitors.map(g=>({g,role:'visitor',w:30,h:38})),...event.departures.map(g=>({g,role:'depart',w:30,h:38})),...event.staff.map(g=>({g,role:'staff',w:30,h:38})),...event.guardPositions.map(g=>({g,role:'guard',w:34,h:43})),...(event.mascot?[{g:event.mascot,role:'mascot',w:22,h:24}]:[])].sort((a,b)=>a.g.y+a.h-(b.g.y+b.h));
 const bubbleLayout=createBubbleLayout([modularVenueReady(modularVenue)?MODULAR_TV_BOUNDS:VENUE_LED_SCREEN]);
 reserveCanvasOverlay(bubbleLayout,canvas,q('#h-speech'));
 reserveStageSpeech(bubbleLayout,event);
 let ambient=0,debateBubbles=0;
 const roomIsSpeaking=event.crowd.some(g=>g.speechTime>0);
 for(const {g,role,w,h} of actors){
  if(role==='mascot'){drawVenueMascot(ctx,modularVenue,event,t);continue;}
  const kind=role==='guard'?3:role==='staff'?7:g.kind;
  const state=role==='crowd'?(g.walking?'walk':g.animation):role==='depart'?(g.stageVisit==='exchange'?g.exchangeAction:g.walking?'walk':'idle'):role==='arrival'?(g.entryPhase==='ticket'?'point':g.walking?'walk':'idle'):role==='visitor'?(g.pending?(g.animation||'talk'):g.type==='security'?'argue':g.type==='check'?'point':'idle'):role==='staff'?(g.task?.phase==='engage'?'point':g.monitoring&&!g.walking?'point':g.walking?'walk':'idle'):role==='guard'&&g.task?.phase==='engage'?'argue':g.walking?'walk':'idle';
  const stageSpeaker=role==='depart'&&g.stageVisit==='exchange';
  // Render the actor's simulated position; keep the stage crowd's shadow at
   // the physical floor even while the visible sprite cheers and jumps.
   const jump=role==='crowd'?(g.hypeJump||0):0;
   const motion=jump>0?{...g,groundY:g.y}:g;
   sprite(kind,g.x+(role==='guard'?-2:stageSpeaker?2.5:0),g.y-(role==='guard'?5:0)-jump,stageSpeaker?29:w,stageSpeaker?37:h,state,motion);
 }
 if(modern){drawTicketClerk(ctx,modularVenue,event);drawBakedForegroundOccluders(ctx,modularVenue,event);captureLiveAudienceFrame(ctx,liveAudienceFrame,event);}
 for(const g of event.crowd){
  if(g.debateWatching&&g.debateSpeechTime>0&&debateBubbles<3){if(drawDebateShout(ctx,g,bubbleLayout))debateBubbles++;}
  else if(!g.debateWatching&&!ambient&&g.speechTime>0){drawAmbientBubble(ctx,g.speech.slice(0,Math.floor(g.speechProgress||0)),g.x+13,g.y,.86,45,bubbleLayout,assets.dggl);ambient++;}
  else if(!g.debateWatching&&!roomIsSpeaking&&g.speechTime<=0&&g.emoteTime>0)drawDggEmote(ctx,assets.emotes,g.emote,g.x+9,g.y-15,13,assets.dggl);
 }
 const selected=event.visitors.find(g=>g.id===event.focus);
 if(selected){ctx.fillStyle='#fff0aa8b';ctx.beginPath();ctx.ellipse(selected.x+15,selected.y+38,20,7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffdd7a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(selected.x+15,selected.y+38,17,6,0,0,Math.PI*2);ctx.stroke();}
 drawStageFanInteraction(ctx,event,t);
 drawStageConversation(ctx,event,bubbleLayout,assets.dggl);
 drawDebateCombatEffects(ctx,event,t);
 drawSecurityComic(ctx,event,t);
 if(graphics.chaos){const waiting=event.visitors.filter(g=>!g.pending&&g.id!==event.focus).sort((a,b)=>(b.waitAge+(b.type==='security'?5:0))-(a.waitAge+(a.type==='security'?5:0))||a.serial-b.serial);for(let i=0;i<Math.min(2,waiting.length);i++)drawQueuedDecisionBubble(ctx,waiting[i].text,waiting[i].x+17,waiting[i].y,i,waiting[i].type,bubbleLayout,assets.dggl);}
 drawVenueFeedback(ctx,event.effects,assets.dggl,event);
 if(event.incidentFade){ctx.fillStyle='rgba(5,8,21,'+Math.min(1,1-event.incidentFade/1.15)+')';ctx.fillRect(0,0,384,216);}
 drawCameraFlashes(ctx,event);
 if(useCamera)ctx.restore();
 applyVenueTexture(ctx,canvas,graphics,t);
 applyVenueCRT(ctx,canvas,graphics);
}

function update(){
 const set=(id,value)=>{q(id).textContent=String(value);};
 const setRich=(id,value)=>{
  const el=q(id),raw=String(value??'');if(el.dataset.richValue===raw)return;el.dataset.richValue=raw;
  const fragment=document.createDocumentFragment();
  for(const token of String(value??'').split(/(dggL)/g)){
   if(token==='dggL'){const img=document.createElement('img');img.src='/assets/irl-dggl-v088e.webp';img.alt='dggL';img.className='irl-inline-emote';fragment.appendChild(img);}
   else if(token)fragment.appendChild(document.createTextNode(token));
  }
  el.replaceChildren(fragment);
 };
 set('#h-session',event.session==='endless'?'SURVIVAL':'LEVEL '+(event.levelIndex+1));
 set('#h-time',Math.floor(Math.max(0,event.clock)/60)+':'+String(Math.floor(Math.max(0,event.clock)%60)).padStart(2,'0'));
 set('#h-guests',(event.finished.length+event.lost)+' / '+(event.session==='endless'?'∞':event.cards.length));
 set('#h-vibe',event.vibe+'%');set('#h-score',event.score);set('#h-wave',event.session==='endless'?event.wave:event.phase);
 set('#h-caption',event.message);set('#h-pause',event.paused?'▶ Resume':'Ⅱ Pause');
 const guest=event.selected,bubble=q('#h-speech'),mobile=q('#h-mobile-prompt');bubble.hidden=!guest;mobile.hidden=!guest;
 if(guest){
  set('#h-name','◉ '+guest.name);setRich('#h-text','“'+guest.text+'”');setRich('#h-cue',guest.cue);set('#h-timer',Math.max(0,Math.ceil(guest.life-guest.age))+' seconds · '+guest.type.toUpperCase());
  set('#h-m-name','◉ '+guest.name);setRich('#h-m-text','“'+guest.text+'”');setRich('#h-m-cue',guest.cue);set('#h-m-timer',Math.max(0,Math.ceil(guest.life-guest.age))+'s · '+guest.type.toUpperCase());
  const wrap=q('#h-stage').getBoundingClientRect(),point=modularVenueReady(modularVenue)?venueCameraPoint(guest.x+17,guest.y-2):{x:guest.x+17,y:guest.y-2},sx=point.x/384*wrap.width,sy=point.y/216*wrap.height,bw=bubble.offsetWidth,bh=bubble.offsetHeight;
  const projected=(wx,wy)=>{const p=modularVenueReady(modularVenue)?venueCameraPoint(wx,wy):{x:wx,y:wy};return {x:p.x/384*wrap.width,y:p.y/216*wrap.height};};
  const scale=modularVenueReady(modularVenue)?MODULAR_CAMERA_SCALE:1,unitX=scale*wrap.width/384,unitY=scale*wrap.height/216;
  const rectFor=(person,pad=5)=>{const p=projected(person.x-pad,person.y-8);return {x:p.x,y:p.y,w:(34+pad*2)*unitX,h:53*unitY};};
  const tv=projected(MODULAR_TV_BOUNDS.x,MODULAR_TV_BOUNDS.y);
  const avoid=[rectFor({x:event.hostX,y:event.hostY}),rectFor(guest),{x:tv.x,y:tv.y,w:MODULAR_TV_BOUNDS.w*unitX,h:MODULAR_TV_BOUNDS.h*unitY}];
  const stageGuest=event.departures.find(person=>person.stageVisit==='exchange');if(stageGuest)avoid.push(rectFor(stageGuest));
  if(bw&&bh){const placed=placeFocusedVenuePrompt(wrap.width,wrap.height,sx,sy,bw,bh,avoid);
   bubble.style.left=placed.left+'px';bubble.style.top=placed.top+'px';bubble.style.setProperty('--speech-tail',placed.tail+'px');
   bubble.classList.toggle('irl-detached',!placed.attached);}
 }
 if(event.mode==='results'){
  const panel=q('#h-start');panel.hidden=false;q('#h-start h2').textContent=event.session==='endless'?'SURVIVAL COMPLETE · WAVE '+event.wave:event.result.clear?'LEVEL CLEARED':'SHIFT ENDED';
  q('#h-start p').textContent='Score '+event.score+' · '+event.result.accuracy+'% accuracy · '+event.result.reason;
  q('#h-begin').textContent='↻ RESTART SESSION';
 }
}
let last=0,lastSpeechId=-1,lastSpeechCount=-1,lastSpeechAt=0;
const loop=createResilientAnimationLoop(now=>{const dt=Math.min(.09,last?(now-last)/1000:0);last=now;
 if(event.mode==='playing'&&!event.paused)for(let i=0;i<speed;i++)event.tick(dt);
 sound.irlDebateTick(event);sound.irlSecurityTick(event);
 if(event.mode==='playing'&&!event.paused){
  sound.setMode(event.phase===2?'convention-peak':event.phase===3?'convention-qa':'convention');sound.tick();
  const speaker=event.crowd.find(g=>g.speechTime>0);
  if(speaker&&!graphics.chatterMuted){
   const count=Math.floor(speaker.speechProgress||0);
   if(count>0&&count%3===0&&(speaker.id!==lastSpeechId||count!==lastSpeechCount)&&now-lastSpeechAt>125){
    sound.irlSpeechTick(speaker.id*53+count);lastSpeechId=speaker.id;lastSpeechCount=count;lastSpeechAt=now;
   }
  }
 }
 draw(now);update();
},{onError:error=>{
 console.error('[FEEDFALL IRL SANDBOX] Animation frame recovered after error',error);
 event.message='DISPLAY RECOVERING · Retry continues automatically.';
 q('#h-caption').textContent=event.message;
}});
document.addEventListener('visibilitychange',()=>{last=0;});
reset();requestAnimationFrame(loop);
globalThis.__FEEDFALL_IRL_SANDBOX={get event(){return event;},engine,graphics,reset};
