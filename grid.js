{
  const S=[4,8,12,20,32,52,84,136,220,356,576,932,1508];
  const ok=v=>S.includes(Math.round(v));
  const mark=v=>Math.round(v)+(ok(v)?'':'*');
  // hidden for visitors: open any page with ?grid once — it stays on for the tab (sessionStorage); ?nogrid turns it off
  try{const q=location.search;if(/[?&]grid\b/.test(q))sessionStorage.setItem('grid','1');if(/[?&]nogrid\b/.test(q))sessionStorage.removeItem('grid');if(!sessionStorage.getItem('grid'))return;}catch(e){return}
  let layer=null;
  const btn=document.createElement('button');
  btn.className='gridbtn';btn.type='button';btn.textContent='Grid (G)';btn.setAttribute('aria-pressed','false');
  document.body.appendChild(btn);
  const box=(x,y,w,h,css)=>{const d=document.createElement('div');d.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;${css}`;layer.appendChild(d);return d};
  const label=(x,y,text,good)=>{const t=box(x,y,0,0,'');t.style.width='auto';t.style.height='auto';t.textContent=text;t.style.cssText+=`;background:${good?'#ff3b30':'#ffcc00'};color:#000;padding:1px 3px;white-space:nowrap;font:10px/1.2 "Roboto Mono",monospace`;return t};
  const draw=()=>{
    const z=parseFloat(document.body.style.zoom)||1;
    const page=document.querySelector('.page').getBoundingClientRect();
    const px=page.left/z+scrollX, py=page.top/z+scrollY;
    layer=document.createElement('div');
    layer.style.cssText=`position:absolute;left:0;top:0;width:100%;height:${document.documentElement.scrollHeight}px;pointer-events:none;z-index:10`;
    document.body.appendChild(layer);
    const els=[...document.querySelectorAll('[data-b]')].map(el=>{const r=el.getBoundingClientRect();return {x:r.left/z+scrollX,y:r.top/z+scrollY,w:r.width/z,h:r.height/z}});
    if(!els.length) return;
    const colX=Math.min(...els.map(e=>e.x));
    // page margins
    box(px,py,colX-px,0,'border-top:1px dashed #ff3b30');
    label(px+4,py+(els[0].y-py)/2-6,'top '+mark(els[0].y-py),ok(els[0].y-py));
    label(px+(colX-px)/2-16,els[0].y-14,'left '+mark(colX-px),ok(colX-px));
    els.forEach((e,i)=>{
      const good=ok(e.w)&&ok(e.h);
      box(e.x,e.y,e.w,e.h,`outline:1px solid ${good?'rgba(255,59,48,.9)':'#ffcc00'}`);
      label(e.x+e.w+8,e.y,`${mark(e.w)} × ${mark(e.h)}`,good);
      if(i>0){const p=els[i-1];const gap=e.y-(p.y+p.h);
        if(gap>0){box(colX-28,p.y+p.h,1,gap,'background:#ff3b30');label(colX-28-44,p.y+p.h+gap/2-7,mark(gap),ok(gap))}}
    });
  };
  const toggle=()=>{const on=!document.body.classList.contains('grid');document.body.classList.toggle('grid',on);btn.setAttribute('aria-pressed',String(on));if(layer){layer.remove();layer=null}if(on)draw()};
  btn.addEventListener('click',toggle);
  window.addEventListener('keydown',e=>{if((e.key==='g'||e.key==='G')&&!e.metaKey&&!e.ctrlKey)toggle()});
  window.addEventListener('resize',()=>{if(layer){layer.remove();layer=null;draw()}});
  window.__grid=toggle;
}
