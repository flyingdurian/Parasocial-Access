/* v0.8.8g unified convention plate: all static fixtures share one illustrated
   384x216 projection. These rectangles are invisible navigation/interaction
   geometry, NOT independent rendered props. */
export const MODULAR_VENUE_W=384;
export const MODULAR_VENUE_H=216;
export const MODULAR_STAGE=Object.freeze({
 staging:[249,88],stairs:[249,61],exchange:[253,44],debate:[239,44],floor:[249,108]
});
export const MODULAR_GATES=Object.freeze({
 left:Object.freeze({id:'left',spawn:[102,225],check:[102,162],inside:[102,137],crossing:[102,178],panel:[102,196],art:{x:61,y:180,w:82,h:36},lane:{left:76,right:130,top:183,bottom:216}}),
 right:Object.freeze({id:'right',spawn:[281,225],check:[281,162],inside:[281,137],crossing:[281,178],panel:[281,196],art:{x:238,y:180,w:87,h:36},lane:{left:253,right:310,top:183,bottom:216}})
});
// Inside the single baked LCD bezel (screen pixels x1010..1320,y136..284).
export const MODULAR_TV_BOUNDS=Object.freeze({x:233,y:32,w:70,h:32});
export const MODULAR_TV_PROJECTION=Object.freeze({a:.70,b:0,c:0,d:.57,e:233,f:32});
export const MODULAR_PROPS=Object.freeze({
 stage:Object.freeze({x:188,y:19,w:150,h:76}),
 merch:Object.freeze({x:18,y:45,w:75,h:53,solid:{x:20,y:79,w:74,h:19}}),
 food:Object.freeze({x:94,y:44,w:71,h:53,solid:{x:95,y:80,w:70,h:17}}),
 vending:Object.freeze({x:165,y:57,w:17,h:28,solid:{x:165,y:64,w:16,h:22}}),
 photo:Object.freeze({x:338,y:46,w:46,h:51,solid:{x:338,y:75,w:46,h:22}}),
 checkin:Object.freeze({x:149,y:180,w:88,h:36,solid:{x:149,y:186,w:88,h:30}}),
 entrance:Object.freeze({x:0,y:167,w:384,h:49}),
 queueRopes:Object.freeze({x:229,y:97,w:65,h:46})
});
export const MODULAR_BLOCKERS=Object.freeze([
 {name:'north wall',x:0,y:0,w:188,h:40},
 {name:'stage truss and screen',x:188,y:0,w:150,h:72},
 {name:'solid stage riser',x:188,y:72,w:150,h:23},
 {name:'solid stage stairs',x:240,y:75,w:48,h:23},
 ...['merch','food','vending','photo','checkin'].map(name=>({name,...MODULAR_PROPS[name].solid})),
 // Entrance is one image; scan posts and side planters remain true solids.
 {name:'entrance left planter',x:0,y:185,w:59,h:31},
 {name:'left scanner outer',x:61,y:182,w:15,h:34},
 {name:'left scanner inner',x:130,y:182,w:13,h:34},
 {name:'right scanner inner',x:238,y:182,w:15,h:34},
 {name:'right scanner outer',x:310,y:182,w:14,h:34},
 {name:'entrance right planter',x:329,y:185,w:55,h:31},
 // Lightweight queue posts have foot-level collisions, not huge invisible walls.
 {name:'queue left front',x:229,y:132,w:5,h:9},
 {name:'queue right front',x:288,y:132,w:5,h:9},
 {name:'queue left middle',x:237,y:114,w:4,h:8},
 {name:'queue right middle',x:280,y:114,w:4,h:8},
 {name:'queue left rear',x:244,y:96,w:4,h:8},
 {name:'queue right rear',x:273,y:96,w:4,h:8}
]);
// Retained as metadata for old tooling; no atlas props are ever drawn in v0.8.8g.
export const MODULAR_ATLAS=Object.freeze({});
