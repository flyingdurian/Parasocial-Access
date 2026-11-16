/* FeedFall vibrant stylized convention hall: one source of truth for 384×216 art,
   navigation hitboxes, stage stations, interactive props and TV projection. */
export const MODULAR_VENUE_W=384;
export const MODULAR_VENUE_H=216;
export const MODULAR_STAGE=Object.freeze({
 staging:[260,72],stairs:[260,61],exchange:[285,55],debate:[219,40],floor:[260,103]
});
export const MODULAR_GATES=Object.freeze({
 left:Object.freeze({id:'left',spawn:[95,225],check:[95,162],inside:[95,137],crossing:[95,174],panel:[108,194],art:{x:74,y:184,w:69,h:32}}),
 right:Object.freeze({id:'right',spawn:[260,225],check:[260,162],inside:[260,137],crossing:[260,174],panel:[273,194],art:{x:240,y:184,w:70,h:32}})
});
export const MODULAR_TV_BOUNDS=Object.freeze({x:272,y:28,w:66,h:28});
// These projected corners align the moving feed to the four corners of the
// physical LCD in irl-stage-shell-v088f.webp, drawn at stage.bounds.
export const MODULAR_TV_PROJECTION=Object.freeze({a:.63,b:.015,c:-.008,d:.43,e:273,f:29});
export const MODULAR_PROPS=Object.freeze({
 stage:Object.freeze({x:200,y:9,w:184,h:90}),
 merch:Object.freeze({x:13,y:43,w:79,h:58,solid:{x:16,y:81,w:76,h:20}}),
 food:Object.freeze({x:100,y:45,w:79,h:58,solid:{x:101,y:84,w:77,h:19}}),
 vending:Object.freeze({x:2,y:89,w:25,h:36,solid:{x:3,y:100,w:24,h:25}}),
 photo:Object.freeze({x:335,y:94,w:48,h:49,solid:{x:343,y:114,w:40,h:29}}),
 checkin:Object.freeze({x:150,y:184,w:84,h:32,solid:{x:150,y:186,w:84,h:30}}),
 entrance:Object.freeze({x:0,y:148,w:384,h:68}),
 queueRopes:Object.freeze({x:226,y:97,w:94,h:57})
});
export const MODULAR_BLOCKERS=Object.freeze([
 {name:'north wall',x:0,y:0,w:196,h:53},
 {name:'stage and screen structure',x:200,y:0,w:184,h:83},
 {name:'stage front riser',x:200,y:83,w:184,h:8},
 {name:'stage front stairs',x:250,y:88,w:55,h:15},
 ...['merch','food','vending','photo','checkin'].map(name=>({name,...MODULAR_PROPS[name].solid})),
 // A continuous low-height barrier; explicit post colliders are aligned to the
 // fixed four scanner pillars in irl-entrance-v088f.webp.
 {name:'entrance left planter and fence',x:0,y:186,w:74,h:30},
 {name:'entrance first scanner',x:74,y:184,w:14,h:32},
 {name:'entrance second scanner',x:130,y:184,w:14,h:32},
 {name:'entrance third scanner',x:240,y:184,w:13,h:32},
 {name:'entrance fourth scanner',x:298,y:184,w:13,h:32},
 {name:'entrance right planter and fence',x:311,y:186,w:73,h:30}
]);
export const MODULAR_ATLAS=Object.freeze({
 gate:{closed:{x:0,y:0,w:896,h:512},open:{x:896,y:0,w:896,h:512}},
 planter:{left:{x:0,y:0,w:896,h:850},right:{x:896,y:0,w:896,h:850}},
 merch:{x:0,y:0,w:656,h:600},
 food:{x:656,y:0,w:656,h:600},
 vending:{x:0,y:600,w:656,h:599},
 photo:{x:656,y:600,w:656,h:599}
});