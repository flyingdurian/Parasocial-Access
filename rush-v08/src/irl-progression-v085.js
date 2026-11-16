/* Destiny-only arcade configurations. Other creator worlds never import this. */
export const IRL_LEVELS=Object.freeze([
 Object.freeze({id:'doors',title:'Doors Open',guests:20,seconds:160,arrival:5.6,description:'Meet the first arriving fans and keep the floor orderly.'}),
 Object.freeze({id:'rush',title:'Signing Rush',guests:26,seconds:192,arrival:4.7,description:'Denser queue, faster arrivals and more verification pressure.'}),
 Object.freeze({id:'finale',title:'Final Q&A',guests:32,seconds:230,arrival:3.9,description:'A packed floor, rapid decisions and the most dangerous warnings.'})
]);
export const IRL_ENDLESS=Object.freeze({id:'endless',title:'Endless Chaos',startingGuests:9,breather:7,maxCrowd:35});
export const irlClampLevel=n=>Math.max(0,Math.min(IRL_LEVELS.length-1,Number.isFinite(Number(n))?Math.floor(Number(n)):0));
export function endlessWaveGuests(wave){return Math.min(19,IRL_ENDLESS.startingGuests+Math.max(0,wave-1)*2);}
export function endlessArrivalInterval(wave){return Math.max(2.15,5.1-Math.max(0,wave-1)*.42);}
export function irlLevelUnlocked(record,index,dev=false){
 return index===0||dev||!!(record?.levels?.[index-1]?.stars||record?.levels?.[IRL_LEVELS[index-1].id]?.stars);
}
