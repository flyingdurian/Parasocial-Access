/* Fast isolated IRL harness: imports no main game engine, world art or UI.
   This is an additive dev route; it does not alter production save keys. */
import {IRLEvent} from './irl-v07.js';
import {IRL_LEVELS} from './irl-progression-v085.js';
import {loadGraphics,saveGraphics,setupGraphicsCanvas,applyVenueTexture,applyVenueCRT} from './graphics-v082.js';
import {createGraphicsPanel} from './graphics-panel.js';
import {drawVenueCharacter,drawContactShadow,venueSpriteGeometry,stageAction} from './sprite-animation.js';
import {drawStageAtmosphere,drawAmbientBubble,drawQueuedDecisionBubble} from './irl-atmosphere-v083.js';
import {VENUE_CELL,VENUE_OBSTACLES,isVenueWalkable} from './venue-nav.js';
import {drawDggEmote} from './dgg-emotes-v085.js';
import {sound} from './audio.js';
import {drawVenueGates,drawVenueScreens,drawVenueRush,drawCameraFlashes,drawStageConversation,drawStageQueueGuides} from './venue-effects-v086.js';

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

const assets={};
for(const [id,path] of Object.entries({hall:'irl-hall',cast:'irl-cast',walk:'irl-cast-walk',pose0:'irl-host-poses',pose1:'irl-photographer-poses',pose3:'irl-security-poses',additionalA:'irl-cast-set-a',additionalB:'irl-cast-set-b',additionalC:'irl-cast-set-c',walkA:'irl-cast-set-a-walk4',walkB:'irl-cast-set-b-walk4',walkC:'irl-cast-set-c-walk4',backA:'irl-cast-set-a-back4',backB:'irl-cast-set-b-back4',backC:'irl-cast-set-c-back4',stageA:'irl-cast-stage-a',stageB:'irl-cast-stage-b',reactionA:'irl-cast-set-a-react4',reactionB:'irl-cast-set-b-react4',reactionC:'irl-cast-set-c-react4',originalWalkA:'irl-cast-original-a-walk4',originalWalkB:'irl-cast-original-b-walk4',originalBackA:'irl-cast-original-a-back4',originalBackB:'irl-cast-original-b-back4',emotes:'irl-dgg-emotes6'})){
 const img=new Image();img.src='/assets/'+path+'.webp';assets[id]=img;
}
const extra=[assets.additionalA,assets.additionalB,assets.additionalC],walk4=[assets.walkA,assets.walkB,assets.walkC],back4=[assets.backA,assets.backB,assets.backC],stage=[assets.stageA,assets.stageB],reactions=[assets.reactionA,assets.reactionB,assets.reactionC],originalWalk=[assets.originalWalkA,assets.originalWalkB],originalBack=[assets.originalBackA,assets.originalBackB];
assets.hall.src='/assets/irl-hall-open-v088.webp';
assets.hall.onerror=()=>{assets.hall.onerror=()=>{assets.hall.onerror=null;assets.hall.src='/assets/irl-hall.webp';};assets.hall.src='/assets/irl-hall-open-v087.webp';};
const poses={0:assets.pose0,1:assets.pose1,3:assets.pose3};

root.innerHTML=`<header class="harness-head"><div><small>FEEDFALL · v0.8.8 · ISOLATED TEST ROUTE</small><h1>Destiny Meet & Greet / Venue Harness</h1></div><a href="/">← Full Game</a></header>
 <div class="harness-stats"><span>SESSION<b id="h-session"></b></span><span>TIME<b id="h-time"></b></span><span>GUESTS<b id="h-guests"></b></span><span>CROWD VIBE<b id="h-vibe"></b></span><span>SCORE<b id="h-score"></b></span><span>WAVE<b id="h-wave"></b></span></div>
 <div class="harness-stage" id="h-stage"><canvas id="h-canvas" width="384" height="216" aria-label="Interactive convention hall isolated test canvas"></canvas><div class="harness-prompt" id="h-speech" hidden><b id="h-name"></b><p id="h-text"></p><small id="h-cue"></small><small id="h-timer"></small></div><div class="harness-start" id="h-start"><h2>Direct Venue Test</h2><p>No other worlds or main menus are loaded. Choose a mode below or start the selected session.</p><button id="h-begin">▶ OPEN CONVENTION</button></div></div>
 <div class="harness-caption" id="h-caption"></div>
 <div class="harness-controls"><button data-action="welcome">1 · WELCOME</button><button data-action="check">2 · VERIFY</button><button data-action="redirect">3 · REDIRECT</button><button data-action="security">4 · SECURITY</button><button data-action="debate" class="debate-key">⚔ 5 · INVITE TO DEBATE</button></div>
 <div class="harness-settings"><label for="h-mode">Scene</label><select id="h-mode"><option value="standard">Standard</option><option value="endless">Endless</option></select><label for="h-level">Level</label><select id="h-level">${IRL_LEVELS.map((l,i)=>`<option value="${i}">${i+1}: ${l.title}</option>`).join('')}</select><label for="h-speed">Test speed</label><select id="h-speed"><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option><option value="8">8×</option></select><button id="h-restart">↻ Restart</button><button id="h-pause">Ⅱ Pause</button><button id="h-nav">Grid</button></div>
 <div class="harness-foot">Use <b>G</b> for Graphics & Chaos Mode; <b>1–5</b> for actions, <b>Space</b> to pause. Click an awaiting guest to focus their prompt. This route intentionally stores test scores separately from your main save. All incidents are fictional.</div>`;
q('#h-mode').value=mode;q('#h-level').value=String(level);q('#h-speed').value=String(speed);
const gfx=createGraphicsPanel(graphics,settings=>{graphics=settings;saveGraphics(settings);});
document.body.append(gfx.element);gfx.setActive(true);

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
q('#h-canvas').addEventListener('click',e=>{const box=e.currentTarget.getBoundingClientRect(),x=(e.clientX-box.left)/box.width*384,y=(e.clientY-box.top)/box.height*216;const closest=event.visitors.filter(g=>!g.pending).find(g=>x>=g.x-5&&x<g.x+39&&y>=g.y-14&&y<g.y+45);if(closest)event.choose(closest.id);update();});
document.addEventListener('keydown',e=>{
 if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('select,input,textarea'))return;
 if(e.code==='Space'){e.preventDefault();if(event.mode==='playing')event.paused=!event.paused;update();}
 const action={Digit1:'welcome',Digit2:'check',Digit3:'redirect',Digit4:'security',Digit5:'debate'}[e.code];if(action){e.preventDefault();event.action(action);update();}
});

function draw(t){
 const canvas=q('#h-canvas'),ctx=setupGraphicsCanvas(canvas,graphics);
 if(!ctx)return;
 if(assets.hall.complete&&assets.hall.naturalWidth)ctx.drawImage(assets.hall,0,0,384,216);else{ctx.fillStyle='#312b4a';ctx.fillRect(0,0,384,216);}
 drawStageAtmosphere(ctx,t,event.phase);
 drawVenueRush(ctx,event,t);drawVenueScreens(ctx,event,t,{host:assets.pose0,cast:assets.cast,extra});drawVenueGates(ctx,assets.hall,event);drawStageQueueGuides(ctx,event);
 if(graphics.showNav){ctx.fillStyle='#ff668340';for(const o of VENUE_OBSTACLES)ctx.fillRect(o.x,o.y,o.w,o.h);ctx.fillStyle='#91f9b868';for(let y=84;y<230;y+=VENUE_CELL)for(let x=12;x<357;x+=VENUE_CELL)if(isVenueWalkable(x,y))ctx.fillRect(x,y,1,1);}
 const sprite=(kind,x,y,w,h,state,motion)=>{const box=venueSpriteGeometry(x,y,w,h,motion);drawContactShadow(ctx,box);drawVenueCharacter(ctx,assets.cast,poses[kind],kind,state,t,box.x,box.y,box.w,box.h,assets.walk,extra,walk4,motion,back4,stage,reactions,originalWalk,originalBack);};
 const mood=stageAction(event.phase,event.elapsed,event.visitors.length,event.elapsed<event.hostUntil?event.hostMood:'idle');
 sprite(0,event.hostX,event.hostY,31,39,event.hostWalking&&!event.departures.some(g=>g.stageVisit==='exchange')?'walk':mood);
 const actors=[...event.crowd.map(g=>({g,role:'crowd',w:27,h:34})),...event.arrivals.map(g=>({g,role:'arrival',w:34,h:42})),...event.visitors.map(g=>({g,role:'visitor',w:34,h:42})),...event.departures.map(g=>({g,role:'depart',w:34,h:42})),...event.staff.map(g=>({g,role:'staff',w:31,h:40})),...event.guardPositions.map(g=>({g,role:'guard',w:34,h:42}))].sort((a,b)=>a.g.y+a.h-(b.g.y+b.h));
 let ambient=0;
 const roomIsSpeaking=event.crowd.some(g=>g.speechTime>0);
 for(const {g,role,w,h} of actors){
  if(role==='visitor'&&g.id===event.focus){ctx.fillStyle='#fff0aa8b';ctx.beginPath();ctx.ellipse(g.x+w/2,g.y+h,20,7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffdd7a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(g.x+w/2,g.y+h,17,6,0,0,Math.PI*2);ctx.stroke();}
  const kind=role==='guard'?3:role==='staff'?7:g.kind;
  const state=role==='crowd'?(g.walking?'walk':g.animation):role==='depart'?(g.stageVisit==='exchange'?g.exchangeAction:g.walking?'walk':'idle'):role==='arrival'?(g.entryPhase==='ticket'?'point':g.walking?'walk':'idle'):role==='visitor'?(g.pending?'talk':g.type==='security'?'argue':g.type==='check'?'point':'idle'):g.walking?'walk':'idle';
  sprite(kind,g.x,g.y,w,h,state,g);
  if(role==='crowd'&&!ambient&&g.speechTime>0){drawAmbientBubble(ctx,g.speech.slice(0,Math.floor(g.speechProgress||0)),g.x+13,g.y,.86);ambient++;}
  else if(role==='crowd'&&!roomIsSpeaking&&g.speechTime<=0&&g.emoteTime>0&&!drawDggEmote(ctx,assets.emotes,g.emote,g.x+6,g.y-17,19)){ctx.fillStyle='#fff1d2';ctx.fillRect(g.x+7,g.y-9,15,9);ctx.fillStyle='#4e416e';ctx.font='bold 8px monospace';ctx.fillText(g.emote,g.x+10,g.y-2);}
  if(role==='visitor'&&g.pending){ctx.fillStyle='#77ffe2';ctx.fillRect(g.x+9,g.y-4,16,7);}
 }
 drawStageConversation(ctx,event);
 if(graphics.chaos){const waiting=event.visitors.filter(g=>!g.pending&&g.id!==event.focus).sort((a,b)=>(b.waitAge+(b.type==='security'?5:0))-(a.waitAge+(a.type==='security'?5:0))||a.serial-b.serial);for(let i=waiting.length-1;i>=0;i--)drawQueuedDecisionBubble(ctx,waiting[i].text,waiting[i].x+17,waiting[i].y,i,waiting[i].type);}
 for(const fx of event.effects){ctx.font='bold 8px monospace';ctx.lineWidth=3;ctx.strokeStyle='#11152e';ctx.strokeText(fx.text,fx.x,fx.y);ctx.fillStyle=fx.color;ctx.fillText(fx.text,fx.x,fx.y);}
 if(event.incidentFade){ctx.fillStyle='rgba(5,8,21,'+Math.min(1,1-event.incidentFade/1.15)+')';ctx.fillRect(0,0,384,216);}
 drawCameraFlashes(ctx,event);
 applyVenueTexture(ctx,canvas,graphics,t);
 applyVenueCRT(ctx,canvas,graphics);
}

function update(){
 const set=(id,value)=>{q(id).textContent=String(value);};
 set('#h-session',event.session==='endless'?'SURVIVAL':'LEVEL '+(event.levelIndex+1));
 set('#h-time',Math.floor(event.clock/60)+':'+String(Math.floor(event.clock%60)).padStart(2,'0'));
 set('#h-guests',(event.finished.length+event.lost)+' / '+(event.session==='endless'?'∞':event.cards.length));
 set('#h-vibe',event.vibe+'%');set('#h-score',event.score);set('#h-wave',event.session==='endless'?event.wave:event.phase);
 set('#h-caption',event.message);set('#h-pause',event.paused?'▶ Resume':'Ⅱ Pause');
 const guest=event.selected,bubble=q('#h-speech');bubble.hidden=!guest;
 if(guest){
  set('#h-name','◉ '+guest.name);set('#h-text','“'+guest.text+'”');set('#h-cue',guest.cue);set('#h-timer',Math.max(0,Math.ceil(guest.life-guest.age))+' seconds · '+guest.type.toUpperCase());
  const wrap=q('#h-stage').getBoundingClientRect(),sx=(guest.x+17)/384*wrap.width,sy=(guest.y-2)/216*wrap.height,bw=bubble.offsetWidth,bh=bubble.offsetHeight;
  const left=Math.max(3,Math.min(wrap.width-bw-3,sx-bw*.48)),top=Math.max(3,Math.min(wrap.height-bh-3,sy-bh-12));
  bubble.style.left=left+'px';bubble.style.top=top+'px';bubble.style.setProperty('--speech-tail',Math.max(12,Math.min(bw-18,sx-left))+'px');
 }
 if(event.mode==='results'){
  const panel=q('#h-start');panel.hidden=false;q('#h-start h2').textContent=event.session==='endless'?'SURVIVAL COMPLETE · WAVE '+event.wave:event.result.clear?'LEVEL CLEARED':'SHIFT ENDED';
  q('#h-start p').textContent='Score '+event.score+' · '+event.result.accuracy+'% accuracy · '+event.result.reason;
  q('#h-begin').textContent='↻ RESTART SESSION';
 }
}
let last=0,lastSpeechId=-1,lastSpeechCount=-1,lastSpeechAt=0;
function loop(now){const dt=Math.min(.09,last?(now-last)/1000:0);last=now;
 if(event.mode==='playing'&&!event.paused)for(let i=0;i<speed;i++)event.tick(dt);
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
 draw(now);update();requestAnimationFrame(loop);
}
reset();requestAnimationFrame(loop);
globalThis.__FEEDFALL_IRL_SANDBOX={get event(){return event;},engine,graphics,reset};
