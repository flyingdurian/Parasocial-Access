/* Creator Network v0.6. All events and messages are game fiction.
   The Destiny profile is an unofficial reference to a public content creator:
   no participation, endorsement, or real quotations are represented. */
export const NETWORK_CREATORS=[
 {id:'destiny',name:'Destiny',real:true,subtitle:'Steven Bonnell II · Politics / Debate / Streamer Drama',handle:'@destiny',channel:'Debate Commons',glyph:'D',accent:'#70a8ff',genre:'POLITICS / DEBATE',intro:'Political commentary, adversarial debates, source-checking, streamer media ecology and DGG community history. The fictional Meet & Greet now draws from 74 distinct research-derived scene seeds: policy debates, source literacy, media clips, emotes, platform heritage and convention conduct. Public interview and community references inform the themes, not invented quotes or real-world incident claims.',tagline:'KEEP THE DEBATE OPEN. VERIFY THE CLAIM.',members:['@crosscheck','@blueorbit','@policywonk','@debatenight','@receiptsplease'],theme:'POLITICS & CONTROVERSY',loreTags:['14 policy/research beats','12 streamer-media beats','16 DGG emote beats','12 community-history beats','12 venue/culture beats','8 evidence-literacy beats','Bridges / roundtables','YEE vs PEPE','PepoThink / NODDERS','Community privacy','No unsourced allegations']},
 {id:'nova',name:'Nova Vale',real:false,subtitle:'Cozy games / art streams',handle:'@novaplays',channel:'Lantern Lounge',glyph:'✦',accent:'#91e3c7',genre:'COZY / COMMUNITY',intro:'Gentle gaming streams, enthusiastic regulars, and giveaway impersonators. Fictional creator and community.',tagline:'PROTECT THE GOOD VIBES.',members:['@lanternfan','@teacup','@leafycorner','@softsave','@starlight'],theme:'COZY / INDIE'},
 {id:'glitch',name:'Glitch Arcade',real:false,subtitle:'Competitive gaming / retro',handle:'@glitcharcade',channel:'Pixel Pit',glyph:'◆',accent:'#ffb17b',genre:'ESPORTS / SPEEDRUN',intro:'High-energy tournament nights, speedrun chat, and fraudulent merch drops. Fictional creator and community.',tagline:'KEEP UP WITH THE CHAT.',members:['@frameperfect','@ggbot','@pixelrush','@lagless','@combo99'],theme:'SPEED / CHAOS'}
];
export const CREATOR_UPGRADES=[
 {id:'buffer',glyph:'▤',name:'COMMUNITY BUFFER',tag:'CAPACITY',cost:[95,235,515],desc:['+1 simultaneous queue slot during creator events','+2 simultaneous queue slots during creator events','+3 simultaneous queue slots during creator events']},
 {id:'desk',glyph:'⌁',name:'MODERATION DESK',tag:'RESPONSE',cost:[120,285,630],desc:['+5 seconds of shift time and +0.5 seconds chat lifetime','+9 seconds of shift time and +1.2 seconds chat lifetime','+14 seconds of shift time and +2 seconds chat lifetime']}
];
export const CREATOR_EVENTS=[
 {id:'destiny-feed',creator:'destiny',index:0,world:0,level:0,title:'Debate Clips Arrive',subtitle:'React quickly without punishing disagreement.',descriptor:'PUBLIC DISCUSSION',modifier:'Opinion Surge',brief:'A political conversation is attracting reactions. Criticism is allowed; scams and actual threats are not.',seed:64011},
 {id:'destiny-arena',creator:'destiny',index:1,world:1,level:1,title:'Debate Night',subtitle:'Livestream chat heats up as new viewers flood in.',descriptor:'CHAT SURGE',modifier:'Audience Jump',brief:'Competitive banter and political arguments mix with account impersonators. Stay viewpoint-neutral.',seed:64012},
 {id:'destiny-thread',creator:'destiny',index:2,world:3,level:1,title:'Source Check',subtitle:'Protect a heated community discussion from bad actors.',descriptor:'FORUM CASCADE',modifier:'Thread Flashpoint',brief:'A fictional discussion thread catches attention. Prevent scam replies while allowing good-faith disagreements.',seed:64013},
 {id:'nova-feed',creator:'nova',index:0,world:0,level:0,title:'Lantern Launch',subtitle:'A cozy community is going live.',descriptor:'COMMUNITY WELCOME',modifier:'Fresh Audience',brief:'First-time viewers arrive with questions, congratulations, and a few impersonators.',seed:64121},
 {id:'nova-arena',creator:'nova',index:1,world:1,level:1,title:'Giveaway Guard',subtitle:'A festive stream draws suspicious gift claims.',descriptor:'LIVE EVENT',modifier:'Gift Rush',brief:'Not every giveaway is fake. Protect real community interaction from phishing bots.',seed:64122},
 {id:'nova-thread',creator:'nova',index:2,world:3,level:1,title:'Community Canvas',subtitle:'A community art thread attracts copycat spammers.',descriptor:'REPLY CASCADE',modifier:'Art Thread',brief:'Watch recognizable regulars and stop malicious reply chains.',seed:64123},
 {id:'glitch-feed',creator:'glitch',index:0,world:0,level:0,title:'Tournament Warmup',subtitle:'Competitive banter hits the public timeline.',descriptor:'OPEN BRACKET',modifier:'Match Hype',brief:'Excited fans, jokes, bait, and obvious scams come through in waves.',seed:64231},
 {id:'glitch-arena',creator:'glitch',index:1,world:1,level:1,title:'Final Round',subtitle:'Keep up with a hot esports chat.',descriptor:'MATCH POINT',modifier:'Final Surge',brief:'The crowd is loud. Ordinary trash talk is not automatically a policy violation.',seed:64232},
 {id:'glitch-market',creator:'glitch',index:2,world:2,level:1,title:'Merch Drop',subtitle:'Identify a counterfeit checkout ring.',descriptor:'FAN MERCH',modifier:'Seller Sweep',brief:'Review legitimate collectibles alongside fake payment routes and duplicate shops.',seed:64233}
];
export function creatorLevel(xp){return xp>=500?5:xp>=300?4:xp>=160?3:xp>=70?2:1;}
export const createCreatorSave=()=>({xp:0,upgrades:{},records:{},milestones:[],runs:0});
const CREATOR_TEXT={
 destiny:{
  approve:[
   'I disagree with that argument. Let people make their case. 🧠',
   'That StarCraft build order was wild. GG!',
   'Can someone share the original source instead of a cropped clip?',
   'The debate chat is moving fast tonight 😂',
   'Strong disagreement is still just disagreement.',
   'This is a pretty interesting question about public policy.',
   'I watched the discussion and took notes on both sides.',
   'Source request: where can I read the complete report?',
   'The debate format is fun even when everyone disagrees.',
   'I made a meme about that old RTS match. No hate intended.'
  ],flag:[
   'This clipped debate quote is missing its source. Can staff check it?',
   'Unverified: a fan account claims the broadcast was cancelled.',
   'Does anyone know if this account is the real moderator? No verification.',
   'A cropped video has no date or context. Needs checking.',
   'Rumor about a guest appearance is unconfirmed.',
   'Is this fundraiser link official? The source is missing.',
   'An anonymous claim is going viral; staff should verify it.'
  ],remove:[
   'OFFICIAL debate mod here: DM me your one-time login code.',
   'Get free debate VIP access! Send your password to my private inbox.',
   'Join my scam crypto doubling group — guaranteed 900% return!',
   'I will attack a fictional event attendee tonight. This is a real threat.',
   'Everyone mass-harass @crosscheck until they leave the chat.',
   'Fake support requires your bank PIN to unlock a livestream badge.',
   'Hand over your recovery phrase to claim this imaginary viewer prize.'
  ]},
 nova:{
  approve:[
   'The lantern art is adorable! 🥹✨',
   'Can we get a cozy game recommendation for tonight?',
   'I brought virtual tea for everyone ☕',
   'Love the new community emote 💚',
   'Shout-out to the volunteer mods keeping things friendly.',
   'I disagree about the ending but loved the animation.',
   'The indie game music is relaxing today.',
   'Please never share your password, even for giveaways.',
   'Someone made fan art! This looks incredible.',
   'Is the art challenge open to beginners?'
  ],flag:[
   'Is this community gift link real? Sender not verified.',
   'Unconfirmed: the art contest deadline might have changed.',
   'Can a moderator verify this suspicious new account?',
   'This alleged winner screenshot has no source.',
   'Rumor: the stream moved to another channel. No proof attached.',
   'A link claims to be the official art portal but has no verification.'
  ],remove:[
   'Free plush for every viewer! DM your login code to claim. 🎁',
   'Official Lantern Lounge mod: send me your password NOW.',
   'Guaranteed $400 prize if you pay a $25 release fee first!',
   'I will publish this fictional viewer’s private address to intimidate them.',
   'Give me your bank PIN for VIP art channel access.',
   'Fake staff giveaway: send recovery phrase to win a sketch tablet.',
   'Everyone target and harass @teacup until they leave.'
  ]},
 glitch:{
  approve:[
   'GG EZ (respectfully) 😤🎮',
   'That frame-perfect save was incredible!',
   'I still think the old console was better. Fight me in Mario Kart 😂',
   'The speedrun route shaved off two seconds.',
   'New controller came in. Buttons feel great!',
   'I disagree with the tournament ruling. Can we discuss it?',
   'That clutch round was absolutely ridiculous 🔥',
   'I uploaded a harmless retro gaming meme.',
   'Thanks for the bracket update!',
   'The next race starts in ten minutes, hype!'
  ],flag:[
   'Unverified: the next match may have moved to another room.',
   'Can staff verify this tournament admin account?',
   'This bracket screenshot might be edited. Source missing.',
   'An unconfirmed message says the prize pool changed.',
   'A new merch account claims to be official; identity uncertain.',
   'Is that giveaway page legitimate? No confirmation yet.'
  ],remove:[
   'FREE tournament skins! Send your account password NOW!',
   'I am tournament staff. DM your login code for a verified badge.',
   'Guaranteed $2,000 if you send a $50 activation payment.',
   'I will physically attack a fictional tournament volunteer tonight.',
   'Everyone coordinate harassment against @frameperfect.',
   'Claim your speedrun prize by giving me your bank PIN.',
   'Fake merch checkout: send your recovery code to collect.'
  ]}
};
function hashCreator(s){let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h>>>0}
export function creatorRemix(cards,creatorId,eventId){const creator=NETWORK_CREATORS.find(c=>c.id===creatorId);if(!creator)return cards;const texts=CREATOR_TEXT[creatorId];const used={approve:0,flag:0,remove:0};
 return cards.map((base,i)=>{
   // Preserve authored fraud rings and thread cascades: altering their copy would
   // erase the evidence needed for the contextual mechanic.
   if(base.campaign||base.cascade)return {...base,creatorId,communityLabel:creator.channel};
   if(i>3&&(hashCreator(`${eventId}:${i}`)%10)>=8)return {...base,creatorId,communityLabel:creator.channel};
   const pool=texts[base.verdict];if(!pool?.length)return base;
   const n=used[base.verdict]++,sentence=pool[(n+hashCreator(`${eventId}:${base.verdict}`))%pool.length];
   const prefix=n>=pool.length?['','[reply] ','[live] ','[repost] '][Math.floor(n/pool.length)%4]:'';
   const author=creator.members[(i+hashCreator(eventId))%creator.members.length];
   return {...base,id:`creator-${eventId}-${i}`,text:prefix+sentence,author,creatorId,communityLabel:creator.channel,detail:creator.real?'UNOFFICIAL GAME FICTION':'FICTIONAL COMMUNITY',memoryKey:`creator|${eventId}|${i}|${n}`};
 });
}
