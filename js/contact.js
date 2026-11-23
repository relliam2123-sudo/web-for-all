/* Web For All - js/contact.js
   Contact form validation (only loaded on pages) */

/* Contact form: front-end validation */

function contact() {
  const f=$('.message-form');
  if(!f)return;
  const V={
    name:v=>v.trim()?'':'Please enter your name so we know who to reply to.',
    email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())?'':'Please enter an email address like name@example.com.',
    message:v=>v.trim().length>=10?'':'Please write at least 10 characters so we can understand your message.'
  };
  const chk=el=> {
    const m=V[el.name](el.value);
    $('#e-'+el.name).textContent=m?'⚠ '+t(m):'';
    el.setAttribute('aria-invalid',!!m);
    return!m
  };
  $$('input,textarea',f).forEach(el=>el.addEventListener('blur',()=>el.value&&chk(el)));
  f.addEventListener('submit',e=> {
    e.preventDefault();
    const bad=$$('input,textarea',f).filter(el=>!chk(el));
    if(bad.length)return bad[0].focus();
    f.reset();
    const o=$('#sent');
    const m=t('Thank you! Your message was checked. This is a demo, so nothing was sent or saved.');
    o.hidden=false;
    o.textContent=m;
    say(m)
  })
}
