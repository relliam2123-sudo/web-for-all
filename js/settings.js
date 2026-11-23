/* Web For All - js/settings.js
   Saved display preferences (theme, contrast, text size, brightness, language, motion).
   Everything stays in localStorage on this device; nothing is sent anywhere. */

const D={
  theme:'light',
  contrast:false,
  size:100,
  bright:100,
  lang:'en',
  calm:false
};
const hooks=[];

let S={...D};
let saved=null;
let open=false;

try {
  saved=localStorage.getItem('wfa');
  if(saved)S={...D,...JSON.parse(saved)}
} catch(e) {}

if(!saved) {
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)S.calm=true;
  if(matchMedia('(prefers-color-scheme:dark)').matches)S.theme='dark'
}

/* Settings */

function apply() {
  const h=document.documentElement;
  h.dataset.theme=S.theme;
  h.dataset.contrast=S.contrast?'high':'off';
  h.dataset.calm=S.calm?'on':'off';
  h.lang=S.lang==='fil'?'fil':'en';
  h.style.setProperty('--ts',S.size/100);h.style.setProperty('--tsn',Math.min(1.15,S.size/100));
  h.style.filter=S.bright==100?'':`brightness(${S.bright/100})`;
  document.body.classList.toggle('dark-mode',S.theme==='dark');
  try {
    localStorage.setItem('wfa',JSON.stringify(S))
  } catch(e) {}
}

function sync() {
  $$('[data-act=size]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===S.size));
  $$('[data-act=theme]').forEach(b=>b.setAttribute('aria-checked',S.theme==='dark'));
  $$('[data-act=contrast]').forEach(b=>b.setAttribute('aria-checked',S.contrast));
  $$('[data-act=calm]').forEach(b=>b.setAttribute('aria-checked',S.calm));
  $$('[data-act=bright]').forEach(i=>i.value=S.bright);
  $$('[data-act=lang]').forEach(s=>s.value=S.lang)
}

function toggleDarkMode() {
  act('theme')
}

function act(a,v) {
  if(a==='size')S.size=+v;
  else if(a==='theme')S.theme=S.theme==='dark'?'light':'dark';
  else if(a==='contrast')S.contrast=!S.contrast;
  else if(a==='calm')S.calm=!S.calm;
  else if(a==='bright')S.bright=+v;
  else if(a==='close')return dash(false);
  else if(a==='stop')return stopTTS();
  else if(a==='read')return toggleRead();
  else if(a==='lang'||a==='reset') {
    stopTTS();
    const w=document.activeElement.closest('#dash')?'#dash':'main';
    if(a==='reset')S={...D};
    else S.lang=v;
    apply();
    build();
    const s=$(w+' [data-act=lang]');
    return s&&s.focus()
  }
  apply();
  sync()
}

function dash(o,nf) {
  open=o;
  $('#dash').classList.toggle('open',o);
  $('.pill').setAttribute('aria-expanded',o);
  if(!nf)(o?$('#dash [data-act=size]'):$('.pill')).focus()
}