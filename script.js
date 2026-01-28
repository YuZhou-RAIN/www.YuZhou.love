// 雨州Minecraft - 精简版JS

let currentBgIndex=0,shuffledBgImages=[],imagesTotal=0,pagesTotal=0,fontsTotal=0,imagesLoading=0,pagesLoading=0,fontsLoading=0,domLoaded=false,loadStart=Date.now(),isTouch=false;

const bgImages=['images/主页背景图/1.jpg','images/主页背景图/2.jpg','images/主页背景图/3.jpg','images/主页背景图/4.jpg'];

function shuffleBg(){if(shuffledBgImages.length)return shuffledBgImages;const a=[...bgImages];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}shuffledBgImages=a;return a}
function copyText(t,m='已复制！'){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(()=>showNotify(m))}else{const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;left:-9999px;top:-9999px;opacity:0';document.body.appendChild(ta);try{ta.select();document.execCommand('copy')?showNotify(m):showNotify('复制失败：'+t)}catch(e){showNotify('复制失败：'+t)}document.body.removeChild(ta)}}
function copyIP(){copyText('mc.yuzhou.love','服务器IP已复制！')}
function copyQQ(){copyText('823557774','QQ群号已复制！')}
function showNotify(m){const n=document.createElement('div');n.className='notification';n.textContent=m;n.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(33,150,243,.9);color:#fff;padding:12px 24px;border-radius:4px;z-index:10000;opacity:0;transition:opacity .3s';document.body.appendChild(n);setTimeout(()=>n.style.opacity=1,10);setTimeout(()=>{n.style.opacity=0;setTimeout(()=>n.remove(),300)},3000)}

function detectTouch(){const t='ontouchstart'in window||navigator.maxTouchPoints>0||'TouchEvent'in window;isTouch=t||/iPad|iPhone|Android/i.test(navigator.userAgent);document.documentElement.classList.add(isTouch?'touch-device':'mouse-device')}
function handleTouch(){document.documentElement.classList.add('touch-device');document.documentElement.classList.remove('mouse-device')}
function handleMouse(){document.documentElement.classList.remove('touch-device');document.documentElement.classList.add('mouse-device')}

class PageLoader{constructor(){this.loaded=new Set();this.promises=new Map()}
async load(id,preload=false){const t=document.querySelector('.page-transition');if(t&&!preload)t.classList.add('active');if(this.loaded.has(id)){const c=document.getElementById(id+'-content'),m=document.querySelector('#main-content');if(m&&c&&!m.contains(c)){m.innerHTML='';m.appendChild(c)}await new Promise(r=>setTimeout(r,300));t&&setTimeout(()=>t.classList.remove('active'),50);return c}
if(this.promises.has(id)){t&&!t.classList.contains('active')&&t.classList.add('active');return this.promises.get(id)}
const p=fetch(`pages/${id}.html`).then(r=>r.ok?r.text():Promise.reject()).then(html=>new Promise(r=>setTimeout(()=>r(html),300))).then(html=>{const parser=new DOMParser(),doc=parser.parseFromString(html,'text/html');let c=doc.querySelector('.page-content')||doc.body.firstElementChild;if(!c){c=document.createElement('div');c.innerHTML=html}
const m=document.querySelector('#main-content');if(m){m.innerHTML='';c.id=id+'-content';c.className='page-content';m.appendChild(c)}
if(id==='home'){setTimeout(()=>{const h=document.querySelector('.hero-bg');if(h){h.style.backgroundImage=`url('${shuffleBg()[0]}')`;h.style.opacity=1}},100)}
!preload&&c.classList.add('active');this.loaded.add(id);t&&setTimeout(()=>t.classList.remove('active'),50);return c}).catch(()=>{const e=document.createElement('div');e.id=id+'-content';e.className='page-content';e.innerHTML='<div class="page-header"><div class="container"><h1>页面加载失败</h1></div></div><div class="container"><p>抱歉，无法加载此页面内容。</p></div>';document.querySelector('#main-content')?.appendChild(e);t&&setTimeout(()=>t.classList.remove('active'),50);return e}).finally(()=>this.promises.delete(id));this.promises.set(id,p);return p}
preload(id){if(!this.loaded.has(id)&&id!=='home')fetch(`pages/${id}.html`).then(r=>r.ok&&this.loaded.add(id))}}
const pageLoader=new PageLoader();

function finishLoad(){try{const l=document.querySelector('.loading-indicator');if(l){l.querySelector('.loading-content').style.cssText='opacity:0;transform:translateY(20px);transition:all .6s';setTimeout(()=>{l.style.cssText='opacity:0;transition:opacity .6s';setTimeout(()=>{l.style.display='none';document.body.classList.add('loaded');const h=document.querySelector('.hero-bg');if(h){h.style.backgroundImage=`url('${shuffleBg()[0]}')`;h.style.opacity=1}},600)},600)}}catch(e){document.body.classList.add('loaded')}}

function updateProgress(p){const f=document.getElementById('progressFill'),t=document.getElementById('progressText');if(f&&t){f.style.width=p+'%';t.textContent=Math.round(p)+'%'}}
function updateResCount(){const e=document.getElementById('resourceCount'),l=(imagesTotal-imagesLoading)+(pagesTotal-pagesLoading)+(fontsTotal-fontsLoading),t=imagesTotal+pagesTotal+fontsTotal;if(e)e.textContent=l+'/'+t}
async function preloadAll(){const imgs=['images/主页背景图/1.jpg','images/主页背景图/2.jpg','images/主页背景图/3.jpg','images/主页背景图/4.jpg','images/loading.avif','images/雨州logo.svg','images/服务器特色-四象限构图/左.jpg','images/服务器特色-四象限构图/右.jpg','images/Java版加入指南.png','images/基岩版加入指南.png'],pages=['pages/home.html','pages/features.html','pages/join.html','pages/about.html'],fonts=['fonts/fontawesome-free-6.4.0-web/webfonts/fa-solid-900.woff2'];
imagesTotal=imgs.length;pagesTotal=pages.length;fontsTotal=fonts.length;updateResCount();updateProgress(0);
await Promise.all([...imgs.map(src=>new Promise(r=>{imagesLoading++;const i=new Image();i.onload=()=>{imagesLoading--;updateResCount();updateProgress(((imagesTotal-imagesLoading)/imagesTotal)*100);r()};i.onerror=()=>{imagesLoading--;updateResCount();r()};i.src=src})),...pages.map(src=>new Promise(r=>{pagesLoading++;fetch(src).then(()=>{pagesLoading--;updateResCount();r()}).catch(()=>{pagesLoading--;updateResCount();r()})})),...fonts.map(src=>new Promise(r=>{fontsLoading++;const f=new FontFace('FontAwesome',`url(${src})`);f.load().then(()=>{fontsLoading--;updateResCount();r()}).catch(()=>{fontsLoading--;updateResCount();r()})}))]);finishLoad()}

document.addEventListener('DOMContentLoaded',()=>{detectTouch();document.addEventListener('touchstart',handleTouch,{passive:true});document.addEventListener('mousedown',handleMouse,{passive:true});preloadAll();
const navLinks=document.querySelectorAll('.nav-link[data-page]'),hamburger=document.querySelector('.hamburger'),navMenu=document.querySelector('.nav-menu');
function toggleMenu(){navMenu.classList.toggle('active')}
hamburger?.addEventListener('click',toggleMenu);
navLinks.forEach(link=>link.addEventListener('click',async(e)=>{e.preventDefault();navMenu.classList.contains('active')&&toggleMenu();const id=link.getAttribute('data-page'),tid=id+'-content',t=document.querySelector('.page-transition'),cur=document.querySelector('.page-content.active');
try{pageLoader.loaded.delete(id);await pageLoader.load(id)}catch(err){showNotify('页面加载失败');return}
const target=document.getElementById(tid);if(!target)return;
navLinks.forEach(l=>l.classList.remove('active'));link.classList.add('active');t&&t.classList.add('active');if(cur){cur.style.opacity='0';document.querySelector('footer')&&(document.querySelector('footer').style.opacity='0')}
setTimeout(()=>{if(cur){cur.style.display='none';cur.classList.remove('active')}target.style.display='block';target.classList.add('active');target.style.opacity='0';target.offsetHeight;target.style.opacity='1';setTimeout(()=>target.style.opacity='',300);
const f=document.querySelector('footer');f&&(f.style.opacity='1');t&&setTimeout(()=>t.classList.remove('active'),50);window.scrollTo(0,0)},300)}));
const path=window.location.pathname.replace(/^\//,'')||'home',valid={home:'home',features:'features',join:'join',about:'about'};const pid=valid[path]||'home';(async()=>{await pageLoader.load(pid);navLinks.forEach(l=>l.classList.remove('active'));document.querySelector(`.nav-link[data-page="${pid}"]`)?.classList.add('active')})();
setTimeout(()=>!document.body.classList.contains('loaded')&&finishLoad(),8000)});
window.finishLoading=finishLoad;
