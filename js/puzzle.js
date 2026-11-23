/* Web For All - js/puzzle.js
   Word puzzle game (only loaded on pages/puzzle.html). */

/* Word puzzle */

function puzzle() {
  const B=$('#board');
  if(!B)return;
  const W=[
    ['BLIND','A person who cannot see.','Taong hindi nakakakita.'],
    ['SIGHT','The ability to see.','Kakayahang makakita.'],
    ['AUDIO','Sound that you can hear.','Tunog na naririnig mo.'],
    [
      'INPUT',
      'What you type or say into a device.',
      'Ipinapasok mo sa device sa pagta-type o pagsasalita.'
    ],
    ['TOUCH','Using your fingers on a screen.','Paggamit ng daliri sa screen.'],
    [
      'VOICE',
      'Spoken commands can control a device.',
      'Maaaring kontrolin ang device gamit ang pagsasalita.'
    ],
    [
      'SENSE',
      'Sight, hearing and touch are each one.',
      'Ang paningin, pandinig at pandama ay bawat isa nito.'
    ],
    [
      'ADAPT',
      'Change something to fit different needs.',
      'Baguhin ang isang bagay para umangkop sa ibang pangangailangan.'
    ],
    ['USAGE','How people use a website or app.','Paraan ng paggamit ng tao sa website o app.'],
    ['USERS','People who use a website or app.','Mga taong gumagamit ng website o app.'],
    [
      'SHARE',
      'Give information so others can use it too.',
      'Magbigay ng impormasyon para magamit din ng iba.'
    ],
    [
      'EQUAL',
      'Everyone gets the same fair chance.',
      'Pare-parehong patas na pagkakataon ang lahat.'
    ],
    ['MEDIA','Videos, audio and images on a page.','Mga video, audio, at larawan sa pahina.']
  ];
  const [ans,h1,h2]=W[Math.random()*W.length|0];
  const rk={absent:1,present:2,correct:3};
  let r=0;
  let c=0;
  let over=false;
  const hint=()=> {
    $('#hint').textContent=t('Hint')+': '+(S.lang==='fil'?h2:h1)
  };
  hooks.push(hint);
  hint();
  B.setAttribute('role','group');
  B.setAttribute('aria-label','Puzzle board');
  const T=[...Array(30)].map(()=> {
    const d=document.createElement('div');
    d.className='tile';
    B.append(d);
    return d
  });
  const K=$('#kb');
  ['QWERTYUIOP','ASDFGHJKL','>ZXCVBNM<'].forEach(s=> {
    const d=document.createElement('div');
    d.className='keyboard-row';
    [...s].forEach(k=> {
      const b=document.createElement('button');
      const e=k==='>';
      const x=k==='<';
      b.className='key-tile'+(e||x?' wide':'');
      b.dataset.k=e?'Enter':x?'Backspace':k;
      b.textContent=e?'Enter':x?'⌫':k;
      b.setAttribute('aria-label',e?'Enter':x?'Delete':k);
      d.append(b)
    });
    K.append(d)
  });
  K.addEventListener('click',e=> {
    const b=e.target.closest('[data-k]');
    if(b)key(b.dataset.k)
  });
  document.addEventListener('keydown',e=> {
    if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest('select,input,textarea,a,#dash'))return;
    const k=e.key;
    if(k==='Enter'&&e.target.matches('button'))return;
    if(/^[a-z]$/i.test(k))key(k.toUpperCase());
    else if(k==='Enter'||k==='Backspace')key(k)
  });
  function key(k) {
    if(over)return;
    if(k==='Backspace') {
      if(c>0) {
        c--;
        const e=T[r*5+c];
        e.textContent='';
        e.classList.remove('filled')
      }
    } else if(k==='Enter') {
      if(c<5)return say(t('Not enough letters'));
      submit()
    } else if(c<5) {
      const e=T[r*5+c];
      e.textContent=k;
      e.classList.add('filled');
      c++
    }
  }
  function submit() {
    const row=r;
    const g=[...Array(5)].map((_,i)=>T[row*5+i].textContent);
    const res=Array(5).fill('absent');
    const left=[...ans];
    g.forEach((l,i)=> {
      if(l===ans[i]) {
        res[i]='correct';
        left[i]=null
      }
    });
    g.forEach((l,i)=> {
      if(res[i]==='absent') {
        const j=left.indexOf(l);
        if(j>-1) {
          res[i]='present';
          left[j]=null
        }
      }
    });
    g.forEach((l,i)=>setTimeout(()=> {
      const tl=T[row*5+i];
      const kb=$('[data-k="'+l+'"]');
      tl.classList.add('flip');
      setTimeout(()=>tl.classList.add(res[i]),S.calm?0:250);
      if(kb&&(+kb.dataset.rk||0)<rk[res[i]]) {
        kb.dataset.rk=rk[res[i]];
        kb.classList.remove('absent','present','correct');
        kb.classList.add(res[i])
      }
    },S.calm?0:i*220));
    say(`${t('Guess')} ${row+1}: `+g.map((l,i)=>`${l} ${t(res[i]==='correct'?'correct':res[i]==='present'?'in the word':'not in the word')}`).join(', '));
    r++;
    c=0;
    if(g.join('')===ans) {
      over=true;
      $('#answer').textContent=t('You got it!');
      setTimeout(()=>location.href=ROOT+'pages/result.html',S.calm?1200:2200)
    } else if(r===6) {
      over=true;
      $('#answer').textContent=t('The word was')+' '+ans
    }
  }
}
