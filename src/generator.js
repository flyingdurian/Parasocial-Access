import {CASES,SURFACES,seededShuffle} from './content.js';
import {EXTRA_FAMILIES,VOICES} from './scenarios-v03.js';
import {CIRCUIT_FAMILIES} from './scenarios-v04.js';
import {THREAD_FAMILIES,CREATORS} from './scenarios-v05.js';
/* Rule-first content generator. The verdict is defined BEFORE prose rendering.
   Avoid inferring policy actions from political positions or arbitrary vocabulary. */
const PERSONAS=['@sunflower.exe','@queuetea','@cloudrunner','@tinypenguin','@mintbooks','@stationcat','@waveform','@moonlitlab','@paperlantern','@pixelfox','@mintcycle','@harborbeat','@honeytoast','@neonfern','@midnightboba','@softbuffer','@bluenoodle','@gameginkgo','@gardenloop','@lunalight','@softpixel','@beanmachine','@scrollsmith','@starport','@ramenbreeze','@sunnyscale'];
const ITEMS=['headphones','bicycle','concert ticket','game console','phone','camera','laptop','sneakers','festival pass','collector card','train ticket','handmade bracelet'];
const TOPICS=['the new bus route','today’s livestream','the park redesign','the indie game showcase','the food festival','the school fundraiser','the train schedule','the weekend market','the neighborhood garden','the sci-fi convention'];
const PLACES=['Riverside','Neon Harbor','East Junction','Willow Square','Pixel Plaza','North Station','Luna Bay','Old Arcade'];
const PHRASES=['official account','moderator team','verified support','trusted organizer','event staff','community admin'];
const ACTIONS={approve:'APPROVE',flag:'FLAG',remove:'REMOVE'};
const ORIGINAL_FAMILIES=[
 {id:'daily',verdict:'approve',formats:['micro','forum','group','civic'],variants:[
  (r)=>`Just finished a sketch of ${r(PLACES)}. I think it turned out pretty well!`,
  (r)=>`Anyone going to ${r(PLACES)} this weekend? Looking for coffee recommendations.`,
  (r)=>`I actually enjoyed ${r(TOPICS)} today. What did everyone think?`,
  (r)=>`I made ${r(ITEMS)} accessories from recycled materials. Pretty happy with them!`,
  (r)=>`My cat fell asleep on my ${r(ITEMS)} again. Amazing timing.`,
  (r)=>`Appreciation post for the volunteers at ${r(PLACES)}. Thank you!`]},
 {id:'discussion',verdict:'approve',formats:['micro','forum','group','civic','gaming'],variants:[
  (r)=>`I disagree with ${r(TOPICS)}. Here's a respectful alternative.`,
  (r)=>`Unpopular opinion: ${r(TOPICS)} could be improved with more public input.`,
  (r)=>`I'd vote against ${r(TOPICS)} because it seems too expensive.`,
  (r)=>`Does anyone have a guide for fixing a broken ${r(ITEMS)}?`,
  (r)=>`Civil discussion: what are the pros and cons of ${r(TOPICS)}?`]},
 {id:'celebrate',verdict:'approve',formats:['chat','gaming','micro'],variants:[
  (r)=>`GG! That last round was amazing in ${r(PLACES)}!`,
  (r)=>`LET'S GO! I finally got the ${r(ITEMS)} drop!`,
  (r)=>`That stream was so good 😂 ${r(PERSONAS)} nailed it.`,
  (r)=>`Nice save, team. What a comeback!`,
  (r)=>`First time in chat! Been watching since ${r(PLACES)}.`]},
 {id:'sale',verdict:'approve',formats:['market','group','micro'],variants:[
  (r)=>`Selling my used ${r(ITEMS)} locally. Can meet at ${r(PLACES)} and provide a receipt.`,
  (r)=>`Free community swap at ${r(PLACES)} on Saturday. Bring gently used ${r(ITEMS)}.`,
  (r)=>`Just listed my ${r(ITEMS)}. Photos and condition details are in the listing.`,
  (r)=>`Honest review: this ${r(ITEMS)} was worth fixing instead of replacing.`]},
 {id:'scam',verdict:'remove',formats:['micro','chat','market','group','gaming'],variants:[
  (r)=>`GUARANTEED! Send $${r([25,50,90,120,200])} to instantly receive $${r([750,900,1200,2000])}. No risk!`,
  (r)=>`Congratulations! You won a ${r(ITEMS)}. Send your card PIN to claim it NOW.`,
  (r)=>`Double your money tonight at ${r(PLACES)}! Transfer a fee to this stranger first.`,
  (r)=>`Free ${r(ITEMS)} for everyone! Just send me your banking password.`,
  (r)=>`Guaranteed investment profits of 500% by tomorrow. Pay an activation fee.`]},
 {id:'imposter',verdict:'remove',formats:['micro','chat','forum','group','gaming','market'],variants:[
  (r)=>`I'm ${r(PHRASES)}. DM me your one-time login code to restore access.`,
  (r)=>`Security alert from ${r(PHRASES)}: type your password into my private inbox.`,
  (r)=>`As ${r(PHRASES)}, I need your full bank number before I can help.`,
  (r)=>`Official prize claim: give me your recovery codes or you lose your ${r(ITEMS)}.`,
  (r)=>`Admin verification required: send your password and secret questions.`]},
 {id:'threat',verdict:'remove',formats:['micro','chat','forum','group','gaming','civic'],variants:[
  (r)=>`I'm going to hurt ${r(PERSONAS)} after the event. This is a real threat.`,
  (r)=>`Everyone, go harass ${r(PERSONAS)} until they leave this community.`,
  (r)=>`I'll show up at ${r(PLACES)} to attack the event organizer tonight.`,
  (r)=>`I'm sharing this person's home address so strangers can intimidate them.`,
  (r)=>`I will publish your private photos unless you send me money.`]},
 {id:'raid',verdict:'remove',formats:['chat','gaming','group'],variants:[
  (r)=>`SPAM BOT: send your login code for free ${r(ITEMS)} now!!!`,
  (r)=>`FREE PRIZE FREE PRIZE! PAY AN ACTIVATION FEE NOW!`,
  (r)=>`Follow my fake support link and enter your password for instant rewards!`,
  (r)=>`DM ME YOUR ACCOUNT TOKEN. FREE SKINS. GUARANTEED.`,
  (r)=>`SEND YOUR CARD PIN TO CLAIM YOUR FREE STREAM GIFT!`]},
 {id:'unknown',verdict:'flag',formats:['micro','forum','group','civic','market','chat','gaming'],variants:[
  (r)=>`Unverified rumor about ${r(TOPICS)}. The original source is missing.`,
  (r)=>`This screenshot claims ${r(TOPICS)} was cancelled, but no source can confirm it.`,
  (r)=>`Someone says ${r(PERSONAS)} is behind this event. Identity not verified.`,
  (r)=>`A cropped clip from ${r(PLACES)} is circulating without context.`,
  (r)=>`Unconfirmed leak: all ${r(ITEMS)} orders will be cancelled tomorrow.`,
  (r)=>`Unverified listing claims to be the official store. Seller identity unknown.`]},
 {id:'sourcecheck',verdict:'flag',formats:['chat','gaming','micro','forum','civic'],variants:[
  (r)=>`I can't verify this screenshot from ${r(PLACES)}. The date is hidden.`,
  (r)=>`An unnamed source claims ${r(TOPICS)} changed. Awaiting confirmation.`,
  (r)=>`This account says it's ${r(PHRASES)}, but verification is pending.`,
  (r)=>`Unverified claim about ${r(PERSONAS)}; only an edited clip is available.`]}
];
const FAMILIES=[...ORIGINAL_FAMILIES,...EXTRA_FAMILIES,...CIRCUIT_FAMILIES,...THREAD_FAMILIES];
const hash=str=>{let x=2166136261;for(const c of String(str)){x=Math.imul(x^c.charCodeAt(0),16777619)>>>0;}return x>>>0};
function rng(seed){let s=seed>>>0||1;return()=>{s+=0x6d2b79f5;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const pick=(array,random)=>array[Math.floor(random()*array.length)];
const norm=text=>text.toLowerCase().replace(/\s+/g,' ').trim();
export const SCENARIO_FAMILIES=FAMILIES.map(f=>({id:f.id,verdict:f.verdict,formats:f.formats,variants:f.variants.length}));
export const WORLD_DEFS=[
 {id:'feed',title:'OPEN FEED',subtitle:'The public timeline',tag:'ONE POST. ONE CALL.',levels:5,formats:['micro','forum','group','market','civic'],icon:'◉',accent:'#5bf1d5',brief:'One post at a time. Preserve your combo and clear the queue.',levelsConfig:[
  {count:20,seconds:66,interval:2.65,tag:'FIRST CONTACT'},
  {count:24,seconds:68,interval:2.22,tag:'FAST FOLLOW'},
  {count:26,seconds:72,interval:2.0,tag:'TRENDING'},
  {count:28,seconds:76,interval:1.78,tag:'BREAKING FEED'},
  {count:32,seconds:78,interval:1.60,tag:'PEAK TRAFFIC'}]},
 {id:'arena',title:'LIVE ARENA',subtitle:'Creator streams / continuous chat',tag:'THE CHAT NEVER STOPS.',levels:5,formats:['chat','gaming'],icon:'●',accent:'#fa8ac6',brief:'Multiple simultaneous messages. Catch abuse and scams before they scroll away; harmless chat passes on its own.',levelsConfig:[
  {count:26,seconds:65,interval:1.65,tag:'GOING LIVE'},
  {count:29,seconds:66,interval:1.4,tag:'BUSY CHAT'},
  {count:32,seconds:68,interval:1.22,tag:'VIEWER SPIKE'},
  {count:34,seconds:70,interval:1.10,tag:'SPAM WAVE'},
  {count:38,seconds:74,interval:1.12,tag:'RAID NIGHT'}]},
 {id:'market',title:'MARKET WATCH',subtitle:'Commerce / coordinated listing rings',tag:'FIND THE COMMON PATTERN.',levels:4,formats:['market'],icon:'▦',accent:'#f8c887',brief:'Review listings. Tap a suspicious listing, then MATCH & REMOVE verified duplicate campaigns to clear multiple posts together.',levelsConfig:[
  {count:22,seconds:74,interval:2.1,tag:'FIRST LISTING'},
  {count:26,seconds:78,interval:1.87,tag:'SELLER SURGE'},
  {count:30,seconds:82,interval:1.66,tag:'FRAUD NETWORK'},
  {count:34,seconds:85,interval:1.49,tag:'MARKET CRUNCH'}]},
 {id:'thread',title:'THREAD FRONTIER',subtitle:'Forums / creator communities',tag:'STOP THE CASCADE.',levels:5,formats:['forum','group','gaming'],icon:'♧',accent:'#b5a7ff',brief:'Moderate replies in context. Spot a spreading spam branch and CONTAIN it to prevent its future replies.',levelsConfig:[
  {count:22,seconds:78,interval:2.24,tag:'WELCOME THREAD'},
  {count:26,seconds:83,interval:1.93,tag:'REPLY CHAIN'},
  {count:30,seconds:87,interval:1.71,tag:'BRANCH STORM'},
  {count:33,seconds:91,interval:1.54,tag:'THREAD FLOOD'},
  {count:36,seconds:94,interval:1.43,tag:'CASCADE NIGHT'}]}
];
function filterFormats(f,world){return f.formats.some(v=>world.formats.includes(v))}
function authoredCase(c,r,idx){return {...c,id:`legacy-${c.id}-${idx}`,generated:false};}
const makeStyle=(base,format,random)=>{
 const voice=VOICES[format]||VOICES.micro;
 const prefix=random()<.27?pick(voice.prefix.slice(1),random)||'':'';
 const suffix=random()<.30?pick(voice.suffix.slice(1),random)||'':'';
 let text=(prefix+base+suffix).replace(/\s+/g,' ').trim();
 if(format==='chat'||format==='gaming')text=text.replace(/^([a-z])/,(m)=>random()<.32?m.toUpperCase():m);
 return text;
};
const CAMPAIGN_PREFIXES=['CHECKOUT ROUTE','PAYMENT DESK','CLAIM PORTAL','TRANSFER GATE'];
function injectMarketRings(pool,seed,levelIndex){
 const count=Math.min(3,Math.floor(pool.length/9));
 for(let k=0;k<count;k++){
  const key='MG'+((hash(`${seed}:${levelIndex}:${k}`)%8900)+1100);
  const tag=CAMPAIGN_PREFIXES[(k+levelIndex)%CAMPAIGN_PREFIXES.length];
  const items=['headphones','camera','concert pass','console','vintage radio','gaming chair'];
  const slot=1+k*9;
  for(let j=0;j<2;j++){
   const item=items[(k*3+j+levelIndex)%items.length];
   const text=`${item[0].toUpperCase()+item.slice(1)} deal! Send a verification deposit through ${tag} ${key} to claim.`;
   pool[slot+j]={id:`ring-${seed}-${levelIndex}-${k}-${j}`,format:'market',verdict:'remove',author:`@seller${(hash(key+j)%899)+100}`,text,detail:`DUPLICATE CHECKOUT ${key}`,scenario:'coordinated-ring',campaign:key,campaignLabel:`${tag} ${key}`,generated:true,memoryKey:`ring|${key}|${item}`};
  }
 }
 return pool;
}
const THREAD_SUBJECTS=['What games are you enjoying this week?','Community creations and works in progress 🎨','Help desk: ask a genuine question','Favorite moments from last night’s stream','Retro hardware finds and repairs'];
function injectThreadCascades(pool,seed,levelIndex){
 // Every message has a recognizable recurring community and a visible reply branch.
 for(let i=0;i<pool.length;i++){
  const creator=CREATORS[(Math.floor(i/6)+levelIndex)%CREATORS.length];
  pool[i]={...pool[i],creatorId:creator.id,room:creator.room,roomTitle:THREAD_SUBJECTS[(Math.floor(i/6)+levelIndex)%THREAD_SUBJECTS.length],threadKey:`${creator.id}-${Math.floor(i/6)}`,branch:`reply-${Math.floor(i/3)+1}`};
 }
 for(let k=0;k<Math.min(3,Math.floor(pool.length/9));k++){
  const creator=CREATORS[(k+levelIndex)%CREATORS.length];
  const cascade=`T${levelIndex+1}-${((hash(`${seed}:${levelIndex}:${k}`)%890)+110)}`;
  const start=2+k*9;
  for(let j=0;j<3;j++){
   const i=start+j;
   if(i>=pool.length)continue;
   const payload=[`FREE VIP ACCESS! DM your one-time sign-in code to ${cascade}.`,
                  `Official channel giveaway: send your password to claim your ${cascade} reward.`,
                  `Reposting the ${cascade} giveaway! Send your bank PIN to confirm.`][j];
   pool[i]={...pool[i],id:`thread-${seed}-${levelIndex}-${k}-${j}`,format:j===2?'gaming':'forum',verdict:'remove',author:`@promo${(hash(cascade+j)%800)+100}`,text:payload,detail:'COORDINATED PHISHING CAMPAIGN',scenario:'thread-cascade',cascade,branch:`replies-${cascade}`,creatorId:creator.id,room:creator.room,roomTitle:THREAD_SUBJECTS[(k+levelIndex)%THREAD_SUBJECTS.length],threadKey:`${creator.id}-incident-${k}`,memoryKey:`thread|${cascade}|${j}`};
  }
 }
 return pool;
}
export function generateLevel(seed,worldIndex,levelIndex,recent=[],directives=null){
 const world=WORLD_DEFS[worldIndex],level=world?.levelsConfig?.[levelIndex];if(!level)throw Error('Invalid world or level');
 const random=rng(hash(`${seed}:${worldIndex}:${levelIndex}`));const safe=FAMILIES.filter(f=>filterFormats(f,world));
 const caseCount=level.count;let pool=[],seen=new Set();const recentSet=new Set(recent.map(norm));const familyUses=new Map();let banned=0;
 const requirements=worldIndex===1?['approve','remove','remove','flag']:worldIndex===2?['approve','remove','flag','approve']:['approve','approve','remove','flag'];
 for(let i=0;i<caseCount;i++){
  const wanted=requirements[i%requirements.length],choices=safe.filter(f=>f.verdict===wanted);let found=null;
  for(let attempt=0;attempt<180;attempt++){
   const spotlight=directives?.spotlight||[];
   const themed=choices.filter(f=>spotlight.includes(f.id));
   const fam=themed.length&&random()<.52?pick(themed,random):pick(choices,random),index=Math.floor(random()*fam.variants.length),v=fam.variants[index];
   if((familyUses.get(fam.id)||0)>=4&&attempt<115)continue;
   const r=arr=>pick(arr,random),format=pick(fam.formats.filter(f=>world.formats.includes(f)),random);
   const text=makeStyle(v(r),format,random),author=pick(PERSONAS,random),signature=norm(text);
   const memoryKey=`${fam.id}|${index}|${format}`;
   if(text.length>178||seen.has(signature)||recentSet.has(signature)||(recentSet.has(memoryKey)&&attempt<130)){banned++;continue;}
   found={id:`gen-${hash(signature).toString(36)}`,format,verdict:fam.verdict,author,text,detail:fam.verdict==='flag'?'SOURCE UNCONFIRMED':fam.verdict==='remove'?'CLEAR POLICY VIOLATION':'ORDINARY CONTENT',scenario:fam.id,generated:true,memoryKey};seen.add(signature);familyUses.set(fam.id,(familyUses.get(fam.id)||0)+1);break;
  }
  if(!found){const candidates=seededShuffle(CASES.filter(c=>world.formats.includes(c.format)&&c.verdict===wanted),hash(seed+i*13));for(const c of candidates){const sig=norm(c.text);if(!seen.has(sig)&&!recentSet.has(sig)){found=authoredCase(c,r,i);found.id=`legacy-${c.id}`;found.memoryKey=`legacy|${c.id}`;seen.add(sig);break;}}}
  if(!found)throw Error('Not enough distinct, validated cases for '+world.id+' / '+levelIndex);
  pool.push(found);
 }
 pool=seededShuffle(pool,hash(seed^((worldIndex+1)*991)^((levelIndex+1)*65537)));
 if(worldIndex===2)pool=injectMarketRings(pool,seed,levelIndex);
 if(worldIndex===3)pool=injectThreadCascades(pool,seed,levelIndex);
 return {...level,id:`${world.id}-${levelIndex+1}`,world:worldIndex,level:levelIndex,worldId:world.id,worldTitle:world.title,title:level.tag,subtitle:world.brief,format:world.id,raid:world.id==='arena',cases:pool,repetitionAvoided:banned};
}
export function generateSession(seed,world,levels=WORLD_DEFS[world].levels,recent=[]){let used=[...recent],out=[];for(let n=0;n<levels;n++){const l=generateLevel(seed,world,n,used);out.push(l);used.push(...l.cases.flatMap(x=>[x.text,x.memoryKey]));}return out;}
export const GENERATOR_STATS={families:FAMILIES.length,authoredTemplates:FAMILIES.reduce((a,f)=>a+f.variants.length,0),baselineCases:CASES.length,worlds:WORLD_DEFS.length};
