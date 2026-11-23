/* Web For All - js/main.js
   Global event listeners and start-up. Loaded last on every page. */

/* Events */
document.addEventListener('click',e=> {
  const x=e.target.closest('.pill,.menu,.read,button[data-act]');
  if(!x)return;
  if(x.matches('.pill'))dash(!open);
  else if(x.matches('.menu'))menu(!$('.navbar').classList.contains('menu-open'));
  else if(x.matches('.read'))textToSpeech(x.dataset.for);
  else act(x.dataset.act,x.dataset.v)
});

document.addEventListener('input',e=> {
  const x=e.target.closest('input[data-act]');
  if(x)act('bright',x.value)
});

document.addEventListener('change',e=> {
  const x=e.target.closest('select[data-act]');
  if(x)act('lang',x.value)
});

document.addEventListener('keydown',e=> {
  if(e.key==='Escape'){
    if(open)dash(false);
    if($('.navbar.menu-open')){
      menu(false);
      $('.menu').focus()
    }
  }
});

document.addEventListener('click',e=> {
  if(open&&!e.composedPath().some(n=>n.id==='dash'||(n.classList&&n.classList.contains('pill'))))dash(false,true);
  if(!e.composedPath().some(n=>n.classList&&n.classList.contains('navbar')))menu(false)
});

addEventListener('pagehide',()=> {
  if('speechSynthesis' in window)speechSynthesis.cancel()
});

addEventListener('scroll',()=> {
  const b=$('#bar');
  const m=document.documentElement;
  if(b)b.style.width=scrollY/Math.max(1,m.scrollHeight-innerHeight)*100+'%'
},{passive:true});

function initialize() {
  apply();
  document.body.insertAdjacentHTML('afterbegin','<div id="bar"></div><p id="live" class="sr" role="status" aria-live="polite"></p>');
  reads();
  build();
  reveal();
  if(typeof puzzle==='function')puzzle();
  if(typeof contact==='function')contact()
}

initialize();
