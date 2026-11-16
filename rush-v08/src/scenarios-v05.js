/* Fictional creator identities. Names, communities and lore are original;
   v0.5 establishes continuity, NOT a creator-management simulation. */
export const CREATORS=[
 {id:'nova',name:'Nova Vale',handle:'@novaplays',room:'The Lantern Lounge',community:'r/LanternLounge',theme:'#8cd6fa',icon:'✦',topic:'A cozy indie-game stream with friendly regulars'},
 {id:'glitch',name:'Glitch Arcade',handle:'@glitcharcade',room:'Pixel Pit',community:'r/PixelPit',theme:'#f5a1c5',icon:'◈',topic:'Retro games, speedruns, and enthusiastic debates'},
 {id:'mira',name:'Mira Tech',handle:'@mirabuilds',room:'Circuit Club',community:'r/CircuitClub',theme:'#e1c18a',icon:'⌘',topic:'Gadget repairs and practical technology tips'},
 {id:'sol',name:'Sol Scribbles',handle:'@solscribbles',room:'Sketch Corner',community:'r/SketchCorner',theme:'#ace8bc',icon:'✿',topic:'Digital art, animation, and community challenges'}
];
const THINGS=['a retro controller','a speedrun shortcut','this indie game','the latest headset','a charity art stream','a community tournament'];
const WORDS=['flood','fake giveaway','imposter account','password request','unknown link','edited screenshot'];
export const THREAD_FAMILIES=[
 {id:'thread-regular',verdict:'approve',formats:['forum','group','gaming'],variants:[
 r=>`I tried ${r(THINGS)} yesterday. Here are my notes 😊`,r=>`I disagree, but this is a fun discussion. GG everyone!`,r=>`Does anyone know a good tutorial for ${r(THINGS)}?`,r=>`The community event this weekend was so good 🎉`,r=>`Thanks to everyone who helped with the stream highlights!`,r=>`My setup finally works. Thanks for the advice!`]},
 {id:'thread-context',verdict:'approve',formats:['forum','group'],variants:[
 r=>`Reminder: please don't share login codes with anyone.`,r=>`That screenshot is edited; check the original source first.`,r=>`I think we should wait before sharing rumors about the channel.`,r=>`The account requesting passwords is NOT our moderator.`,r=>`This was a joke from the stream, not an actual giveaway.`,r=>`Can we stop arguing and just enjoy the game? 😅`]},
 {id:'thread-scam',verdict:'remove',formats:['forum','group','gaming'],variants:[
 r=>`STAFF NOTICE: Send me your password for a free ${r(THINGS)}!`,r=>`Exclusive prize: send your bank PIN in a DM to claim.`,r=>`Your account is suspended! Message me your recovery codes now.`,r=>`Official support here. Pay my personal account to unlock the reward.`,r=>`Get $2,000 guaranteed after a $40 activation fee.`,r=>`Prize winners must submit their one-time sign-in code to me.`]},
 {id:'thread-harassment',verdict:'remove',formats:['forum','gaming','group'],variants:[
 r=>`Everyone, coordinate harassment against this member until they quit.`,r=>`Let's publish that viewer's home address to scare them.`,r=>`I will come to the event tonight and physically attack the host.`,r=>`Share their private contact information so people can threaten them.`,r=>`I am threatening to hurt the organizers at tomorrow's meet-up.`,r=>`I will post your private photos unless you pay me.`]},
 {id:'thread-unclear',verdict:'flag',formats:['forum','group','gaming'],variants:[
 r=>`Unverified: someone claims the next tournament was cancelled.`,r=>`Can a moderator verify this anonymous leak? No source attached.`,r=>`Unconfirmed claim: the streamer is deleting their channel today.`,r=>`This account might be an impersonator; identity is unverified.`,r=>`That headline is missing its original link. Please verify first.`,r=>`I saw an edited clip that might be misleading. Needs review.`]},
 {id:'thread-report',verdict:'flag',formats:['forum','group'],variants:[
 r=>`Report: a newly created account claims to represent the organizers. Please verify.`,r=>`I can't confirm whether this purported giveaway is official.`,r=>`This screenshot shows a claim, but its date and source are missing.`,r=>`Moderators, could you check this suspicious seller's identity?`,r=>`Someone posted an uncited accusation about a member. Can staff review it?`,r=>`I'm uncertain this announcement came from the real channel team.`]},
 {id:'thread-enthusiasm',verdict:'approve',formats:['forum','gaming','group'],variants:[
 r=>`No way, that was the best comeback of the whole tournament 😂`,r=>`New here! Really enjoying the community vibes ✨`,r=>`Shout-out to the volunteer moderators tonight 👏`,r=>`Who else is excited about the new stream schedule?`,r=>`Can't believe we finally beat that level!`,r=>`The artwork in this community is honestly incredible 💜`]},
 {id:'thread-promo',verdict:'remove',formats:['forum','group','gaming'],variants:[
 r=>`Moderator announcement: submit your credit card PIN to get VIP status.`,r=>`Claim unlimited channel currency by sending me your login password.`,r=>`Guaranteed giveaway! Pay a verification fee to my private wallet.`,r=>`This is a fake staff account. Give me your login code anyway.`,r=>`Click my fake support page and enter your account recovery phrase.`,r=>`Pay me first and I'll magically multiply your streaming donations.`]}
];
