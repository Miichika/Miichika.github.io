  const DATA_URL="./assets/data/gallery.json";

/* ===== 01 · ORIGINAL CHARACTERS — SLIDER CONFIG =====
   Change these values to control the section 01 slider. */
const ORIGINAL_SLIDER_CONFIG={
  enabled:true,

  // Put the exact `id` values from gallery.json here.
  // The slider follows this array order.
  ids:[
    // "your-gallery-id-1",
    // "your-gallery-id-2",
    "1741564800",
    "1709078400",
    "1754784000",
    "1772150400",
    "1755648000",
    "1754783999",
  ],

  autoplay:true,
  interval:5000,
  loop:true,
  showDots:true
};

const state={data:[],filtered:[],filter:"all",query:"",modalItem:null,modalIndex:0,previousFocus:null};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}function title(i){return i?.detail?.en?.title||i?.title||"Untitled artwork"}function desc(i){return i?.detail?.en?.describe||i?.description||""}function imgs(i){return Array.isArray(i.image)?i.image:[i.image]}function cat(i){return(i.category||"gallery").toLowerCase()}function tags(i){const raw=i.tags||i.tag||[];return(Array.isArray(raw)?raw:[raw]).map(x=>String(x).toLowerCase().trim()).filter(Boolean)}function cover(i){return imgs(i)[0]||""}function icon(n){n=n.toLowerCase();
if(n.includes("pinterest"))return"fa-brands fa-pinterest-p";
if(n.includes("deviant"))return"fa-brands fa-deviantart";
if(n.includes("pixiv"))return"fa-brands fa-pixiv";
if(n.includes("instagram"))return"fa-brands fa-instagram";
if(n.includes("youtube"))return"fa-brands fa-youtube";
if(n.includes("facebook"))return"fa-brands fa-facebook";
if(n.includes("tiktok"))return"fa-brands fa-tiktok";
return"fa-solid fa-arrow-up-right-from-square"}function matches(i){if(i.__ao&&!isAdultApproved())return false;
if(state.filter!=="all"){const [type,value]=state.filter.split(":");if(type==="category"){const c=cat(i);if(value==="fanart"){if(c!=="fanart"&&c!=="redraw")return false}else if(c!==value)return false}else if(type==="tag"&&!tags(i).includes(value))return false}
if(!state.query)return true;
const d=i.detail?.en||{};
return[d.title,d.describe,...(d.keywords||[]),i.author,i.category,...tags(i)].filter(Boolean).join(" ").toLowerCase().includes(state.query)}function itemTime(i,index){const v=i.date_publish;if(v==null||v==="")return Number.NEGATIVE_INFINITY;const n=typeof v==="number"?v:Date.parse(String(v));return Number.isNaN(n)?Number.NEGATIVE_INFINITY:n}function latest(items){return items.map((item,index)=>({item,index})).sort((a,b)=>{const diff=itemTime(b.item,b.index)-itemTime(a.item,a.index);return Number.isNaN(diff)||diff===0?a.index-b.index:diff}).slice(0,8).map(x=>x.item)}function card(i){const t=title(i),c=cat(i);
return`<article class="art-card" data-id="${esc(i.id)}" tabindex="0" aria-label="Open ${esc(t)}"><div class="art-card-image" style="background-image:url('${esc(cover(i))}');
${esc(i.style?.img||"")}"></div><div class="art-card-content"><span class="art-card-tag">${esc(c)}</span><h3>${esc(t)}</h3><p>${esc(i.author||"May Suichika")}</p></div><button type="button" aria-label="Open ${esc(t)}"></button></article>`}function bindCards(root){$$(".art-card",root).forEach(c=>{const open=()=>openModal(c.dataset.id);
c.addEventListener("click",open);
c.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();
open()}})})}function render(){state.filtered=latest(state.data.filter(matches));
const g=$("#gallery-grid");
g.innerHTML=state.filtered.map(card).join("");
$("#empty-state").hidden=state.filtered.length>0;
$("#gallery-count").textContent=`Showing ${state.filtered.length} latest artwork${state.filtered.length===1?"":"s"}`;
bindCards(g)}function renderFeatured(){
  const frame=$("#original-feature");
  const image=$("#original-slider-image");
  const dots=$("#original-slider-dots");
  const prev=$("#original-slider-prev");
  const next=$("#original-slider-next");
  if(!frame||!image)return;

  if(!ORIGINAL_SLIDER_CONFIG.enabled){
    frame.hidden=true;
    return;
  }
  frame.hidden=false;

  const ids=Array.isArray(ORIGINAL_SLIDER_CONFIG.ids)
    ? ORIGINAL_SLIDER_CONFIG.ids.map(id=>String(id))
    : [];
  const byId=new Map(state.data.map(item=>[String(item.id),item]));
  const items=ids
    .map(id=>byId.get(id))
    .filter(Boolean)
    .filter(i=>!(i.__ao&&!isAdultApproved()));

  if(!items.length){
    image.style.backgroundImage="none";
    dots.innerHTML="";
    prev.hidden=true; next.hidden=true;
    return;
  }

  let index=0;
  let timer=null;
  const stop=()=>{if(timer){clearInterval(timer);timer=null}};
  const show=(nextIndex,animate=true)=>{
    index=(nextIndex+items.length)%items.length;
    if(animate)image.classList.add("is-changing");
    window.setTimeout(()=>{
      const item=items[index];
      image.style.backgroundImage=`url("${String(cover(item)).replace(/"/g,'\\"')}")`;
      image.classList.remove("is-changing");
      image.setAttribute("aria-label",title(item));
      dots.querySelectorAll(".original-slider-dot").forEach((d,n)=>d.classList.toggle("active",n===index));
    },animate?160:0);
  };
  const start=()=>{
    stop();
    if(ORIGINAL_SLIDER_CONFIG.autoplay&&items.length>1){
      timer=setInterval(()=>show(index+1),Math.max(1000,Number(ORIGINAL_SLIDER_CONFIG.interval)||5000));
    }
  };

  dots.innerHTML=ORIGINAL_SLIDER_CONFIG.showDots&&items.length>1
    ? items.map((item,n)=>`<button class="original-slider-dot${n===0?" active":""}" type="button" aria-label="Show ${esc(title(item))}"></button>`).join("")
    : "";
  dots.querySelectorAll(".original-slider-dot").forEach((button,n)=>button.onclick=()=>{show(n);start()});

  prev.hidden=items.length<2;
  next.hidden=items.length<2;
  prev.onclick=()=>{show(index-1);start()};
  next.onclick=()=>{show(index+1);start()};
  frame.onclick=e=>{if(e.target.closest("button"))return;openModal(items[index].id)};
  frame.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openModal(items[index].id)}};
  frame.tabIndex=0;
  frame.setAttribute("role","button");
  frame.setAttribute("aria-label",`Open ${title(items[0])}`);
  image.onclick=()=>openModal(items[index].id);
  show(0,false);
  start();
}
function renderRedraw(){const g=$("#redraw-gallery");
g.innerHTML=state.data.filter(i=>(isAdultApproved()||!i.__ao)&&cat(i)==="redraw").slice(0,6).map(card).join("");
bindCards(g)}function modalRender(){const i=state.modalItem,im=imgs(i),src=im[state.modalIndex]||im[0],t=title(i);
$("#modal-image").src=src;
$("#modal-image").alt=i.alt||`${t} — digital artwork by May Suichika`,$("#modal-title").textContent=t,$("#modal-type").textContent=`${cat(i)} · ${i.author||"May Suichika"}`,$("#modal-description").innerHTML=desc(i);
const links=(i.published_link||[]).filter(x=>x.url&&x.url!=="-");
$("#modal-links").innerHTML=links.map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(x.name)}"><i class="${icon(x.name)}"></i></a>`).join("");
$("#modal-prev").hidden=im.length<2;
$("#modal-next").hidden=im.length<2;
$("#modal-thumbs").innerHTML=im.map((x,n)=>`<button type="button" class="${n===state.modalIndex?"active":""}" data-modal-index="${n}" aria-label="View image ${n+1}"><img src="${esc(x)}" alt="" loading="lazy"></button>`).join("");
$$("[data-modal-index]",$("#modal-thumbs")).forEach(b=>b.onclick=()=>{state.modalIndex=+b.dataset.modalIndex;
modalRender()})}function openModal(id){const i=state.data.find(x=>x.id===id);
if(!i)return;
state.modalItem=i;
state.modalIndex=0;
state.previousFocus=document.activeElement;
modalRender();
$("#art-modal").classList.add("open");
$("#art-modal").setAttribute("aria-hidden","false");
document.body.classList.add("modal-open");
$(".modal-close").focus()}function closeModal(){$("#art-modal").classList.remove("open");
$("#art-modal").setAttribute("aria-hidden","true");
document.body.classList.remove("modal-open");
state.modalItem=null;
state.previousFocus?.focus?.()}function move(d){if(!state.modalItem)return;
const n=imgs(state.modalItem).length;
if(n<2)return;
state.modalIndex=(state.modalIndex+d+n)%n;
modalRender()}const AGE_STORAGE_KEY="miichika_age_rating";
const AGE_DEFAULT="G";
const AGE_APPROVED="21+";
function getAgeRating(){try{return localStorage.getItem(AGE_STORAGE_KEY)||null}catch(e){return null}}
function setAgeRating(value){try{localStorage.setItem(AGE_STORAGE_KEY,value)}catch(e){}}
function isAdultApproved(){return getAgeRating()===AGE_APPROVED}
function updateAgeVisibility(){state.data.forEach(i=>{i.__ao=i.ageRating==="AO"||i.rating==="AO"||i.rate==="AO"||i.age_rating==="AO"||i.contentRating==="AO"||i.content_rating==="AO"||i.adultOnly===true||i.adult_only===true||(Array.isArray(i.tags)&&i.tags.some(t=>String(t).toLowerCase()==="ao"))})}
function showAgeGate(){const overlay=$("#ageOverlay"),timer=$("#ageTimer");if(!overlay||getAgeRating())return;overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");let remaining=5;timer.textContent=remaining;let done=false;const finish=value=>{if(done)return;done=true;clearInterval(interval);setAgeRating(value);overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");updateAgeVisibility();renderFeatured();renderRedraw();render();$("#footer-artwork-count").textContent=String(state.data.filter(i=>isAdultApproved()||!i.__ao).length).padStart(4,"0")};const interval=setInterval(()=>{remaining--;timer.textContent=remaining;if(remaining<=0)finish(AGE_DEFAULT)},1000);$("#ageNoButton")?.addEventListener("click",()=>finish(AGE_DEFAULT),{once:true});$("#ageYesButton")?.addEventListener("click",()=>finish(AGE_APPROVED),{once:true})}
function setup(){const s=$("#sidebar"),b=$(".sidebar-backdrop"),t=$(".sidebar-toggle");
const set=v=>{s.classList.toggle("open",v);
b.classList.toggle("visible",v);
t?.setAttribute("aria-expanded",v);
document.body.classList.toggle("sidebar-open",v)};
t?.addEventListener("click",()=>set(true));
$(".sidebar-close")?.addEventListener("click",()=>set(false));
b?.addEventListener("click",()=>set(false));
$$(".sidebar a").forEach(a=>a.addEventListener("click",()=>set(false)));
$(".nav-expand")?.addEventListener("click",()=>{$("#category-nav").classList.toggle("open")});
$$(".filter-button").forEach(x=>x.onclick=()=>{state.filter=x.dataset.filter;
$$(".filter-button").forEach(y=>y.classList.toggle("active",y===x));
render()});
$("#gallery-search").oninput=e=>{state.query=e.target.value.trim().toLowerCase();
render()};
$("#search-form").onsubmit=e=>e.preventDefault();
$$("[data-close-modal]").forEach(x=>x.onclick=closeModal);
$("#modal-prev").onclick=()=>move(-1);
$("#modal-next").onclick=()=>move(1);
document.onkeydown=e=>{if(!state.modalItem)return;
if(e.key==="Escape")closeModal();
if(e.key==="ArrowLeft")move(-1);
if(e.key==="ArrowRight")move(1)}}async function init(){try{const r=await fetch(DATA_URL,{cache:"no-cache"});
if(!r.ok)throw Error(r.status);
state.data=await r.json();
renderFeatured();
renderRedraw();
render();
$("#footer-artwork-count").textContent=String(state.data.filter(i=>isAdultApproved()||!i.__ao).length).padStart(4,"0");
  showAgeGate()}catch(e){console.error(e);
$("#gallery-grid").innerHTML='<div class="empty-state" style="grid-column:1/-1"><strong>Gallery data could not be loaded.</strong><p>Check assets/data/gallery.json.</p></div>'}}setup();
init();
