/* Original fictional posts. Each item has ONE clearly signposted arcade verdict.
   Flag means evidence is explicitly missing, never a hidden political opinion test. */
const C=[];
function add(format, verdict, entries){
 for(const e of entries){const [author,text,detail='']=e;C.push({id:'rh-'+String(C.length+1).padStart(3,'0'),format,verdict,author,text,detail});}
}
add('micro','approve',[
 ['@daybreaktea','My balcony tomatoes finally turned red! 🍅','#garden'],
 ['@lunarpearl','I made a playlist for rainy train rides.','#music'],
 ['@teacupfox','First day at my new job. Wish me luck!','#newbeginnings'],
 ['@mintwindow','My cat has claimed the printer as her throne.','#pets'],
 ['@paperplane','Handmade bookmarks for the community library!','#crafts'],
 ['@solnights','Sunrise from the harbor ferry this morning.','#citylife'],
 ['@onemorelevel','I finally beat the puzzle on hard mode!','#gaming'],
 ['@dailybento','I made rice balls shaped like tiny penguins.','#lunch'],
 ['@marsviolet','Here is a free guide to fixing bicycle chains.','#cycling'],
 ['@beeandme','The neighborhood garden needs volunteer helpers.','#community'],
 ['@retrobyte','This old computer still boots after 25 years!','#retro'],
 ['@slowweekend','Spent Sunday painting with my grandparents.','#art'],
 ['@silverlake','The city council voted on a new bus route today.','#localnews'],
 ['@civicnotes','I disagree with the mayor’s parking proposal.','#opinion'],
 ['@friendlydebate','Here is why I oppose the housing plan.','#discussion'],
 ['@rivercloud','Reminder: the public town hall is at 6 PM.','#civic'],
]);
add('micro','remove',[
 ['@doublecashfast','Send your bank password to get an instant cash grant.','⚠ FAKE GRANT'],
 ['@getrichnow','Guaranteed 30x crypto returns. Pay the verification fee!','⚠ INVESTMENT SCAM'],
 ['@accountfix01','Your login is expiring! Type your password into my DMs.','⚠ ACCOUNT THEFT'],
 ['@hostilehandle','I’m coming to your house tonight to hurt you.','⚠ DIRECT THREAT'],
 ['@freegiftlinks','Claim your prize by entering your credit card PIN.','⚠ PHISHING'],
 ['@paydaywizard','Transfer $100 now and I’ll send back $1,000.','⚠ CASH FLIP'],
 ['@fakesupport','I am official support. Send me your one-time login code.','⚠ IMPERSONATION'],
 ['@nastybot','Here is someone’s private home address. Go harass them.','⚠ DOXXING'],
 ['@coinportal','No application needed—only your banking password!','⚠ PHISHING'],
 ['@ragecall','Bring weapons to the peaceful city meeting tonight.','⚠ VIOLENT INCITEMENT'],
 ['@vendorclone','The real shop is closed. Send payments to my personal account.','⚠ FAKE SHOP'],
 ['@t0talsup0rt','Verify your account at this fake login portal immediately.','⚠ PHISHING'],
 ['@fakefreepass','Reply with your social insurance number to receive a prize.','⚠ DATA THEFT'],
 ['@extortman','Pay me or I’ll publish your private photos.','⚠ EXTORTION'],
]);
add('micro','flag',[
 ['@leakwatch','Unverified screenshot claims the transit line is closing.','? SOURCE UNKNOWN'],
 ['@unknownwitness','I heard there may be a recall, but I cannot confirm.','? CHECK CLAIM'],
 ['@dealrumor','This unknown seller might be official. No proof yet.','? VERIFY SELLER'],
 ['@breakingmaybe','A cropped screenshot says the festival is canceled. Unconfirmed.','? MISSING CONTEXT'],
 ['@accountmaybe','Is this new account really the mayor? No verification.','? IDENTITY UNKNOWN'],
 ['@electionimage','Sharing an unverified ballot screenshot; no source attached.','? VERIFY SOURCE'],
]);
add('chat','approve',[
 ['sunnyspoon','That combo was incredible! 🎮','LIVE CHAT'],
 ['clouddancer','GG everyone! See you next stream.','LIVE CHAT'],
 ['jumbopanda','I love the new soundtrack!','LIVE CHAT'],
 ['peachmochi','Can we get a replay of that jump?','LIVE CHAT'],
 ['brightpixels','Thanks for the tutorial, it helped.','LIVE CHAT'],
 ['wavehello','Just arrived. What did I miss?','LIVE CHAT'],
 ['tinygalaxy','The lighting looks so good today.','LIVE CHAT'],
 ['stargazey','That was close! Nice recovery.','LIVE CHAT'],
 ['orangedesk','Is the streamer using a controller?','LIVE CHAT'],
 ['potatofriend','Chat, drink some water! 💧','LIVE CHAT'],
 ['railrunner','What a comeback!','LIVE CHAT'],
 ['cozycactus','I appreciate the subtitles.','LIVE CHAT'],
]);
add('chat','remove',[
 ['mega_deal_bot','CLICK MY LINK FOR FREE GEMS—ENTER PASSWORD!','SPAM LINK'],
 ['account_admin0','STREAMER ACCOUNT LOCKED. DM YOUR LOGIN CODE.','IMPERSONATOR'],
 ['raidtr0ll','Everybody attack this creator at their home address!','HARASSMENT RAID'],
 ['giftxgiftx','BUY FIFTY FOLLOWERS FOR $5 AT FAKEPORTAL.','SPAM SALES'],
 ['ransomcaller','Pay me or I will leak your photos.','EXTORTION'],
 ['flashbot12','FREE MONEY FREE MONEY SEND BANK DETAILS','BOT SPAM'],
 ['malicebyte','I will come to your studio and hurt you.','DIRECT THREAT'],
 ['spamking22','Your channel is compromised! DM me your password.','PHISHING'],
 ['adbot900','INVEST IN MAGIC COIN 100% GUARANTEED 100X!','SCAM LINK'],
 ['fake_mod_team','Moderator here: send your backup recovery codes now.','FAKE MOD'],
 ['angry_raider','Let’s track down the streamer and threaten them.','TARGETED THREAT'],
 ['promobotX','GET 10,000 VIEWS. CREDIT CARD NUMBER REQUIRED.','SPAM PROMO'],
 ['giftclaim99','FREE SKINS - enter card PIN to verify.','PHISHING'],
]);
add('chat','flag',[
 ['newsub_01','I have an unconfirmed giveaway announcement. Is it real?','? UNVERIFIED EVENT'],
 ['clipped_context','That quote sounds bad, but the clip begins halfway through.','? MISSING CONTEXT'],
 ['isthisofficial','Unverified moderator account posted a new rule.','? UNKNOWN ACCOUNT'],
 ['hype_unclear','I heard a rival channel was banned. No source.','? UNCONFIRMED'],
]);
add('forum','approve',[
 ['u/needlecraft','My first embroidered patch: a tiny moon.','r/CraftCorner'],
 ['u/kitchenwhiz','What’s your favorite one-pot dinner recipe?','r/WeekendCooking'],
 ['u/logic_fox','Solved the puzzle with a new method. Explanation inside.','r/PuzzleLab'],
 ['u/planetlover','Photographed Jupiter through my backyard telescope!','r/SkyWatch'],
 ['u/trainreader','I prefer the older railway design. Here’s why.','r/TransitTalk'],
 ['u/riverwalk','Is there a local book club meeting this weekend?','r/CityChat'],
 ['u/oldschooldev','My first code project still runs in the browser.','r/RetroComputing'],
 ['u/neutralcritic','The new policy is ineffective, in my opinion.','r/PolicyTalk'],
]);
add('forum','remove',[
 ['u/loginleak','Here are private login credentials. Try them now.','r/TechHelp'],
 ['u/cashflip','Wire me $80 and I guarantee $800 tomorrow.','r/MoneyTips'],
 ['u/huntpeople','Here’s a student’s home address. Go confront them.','r/CityChat'],
 ['u/fakewarning','Enter your account password in this comment to stay safe.','r/TechHelp'],
 ['u/vengeful','I will hurt the person who posted this thread tonight.','r/Drama'],
 ['u/phisher','Use this imitation banking site to claim free funds.','r/Deals'],
]);
add('forum','flag',[
 ['u/unverified_update','A screenshot claims the park is closing, but no source.','r/CityChat'],
 ['u/cropped_receipt','This cropped receipt may show fraud; the rest is missing.','r/Shopping'],
 ['u/unconfirmed_claim','Is this volunteer group legitimate? I cannot verify it.','r/Community'],
]);
add('group','approve',[
 ['Neighborhood Pantry','Food bank volunteers needed this Saturday.','PARKSIDE GROUP'],
 ['Community Cycling','Free tire repair lesson at the local center.','RIVER RIDERS'],
 ['Block Gardening','Tomato seeds available at the swap table!','GARDEN CLUB'],
 ['Book Exchange','Bring one book, take another this Sunday.','READERS GROUP'],
 ['City Transit Fans','Meeting to discuss bus schedule changes.','TRANSIT GROUP'],
 ['Civic Forum','Residents are welcome to debate the housing proposal.','LOCAL CIVICS'],
]);
add('group','remove',[
 ['FastGrant Admin','Deposit your banking password to qualify for aid.','FAKE GRANT'],
 ['Phantom Organizer','Share private resident addresses so we can target them.','DOXXING'],
 ['Cash Group','Send $200 to unlock a guaranteed $2,000 payout.','SCAM'],
 ['Fake Council','Official city staff here. DM your authentication code.','IMPERSONATION'],
]);
add('group','flag',[
 ['New Aid Initiative','Unverified charity asks for transfers; no registration details.','? VERIFY CHARITY'],
 ['Community Alert','Rumor of water contamination without any linked source.','? VERIFY PUBLIC NOTICE'],
]);
add('market','approve',[
 ['MapleChair','Wooden dining chair · $35 · pickup Sunday.','LOCAL MARKET'],
 ['SecondHandStar','Used keyboard, works well. $15.','TECH SWAP'],
 ['GardenJar','Three plant pots for $10.','GARDEN MARKET'],
 ['VinylAisle','Selling a jazz vinyl collection locally.','MUSIC MARKET'],
 ['BikeCorner','Kids bike helmet, lightly used, $12.','LOCAL MARKET'],
 ['ShelfLife','Used paperback set, $9.','BOOK SWAP'],
]);
add('market','remove',[
 ['PrizeBadge','Nintendo console FREE. First send your account password.','PHISHING LISTING'],
 ['BankWireOnly','I’ll send a laptop after you transfer to my secret account.','FRAUD LISTING'],
 ['GoldReturn','Guaranteed investment payout if you wire $900.','INVESTMENT SCAM'],
 ['SupportSeller','Give me your login recovery code before purchasing.','DATA THEFT'],
 ['GiftCardKing','Pay a verification fee in gift cards for a free car.','GIFT CARD SCAM'],
]);
add('market','flag',[
 ['MysterySeller','Brand-new phone at 5% of price; seller identity unverified.','? CHECK SELLER'],
 ['UnclearBrand','Claims to be the official retailer but no verification.','? VERIFY STORE'],
]);
add('gaming','approve',[
 ['StoneKnight','Great match. Let’s run it back!','MATCH CHAT'],
 ['NoScopeNope','That boss is so hard, respect to anyone who beats it.','MATCH CHAT'],
 ['tinyhealer','Nice teamwork, everybody.','GUILD CHAT'],
 ['MapWarden','Who wants to join the co-op raid tomorrow?','GUILD CHAT'],
 ['BluePotion','I think the new patch is unbalanced.','GAME FORUM'],
]);
add('gaming','remove',[
 ['FreeSkinAdmin','Send your login token for free premium skins.','PHISHING'],
 ['GuildCashLord','Buy this fake currency with stolen card details.','FRAUD'],
 ['PersonalThreat','I know your address and I’m coming to hurt you.','DIRECT THREAT'],
 ['fake_esportsmod','Official tournament staff: DM your password now.','FAKE MOD'],
]);
add('gaming','flag',[
 ['HalfClipHero','A short clipped match chat may be missing context.','? PARTIAL CLIP'],
 ['UnverifiedPatch','Unconfirmed leak claims all accounts will reset.','? SOURCE UNKNOWN'],
]);
add('civic','approve',[
 ['CityBudgetWatch','I support the transit proposal because buses are too slow.','CIVIC DISCUSSION'],
 ['TownHallNotes','I oppose the housing plan. Here are my reasons.','CIVIC DISCUSSION'],
 ['PublicSquare','Reminder: peaceful public gathering tonight at 7.','LOCAL CIVICS'],
 ['OpenDebate','The candidate’s speech was unconvincing to me.','CIVIC DISCUSSION'],
]);
add('civic','remove',[
 ['MobSummoner','Bring weapons to the town hall and hurt the speakers.','INCITEMENT'],
 ['VoteCodeSteal','Official election office: DM your login code right now.','IMPERSONATION'],
]);
add('civic','flag',[
 ['BallotScreen','Unverified cropped ballot screenshots; no source link.','? VERIFY IMAGE'],
 ['MysteryCandidate','Unconfirmed account claims to be an elected official.','? IDENTITY UNKNOWN'],
]);
export const CASES=C;
export const SURFACES={micro:{brand:'QUICKPOST',icon:'↗',tone:'teal',tag:'MICROBLOG'},chat:{brand:'PULSE LIVE',icon:'●',tone:'purple',tag:'STREAM CHAT'},forum:{brand:'THREADHUB',icon:'≋',tone:'blue',tag:'FORUM'},group:{brand:'COMMONSPACE',icon:'◈',tone:'orange',tag:'COMMUNITY'},market:{brand:'SWAPLANE',icon:'◇',tone:'yellow',tag:'MARKETPLACE'},gaming:{brand:'LOBBY.GG',icon:'⌘',tone:'pink',tag:'GAMING'},civic:{brand:'PUBLIC SQUARE',icon:'▣',tone:'blue',tag:'CIVIC'}};
export const RULES={approve:'Safe or ordinary conversation',flag:'Insufficient verification / unclear context',remove:'Clear scam, threat, phishing, or harassment'};
export function seededShuffle(arr,seed){let x=seed>>>0||1;const out=[...arr];for(let i=out.length-1;i>0;i--){x^=x<<13;x^=x>>>17;x^=x<<5;const j=(x>>>0)%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;}
export function makeRun(seed){
 const shifts=[{id:'micro',title:'THE FIRST WAVE',subtitle:'Microblog sprint',formats:['micro','forum','group'],count:22,seconds:64,interval:2550},{id:'live',title:'CHAT OVERLOAD',subtitle:'Livestream chat rush',formats:['chat','gaming','micro'],count:26,seconds:69,interval:2050},{id:'raid',title:'THE SPAM RAID',subtitle:'Mixed-platform crisis',formats:['micro','chat','forum','group','market','gaming','civic'],count:30,seconds:75,interval:1800}];
 const used=new Set();return shifts.map((s,i)=>{
  const pool=seededShuffle(CASES.filter(c=>s.formats.includes(c.format)&&!used.has(c.id)),seed+7919*i);
  let picks=pool.slice(0,s.count);if(picks.length<s.count)throw Error('Not enough unique cases');picks.forEach(c=>used.add(c.id));
  // Ensure varied verdicts without a predictable cycle.
  if(i===2){const enough=['approve','remove','flag'].every(v=>picks.filter(p=>p.verdict===v).length>=3);if(!enough){const need=CASES.filter(c=>!used.has(c.id)&&s.formats.includes(c.format)); for(const v of ['approve','remove','flag']){while(picks.filter(p=>p.verdict===v).length<3){const add=need.find(p=>p.verdict===v&&!used.has(p.id));if(!add)break;const idx=picks.findLastIndex(p=>p.verdict!==v&&picks.filter(z=>z.verdict===p.verdict).length>3);if(idx<0)break;used.delete(picks[idx].id);picks[idx]=add;used.add(add.id);}}}}
  return {...s,cases:picks};
 });
}
