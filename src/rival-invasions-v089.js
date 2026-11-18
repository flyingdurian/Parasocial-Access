/**
 * FeedFall v0.8.9 — isolated Rival Invasions battle-engine lab.
 *
 * No imports from the v0.8.8 venue and no global side effects. The hall-to-arena
 * adapter deliberately remains unimplemented until the lead developer reviews
 * RIVAL_INVASIONS_V089.md. All dialogue and outcomes are fictional game satire.
 */

export const RIVAL_WAVES_V089 = Object.freeze([6, 10, 14, 18]);
export const BATTLE_COMMANDS_V089 = Object.freeze(['define_terms', 'show_receipts', 'read_room']);
export const BATTLE_TURNS_V089 = 6;
export const TURN_DURATION_MS_V089 = 3000;

const asset = (filename, width, height) => Object.freeze({
  path: `assets/rivals/v089/${filename}.png`, columns: 4, rows: 4, width, height,
  rowsMeaning: Object.freeze(['front walk ×4', 'back walk ×4', 'side walk ×4', 'debate reactions ×4']),
});

export const RIVALS_V089 = Object.freeze([
  Object.freeze({id:'foodshops', name:'Foodshops', dynamic:'friend-competitive',
    signature:'Receipt Avalanche', sigCommand:'show_receipts', maxHp:112, pressure:1,
    color:'#f7bb63', asset:asset('foodshops',1263,1246),
    personality:'Rapid-fire evidence; playful history, serious onstage counters.'}),
  Object.freeze({id:'jordan-peterson', name:'Jordan Peterson', dynamic:'ideological-adversary',
    signature:'Infinite Premise', sigCommand:'define_terms', maxHp:118, pressure:2,
    color:'#e3bd76', asset:asset('jordan-peterson',1263,1246),
    personality:'Layered philosophical premises and definitions; deliberate cadence.'}),
  Object.freeze({id:'ben-shapiro', name:'Ben Shapiro', dynamic:'ideological-adversary',
    signature:'Premise Blitz', sigCommand:'define_terms', maxHp:116, pressure:2,
    color:'#90abdf', asset:asset('ben-shapiro',1159,1358),
    personality:'Fast claim chains; a narrow timing window under verbal pressure.'}),
  Object.freeze({id:'dan-saltman', name:'Dan Saltman', dynamic:'friend-competitive',
    signature:'Sarcasm Ricochet', sigCommand:'read_room', maxHp:110, pressure:1,
    color:'#a1e2cf', asset:asset('dan-saltman',1278,1230),
    personality:'Dry wit and momentum reversals; a familiar sparring partner.'}),
  Object.freeze({id:'hasan-piker', name:'Hasan Piker', dynamic:'scorched-earth',
    signature:'Audience Surge', sigCommand:'read_room', maxHp:142, pressure:4,
    color:'#f66b83', asset:asset('hasan-piker',1536,1024),
    personality:'Maximum crowd pressure and lasting ideological hostility; no buddy framing.'}),
  Object.freeze({id:'mrmouton', name:'MrMouton', dynamic:'friend-competitive',
    signature:'Friendly Tangent', sigCommand:'show_receipts', maxHp:108, pressure:1,
    color:'#c9b6fd', asset:asset('mrmouton',1261,1247),
    personality:'Familiar in-jokes that bait a tangent; friendly offstage, competitive here.'}),
]);

export const RIVAL_BY_ID_V089 = Object.freeze(Object.fromEntries(RIVALS_V089.map(r=>[r.id,r])));

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const nonnegativeInt = x => Number.isInteger(x) && x >= 0;

/** One invasion at most per listed wave, never repeat the same visitor in one run. */
export function pickRivalInvasionV089({wave, seed=0, seenIds=[]}={}) {
  if (!RIVAL_WAVES_V089.includes(wave)) return null;
  if (!nonnegativeInt(seed) || !Array.isArray(seenIds)) throw new TypeError('Invalid invasion seed/history');
  const pool = RIVALS_V089.filter(r=>!seenIds.includes(r.id));
  if (!pool.length) return null;
  // A rotating campaign order across runs, with Hasan more likely in the
  // last wave but not guaranteed. There is no identity-based threat mechanic.
  const preferred = wave===18 && pool.find(r=>r.id==='hasan-piker');
  return preferred || pool[(seed + Math.floor(wave/4)) % pool.length];
}

/** Serializable pure-state constructor. Status 'vs' is the dramatic intro. */
export function createRivalBattleV089({rivalId, seed=0, mode='relaxed'}={}) {
  const rival = RIVAL_BY_ID_V089[rivalId];
  if (!rival) throw new RangeError(`Unknown v0.8.9 rival: ${rivalId}`);
  if (!['relaxed','expert'].includes(mode)) throw new RangeError('mode must be relaxed or expert');
  if (!nonnegativeInt(seed)) throw new TypeError('Seed must be a nonnegative integer');
  return {
    version:'v089-lab', rivalId, seed, mode, status:'vs', turn:0,
    destinyHp:100, destinyMaxHp:100, rivalHp:rival.maxHp, rivalMaxHp:rival.maxHp,
    meter:0, combo:0, elapsedMs:0, result:null, history:[],
  };
}

export function enterRivalArenaV089(battle) {
  if (battle?.status!=='vs') throw new Error('VS introduction must precede combat');
  return {...battle,status:'active'};
}

/** Telegraph expected response; relaxed mode surfaces the answer explicitly. */
export function getRivalCueV089(battle) {
  if (battle?.status!=='active') return null;
  const rival=RIVAL_BY_ID_V089[battle.rivalId];
  const isSignature=battle.turn===3;
  const command=isSignature?rival.sigCommand:
    BATTLE_COMMANDS_V089[(battle.turn+battle.seed%3+RIVALS_V089.indexOf(rival))%3];
  const cueNames={define_terms:'DEFINITION SHIFT',show_receipts:'SOURCE CHALLENGE',read_room:'CROWD SWING'};
  return {
    turn:battle.turn, label:isSignature?rival.signature.toUpperCase():cueNames[command],
    isSignature, counter:command, telegraph:batchTelegraph(command,isSignature),
    windowMs:battle.mode==='relaxed'?1500:960,
    revealCounter:battle.mode==='relaxed', durationMs:TURN_DURATION_MS_V089,
  };
}

function batchTelegraph(command,signature) {
  const icon={define_terms:'◆',show_receipts:'▤',read_room:'◉'}[command];
  return `${icon} ${signature?'SIGNATURE ATTACK':'DEBATE CUE'}`;
}

/**
 * Submit exactly one QTE beat. timingMs is elapsed from cue becoming active;
 * no language model or factual trivia adjudicates the hit.
 * 'special' costs 60 meter and can be used as the action for one beat.
 */
export function resolveRivalTurnV089(battle, {command, timingMs}={}) {
  const cue=getRivalCueV089(battle);
  if (!cue) throw new Error('Battle is not active');
  if (![...BATTLE_COMMANDS_V089,'special'].includes(command)) throw new RangeError('Unknown command');
  if (!Number.isFinite(timingMs)||timingMs<0||timingMs>TURN_DURATION_MS_V089)
    throw new RangeError('timingMs must be within the current 3-second beat');

  const rival=RIVAL_BY_ID_V089[battle.rivalId];
  const special=command==='special'&&battle.meter>=60;
  const timed=timingMs<=cue.windowMs;
  const hit=timed&&(command===cue.counter||special);
  const perfect=hit&&timingMs<=cue.windowMs*.42;
  const combo=hit?battle.combo+1:0;
  const dealt=hit?(special?37:24)+(perfect?5:0)+Math.min(5,combo-1):0;
  const taken=hit?Math.max(1,5+rival.pressure-2*(perfect?1:0)):
    15+rival.pressure*2+(cue.isSignature?6:0);
  const meter=special?clamp(battle.meter-60,0,100):
    clamp(battle.meter+(hit?(perfect?19:15):5),0,100);
  const destinyHp=clamp(battle.destinyHp-taken,0,battle.destinyMaxHp);
  const rivalHp=clamp(battle.rivalHp-dealt,0,battle.rivalMaxHp);
  const turn=battle.turn+1;
  let status='active', result=null;
  if (destinyHp===0 || rivalHp===0 || turn>=BATTLE_TURNS_V089) {
    // No coin toss: objective HP fractions decide a six-beat time-up.
    // A simultaneous knockout is not a free win for Destiny. If both actors
    // hit zero, the player loses the exchange (no ambiguous double reward).
    const won=destinyHp>0 && (rivalHp===0 ||
      destinyHp/battle.destinyMaxHp > rivalHp/battle.rivalMaxHp);
    status='result';result=won?'victory':'defeat';
  }
  const history=[...battle.history,{turn:battle.turn,command,expected:cue.counter,
    isSignature:cue.isSignature,timingMs,hit,perfect,special,dealt,taken}];
  return {...battle,turn,combo,meter,destinyHp,rivalHp,status,result,
    elapsedMs:turn*TURN_DURATION_MS_V089,history};
}

/** Formal return handshake; venue adapter owns snapshot/unfreeze semantics. */
export function leaveRivalArenaV089(battle) {
  if (battle?.status!=='result') throw new Error('Cannot return to hall before result');
  return {...battle,status:'returned'};
}
