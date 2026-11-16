import assert from 'node:assert/strict';

const store=new Map();
globalThis.localStorage={
 getItem:key=>store.get(key)??null,
 setItem:(key,value)=>store.set(key,String(value)),
 removeItem:key=>store.delete(key)
};
const {RushEngine,WORLD_DEFS,SAVE_KEY,DEV_KEY,SAVE_BACKUP_KEY}=await import('../src/engine.js');
let checks=0;
function ok(value,label){assert.ok(value,label);checks++;}

const initial=new RushEngine();
ok(initial.maxUnlocked()===0,'baseline campaign starts at Open Feed');
ok(initial.levelUnlocked(0,0),'first level available');
ok(!initial.levelUnlocked(1,1),'Arena advanced level not available');
ok(initial.levelAccess(1)===-1,'locked world has no accessible levels');
ok(initial.creatorEvents('destiny').some(e=>e.locked),'creator chapters naturally gated');
ok(!initial.devGrantCredits(20000),'arbitrary credit injections rejected');

ok(initial.devUnlockNext(1),'unlock first Arena level');
ok(initial.levelUnlocked(1,0),'first Arena level now accessible');
ok(!initial.levelUnlocked(1,1),'further Arena levels remain gated');
ok(initial.devUnlockNext(1),'unlock second Arena level');
ok(initial.levelUnlocked(1,1),'individual advanced Arena unlock accessible');
ok(!initial.levelUnlocked(1,2),'third Arena level remains gated');
ok(initial.maxUnlocked()===1,'world access reflects tester override');
ok(initial.progress.worlds[1].unlocked===0,'real campaign progress not changed');
ok(initial.progress.worlds[1].stars.every(s=>s===0),'no artificial stars');
ok(initial.progress.worlds.every(w=>Object.keys(w.upgrades).length===0),'no world upgrades');
ok(initial.progress.credits===0,'no automatic currency');

initial.devUnlockCreators();
ok(initial.creatorEvents('destiny').every(e=>!e.locked),'all Destiny chapters opened');
ok(initial.creatorEvents('nova').every(e=>!e.locked),'all Nova chapters opened');
ok(initial.creatorEvents('glitch').every(e=>!e.locked),'all Glitch chapters opened');
ok(initial.creatorState('destiny').xp===0,'creator XP not artificially raised');
ok(Object.keys(initial.creatorState('destiny').records).length===0,'creator chapters not marked cleared');
const gated=initial.creatorEvents('destiny').find(e=>e.index>0);
ok(initial.startCreatorEvent(gated.id),'dev-only creator run passes normal chapter gates');
ok(initial.activeCreatorEvent?.id===gated.id,'intended chapter launched');

initial.go('home');
initial.devUnlockAll();
ok(WORLD_DEFS.every((w,i)=>initial.levelUnlocked(i,w.levels-1)),'all nineteen levels unlocked');
ok(initial.maxUnlocked()===3,'all four worlds now available');
ok(initial.progress.worlds.every(w=>Object.keys(w.upgrades).length===0),'all gear still untouched');
ok(initial.progress.mastery.length===0,'no mastery awards simulated');
ok(initial.progress.credits===0,'no free upgrades or credits awarded');
ok(initial.devGrantCredits(1000),'optional test-credit grant available');
ok(initial.progress.credits===1000,'test credits added only on request');

const backup=initial.exportSave();
ok(JSON.parse(backup).kind==='feedfall-rush-save','backup has schema marker');
const onOtherOrigin=new RushEngine();
onOtherOrigin.devClear();
onOtherOrigin.progress.credits=19;
onOtherOrigin.save();
onOtherOrigin.importSave(backup);
ok(onOtherOrigin.progress.credits===1000,'portable save restores credits');
ok(onOtherOrigin.levelUnlocked(3,4),'portable save restores developer access');
ok(store.has(SAVE_BACKUP_KEY),'replaced save has local backup');
ok(store.has(SAVE_KEY)&&store.has(DEV_KEY),'both kinds of save persisted');
const priorCredits=onOtherOrigin.progress.credits;
assert.throws(()=>onOtherOrigin.importSave('{not-json'),SyntaxError);checks++;
assert.throws(()=>onOtherOrigin.importSave('{"kind":"feedfall-rush-save","schema":1}'),/compatible/);checks++;
ok(onOtherOrigin.progress.credits===priorCredits,'failed imports do not mutate the save');
onOtherOrigin.devClear();
ok(onOtherOrigin.maxUnlocked()===0,'developer access can be switched off');
ok(!store.has(DEV_KEY),'developer override removed from storage');
ok(onOtherOrigin.progress.credits===1000,'test credits remain an intentional save change');
ok(onOtherOrigin.progress.worlds.every(w=>w.stars.every(s=>s===0)),'genuine stars still untouched');

console.log('v0.7.1 DEBUG & SAVE TRANSFER GREEN:',checks,'checks');
