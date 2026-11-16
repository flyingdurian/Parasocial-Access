from pathlib import Path
p=Path(__file__).resolve().parents[1]/'src/ui.js';s=p.read_text()
def rep(a,b,n=1):
 global s
 c=s.count(a)
 assert c==n,(c,a[:120])
 s=s.replace(a,b,n)
rep('CREATOR NETWORK <b>0.6</b>','CREATOR IDENTITY <b>0.6.1</b>')
rep('◌ REPLIES</span><span>READ → DECIDE','◌ REPLIES</span><span>READ → DECIDE') if False else None
# Visual contextual counterpoint cues on posts/chat, not invented historical quotes.
rep("${highlighted}</div>${engine.flashEvent?", "${highlighted}</div>${c.debateId?`<div class=\"debate-context\"><span>⚖ DEBATE CLASH · ${c.debatePart===0?'POINT':'COUNTERPOINT'}</span><b>${esc(c.debateSubject)}</b></div>`:''}${engine.flashEvent?")
rep('<span class="chat-text">${esc(c.text)}</span></div>', '<span class="chat-text">${esc(c.text)}</span>${c.debateId?`<span class="debate-mini">⚖ CLASH · ${esc(c.debateSubject)}</span>`:``}</div>')
rep('<span class="thread-reply-text">${esc(c.text)}</span>${clue}', '<span class="thread-reply-text">${esc(c.text)}</span>${c.debateId?`<span class="debate-mini">⚖ ${esc(c.debateSubject)}</span>`:``}${clue}')
# Creator signature HUD: small enough to fit phone and update without rerendering controls.
signature='''function creatorSignature(){const id=engine.creatorId;
 if(id==='destiny')return `<section class="creator-signature sig-destiny"><span>⚖ DEBATE CLASH</span><strong><b id="debate-clashes">${engine.debateClashes}</b> PAIRS DEFENDED</strong><span class="sig-right">${engine.emoteTrain?`🐸 EMOTE TRAIN · PEAK <b id="emote-peak">×${engine.emoteTrain.peak}</b>`:'SOURCE · CONTEXT · CRITICISM ≠ ABUSE'}</span></section>`;
 if(id==='nova')return `<section class="creator-signature sig-nova"><span>✿ COMMUNITY MOMENTUM</span><i class="community-meter"><i id="community-meter-fill" style="width:${engine.momentum}%"></i></i><strong id="community-momentum">${engine.momentum}%</strong><span class="sig-right">✦ <b id="community-celebrations">${engine.communityCelebrations}</b> CELEBRATIONS</span></section>`;
 if(id==='glitch')return `<section class="creator-signature sig-glitch"><span>◆ TOURNAMENT ROUND <b id="tournament-round">${engine.tournament?.round||1}</b> / 3</span><div class="round-pips"><i class="lit"></i><i></i><i></i></div><strong>CLUTCHES <b id="tournament-clutches">${engine.tournament?.clutches||0}</b></strong><span class="sig-right">MATCH POINT · COMBO PRESSURE</span></section>`;
 return '';
}
function renderCreatorOverlay(){const root=$('#creator-arcade-layer');if(!root)return;
 const e=engine.emoteTrain;
 if(e?.active){const c=e.current;root.innerHTML=`<div class="creator-arcade-scrim"><section class="emote-arcade" role="dialog" aria-modal="true" aria-label="Emote Train arcade"><div class="emote-heading"><span>DESTINY · DGG-INSPIRED MINI EVENT</span><b>C-C-COMBO!</b></div><div class="emote-prize"><strong>🐸 PEPE</strong><div><b id="emote-combo">×${e.combo}</b><small>TRAIN COMBO · PEAK ×${e.peak}</small></div></div><div class="emote-stage">${[0,1,2,3,4].map(()=>'<span>🐸</span>').join('')}</div><div class="emote-incoming"><small>INCOMING ${e.index+1} / ${e.script.length} · ${esc(c.author)}</small><strong class="${c.match?'emote-matching':'emote-interruption'}">${esc(c.token)}</strong><div class="emote-time"><i id="emote-time-fill" style="width:${e.timer/3.4*100}%"></i></div></div><p>Same emote → MERGE. Different emote or ordinary chat → ROUTE ASIDE. Neither action bans anyone.</p><div class="emote-actions"><button data-cmd="emote" data-choice="merge"><b>✦ MERGE MATCH</b><small>J / 1 · SAME EMOTE</small></button><button data-cmd="emote" data-choice="route"><b>↳ ROUTE ASIDE</b><small>K / 2 · DIFFERENT MESSAGE</small></button></div><small class="emote-disclaimer">TIME AND MODERATION QUEUE ARE PAUSED DURING THIS MINI EVENT</small></section></div>`;return;}
 if(engine.tournament?.breakRemaining>0){const t=engine.tournament;root.innerHTML=`<div class="creator-arcade-scrim round-scrim"><section class="round-arcade"><span class="eyebrow">GLITCH ARCADE · PIXEL PIT</span><h2>ROUND ${t.round}<br><em>${t.round===3?'MATCH POINT!':'GET READY.'}</em></h2><p>Take your position. Next round incoming.</p><div class="round-count" id="round-count">${t.breakRemaining.toFixed(1)}s</div></section></div>`;return;}
 root.innerHTML='';
}
function updateSignatureHud(){const set=(q,v)=>{const n=$(q);if(n)n.textContent=v;};
 if(engine.creatorId==='destiny'){set('#debate-clashes',engine.debateClashes);set('#emote-peak','×'+(engine.emoteTrain?.peak||0));const e=engine.emoteTrain;if(e?.active){set('#emote-combo','×'+e.combo);const time=$('#emote-time-fill');if(time)time.style.width=(Math.max(0,e.timer/3.4)*100)+'%';}}
 if(engine.creatorId==='nova'){set('#community-momentum',engine.momentum+'%');const fill=$('#community-meter-fill');if(fill)fill.style.width=engine.momentum+'%';set('#community-celebrations',engine.communityCelebrations);}
 if(engine.creatorId==='glitch'){set('#tournament-round',engine.tournament?.round||1);set('#tournament-clutches',engine.tournament?.clutches||0);document.querySelectorAll('.round-pips i').forEach((el,i)=>el.classList.toggle('lit',i<(engine.tournament?.round||1)));if(engine.tournament?.breakRemaining>0)set('#round-count',engine.tournament.breakRemaining.toFixed(1)+'s');}
}
const creatorAudioMode=()=>engine.creatorId?(engine.creatorId==='glitch'&&engine.tournament?.round===3?'glitch-final':engine.creatorId):engine.world===1?'arena':engine.world===2?'market':engine.world===3?'thread':'feed';
'''
rep('function game(){',signature+'function game(){')
rep("${rush?'raid-mode':''}\">${header()}","${rush?'raid-mode':''} ${creatorProfile?'creator-skin creator-'+creatorProfile.id:''}\">${header()}")
rep("</span></div>`:''}<div class=\"game-alert", "</span></div>`:''}${creatorProfile?creatorSignature():''}<div class=\"game-alert")
rep('FEEDFALL OS // v0.6','FEEDFALL OS // v0.6.1')
rep('<div id="pause-layer"></div></div>`;}','<div id="pause-layer"></div><div id="creator-arcade-layer"></div></div>`;}')
rep("<span>${esc(r.creatorEventTitle)} · +${r.creatorXp} CHANNEL XP · LEVEL ${r.creatorLevel}</span>","<span>${esc(r.creatorEventTitle)} · +${r.creatorXp} CHANNEL XP · LEVEL ${r.creatorLevel}</span><span>${r.creatorIdentity?.emotePeak?'🐸 EMOTE PEAK ×'+r.creatorIdentity.emotePeak+' · ':''}${r.creatorIdentity?.debateClashes?'⚖ CLASHES '+r.creatorIdentity.debateClashes+' · ':''}${r.creatorIdentity?.communityCelebrations?'✿ CELEBRATIONS '+r.creatorIdentity.communityCelebrations+' · ':''}${r.creatorIdentity?.tournamentClutches?'◆ CLUTCHES '+r.creatorIdentity.tournamentClutches:''}</span>")
rep("if(mode==='playing'){renderHud();renderQueue(true);}","if(mode==='playing'){renderHud();renderQueue(true);renderCreatorOverlay();}")
rep("const c=$('#clock-fill');if(c)c.style.width=(engine.clock/engine.clockMax*100)+'%';", "const c=$('#clock-fill');if(c)c.style.width=(engine.clock/engine.clockMax*100)+'%';updateSignatureHud();")
rep("if(type==='shift-start'){lastRaid=false;draw();sound.start();sound.setMode(engine.world===1?'arena':engine.world===2?'market':engine.world===3?'thread':'feed');return;}", "if(type==='shift-start'){lastRaid=false;draw();sound.start();sound.setMode(creatorAudioMode());return;}")
rep("sound.setMode(engine.raid?'rush':engine.stream?'arena':engine.market?'market':engine.threaded?'thread':'feed');return;", "sound.setMode(engine.creatorId?creatorAudioMode():engine.raid?'rush':engine.stream?'arena':engine.market?'market':engine.threaded?'thread':'feed');return;")
rep("sound.setMode(engine.pulsing?'pulse':data.on?'rush':engine.stream?'arena':'feed');return;", "sound.setMode(engine.pulsing?'pulse':engine.creatorId?creatorAudioMode():data.on?'rush':engine.stream?'arena':'feed');return;")
rep("if(type==='purchase'){", "if(type==='emote-start'||type==='emote-next'){if(type==='emote-start')sound.emoteStart();renderCreatorOverlay();return;}\n if(type==='emote-answer'){data.correct?sound.emoteHit():sound.emoteBreak();splash(data.correct?(data.combo>0?'EMOTE COMBO ×'+data.combo:'ROUTED ASIDE'):'TRAIN BROKEN','success');updateSignatureHud();return;}\n if(type==='emote-milestone'){sound.milestone();splash('C-C-COMBO ×'+data.milestone+' · +'+data.bonus,'success');return;}\n if(type==='emote-end'){sound.win();renderCreatorOverlay();notify('🐸 EMOTE TRAIN COMPLETE · PEAK ×'+data.peak);return;}\n if(type==='community-momentum'){updateSignatureHud();return;}\n if(type==='community-celebration'){sound.celebration();splash('✿ COMMUNITY CELEBRATION · +'+data.bonus,'success');notify('✦ LANTERN LOUNGE IS THRIVING!');updateSignatureHud();return;}\n if(type==='tournament-break'){sound.roundBreak();renderCreatorOverlay();updateSignatureHud();notify('◆ PIXEL PIT · ROUND '+data.round+' INCOMING');return;}\n if(type==='tournament-resume'){sound.roundStart();renderCreatorOverlay();sound.setMode(creatorAudioMode());notify('◆ ROUND '+data.round+' LIVE!');return;}\n if(type==='tournament-clutch'){sound.milestone();splash('◆ MATCH CLUTCH! +'+data.bonus,'success');updateSignatureHud();return;}\n if(type==='debate-clash'){sound.milestone();splash('⚖ TWO CONTEXT CALLS · +'+data.bonus,'success');updateSignatureHud();return;}\n if(type==='purchase'){")
rep("if(c==='creators'){engine.go('creators');return;}", "if(c==='emote'){if(!paused)engine.routeEmote(button.dataset.choice);return;}if(c==='creators'){engine.go('creators');return;}")
rep("if(paused)return;const map=", "if(paused)return;if(engine.signatureActive){const keys={Digit1:'merge',KeyJ:'merge',Digit2:'route',KeyK:'route'};if(keys[e.code]){e.preventDefault();engine.routeEmote(keys[e.code]);}return;}if(engine.tournament?.breakRemaining>0)return;const map=")
# Q focus, Space freeze key are caught before signature conditional: ensure no pulse while active on engine side later.
p.write_text(s);print('patched ui',len(s))
