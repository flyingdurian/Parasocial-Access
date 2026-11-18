import {
  RIVALS_V089,RIVAL_BY_ID_V089,createRivalBattleV089,enterRivalArenaV089,
  getRivalCueV089,resolveRivalTurnV089,leaveRivalArenaV089,
  BATTLE_TURNS_V089,TURN_DURATION_MS_V089,
} from './rival-invasions-v089.js';

const $=id=>document.getElementById(id);
const canvas=$('battle-canvas'),ctx=canvas.getContext('2d');
const menu=$('rival-choice'),mode=$('mode-choice'),start=$('start-button');
const buttons=[...document.querySelectorAll('[data-command]')];
for(const rival of RIVALS_V089){
 const option=document.createElement('option');option.value=rival.id;option.textContent=rival.name;menu.append(option);
}
const rivalImages=new Map(),host=new Image(),stage=new Image();
host.src='./assets/irl-host-poses.webp';
stage.src='./assets/rivals/v089/arena-stage-concept.png';
for(const rival of RIVALS_V089){
 const img=new Image();img.src='./'+rival.asset.path;rivalImages.set(rival.id,img);
}

let battle=null,startedAt=0,hiddenAt=0,hitFlash=0;
const fmtCommand=id=>({define_terms:'DEFINE TERMS',show_receipts:'SHOW RECEIPTS',read_room:'READ THE ROOM'})[id]||id;
const ready=()=>battle?.status==='active';

function drawCell(image,cols,rows,row,col,x,y,w,h){
 if(!image?.complete||!image.naturalWidth)return;
 const cw=image.naturalWidth/cols,ch=image.naturalHeight/rows;
 ctx.drawImage(image,col*cw,row*ch,cw,ch,x,y,w,h);
}

function drawCrowd(now){
 const drift=now*.0018;
 ctx.save();
 const shade=ctx.createLinearGradient(0,352,0,432);
 shade.addColorStop(0,'rgba(11,7,32,0)');shade.addColorStop(.3,'rgba(9,4,28,.75)');shade.addColorStop(1,'rgba(6,4,17,.98)');
 ctx.fillStyle=shade;ctx.fillRect(0,346,768,86);
 // Audience foreground is purposefully a readable row of heads/arms, not a
 // re-crop of the tiny v0.8.8v LCD feed or a blur of pixelated spectators.
 for(let i=0;i<21;i++){
  const x=i*40-12,y=390+Math.sin(i*1.74+drift)*4+((i%3)-1)*8;
  ctx.fillStyle=i%4===0?'#170f30':'#0e0a23';
  ctx.beginPath();ctx.ellipse(x,y,15+(i%3)*2,18,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x,y+36,27,28,0,0,Math.PI*2);ctx.fill();
  if(i%4===1){ctx.strokeStyle='#170e30';ctx.lineWidth=11;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+13,y+22);ctx.lineTo(x+23,y-19-6*Math.sin(drift+i));ctx.stroke();}
 }
 ctx.restore();
}

function drawArena(now){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 if(stage.complete&&stage.naturalWidth)ctx.drawImage(stage,0,0,768,432);
 else {ctx.fillStyle='#25163e';ctx.fillRect(0,0,768,432);}
 const id=battle?.rivalId||menu.value||'foodshops';
 const image=rivalImages.get(id),rival=RIVAL_BY_ID_V089[id];
 const bob=Math.sin(now/240)*2;
 // Both fighters remain fully in frame with separate contact shadows.
 for(const x of [197,566]){
  ctx.fillStyle='rgba(7,5,22,.37)';ctx.beginPath();ctx.ellipse(x,309,67,12,0,0,Math.PI*2);ctx.fill();
 }
 const speaking=battle?.status==='active'&&battle.turn%2===1;
 drawCell(host,4,2,0,speaking?2:0,127,120+bob,146,193);
 if(rival){
  const react=battle?.status==='active'&&battle.turn%2===0;
  const column=react?(battle.turn%4):0;
  drawCell(image,4,4,react?3:0,column,493,118-bob,146,192);
  if(battle?.status==='active'){
   ctx.fillStyle=rival.color;ctx.globalAlpha=.14;ctx.beginPath();ctx.ellipse(562,313,57,12,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  }
 }
 drawCrowd(now);
 if(hitFlash>0){ctx.fillStyle=`rgba(255,244,214,${Math.min(.16,hitFlash/800)})`;ctx.fillRect(0,0,768,432);hitFlash=Math.max(0,hitFlash-14);}
}

function renderUI(){
 const rival=RIVAL_BY_ID_V089[battle?.rivalId||menu.value];
 $('rival-name').textContent=rival?.name?.toUpperCase()||'RIVAL';
 const hp=battle?.destinyHp??100,enemy=battle?.rivalHp??rival?.maxHp??100;
 $('destiny-number').textContent=`${hp} / 100`;
 $('rival-number').textContent=`${enemy} / ${rival?.maxHp??100}`;
 $('destiny-hp').style.width=`${hp}%`;
 $('rival-hp').style.width=`${100*enemy/(rival?.maxHp||100)}%`;
 $('round-number').textContent=ready()?`ROUND ${battle.turn+1}/${BATTLE_TURNS_V089}`:battle?.status==='result'?'FINAL':'READY';
 $('special-label').textContent=`Finishing Argument · ${battle?.meter||0}/60`;
 for(const button of buttons)button.disabled=!ready()||(button.dataset.command==='special'&&battle.meter<60);
 start.disabled=!!battle&&['vs','active'].includes(battle.status);
 menu.disabled=start.disabled;mode.disabled=start.disabled;
 const cue=getRivalCueV089(battle);
 if(cue){
  $('cue-label').textContent=cue.label;
  $('cue-hint').textContent=cue.revealCounter?`COUNTER NOW: ${fmtCommand(cue.counter)}. Strike inside the highlighted timing window.`:
   `${cue.telegraph} · Read the signal and pick the correct counter quickly.`;
 }else if(!battle){$('cue-label').textContent='Choose a rival to begin';$('cue-hint').textContent='Six 3-second turns. Keyboard 1 / 2 / 3, Space for special. Touch works too.';}
}

function beginMatch(){
 if(battle&&['vs','active'].includes(battle.status))return;
 battle=createRivalBattleV089({rivalId:menu.value,mode:mode.value,seed:3});
 $('result-overlay').classList.add('hidden');
 $('vs-opponent').textContent=RIVAL_BY_ID_V089[battle.rivalId].name;
 $('vs-overlay').classList.remove('hidden');
 $('cue-label').textContent='THE CHALLENGER APPROACHES';
 $('cue-hint').textContent='Venue timers would be frozen here by the future hall adapter.';
 $('combat-log').textContent='The crowd parts. Destiny takes the stage.';
 renderUI();
 window.setTimeout(()=>{
  if(battle?.status!=='vs')return;
  battle=enterRivalArenaV089(battle);startedAt=performance.now();
  $('vs-overlay').classList.add('hidden');renderUI();
 },900);
}

function playerAction(command, elapsed){
 if(!ready())return;
 try{
  const before=battle;
  battle=resolveRivalTurnV089(battle,{command,timingMs:Math.min(TURN_DURATION_MS_V089,Math.max(0,elapsed))});
  const event=battle.history.at(-1);
  $('combat-log').textContent=event.hit?
   `${event.special?'FINISHING ARGUMENT!':event.perfect?'PERFECT COUNTER!':'COUNTER LANDED!'} ${event.dealt} HP damage · ${battle.combo}x combo`:
   `${event.timingMs>=TURN_DURATION_MS_V089?'TIME OUT!':'COUNTER MISSED!'} Rival rebuts for ${event.taken} HP`;
  if(event.hit)hitFlash=100;
  startedAt=performance.now();
  if(battle.status==='result'){
   $('result-title').textContent=battle.result==='victory'?'DEBATE WON':'DEBATE LOST';
   $('result-title').style.color=battle.result==='victory'?'#a5f3cc':'#ffa5bc';
   $('result-detail').textContent=`Against ${RIVAL_BY_ID_V089[before.rivalId].name} · ${before.mode} · ${battle.turn} turns. Fictional arcade result.`;
   $('result-overlay').classList.remove('hidden');
   $('cue-label').textContent=battle.result==='victory'?'YOU WON THE EXCHANGE':'YOU LOST THE EXCHANGE';
   $('cue-hint').textContent='The hall restore sequence is reserved for lead-developer integration.';
  }
  renderUI();
 }catch(error){$('combat-log').textContent=`Lab input rejected: ${error.message}`;}
}

function loop(now){
 drawArena(now);
 if(ready()){
  const elapsed=now-startedAt;
  if(elapsed>=TURN_DURATION_MS_V089){
   const expected=getRivalCueV089(battle)?.counter;
   const wrong=['define_terms','show_receipts','read_room'].find(c=>c!==expected);
   playerAction(wrong,TURN_DURATION_MS_V089);
  }
  const left=Math.max(0,TURN_DURATION_MS_V089-(now-startedAt));
  $('cue-timer').textContent=`${((BATTLE_TURNS_V089-battle.turn-1)*3+left/1000).toFixed(1)}s`;
  $('timer-fill').style.width=`${100*left/TURN_DURATION_MS_V089}%`;
 }else if(!battle){$('cue-timer').textContent='18.0s';$('timer-fill').style.width='100%';}
 requestAnimationFrame(loop);
}

buttons.forEach(btn=>btn.addEventListener('click',()=>playerAction(btn.dataset.command,performance.now()-startedAt)));
window.addEventListener('keydown',e=>{
 if(e.repeat||!ready()||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 const action={'1':'define_terms','2':'show_receipts','3':'read_room',' ':'special'}[e.key];
 if(!action)return;
 if(action==='special'&&battle.meter<60)return;
 e.preventDefault();playerAction(action,performance.now()-startedAt);
});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)hiddenAt=performance.now();
 else if(hiddenAt&&ready()){startedAt+=performance.now()-hiddenAt;hiddenAt=0;}
});
start.addEventListener('click',beginMatch);
$('again-button').addEventListener('click',()=>{
 if(battle?.status==='result')battle=leaveRivalArenaV089(battle);
 battle=null;$('result-overlay').classList.add('hidden');
 $('combat-log').textContent='The audience is ready for another challenger.';
 renderUI();
});
menu.addEventListener('change',renderUI);
renderUI();requestAnimationFrame(loop);
