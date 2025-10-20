/* ======================================================
   🔸 MAIN JS – Laksana Link (Versi Lengkap)
   ====================================================== */

/* ======================================================
   🔹 Tahun Dinamis
   ====================================================== */
const startYear = 1990;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;


/* ======================================================
   🔹 Fungsi Pencarian Utama
   ====================================================== */
function goSearch(e) {
  e.preventDefault();
  const q = document.getElementById("query").value.trim();
  if (q)
    window.location.href =
      "https://link.laksanacraft.my.id/page/search?q=" + encodeURIComponent(q);
  else alert("Masukkan kata kunci pencarian!");
}


/* ======================================================
   🔹 Tab Navigasi (Utama / Toko / Sosial)
   ====================================================== */
const tabFiles = {
  utama: "assets/config/utama.json",
  toko: "assets/config/toko.json",
  sosial: "assets/config/sosial.json"
};
const linkCache = {};

async function loadLinks(tab) {
  const container = document.getElementById(tab);
  if (linkCache[tab]) {
    renderLinks(container, linkCache[tab]);
    return;
  }

  container.innerHTML = "<p>🔄 Memuat...</p>";
  try {
    const res = await fetch(tabFiles[tab]);
    const data = await res.json();
    linkCache[tab] = data;
    renderLinks(container, data);
  } catch {
    container.innerHTML = "<p>⚠️ Gagal memuat link.</p>";
  }
}

function renderLinks(container, data) {
  container.innerHTML = "";
  data.forEach(link => {
    const a = document.createElement("a");
    a.className = "btn";
    a.href = link.url;
    a.textContent = link.text;
    container.appendChild(a);
  });
}

function showTab(id) {
  document.querySelectorAll(".tab-buttons button").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelector(`.tab-buttons button[onclick="showTab('${id}')"]`).classList.add("active");

  const tab = document.getElementById(id);
  tab.classList.add("active");
  loadLinks(id);

  if (window.innerWidth < 600)
    tab.scrollIntoView({ behavior: "smooth", block: "start" });
}

loadLinks("utama");


/* ======================================================
   🔹 Tombol Pojok & Swipe Menu (Mobile)
   ====================================================== */
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
document.addEventListener("touchstart", e => (touchStartX = e.touches[0].clientX));
document.addEventListener("touchend", e => {
  const touchEndX = e.changedTouches[0].clientX;
  if (cornerMenu.classList.contains("show") && touchEndX < touchStartX - 50) {
    cornerMenu.classList.remove("show");
    cornerTab.style.opacity = "1";
    cornerTab.style.pointerEvents = "auto";
  }
});


/* ======================================================
   🔹 Load Semua Produk (Auto products1.json dst)
   ====================================================== */
let products = [];
let loading = true;

async function loadAllProducts() {
  const all = [];
  let i = 1;
  while (true) {
    const file = `https://link.laksanacraft.my.id/page/search/data/products${i}.json`;
    try {
      const res = await fetch(file);
      if (!res.ok) break;
      const json = await res.json();
      all.push(...json);
      i++;
    } catch {
      break;
    }
  }
  products = all;
  loading = false;
}
loadAllProducts();


/* ======================================================
   🔹 Auto-saran Pencarian (Tokoh, Ukuran, Kualitas)
   ====================================================== */
const queryInput = document.getElementById("query");
const suggestionsBox = document.getElementById("suggestions");

suggestionsBox.style.maxHeight = "300px";
suggestionsBox.style.overflowY = "auto";

/* --- Grup Tokoh --- */
const GROUP_ALIASES = {
  punakawan: ["semar", "gareng", "petruk", "bagong"],
  pandawa: ["arjuna", "bima", "nakula", "sadewa", "puntadewa"]
};

function getGroupName(tokohName) {
  for (let group in GROUP_ALIASES) {
    if (GROUP_ALIASES[group].includes(tokohName.toLowerCase())) {
      return group;
    }
  }
  return null;
}

/* --- Highlight Lembut --- */
function highlightText(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "ig");
  return text.replace(regex, `<b style="background-color:#ffebc2;color:#b33;">$1</b>`);
}

/* --- Event Input: Auto-saran --- */
queryInput.addEventListener("input", function () {
  const val = this.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";

  if (loading) {
    suggestionsBox.innerHTML = "<div>⏳ Memuat data produk...</div>";
    return;
  }
  if (!val) return;

  // 🔹 Kumpulkan keyword unik
  const tokohMap = new Map(); // key = tokoh kecil, value = tampilan dengan grup
  const ukuranSet = new Set();
  const kualitasSet = new Set();

  products.forEach(p => {
    if (Array.isArray(p.tokoh)) {
      p.tokoh.forEach(t => {
        const lower = t.toLowerCase();
        if (!tokohMap.has(lower)) {
          const group = getGroupName(lower);
          const label = group
            ? `${t.charAt(0).toUpperCase() + t.slice(1)} (${group.charAt(0).toUpperCase() + group.slice(1)})`
            : t.charAt(0).toUpperCase() + t.slice(1);
          tokohMap.set(lower, label);
        }
      });
    }

    if (p.ukuran)
      (Array.isArray(p.ukuran) ? p.ukuran : [p.ukuran])
        .forEach(u => ukuranSet.add(u));

    if (p.kualitas)
      kualitasSet.add(p.kualitas);
  });

  // Tambahkan nama grup utama
  if (!tokohMap.has("punakawan")) tokohMap.set("punakawan", "Punakawan");
  if (!tokohMap.has("pandawa")) tokohMap.set("pandawa", "Pandawa");

  // Gabung semua
  const allList = [
    ...Array.from(tokohMap.entries()).map(([k, v]) => `tokoh:${v}:${k}`),
    ...Array.from(ukuranSet).map(u => `ukuran:${u}`),
    ...Array.from(kualitasSet).map(k => `kualitas:${k}`)
  ];

  // 🔹 Filter prioritas
  const startsWithMatches = allList.filter(k => {
    const valPart = k.split(":")[1].toLowerCase();
    return valPart.startsWith(val);
  });
  const includesMatches = allList.filter(k => {
    const valPart = k.split(":")[1].toLowerCase();
    return !valPart.startsWith(val) && valPart.includes(val);
  });
  const matches = [...startsWithMatches, ...includesMatches];

  if (!matches.length) {
    suggestionsBox.innerHTML =
      "<div style='padding:10px;color:#777;'>❌ Tidak ditemukan hasil cocok.</div>";
    return;
  }

  // 🔹 Render hasil saran unik
  matches.forEach(match => {
    const parts = match.split(":");
    const type = parts[0];
    const display = parts[1];
    const value = parts[2] || parts[1]; // jika tokoh, value = nama asli (tanpa grup)
    const div = document.createElement("div");
    div.style.padding = "8px 10px";
    div.style.borderBottom = "1px solid #eee";
    div.style.cursor = "pointer";

    let label = "";
    if (type === "tokoh") label = "👤 ";
    else if (type === "ukuran") label = "📏 ";
    else if (type === "kualitas") label = "⭐ ";

    div.innerHTML = label + highlightText(display, val);

    div.onclick = () => {
      queryInput.value = display;
      suggestionsBox.innerHTML = "";
      window.location.href =
        `https://link.laksanacraft.my.id/page/search?q=${encodeURIComponent(value)}`;
    };

    suggestionsBox.appendChild(div);
  });
});


/* ======================================================
   🔹 Alias URL (untuk config JSON)
   ====================================================== */
const BASES_MANUAL = {
  www: "https://www.laksanacraft.my.id",
  url: "https://url.laksanacraft.my.id",
  link: "https://link.laksanacraft.my.id",
  blog: "https://blog.laksanacraft.my.id",
  shop: "https://shop.laksanacraft.my.id"
};

function replaceAliasManual(item) {
  for (let key in BASES_MANUAL) {
    const baseUrl = BASES_MANUAL[key];
    ["link", "url"].forEach(prop => {
      if (item[prop] && !item[prop].startsWith("http") && item[prop].startsWith(key)) {
        item[prop] = baseUrl + item[prop].substring(key.length);
      }
    });
    if (item.varian) {
      item.varian.forEach(v => {
        if (v.link && !v.link.startsWith("http") && v.link.startsWith(key)) {
          v.link = baseUrl + v.link.substring(key.length);
        }
      });
    }
  }
}

async function loadManualFiles(files = []) {
  const dataArray = [];
  for (let file of files) {
    try {
      const res = await fetch(file);
      if (!res.ok) continue;
      const data = await res.json();
      data.forEach(item => replaceAliasManual(item));
      dataArray.push(...data);
    } catch (err) {
      console.error("Gagal load", file, err);
    }
  }
  return dataArray;
}

document.addEventListener("DOMContentLoaded", async () => {
  const manualData = await loadManualFiles([
    "/assets/config/utama.json",
    "/assets/config/toko.json",
    "/assets/config/sosial.json"
  ]);
  console.log("Data manual:", manualData);
});