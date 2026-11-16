import test from 'node:test';
import assert from 'node:assert/strict';
import {
 createBubbleLayout,bubbleRectsOverlap,wrapMeasuredText,
 drawQueuedDecisionBubble,drawAmbientBubble,reserveCanvasOverlay
} from '../src/irl-atmosphere-v083.js';
import {drawVenueScreens,drawStageConversation,VENUE_LED_SCREEN} from '../src/venue-effects-v086.js';

function mockCanvas(){
 const stack=[],drawn=[];
 const ctx={
  textAlign:'left',textBaseline:'alphabetic',font:'7px sans-serif',globalAlpha:1,
  get depth(){return stack.length;},drawn,
  save(){stack.push({textAlign:this.textAlign,textBaseline:this.textBaseline,font:this.font,globalAlpha:this.globalAlpha});},
  restore(){assert(stack.length>0,'Canvas restore without a paired save');Object.assign(this,stack.pop());},
  measureText(value){return {width:[...String(value)].length*4};},
  createLinearGradient(){return {addColorStop(){}};},
  beginPath(){},rect(){},clip(){},fillRect(){},strokeRect(){},
  fillText(value,x,y,maxWidth){drawn.push({value:String(value),x,y,maxWidth});},
  strokeText(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){},
  drawImage(){},translate(){},scale(){}
 };
 return ctx;
}

test('all LED and secondary screens preserve their caller canvas alignment and save stack',()=>{
 const ctx=mockCanvas();
 drawVenueScreens(ctx,{tvEvent:null},0,{});
 assert.equal(ctx.textAlign,'left');
 assert.equal(ctx.textBaseline,'alphabetic');
 assert.equal(ctx.depth,0);
});

test('measured stage and ambient text fit their target box without changing caller text alignment',()=>{
 const ctx=mockCanvas();
 const lines=wrapMeasuredText(ctx,'OneUnbrokenRidiculouslyLongToken plus several more words',45,3);
 assert(lines.length<=3);
 assert(lines.every(line=>ctx.measureText(line).width<=45));
 const layout=createBubbleLayout([VENUE_LED_SCREEN]);
 const guest={
  stageVisit:'exchange',name:'Test Debater',x:260,y:55,
  exchangeClock:4,exchangeDuration:5,
  debater:true,debateTopic:{
   critic:['My footnotes and comparison tables require a closer reading.','I disagree.'],
   destiny:['Please show the underlying source.','What is your conclusion?']
  }
 };
 const result=drawStageConversation(ctx,{departures:[guest],hostX:275,hostY:55},layout);
 assert(result,'stage bubble should find an available location');
 assert(!bubbleRectsOverlap(result,VENUE_LED_SCREEN));
 assert.equal(ctx.textAlign,'left');
 assert.equal(ctx.depth,0);
 const ambient=drawAmbientBubble(ctx,'This is a deliberately overlong ambient greeting'.repeat(3),115,155,1,150,layout);
 if(ambient)assert(!bubbleRectsOverlap(ambient,result));
 assert.equal(ctx.depth,0);
});

test('queued bubbles occupy distinct onscreen positions and reserve the selected guest panel',()=>{
 const layout=createBubbleLayout([VENUE_LED_SCREEN]);
 const primary={x:255,y:75,w:118,h:42};layout.reserve(primary);
 const ctx=mockCanvas();
 const proposals=[
  drawQueuedDecisionBubble(ctx,'My ticket says my place in line is already confirmed.',60,179,0,'check',layout),
  drawQueuedDecisionBubble(ctx,'The panel should consider this second response.',180,180,1,'debate',layout),
  drawQueuedDecisionBubble(ctx,'Could you redirect me to the merch counter?',315,185,2,'redirect',layout)
 ].filter(Boolean);
 assert(proposals.length>=2);
 for(let i=0;i<proposals.length;i++){
  assert(proposals[i].x>=0&&proposals[i].y>=0);
  assert(proposals[i].x+proposals[i].w<=384);
  assert(proposals[i].y+proposals[i].h<=216);
  assert(!bubbleRectsOverlap(proposals[i],primary));
  for(let j=0;j<i;j++)assert(!bubbleRectsOverlap(proposals[i],proposals[j]));
 }
 assert.equal(ctx.depth,0);
});

test('DOM speech reserve correctly maps cropped canvas coordinates to world space',()=>{
 const layout=createBubbleLayout();
 const canvas={getBoundingClientRect:()=>({left:-60,top:40,width:768,height:432})};
 const bubble={hidden:false,getBoundingClientRect:()=>({left:324,top:148,width:192,height:108})};
 const rect=reserveCanvasOverlay(layout,canvas,bubble);
 assert.deepEqual(rect,{x:192,y:54,w:96,h:54});
 assert.equal(layout.occupied.length,1);
});
