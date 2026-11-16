/* Fictionalized play scenarios informed by DESTINY_DGG_LORE_RESEARCH_V071.md.
   They are invented attendees, not real quotations, allegations or incidents. */
export const DESTINY_IRL_SCENARIOS=[
 ['welcome','Polling Denominator Fan','The sample size matters, right?','A policy nerd asks an ordinary data-methodology question.','They are a friendly visitor with a valid ticket.'],
 ['welcome','Full Context Viewer','Can we watch the full clip first?','A fan asks the mic host to restore context to a viral debate clip.','Good-faith debate requests are welcome.'],
 ['welcome','YEE Banner Team','YEE NEVA LOSE!','Two fans hold a friendly parody emote banner near the photo backdrop.','A harmless fan-culture joke, not a threat.'],
 ['welcome','Bridge Podcast Listener','Loved the panel format!','A podcast fan is politely waiting with a program to sign.','Ordinary autograph request.'],
 ['welcome','Election Canvassing Fan','Can I thank the volunteers?','A visitor brought a cheerful volunteer group card.','Gratitude and political participation are welcome.'],
 ['welcome','First-Time DGG Viewer','Is PepoThink a question?','A newcomer asks a harmless question about old chat emotes.','Explain community culture without assuming misconduct.'],
 ['welcome','Source Spreadsheet Fan','I brought citations for the citations.','A fan laughs at a giant pretend source spreadsheet.','Harmless research-nerd humor.'],
 ['welcome','Respectful Debate Critic','I disagree about housing policy.','A critic offers a calm opposing interpretation near the queue.','Political disagreement is welcome without harassment.'],
 ['welcome','Transcript Context Club','I brought the full transcript, not a ten-second edit.','An attendee asks for fair clip context before criticizing a debate argument.','A civil disagreement and a reference document are harmless.'],
 ['welcome','Podcast Roundtable Fan','Is there a roundtable segment today?','The visitor holds a fan-made Bridges-inspired episode guide.','They have no backstage request and are simply curious about the program.'],
 ['welcome','Canvassing Map Nerd','I plotted turnout by precinct for fun.','A volunteer shows a self-made map without personal voter information.','This is a harmless public-data conversation.'],
 ['welcome','Community Rules Reader','I like that the event has clear ground rules.','A guest asks whether the online chat guidelines also apply in the hall.','Point them toward posted venue-specific expectations; no misconduct.'],
 ['welcome','YEE-PEPE Costume Pair','We came together. Do not tell chat!','Two friends jokingly wear competing emote faction colors.','The rivalry is playful, not a genuine public-safety dispute.'],
 ['redirect','Ten-Second Clip Debate','The edit changes everything!','Two fans loudly argue about a clipped segment in the accessibility aisle.','Their argument is lawful; move them out of the blocked route.'],
 ['redirect','YEE Versus PEPE Parade','Our emote faction has the best sign!','A playful chanting group briefly blocks the photo line.','Redirect the group; the emote rivalry is a joke.'],
 ['redirect','Mic Goalpost Mover','One more question! No, three!','A guest repeatedly interrupts the timed public microphone rotation.','Keep the Q&A fair by moving the guest back to the speaking queue.'],
 ['redirect','Bridge Flowchart Crowd','Wait, this arrow goes where?','Visitors crowd around a satirical streamer-drama chart near the entrance.','Give them a clear discussion area away from check-in.'],
 ['redirect','Consent Reminder','Please ask before filming me.','Two people start a heated but nonthreatening argument over camera consent.','Move the filming discussion away from the autograph line.'],
 ['redirect','Mid-Panel Heckler','Answer the denominator question!','An impatient critic interrupts repeatedly, without making threats.','Redirect the disruption, not the opinion.'],
 ['redirect','Endless Source Debate','My footnotes need a microphone too!','An excited attendee tries to extend a Q&A turn past the timer.','Move them to the dedicated post-panel discussion space.'],
 ['redirect','Emote Chant Detour','NODDERS NODDERS NODDERS!','A cheerful chanting group accidentally backs into an exit corridor.','Restore the emergency lane without punishing their joke.'],
 ['check','Public Research Wall','The sources are printed right here.','An event guest wants to add an unverified infographic to a display.','Confirm display authorization and a verifiable source.'],
 ['check','Canvassing Session Change','I was told my shift starts later.','A volunteer shows a badge with an outdated event time.','Verify the current organizer schedule before routing them.'],
 ['check','Unconfirmed Podcast Guest','The surprise guest is definitely coming.','A fan-made flyer advertises a surprise speaker without confirmation.','Check the official event roster before granting access.'],
 ['check','DGG Press Badge','The badge design changed this morning.','A reporter holds a newly printed credential and consent form.','Staff should confirm the attendee credentials, not their opinion.'],
 ['check','Clip Attribution Request','Is that a real screenshot or a parody?','An attendee submits a questionable quote card for the stage screen.','Confirm provenance before publishing the graphic.'],
 ['check','Panel Program Revision','I think this is the latest Q&A order.','An organizer arrives with a revised discussion schedule.','Compare the printed program with the official stage manifest.']
 ,['check','Roundtable Guest Claim','I am on the Bridges guest schedule.','A person shows an undated screenshot of an episode guest list.','Ask the organizer to verify the current program before granting access.']
];
export const DESTINY_AMBIENT_LINES=Object.freeze({
 merch:['dggL sticker restock!','YEE poster or PEPE poster?','Source spreadsheets, tiny edition.','I found the tiny Bridges sticker!','Fan art, not an official product.'],
 snacks:['Hot choccy line is moving!','Coffee before the next debate.','Canvassing crew taking a snack break.'],
 photo:['dggL! Big group photo!','YEE versus PEPE sign-off!','One more picture by the backdrop!','Please ask before recording.'],
 mic:['Can we see the full context?','What is the sample size?','PepoThink ... follow-up question!','Your denominator is off!','One question per turn, please.'],
 line:['The Q&A starts after this group.','Please keep the aisle clear.','I brought a signed program.','NODDERS. We wait our turn.','The roundtable starts soon.'],
 signing:['Policy debate, then photo op.','Welcome to the community!','That is a great source binder.','Canvassing map is ready.','Love the full-context approach.'],
 entrance:['Have the official ticket ready.','Volunteer check-in is over here.','Welcome to the convention!'],
 quiet:['A civil disagreement is fine.',"Let's discuss it by the help desk.",'Thanks for making room.']
});
export function ambientLine(station,seed){
 const list=DESTINY_AMBIENT_LINES[station]||DESTINY_AMBIENT_LINES.line;
 return list[Math.abs(seed)%list.length];
}
