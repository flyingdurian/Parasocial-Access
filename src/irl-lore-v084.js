/* All 74 editorial seeds from DESTINY_DGG_LORE_RESEARCH_V071.md are playable
   fictional event variants. These are NOT real-world incidents or quotations.
   Categories mirror the six source-bank chapters in their original order. */
const groups={
 politics:[
  ['welcome','Full-Debate Viewer','Could we watch the whole exchange?','A peaceful fan brought a full-length clip for context.','mic'],
  ['welcome','Turnout Map Volunteer','Here are precinct turnout maps.','A volunteer brought public aggregate election figures.','signing'],
  ['welcome','Poll Denominator Critic','That polling denominator seems off.','A polite critic asks how the sample was collected.','mic'],
  ['welcome','January Transcript Reader','What does this public document prove?','They present a public transcript for a respectful question.','mic'],
  ['welcome','Election Strategy Debater','I favor a different campaign strategy.','Two people disagree without disturbing other visitors.','signing'],
  ['welcome','Housing Data Nerd','What study supports the supply number?','A fan requests the source of a housing statistic.','mic'],
  ['check','Supreme Court Quote Card','Is this holding really in the opinion?','A screenshot has no docket or page citation.','help'],
  ['redirect','Shifting Goalposts','One more premise, then another!','A guest refuses to yield the scheduled public microphone.','mic'],
  ['welcome','Geopolitics Student','I watched the research discussion.','A student wants a peaceful historical question.','signing'],
  ['welcome','Ukraine Research Fan','Could you explain the context in that clip?','A fan references a public international affairs discussion.','mic'],
  ['redirect','Interrupted Interview','Stop cutting my answer off!','The conversation becomes a repeated interruption of the timed panel.','line'],
  ['check','Undated Survey Chart','Is this a real public chart?','An infographic lacks a source date and data provenance.','help'],
  ['welcome','Economics Disagreement','I disagree, but that counterpoint was fair.','The guest engages with a policy argument respectfully.','signing'],
  ['welcome','Spreadsheet Collector','My source spreadsheet has footnotes!','A fan offers a harmless joke printout at the signing queue.','merch']
 ],
 media:[
  ['check','Ten-Second Edit','This clip cuts off the preceding sentence.','A viral video crop has uncertain context.','photo'],
  ['check','Unconfirmed Cancellation','Someone said the guest canceled.','An anonymous post has no organizer confirmation.','entrance'],
  ['redirect','Unsanctioned Interview','Can I film a hostile interview here?','A creator is recording in the posted no-interview area.','photo'],
  ['welcome','Debate Scoreboard Fans','We disagree about who won.','Rival fans are arguing playfully rather than harassing anyone.','merch'],
  ['check','Podcast Rumor Chain','Did the surprise podcast guest confirm?','Each retelling changes the unverified roster claim.','help'],
  ['welcome','Bridge Meme Collector','Did that bridge really burn?','The visitor is joking about relationships, not asserting a fact.','signing'],
  ['check','Clipped Collaborator','The public clip edit seems wrong.','An attendee wants the original recording to compare.','help'],
  ['welcome','Drama Flowchart Fan','I drew an imaginary drama flowchart.','A clearly labeled parody chart amuses the queue.','merch'],
  ['redirect','Camera Consent Reminder','Can you stop recording us?','An attendee films a consent-restricted photo area after a warning.','photo'],
  ['check','Uncited Endorsement','Is this endorsement screenshot real?','A screenshot lacks the source post and date.','help'],
  ['check','Surprise Guest Flyer','The flyer says a surprise guest is coming.','The printed schedule has no organizer approval.','entrance'],
  ['welcome','Media Incentives Critic','I disagree about the incentives here.','Two people discuss media business models calmly.','mic']
 ],
 emotes:[
  ['welcome','YEE and PEPE Duo','YEE or PEPE? Both of us came!','Two friends hold harmless rivalry signs.','merch'],
  ['welcome','YEE Sign Artist','YEE NEVA LOSE!','A fan holds a parody sign without blocking access.','signing'],
  ['welcome','dggL Greeter','dggL! Welcome to the floor!','A community regular welcomes a newcomer.','entrance'],
  ['welcome','OMEGALUL Laugher','OMEGALUL, that joke landed.','The room laughs at a harmless on-stage joke.','mic'],
  ['redirect','Emote Sign Jam','Our signs need the whole photo lane!','PEPE and YEE posters temporarily obstruct the queue.','photo'],
  ['welcome','GODSTINY Cheer','GODSTINY! Nice answer!','A visitor cheers after a sourced explanation.','mic'],
  ['welcome','DuckerZ Tease','DuckerZ, I am kidding!','Friends trade clearly friendly emote jokes.','signing'],
  ['welcome','WOOF Sticker Fan','Where is the WOOF leaderboard?','A harmless sticker collector asks about emote history.','merch'],
  ['welcome','Blubstiny Doodler','I made a Blubstiny doodle.','The drawing is affectionate parody fan art.','signing'],
  ['check','PepoThink Timekeeper','PepoThink, is the panel at four?','A guest carries an outdated schedule screenshot.','entrance'],
  ['welcome','NODDERS Wave','NODDERS all around!','Visitors nod during a careful explanation.','mic'],
  ['welcome','Copium Bracket Fan','My prediction was Copium.','A fan laughs at their own prediction.','signing'],
  ['welcome','Clueless Board Artist','My conspiracy board says Clueless.','A clearly satirical board is labeled fiction.','merch'],
  ['welcome','monkaS First Timer','monkaS, is this the public mic?','A nervous guest is waiting their turn.','mic'],
  ['welcome','HmmStiny Researcher','HmmStiny, let us check first.','A fan asks for an ordinary source check.','signing'],
  ['check','DANKMEMES Board','Can anyone edit the emote board?','A guest asks staff for display permissions.','help']
 ],
 community:[
  ['welcome','Early Stream Veteran','I remember the Justin.tv days.','A nostalgic attendee recalls an early broadcasting era.','merch'],
  ['welcome','StarCraft Heritage Fan','Were the old build orders hard?','A longtime viewer asks one nostalgic gaming question.','signing'],
  ['welcome','OmniLiberal Historian','I saw that old handle in an archive.','The guest asks about an old public identity reference.','signing'],
  ['welcome','DGG Chat Newcomer','How is DGG chat different?','A first timer asks about separate chat traditions.','entrance'],
  ['welcome','Twitch-Era Viewer','I watched older debate streams.','The guest reminisces without making platform allegations.','signing'],
  ['check','Stream Directory Fan','Which page is official?','Several platform links circulate without verification.','help'],
  ['check','Chat Rule Comparer','Do online rules govern this hall?','Staff must refer to actual posted venue rules.','entrance'],
  ['welcome','Registration Volunteer','Where is the volunteer information table?','The volunteer is directing guests to public civic resources.','help'],
  ['welcome','Group Photo Request','Can I share a photo of everyone?','A guest first seeks consent from people pictured.','photo'],
  ['redirect','Private Data Placard','I printed someone else’s phone number.','A guest attempts to display private contact information.','help'],
  ['welcome','Anything Else Listener','I brought a podcast-inspired fan poster.','A peaceful fan asks about another public program.','signing'],
  ['welcome','Bridges Episode Fan','Which Bridges episode should I try?','A guest asks for a public panel recommendation.','mic']
 ],
 venue:[
  ['welcome','First-Time Photo Fan','Could I have a photo, please?','The guest has valid entry and waits patiently.','photo'],
  ['welcome','Polite Q&A Critic','I disagree, may I join the Q&A?','A calm critic joins the normal speaking line.','mic'],
  ['redirect','Meet-and-Greet Debater','Why can’t I debate at the autograph table?','The guest is trying to convert signing time into open mic time.','signing'],
  ['check','Wrong-Name Print','My signed print has the wrong name.','Merch staff need to compare the receipt and name.','merch'],
  ['welcome','Merch-Only Visitor','I came for a shirt, not a photo.','An attendee only wants directions to the store.','merch'],
  ['welcome','Quiet-Zone Seeker','Could I sit somewhere calmer?','A guest asks politely for a lower-stimulation area.','quiet'],
  ['redirect','Poster Priority Fight','My poster should be signed first!','Two fans interrupt the queue over priority.','line'],
  ['redirect','Camera Tripod Blocker','This camera needs the whole aisle!','A tripod blocks the accessible route.','photo'],
  ['check','VIP Badge Question','Can you verify my VIP pass?','The entry badge is visibly inconsistent.','entrance'],
  ['redirect','Noisy Nonviolent Heckler','I disagree, loudly!','Repeated interruptions disrupt the signing schedule without threats.','mic'],
  ['welcome','Barrier-Compliant Guest','I can stay behind this line.','A guest obeys stage safety directions.','line'],
  ['security','Verified Venue Threat','I intend to physically harm someone here.','Two independent staff witnesses confirm a specific, immediate fictional danger.','line']
 ],
 evidence:[
  ['welcome','Court Filing Student','Is a complaint already a finding?','An attendee asks a generic legal literacy question.','mic'],
  ['check','Hearing Transcript Fan','Is the headline what the hearing said?','A public hearing excerpt has missing context.','help'],
  ['check','Civil Claim Confusion','Was a civil claim actually proven?','A purported court summary does not state any finding.','help'],
  ['check','Case Number Volunteer','Where is the original case number?','A displayed allegation has no verifiable public record.','help'],
  ['welcome','Speech Norms Debater','Can we discuss moderation rules?','The visitor politely raises a general speech question.','mic'],
  ['check','Edited Rules Document','This policy screenshot looks fan-made.','Two documents disagree; verify the official version.','help'],
  ['welcome','Opinion Dissenter','I read the public opinion differently.','A thoughtful critic disputes interpretation without harassment.','mic'],
  ['check','Allegation Fact Checker','Is that an allegation or a finding?','A journalist asks for a precise distinction and a source.','help']
 ]
};
export const DESTINY_LORE_GROUPS=Object.freeze(Object.fromEntries(Object.entries(groups).map(([name,rows])=>[name,Object.freeze(rows.length)])));
export const DESTINY_LORE_BEATS=Object.freeze(Object.entries(groups).flatMap(([category,rows])=>rows.map(([action,name,text,cue,station],index)=>Object.freeze({id:`${category}-${index+1}`,category,action,name,text,cue,station,check:action==='welcome'?'Peaceful opinions, jokes and ordinary fandom are allowed.':action==='redirect'?'Re-route disruptive conduct without punishing peaceful disagreement.':action==='check'?'Confirm the document, credential or claim with the event organizer first.':'Independent staff corroborate immediate danger; call professional security.'}))));
export const DESTINY_LORE_CARDS=Object.freeze(DESTINY_LORE_BEATS.map(b=>Object.freeze([b.action,b.name,b.text,b.cue,b.check,b.station,b.category,b.id])));

const ambientAdditions={
 1:['dggL · Welcome, first-timers!','We need the original source, not a crop.','YEE and PEPE signs are both fan art.','The Bridges panel starts later.'],
 2:['Did the clip include the full argument?','Canvassing maps use public totals.','NODDERS · Another good question.','Ask before posting group photographs.'],
 3:['One question per mic turn, please.','A filing is not the same as a finding.','PepoThink · Check the transcript.','Keep the stage exit clear.']
};
export function loreAmbientLine(station,seed,phase=1){
 const choices=DESTINY_LORE_BEATS.filter(b=>b.station===station&&b.action==='welcome');
 const lines=ambientAdditions[Math.min(3,Math.max(1,phase))];
 return seed%3===0&&choices.length?choices[Math.abs(seed)%choices.length].text:lines[Math.abs(seed+station.length)%lines.length];
}
export function loreStageLine(guest,beat){
 const category=guest.category||'venue';
 const tags={politics:['SOURCE CHECK?','LET’S COMPARE NOTES'],media:['FULL CONTEXT!','GOOD QUESTION'],emotes:['NODDERS!','dggL!'],community:['WELCOME BACK!','CHAT HISTORY!'],venue:['THANKS FOR COMING!','PHOTO TIME!'],evidence:['WHAT DOES IT PROVE?','CONTEXT MATTERS!']};
 return (tags[category]||tags.venue)[guest.debater?0:Math.min(1,Math.floor(beat*2))];
}
