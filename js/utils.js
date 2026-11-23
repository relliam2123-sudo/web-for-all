/* Web For All - js/utils.js
   Small helpers used by every other script: $ and $$ selectors, ROOT (the project folder URL)
   and say() which announces messages to screen readers. */

const ROOT=new URL('../',document.currentScript.src).href;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];


function say(m) {
  const l=$('#live');
  l.textContent='';
  setTimeout(()=>l.textContent=m,40)
}
