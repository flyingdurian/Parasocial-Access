/* Explicit standalone avatar registry; embedded legacy bundles no longer supply it. */
export const AVATAR_COUNT=18;
export const FALLBACK_AVATAR='/assets/avatars/0.webp';
export function avatarPath(serial,embedded=globalThis.__RUSH_AVATARS){
 const n=Number.isFinite(Number(serial))?Math.abs(Math.trunc(Number(serial)))%AVATAR_COUNT:0;
 const external=Array.isArray(embedded)&&embedded.length?embedded[n%embedded.length]:null;
 return typeof external==='string'&&external.length?external:`/assets/avatars/${n}.webp`;
}
export function avatarError(event){
 const image=event.target;
 if(!(image instanceof HTMLImageElement)||!image.matches('.post-person img'))return;
 if(image.dataset.fallback==='done'){
  image.hidden=true;image.parentElement?.classList.add('avatar-missing');return;
 }
 image.dataset.fallback='done';image.src=FALLBACK_AVATAR;
}
