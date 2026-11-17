/* Optional developer graphics controls: G shortcut, and a mobile tap target. */
export function createGraphicsPanel(initial,onChange){
 const shell=document.createElement('div');
 shell.id='irl-graphics-shell';
 shell.innerHTML=[
  '<button type="button" id="irl-graphics-mute-trigger" title="Mute just the ambient dialogue bleeps">◖)) CHAT</button>',
  '<button type="button" id="irl-graphics-trigger" aria-keyshortcuts="G" title="Graphics & scaling (G)">⚙ GRAPHICS · G</button>',
  '<aside id="irl-graphics-panel" aria-label="Graphics and scaling debug panel" hidden>',
   '<div class="irl-graphics-head"><strong>GRAPHICS / SCALING</strong><button type="button" id="irl-graphics-close" aria-label="Close graphics panel">✕</button></div>',
   '<p>Compare rendering modes live. Your selection is saved separately from game progress.</p>',
   '<label for="irl-graphics-mode">Texture interpolation</label>',
   '<select id="irl-graphics-mode"><option value="bilinear">Bilinear · smooth</option><option value="nearest">Nearest-neighbor · pixel art</option></select>',
   '<label for="irl-graphics-strength">Pixelation strength <output id="irl-graphics-strength-value"></output></label>',
   '<input id="irl-graphics-strength" type="range" min="0" max="100" step="5">',
   '<div class="irl-graphics-scale">0% = maximum source detail · 100% = original 384×216 raster</div>',
   '<label for="irl-graphics-texture">Optional stylistic filter</label>',
   '<select id="irl-graphics-texture"><option value="off">Off · clean image</option><option value="dither">Soft grain / dithering</option><option value="chromatic">Chromatic edge glow</option></select>',
   '<label for="irl-graphics-texture-strength">Filter intensity <output id="irl-graphics-texture-value"></output></label>',
   '<input id="irl-graphics-texture-strength" type="range" min="0" max="100" step="5">',
   '<label class="irl-graphics-checkbox"><input type="checkbox" id="irl-graphics-crt"> Curved CRT lens · corner vignette and scanlines</label>',
   '<label class="irl-graphics-checkbox"><input type="checkbox" id="irl-graphics-speech"> Mute ambient chatter bleeps only</label>',
   '<label class="irl-graphics-checkbox"><input type="checkbox" id="irl-graphics-chaos"> Chaos Mode: layered queued decision prompts</label>',
   '<label class="irl-graphics-checkbox"><input type="checkbox" id="irl-graphics-nav"> Show walkability/collision grid</label>',
   '<button type="button" id="irl-graphics-reset">Restore recommended defaults</button>',
  '</aside>'
 ].join('');
 let settings={...initial},open=false,active=false;
 const panel=shell.querySelector('#irl-graphics-panel');
 function sync(){
  shell.querySelector('#irl-graphics-mode').value=settings.mode;
  shell.querySelector('#irl-graphics-strength').value=String(settings.pixelStrength);
  shell.querySelector('#irl-graphics-strength-value').textContent=settings.pixelStrength+'%';
  shell.querySelector('#irl-graphics-nav').checked=settings.showNav;
  shell.querySelector('#irl-graphics-texture').value=settings.texture;
  shell.querySelector('#irl-graphics-texture-strength').value=String(settings.textureStrength);
  shell.querySelector('#irl-graphics-texture-value').textContent=settings.textureStrength+'%';
  shell.querySelector('#irl-graphics-chaos').checked=settings.chaos;
  shell.querySelector('#irl-graphics-crt').checked=settings.crt;
  shell.querySelector('#irl-graphics-speech').checked=settings.chatterMuted;
  const mute=shell.querySelector('#irl-graphics-mute-trigger');mute.textContent=settings.chatterMuted?'◖× CHAT MUTED':'◖)) CHAT SOUND';mute.setAttribute('aria-pressed',String(settings.chatterMuted));
  panel.hidden=!open||!active;
  shell.hidden=!active;
 }
 function update(patch){settings={...settings,...patch};onChange(settings);sync();}
 function toggle(next=!open){open=next;sync();}
 shell.querySelector('#irl-graphics-trigger').addEventListener('click',()=>toggle());
 shell.querySelector('#irl-graphics-mute-trigger').addEventListener('click',()=>update({chatterMuted:!settings.chatterMuted}));
 shell.querySelector('#irl-graphics-close').addEventListener('click',()=>toggle(false));
 shell.querySelector('#irl-graphics-reset').addEventListener('click',()=>update({mode:'bilinear',pixelStrength:35,showNav:false,texture:'off',textureStrength:25,chaos:true,crt:false,chatterMuted:false}));
 shell.querySelector('#irl-graphics-mode').addEventListener('change',event=>update({mode:event.target.value}));
 shell.querySelector('#irl-graphics-strength').addEventListener('input',event=>update({pixelStrength:Number(event.target.value)}));
 shell.querySelector('#irl-graphics-nav').addEventListener('change',event=>update({showNav:event.target.checked}));
 shell.querySelector('#irl-graphics-texture').addEventListener('change',event=>update({texture:event.target.value}));
 shell.querySelector('#irl-graphics-texture-strength').addEventListener('input',event=>update({textureStrength:Number(event.target.value)}));
 shell.querySelector('#irl-graphics-chaos').addEventListener('change',event=>update({chaos:event.target.checked}));
 shell.querySelector('#irl-graphics-crt').addEventListener('change',event=>update({crt:event.target.checked}));
 shell.querySelector('#irl-graphics-speech').addEventListener('change',event=>update({chatterMuted:event.target.checked}));
 document.addEventListener('keydown',event=>{
  if(!active||event.altKey||event.metaKey||event.ctrlKey||event.target.closest('input,textarea,select'))return;
  if(event.code==='KeyG'&&!event.repeat){event.preventDefault();toggle();}
  if(event.code==='Escape'&&open){event.preventDefault();toggle(false);}
 });
 sync();
 return {element:shell,setActive(value){active=!!value;if(!active)open=false;sync();},setSettings(value){settings={...value};sync();}};
}
