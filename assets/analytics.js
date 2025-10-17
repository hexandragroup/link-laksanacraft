/* ======================================================
   CORE JS – Jarang diubah / stabil
   ====================================================== */

/* --- Tahun dinamis --- */
const startYear = 1990;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

/* --- Fungsi pencarian utama --- */
function goSearch(e) {
  e.preventDefault();
  const q = document.getElementById("query").value.trim();
  if (q) window.location.href = "https://link.laksanacraft.my.id/search?q=" + encodeURIComponent(q);
  else alert("Masukkan kata kunci pencarian!");
}

/* --- Tab Navigasi (Utama / Toko / Sosial) --- */
const tabFiles = { utama: "links/utama.json", toko: "links/toko.json", sosial: "links/sosial.json" };
const linkCache = {};

function loadLinks(tab) {
  const container = document.getElementById(tab);
  if (linkCache[tab]) {
    container.innerHTML = "";
    linkCache[tab].forEach(link => {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = link.url;
      a.textContent = link.text;
      container.appendChild(a);
    });
    return;
  }
  container.innerHTML = "<p>🔄 Memuat...</p>";
  fetch(tabFiles[tab]).then(res => res.json())
    .then(data => {
      linkCache[tab] = data;
      container.innerHTML = "";
      data.forEach(link => {
        const a = document.createElement("a");
        a.className = "btn";
        a.href = link.url;
        a.textContent = link.text;
        container.appendChild(a);
      });
    }).catch(() => container.innerHTML = "<p>⚠️ Gagal memuat link.</p>");
}

function showTab(id) {
  document.querySelectorAll(".tab-buttons button").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelector(`.tab-buttons button[onclick="showTab('${id}')"]`).classList.add("active");
  const tab = document.getElementById(id);
  tab.classList.add("active");
  loadLinks(id);
  if (window.innerWidth < 600) tab.scrollIntoView({ behavior: "smooth", block: "start" });
}

loadLinks("utama");

/* --- Tombol pojok & menu swipe (mobile) --- */
const cornerTab = document.getElementById("cornerTab");
const cornerMenu = document.getElementById("cornerMenu");

cornerTab.addEventListener("click", e => {
  e.stopPropagation();
  cornerMenu.classList.add("show");
  cornerTab.style.opacity = "0";
  cornerTab.style.pointerEvents = "none";
});

document.addEventListener("click", e => {
  if (!cornerMenu.contains(e.target) && !cornerTab.contains(e.target)) {
    cornerMenu.classList.remove("show");
    cornerTab.style.opacity = "1";
    cornerTab.style.pointerEvents = "auto";
  }
});

let touchStartX = 0;
document.addEventListener("touchstart", e => touchStartX = e.touches[0].clientX);
document.addEventListener("touchend", e => {
  const touchEndX = e.changedTouches[0].clientX;
  if (cornerMenu.classList.contains("show") && touchEndX < touchStartX - 50) {
    cornerMenu.classList.remove("show");
    cornerTab.style.opacity = "1";
    cornerTab.style.pointerEvents = "auto";
  }
});

/* --- Load Produk (stabil) --- */
let products = [];
let loading = true;
async function loadAllProducts() {
  const files = [];
  let i = 1;
  while(true){
    const file = `https://link.laksanacraft.my.id/search/data/products${i}.json`;
    try {
      const res = await fetch(file);
      if(!res.ok) break;
      const json = await res.json();
      files.push(json);
      i++;
    } catch { break; }
  }
  products = files.flat();
  loading = false;
}
loadAllProducts();

/* ======================================================
   Google Analytics / Tag Manager (stabil)
   ====================================================== */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-V1JWDFFYK2');

/* ======================================================
   Google Translate (stabil)
   ====================================================== */
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'id' }, 'google_translate_element');
}

function doGTranslate(el) {
  if (el.value === '') return;
  var lang = el.value.split('|')[1];
  if (lang === 'id') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
    location.href = "https://link.laksanacraft.my.id/";
    return;
  }
  var select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
}

/* Muat script translate Google secara dinamis */
const gtScript = document.createElement('script');
gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.head.appendChild(gtScript);