import {VENUE_STATIONS,VENUE_STAGE,VENUE_GATES,isVenueWalkable,snapVenue,moveVenue,moveStageActor,venueQueueSpot,venueStageQueueSpot,venueRoamPoint} from './venue-nav.js';
import {IRL_LEVELS,IRL_ENDLESS,irlClampLevel,endlessWaveGuests,endlessArrivalInterval} from './irl-progression-v085.js';
import {DESTINY_IRL_SCENARIOS,ambientLine} from './irl-lore-v082.js';
import {DESTINY_LORE_CARDS,loreAmbientLine,loreStageLine} from './irl-lore-v084.js';
import {stageAction,stagePosition} from './sprite-animation.js';
import {ambientEmote} from './irl-atmosphere-v083.js';
import {dggEmoteFor} from './dgg-emotes-v085.js';
import {selectDebateTopic,judgeStageDebate,fanInteractionKind} from './irl-debates-v088.js';
/* OFF THE FEED v0.8 — world-first living convention simulator.
   Real-world names identify a parody setting; every attendee and incident is invented.
   Unsafe conduct is resolved through trained event security, not player violence. */
export const IRL_SCENARIOS=[
 ['welcome','YEE Loyalist','Team YEE checking in!','A guest holds a handmade dinosaur sign.','They only want a quick photo with their sign.'],
 ['welcome','PEPE Poster','PEPE wins this round.','A rival emote-faction fan grins at the YEE group.','A playful argument, not an actual conflict.'],
 ['welcome','Source Enthusiast','I brought a binder of citations.','A fan presents a tabbed binder at the autograph table.','The binder is fan art inspired by source-request debates.'],
 ['welcome','Old-School Viewer','I remember the StarCraft days!','A nostalgic viewer brought an old tournament ticket.','They want to share a memory and request a signature.'],
 ['welcome','Bridge Archivist','Please sign this tiny bridge drawing.','A fan displays a cartoon bridge.','They are making a joke about debates and relationships.'],
 ['welcome','Canvassing Volunteer','The volunteer meetup was great.','A badge-wearing attendee talks enthusiastically about volunteering.','Their event pass checks out.'],
 ['welcome','Policy Nerd','My question has three premises.','Someone is practicing a debate question in line.','No misconduct; they are nervous about speaking.'],
 ['welcome','Fan Artist','I drew the entire debate desk.','An attendee holds a carefully drawn sketch.','They are carrying a harmless art print.'],
 ['welcome','First-Time Viewer','My friend dragged me here.','They appear confused by every emote reference.','They purchased a valid event ticket.'],
 ['welcome','Merch Collector','Is there an old-school shirt left?','A collector is comparing the official merch sizes.','They are waiting in the correct queue.'],
 ['welcome','Question Collector','Can you recommend a reading list?','A guest asks about political philosophy.','They have no intention of starting a confrontation.'],
 ['welcome','Emote Historian','YEE never loses. Ask anyone.','Two friends laugh while showing rival emote badges.','Both are engaging in a friendly community joke.'],
 ['welcome','Panel Listener','I disagree, but I came to listen.','A calm visitor holds a card with an opposing opinion.','Disagreement is permitted at the event.'],
 ['welcome','Podcast Fan','Can you sign the program?','A guest holds a convention schedule.','An ordinary autograph request.'],
 ['welcome','Chat Regular','This is so different from chat.','A regular viewer wants a photograph.','They are following all posted rules.'],
 ['welcome','Local Visitor','The live event is worth the trip.','An attendee smiles at the merch stall.','No issue identified.'],
 ['welcome','Electoral Analyst','Can I ask about primary strategy?','A fan carries a self-made election map.','A harmless policy question during the Q&A portion.'],
 ['welcome','Debate Clip Fan','I learned that argument from a clip.','An attendee is excited to discuss a famous debate format.','They have a valid admission and are waiting patiently.'],
 ['welcome','Media Critic','Your take on that interview was wrong.','A guest wants a respectful political disagreement.','Ordinary criticism is welcome and not a security issue.'],
 ['welcome','Civic Organizer','Our canvassing crew says hello!','A guest waves a volunteer-event flyer.','A harmless community organizing conversation.'],
 ['welcome','Drama Recap Viewer','I need a flowchart for this arc.','A fan made a joke timeline of fictional streamer disputes.','A fan-made parody chart, not a threat or allegation.'],
 ['welcome','Philosophy Student','I disagree with your metaethics premise.','A student has prepared one very long question.','No rule broken; they just love philosophy debates.'],
 ['welcome','Podcast Collector','I brought both show posters.','An attendee wants autographs on podcast-inspired fan posters.','A normal merchandise and fan-art interaction.'],
 ['welcome','Political News Junkie','Will you do another long debate?','A viewer asks about political coverage and preparation.','They only want to speak during the open Q&A.'],
 ['welcome','Source Spreadsheet','My citations have citations.','A fan carries an absurdly detailed spreadsheet printout.','An elaborate and harmless community inside joke.'],
 ['redirect','Loud Heckler','I think your argument was terrible!','They repeatedly interrupt a guest taking a photo.','A staff member asks them to move to the discussion area.'],
 ['redirect','Queue Cutter','I just need one quick autograph.','They move around a queue barrier after being redirected.','This is a line-management violation, not a physical threat.'],
 ['redirect','Unscheduled Interviewer','Five minutes on my microphone?','A visitor starts filming in a no-interview zone.','They need permission from event staff.'],
 ['redirect','Oversized Sign','My sign blocks the entire aisle.','An attendee accidentally obstructs the exit route.','The oversized prop must go to the designated storage table.'],
 ['redirect','Merch Dispute','But I paid for priority shipping!','A guest argues with the cashier and holds up the line.','Direct them to the merch help desk.'],
 ['redirect','Panel Debater','I need the microphone right now.','A participant tries to skip the public Q&A queue.','They can ask questions during their designated turn.'],
 ['redirect','Overeager Photographer','One more photo, please!','A guest keeps stepping back into the signing area.','The line needs to keep moving.'],
 ['redirect','Wrong Badge','I think I entered the wrong hall.','A visitor has an entirely different convention badge.','They belong in the adjacent exhibit hall.'],
 ['redirect','Overlong Question','I have seventeen follow-up questions!','Someone uses too much of another guest’s allotted mic time.','They need to return to the discussion line after one question.'],
 ['redirect','Clip Argument','You clipped my last sentence!','Two attendees argue loudly about a fictional debate edit.','Event staff can move the dispute away from the signing table.'],
 ['redirect','Fake Panel Schedule','The debate starts right now!','Someone is announcing an unapproved panel in the main aisle.','Staff should direct them to the official schedule desk.'],
 ['redirect','Streamer Drama Debater','Let me explain the entire breakup arc.','A guest disrupts photographs with an unrelated personal-drama monologue.','Move the discussion to the designated fan area.'],
 ['redirect','Accessible Route Blocker','I can set up my camera here, right?','A tripod blocks the accessible path despite posted signs.','Stewards need to clear the walkway without blaming an attendee’s identity.'],
 ['redirect','Floor Mic Hog','I have one final question. And another.','A guest keeps the public microphone past their allotted turn.','They must move back to the discussion queue.'],
 ['redirect','Photo Consent Mix-up','But I already started filming everyone!','Someone records a no-camera fan area after being asked to stop.','Staff can guide them to the approved media zone.'],
 ['redirect','Marching Emote Group','YEE NEVA LOSE! We need more space!','The joking fan group accidentally fills an emergency corridor.','Redirect the procession into an open fan area.'],
 ['check','Pass Confusion','I thought this was a VIP pass.','A guest has a ticket with unclear printing.','Staff verification shows the regular pass is valid.'],
 ['check','Delivery Mix-up','These boxes belong to the stage.','An unfamiliar attendee brings a delivery slip to the front desk.','The venue manifest verifies a harmless merchandise delivery.'],
 ['check','Unexpected Visitor','My friend said I was on the list.','An attendee has a name not visible on the printed roster.','An updated staff list confirms their admission.'],
 ['check','Lost Phone','Can someone help me find my phone?','A visitor waits beside a staff-only sign.','They were directed here to contact lost-and-found.'],
 ['check','Fact-check Booth','I was asked to set up a source wall.','Someone has an organizer note, but no visible staff badge.','A verified staff note authorizes the booth.'],
 ['check','Volunteer List','My team was told to check in here.','A canvassing volunteer carries a handwritten group list.','The coordinator confirms the volunteer assignment.'],
 ['check','Signed Print Mix-up','My order has the wrong badge number.','A fan has an order slip that differs from their ticket.','The merchandise ledger confirms a harmless pickup mix-up.'],
 ['check','Source Wall Organizer','My booth credentials are in the system.','The proposed research wall has no visible authorization placard.','Check the convention schedule before granting floor space.'],
 ['check','Podcast Pass Holder','I should be on the guest interview list.','The guest shows a podcast wristband unfamiliar to the greeter.','An updated organizer manifest can settle the mismatch.'],
 ['check','Volunteer Check-in','The canvassing team told me to report here.','A visitor presents a volunteer list with a different shift time.','Confirm the schedule with the event coordinator.'],
 ['security','Credible Threat Report','I intend to hurt the speaker.','Staff report an explicit, credible threat and repeated refusal to comply.','Two staff statements corroborate the threat; immediately notify security.'],
 ['security','Escalating Intimidation','You will not finish this event.','A visitor issues direct threats and harasses staff after a warning.','Independent observations confirm a safety escalation; contact security.'],
 ['security','Security Alert','The speaker is not safe here.','Venue security forwards a substantiated incident warning.','The event safety team confirms a credible concern requiring intervention.'],
 ['security','Repeated Threats','I am going to hurt someone.','Staff document explicit threats directed at attendees.','A second staff member reports the same threats; summon security.'],
 ['security','Barrier Breach','I am crossing this closed stage barrier.','A person repeatedly breaches the restricted safety line after staff warnings.','Two stewards confirm dangerous noncompliance; secure the area.'],
 ['security','Escalated Physical Intimidation','I will hurt the event volunteer.','Staff witness an explicit threat alongside attempts to corner a volunteer.','Trained event security must protect the targeted staff member.'],
 ['security','Confirmed Incident','Staff, I need immediate safety support.','Two independent workers report an imminent physical hazard in the lane.','The security lead confirms the report and requests intervention.'],
 ...DESTINY_IRL_SCENARIOS,
 ...DESTINY_LORE_CARDS
];
const irlClamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const irlActions={welcome:'WELCOME',debate:'INVITE TO DEBATE',redirect:'REDIRECT',check:'VERIFY',security:'SECURITY'};
const actionIsStaffEscort=action=>action!=='welcome'&&action!=='debate';
const isDebateInvitation=row=>row[0]==='welcome'&&/critic|debater|disagreement|philosophy student|policy nerd/i.test(row[1]);
function irlHash(n){let x=n>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0;}
// Coordinates use the 384×216 hall art. Stations are on walkable floor, not
// inside the counter, stage or barrier artwork.
const IRL_STATIONS=VENUE_STATIONS;
const IRL_STATION_NAMES=Object.keys(IRL_STATIONS);
function arrange(run){const groups={};for(const raw of IRL_SCENARIOS){const s=isDebateInvitation(raw)?['debate',...raw.slice(1)]:raw;(groups[s[0]]??=[]).push(s);}
 const shuffle=(group,seed)=>{let list=[...groups[group]];for(let i=list.length-1;i>0;i--){seed=irlHash(seed+0x9e3779b9);let j=seed%(i+1);[list[i],list[j]]=[list[j],list[i]];}return list};
 const w=shuffle('welcome',run+101),d=shuffle('debate',run+177),r=shuffle('redirect',run+202),c=shuffle('check',run+303),s=shuffle('security',run+404);
 // Mixed, legible encounters from the first minute: six fans, three invited
 // critics, five redirects, four verifications, two credible security reports.
 return [
  w[0],d[0],r[0],c[0],w[1],r[1],w[2],d[1],c[1],r[2],
  s[0],w[3],w[4],r[3],c[2],d[2],w[5],r[4],c[3],s[1]
 ];}
export class IRLEvent {
 constructor(engine,options={}){this.engine=engine;this.session=options.mode==='endless'?'endless':'standard';this.levelIndex=irlClampLevel(options.level??0);this.config=IRL_LEVELS[this.levelIndex];this.wave=0;this.breakRemaining=0;this.congestionClock=0;this.safetyStrikes=0;this.highestWave=0;this.serial=0;this.mode='intro';this.elapsed=0;this.clock=this.session==='endless'?0:this.config.seconds;this.phase=1;this.score=0;this.vibe=76;this.errors=0;this.correct=0;this.lost=0;this.visitors=[];this.arrivals=[];this.finished=[];this.departures=[];this.stageCompleted=0;this.effects=[];this.focus=null;this.focusGrace=0;this.dispatchQueue=[];this.staff=[{x:170,y:179,homeX:170,homeY:179,task:null},{x:314,y:148,homeX:314,homeY:148,task:null}];this.guardPositions=[[87,142],[310,106],[349,160]].map(([x,y],i)=>({x,y,homeX:x,homeY:y,task:null,cooldown:0,patrolIndex:i,patrolDwell:i*.6}));this.nextArrival=1.2;this.paused=false;this.message='CONVENTION OPENING · Destiny is preparing for fans.';this.log=[];this.failure='';this.result=null;this.run=(engine.progress.irlRecords?.destinyMeet?.attempts||0);const deck=arrange(this.run+this.levelIndex*37);this.cards=this.session==='endless'?[]:Array.from({length:this.config.guests},(_,i)=>i<deck.length?deck[i]:arrange(this.run+this.levelIndex*37+Math.floor(i/deck.length))[i%deck.length]);this.next=0;this.hostMood='idle';this.hostUntil=0;this.hostX=259;this.hostY=39;this.hostWalking=false;this.incidentFade=0;this.arcadeFlash=0;this.lastVerdict=null;this.gateControllers={left:{openedAt:-10,openUntil:-10},right:{openedAt:-10,openUntil:-10}};this.cameraFlashes=[];this.tvEvent=null;this.speechQuietUntil=7;
  this.debateHistory=[];
  this.crowd=Array.from({length:13},(_,i)=>{const seed=irlHash(this.run*4919+i*811+17);return {id:i,kind:[1,2,4,5,6,8,9,10,11][i%9],x:171+(seed%31)-15,y:169+(seed%13),station:'entrance',target:'entrance',dwell:i*.22,visits:0,walking:false,facing:1,emote:'',emoteTime:0};});
  const startingSpots=[[29,104],[76,133],[119,98],[167,115],[244,117],[283,130],[310,139],[340,140],[215,139],[108,140],[45,137],[199,100],[348,94]];
  this.crowd.forEach((person,i)=>{[person.x,person.y]=snapVenue(...startingSpots[i]);person.station='wander';person.target='wander';person.animation='idle';person.actionClock=0;person.speech='';});
  this.staff.forEach((worker,i)=>{[worker.x,worker.y]=i?[308,149]:[234,156];worker.homeX=worker.x;worker.homeY=worker.y;});
  this.guardPositions.forEach((worker,i)=>{[worker.x,worker.y]=[[78,143],[312,119],[314,168]][i];worker.homeX=worker.x;worker.homeY=worker.y;});
  this.crowdMoments=0;this.boothTransactions={merch:0,snacks:0,vending:0,photo:0};this.recovery=0;this.mistakeStreak=0;
 }
 addCrowdSet(set){
  for(let n=0;n<6;n++){
   const id=this.crowd.length;
   const gate=(id%2?VENUE_GATES.left:VENUE_GATES.right);
   this.crowd.push({id,kind:12+(set-1)*6+n,x:gate.spawn[0],y:gate.spawn[1],gate,gateAccess:true,entryPhase:'enter',entryDelay:n*.6,ticketClock:.6,station:'wander',target:'wander',dwell:.7+n*.22,visits:0,walking:false,animation:'idle',actionClock:0,emote:'',emoteTime:0,speech:'',speechTime:0,speechProgress:0});
  }
 }
 begin(){if(this.mode==='intro'){this.mode='playing';if(this.session==='endless')this.startNextWave();this.message='DOORS OPEN · Watch the highlighted guest in the hall.';return true;}return false;}
 openGate(gate,seconds=1.6){const controller=this.gateControllers[gate?.id];if(!controller)return;controller.openedAt=this.elapsed;controller.openUntil=Math.max(controller.openUntil,this.elapsed+seconds);}
 rejoinCrowd(g){
  // Welcomed, verified and redirected people remain part of the convention.
  if(this.crowd.length>=85)return;
  this.crowd.push({id:1000+g.serial,kind:g.kind,x:g.x,y:g.y,station:'rejoined',target:'rejoined',dwell:1.2,visits:0,walking:false,animation:g.debater?'talk':'cheer',actionClock:0,emote:'',emoteTime:0,speech:'',speechTime:0,speechProgress:0});
 }
 startNextWave(){this.wave++;this.highestWave=Math.max(this.highestWave,this.wave);const deck=arrange(this.run+this.wave*71);const count=endlessWaveGuests(this.wave);this.cards.push(...Array.from({length:count},(_,i)=>deck[i%deck.length]));this.nextArrival=this.wave===1?1.2:1.5;this.breakRemaining=0;this.breatherActive=false;this.phase=Math.min(3,1+Math.floor((this.wave-1)/2));this.message='WAVE '+this.wave+' · CROWD INBOUND';if(this.wave>1){if(this.crowd.length<IRL_ENDLESS.maxCrowd)this.addCrowdSet((this.wave-2)%3+1);this.effects.push({x:213,y:65,text:'WAVE '+this.wave+'!',color:'#ffe2a1',ttl:3});}}
 get selected(){return this.visitors.find(g=>g.id===this.focus&&!g.pending)||null;}
 get remaining(){return this.cards.length-this.next+this.visitors.length;}
 get available(){return this.guardPositions.filter(g=>!g.task&&g.cooldown<=0).length;}
 // Only the guest visibly under attention spends a decision timer. Other guests
 // accumulate wait priority, never an invisible expiry or safety penalty.
 promote(){if(this.selected)return;const waiting=this.visitors.filter(g=>!g.pending);
  waiting.sort((a,b)=>(b.waitAge+(b.type==='security'?5:0))-(a.waitAge+(a.type==='security'?5:0))||a.serial-b.serial);
  this.focus=waiting[0]?.id||null;if(this.focus)this.focusGrace=.7;
 }
 add(options={}){if(this.next>=this.cards.length)return;const row=this.cards[this.next],station=this.locationFor(row),[sx,sy]=IRL_STATIONS[station];const id='irl-'+(++this.serial),types=[1,2,4,5,6,8,9,10,11,...Array.from({length:18},(_,i)=>12+i)],jitter=(irlHash(this.run*2021+this.serial*117)%13)-6,guest={id,serial:this.serial,type:row[0],name:row[1],text:row[2],cue:row[3],check:row[4],category:row[6]||'venue',loreId:row[7]||null,age:0,waitAge:0,life:row[0]==='security'?26:32,looked:false,pending:false,x:sx+jitter,y:sy+(this.serial%3)*3,station,slot:this.next%4,kind:types[(this.next*7+this.run*3)%types.length]};[guest.x,guest.y]=snapVenue(guest.x,guest.y);this.next++;
  if(options.throughGate){const gate=this.serial%2?VENUE_GATES.left:VENUE_GATES.right;guest.gate=gate;guest.gateAccess=true;guest.entryPhase='enter';guest.ticketClock=.65;guest.toX=guest.x;guest.toY=guest.y;[guest.x,guest.y]=gate.spawn;this.arrivals.push(guest);}else{this.visitors.push(guest);this.promote();}
  this.message=this.next===7?'SIGNING SESSION · Fans are circulating around the hall.':this.next===14?'PUBLIC Q&A · Watch for disturbances around the mic.':this.message;
 }
 choose(id){if(this.visitors.some(g=>g.id===id&&!g.pending)){if(this.focus!==id){this.focus=id;this.focusGrace=.7;}return true;}return false;}
 freeWorker(action){return action==='security'?this.guardPositions.find(g=>!g.task&&g.cooldown<=0):this.staff.find(g=>!g.task);}
 destination(g,action){const line=(/queue|line|mic|panel|interview/i).test(g.name+' '+g.cue),merch=(/merch|shirt|collector|poster/i).test(g.name+' '+g.cue);
  if(action==='security')return 'exit';
  if(action==='check')return 'entrance';
  if(action==='redirect')return line?'line':/aisle|sign|access/i.test(g.cue)?'quiet':'help';
  return merch?'merch':/photo|camera|picture|selfie/i.test(g.cue)?'photo':'signing';
 }
 // Reproducible, independent activity that does not create new player tasks.
 // Nearby pairs sometimes stop to talk; stage and booth crowds change by phase.
 crowdTick(dt){const stageBusy=this.departures.some(g=>['queued','approach','climbStairs','exchange','leaveStairs'].includes(g.stageVisit));for(const person of this.crowd){
   person.emoteTime=Math.max(0,person.emoteTime-dt);
   person.speechTime=Math.max(0,(person.speechTime||0)-dt);
   if(person.entryPhase){
    if(person.entryDelay>0){person.entryDelay-=dt;person.walking=false;continue;}
    if(person.entryPhase==='enter'&&moveVenue(person,...person.gate.check,dt,25)){person.entryPhase='ticket';person.walking=false;person.animation='point';}
    else if(person.entryPhase==='ticket'){person.ticketClock-=dt;person.walking=false;person.animation='point';if(person.ticketClock<=0){person.entryPhase='inside';this.openGate(person.gate,2.1);}}
    else if(person.entryPhase==='inside'&&moveVenue(person,...person.gate.inside,dt,27)){person.entryPhase=null;person.gateAccess=false;person.dwell=.25;person.animation='idle';}
    continue;
   }
   // Stage guests have priority through the staircase, not an invisible wall.
   // Rerouting idle wanderers avoids the earlier hard-blocking deadlock.
   if(stageBusy&&person.x>264&&person.x<327&&person.y>94&&person.y<158&&['mic','signing','photo'].includes(person.target)){
    person.target=person.id%2?'line':'quiet';person.dwell=0;
   }
   if(person.dwell>0){person.dwell-=dt;person.walking=false;if(person.animation==='walk')person.animation='idle';continue;}
   if(person.target===person.station){const seed=irlHash(this.run*3001+person.id*751+person.visits*283+this.phase*109),index=seed%IRL_STATION_NAMES.length;
    const favored=this.phase===1?['entrance','merch','snacks','vending','photo','line']:this.phase===2?['merch','photo','vending','signing','snacks']:['mic','line','snacks','merch','vending','photo'];
    // Every second destination is an actual booth: venue activity must be visible.
    person.target=person.visits%2===0?favored[(index+person.id*2+person.visits*3)%favored.length]:'roam';
    if(person.target==='roam')person.roamTo=venueRoamPoint(seed*31+person.id*541);
    if(stageBusy&&['mic','signing','photo'].includes(person.target)&&person.x>260)person.target=person.id%2?'merch':'quiet';
    person.visits++;}
   const [tx,ty]=person.target==='roam'?person.roamTo:person.target==='line'?venueQueueSpot(person.id):IRL_STATIONS[person.target];
   const arrived=moveVenue(person,tx,ty,dt,15+(person.id%4)*4)||Math.hypot(person.x-tx,person.y-ty)<24;
   person.animation=person.walking?'walk':person.animation==='walk'?'idle':person.animation;
   if(arrived){person.station=person.target;person.dwell=1.0+(irlHash(person.visits*149+person.id*13)%42)/12;
    const activity=person.station;
    person.boothActivity=['merch','snacks','vending','photo'].includes(activity)?activity:null;
    if(person.boothActivity){
     this.boothTransactions[activity]=(this.boothTransactions[activity]||0)+1;
     person.animation=activity==='photo'?'point':activity==='vending'?'point':activity==='snacks'?'cheer':'talk';
     person.dwell=Math.max(2.1,person.dwell);
     this.effects.push({kind:'booth',station:activity,seed:person.id,x:person.x,y:person.y-7,ttl:1.15,maxTtl:1.15});
     if(activity==='photo')this.cameraFlashes.push({x:person.x+15,y:person.y+5,ttl:.28});
    }
    const poses=['talk','laugh','cheer','point','argue','heckle','impatient','idle'];
    if(!person.boothActivity)person.animation=poses[(person.visits+person.id+this.phase)%poses.length];
    const marks=person.station==='merch'?['♥','★','!']:person.station==='snacks'?['♪','♥']:person.station==='vending'?['♫','★']:person.station==='mic'?['?','✦']:['♥','✦','…'];
    person.emote=(person.visits+person.id)%3===0?dggEmoteFor(person.visits*13+person.id):marks[(person.visits+person.id)%marks.length];person.emoteTime=1.1;
    const seed=this.run*37+person.visits*19+person.id;
    person.speech=ambientEmote(seed%2?ambientLine(person.station,seed):loreAmbientLine(person.station,seed,this.phase),seed);
    // One line at a time, slow enough to read all text before it disappears.
    const maySpeak=this.elapsed>=this.speechQuietUntil&&(person.visits+person.id)%5===0;
    person.speechTime=maySpeak?person.speech.length/13+1.1:0;
    person.speechProgress=0;
    if(maySpeak){person.emoteTime=0;this.speechQuietUntil=this.elapsed+9;}
    if((person.visits+person.id)%7===0){this.crowdMoments++;this.effects.push({x:person.x,y:person.y-8,text:person.station==='photo'?'FLASH!':person.station==='mic'?'NODDERS':'dggL',color:'#ffe6a7',ttl:1.3});if(person.station==='photo')this.cameraFlashes.push({x:person.x+15,y:person.y+4,ttl:.28});}
   }
  }}
 locationFor(row){if(row[5]&&IRL_STATIONS[row[5]])return row[5];const kind=row[0],clue=(row[1]+' '+row[2]+' '+row[3]).toLowerCase();
  if(kind==='security')return 'line';
  if(kind==='check')return 'entrance';
  if(/merch|shirt|poster|collector|sale|print/.test(clue))return 'merch';
  if(/photo|camera|filming|interview/.test(clue))return 'photo';
  if(/microphone|mic|panel|stage|debate|q&a/.test(clue))return 'mic';
  if(/aisle|corridor|queue|line|barrier/.test(clue))return 'line';
  return kind==='welcome'?'signing':'help';
 }
 dispatchOrders(){for(let i=0;i<this.dispatchQueue.length;){const order=this.dispatchQueue[i],guest=this.visitors.find(g=>g.id===order.guestId&&g.pending);if(!guest){this.dispatchQueue.splice(i,1);continue;}
   const worker=this.freeWorker(order.action);if(!worker){i++;continue;}
   worker.task={guestId:guest.id,action:order.action,travel:1.1};this.dispatchQueue.splice(i,1);
  }}
 // A VERIFY is a real dispatch, not a separate text-reveal action.
 // The initial v0.7 behavior swallowed VERIFY on every non-verification case.
 inspect(){const g=this.selected;if(!g||this.mode!=='playing')return false;g.looked=true;return true;}
 action(action){const g=this.selected;if(!g||this.mode!=='playing'||this.paused||this.incidentFade>0||!irlActions[action])return false;
  // The command creates an order. A visible staff sprite travels to the guest
  // before the verdict resolves. Busy workers accept a queued order immediately.
  g.pending=true;this.dispatchQueue.push({guestId:g.id,action});this.dispatchOrders();
  this.focus=null;this.promote();
  this.effects.push({x:g.x+12,y:g.y-4,text:irlActions[action]+' ↗',color:'#99ebff',ttl:1.8});
  this.message=(this.dispatchQueue.some(o=>o.guestId===g.id)?'RESPONSE QUEUED':action==='security'?'SECURITY DISPATCHED':action==='redirect'?'STEWARD EN ROUTE':action==='check'?'PASS CHECK EN ROUTE':'GREETER EN ROUTE')+' · '+g.name;
  return true;
 }
 resolve(g,success,action){if(success){this.score+=g.type==='security'?260:120;this.vibe=irlClamp(this.vibe+(g.type==='welcome'||g.type==='debate'?3:1),0,100);this.correct++;this.mistakeStreak=0;this.message=g.type==='security'?'SAFETY INTERVENTION · Venue secured.':g.type==='check'?'TICKET VERIFIED · Welcome back.':g.type==='redirect'?'GUEST GUIDED · Aisle cleared.':g.type==='debate'?'DEBATE INVITE · The critic is headed to the stage.':'MEET & GREET · Another fan welcomed.';}else{this.errors++;this.mistakeStreak++;this.vibe=irlClamp(this.vibe-(action==='security'?9:5),0,100);this.score=Math.max(0,this.score-35);this.message=action==='security'?'FALSE ALARM · An innocent guest was inconvenienced.':g.type==='security'?'MISSED SAFETY WARNING · Event interrupted.':'MISMATCH · Guest needed a different response.';if(this.mistakeStreak>=2){this.recovery=5;this.mistakeStreak=0;this.message+=' · RECOVERY WINDOW: CROWD SLOWS.';}if(g.type==='security'){this.failure='A credible fictional safety warning was not escalated to event security.';if(this.session==='endless'){this.safetyStrikes++;this.vibe=irlClamp(this.vibe-15,0,100);if(this.safetyStrikes>=2)this.incidentFade=1.15;}else this.incidentFade=1.15;}}
  this.log.unshift({name:g.name,action,success});this.log=this.log.slice(0,4);
  this.effects.push({x:g.x+12,y:g.y-10,text:success?'✓ '+(action==='welcome'?'FAN GREETED':action==='debate'?'DEBATE INVITED':action==='check'?'VERIFIED':action==='redirect'?'GUIDED':'SECURED'):'✕ WRONG CALL',color:success?'#a0ffbb':'#ffb4a7',ttl:3.3});
  if(success&&action==='security')this.effects.push({x:267,y:40,text:'STAGE SECURE',color:'#a6ffe4',ttl:2.8});
  const destination=this.destination(g,action),[toX,toY]=IRL_STATIONS[destination];
  const stageVisit=success&&(action==='welcome'||action==='debate');
  const departure={id:g.id,serial:g.serial,x:g.x,y:g.y,kind:g.kind,toX:stageVisit?VENUE_STAGE.floor[0]:toX,toY:stageVisit?VENUE_STAGE.floor[1]:toY,ttl:stageVisit?65:30,success,station:destination,escorted:false,stageVisit:stageVisit?'queued':success&&action==='security'?'evictionQueued':'rejoin',exchangeClock:0,exchangeAction:'idle',name:g.name,text:g.text,cue:g.cue,category:g.category,debater:action==='debate',fanKind:action==='welcome'?fanInteractionKind(g):null,stageLaneReady:false,stageAtFront:false};
  if(stageVisit&&departure.debater)departure.debateTopic=selectDebateTopic(g,this.run);
  this.departures.push(departure);
  this.hostMood=success?action==='security'?'surge':stageVisit?'nod':'point':'concern';this.hostUntil=this.elapsed+2.3;
  this.lastVerdict={success,action,at:this.elapsed};this.arcadeFlash=success?.34:.55;
  this.visitors=this.visitors.filter(x=>x.id!==g.id);this.finished.push({...g,success,action});this.promote();return true;
 }
 tick(dt){if(this.mode!=='playing'||this.paused)return;dt=irlClamp(dt,0,.1);if(this.incidentFade>0){this.incidentFade-=dt;if(this.incidentFade<=0){this.incidentFade=0;this.end(false);}return;}this.elapsed+=dt;const decisionsDone=this.next>=this.cards.length&&this.arrivals.length===0&&this.visitors.length===0&&this.dispatchQueue.length===0;if(this.session==='endless')this.clock=this.elapsed;else if(!decisionsDone)this.clock-=dt;this.arcadeFlash=Math.max(0,this.arcadeFlash-dt);this.recovery=Math.max(0,this.recovery-dt);this.focusGrace=Math.max(0,this.focusGrace-dt);for(const guard of this.guardPositions)guard.cooldown=Math.max(0,guard.cooldown-dt);const fraction=this.cards.length?this.next/this.cards.length:0,phase=this.session==='endless'?Math.min(3,1+Math.floor((this.wave-1)/2)):fraction<.3?1:fraction<.68?2:3;if(phase!==this.phase){this.effects.push({x:270,y:70,text:phase===2?'SIGNING RUSH!':'Q&A IS LIVE!',color:'#ffda8f',ttl:2.5});if(this.session==='standard'){this.addCrowdSet(phase-1);if(phase===3)this.addCrowdSet(3);}this.hostMood='surge';this.hostUntil=this.elapsed+2.5;}this.phase=phase;
  this.crowdTick(dt);
  for(const person of this.crowd)if(person.speechTime>0)person.speechProgress=Math.min(person.speech.length,(person.speechProgress||0)+dt*13);
  for(const flash of this.cameraFlashes)flash.ttl-=dt;this.cameraFlashes=this.cameraFlashes.filter(flash=>flash.ttl>0);
  if(this.tvEvent){this.tvEvent.ttl-=dt;if(this.tvEvent.ttl<=0)this.tvEvent=null;}
  for(const effect of this.effects){effect.ttl-=dt;if(effect.kind!=='booth')effect.y-=dt*6;}this.effects=this.effects.filter(e=>e.ttl>0);
  if(!this.breatherActive)this.nextArrival-=dt;
  if(this.nextArrival<=0&&this.next<this.cards.length&&this.visitors.length+this.arrivals.length<(this.session==='endless'?6:4)){
   this.add({throughGate:true});this.nextArrival=(this.session==='endless'?endlessArrivalInterval(this.wave):this.config.arrival*(this.phase===3?.89:1))+(this.recovery>0?3:0);
  }
  for(const g of [...this.arrivals]){
   if(g.entryPhase==='enter'){
    if(moveVenue(g,...g.gate.check,dt,30)){g.entryPhase='ticket';g.walking=false;g.animation='point';}
   }else if(g.entryPhase==='ticket'){
    g.ticketClock-=dt;g.walking=false;g.animation='point';
    if(g.ticketClock<=0){g.entryPhase='inside';this.openGate(g.gate,2.1);}
   }else if(g.entryPhase==='inside'){
    if(moveVenue(g,...g.gate.inside,dt,31)){g.entryPhase='floor';g.animation='idle';}
   }else if(g.entryPhase==='floor'&&moveVenue(g,g.toX,g.toY,dt,33)){
    g.entryPhase=null;g.gateAccess=false;g.walking=false;this.arrivals=this.arrivals.filter(x=>x!==g);this.visitors.push(g);
   }
  }
  this.promote();
  for(const g of [...this.visitors]){if(!g.pending){if(g.id===this.focus){if(this.focusGrace<=0)g.age+=dt;}else g.waitAge=(g.waitAge||0)+dt;}
   // The highlighted person stays in a readable location while ambient crowds
   // move around them. Arrival locations reflect the encounter's actual booth.
   if(g.id===this.focus&&!g.pending&&g.age>=g.life){this.visitors=this.visitors.filter(x=>x!==g);this.lost++;this.vibe=irlClamp(this.vibe-(this.session==='endless'?11:7),0,100);this.message='VISIBLE GUEST TIMEOUT · Another attendee needs attention.';if(g.type==='security'){this.failure='The highlighted credible warning expired without a security response.';if(this.session==='endless'){this.safetyStrikes++;this.vibe=irlClamp(this.vibe-15,0,100);if(this.safetyStrikes>=2)this.incidentFade=1.15;}else this.incidentFade=1.15;if(this.incidentFade>0)break;}this.focus=null;this.promote();}}
  if(this.session==='endless'){
   const pressure=this.visitors.filter(g=>!g.pending).length+this.arrivals.length;
   this.congestionClock=pressure>=4?this.congestionClock+dt:Math.max(0,this.congestionClock-dt*2);
   if(this.congestionClock>=3){this.congestionClock=0;this.vibe=irlClamp(this.vibe-4,0,100);this.effects.push({x:169,y:70,text:'CROWD OVERLOAD -4',color:'#ffb2b2',ttl:1.5});}
   if(this.vibe<=0){this.failure='Endless crowd stability was exhausted.';this.end(false);return;}
  }
  if(this.mode!=='playing')return;
  const activeStage=this.departures.some(g=>['approach','climbStairs','exchange','leaveStage','leaveStairs'].includes(g.stageVisit));
  const stageLine=this.departures.filter(g=>g.stageVisit==='queued');
  for(let i=0;i<stageLine.length;i++)if(stageLine[i].stageVisit==='queued'){
   const g=stageLine[i];
   if(!g.stageLaneReady){if(moveVenue(g,...VENUE_STAGE.floor,dt,26))g.stageLaneReady=true;}
   else if(moveStageActor(g,...venueStageQueueSpot(i),dt,22)){
    if(i===0){g.stageAtFront=true;g.frontClock=(g.frontClock||0)+dt;}
   }
  }
  if(!activeStage&&stageLine[0]?.stageAtFront&&stageLine[0].frontClock>.8){stageLine[0].stageVisit='approach';stageLine[0].ttl=30;this.hostMood='mic';this.hostUntil=this.elapsed+1.5;}
  for(const g of this.departures){if(g.stageVisit!=='queued')g.ttl-=dt;g.tossTime=Math.max(0,(g.tossTime||0)-dt);if(g.escorted||g.stageVisit==='queued')continue;
   if(g.stageVisit==='approach'){
    if(moveStageActor(g,...VENUE_STAGE.stairs,dt,24))g.stageVisit='climbStairs';
   }else if(g.stageVisit==='climbStairs'){
    if(moveStageActor(g,...(g.debater?VENUE_STAGE.debate:VENUE_STAGE.exchange),dt,23)){
     g.stageVisit='exchange';g.exchangeClock=g.debater?3.8:3.1;g.exchangeDuration=g.exchangeClock;g.walking=false;g.facing=g.debater?1:-1;
     this.hostMood=g.debater?'point':'talk';this.hostUntil=this.elapsed+g.exchangeClock;
     this.effects.push({x:217,y:78,text:g.debater?'LIVE DEBATE!':g.fanKind==='autograph'?'✦ AUTOGRAPH!':'♥ PHOTO OP!',color:'#ffeaa5',ttl:1.5});
     this.effects.push({x:200,y:93,text:loreStageLine(g,0),color:'#ffedb4',ttl:1.7});
    }
   }else if(g.stageVisit==='exchange'){
    g.walking=false;g.exchangeClock-=dt;
    const beat=1-g.exchangeClock/g.exchangeDuration;
    g.exchangeAction=g.debater?(beat<.36?'point':beat<.72?'talk':'argue'):(beat<.32?'cheer':beat<.7?'talk':'laugh');
    this.hostMood=g.debater?(beat<.4?'talk':beat<.8?'point':'nod'):(beat<.3?'cheer':beat<.78?'talk':'nod');this.hostUntil=this.elapsed+.3;
    if(!g.debater&&g.fanKind==='photo'&&beat>.68&&!g.photoTaken){
     g.photoTaken=true;this.cameraFlashes.push({x:g.x+14,y:g.y+5,ttl:.28},{x:this.hostX+17,y:this.hostY+7,ttl:.24});
    }
    if(g.exchangeClock<=0){
     g.stageVisit='leaveStage';g.exchangeAction='idle';g.toX=VENUE_STAGE.floor[0];g.toY=VENUE_STAGE.floor[1];g.ttl=25;this.hostMood='nod';this.hostUntil=this.elapsed+1;
     this.effects.push({x:202,y:93,text:loreStageLine(g,1),color:'#fff5c4',ttl:1.35});
     if(g.debater){const verdict=judgeStageDebate(this,g);g.debateOutcome=verdict;this.debateHistory.push({...verdict,guest:g.name});this.tvEvent={type:'debate',won:verdict.won,topicTitle:g.debateTopic.title,score:verdict.score,ttl:1.9};
      this.effects.push({x:217,y:89,text:verdict.won?'⚔ DEBATE WON!':'⚔ DEBATE LOST!',color:verdict.won?'#adffe4':'#ffb1d8',ttl:2.2});
     }else this.tvEvent={type:g.fanKind==='autograph'?'autograph':'photo',guestKind:g.kind,ttl:1.9};
    }
   }else if(g.stageVisit==='leaveStage'){
    if(moveStageActor(g,...VENUE_STAGE.stairs,dt,25))g.stageVisit='leaveStairs';
   }else if(g.stageVisit==='leaveStairs'){
    if(moveStageActor(g,...VENUE_STAGE.floor,dt,26)){
     g.stageVisit='rejoin';g.toX=venueRoamPoint(g.serial*719+this.run*23)[0];g.toY=venueRoamPoint(g.serial*719+this.run*23)[1];g.ttl=24;this.stageCompleted++;
     this.effects.push({x:g.x,y:g.y-10,text:'NEXT GUEST ↗',color:'#fbe8a5',ttl:1.3});
    }
   }else{
    const arrived=moveVenue(g,g.toX,g.toY,dt,24);
    if(g.stageVisit==='rejoin'&&(arrived||g.ttl<=2)){this.rejoinCrowd(g);g.ttl=0;}
    if(g.stageVisit==='evicted'&&arrived)g.ttl=0;
   }
  }
  this.departures=this.departures.filter(g=>g.ttl>0);
  for(const worker of [...this.staff,...this.guardPositions]){
   if(worker.task?.phase==='escort'){
    const task=worker.task,security=task.action==='security';
    const gate=security?(worker.homeX<190?VENUE_GATES.left:VENUE_GATES.right):null;
    const [tx,ty]=security?gate.inside:IRL_STATIONS[task.departure.station];
    const arrived=moveVenue(worker,tx,ty,dt,48);
    // The visitor visibly follows the steward/guard, completing a destination-specific route.
    const guest=task.departure;guest.x+=(worker.x-guest.x)*Math.min(1,dt*5);guest.y+=(worker.y+11-guest.y)*Math.min(1,dt*5);
    if(arrived){guest.escorted=false;worker.task=null;if(this.guardPositions.includes(worker))worker.cooldown=2.5;
     if(security){this.openGate(gate,4.5);guest.gateAccess=true;guest.stageVisit='evicted';guest.toX=gate.spawn[0];guest.toY=gate.spawn[1];guest.ttl=12;guest.tossTime=.6;this.score+=40;this.effects.push({x:tx,y:ty-9,text:'OUT! +40',color:'#fff4a3',ttl:1.6});}
     else{this.rejoinCrowd(guest);guest.ttl=0;this.effects.push({x:tx,y:ty-5,text:task.action==='check'?'PASS OK':'ROUTE CLEAR',color:'#b9ffe0',ttl:1.8});}}
    continue;
   }
   if(worker.task){const task=worker.task,guest=this.visitors.find(g=>g.id===task.guestId);if(!guest){worker.task=null;continue;}
    const arrived=moveVenue(worker,guest.x,guest.y,dt,105);
    task.travel-=dt;if(task.travel<=0&&(arrived||Math.hypot(guest.x-worker.x,guest.y-worker.y)<12)){worker.task=null;const success=task.action===guest.type;this.resolve(guest,success,task.action);if(this.mode!=='playing')return;
     if(success){const departing=this.departures[this.departures.length-1];
      if(actionIsStaffEscort(task.action)){departing.escorted=true;worker.task={phase:'escort',departure:departing,action:task.action};}
     }
     else if(this.guardPositions.includes(worker))worker.cooldown=2.5;
    }
   }else if(this.guardPositions.includes(worker)){
    const route=[[78,143],[118,132],[201,129],[312,119],[310,167],[266,169],[101,166],[40,164]];
    worker.patrolDwell=Math.max(0,(worker.patrolDwell||0)-dt);
    if(worker.patrolDwell<=0){
     const [tx,ty]=route[worker.patrolIndex%route.length];
     if(moveVenue(worker,tx,ty,dt,24)){worker.patrolIndex=(worker.patrolIndex+3)%route.length;worker.patrolDwell=.6;}
    }else worker.walking=false;
   }else{moveVenue(worker,worker.homeX,worker.homeY,dt,55);}
  }
  this.dispatchOrders();
  const performance=stageAction(this.phase,this.elapsed,this.visitors.filter(g=>!g.pending).length,this.elapsed<this.hostUntil?this.hostMood:'idle');
  const stageTarget=stagePosition(performance,this.elapsed,this.departures.some(g=>['approach','climbStairs','exchange'].includes(g.stageVisit)));
  const dx=stageTarget.x-this.hostX,dy=stageTarget.y-this.hostY,d=Math.hypot(dx,dy),step=Math.min(d,dt*13);
  this.hostX+=d?dx/d*step:0;this.hostY+=d?dy/d*step:0;this.hostWalking=d>1.1;
  if(this.session==='standard'&&this.clock<=0&&this.mode==='playing'&&!decisionsDone){this.failure='The event ended with an unresolved guest queue.';this.end(false);}
  if(this.mode==='playing'&&decisionsDone&&!this.departures.some(g=>g.stageVisit&&g.stageVisit!=='depart')){
   if(this.session==='standard')this.end(true);
   else if(!this.breatherActive){this.breatherActive=true;this.breakRemaining=IRL_ENDLESS.breather;this.message='BREATHER · CLEAR THE FLOOR · NEXT WAVE IN '+IRL_ENDLESS.breather+'s';}
   else{this.breakRemaining-=dt;if(this.breakRemaining<=0){this.startNextWave();this.breatherActive=false;}}
  }
 }
 end(clear){if(this.mode==='results')return;this.mode='results';this.paused=false;const accuracy=this.correct/Math.max(1,this.correct+this.errors+this.lost);
  const stars=!clear?0:accuracy>=.92&&this.vibe>=75?3:accuracy>=.78&&this.vibe>=60?2:1;
  const earned=clear?60+stars*75:20;
  const rec=this.engine.progress.irlRecords??={};const old=rec.destinyMeet||{best:0,stars:0,attempts:0};
  const levels=Array.isArray(old.levels)?old.levels.map(x=>({...x})):IRL_LEVELS.map(()=>({best:0,stars:0,attempts:0}));
  const current=levels[this.levelIndex]||{best:0,stars:0,attempts:0};
  if(this.session==='standard')levels[this.levelIndex]={best:Math.max(current.best||0,this.score),stars:Math.max(current.stars||0,stars),attempts:(current.attempts||0)+1};
  rec.destinyMeet={...old,best:Math.max(old.best||0,this.score),stars:Math.max(old.stars||0,this.session==='standard'?stars:0),attempts:(old.attempts||0)+1,levels,endless:old.endless||{highScore:0,highestWave:0,runs:0}};
  if(this.session==='endless')rec.destinyMeet.endless={highScore:Math.max(rec.destinyMeet.endless.highScore||0,this.score),highestWave:Math.max(rec.destinyMeet.endless.highestWave||0,this.wave),runs:(rec.destinyMeet.endless.runs||0)+1};
  this.engine.progress.credits+=earned;
  this.engine.progress.creators.destiny.xp+=clear?25+stars*12:6;
  this.engine.save();
  this.result={clear,stars,earned,accuracy:Math.round(accuracy*100),vibe:this.vibe,score:this.score,correct:this.correct,errors:this.errors,lost:this.lost,reason:this.failure,mode:this.session,level:this.levelIndex,wave:this.wave};
 }
}
