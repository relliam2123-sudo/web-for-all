/* Web For All - js/layout.js
   Shared page chrome: navbar, footer, settings dashboard, section tracker, illustrations,
   Read aloud buttons, Filipino text swap and scroll reveal. */

let spy=null;

/* Shared page chrome: navbar, footer, settings dashboard, section tracker */

function panel() {
  const r=(k,d,c)=>`<div class="set"><div><b>${t(k)}</b><small>${t(d)}</small></div>${c}</div>`;
  const sw=(a,k)=>`<button class="sw" role="switch" data-act="${a}" aria-label="${t(k)}"></button>`;
  return r('Text size','Make words easier to read',`<div class="seg" role="group" aria-label="${t('Text size')}">${[90,100,115,130].map((v,i)=>`<button data-act="size" data-v="${v}" aria-label="${t('Text size')} ${v}%">${['A-','A','A+','A++'][i]}</button>`).join('')}</div>`) +r('Dark mode','Easier on the eyes',sw('theme','Dark mode')) +r('High contrast','Clearer colors and borders',sw('contrast','High contrast')) +r('Brightness','Adjust page brightness',`<input type="range" min="70" max="110" step="5" data-act="bright" aria-label="${t('Brightness')}">`) +r('Language','Choose your preferred language',`<select data-act="lang" aria-label="${t('Language')}"><option value="en">English</option><option value="fil">Filipino</option></select>`) +r('Reduce motion','Turn off animations',sw('calm','Reduce motion')) +r('Read aloud','Listen to page content',`<div class="seg"><button data-act="read">${rl()}</button><button data-act="stop">${t('Stop')}</button></div>`) +`<div class="set"><button class="link" data-act="reset">${t('Reset settings')}</button></div>`
}

const ill=k=>({
  hero:`<div class="bar"><i></i><i></i><i></i><span>${t('access for everyone')}</span></div><div class="ppl"><i></i><i></i></div><span class="chip c-a">${t('Keyboard friendly')}</span><span class="chip c-b">${t('Clear and readable')}</span><p class="note"><b>${t('Inclusive by design')}</b><span>${t('Everyone belongs online.')}</span></p>`,
  visual:'<div class="wf"><i></i><i class="d"></i><i></i><i></i><i></i><i></i><i class="b"></i></div>',
  hearing:`<div><div class="wave">${[40,70,90,50,35,95,60,80,45].map(h=>`<i style="--h:${h}%"></i>`).join('')}</div><p class="cap">[ ${t('Welcome! Captions make media easier to follow.')} ]</p></div>`,
  physical:'<div class="keys"><b>Tab</b><b>↵</b><b>↑</b><b>↓</b><b>←</b><b>→</b></div>',
  cognitive:`<div class="steps"><b>${t('01 Understand')}</b><b>${t('02 Explore')}</b><b>${t('03 Take action')}</b></div>`
})[k]||'';

function tr() {
  const f=S.lang==='fil';
  $$('[data-fil]').forEach(e=> {
    if(e.dataset.en===undefined)e.dataset.en=e.innerHTML;
    e.innerHTML=f?e.dataset.fil:e.dataset.en
  });
  $$('[data-ill]').forEach(e=> {
    e.innerHTML=ill(e.dataset.ill);
    e.setAttribute('aria-hidden','true')
  });
  $$('.read').forEach(b=> {
    const p=$('#'+b.dataset.for);
    const h=p&&p.parentElement.querySelector('h1,h2,h3');
    b.innerHTML='<span aria-hidden="true">▶</span> '+t('Read aloud');
    b.setAttribute('aria-label',t('Read aloud')+(h?': '+h.textContent:''))
  })
}

function rail() {
  $$('.rail').forEach(e=>e.remove());
  if(spy)spy.disconnect();
  const s=$$('main>section').filter(x=>x.querySelector('h1,h2'));
  if(s.length<3)return;
  s.forEach((x,i)=>x.id=x.id||'s'+i);
  document.body.insertAdjacentHTML('beforeend',`<nav class="rail" aria-label="${t('On this page')}">${s.map(x=>`<a href="#${x.id}"><span>${x.querySelector('h1,h2').textContent}</span></a>`).join('')}</nav>`);
  spy=new IntersectionObserver(es=>es.forEach(n=>n.isIntersecting&&$$('.rail a').forEach(a=>a.setAttribute('aria-current',a.hash==='#'+n.target.id))),{rootMargin:'-45% 0px -50% 0px'});
  s.forEach(x=>spy.observe(x))
}

function build() {
  const here=location.pathname;
  const cur=h=>h==='index.html'?/\/(index\.html)?$/.test(here):h==='pages/guide.html'?/\/pages\/guide(\.html|\/)/.test(here):here.endsWith('/'+h);
  const nav=[
    ['index.html','Home'],
    ['pages/guide.html','Accessibility Guide'],
    ['pages/about.html','About'],
    ['pages/contact.html','Contact']
  ];
  const logo=`<a class="logo" href="${ROOT}index.html"><b>W</b><span class="wm">web <i>for</i> all</span></a>`;
  $$('.skip,.navbar,.site-footer,.dash').forEach(e=>e.remove());
  document.body.insertAdjacentHTML('afterbegin',`<a class="skip" href="#main">${t('Skip to content')}</a><header class="navbar">${logo}<nav id="site-nav" aria-label="Main"><ul class="nav-links">${nav.map(([h,k])=>`<li><a href="${ROOT}${h}"${cur(h)?' aria-current="page"':''}>${t(k)}</a></li>`).join('')}</ul></nav><button class="menu" aria-expanded="false" aria-controls="site-nav"><span aria-hidden="true">☰</span> <span class="mt">${t('Menu')}</span></button><button class="pill" aria-expanded="${open}" aria-controls="dash"><span aria-hidden="true">◐</span> ${t('Accessibility')}</button></header>`);
  document.body.insertAdjacentHTML('beforeend',`<footer class="site-footer">${logo}<p>${t('Technology is better when everyone can use it.')}</p><p>© 2026 Web For All · ${t('Digital accessibility for everyone')}</p></footer><aside class="dash${open?' open':''}" id="dash" aria-label="${t('Accessibility')}"><div class="dh"><h2>${t('Accessibility')}</h2><button data-act="close" aria-label="${t('Close')}">✕</button></div><div class="panel-mount"></div></aside>`);
  $$('.panel-mount').forEach(m=>m.innerHTML=panel());
  tr();
  rail();
  sync();
  hooks.forEach(f=>f());
  document.body.classList.add('ready');
  document.documentElement.removeAttribute('data-pre')
}

function reads() {
  $$('main .card:not(.pillar) p:not(.eyebrow),main p.lead,main .row>div>p:not(.eyebrow)').forEach((p,i)=> {
    if(!p.id)p.id='p'+i;
    const b=document.createElement('button');
    b.className='read';
    b.dataset.for=p.id;
    p.after(b)
  })
}

function reveal() {
  if(!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>es.forEach(n=> {
    if(n.isIntersecting) {
      n.target.classList.add('in');
      io.unobserve(n.target)
    }
  }),{threshold:.1});
  $$('main .card,main .row,main>section.band').forEach(e=> {
    if(e.getBoundingClientRect().top>innerHeight*.9) {
      e.classList.add('rv');
      io.observe(e)
    }
  })
}

function menu(o) {
  const n=$('.navbar');
  const b=$('.menu');
  if(!n||!b)return;
  n.classList.toggle('menu-open',o);
  b.setAttribute('aria-expanded',o)
}