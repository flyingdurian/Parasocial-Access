/* Original procedural score composed for Feedfall Rush Hour. All notes, rhythms and
   SFX generated locally with Web Audio. No copyrighted recordings or external requests. */
const semitone=n=>440*Math.pow(2,(n-69)/12);
const TRACKS={pulse:{bpm:96,bass:[48,48,53,48,46,48,53,51],arp:[72,76,79,83,76,79,84,88],chords:[60,64,67]},feed:{bpm:112,bass:[43,43,38,43,46,43,41,38],arp:[67,70,74,70,67,70,77,74],chords:[55,58,62]},arena:{bpm:123,bass:[45,45,41,43,45,48,41,43],arp:[69,72,76,72,69,76,79,76],chords:[57,60,64]},market:{bpm:118,bass:[40,43,45,40,48,43,45,38],arp:[64,67,71,74,67,71,76,74],chords:[52,55,59]},thread:{bpm:126,bass:[46,46,41,44,46,51,44,41],arp:[70,74,77,81,74,77,82,86],chords:[58,62,65]},destiny:{bpm:142,bass:[43,46,41,43,48,46,41,43],arp:[74,77,82,79,74,79,84,86],chords:[55,59,62]},emote:{bpm:156,bass:[43,43,50,48,43,50,48,43],arp:[79,86,91,86,79,86,91,98],chords:[55,62,67]},nova:{bpm:102,bass:[48,52,55,52,45,48,52,55],arp:[72,76,79,84,79,76,74,72],chords:[60,64,67]},glitch:{bpm:150,bass:[40,40,47,45,40,47,43,45],arp:[76,79,83,86,79,83,88,91],chords:[52,55,59]},'glitch-final':{bpm:178,bass:[40,47,43,40,45,48,43,47],arp:[83,88,91,95,86,91,95,98],chords:[52,55,59]},rush:{bpm:164,bass:[43,43,46,41,43,48,46,41],arp:[79,82,86,84,82,79,86,89],chords:[55,59,62]},convention:{bpm:108,bass:[43,43,50,46,43,48,46,50],arp:[67,74,79,74,69,74,81,77],chords:[55,62,67]},'convention-peak':{bpm:131,bass:[43,50,46,43,48,50,46,43],arp:[74,79,81,86,79,86,84,81],chords:[55,62,69]},'convention-qa':{bpm:120,bass:[43,46,50,43,48,46,43,50],arp:[79,74,86,81,79,77,84,86],chords:[55,59,65]},'convention-wave':{bpm:172,bass:[43,43,41,43,50,48,43,46],arp:[79,82,86,89,84,86,91,94],chords:[55,62,67]}};
export class RushAudio{
 constructor(){this.ctx=null;this.sfxEnabled=true;this.musicEnabled=true;this.master=.52;this.musicVol=.29;this.musicLevel=2;this.nextNote=0;this.step=0;this.track='';this.mode='menu';this.musicBus=null;this.effectsBus=null;this.lastPhrase='';this._noise=null;this.nextVenueAmbience=0;}
 arm(){try{this.ctx??=new(window.AudioContext||window.webkitAudioContext)();if(!this.musicBus){this.musicBus=this.ctx.createGain();this.musicBus.gain.value=this.musicEnabled?this.musicVol:0;this.musicBus.connect(this.ctx.destination);this.effectsBus=this.ctx.createGain();this.effectsBus.gain.value=this.sfxEnabled?this.master:0;this.effectsBus.connect(this.ctx.destination);}if(this.ctx.state==='suspended')void this.ctx.resume();return !!this.ctx;}catch{return false;}}
 osc(n,dur=.12,delay=0,wave='sine',vol=.1,bus='sfx',endNote=null){if(bus==='sfx'&&!this.sfxEnabled)return;if(bus==='music'&&!this.musicEnabled)return;if(!this.arm())return;const t=this.ctx.currentTime+delay;this.playAt(n,t,dur,wave,vol,bus,endNote);}
 playAt(n,t,dur,wave,vol,bus,endNote=null){const ctx=this.ctx;if(!ctx)return;const o=ctx.createOscillator(),gain=ctx.createGain();o.type=wave;o.frequency.setValueAtTime(semitone(n),t);if(endNote!==null)o.frequency.exponentialRampToValueAtTime(semitone(endNote),t+dur*.95);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(Math.max(.0005,vol),t+.014);gain.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(gain).connect(bus==='music'?this.musicBus:this.effectsBus);o.start(t);o.stop(t+dur+.025);}
 noise(t,dur=.05,freq=2800,vol=.09,bus='sfx'){if((bus==='sfx'&&!this.sfxEnabled)||(bus==='music'&&!this.musicEnabled)||!this.arm())return;const ctx=this.ctx;const length=Math.max(1,Math.floor(ctx.sampleRate*dur));const buf=ctx.createBuffer(1,length,ctx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/length,1.4);const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();filter.type='bandpass';filter.frequency.value=freq;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.buffer=buf;src.connect(filter).connect(g).connect(bus==='music'?this.musicBus:this.effectsBus);src.start(t);}
 volumePercent(){return [35,70,100][this.musicLevel]||100;}
 cycleVolume(){this.musicLevel=(this.musicLevel+1)%3;this.musicVol=[.11,.21,.32][this.musicLevel];if(this.musicBus)this.musicBus.gain.value=this.musicEnabled?this.musicVol:0;this.arm();return this.volumePercent();}
 setMusic(enabled){this.musicEnabled=enabled;if(!enabled){if(this.musicBus)this.musicBus.gain.value=0;}else{this.arm();if(this.musicBus)this.musicBus.gain.value=this.musicVol;this.nextNote=0;}return enabled;}
 setSfx(enabled){this.sfxEnabled=enabled;if(enabled)this.arm();if(this.effectsBus)this.effectsBus.gain.value=enabled?this.master:0;return enabled;}
 setMode(mode){this.mode=mode;const track=TRACKS[mode]?mode:'feed';if(track!==this.track){this.track=track;this.nextNote=0;this.step=0;this.lastPhrase=mode;}}
 tick(){if(!this.ctx||!this.musicEnabled||this.ctx.state!=='running')return;const ctx=this.ctx;if(this.mode==='menu'||this.mode==='results'||this.mode==='shop')return;const track=TRACKS[this.track]||TRACKS.feed;const spacing=60/track.bpm/2;if(this.nextNote<ctx.currentTime-.5)this.nextNote=ctx.currentTime+.03;if(!this.nextNote)this.nextNote=ctx.currentTime+.04;let iter=0;while(this.nextNote<ctx.currentTime+.18&&iter++<5){const s=this.step%16,idx=Math.floor(s/2)%8,t=this.nextNote;const fast=this.track==='rush'||this.track==='convention-wave';
  if(s%4===0)this.playAt(track.bass[idx],t,spacing*1.45,'triangle',fast?.105:.080,'music');
  if(s%2===0)this.playAt(track.arp[idx]+(s%8===6?12:0),t,spacing*(fast?.56:.78),'sine',fast?.055:.044,'music');
  if(s%8===0){for(let j=0;j<track.chords.length;j++)this.playAt(track.chords[j],t,spacing*5,'sine',.016,'music');}
  if(this.track==='market'){if(s%4===0)this.playAt(34,t,.12,'sine',.18,'music',21);if(s%4===2)this.noise(t,.085,1600,.055,'music');if(s%2===1)this.noise(t,.032,6700,.02,'music');}
  if(fast){if(s%4===0)this.playAt(38,t,.13,'sine',.18,'music',20);if(s%4===2)this.noise(t,.10,1250,.07,'music');this.noise(t,.037,6100,.021,'music');}
  else{if(s%8===0)this.playAt(36,t,.16,'sine',.11,'music',22);if(s%4===2)this.noise(t,.057,1750,.026,'music');if(s%2===1)this.noise(t,.025,6000,.009,'music');}
  this.step++;this.nextNote+=spacing;}
 }
 emoteStart(){for(let i=0;i<3;i++)this.osc([67,74,79][i],.18,i*.092,'triangle',.09);}
 emoteHit(){this.osc(79,.075,0,'sine',.12);this.osc(86,.10,.048,'triangle',.11);}
 emoteBreak(){this.osc(54,.16,0,'sawtooth',.09,'sfx',43);}
 celebration(){for(let i=0;i<5;i++)this.osc([72,76,79,84,91][i],.26,i*.084,'sine',.095);}
 roundBreak(){this.osc(42,.22,0,'sawtooth',.14,'sfx',32);this.osc(67,.12,.12,'triangle',.10);}
 roundStart(){for(let i=0;i<4;i++)this.osc([52,59,64,76][i],.19,i*.08,'triangle',.14);}
 milestone(){for(let i=0;i<6;i++)this.osc([60,64,67,72,79,84][i],.22,i*.06,'triangle',.115);}
 success(combo=0){this.osc(79,.075,0,'triangle',.15);this.osc(86,.12,.042,'sine',.13);this.osc(91,.16,.095,'sine',.085);if(combo&&combo%4===0)this.combo(combo);}
 batch(){this.osc(66,.09,0,'triangle',.16);this.osc(73,.11,.05,'triangle',.16);this.osc(80,.15,.11,'sine',.14);this.osc(92,.23,.18,'sine',.12);}
 approve(combo){this.osc(77,.1,0,'triangle',.16);this.osc(89,.18,.045,'sine',.1);if(combo&&combo%4===0)this.combo(combo);}
 flag(combo){this.osc(73,.09,0,'triangle',.12, 'sfx',68);this.osc(79,.13,.075,'square',.035);this.osc(70,.2,.13,'sine',.065);if(combo&&combo%4===0)this.combo(combo);}
 remove(combo){const t=this.ctx?.currentTime||0;this.noise(t,.095,1100,.20);this.osc(47,.19,0,'sawtooth',.21,'sfx',31);this.osc(72,.1,.07,'triangle',.12);if(combo&&combo%4===0)this.combo(combo);}
 miss(){this.osc(52,.14,0,'sawtooth',.11,'sfx',41);this.osc(48,.2,.07,'triangle',.10,'sfx',33);}
 combo(n){const base=70+Math.min(10,Math.floor(n/4));for(let i=0;i<4;i++)this.osc(base+[0,4,7,12][i],.17,i*.064,'sine',.10);}
 arrival(){this.osc(68,.045,0,'sine',.023);}
 irlWaveStart(event){
  if(!event||event.session!=='endless'||event.mode!=='playing')return;
  if(this._waveSession!==event){this._waveSession=event;this._waveSeen=0;}
  if(event.wave<=this._waveSeen)return;
  this._waveSeen=event.wave;
  // Original urgent 4-hit venue alarm, layered over the faster opening bars.
  for(let i=0;i<4;i++){
   this.osc(57+(i%2)*5,.17,i*.16,'sawtooth',.11,'sfx',50);
   this.osc(79+i*2,.12,i*.16+.06,'triangle',.075);
  }
  if(this.ctx?.state==='running')this.noise(this.ctx.currentTime+.12,.24,920,.10);
 }
 irlSpeechTick(seed=0){
  if(!this.sfxEnabled||!this.ctx||this.ctx.state!=='running')return;
  // Short varied retro gibberish per displayed text tick, deliberately quiet.
  const notes=[63,67,71,69,74,61],n=notes[Math.abs(seed)%notes.length];
  this.playAt(n,this.ctx.currentTime,.027,'square',.014,'sfx',n+(seed%3-1));
 }
 irlStamp(ok,action){
  if(ok){this.osc(action==='security'?46:action==='debate'?65:79,.09,0,'triangle',.13,'sfx',action==='security'?32:90);this.osc(86,.14,.065,'sine',.1);if(action==='debate')this.osc(93,.15,.14,'triangle',.12);}
  else{this.osc(54,.075,0,'sawtooth',.1,'sfx',41);this.osc(45,.15,.07,'square',.055,'sfx',35);}
 }
 irlAmbience(phase){
  if(!this.musicEnabled||!this.ctx||this.ctx.state!=='running'||this.mode==='menu')return;
  const now=this.ctx.currentTime;if(now<this.nextVenueAmbience)return;
  this.nextVenueAmbience=now+(phase===2?3.6:phase===3?4.1:5.5);
  // Soft crowd murmur and sparse lobby PA tones, original synthesized score.
  this.noise(now,.32,phase===2?790:610,.013,'music');
  if(phase===3)this.playAt(76,now+.19,.11,'sine',.012,'music');
 }
 // Synthesized clashes, keyed to story beats so there is no 60fps audio spam.
 // Existing global SFX toggle gates every osc(), and no recordings are used.
 // Original retro boxer-corner babble: pitched vowel-like syllables, never sampled dialogue.
 // Called at the exchange beat (~0.8s), not every render frame.
 irlDebateVoice(beat=0){
  if(!this.sfxEnabled)return;
  const host=beat%2===0;
  const base=(host?49:58)+(beat%4)*2;
  for(let syllable=0;syllable<3+(beat%3);syllable++){
   const delay=syllable*.065;
   const vowel=[0,6,-3,4,1][(beat+syllable)%5];
   this.osc(base+vowel,.065,delay,syllable%2?'triangle':'sawtooth',host?.038:.033,'sfx',base+vowel-4);
   this.osc(base+12+vowel,.045,delay+.012,'square',.010,'sfx',base+7+vowel);
  }
 }
 irlDebateClash(beat=0,power=1){
  const pitch=50+(beat%5)*2;
  this.irlDebateVoice(beat);
  if(power===0){this.osc(76,.10,0,'sine',.033,'sfx',62);this.osc(65,.11,.05,'triangle',.021,'sfx',58);return;}
  this.osc(pitch,.09+(power===2?.08:0),0,'sawtooth',power===2?.13:.065,'sfx',pitch-10);
  this.osc(pitch+19,.13,.07,'triangle',power===2?.11:.065,'sfx',pitch+10);
  if(power===2){this.noise(this.ctx?.currentTime||0,.11,600,.13);this.osc(42,.19,.07,'sawtooth',.16,'sfx',25);}
 }
 irlDebateIntro(){
  this.osc(43,.22,0,'sawtooth',.085,'sfx',36);
  this.osc(55,.19,.11,'triangle',.068);
  this.osc(67,.22,.23,'square',.038);
 }
 irlDebateOutro(won){
  const notes=won?[62,69,74,81]:[67,60,54,47];
  for(let i=0;i<notes.length;i++)this.osc(notes[i],.15,i*.083,'triangle',.077);
 }
 irlDebateTick(event){
  if(!event||event.paused)return;
  if(this._debateSession!==event){this._debateSession=event;this._debateActor=null;this._debateBeat=-1;}
  const live=event.departures?.find(g=>g.debater&&g.stageVisit==='exchange');
  if(live){
   const key=String(live.serial)+':'+String(live.id);
   if(this._debateActor!==key){this._debateActor=key;this._debateBeat=live.hypeBeat||0;this.irlDebateIntro();}
   else if((live.hypeBeat||0)>this._debateBeat){
    this._debateBeat=live.hypeBeat;this.irlDebateClash(this._debateBeat,live.clashPower??1);
   }
  }else if(this._debateActor!==null&&this._debateActor!==undefined){
   if(event.tvEvent?.type==='debate')this.irlDebateOutro(!!event.tvEvent.won);
   this._debateActor=null;this._debateBeat=-1;
  }
 }
 irlSecurityTick(event){
  if(!event||event.paused)return;
  if(this._securitySession!==event){this._securitySession=event;this._securityBeat='';}
  const guard=event.guardPositions?.find(g=>g.task?.phase==='engage'&&g.task.action==='security');
  const guest=guard&&event.visitors?.find(g=>g.id===guard.task.guestId);
  if(!guest||guest.type!=='security'){this._securityBeat='';return;}
  const beat=Math.floor(Math.max(0,guard.task.remaining)/.45),key=String(guest.id)+':'+beat;
  if(key!==this._securityBeat){
   this._securityBeat=key;
   this.osc(48+beat*3,.085,0,'triangle',.08,'sfx',39);
   this.osc(75-beat,.11,.035,'sine',.085,'sfx',57);
  }
 }
 irlDispatch(action){if(action==='security'){this.osc(53,.12,0,'triangle',.13);this.osc(65,.15,.09,'sine',.095);}
  else if(action==='debate'){this.osc(57,.08,0,'sawtooth',.075);this.osc(69,.09,.065,'triangle',.11);this.osc(81,.13,.14,'sine',.13);}
  else if(action==='check'){this.osc(82,.05,0,'sine',.095);this.osc(86,.06,.11,'sine',.09);}
  else if(action==='redirect'){this.osc(70,.07,0,'triangle',.105);this.osc(76,.09,.08,'triangle',.09);}
  else{this.osc(79,.075,0,'sine',.10);this.osc(84,.12,.055,'sine',.08);}}
 danger(){this.osc(45,.18,0,'sawtooth',.12,'sfx',37);this.osc(42,.16,.11,'triangle',.06);}
 pulse(){this.osc(68,.12,0,'triangle',.14);this.osc(80,.20,.035,'sine',.18);this.osc(92,.28,.12,'sine',.10);this.osc(104,.20,.2,'sine',.055);}
 freeze(){this.osc(83,.18,0,'sine',.13,'sfx',65);this.osc(93,.21,.09,'sine',.07,'sfx',71);}
 upgrade(){for(let i=0;i<5;i++)this.osc([60,64,67,72,79][i],.21,i*.085,'triangle',.12);}
 win(){for(let i=0;i<6;i++)this.osc([60,64,67,72,76,84][i],.30,i*.095,'triangle',.15);}
 start(){this.arm();this.osc(55,.15,0,'triangle',.14,'sfx',67);this.osc(72,.23,.12,'sine',.11);}
}
export const sound=new RushAudio();
