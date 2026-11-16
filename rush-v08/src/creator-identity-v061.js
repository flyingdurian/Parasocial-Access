import {NETWORK_CREATORS} from "./creators-v06.js";
/* v0.6.1 Creator-first editorial packs: invented posts and viewers only.
   Public creator references are NOT real allegations, quotations, or incidents.
   Rule-first: a provided moderation outcome is never inferred from keywords. */
const lore={
 destiny:{
  approve:[
   'Hot choccy run? The order has been secured ☕',
   'The election strategy argument became a twenty-minute debate about data sources.',
   'PEPE won the emote poll? YEE supporters are demanding a recount.',
   'The chat is now arguing over whether that polling methodology was sound.',
   'A little StarCraft nostalgia during a political stream is okay.',
   'People asking for sources is exactly what the debate needs.',
   'I dislike his argument, but the counterpoint was worth hearing.',
   'This is an exceptionally spicy way of saying "I disagree."',
   'Snark all you want, but criticizing somebody is not a threat.',
   'Everybody calls a critic an op now. It is getting ridiculous.',
   'A clip went viral after the headline left out the original question.',
   'Can we clip the whole discussion instead of five random seconds?',
   'That was a good-faith criticism. No reason to dogpile somebody.',
   'A political podcast segment has spawned an entire follow-up discussion.',
   'The orbiter conversation has officially become its own discussion tree.',
   'Chat, can we stop inventing lore about somebody who is not even here?',
   'A viewer making a sarcastic joke is not a coordinated attack.',
   'Both sides keep talking past each other. What was the actual question?',
   'PEPE 🐸 PEPE 🐸 PEPE — I see a train forming.',
   'I am here for policy arguments and the inevitable streamer-drama tangent.',
   'A critic can be annoying without breaking the rules.',
   'The source spreadsheet apparently has a source spreadsheet of its own.',
   'That response was unhinged as a joke, but nobody was threatened.',
   'Please put the original article in the description for context.',
   'Wait, is this a serious debate or another streamer tier-list argument?',
   'I disagree with the take, but the source request is fair.',
   'The chat spammed YEE through the entire intermission. Incredible.',
   'I disagree with the proposed housing policy, but the numbers deserve serious consideration.',
   'The interviewer kept switching topics before the original claim was answered.',
   'No, criticizing an organizing strategy does not make somebody a troll.',
   'This political clip needs its full context.',
   'We can discuss media incentives without threatening the journalist.',
   'A viewer brought receipts from the actual public debate transcript.',
   'A fan compiled a parody flowchart of fictional streamer drama.',
   'Someone asked a philosophy question and chat is now writing essays.',
   'The guest is right about one statistic and still wrong about the conclusion.',
   'A policy disagreement is not proof of bad faith or a coordinated attack.',
   'All I wanted was a local election discussion. Now there are six debate threads.',
   'The entire chat is doing forensic analysis of a five-second clip.',
   'This is a substantive rebuttal, not harassment.',
   'The podcast joke is old, but the callback was surprisingly good.',
   'I appreciate when someone admits a source changed their mind.'
  ],
  flag:[
   'This cropped debate screenshot has no date or original clip attached.',
   'Someone claims the next debate is cancelled; the announcement is unconfirmed.',
   'Alleged behind-the-scenes messages are spreading without any verification.',
   'A screenshot claims a guest said this, but the quoted message is missing.',
   'The clip caption says the opposite of what people claim. Context needed.',
   'A rumor about a creator collaboration needs a source before being pinned.',
   'This claim cites an anonymous account and nothing else. Can we check it?',
   'An edited clip is circulating, but the full exchange has not been located.',
   'This allegation about an unnamed creator is presented without evidence.',
   'A fan claims to have proof that a supposed ally is secretly an op, but offers no source.',
   'Is the event time actually changed? I only see a reposted screenshot.',
   'An apparent statement from a moderator lacks a verifiable channel link.',
   'Does this commentary quote accurately represent the whole conversation?',
   'Before repeating this accusation, can anyone locate the original thread?',
   'The viral image appears cropped; verification is still pending.',
   'A fan claims there is a debate tonight but gives no official schedule.',
   'A screen capture supposedly proves an endorsement; the original statement is missing.',
   'The alleged podcast cancellation comes from an unaffiliated fan account.',
   'An edited clip is being used to attribute an uncorroborated position.',
   'Someone asserts a canvassing group was disbanded; no organizer has confirmed it.',
   'The rumor about a public disagreement has no primary source attached.',
   'An anonymous screenshot claims a debate guest conceded off-air.',
   'This media quote is disputed, and the original recording has not been checked.'
  ],
  remove:[
   'Everyone should go threaten that fictional chat regular until they stop posting.',
   'I am publishing this viewer’s private home address so people can show up.',
   'Let’s coordinate harassment against the person who challenged that claim.',
   'I will physically attack an attendee at our invented fan convention tonight.',
   'Send violent threats to that critic until they delete their account.',
   'I saved a private phone number; pile on and harass the owner.',
   'Join the raid to spam threats at a fictional rival streamer.',
   'We should track down that commenter’s family and intimidate them.',
   'Anybody who disagrees should be hunted down and hurt at the meetup.',
   'Publish the private address of the debate guest to scare them.',
   'I am blackmailing a fictional viewer with their private messages.',
   'Coordinated target list: go harass every account in this private group.',
   'Threaten the people in that community until they stop asking questions.',
   'Give me your sign-in code to enter my fake official viewer contest.'
  ],
  subjects:['the housing debate','a public transit proposal','a video-game comparison','an anonymous clip','the source spreadsheet','the latest debate format','a community rumor'],
  format:['DGG CHAT','SOURCE THREAD','DEBATE CLIP','HOT CHOCCY BREAK'],
  prefix:['','[chat] ','[reply] ','[debate] ']
 },
 nova:{
  approve:[
   'I drew a little lantern for the art wall! ✨',
   'Good morning, tea gang ☕ I brought imaginary cookies.',
   'That cozy farming game has such a lovely soundtrack.',
   'The art challenge welcomes beginners too! 🌱',
   'Someone finally finished their first watercolor animation.',
   'A fan made a tiny crochet mascot for the community.',
   'I love how the chat congratulated that first-time artist.',
   'The stream cat is asleep on the keyboard again 🐈',
   'No pressure to donate; enjoying the stream is plenty.',
   'We have a community sketch gallery open this weekend.',
   'The lavender palette on that drawing is so calming 💜',
   'I disagree about the game ending but loved the journey.',
   'Let’s give the new viewers a warm welcome!',
   'Art prompt: draw your favorite fictional creature in a raincoat.',
   'This fan made cookies shaped like tiny lanterns.',
   'The group helped me fix a painting mistake. Thank you!',
   'Is anybody hosting a beginner-friendly craft night?',
   'The stream’s little achievement chimes are adorable.',
   'Remember, nobody here needs to prove their worth with a donation.',
   'We finished the collaborative picture! Everyone contributed.',
   'Please share the tutorial if you are comfortable doing so.',
   'I brought a virtual cup of cocoa for the watch party.',
   'The pastel desktop theme looks like a little garden.',
   'Community appreciation day is the best kind of event.'
  ],
  flag:[
   'This art contest deadline image has no official announcement attached.',
   'An unknown account claims the community stream moved unexpectedly.',
   'Someone posted alleged winner names without a verified organizer.',
   'The giveaway rules in this cropped screenshot may be outdated.',
   'An invitation says the gallery changed venues, but I cannot verify it.',
   'This charity raffle notice lacks an organizer and source.',
   'A fan account announced a bonus art session without confirmation.',
   'The prize screenshot is missing the original post and timestamp.',
   'The event schedule has two conflicting versions. Staff review needed.',
   'Unconfirmed message: today’s crafting workshop has been cancelled.',
   'An account claims to be the artist behind this submission; no proof.',
   'The raffle result is being shared without the official drawing link.'
  ],
  remove:[
   'The art gallery prize is yours if you send me your account recovery code.',
   'To collect your free plush, send your banking PIN to my personal inbox.',
   'I made a fake charity page to collect payment details from viewers.',
   'A fabricated staff account is requesting private login credentials.',
   'I will reveal a fictional artist’s private home address to intimidate them.',
   'Everyone should send threats to this fan until they leave the art chat.',
   'Claim your community drawing by entering your password into my form.',
   'Pay an off-platform activation fee before receiving this imaginary prize.',
   'I will physically hurt the convention volunteer at the art table.',
   'I stole someone’s private photos and will leak them unless they pay.',
   'This fake gallery link asks for the viewer’s one-time sign-in code.',
   'Threaten the people who criticized the community art showcase.'
  ],
  subjects:['the lantern gallery','the community art wall','the little garden game','the craft showcase','the cozy stream','the illustrated mascot'],
  format:['LANTERN CHAT','ART SHOWCASE','COZY FEED','GALLERY NOTE'],
  prefix:['','🌷 ','[art wall] ','[tea chat] ']
 },
 glitch:{
  approve:[
   'GG! That was the cleanest last-second save in the bracket.',
   'FRAME PERFECT. How did they pull off that cancel? 🎮',
   'The retro console bracket has become a serious rivalry.',
   'The runner found a shortcut no one expected.',
   'Nobody got the first round prediction right 😂',
   'The crowd yelled LET’S GO at the exact same moment.',
   'Not a fan of that ruleset, but I respect the winner.',
   'These two teams are trading points like crazy.',
   'Match point! Somebody wake up the commentators.',
   'The old arcade cabinet survived another tournament.',
   'Is there a replay showing the final input sequence?',
   'Controller cam says that was absolutely intentional.',
   'We need a fan-art poster for this ridiculous final round.',
   'GGs to both teams. Incredible match!',
   'The speedrun timer is one frame away from history.',
   'The scoreboard glitch was harmless but hilarious.',
   'I am rooting for the underdog in the next race.',
   'That taunt is ordinary competitive banter, not a threat.',
   'The music drop lined up perfectly with the last hit.',
   'The bracket update is posted in the official tournament thread.',
   'Can we all appreciate how fast the commentators are?',
   'The pixel crowd is losing its mind over that combo.',
   'A viewer built a tiny arcade stick out of cardboard.',
   'There are no losers after a set that close. Respect.'
  ],
  flag:[
   'An unofficial screenshot says the match time changed. Needs confirmation.',
   'The alleged new world record has no complete run video.',
   'Someone claims the bracket was reset; no admin source attached.',
   'This unverified merch listing claims tournament sponsorship.',
   'A cropped clip supposedly shows cheating. Full footage missing.',
   'The prize pool update comes from an unidentified account.',
   'The controller ruling is being quoted without a full statement.',
   'Unconfirmed rumor says the final match moved to another venue.',
   'The merch seller claims an official badge but shows no verification.',
   'This cropped run timer has no independent record or context.',
   'A supposed tournament admin announcement lacks a verified origin.',
   'An anonymous claim about match fixing needs corroboration.'
  ],
  remove:[
   'I am a fake tournament admin. Send me your one-time login code.',
   'The unofficial championship shop requires your card PIN to check out.',
   'I will physically hurt the fictional bracket volunteer after the match.',
   'Everyone raid that player with threats until they quit.',
   'Pay a private crypto unlock fee for guaranteed championship winnings.',
   'Give me your account recovery phrase to claim the esports trophy.',
   'This fake merch store collects passwords instead of payments.',
   'Publish the competitor’s home address so fans can confront them.',
   'The prize is guaranteed if you send your banking password first.',
   'Let’s coordinate targeted harassment against this rival team.',
   'A counterfeit tournament payment page asks for one-time login codes.',
   'I stole the player’s private phone number. Use it to intimidate them.'
  ],
  subjects:['the quarterfinal','the bonus round','the controller meta','the retro final','the speedrun bracket','the merchandise queue'],
  format:['PIXEL PIT LIVE','BRACKET UPDATE','GG CHAT','MATCH CLIP'],
  prefix:['','[GG] ','[bracket] ','[speedrun] ']
 }
};
const hash61=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h>>>0};
export function createIdentityCases(cards,creatorId,eventId,cycle=0){const pack=lore[creatorId];if(!pack)return cards;const edition=`${eventId}:cycle-${cycle}`;
 const uses={approve:0,flag:0,remove:0};const taken=new Set();
 return cards.map((card,i)=>{
  const n=uses[card.verdict]++,pool=pack[card.verdict]||[];
  const topic=pack.subjects[(n+hash61(edition))%pack.subjects.length];
  const author=NETWORK_CREATORS.find(c=>c.id===creatorId)?.members[(i*7+hash61(edition+i))%5]||card.author;
  let text=card.text;
  // Preserve linked evidence, but reframe the conversation around the creator.
  if(card.campaign)text=`${creatorId==='glitch'?'Fan merch drop':'Community memorabilia'}: ${card.text}`;
  else if(card.cascade)text=`${creatorId==='destiny'?'[debate thread]':creatorId==='nova'?'[gallery replies]':'[bracket chat]'} ${card.text}`;
  else if(pool.length){text=pack.prefix[Math.floor(n/pool.length)%pack.prefix.length]+pool[(n+hash61(edition+card.verdict))%pool.length];
   if(n>=pool.length)text+=` — talking about ${topic}.`;
  }
  // Distinct, deterministic authored variants; no random or data-dependent labels.
  if(taken.has(text))text+=' ['+(i+1)+']';taken.add(text);
  const identity={...card,author,text,creatorId,communityLabel:pack.format[i%pack.format.length],memoryKey:`identity61|${edition}|${i}`,creatorTag:pack.format[(i+hash61(edition))%pack.format.length]};
  if(creatorId==='destiny'&&i%7<2&&!card.campaign&&!card.cascade){const id=`debate-${Math.floor(i/7)}`;identity.debateId=id;identity.debatePart=i%7;identity.debateSubject=pack.subjects[(Math.floor(i/7)+hash61(edition))%pack.subjects.length];}
  return identity;
 });
}
export function makeEmoteScript(seed){const others=['YEE','CatJAM','LUL','DuckerZ','OTK'];const choices=[];for(let i=0;i<16;i++){
 const offset=hash61(seed)%5;const match=(i+offset)%5!==3&&(i+offset)%7!==5;choices.push({id:`emote-${i}`,match,token:match?'PEPE':others[(hash61(seed+i)%others.length)],author:`viewer${100+(hash61(seed+':'+i)%899)}`,gain:10});
 }return choices;
}
