'use strict';
(() => {
  const data = window.HEMUDU;
  const config = window.HEMUDU_CONFIG;
  const titleText = value => String(value).replace(/。/g, '');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  config.chapters.forEach((chapter,index) => {
    $$('.nav-links a, .footer-categories a').filter(a=>a.getAttribute('href')==='#'+chapter.id).forEach(a=>a.textContent=chapter.label);
    const card=$('.project-strip a[href="#'+chapter.id+'"] strong');if(card)card.textContent=chapter.label;
    const root=document.getElementById(chapter.id);
    const label=root.querySelector('.feature-heading > .eyebrow, .fieldwork-heading > .eyebrow, .section-heading .eyebrow');
    if(label)label.textContent='CHAPTER '+String(index+1).padStart(2,'0')+' / '+chapter.label;
  });
  let toastTimer;
  function toast(message) { $('#toast').textContent = message; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 3000); }
  function download(name, content, type = 'text/plain;charset=utf-8') { const url = URL.createObjectURL(new Blob(['\uFEFF', content], {type})); const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); }
  async function copyCitation(text) {
    try { if (!navigator.clipboard) throw new Error('clipboard unavailable'); await navigator.clipboard.writeText(text); toast('引文已复制'); }
    catch { const input = document.createElement('textarea'); input.value = text; input.style.cssText = 'position:fixed;top:0;left:0;opacity:0'; document.body.append(input); input.select(); let copied = false; try { copied = document.execCommand('copy'); } catch {} input.remove(); if(copied) toast('引文已复制'); else { download('参考引文.txt', text); toast('当前浏览器无法复制，已下载引文'); } }
  }
  const chapters = [
    {title:'湿地里的一粒稻',image:'assets/images/image-afeb6eba2db3.png',text:'虚构的少年蹲在湿地边，观察一穗稻。\n这幅画为文章提出第一个问题：人在怎样的环境中开始并持续经营稻作？',evidence:'环境与栽培的联系参考文献 [4]、[6]。人物、服饰、具体动作与地貌为AI辅助生成的叙事想象，非考古复原。'},
    {title:'一顿饭的多种来源',image:'assets/images/image-8d0cbd1a89bf.png',text:'稻穗、果实和鱼被放在一起。\n这一场景帮助读者同时关注栽培与采集渔猎，不表示某次真实聚餐，也不表示各种食物的比例。',evidence:'食物来源与研究分歧参考文献 [2]、[5]、[6]。同位素与遗存证据需要结合研究对象、取样及方法解释。'},
    {title:'田地与居所之间',image:'assets/images/image-1604ffe593b4.png',text:'少年站在水边的架高木屋附近。\n画面将食物、劳动与居所联系起来，对应文章关于农业文化生态体系的讨论。',evidence:'木构遗迹及聚落联系参考文献 [4]、[6]。房屋外观、规模、人物关系与服饰为概念场景，不能据此确认史前家庭组织。'}
  ];
  let chapterIndex = 0;
  const reader = $('#comic-dialog');
  function renderChapter() { const c = chapters[chapterIndex]; $('#comic-chapter').textContent = 'ILLUSTRATION ' + String(chapterIndex+1).padStart(2,'0'); $('#comic-title').textContent = titleText(c.title); $('#comic-text').textContent = c.text; $('#comic-evidence').textContent = c.evidence; $('#comic-image').src = window.HEMUDU_INLINE_STORIES?.[chapterIndex+1] || c.image; $('#comic-image').alt = c.title + '：Q版日漫叙事插图'; $('#comic-count').textContent = `${String(chapterIndex+1).padStart(2,'0')} / ${String(chapters.length).padStart(2,'0')}`; $('#comic-prev').disabled = chapterIndex === 0; $('#comic-next').disabled = chapterIndex === chapters.length-1; }
  $('#read-comic').addEventListener('click', () => { renderChapter(); reader.showModal(); });
  $$('[data-illustration]').forEach(button => button.addEventListener('click', () => { chapterIndex=Number(button.dataset.illustration);renderChapter();reader.showModal(); }));
  $('#comic-prev').addEventListener('click', () => { if(chapterIndex > 0) { chapterIndex--; renderChapter(); } });
  $('#comic-next').addEventListener('click', () => { if(chapterIndex < chapters.length-1) { chapterIndex++; renderChapter(); } });
  reader.addEventListener('keydown', event => { if(event.key === 'ArrowLeft' && chapterIndex > 0) { chapterIndex--; renderChapter(); event.preventDefault(); } if(event.key === 'ArrowRight' && chapterIndex < chapters.length-1) { chapterIndex++; renderChapter(); event.preventDefault(); } });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  $$('dialog').forEach(dialog => { dialog.addEventListener('click', event => { if(event.target === dialog) { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } }); dialog.addEventListener('close', () => document.body.style.overflow = ''); });
  const objectCards = {
  "bone": {
    "title": "骨耜",
    "summary": "骨耜以动物肩胛骨制成，凿孔开槽后绑缚木柄，兼具耕作和挖掘用途，是理解湿地生活、材料利用与工具技术的重要线索。",
    "note": "图片仅作形态参考，年代、出土信息与确切器名以展签核对。"
  },
  "pottery": {
    "title": "陶器",
    "summary": "陶器连接食物加工、烹煮与盛放，从器形、胎质和使用痕迹入手，可以认识河姆渡人的日常饮食及其积累的制陶经验。",
    "note": "图片仅作形态参考，年代、出土信息与确切器名以展签核对。"
  },
  "wood": {
    "title": "榫卯木构",
    "summary": "榫卯通过木构件之间的凹凸咬合完成连接，体现材料加工与结构经验，也为理解干栏建筑及湿地定居生活提供了重要线索。",
    "note": "附图为展陈环境参考，不作木构件识别。"
  }
};
  $$('button[data-object]').forEach(button => button.addEventListener('click', () => {
    const key=button.dataset.object;
    const card=objectCards[key];
    $('#object-title').textContent=titleText(card.title);
    $('#object-description').textContent=card.summary;
    $('#object-media').replaceChildren(document.getElementById('object-photo-'+key).content.cloneNode(true));
    $('#object-read').setAttribute('href','#artifact-'+key);
    $('#object-dialog').showModal();
  }));
  $('#object-ref').addEventListener('click', () => $('#object-dialog').close());
  $('#object-read').addEventListener('click', () => {
    const id=$('#object-read').getAttribute('href').slice(1);
    $('#object-dialog').close();
    requestAnimationFrame(()=>{const article=document.getElementById(id);article.focus({preventScroll:true});article.scrollIntoView({block:'start'});});
  });
  const panels = {
    plan: [ ['河姆渡遗址博物馆与遗址展示','优先记录稻谷、骨耜、陶器与木构件；同时拍下展签，区分原件、复制品与复原图。','核心考察 · 待开展'], ['田螺山遗址现场馆','作为补充考察，关注遗迹空间与保护展示；出发前确认开放情况。','补充考察 · 待确认'], ['宁波博物馆','比较城市综合博物馆如何讲述河姆渡，记录展陈叙事与观众理解方式。','对比观察 · 可选'] ],
    method: [ ['三件器物，三张观察卡','记录名称、年代、出土地点、材质、用途、速写与照片编号；为每一处漫画细节找到来源。','实物观察'], ['一个场景，一次复原辨析','询问哪些细节由遗迹支持，哪些属于展示解释。访谈须获得同意，保留原意并注明身份。','现场访谈'], ['一轮试读，一次修改','邀请 5—10 位同学阅读初稿，记录记住了什么、哪里难理解，以及是否混淆了虚构与事实。','读者反馈 · 样本待收集'] ],
    report: [ ['提出问题与说明方法','为什么从“一顿饭”切入？说明查阅、观察、访谈和试读的方法及其限制。','第 1—2 部分'], ['呈现发现与创作转化','用“照片 / 速写—资料依据—漫画分镜”对应展示，把现场发现转化为画面选择。','第 3—4 部分'], ['反思、参考文献与附录','说明不确定细节与修改过程，附真实考察日期、照片编号、访谈记录和参考文献。','第 5—6 部分 · 报告待完成'] ]
  };
  function renderPanel(key) { $('#field-panel').innerHTML = panels[key].map((item,i) => `<article class="field-item"><span>0${i+1}</span><h3>${titleText(item[0])}</h3><p>${item[1]}</p><em>${item[2]}</em></article>`).join(''); $('#field-panel').setAttribute('aria-labelledby','tab-'+key); }
  $$('[data-tab]').forEach((button,index,buttons) => {
    button.addEventListener('click', () => { buttons.forEach(b => { b.setAttribute('aria-selected', String(b === button)); b.tabIndex = b === button ? 0 : -1; }); renderPanel(button.dataset.tab); });
    button.addEventListener('keydown', event => { let next; if(event.key === 'ArrowRight') next=(index+1)%buttons.length; if(event.key === 'ArrowLeft') next=(index+buttons.length-1)%buttons.length; if(event.key==='Home') next=0; if(event.key==='End') next=buttons.length-1; if(next!==undefined) { event.preventDefault(); buttons[next].click(); buttons[next].focus(); } });
  });
  renderPanel('plan');
  const notes = '# 河姆渡文化实践 · 实地考察记录表\n\n考察者：\n日期与时间：\n地点：\n天气：\n拍摄与访谈许可情况：\n\n## 一、文物观察卡（每件复制一份）\n名称：\n年代 / 文化层：\n出土地点：\n现藏单位：\n原件 / 复制品 / 模型：\n材质、尺寸与形态：\n展签原文或摘要（区分记录）：\n展签照片编号：\n细节照片编号：\n速写：\n已知用途及依据：\n尚需核实的问题：\n拟用于漫画的篇章 / 画面：\n\n## 二、复原场景记录\n场景名称：\n有直接出土依据的部分：\n解释性复原的部分：\n依据来源与照片编号：\n\n## 三、访谈\n是否征得同意：\n受访者身份（可匿名）：\n问题：\n回答摘要（与逐字引语区分）：\n\n## 四、影像记录\n文件名：\n拍摄地点和日期：\n画面说明：\n拍摄者与使用范围：\n\n## 五、试读反馈（考察后）\n样本人数：\n记住了什么：\n难理解之处：\n有无混淆虚构与事实：\n计划修改：\n\n## 六、考察后复核\n新增资料：\n需要修改的画面：\n无法确定的细节：\n';
  $$('.download-notes').forEach(button => button.addEventListener('click', () => download('河姆渡实地考察记录表.md', notes, 'text/markdown;charset=utf-8')));
  let currentFilter = 'all';
  function savePaper(ref) {
    const a=document.createElement('a');a.href=ref.local;a.download=ref.title+'.pdf';
    document.body.append(a);a.click();a.remove();
  }
  $$('[data-filter]').forEach(button => { const count=$('span',button);if(count) count.textContent=String(data.references.filter(ref=>button.dataset.filter==='all'||ref.kind===button.dataset.filter).length); });
  function renderReferences() {
    const term = $('#ref-search').value.trim().toLocaleLowerCase();
    const references = data.references.filter(ref => (currentFilter === 'all' || currentFilter === ref.kind) && [ref.title, ref.authors, ref.year, ref.source].join(' ').toLocaleLowerCase().includes(term));
    $('#references').innerHTML = references.map(ref => `<article class="ref-item" id="${escape(ref.id)}" tabindex="-1"><span class="ref-number">${String(data.references.indexOf(ref)+1).padStart(2,'0')}</span><div><p class="ref-meta">${escape(ref.source)}</p><h3>${escape(titleText(ref.title))}</h3><p class="ref-authors">${escape(ref.authors)}</p><details><summary>阅读说明与引用</summary><div class="ref-detail"><p>${escape(ref.note)}</p><p class="ref-access">${escape(ref.access)}</p><p class="citation">${escape(ref.citation)}</p><div class="ref-actions">${ref.url ? `<a href="${escape(ref.url)}" target="_blank" rel="noopener noreferrer">${ref.id === 'r1' ? '前往知网条目' : '打开来源'} ↗</a>` : ''}${ref.local ? `<button class="local-paper" data-paper="${escape(ref.id)}">下载论文 PDF ↓</button>` : ''}${ref.verify ? `<a href="${escape(ref.verify)}" target="_blank" rel="noopener noreferrer">${ref.id === 'r1' ? '书目交叉核验' : '查看公开摘要'} ↗</a>` : ''}<button data-copy="${escape(ref.id)}">复制引文 ＋</button>${(ref.readingTargets||[]).map(target=>`<a href="#${escape(target.id)}">${escape(target.label)} ↑</a>`).join('')}</div></div></details></div><span class="ref-year">${escape(ref.year)}</span></article>`).join('');
    $('#no-results').hidden = references.length !== 0;
    $$('[data-copy]').forEach(button => button.addEventListener('click', () => copyCitation(data.references.find(ref => ref.id === button.dataset.copy).citation)));
    $$('[data-paper]').forEach(button=>button.addEventListener('click',()=>savePaper(data.references.find(ref=>ref.id===button.dataset.paper))));
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => { currentFilter = button.dataset.filter; $$('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed',String(b === button)); }); renderReferences(); }));
  $('#ref-search').addEventListener('input',renderReferences); renderReferences();
  function revealReference() {
    const id = location.hash.slice(1);
    if (!data.references.some(ref => ref.id === id)) {
      $$('.is-citation-target').forEach(item => item.classList.remove('is-citation-target'));
      return;
    }
    currentFilter = 'all';
    $('#ref-search').value = '';
    $$('[data-filter]').forEach(button => {
      const active = button.dataset.filter === 'all';
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderReferences();
    const article = document.getElementById(id);
    $('details', article).open = true;
    article.classList.add('is-citation-target');
    article.focus({preventScroll: true});
    requestAnimationFrame(() => article.scrollIntoView({block: 'start'}));
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#r"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const fragment = link.getAttribute('href');
    if (!data.references.some(ref => '#' + ref.id === fragment)) return;
    event.preventDefault();
    if (location.hash === fragment) revealReference();
    else location.hash = fragment;
  });
  window.addEventListener('hashchange', revealReference);
  if (location.hash) revealReference();
  $('#export-refs').addEventListener('click', () => download('河姆渡参考文献.txt', '河姆渡文化实践专栏 · 参考文献\n\n' + data.references.map((ref,i) => `[${i+1}] ${ref.citation}\n来源：${ref.url||ref.local||'课程提供资料'}\n阅读状态：${ref.access}\n说明：${ref.note}`).join('\n\n')));
  let videoUrl = null;
  function showVideo(src, label, poster='') { const video=$('#field-video'); video.src=src; if(poster) video.poster=poster; else video.removeAttribute('poster'); video.hidden=false; $('#reset-video').hidden=false; $('#film-stage').classList.add('has-video'); $('#media-hint').textContent=label; }
  $('#video-title').textContent = titleText(data.video.title);
  $('#video-caption').textContent = data.video.caption;
  if(data.video.src) showVideo(data.video.src,data.video.caption,data.video.poster);
  function resetVideo() { const video=$('#field-video'); video.pause(); video.removeAttribute('src'); video.load(); video.hidden=true; $('#reset-video').hidden=true; $('#film-stage').classList.remove('has-video'); if(videoUrl) { URL.revokeObjectURL(videoUrl);videoUrl=null; } $('#video-file').value=''; $('#media-hint').textContent=config.media.caption; }
  $('#watch-excerpt').addEventListener('click', () => {
    showVideo(config.media.video,config.media.caption,config.media.poster);
    $('#field-video').play().catch(()=>{});
  });
  $('#reset-video').addEventListener('click',resetVideo);
  $('#video-file').addEventListener('change', event => { const file=event.target.files[0]; if(!file) return; if(!file.type.startsWith('video/')) { toast('请选择视频文件'); return; } if(videoUrl) URL.revokeObjectURL(videoUrl); videoUrl=URL.createObjectURL(file); showVideo(videoUrl,'本地临时预览：'+file.name+'。刷新后需重新选择。'); });
  $('#field-video').addEventListener('error', () => { if($('#field-video').getAttribute('src')) $('#media-hint').textContent='此视频无法读取或编码不受支持。请尝试 H.264 编码的 MP4，或检查媒体路径。'; });
  const photoUrls=[];
  function addPhoto(photo) { $('#gallery-grid').hidden=false; const figure=document.createElement('figure'); figure.className='gallery-item'; const img=document.createElement('img');img.src=photo.src;img.alt=photo.alt||photo.caption||'实地考察照片';img.loading='lazy';const caption=document.createElement('figcaption');caption.textContent=photo.caption||'实地照片';figure.append(img,caption);$('#gallery-grid').append(figure); }
  if(data.gallery.length) { $('#gallery-grid').replaceChildren();data.gallery.forEach(addPhoto); }
  $('#photo-file').addEventListener('change',event=>{ const files=[...event.target.files].filter(file=>file.type.startsWith('image/')); if(!files.length) return; $$('.photo-placeholder').forEach(p=>p.remove()); files.forEach(file=>{const url=URL.createObjectURL(file);photoUrls.push(url);addPhoto({src:url,alt:file.name,caption:file.name+' · 本地临时预览'});}); toast('照片已加入当前预览，刷新后需重新选择');event.target.value=''; });
  window.addEventListener('beforeunload',()=>{ if(videoUrl) URL.revokeObjectURL(videoUrl);photoUrls.forEach(url=>URL.revokeObjectURL(url)); });
  if('IntersectionObserver' in window) { const observer=new IntersectionObserver(entries=>{ entries.forEach(entry=>{ if(entry.isIntersecting) $$('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+(entry.target.closest('.fieldwork-chapter') ? 'fieldwork' : entry.target.id))); }); },{rootMargin:'-20% 0px -60% 0px'}); ['story','fieldwork','field-objects','artifact-bone','artifact-pottery','artifact-wood','field-plan','film','park-wharf','park-excavation','park-rice','park-houses','research'].forEach(id=>observer.observe(document.getElementById(id))); }
})();
