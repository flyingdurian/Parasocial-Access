/* FeedFall vibrant stylized convention hall: one source of truth for 384×216 art,
   navigation hitboxes, stage stations, interactive props and TV projection. */
export const MODULAR_VENUE_W=384;
export const MODULAR_VENUE_H=216;
export const MODULAR_STAGE=Object.freeze({
 staging:[260,72],stairs:[260,61],exchange:[285,55],debate:[219,40],floor:[260,112]
});
export const MODULAR_GATES=Object.freeze({
 left:Object.freeze({id:'left',spawn:[100,225],check:[100,183],inside:[100,144],crossing:[100,191],panel:[112,184],art:{x:85,y:156,w:42,h:60}}),
 right:Object.freeze({id:'right',spawn:[263,225],check:[263,183],inside:[263,144],crossing:[263,191],panel:[275,184],art:{x:247,y:156,w:56,h:60}})
});
export const MODULAR_TV_BOUNDS=Object.freeze({x:248,y:38,w:88,h:34});
// These projected corners align the moving feed to the four corners of the
// physical LCD in irl-stage-shell-v088c.webp, drawn at stage.bounds.
export const MODULAR_TV_PROJECTION=Object.freeze({a:.84,b:.004,c:-.01,d:.60,e:249,f:39});
export const MODULAR_PROPS=Object.freeze({
 stage:Object.freeze({x:200,y:9,w:184,h:96}),
 merch:Object.freeze({x:37,y:48,w:80,h:69,solid:{x:39,y:93,w:78,h:24}}),
 food:Object.freeze({x:119,y:48,w:79,h:70,solid:{x:120,y:94,w:78,h:24}}),
 vending:Object.freeze({x:2,y:76,w:33,h:47,solid:{x:3,y:98,w:32,h:25}}),
 photo:Object.freeze({x:321,y:109,w:61,h:62,solid:{x:331,y:132,w:52,h:39}}),
 checkin:Object.freeze({x:134,y:138,w:115,h:78,solid:{x:134,y:138,w:115,h:78}}),
 entrance:Object.freeze({x:0,y:120,w:384,h:96}),
 queueRopes:Object.freeze({x:226,y:112,w:94,h:55})
});
export const MODULAR_BLOCKERS=Object.freeze([
 {name:'north wall',x:0,y:0,w:196,h:76},
 {name:'stage and screen structure',x:200,y:0,w:184,h:98},
 {name:'stage front stairs',x:252,y:98,w:49,h:21},
 {name:'stage crowd rail',x:325,y:98,w:25,h:35},
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
 photo:{x:656,y:600,w:656,h:599}
});