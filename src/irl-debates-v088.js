/* Destiny-only fictional stage beats. Topics are drawn from the DGG lore bank,
   not presented as real quotes, actual debate results or historical incidents. */
export const DESTINY_DEBATE_TOPICS=Object.freeze([
 {id:'sources',title:'SHOW THE SOURCES',difficulty:2,keywords:'source citation evidence spreadsheet context',critic:['Your chart ignores the sample size!','What about the missing source?'],destiny:['Which denominator are we using?','Let us read the primary document.']},
 {id:'media',title:'CLIP VS CONTEXT',difficulty:1,keywords:'clip video interview podcast media recording',critic:['That ten-second clip tells the story!','Why would the edit matter?'],destiny:['Play the next thirty seconds.','Context changes what the claim means.']},
 {id:'policy',title:'POLICY BLOODSPORTS',difficulty:3,keywords:'policy politics campaign strategy election housing economy',critic:['Your policy math is incomplete!','What about the opportunity cost?'],destiny:['Let us compare actual tradeoffs.','Bring the numbers, not the slogans.']},
 {id:'ethics',title:'MORAL FOUNDATIONS',difficulty:4,keywords:'philosophy ethics metaethics premise moral debate',critic:['Your first premise cannot stand!','Define what you mean by harm.'],destiny:['Are we using the same definition?','Let us test that with a counterexample.']},
 {id:'community',title:'CHAT RULES',difficulty:1,keywords:'community chat moderation emote dgg rules',critic:['Why moderate this chat message?','Does intent change the rule?'],destiny:['Apply the same standard to everyone.','Criticism is not a threat.']},
 {id:'heritage',title:'STARCRAFT BRAIN',difficulty:2,keywords:'starcraft gaming esports build order veteran',critic:['Your old build would lose today!','What about scouting tempo?'],destiny:['Map control was always the trick.','Timing matters more than nostalgia.']},
 {id:'turnout',title:'VOTER TURNOUT',difficulty:3,keywords:'volunteer turnout canvassing polls election',critic:['Your turnout model is too generous!','What about the undecideds?'],destiny:['Show me the precinct comparison.','Then let us adjust the model.']},
 {id:'free_speech',title:'SPEECH & PLATFORMS',difficulty:4,keywords:'speech free expression platform rules',critic:['Every opinion must get a microphone!','Where do venue rules begin?'],destiny:['Access and expression are different.','Let us separate rules from threats.']}
]);
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
export function selectDebateTopic(guest={},run=0){
 const words=String([guest.name,guest.text,guest.cue,guest.category].join(' ')).toLowerCase();
 const matches=DESTINY_DEBATE_TOPICS.filter(topic=>topic.keywords.split(' ').some(word=>words.includes(word)));
 const pool=matches.length?matches:DESTINY_DEBATE_TOPICS;
 const serial=(Number(guest.serial)||1)+(Number(run)||0);
 return pool[(serial+pool.length*7)%pool.length];
}
export function judgeStageDebate(event,guest){
 const topic=guest.debateTopic||selectDebateTopic(guest,event.run);
 const activePressure=event.visitors.filter(g=>!g.pending).length+event.arrivals.length;
 // The player's queue management changes the result. Guest serial and PRNG
 // are deliberately absent: a simulated debate is NEVER a coin toss.
 const score=Math.round(58+(event.vibe-75)*.38+Math.min(15,event.correct*1.7)
   -event.errors*5-event.lost*4-activePressure*2
   -(event.levelIndex||0)*3-topic.difficulty*4);
 const won=score>=50;
 return {won,score:clamp(score,0,100),topic:topic.id,reason:won?'GOOD CROWD CONTROL':'CROWD PRESSURE'};
}
// Fictional community reactions; these are game dialogue, not real quotations.
export const DEBATE_CHAT_LINES=Object.freeze([
 "Where's the fact-check?!","He's stalling!","He's cooked","Let him cook!",
 "Let Foodshop debate!","ShrimpleAs","AngelThump","Abathur","COPIUM",
 "Hi DGG chat!","Absolute cinema.","Bro is delusional.","REFUTE THE TIMELINE.",
 "SHOW THE CLIP!","YEE NEVA LOSE","PEPE WINS","WHAT'S THE PREMISE?",
 "Define your terms.","Run the VOD back!","Source? SOURCE?!",
 "The chat is moving too fast!","HE'S GOT A SPREADSHEET","o7",
 "That rebuttal had frames.","Make the steelman!"
]);
export function debateExchangeDuration(guest,level=0){
 const difficulty=guest?.debateTopic?.difficulty||2;
 return clamp(6.2+difficulty*.8+((guest?.serial||0)%4)*.65+Math.min(1,level*.2),6,11.8);
}
export function debateChatLine(guest,beat){
 const offset=((guest?.serial||0)*3+DEBATE_CHAT_LINES.length)%DEBATE_CHAT_LINES.length;
 return DEBATE_CHAT_LINES[(offset+beat)%DEBATE_CHAT_LINES.length];
}
export function stageDialogueBeat(guest){
 if(guest?.stageVisit!=='exchange')return null;
 const beat=clamp(Math.floor((1-guest.exchangeClock/guest.exchangeDuration)*4),0,3);
 if(guest.debater){
  const topic=guest.debateTopic||DESTINY_DEBATE_TOPICS[0];
  return {speaker:beat%2?'destiny':'guest',title:topic.title,
   text:beat===0?topic.critic[0]:beat===1?topic.destiny[0]:beat===2?topic.critic[1]:topic.destiny[1],beat};
 }
 return {speaker:beat%2?'destiny':'guest',title:guest.fanKind==='autograph'?'AUTOGRAPH TIME':'FAN PHOTO',
  text:guest.fanKind==='autograph'?['Would you sign my print?','Absolutely, thanks for coming!','I am keeping this forever!','Take care!'][beat]:
   ['Can we get a photo?','Let us do it!','CHEESE!','Thanks for coming!'][beat],beat};
}
export function fanInteractionKind(guest){
 return /sign|autograph|poster|print|binder|drawing|sketch/i.test([guest.name,guest.text,guest.cue].join(' '))?'autograph':'photo';
}
