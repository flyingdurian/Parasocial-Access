import assert from 'node:assert/strict';

const kv=new Map();
globalThis.localStorage={getItem:k=>kv.get(k)??null,setItem:(k,v)=>kv.set(k,v),removeItem:k=>kv.delete(k)};
const {RushEngine}=await import('../src/engine.js');
let n=0;const ok=(condition,description)=>{assert.ok(condition,description);n++;};

// Regression: at peak Open Feed level 5, overflow evicted the first card but
// left focus pointing at its dead ID. The action bar then produced "message
// already expired" forever while the game clock and overflow kept running.
for(let attempt=0;attempt<30;attempt++){
 kv.clear();
 const e=new RushEngine();e.devUnlockAll();
 ok(e.start(0,4,158400+attempt),'Open Feed level 5 starts');
 const original=e.focus;
 while(e.queue.length<e.capacity)e.spawn();
 e.spawn(); // force one buffer overflow and evict the old focused card
 ok(e.queue.length===e.capacity,'overflow retains capacity');
 ok(!e.queue.some(card=>card.id===original),'old primary was evicted');
 ok(e.focus===e.queue[0].id,'primary stays attached to a live card');
 const before=e.handled;
 const result=e.answer(e.queue[0].verdict,e.focus);
 ok(result!==null,'first action after overflow is accepted');
 ok(e.handled===before+1,'the shift advances after overflow');
}

// A pointerdown snapshot targeting a genuinely expired ID must still be
// rejected, because applying its verdict to a different post is unsafe.
// If corrupt historical state points focus at that ID, repair focus immediately.
{
 kv.clear();const e=new RushEngine();e.devUnlockAll();e.start(0,4,50001);
 const stale=e.focus;while(e.queue.length<e.capacity)e.spawn();e.spawn();
 ok(e.answer(e.queue[0].verdict,stale)===null,'stale Open Feed ID is not silently applied to another post');
 e.focus=stale;
 ok(e.answer(e.queue[0].verdict,stale)===null,'corrupted old focus returns no judgment');
 ok(e.focus===e.queue[0].id,'stale focus self-heals on attempted action');
 ok(e.answer(e.queue[0].verdict,e.focus)!==null,'next action works against restored live focus');
}
{
 kv.clear();const e=new RushEngine();e.devUnlockAll();e.start(1,4,50002);
 ok(e.answer('approve','no-such-chat-id')===null,'Live Arena explicitly stale ID is rejected');
}

console.log('FOCUS/OVERFLOW v0.8 GREEN:',n,'checks / 30 peak-traffic seeds');
