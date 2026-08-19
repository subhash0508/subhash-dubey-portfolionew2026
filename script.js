/* =========================================================
   SUBHASH DUBEY — PORTFOLIO SCRIPT
   Edit the CONFIG block below to personalize the site.
   ========================================================= */

const CONFIG = {
  name: "Subhash Dubey",
  email: "hello@subhashdubey.com",
  behanceUrl: "https://www.behance.net/subhashdubey", // TODO: replace with your real Behance URL
  youtubeUrl: "https://www.youtube.com/",              // Replace with your showreel URL
  linkedinUrl: "https://www.linkedin.com/",             // Replace with your LinkedIn URL
  instagramUrl: "https://www.instagram.com/",           // Replace with your Instagram URL

  // Default featured projects. Add more here, or use the
  // "+ Add Project" button on the live site (saved in the visitor's browser).
  defaultProjects: [
    {
      id: "p1",
      title: "Election Night Graphics Package",
      category: "Broadcast / News Graphics",
      description: "Full election-night lower thirds, results boards and transitions built for live air in VizRT.",
      software: ["VizRT", "After Effects", "GeoLayers"],
      image: ""
    },
    {
      id: "p2",
      title: "The Last Tree",
      category: "Cinematic Short Film",
      description: "45-second dialogue-free story of a girl reviving the last tree in a futuristic city. Nine-scene color arc from cold steel blue to warm gold.",
      software: ["After Effects", "Veo", "Runway", "Kling"],
      image: ""
    },
    {
      id: "p3",
      title: "City Pulse — Title Sequence",
      category: "Animation / Title Design",
      description: "Kinetic-type opening titles for a documentary series, built around a live-data visual motif.",
      software: ["After Effects", "Illustrator", "Blender"],
      image: ""
    },
    {
      id: "p4",
      title: "AI-Assisted Previs Pipeline",
      category: "AI Video / Pipeline",
      description: "A generative previsualization workflow combining AI image generation with traditional AE compositing to cut concept-to-shot time.",
      software: ["Runway", "AI Image Pipelines", "After Effects"],
      image: ""
    }
  ]
};

// ---------- Storage helpers (per-visitor, local to their browser) ----------
const STORAGE_KEY = "sd_portfolio_custom_projects";

function loadCustomProjects(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch(e){ return []; }
}
function saveCustomProjects(list){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }catch(e){}
}
function loadImageOverrides(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY + "_images")) || {};
  }catch(e){ return {}; }
}
function saveImageOverride(id, dataUrl){
  const overrides = loadImageOverrides();
  overrides[id] = dataUrl;
  try{ localStorage.setItem(STORAGE_KEY + "_images", JSON.stringify(overrides)); }catch(e){}
}

// ---------- Wire up links from CONFIG ----------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("contactEmail").textContent = CONFIG.email;
  document.getElementById("contactEmail").href = "mailto:" + CONFIG.email;

  ["behanceBtn", "behanceNavBtn"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.behanceUrl;
  });
  document.getElementById("youtubeBtn").href = CONFIG.youtubeUrl;
  document.getElementById("linkedinBtn").href = CONFIG.linkedinUrl;
  document.getElementById("instagramBtn").href = CONFIG.instagramUrl;

  initNav();
  initTimecode();
  initReveals();
  renderProjects();
  initLightbox();
  initProjectForm();
  initShowreel();
});

// ---------- Nav ----------
function initNav(){
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  }));
}

// ---------- Ticking timecode (decorative, broadcast motif) ----------
function initTimecode(){
  const els = [
    document.getElementById("timecode"),
    document.getElementById("heroTimecode"),
    document.getElementById("footerTimecode")
  ].filter(Boolean);

  let frame = 0;
  const fps = 24;

  function tick(){
    frame++;
    const totalSeconds = Math.floor(frame / fps);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    const f = String(frame % fps).padStart(2, "0");
    const str = `${h}:${m}:${s}:${f}`;
    els.forEach(el => el.textContent = str);
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) { tick(); return; }
  setInterval(tick, 1000 / fps);
}

// ---------- Scroll reveal ----------
function initReveals(){
  const targets = document.querySelectorAll(".reveal, [data-reveal]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));

  // Hero reveals fire immediately on load
  document.querySelectorAll(".hero .reveal").forEach(el => el.classList.add("in"));
}

// ---------- Project rendering ----------
function getAllProjects(){
  const custom = loadCustomProjects();
  const overrides = loadImageOverrides();
  const all = [...CONFIG.defaultProjects, ...custom];
  return all.map(p => ({ ...p, image: overrides[p.id] || p.image }));
}

function renderProjects(){
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = "";
  const projects = getAllProjects();

  projects.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.dataset.reveal = "";
    card.dataset.id = p.id;

    card.innerHTML = `
      <div class="card-edit" data-role="replace-image">Replace image</div>
      <div class="card-frame">
        <span class="corner tl"></span><span class="corner tr"></span>
        <span class="corner bl"></span><span class="corner br"></span>
        ${p.image
          ? `<img src="${p.image}" alt="${escapeHtml(p.title)} preview">`
          : `<label class="upload-placeholder">
               <span class="plus">+</span>
               Upload Project Image
               <input class="upload-input" type="file" accept="image/*" data-role="upload-input">
             </label>`
        }
        <div class="play-overlay">
          <span class="play-circle">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M3 2L12 7L3 12V2Z" fill="#ECE9E4"/></svg>
          </span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-top">
          <h3>${escapeHtml(p.title)}</h3>
        </div>
        <span class="tag">${escapeHtml(p.category)}</span>
        <p style="margin-top:12px;">${escapeHtml(p.description)}</p>
        <div class="chips">
          ${(p.software || []).map(s => `<span class="chip">${escapeHtml(s)}</span>`).join("")}
        </div>
      </div>
    `;

    grid.appendChild(card);

    // Re-observe for reveal animation since it was just added
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){ entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    io.observe(card);
  });

  wireCardInteractions();
}

function wireCardInteractions(){
  document.querySelectorAll(".project-card").forEach(card => {
    const id = card.dataset.id;

    // Upload placeholder click
    const uploadInput = card.querySelector('[data-role="upload-input"]');
    if (uploadInput){
      uploadInput.addEventListener("click", e => e.stopPropagation());
      uploadInput.addEventListener("change", e => handleImageUpload(e, id));
    }

    // Replace image button (only meaningful once an image exists)
    const replaceBtn = card.querySelector('[data-role="replace-image"]');
    if (replaceBtn){
      replaceBtn.addEventListener("click", e => {
        e.stopPropagation();
        const tempInput = document.createElement("input");
        tempInput.type = "file";
        tempInput.accept = "image/*";
        tempInput.addEventListener("change", ev => handleImageUpload(ev, id));
        tempInput.click();
      });
    }

    // Open lightbox on card click (but not when clicking the upload control)
    card.addEventListener("click", (e) => {
      if (e.target.closest('[data-role="upload-input"], .card-edit, .upload-placeholder')) return;
      openLightbox(id);
    });
  });
}

function handleImageUpload(e, id){
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    saveImageOverride(id, reader.result);
    renderProjects();
  };
  reader.readAsDataURL(file);
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

// ---------- Lightbox ----------
function initLightbox(){
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener("click", () => closeAllModals());
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAllModals();
  });
}

function openLightbox(id){
  const p = getAllProjects().find(proj => proj.id === id);
  if (!p) return;

  const media = document.getElementById("lightboxMedia");
  media.innerHTML = p.image
    ? `<img src="${p.image}" alt="${escapeHtml(p.title)}">`
    : `<div class="upload-placeholder"><span class="plus">+</span>No image uploaded yet</div>`;

  document.getElementById("lightboxCategory").textContent = p.category;
  document.getElementById("lightboxTitle").textContent = p.title;
  document.getElementById("lightboxDesc").textContent = p.description;
  document.getElementById("lightboxSoftware").innerHTML =
    (p.software || []).map(s => `<span class="chip">${escapeHtml(s)}</span>`).join("");

  openModal("lightbox");
}

// ---------- Add Project form ----------
function initProjectForm(){
  document.getElementById("addProjectBtn").addEventListener("click", () => openModal("projectModal"));

  const form = document.getElementById("projectForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("pTitle").value.trim();
    const category = document.getElementById("pCategory").value.trim();
    const description = document.getElementById("pDesc").value.trim();
    const software = document.getElementById("pSoftware").value
      .split(",").map(s => s.trim()).filter(Boolean);
    const fileInput = document.getElementById("pImage");
    const file = fileInput.files && fileInput.files[0];

    const id = "custom_" + Date.now();
    const finalize = (imageDataUrl) => {
      const custom = loadCustomProjects();
      custom.push({ id, title, category, description, software, image: "" });
      saveCustomProjects(custom);
      if (imageDataUrl) saveImageOverride(id, imageDataUrl);
      renderProjects();
      form.reset();
      closeAllModals();
    };

    if (file){
      const reader = new FileReader();
      reader.onload = () => finalize(reader.result);
      reader.readAsDataURL(file);
    } else {
      finalize(null);
    }
  });
}

// ---------- Showreel modal ----------
function initShowreel(){
  document.getElementById("showreelBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const wrap = document.getElementById("videoWrap");
    const embedUrl = toYoutubeEmbed(CONFIG.youtubeUrl);
    wrap.innerHTML = embedUrl
      ? `<iframe src="${embedUrl}" title="Showreel" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
      : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#8B8B92;font-family:'JetBrains Mono',monospace;padding:20px;text-align:center;">
           Add your YouTube showreel URL in js/script.js (CONFIG.youtubeUrl) to enable playback here.
         </div>`;
    openModal("showreelModal");
  });
}

function toYoutubeEmbed(url){
  try{
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.searchParams.get("v")) id = u.searchParams.get("v");
    else return null;
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }catch(e){ return null; }
}

// ---------- Modal helpers ----------
function openModal(id){
  document.getElementById(id).classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeAllModals(){
  document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));
  document.getElementById("videoWrap").innerHTML = "";
  document.body.style.overflow = "";
}
