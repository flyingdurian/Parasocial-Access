/* Destiny-only arcade configurations. Other creator worlds never import this. */
export const IRL_LEVELS=Object.freeze([
 Object.freeze({id:'doors',title:'Doors Open',guests:20,seconds:160,arrival:5.6,description:'Meet the first arriving fans and keep the floor orderly.'}),
 Object.freeze({id:'rush',title:'Signing Rush',guests:26,seconds:192,arrival:4.7,description:'Denser queue, faster arrivals and more verification pressure.'}),
 Object.freeze({id:'finale',title:'Final Q&A',guests:32,seconds:230,arrival:3.9,description:'A packed floor, rapid decisions and the most dangerous warnings.'})
]);
export const IRL_ENDLESS=Object.freeze({id:'endless',title:'Endless Chaos',startingGuests:10,breather:7,maxCrowd:35,maxLiveDecisions:9,safetyWarnings:3});
export const irlClampLevel=n=>Math.max(0,Math.min(IRL_LEVELS.length-1,Number.isFinite(Number(n))?Math.floor(Number(n)):0));
// A bounded exponential rise gives waves 4/6/8 meaningful additional cases
// without unbounded flood that would make the venue unwinnable by definition.
export function endlessWaveGuests(wave){return Math.min(34,Math.round(IRL_ENDLESS.startingGuests*Math.pow(1.18,Math.max(0,wave-1))));}
export function endlessArrivalInterval(wave){return Math.max(2.45,5.1-Math.max(0,wave-1)*.36);}
export function endlessLiveDecisions(wave){return Math.min(IRL_ENDLESS.maxLiveDecisions,4+Math.floor(Math.max(0,wave-1)/2));}
export function irlLevelUnlocked(record,index,dev=false){
 return index===0||dev||!!(record?.levels?.[index-1]?.stars||record?.levels?.[IRL_LEVELS[index-1].id]?.stars);
}
