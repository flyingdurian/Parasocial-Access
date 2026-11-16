/* Rush Hour v0.4 — Event Circuit.
   All operations are local and deterministic for a UTC calendar day. No server, no LLM,
   no account requirement. Each event changes the actual mechanics of an existing world. */
export const EVENT_DEFS=[
 {id:'flash',world:0,level:4,icon:'⚡',title:'FLASH FLOOD',subtitle:'The timeline is moving faster than the clock.',rule:'Each post has its own readable deadline. Make a call before it expires.',accent:'#6df3d6',spotlight:['fee-trap','fake-support','gift-psa','public-reaction','scam']},
 {id:'broadcast',world:1,level:4,icon:'◉',title:'BROADCAST STORM',subtitle:'A creator goes viral and two raids overlap.',rule:'More raid airtime and faster incoming chat. Selected messages stay protected.',accent:'#f3a0d7',spotlight:['raid','stream-chat-personality','raid-deflection','targeted-threat','account-warning']},
 {id:'market-sweep',world:2,level:3,icon:'⌗',title:'CHECKOUT CRASH',subtitle:'Duplicate fraudulent storefronts have multiplied.',rule:'Three listings can share one verified scam route. Identify and clear the ring.',accent:'#f8d19b',spotlight:['fee-trap','fake-support','market-warnings','shipping-scam','seller-protest']}
];
export const dailyKey=(d=new Date())=>d.toISOString().slice(0,10);
export const eventHash=s=>{let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return h>>>0};
export const eventSeed=(day,id)=>eventHash(`FEEDFALL/EVENT-CIRCUIT/v04/${day}/${id}`);
export function currentOperations(date=new Date()){
 const day=dailyKey(date);
 return EVENT_DEFS.map((spec,i)=>({ ...spec,day,seed:eventSeed(day,spec.id),recordKey:`${day}:${spec.id}`,bonus:120+40*i }));
}
export const OPERATOR_UPGRADES=[
 {id:'coil',name:'SIGNAL CHARGE COIL',icon:'⌁',tag:'CHARGE',desc:['Every 7 correct calls charges your Focus Pulse.','Every 6 correct calls charges it.','Every 5 correct calls charges it.'],cost:[185,430,925]},
 {id:'capacitor',name:'FOCUS CAPACITOR',icon:'◎',tag:'DURATION',desc:['Focus Pulse lasts 4.5 seconds.','Focus Pulse lasts 5.5 seconds.','Focus Pulse lasts 7 seconds.'],cost:[195,460,980]}
];
