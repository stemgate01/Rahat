/* ===== Edit only this block ===== */
const CONFIG = {
  SUPABASE_URL: "https://wbzwximiwzmtrhzfgfuh.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_ivTAZp5q5X20IK523jcJhw_qFpQB66A",
  EMAIL_DOMAIN: "@rahatkhan.com",   // typing "admin" logs in as admin@rahatkhan.com
  SITE_NAME: "Rahat Khan",
  TAGLINE: "Thoughts, stories and ideas — written simply.",
  LOGO: "/images/rahat.png"
};
/* ================================= */

const sb = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
const $ = (s, r = document) => r.querySelector(s);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const readTime = (t = "") => Math.max(1, Math.round(t.trim().split(/\s+/).length / 200)) + " min read";
const slugify = (t) => t.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "post";
const postPath = (slug) => "/post/" + encodeURIComponent(slug);
const postUrl = (slug) => location.origin + postPath(slug);
const lines = (t) => t.split("\n").map((x) => x.trim()).filter(Boolean);
const isUrl = (u) => /^https?:\/\/\S+$/i.test(u);
const excerpt = (t = "", n = 130) => t.replace(/!\[.*?\]\(.*?\)/g, "").replace(/[#*>`_\[\]()]/g, "").trim().slice(0, n);

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
}
async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast("Link copied ✓"); } catch { prompt("Copy this link:", text); }
}
function lightbox() {
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".prose img, .gallery img");
    if (!img) return;
    const box = document.createElement("div");
    box.className = "lightbox"; box.innerHTML = `<img src="${esc(img.src)}" alt="">`;
    box.onclick = () => box.remove(); document.body.appendChild(box);
  });
}
function mountChrome(active) {
  const dark = document.documentElement.dataset.theme === "dark";
  $("#header").innerHTML = `<header class="site-header"><div class="container">
    <a class="brand" href="/"><img src="${CONFIG.LOGO}" alt="" onerror="this.style.display='none'"><span>${esc(CONFIG.SITE_NAME)}</span></a>
    <nav class="nav"><a href="/" class="${active === "home" ? "active" : ""}">Home</a>
    <button class="icon-btn" id="theme" aria-label="Toggle theme">${dark ? "☀️" : "🌙"}</button></nav></div></header>`;
  const f = $("#footer");
  if (f) f.innerHTML = `<footer class="site-footer"><div class="container"><span>© ${new Date().getFullYear()} ${esc(CONFIG.SITE_NAME)}. All rights reserved.</span><a href="/admin">Admin</a></div></footer>`;
  $("#theme").onclick = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next; localStorage.setItem("theme", next);
    $("#theme").textContent = next === "dark" ? "☀️" : "🌙";
  };
}
