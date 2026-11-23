/* Web For All - js/speech.js
   Read aloud using the browser speechSynthesis API only: best voice, sentence queue,
   pause/resume and the .speaking highlight. */

/* Text-to-speech: browser speechSynthesis pause/resume */
const T={q:[],i:0,st:'idle',run:0,live:false,tm:0,cur:null,page:false,u:null};
let voices=[];
if('speechSynthesis' in window) {
  const loadVoices=()=> {
    voices=speechSynthesis.getVoices()
  };
  loadVoices();
  speechSynthesis.onvoiceschanged=loadVoices
}

function pickVoice() {
  const want=S.lang==='fil'?['fil-ph','tl-ph','fil','tl']:['en-us','en-gb','en'];
  const lg=v=>v.lang.toLowerCase().replace('_','-');
  const at=v=>want.findIndex(w=>lg(v)===w||lg(v).startsWith(w+'-'));
  let pool=voices.filter(v=>at(v)>-1);
  if(!navigator.onLine) {
    const local=pool.filter(v=>v.localService);
    if(local.length)pool=local
  }
  const score=v=>(want.length-at(v))*10+(/natural|neural/i.test(v.name)?8:0)+(/online/i.test(v.name)?5:0)+(/google/i.test(v.name)?4:0)+(/microsoft/i.test(v.name)?3:0);
  return pool.sort((a,b)=>score(b)-score(a))[0]||null
}

const clean=s=>s.replace(/[↗▶⏸←→↑↓↵⌫·✕◐⚠●]/g,' ').replace(/\s+/g,' ').trim();
const sents=s=>(s.match(/.+?(?:[.!?]+["”’)]*(?=\s|$)|$)/g)||[]).flatMap(x=>x.length<220?[x]:x.split(/(?<=[,;:])\s+/)).map(x=>x.trim()).filter(Boolean);
const fin=s=>/[.!?:;…]["”’)]*$/.test(s)?s:s+'.';
const rl=()=> {
  const k=T.st==='playing'?['⏸','Pause']:T.st==='paused'?['▶','Resume']:['▶','Read page'];
  return `<span aria-hidden="true">${k[0]}</span> ${t(k[1])}`
};

function ttsUI() {
  $$('[data-act=read]').forEach(b=> {
    b.innerHTML=rl()
  })
}

function mark(el) {
  $$('.speaking').forEach(x=>x.classList.remove('speaking'));
  if(el)el.classList.add('speaking')
}

function stopTTS() {
  T.run++;
  clearTimeout(T.tm);
  T.q=[];
  T.i=0;
  T.st='idle';
  T.live=false;
  T.cur=null;
  if('speechSynthesis' in window) {
    speechSynthesis.cancel();
    if(speechSynthesis.paused)speechSynthesis.resume()
  }
  mark(null);
  ttsUI()
}

function next() {
  if(T.st!=='playing')return;
  if(T.i>=T.q.length)return stopTTS();
  const it=T.q[T.i++];
  const id=T.run;
  const u=new SpeechSynthesisUtterance(it.c);
  const v=pickVoice();
  if(v)u.voice=v;
  u.lang=v?v.lang:S.lang==='fil'?'fil-PH':'en-US';
  u.rate=.94;
  u.pitch=1;
  u.volume=1;
  const done=()=> {
    if(id!==T.run)return;
    T.live=false;
    if(T.st==='playing')T.tm=setTimeout(next,180)
  };
  u.onend=done;
  u.onerror=done;
  if(it.el!==T.cur) {
    T.cur=it.el;
    mark(it.el);
    if(T.page&&it.el.scrollIntoView)it.el.scrollIntoView({block:'nearest',behavior:S.calm?'auto':'smooth'})
  }
  T.u=u;
  T.live=true;
  speechSynthesis.speak(u)
}

function go(items,page) {
  if(!('speechSynthesis' in window))return say('Speech is not supported in this browser.');
  const busy=T.st!=='idle'||speechSynthesis.speaking;
  stopTTS();
  T.q=items.flatMap(o=>sents(o.t).map(c=>({c,el:o.el})));
  if(!T.q.length)return;
  T.st='playing';
  T.page=page;
  ttsUI();
  if(busy)T.tm=setTimeout(next,60);
  else next()
}

function toggleRead() {
  if(T.st==='idle')return readPage();
  if(T.st==='playing') {
    clearTimeout(T.tm);
    T.st='paused';
    if(T.live)speechSynthesis.pause()
  } else {
    T.st='playing';
    if(T.live)speechSynthesis.resume();
    else T.tm=setTimeout(next,60)
  }
  ttsUI()
}

function readPage() {
  const els=$$('main h1,main h2,main h3,main p,main .row li,main .vals li').filter(x=>!x.closest('[aria-hidden=true],[hidden]')&&!x.matches('.eyebrow'));
  go(els.map(x=> {
    const s=clean(x.innerText);
    return s&&{t:fin(s),el:x}
  }).filter(Boolean),true)
}

function textToSpeech(id) {
  const p=document.getElementById(id);
  if(!p)return;
  const s=clean(p.innerText);
  if(s)go([{t:fin(s),el:p.closest('.card,.row')||p}],false)
}
