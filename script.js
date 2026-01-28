// 雨州Minecraft - 完整版JS

let shuffledBg=[],imagesTotal=0,imagesLoading=0,loadStart=Date.now();
const bgImages=['images/主页背景图/1.jpg','images/主页背景图/2.jpg','images/主页背景图/3.jpg','images/主页背景图/4.jpg'];

function shuffleBg(){if(shuffledBg.length)return shuffledBg;const a=[...bgImages];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}shuffledBg=a;return a}
function copyText(t,m='已复制！'){if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(()=>showNotify(m))}else{const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;left:-9999px;top:-9999px;opacity:0';document.body.appendChild(ta);try{ta.select();document.execCommand('copy')?showNotify(m):showNotify('复制失败：'+t)}catch(e){showNotify('复制失败：'+t)}document.body.removeChild(ta)}}
function copyIP(){copyText('mc.yuzhou.love','服务器IP已复制！')}
function copyQQ(){copyText('823557774','QQ群号已复制！')}
function showNotify(m){const n=document.createElement('div');n.textContent=m;n.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#45CDF3;color:#fff;padding:12px 24px;border-radius:8px;z-index:10000;opacity:0;transition:opacity .3s';document.body.appendChild(n);setTimeout(()=>n.style.opacity=1,10);setTimeout(()=>{n.style.opacity=0;setTimeout(()=>n.remove(),300)},2500)}
function toggleMenu(){document.querySelector('.nav-menu').classList.toggle('active')}

class PageLoader{constructor(){this.loaded=new Set();this.promises=new Map()}
async load(id){if(this.loaded.has(id)){const c=document.getElementById(id+'-content');if(c){document.querySelector('#main-content').innerHTML='';document.querySelector('#main-content').appendChild(c);c.classList.add('active')}return c}
if(this.promises.has(id))return this.promises.get(id);
const p=fetch(`pages/${id}.html`).then(r=>r.text()).then(html=>{const parser=new DOMParser(),doc=parser.parseFromString(html,'text/html');let c=doc.querySelector('.page-content');if(!c){c=document.createElement('div');c.innerHTML=html}
const m=document.querySelector('#main-content');if(m){m.innerHTML='';c.id=id+'-content';c.className='page-content active';m.appendChild(c)}
this.loaded.add(id);return c}).catch(()=>{const e=document.createElement('div');e.id=id+'-content';e.className='page-content active';e.innerHTML='<div class="container" style="padding-top:100px"><h1>页面加载失败</h1></div>';document.querySelector('#main-content')?.appendChild(e);return e}).finally(()=>this.promises.delete(id));this.promises.set(id,p);return p}}
const pageLoader=new PageLoader();

function finishLoad(){const l=document.querySelector('.loading-indicator');if(l){l.style.opacity='0';setTimeout(()=>{l.style.display='none';document.body.classList.add('loaded')},300)}}
function updateProgress(p){const f=document.getElementById('progressFill'),t=document.getElementById('progressText');if(f)f.style.width=p+'%';if(t)t.textContent=Math.round(p)+'%'}

async function preload(){const imgs=['images/主页背景图/1.jpg','images/主页背景图/2.jpg','images/主页背景图/3.jpg','images/主页背景图/4.jpg','images/loading.avif','images/雨州logo.svg'];
imagesTotal=imgs.length;
await Promise.all(imgs.map(src=>new Promise(r=>{imagesLoading++;const i=new Image();i.onload=i.onerror=()=>{imagesLoading--;updateProgress(((imagesTotal-imagesLoading)/imagesTotal)*100);r()};i.src=src})));
finishLoad()}

document.addEventListener('DOMContentLoaded',()=>{preload();
const navLinks=document.querySelectorAll('.nav-link[data-page], .nav-logo[data-page], .footer-links a[data-page]');
navLinks.forEach(link=>link.addEventListener('click',async(e)=>{e.preventDefault();const id=link.getAttribute('data-page');document.querySelector('.nav-menu')?.classList.remove('active');
try{await pageLoader.load(id)}catch(err){showNotify('加载失败')}
navLinks.forEach(l=>l.classList.remove('active'));document.querySelectorAll(`[data-page="${id}"]`).forEach(l=>l.classList.add('active'));window.scrollTo(0,0)}));
(async()=>{const path=window.location.pathname.replace(/^\//,'')||'home';await pageLoader.load(path);document.querySelectorAll(`[data-page="${path}"]`).forEach(l=>l.classList.add('active'))})();
setTimeout(()=>!document.body.classList.contains('loaded')&&finishLoad(),5000)});
