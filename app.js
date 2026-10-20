/* ===== Edit only this block ===== */
const CONFIG = {
  SUPABASE_URL: "https://wbzwximiwzmtrhzfgfuh.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_ivTAZp5q5X20IK523jcJhw_qFpQB66A",
  EMAIL_DOMAIN: "@outlook.com",
  SITE_NAME: "Rahat Khan",
  TAGLINE: "Thoughts, stories and ideas — written simply.",
  LOGO: "/images/rahat.png"
};
/* ================================= */

const sb = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const $ = (s, r = document) => r.querySelector(s);

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const readTime = (t = "") =>
  Math.max(1, Math.round(t.trim().split(/\s+/).length / 200)) + " min read";

const slugify = (t) =>
  t.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "post";

const postPath = (slug) => "/post/" + encodeURIComponent(slug);
const postUrl = (slug) => location.origin + postPath(slug);
const lines = (t) => t.split("\n").map((x) => x.trim()).filter(Boolean);
const isUrl = (u) => /^https?:\/\/\S+$/i.test(u);

const excerpt = (t = "", n = 130) =>
  t.replace(/!\[.*?\]\(.*?\)/g, "").replace(/[#*>`_[\]()]/g, "").trim().slice(0, n);

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(-50%) translateY(20px)";
    t.style.transition = "all .3s cubic-bezier(.22,1,.36,1)";
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Link copied");
  } catch {
    prompt("Copy this link:", text);
  }
}

function lightbox() {
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".prose img, .gallery img");
    if (!img) return;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img src="${esc(img.src)}" alt="">`;
    box.onclick = () => box.remove();
    document.body.appendChild(box);
  });
}

/* ---- SVG icon set ---- */
const ICONS = {
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  arrowUpRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>`,
  rss: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.1-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5Z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
};

/* ---- Header / Footer ---- */
function mountChrome(active) {
  const dark = document.documentElement.dataset.theme === "dark";
  const year = new Date().getFullYear();

  /* ---- HEADER ---- */
  $("#header").innerHTML = `
    <header class="site-header">
      <div class="container">
        <a class="brand" href="/" aria-label="${esc(CONFIG.SITE_NAME)} — home">
          <img src="${CONFIG.LOGO}" alt="" width="34" height="34" onerror="this.style.display='none'">
          <span>${esc(CONFIG.SITE_NAME)}</span>
        </a>

        <nav class="nav" id="nav" aria-label="Primary">
          <a href="/" class="${active === "home" ? "active" : ""}">Writing</a>
          <a href="/about" class="${active === "about" ? "active" : ""}">About</a>
          <a href="/contact" class="${active === "contact" ? "active" : ""}">Contact</a>
        </nav>

        <div class="nav-actions">
          <button class="icon-btn" id="theme" aria-label="Toggle theme" title="Toggle theme">
            ${dark ? ICONS.sun : ICONS.moon}
          </button>
          <button class="icon-btn nav-mobile-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
            ${ICONS.menu}
          </button>
        </div>
      </div>
    </header>
  `;

  /* Theme toggle */
  $("#theme").onclick = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    $("#theme").innerHTML = next === "dark" ? ICONS.sun : ICONS.moon;
  };

  /* Mobile nav — closes on link, escape, outside click */
  const nav = $("#nav");
  const toggle = $("#nav-toggle");
  let mobileOpen = false;

  const closeNav = () => {
    if (!mobileOpen) return;
    mobileOpen = false;
    nav.classList.remove("open");
    toggle.innerHTML = ICONS.menu;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };
  const openNav = () => {
    mobileOpen = true;
    nav.classList.add("open");
    toggle.innerHTML = ICONS.close;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  toggle.onclick = () => (mobileOpen ? closeNav() : openNav());
  nav.addEventListener("click", (e) => e.target.closest("a") && closeNav());

  document.addEventListener("keydown", (e) => e.key === "Escape" && closeNav());
  document.addEventListener("click", (e) => {
    if (mobileOpen && !e.target.closest(".site-header")) closeNav();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeNav();
  });

  /* ---- FOOTER ---- */
  const f = $("#footer");
  if (!f) return;

  const host = location.hostname.replace(/^www\./, "");
  const mail = `hi@${host}`;

  f.innerHTML = `
    <footer class="site-footer">
      <div class="container">

        <div class="footer-top">
          <div class="footer-brand">
            <a class="brand" href="/">
              <img src="${CONFIG.LOGO}" alt="" width="34" height="34" onerror="this.style.display='none'">
              <span>${esc(CONFIG.SITE_NAME)}</span>
            </a>
            <p class="footer-tagline">${esc(CONFIG.TAGLINE)}</p>
          </div>

          <div class="footer-col">
            <h4>Read</h4>
            <ul>
              <li><a href="/">All writing</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/archive">Archive</a></li>
              <li><a href="/rss.xml">RSS feed</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="/contact">Contact</a></li>
              <li><a href="mailto:${esc(mail)}">Email</a></li>
              <li><a href="#" rel="noopener">Twitter</a></li>
              <li><a href="#" rel="noopener">GitHub</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Site</h4>
            <ul>
              <li><a href="/admin">Admin</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/sitemap.xml">Sitemap</a></li>
              <li><a href="/rss.xml" class="footer-icon">${ICONS.rss}<span>Subscribe</span></a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© ${year} ${esc(CONFIG.SITE_NAME)}</span>
          <span class="footer-dot" aria-hidden="true">·</span>
          <span class="footer-note">Built with care</span>
          <div class="footer-social">
            <a href="mailto:${esc(mail)}" aria-label="Email">${ICONS.mail}</a>
            <a href="/rss.xml" aria-label="RSS">${ICONS.rss}</a>
            <a href="#" aria-label="GitHub">${ICONS.github}</a>
          </div>
        </div>

      </div>
    </footer>
  `;
}

/* Reveal-on-scroll for cards */
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}
