/* ===== Edit only this block ===== */
const CONFIG = {
  SUPABASE_URL: "https://wbzwximiwzmtrhzfgfuh.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_ivTAZp5q5X20IK523jcJhw_qFpQB66A",
  EMAIL_DOMAIN: "@outlook.com",
  SITE_NAME: "Rahat Khan",
  TAGLINE: "Thoughts, stories and ideas, written simply.",
  LOGO: "/images/rahat.png",
  EMAIL: "rahatkhan04@outlook.com",
  /* Footer + home links. type: tiktok | instagram | facebook | x | whatsapp | email */
  SOCIAL: [
    { type: "tiktok",    handle: "@unpredictable_rahat", url: "https://www.tiktok.com/@unpredictable_rahat" },
    { type: "instagram", handle: "@hi_im_rahat",         url: "https://www.instagram.com/hi_im_rahat" },
    { type: "facebook",  handle: "Rahat Khan",           url: "https://www.facebook.com/share/1CTnugjfQC/" },
    { type: "email",     handle: "rahatkhan04@outlook.com", url: "mailto:rahatkhan04@outlook.com" }
  ]
};
/* ================================= */

/* If the Supabase script fails to load (slow network), pages show an
   error state with a retry button instead of crashing. */
const sb = window.supabase
  ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : null;

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);

const esc = (s = "") =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

const fmtDate = (d) => {
  const x = new Date(d);
  return isNaN(x) ? "" : x.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const wordCount = (t) => (t || "").trim().split(/\s+/).filter(Boolean).length;

const readTime = (t) => Math.max(1, Math.round(wordCount(t) / 200)) + " min read";

/* \p{M} keeps Bengali vowel signs (matras) inside slugs. */
const slugify = (t) =>
  (t || "").trim().toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "post";

const postPath = (slug) => "/post/" + encodeURIComponent(slug);
const postUrl = (slug) => location.origin + postPath(slug);
const lines = (t) => (t || "").split("\n").map((x) => x.trim()).filter(Boolean);
const isUrl = (u) => /^https?:\/\/\S+$/i.test(u);

const plain = (t) =>
  (t || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const excerpt = (t, n = 150) => {
  const s = plain(t);
  return s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";
};

/* ---------- SVG icons (no emoji anywhere) ---------- */
const ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  chevLeft: '<path d="m15 18-6-6 6-6"/>',
  chevRight: '<path d="m9 18 6-6-6-6"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="m1 1 22 22"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  bold: '<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/>',
  italic: '<path d="M19 4h-9M14 20H5M15 4 9 20"/>',
  heading: '<path d="M6 4v16M18 4v16M6 12h12"/>',
  quote: '<path d="M10 11H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6c0 2-1 4-4 4M20 11h-4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6c0 2-1 4-4 4"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  tiktok: '<path d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>'
};

const FILLED = {
  facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
};

const icon = (name, size = 18) =>
  FILLED[name]
    ? `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="${FILLED[name]}"/></svg>`
    : `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ""}</svg>`;

/* ---------- Markdown (sanitized) ---------- */
if (window.DOMPurify) {
  DOMPurify.addHook("afterSanitizeAttributes", (n) => {
    if (n.tagName === "A" && /^https?:/i.test(n.getAttribute("href") || "")) {
      n.setAttribute("target", "_blank");
      n.setAttribute("rel", "noopener noreferrer");
    }
  });
}

function renderMD(src) {
  const text = src || "";
  if (!window.marked || !window.DOMPurify)
    return `<p>${esc(text).replace(/\n/g, "<br>")}</p>`;

  const clean = DOMPurify.sanitize(marked.parse(text, { gfm: true, breaks: true }));
  const tpl = document.createElement("template");
  tpl.innerHTML = clean;

  tpl.content.querySelectorAll("p > img[alt]").forEach((img) => {
    const p = img.parentElement;
    if (p.children.length === 1 && !p.textContent.trim() && img.alt.trim()) {
      const fig = document.createElement("figure");
      const cap = document.createElement("figcaption");
      cap.textContent = img.alt;
      fig.append(img, cap);
      p.replaceWith(fig);
    }
  });
  tpl.content.querySelectorAll("img").forEach((i) => {
    i.loading = "lazy";
    i.decoding = "async";
  });
  return tpl.innerHTML;
}

/* ---------- Feedback: toast, copy, dialog ---------- */
function toast(msg, type = "ok") {
  let box = $("#toasts");
  if (!box) {
    box = document.createElement("div");
    box.id = "toasts";
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);
  }
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.innerHTML = `${icon(type === "error" ? "alert" : "check", 18)}<span>${esc(msg)}</span>`;
  box.appendChild(t);
  setTimeout(() => {
    t.classList.add("out");
    setTimeout(() => t.remove(), 200);
  }, type === "error" ? 4200 : 2400);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return toast("Link copied");
  } catch { /* fall through to legacy copy */ }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { /* ignore */ }
  ta.remove();
  ok ? toast("Link copied") : prompt("Copy this link:", text);
}

function confirmDialog({ title, message, confirm = "Confirm", cancel = "Cancel", danger = false }) {
  return new Promise((resolve) => {
    const prev = document.activeElement;
    const o = document.createElement("div");
    o.className = "modal";
    o.innerHTML = `
      <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" aria-describedby="dlg-m">
        <h2 id="dlg-t">${esc(title)}</h2>
        <p id="dlg-m">${esc(message)}</p>
        <div class="dialog-actions">
          <button type="button" class="btn btn-ghost" data-r="0">${esc(cancel)}</button>
          <button type="button" class="btn ${danger ? "btn-danger-solid" : "btn-primary"}" data-r="1">${esc(confirm)}</button>
        </div>
      </div>`;
    const close = (v) => {
      document.removeEventListener("keydown", key);
      o.remove();
      document.documentElement.classList.remove("lock");
      if (prev && prev.focus) prev.focus();
      resolve(v);
    };
    const key = (e) => {
      if (e.key === "Escape") return close(false);
      if (e.key !== "Tab") return;
      const f = [...o.querySelectorAll("button")];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    o.addEventListener("click", (e) => {
      if (e.target === o) return close(false);
      const b = e.target.closest("[data-r]");
      if (b) close(b.dataset.r === "1");
    });
    document.addEventListener("keydown", key);
    document.body.appendChild(o);
    document.documentElement.classList.add("lock");
    o.querySelector('[data-r="0"]').focus();
  });
}

/* ---------- Image lightbox (Esc, arrows, close button) ---------- */
function lightbox() {
  const SEL = ".prose img, .gallery img, .cover";
  let box = null, imgs = [], idx = 0, prev = null;

  const show = (i) => {
    idx = (i + imgs.length) % imgs.length;
    const src = imgs[idx];
    box.querySelector("img").src = src.currentSrc || src.src;
    box.querySelector("img").alt = src.alt || "";
    const c = box.querySelector(".lb-count");
    if (c) c.textContent = `${idx + 1} / ${imgs.length}`;
  };
  const close = () => {
    document.removeEventListener("keydown", key);
    box.remove();
    box = null;
    document.documentElement.classList.remove("lock");
    if (prev && prev.focus) prev.focus();
  };
  const key = (e) => {
    if (e.key === "Escape") close();
    else if (imgs.length > 1 && e.key === "ArrowRight") show(idx + 1);
    else if (imgs.length > 1 && e.key === "ArrowLeft") show(idx - 1);
  };

  document.addEventListener("click", (e) => {
    const img = e.target.closest(SEL);
    if (!img || box) return;
    prev = img;
    imgs = [...document.querySelectorAll(SEL)];
    const many = imgs.length > 1;
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.innerHTML = `
      <button type="button" class="lb-btn lb-close" aria-label="Close image">${icon("close", 22)}</button>
      ${many ? `<button type="button" class="lb-btn lb-prev" aria-label="Previous image">${icon("chevLeft", 24)}</button>
      <button type="button" class="lb-btn lb-next" aria-label="Next image">${icon("chevRight", 24)}</button>
      <div class="lb-count" aria-hidden="true"></div>` : ""}
      <img alt="">`;
    box.addEventListener("click", (ev) => {
      if (ev.target.closest(".lb-close") || ev.target === box || ev.target.tagName === "IMG") return close();
      if (ev.target.closest(".lb-prev")) return show(idx - 1);
      if (ev.target.closest(".lb-next")) return show(idx + 1);
    });
    document.body.appendChild(box);
    document.documentElement.classList.add("lock");
    document.addEventListener("keydown", key);
    show(imgs.indexOf(img));
    box.querySelector(".lb-close").focus();
  });
}

/* ---------- Reading progress bar (article page) ---------- */
function readingProgress() {
  if ($(".progress")) return;
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<i></i>";
  document.body.appendChild(bar);
  const fill = bar.firstChild;
  let queued = false;
  const update = () => {
    queued = false;
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    fill.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
  };
  addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ---------- Shared card markup ---------- */
const coverOf = (p) => p.cover_image_url || (p.images && p.images[0]) || "";

const thumbHTML = (p, cls = "") => {
  const img = coverOf(p);
  return img
    ? `<img class="thumb ${cls}" loading="lazy" decoding="async" src="${esc(img)}" alt="">`
    : `<div class="thumb thumb-empty ${cls}">${icon("file", 28)}</div>`;
};

const metaHTML = (p) =>
  `<div class="meta"><time datetime="${esc(p.created_at)}">${fmtDate(p.created_at)}</time><span>${readTime(p.content)}</span></div>`;

const cardHTML = (p) => {
  const ex = excerpt(p.content);
  return `<a class="card" href="${postPath(p.slug)}">
    ${thumbHTML(p)}
    <div class="card-body">${metaHTML(p)}<h3>${esc(p.title)}</h3>${ex ? `<p>${esc(ex)}</p>` : ""}</div>
  </a>`;
};

const featureHTML = (p) => {
  const ex = excerpt(p.content, 220);
  const has = !!coverOf(p);
  return `<a class="feature${has ? "" : " no-img"}" href="${postPath(p.slug)}">
    ${has ? thumbHTML(p) : ""}
    <div class="feature-body">${metaHTML(p)}<h3>${esc(p.title)}</h3>${ex ? `<p>${esc(ex)}</p>` : ""}
      <span class="more-link">Read article ${icon("arrowRight", 16)}</span></div>
  </a>`;
};

/* Broken thumbnails fall back to the neutral placeholder. */
document.addEventListener("error", (e) => {
  const t = e.target;
  if (t && t.tagName === "IMG" && t.classList.contains("thumb")) {
    const d = document.createElement("div");
    d.className = t.className + " thumb-empty";
    d.innerHTML = icon("file", 28);
    t.replaceWith(d);
  }
}, true);

/* ---------- Site chrome ---------- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem("theme", t);
  let m = $('meta[name="theme-color"]');
  if (!m) { m = document.createElement("meta"); m.name = "theme-color"; document.head.appendChild(m); }
  m.content = t === "dark" ? "#0E1215" : "#F7F8F9";
}

function mountChrome(active) {
  const initial = (CONFIG.SITE_NAME || "R").trim().charAt(0).toUpperCase();
  const dark = () => document.documentElement.dataset.theme === "dark";
  const admin = active === "admin";

  const brand = (cls = "") => `
    <a class="brand ${cls}" href="/" aria-label="${esc(CONFIG.SITE_NAME)} home">
      <span class="brand-mark" aria-hidden="true">${esc(initial)}<img src="${esc(CONFIG.LOGO)}" alt="" onerror="this.remove()"></span>
      <span class="brand-name">${esc(CONFIG.SITE_NAME)}</span>
    </a>`;

  $("#header").innerHTML = `
    <a class="skip" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container">
        ${brand()}
        <nav class="nav" aria-label="Primary">
          <a class="nav-link${active === "home" ? " active" : ""}" href="/"${active === "home" ? ' aria-current="page"' : ""}>${admin ? "View site" : "Home"}</a>
          <button type="button" class="icon-btn" id="theme"></button>
          <button type="button" class="icon-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">${icon("menu", 22)}</button>
        </nav>
      </div>
    </header>
    <div class="drawer" id="drawer" hidden>
      <div class="drawer-scrim" data-close></div>
      <aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="drawer-top">
          ${brand("drawer-brand")}
          <button type="button" class="icon-btn" id="menu-close" aria-label="Close menu">${icon("close", 22)}</button>
        </div>
        <nav class="drawer-nav" aria-label="Menu">
          <a href="/">${icon("home", 20)}<span>${admin ? "View site" : "Home"}</span></a>
          ${admin ? "" : `<a href="/#search">${icon("search", 20)}<span>Search articles</span></a>`}
          <a href="/admin">${icon("lock", 20)}<span>Admin</span></a>
          <button type="button" id="theme2"></button>
        </nav>
        <p class="drawer-foot">&copy; ${new Date().getFullYear()} ${esc(CONFIG.SITE_NAME)}</p>
      </aside>
    </div>`;

  const paint = () => {
    const b = $("#theme");
    b.innerHTML = icon(dark() ? "sun" : "moon", 20);
    b.setAttribute("aria-label", dark() ? "Switch to light theme" : "Switch to dark theme");
    $("#theme2").innerHTML = `${icon(dark() ? "sun" : "moon", 20)}<span>${dark() ? "Light theme" : "Dark theme"}</span>`;
  };
  paint();
  const flip = () => { applyTheme(dark() ? "light" : "dark"); paint(); };
  $("#theme").onclick = $("#theme2").onclick = flip;
  applyTheme(document.documentElement.dataset.theme || "light");

  /* three-bar menu drawer */
  const drawer = $("#drawer"), openBtn = $("#menu-btn");
  const onKey = (e) => {
    if (e.key === "Escape") return closeMenu();
    if (e.key !== "Tab") return;
    const f = [...drawer.querySelectorAll("a[href],button")];
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  };
  function openMenu() {
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add("open"));
    openBtn.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("lock");
    document.addEventListener("keydown", onKey);
    $("#menu-close").focus();
  }
  function closeMenu() {
    drawer.classList.remove("open");
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("lock");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => { if (!drawer.classList.contains("open")) drawer.hidden = true; }, 220);
    openBtn.focus();
  }
  openBtn.onclick = openMenu;
  $("#menu-close").onclick = closeMenu;
  drawer.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) return closeMenu();
    const a = e.target.closest("a[href]");
    if (a && a.getAttribute("href").startsWith("/#") && location.pathname === "/") closeMenu();
  });

  const f = $("#footer");
  if (f) {
    const LABEL = { tiktok: "TikTok", instagram: "Instagram", facebook: "Facebook", x: "X", whatsapp: "WhatsApp", email: "Email" };
    const links = (CONFIG.SOCIAL || []).filter((x) => LABEL[x.type] && /^(https?:|mailto:)/i.test(x.url || ""));
    const ico = (t, n) => icon(t === "email" ? "mail" : t, n);
    const rel = (u) => (u.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener noreferrer"');
    const socials = links.map((x) =>
      `<a class="foot-social" href="${esc(x.url)}"${rel(x.url)} aria-label="${LABEL[x.type]}" title="${LABEL[x.type]}">${ico(x.type, 18)}</a>`).join("");
    const connect = links.map((x) =>
      `<a href="${esc(x.url)}"${rel(x.url)}>${ico(x.type, 16)}<span>${esc(x.type === "email" ? LABEL.email : LABEL[x.type])}<small>${esc(x.handle || "")}</small></span></a>`).join("");
    f.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          ${CONFIG.EMAIL ? `<div class="foot-cta">
            <div><h2>Let&rsquo;s connect</h2><p>Questions, ideas or collaborations? Send me a message.</p></div>
            <a class="btn btn-primary" href="mailto:${esc(CONFIG.EMAIL)}">${icon("mail", 18)}<span>Email me</span></a>
          </div>` : ""}
          <div class="foot-grid">
            <div class="foot-brand">
              ${brand()}
              <p>${esc(CONFIG.TAGLINE)}</p>
              ${socials ? `<div class="foot-socials">${socials}</div>` : ""}
            </div>
            <nav class="foot-col" aria-label="Explore">
              <h2>Explore</h2>
              <a href="/">Latest articles</a>
              ${admin ? "" : `<a href="/#search">Search articles</a>`}
              <a href="/admin">Admin sign in</a>
            </nav>
            ${connect ? `<nav class="foot-col foot-connect" aria-label="Connect"><h2>Connect</h2>${connect}</nav>` : ""}
          </div>
          <div class="foot-bottom">
            <span>&copy; ${new Date().getFullYear()} ${esc(CONFIG.SITE_NAME)}. All rights reserved.</span>
            <div class="foot-actions">
              <button type="button" class="btn btn-ghost btn-sm" id="dark-link"></button>
              <button type="button" class="btn btn-ghost btn-sm" id="to-top">${icon("arrowUp", 16)}<span>Back to top</span></button>
            </div>
          </div>
        </div>
      </footer>`;
    $("#to-top").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const paintLink = () => ($("#dark-link").innerHTML = `${icon(dark() ? "sun" : "moon", 16)}<span>${dark() ? "Light" : "Dark"} theme</span>`);
    paintLink();
    $("#dark-link").onclick = () => { flip(); paintLink(); };
    $("#theme").addEventListener("click", paintLink);
    $("#theme2").addEventListener("click", paintLink);
  }
}
