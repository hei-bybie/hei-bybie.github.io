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
  // One shared offset keeps fragment links clear of the sticky header.
  const siteHeader = document.querySelector('header');
  const syncNavHeight = () => document.documentElement.style.setProperty('--jump-inset', Math.ceil(siteHeader.getBoundingClientRect().height) + 'px');
  syncNavHeight();
  if ('ResizeObserver' in window) new ResizeObserver(syncNavHeight).observe(siteHeader);
  else window.addEventListener('resize', syncNavHeight);
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
"park-wharf": {"title": "河姆渡码头", "summary": "从田螺山出土的木桨、横木与小桩出发，追问河姆渡人怎样靠岸。文中对照古埃及红海港口，配有遗迹关系图、栈台构造图，以及可随滚动逐步搭建的水岸场景。", "target": "park-wharf"}, "park-excavation": {"title": "考古发掘展示区", "summary": "从空中辨认成排的木桩与横木，看看考古人员怎样从残存的构件读出一处聚落。", "target": "park-excavation"}, "park-rice": {"title": "稻作与种植展示", "summary": "从骨耜翻土、落种护苗，到收穗、舂谷与陶釜煮食，跟随一季农事，比较河姆渡稻米与古埃及麦作饮食。文末可滚动观看六道工序。", "target": "park-rice"}, "park-houses": {"title": "干栏式房屋", "summary": "地板下的稻壳、成排的木桩和梁端的榫头，留下了河姆渡人在湿地建屋的线索。文章从今日馆舍的航拍出发，对照房屋分解图，说明桩、梁和地板如何承重，再与古埃及工人村的泥砖住宅比较。文末可随滚动逐步搭起一座长屋。", "target": "park-houses"},

  "bone": {
    "title": "骨耜",
    "summary": "顺着骨面上的浅槽和穿孔，可以读出一把铲掘工具的装柄方法。 骨头原有的扁阔部分足以做铲面，厚实的一端则可加工成装柄处。",
    "reference": "r4"
  },
  "whistle": {
    "title": "骨哨",
    "summary": "中空的禽骨、侧面的开孔和可移动的骨芯，给狩猎用声留下线索。 国博藏品说明提到，有些骨哨管内还插着一根能够移动的细骨。",
    "reference": "r41"
  },
  "pottery": {
    "title": "夹炭黑陶釜",
    "summary": "釜底的断口、泥胎中的植物碎屑和灶下的支脚，串起了做饭的一道工序。 顺着断面可以辨认出一片片泥料相接的痕迹：匠人先把泥捏成片，再一层层贴出圆鼓的器腹。",
    "reference": "r27"
  },
  "wood": {
    "title": "榫卯木构件",
    "summary": "从梁头榫两端削去的木料，观察干栏式房屋的构件如何相接。 把目光从一头移到另一头，可以看到两个形状不同的榫头：一端从一面削薄，留下扁榫，另一端只保留一角，形成较细的方榫。",
    "reference": "r4"
  },
  "sun": {
    "title": "双鸟朝阳纹象牙蝶形器",
    "summary": "正面的鸟纹与同心圆、背面的绑缚痕迹，分别提供了图像和使用方式的线索。 圆的上半部伸出火焰般的纹样，两侧各有一只钩喙的鸟回首相望。",
    "reference": "r4"
  },
  "bird": {
    "title": "牙雕凤鸟匕形器",
    "summary": "扁长的鸟尾近似匙柄，腹背间的穿孔则提示了另一种用法。 鸟喙向下弯，眼睛圆而突出，两翼收在身侧，刻出的短线让平滑的牙面有了羽毛的层次。",
    "reference": "r42"
  },
  "pig": {
    "title": "猪纹陶钵",
    "summary": "圆角的黑陶钵原可盛储，器壁上的猪纹使它也成为观察史前图像的窗口。 浙江省博物馆收藏的这件夹炭黑陶钵，器表磨得平整，两条长边各刻一头猪。",
    "reference": "r4"
  }

};
  $$('button[data-object]').forEach(button => button.addEventListener('click', () => {
    const key=button.dataset.object;
    const card=objectCards[key];
    $('#object-title').textContent=titleText(card.title);
    $('#object-dialog .small-caps').textContent = card.target ? 'FIELD NOTES / 现场简介' : 'OBJECT NOTES / 图片与摘要';
    $('#object-description').textContent=card.summary;
    $('#object-media').replaceChildren(document.getElementById('object-photo-'+key).content.cloneNode(true));
    $('#object-read').setAttribute('href','#'+(card.target || 'artifact-'+key));
    $('#object-ref').href = card.reference ? '#' + card.reference : '#research';
    $('#object-ref').textContent = card.reference ? '查看本件资料 ↗' : '参考资料 ↗';
    $('#object-dialog').showModal();
  }));
  $('#object-ref').addEventListener('click', () => $('#object-dialog').close());
  $('#object-read').addEventListener('click', () => {
    const id=$('#object-read').getAttribute('href').slice(1);
    $('#object-dialog').close();
    requestAnimationFrame(()=>{const article=document.getElementById(id);article.focus({preventScroll:true});article.scrollIntoView({block:'start'});});
  });
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
  if('IntersectionObserver' in window) { const observer=new IntersectionObserver(entries=>{ entries.forEach(entry=>{ if(entry.isIntersecting) $$('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+(entry.target.closest('.fieldwork-chapter') ? 'fieldwork' : entry.target.id))); }); },{rootMargin:'-20% 0px -60% 0px'}); $$('#story, #fieldwork, #scene-index, #field-objects, .park-observation, #film, #research').forEach(node => observer.observe(node)); }
})();
