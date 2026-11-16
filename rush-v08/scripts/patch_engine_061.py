from pathlib import Path
p=Path(__file__).resolve().parents[1]/'src/engine.js';s=p.read_text()
def rep(a,b):
 global s
 count=s.count(a)
 assert count==1,(count,a[:145])
 s=s.replace(a,b)
rep("import {NETWORK_CREATORS, CREATOR_EVENTS, CREATOR_UPGRADES, creatorLevel, createCreatorSave, creatorRemix} from './creators-v06.js';", "import {NETWORK_CREATORS, CREATOR_EVENTS, CREATOR_UPGRADES, creatorLevel, createCreatorSave} from './creators-v06.js';\nimport {createIdentityCases,makeEmoteScript} from './creator-identity-v061.js';")
rep("export const SAVE_KEY='feedfall:rush-hour:creator-network:v06';", "export const SAVE_KEY='feedfall:rush-hour:creator-identity:v061';\nexport const PRIOR_V06_KEY='feedfall:rush-hour:creator-network:v06';")
rep('const defaults=()=>({version:6,', 'const defaults=()=>({version:7,')
rep('if(p&&[2,3,4,5,6].includes(p.version)){', 'if(p&&[2,3,4,5,6,7].includes(p.version)){')
rep('v={...v,...p,version:6};', 'v={...v,...p,version:7};')
rep('for(const key of [SAVE_KEY,PRIOR_V05_KEY', 'for(const key of [SAVE_KEY,PRIOR_V06_KEY,PRIOR_V05_KEY')
rep('this.activeCreatorEvent=null;this.pendingCreatorEvent=null;}', 'this.activeCreatorEvent=null;this.pendingCreatorEvent=null;this.emoteTrain=null;this.momentum=0;this.communityCelebrations=0;this.tournament=null;this.debateProgress=new Map();this.debateClashes=0;this.creatorBonuses=0;}')
rep('this.activeCreatorEvent=creatorEvent;this.world=world;', 'this.activeCreatorEvent=creatorEvent;this.emoteTrain=null;this.momentum=0;this.communityCelebrations=0;this.tournament=null;this.debateProgress=new Map();this.debateClashes=0;this.creatorBonuses=0;this.world=world;')
rep('this.configuration.cases=creatorRemix(this.configuration.cases,creatorEvent.creator,creatorEvent.id);','this.configuration.cases=createIdentityCases(this.configuration.cases,creatorEvent.creator,creatorEvent.id);')
rep("this.mode='playing';this.progress.sessions++;", "if(creatorEvent?.creator==='destiny'&&this.stream){this.emoteTrain={active:false,started:false,script:makeEmoteScript(this.recentSeed),index:0,current:null,timer:0,combo:12,peak:12,correct:0,broken:0,milestones:[],milestoneScore:0};}\n  if(creatorEvent?.creator==='glitch')this.tournament={round:1,breakRemaining:0,clutches:0,roundStreak:0,peakStreak:0,roundBonusAwarded:false};\n  this.mode='playing';this.progress.sessions++;")
# Before update emit methods
anchor=' update(dt){if(this.mode!==\'playing\')return;dt=clamp(dt,0,.12);'
assert anchor in s
new_methods=''' get creatorId(){return this.activeCreatorEvent?.creator||null;}
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
'''
s=s.replace(anchor,new_methods+anchor)
rep("update(dt){if(this.mode!=='playing')return;dt=clamp(dt,0,.12);", "update(dt){if(this.mode!=='playing')return;dt=clamp(dt,0,.12);if(this.tickSignature(dt))return;")
rep("answer(decision,id=null){if(this.mode!=='playing'||!['approve','flag','remove'].includes(decision))return null;", "answer(decision,id=null){if(this.mode!=='playing'||this.signatureActive||!!this.tournament?.breakRemaining||!['approve','flag','remove'].includes(decision))return null;")
rep("this.lastOutcome={case:c,decision,correct,points,combo:this.combo,truth:c.verdict,streakBroken:!correct&&oldCombo>=3};this.emit('verdict',this.lastOutcome);", "this.applyCreatorVerdict(c,correct);this.lastOutcome={case:c,decision,correct,points,combo:this.combo,truth:c.verdict,streakBroken:!correct&&oldCombo>=3};this.emit('verdict',this.lastOutcome);\n  if(this.emoteTrain&&!this.emoteTrain.started&&this.handled>=7)this.startEmoteTrain();")
rep("if(!this.stream&&!this.queue.length&&this.nextIndex<this.cards.length)","if(!this.stream&&!this.queue.length&&this.nextIndex<this.cards.length)") if False else None
rep('this.results={reason,cleared,stars,creatorEventTitle:', 'this.results={reason,cleared,stars,creatorIdentity:{emotePeak:this.emoteTrain?.peak||0,emoteCorrect:this.emoteTrain?.correct||0,emoteBroken:this.emoteTrain?.broken||0,debateClashes:this.debateClashes,communityCelebrations:this.communityCelebrations,tournamentClutches:this.tournament?.clutches||0,creatorBonuses:this.creatorBonuses},creatorEventTitle:')
p.write_text(s)
print('patched',len(s))
