/* FeedFall vibrant stylized convention hall: one source of truth for 384×216 art,
   navigation hitboxes, stage stations, interactive props and TV projection. */
export const MODULAR_VENUE_W=384;
export const MODULAR_VENUE_H=216;
export const MODULAR_STAGE=Object.freeze({
 staging:[260,72],stairs:[260,61],exchange:[285,55],debate:[219,40],floor:[260,112]
});
export const MODULAR_GATES=Object.freeze({
 left:Object.freeze({id:'left',spawn:[85,225],check:[85,183],inside:[85,144],crossing:[85,191],panel:[86,188],art:{x:72,y:176,w:50,h:37}}),
 right:Object.freeze({id:'right',spawn:[237,225],check:[237,183],inside:[237,144],crossing:[237,191],panel:[240,188],art:{x:229,y:176,w:50,h:37}})
});
export const MODULAR_TV_BOUNDS=Object.freeze({x:262,y:21,w:75,h:45});
// These projected corners align the moving feed to the four corners of the
// physical LCD in irl-stage-shell-v088c.webp, drawn at stage.bounds.
export const MODULAR_TV_PROJECTION=Object.freeze({a:.735,b:.01,c:-.017,d:.77,e:262,f:21});
export const MODULAR_PROPS=Object.freeze({
 stage:Object.freeze({x:196,y:2,w:188,h:102}),
 merch:Object.freeze({x:14,y:48,w:90,h:69,solid:{x:14,y:93,w:88,h:24}}),
 food:Object.freeze({x:108,y:48,w:88,h:70,solid:{x:110,y:94,w:85,h:24}}),
 vending:Object.freeze({x:2,y:111,w:34,h:42,solid:{x:3,y:125,w:32,h:28}}),
 photo:Object.freeze({x:321,y:109,w:61,h:62,solid:{x:331,y:132,w:52,h:39}}),
 checkin:Object.freeze({x:135,y:164,w:94,h:49,solid:{x:140,y:164,w:89,h:52}}),
 fixedFurniture:Object.freeze({x:206,y:50,w:97,h:31})
});
export const MODULAR_BLOCKERS=Object.freeze([
 {name:'north wall',x:0,y:0,w:196,h:76},
 {name:'stage and screen structure',x:196,y:0,w:188,h:98},
 {name:'stage front stairs',x:242,y:98,w:49,h:21},
 {name:'stage crowd rail',x:320,y:98,w:28,h:35},
 {name:'stage queue left rope',x:229,y:120,w:6,h:40},
 {name:'stage queue right rope',x:300,y:120,w:6,h:40},
 ...['merch','food','vending','photo','checkin'].map(name=>({name,...MODULAR_PROPS[name].solid})),
 {name:'entrance left structural edge',x:0,y:185,w:21,h:31},
 {name:'entrance right structural edge',x:363,y:185,w:21,h:31}
]);
export const MODULAR_ATLAS=Object.freeze({
 gate:{closed:{x:0,y:0,w:896,h:512},open:{x:896,y:0,w:896,h:512}},
 planter:{left:{x:0,y:0,w:896,h:850},right:{x:896,y:0,w:896,h:850}},
 merch:{x:0,y:0,w:656,h:600},
 food:{x:656,y:0,w:656,h:600},
 vending:{x:0,y:600,w:656,h:599},
 photo:{x:656,y:600,w:656,h:599},
 debate:{x:0,y:0,w:1086,h:724},
 signing:{x:1120,y:0,w:1052,h:724}
});