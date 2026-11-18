import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {findAtlasBleedIslands} from '../src/sprite-animation.js';
import {captureLiveAudienceFrontFrame} from '../src/venue-rig-v088b.js';

test('source-frame audit detects old feet above a new head without erasing the new head',()=>{
 const w=1536,h=1024,rgba=new Uint8ClampedArray(w*h*4);
 const rect=(x,y,ww,hh)=>{
  for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)rgba[(yy*w+xx)*4+3]=255;
 };
 // Main actor: same cell, hair legitimately begins 12 pixels below its top.
 rect(30,256+12,125,190);
 // Previous row's boot: large, opaque and disconnected from the new head.
 rect(180,256,42,23);
 const islands=findAtlasBleedIslands(rgba,w,h,6,4,'set-c-rear');
 assert.equal(islands.length,1);
 assert.deepEqual([islands[0].row,islands[0].col,islands[0].area],[1,0,966]);
 assert.equal(islands[0].minY,0);
 assert.equal(islands[0].maxY,22);
});

test('source-frame audit catches lateral leakage from the next cast column',()=>{
 const w=1536,h=1024,rgba=new Uint8ClampedArray(w*h*4);
 for(let y=112;y<144;y++)for(let x=2*256+247;x<2*256+256;x++)rgba[(y*w+x)*4+3]=255;
 const islands=findAtlasBleedIslands(rgba,w,h,6,4,'set-b-walk');
 assert.equal(islands.length,1);
 assert.equal(islands[0].area,288);
 assert.equal(findAtlasBleedIslands(rgba,w,h,6,4,'set-c-rear').length,0);
});

test('stage-front broadcast renders current animated fans as large frontal close-ups',()=>{
 const calls=[];
 const context={
  calls,save(){},restore(){},fillRect(){},createLinearGradient(){return {addColorStop(){}};},
  drawImage(...args){calls.push(args);},translate(){},scale(){},
 };
 const frame={width:176,height:78,getContext(){return context;}};
 const image={naturalWidth:1536,naturalHeight:1024,complete:true};
 const crowd=Array.from({length:9},(_,i)=>({kind:36+i%6,x:200+i*12,y:120,debateWatching:true,debateArrived:true,animation:'cheer'}));
 assert(captureLiveAudienceFrontFrame(frame,{crowd},{cast:image,cosplay:{react:image}},6900));
 assert.equal(frame.width,376);
 assert.equal(frame.height,128);
 assert(calls.length>=10);
 assert(calls.some(args=>args.at(-1)===154),'foreground fans must have readable close-up proportions');
});

test('debate prelude reserves a shallow banner and draws complete portraits below it',()=>{
 const rig=readFileSync('src/venue-rig-v088b.js','utf8');
 assert(rig.includes("ctx.fillText('DEBATE STARTING SOON',50,12.5,70)"));
 assert(rig.includes('ctx.rect(7,15,86,33)'));
 assert(!rig.includes('ctx.rect(7,28,86,18)'));
});
