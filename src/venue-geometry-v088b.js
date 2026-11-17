/* v0.8.8h unified convention plate: all static fixtures share one illustrated
   384x216 projection. These rectangles are invisible navigation/interaction
   geometry, NOT independent rendered props. */
export const MODULAR_VENUE_W=384;
export const MODULAR_VENUE_H=216;
export const MODULAR_STAGE=Object.freeze({
 staging:[253,78],stairs:[249,61],exchange:[253,44],debate:[285,32],
 autographGuest:[244,29],autographHost:[221,29],
 photoGuest:[283,27],photoHost:[259,27],floor:[185,120],tripod:[300,61]
});
export const MODULAR_GATES=Object.freeze({
 left:Object.freeze({id:'left',spawn:[92,225],check:[92,176],inside:[92,137],crossing:[92,178],panel:[92,196],art:{x:71,y:180,w:68,h:36},lane:{left:85,right:124,top:183,bottom:216}}),
 right:Object.freeze({id:'right',spawn:[266,225],check:[266,176],inside:[266,137],crossing:[266,178],panel:[266,196],art:{x:240,y:180,w:70,h:36},lane:{left:254,right:297,top:183,bottom:216}})
});
// Inside the single baked LCD bezel (screen pixels x1010..1320,y136..284).
export const MODULAR_TV_BOUNDS=Object.freeze({x:233,y:32,w:70,h:32});
export const MODULAR_TV_PROJECTION=Object.freeze({a:.70,b:0,c:0,d:.57,e:233,f:32});
export const MODULAR_PROPS=Object.freeze({
 stage:Object.freeze({x:188,y:19,w:150,h:76}),
 merch:Object.freeze({x:18,y:45,w:75,h:53,solid:{x:20,y:79,w:74,h:19}}),
  // The claw cabinet is baked into the left aisle of the unified plate.
  claw:Object.freeze({x:165,y:44,w:28,h:49,solid:{x:166,y:76,w:26,h:17}}),
 food:Object.freeze({x:94,y:44,w:71,h:53,solid:{x:95,y:80,w:70,h:17}}),
 photo:Object.freeze({x:338,y:46,w:46,h:51,solid:{x:338,y:75,w:46,h:22}}),
 checkin:Object.freeze({x:149,y:180,w:88,h:36,solid:{x:149,y:186,w:88,h:30}}),
 entrance:Object.freeze({x:0,y:167,w:384,h:49}),
 queueRopes:Object.freeze({x:233,y:94,w:54,h:12}),
 tripod:Object.freeze({x:309,y:59,w:16,h:24})
});
export const MODULAR_BLOCKERS=Object.freeze([
 {name:'north wall',x:0,y:0,w:188,h:40},
 {name:'stage truss and screen',x:188,y:0,w:150,h:72},
 {name:'solid stage riser',x:188,y:72,w:150,h:23},
 {name:'solid stage stairs',x:240,y:75,w:48,h:23},
 ...['merch','claw','food','photo','checkin'].map(name=>({name,...MODULAR_PROPS[name].solid})),
 // Entrance is one image; scan posts and side planters remain true solids.
 {name:'entrance left planter',x:0,y:185,w:70,h:31},
 {name:'left scanner outer',x:71,y:182,w:14,h:34},
 {name:'left scanner inner',x:124,y:182,w:14,h:34},
 {name:'right scanner inner',x:240,y:182,w:14,h:34},
 {name:'right scanner outer',x:297,y:182,w:14,h:34},
 {name:'entrance right planter',x:316,y:185,w:68,h:31},
 // Only the short illustrated velvet rope run at the stage's foot is solid.
 {name:'short stage velvet rope',x:233,y:98,w:54,h:5}
]);
// Retained as metadata for old tooling; no atlas props are ever drawn in v0.8.8h.
export const MODULAR_ATLAS=Object.freeze({});
