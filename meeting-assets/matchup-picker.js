(() => {
 const root=document.querySelector('.matchup-picker');if(!root)return;
 const cards=[...root.querySelectorAll('[data-matchup]')];
 const prev=root.querySelector('#matchup-prev'),next=root.querySelector('#matchup-next'),select=root.querySelector('#matchup-select'),proceed=root.querySelector('#matchup-continue'),message=root.querySelector('#matchup-message'),chips=root.querySelector('#matchup-selections');
 let current=0;const selected=new Set();
 function render(){
  cards.forEach((card,n)=>card.hidden=n!==current);
  root.querySelector('#matchup-position').textContent=`Matchup ${current+1} of ${cards.length}`;
  root.querySelector('#matchup-count').textContent=`${selected.size} / 2 selected`;
  prev.disabled=current===0;next.disabled=current===cards.length-1;
  select.setAttribute('aria-pressed',String(selected.has(current)));
  select.textContent=selected.has(current)?'✓ Selected · tap to remove':'Select this matchup';
  proceed.disabled=selected.size!==2;
  proceed.textContent=selected.size===2?'Continue with these 2 →':'Choose 2 to continue';
  chips.replaceChildren();
  for(const n of selected){
   const button=document.createElement('button');button.type='button';button.className='matchup-chip';
   const names=[...cards[n].querySelectorAll('figcaption b')].map(x=>x.textContent);
   button.setAttribute('aria-label','Remove '+names.join(' vs '));
   for(const img of cards[n].querySelectorAll('img'))button.append(img.cloneNode());
   const label=document.createElement('span');label.textContent=`Pair ${n+1} ×`;button.append(label);
   button.onclick=()=>{selected.delete(n);message.textContent='Matchup removed. Choose another pair.';render();};chips.append(button);
  }
  if(typeof fit==='function')fit();
 }
 function browse(delta){current=Math.max(0,Math.min(cards.length-1,current+delta));render();}
 prev.onclick=()=>browse(-1);next.onclick=()=>browse(1);
 select.onclick=()=>{
  if(selected.has(current)){selected.delete(current);message.textContent='Matchup removed.';}
  else if(selected.size<2){selected.add(current);message.textContent=selected.size===2?'Two selected. You can continue or change your picks.':'One selected. Browse to choose your second pair.';}
  else{message.textContent='Two already selected. Remove one below to choose this pair.';}
  render();
 };
 proceed.onclick=()=>{if(selected.size===2)openScreen(3);};
 root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();browse(e.key==='ArrowRight'?1:-1);}});
 let start=null;const stage=root.querySelector('.matchup-stage');
 stage.addEventListener('pointerdown',e=>{if(e.isPrimary===false||e.button!==0)return;start={x:e.clientX,y:e.clientY,id:e.pointerId};stage.setPointerCapture(e.pointerId);});
 stage.addEventListener('pointerup',e=>{if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)browse(dx>0?1:-1);});
 stage.addEventListener('pointercancel',()=>{start=null;});
 render();
})();
