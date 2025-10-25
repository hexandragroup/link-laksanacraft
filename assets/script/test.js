/* ======================================================
   MAIN JS
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
  if (q)
    window.location.href =
      "https://link.laksanacraft.my.id/page/search?q=" + encodeURIComponent(q);
  else alert("Masukkan kata kunci pencarian!");
}

/* --- Tab Navigasi (Utama / Toko / Sosial) --- */
const tabFiles = {
  utama: "assets/config/utama.json",
  toko: "assets/config/toko.json",
  sosial: "assets/config/sosial.json"
};
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
  fetch(tabFiles[tab])
    .then(res => res.json())
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
    })
    .catch(() => (container.innerHTML = "<p>⚠️ Gagal memuat link.</p>"));
}

function showTab(id) {
  document
    .querySelectorAll(".tab-buttons button")
    .forEach(b => b.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach(t => t.classList.remove("active"));
  document
    .querySelector(`.tab-buttons button[onclick="showTab('${id}')"]`)
    .classList.add("active");
  const tab = document.getElementById(id);
  tab.classList.add("active");
  loadLinks(id);
  if (window.innerWidth < 600)
    tab.scrollIntoView({ behavior: "smooth", block: "start" });
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
document.addEventListener("touchstart", e => (touchStartX = e.touches[0].clientX));
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
  while (true) {
    const file = `https://link.laksanacraft.my.id/page/search/data/products${i}.json`;
    try {
      const res = await fetch(file);
      if (!res.ok) break;
      const json = await res.json();
      files.push(json);
      i++;
    } catch {
      break;
    }
  }
  products = files.flat();
  loading = false;
}
loadAllProducts();

/* --- Variabel global --- */
const queryInput = document.getElementById("query");
const suggestionsBox = document.getElementById("suggestions");

// Scroll untuk kotak saran
suggestionsBox.style.maxHeight = "300px";
suggestionsBox.style.overflowY = "auto";

/* --- Fungsi Highlight Lembut --- */
function highlightText(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "ig");
  return text.replace(
    regex,
    `<b style="background-color:#ffebc2;color:#b33;">$1</b>`
  );
}

/* --- Event Input: Auto-saran (tanpa duplikat) --- */
queryInput.addEventListener("input", function () {
  const val = this.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!products.length) {
    suggestionsBox.innerHTML = "<div>⏳ Memuat data produk...</div>";
    return;
  }
  if (!val) return;

  // 🔹 Gunakan Map untuk mencegah duplikat tokoh
  const tokohMap = new Map();
  const ukuranSet = new Set();
  const kualitasSet = new Set();

  products.forEach(p => {
    if (Array.isArray(p.tokoh)) {
      p.tokoh.forEach(t => {
        const lower = t.toLowerCase();
        if (!tokohMap.has(lower)) tokohMap.set(lower, t);
      });
    }

    if (p.ukuran)
      (Array.isArray(p.ukuran) ? p.ukuran : [p.ukuran]).forEach(u => ukuranSet.add(u));

    if (p.kualitas) kualitasSet.add(p.kualitas);
  });

  // Gabungkan semua kategori menjadi satu list
  const allList = [
    ...Array.from(tokohMap.values()).map(t => `tokoh:${t}`),
    ...Array.from(ukuranSet).map(u => `ukuran:${u}`),
    ...Array.from(kualitasSet).map(k => `kualitas:${k}`)
  ];

  // --- Prioritas: startsWith dulu, baru includes ---
  const startsWithMatches = allList.filter(k =>
    k.split(":")[1].toLowerCase().startsWith(val)
  );
  const includesMatches = allList.filter(k => {
    const value = k.split(":")[1].toLowerCase();
    return !value.startsWith(val) && value.includes(val);
  });

  const matches = [...startsWithMatches, ...includesMatches];

  if (!matches.length) {
    suggestionsBox.innerHTML =
      "<div style='padding:10px;color:#777;'>❌ Tidak ditemukan hasil cocok.</div>";
    return;
  }

  // --- Tampilkan hasil ---
  matches.forEach(match => {
    const [type, value] = match.split(":");
    const div = document.createElement("div");
    div.style.padding = "8px 10px";
    div.style.borderBottom = "1px solid #eee";
    div.style.cursor = "pointer";

    let label = "";
    if (type === "tokoh") label = "👤 Tokoh: ";
    else if (type === "ukuran") label = "📏 Ukuran: ";
    else if (type === "kualitas") label = "⭐ Kualitas: ";

    const displayValue = value.charAt(0).toUpperCase() + value.slice(1);
    div.innerHTML = label + highlightText(displayValue, val);

    div.onclick = () => {
      // Tidak langsung redirect, hanya isi input
      queryInput.value = displayValue;
      suggestionsBox.innerHTML = "";
    };

    suggestionsBox.appendChild(div);
  });
});

// Theme switcher
const themeSelector = document.getElementById("themeSelector");
const themeLink = document.createElement("link");
themeLink.id = "theme-style";
themeLink.rel = "stylesheet";
document.head.appendChild(themeLink);

// Opsi placeholder awal
const defaultText = "🎨 Pilih Tema";
const defaultValue = "base";

// Muat tema tersimpan
let savedTheme = localStorage.getItem("theme") || defaultValue;
themeLink.href = savedTheme === defaultValue 
    ? "assets/style/style.css" 
    : `assets/style/themes/${savedTheme}.css`;

// Set teks dan value dropdown
themeSelector.value = savedTheme;
updatePlaceholderText(savedTheme);

// Fungsi update placeholder
function updatePlaceholderText(val) {
  const firstOption = themeSelector.querySelector('option[value="base"]');
  if(val === defaultValue) {
    firstOption.textContent = defaultText; // Pilih Tema
  } else {
    firstOption.textContent = "🎨 Default"; // Setelah ganti tema
  }
}

// Ganti tema saat dipilih
themeSelector.addEventListener("change", () => {
  const val = themeSelector.value;
  if (!val) return;

  // Ganti stylesheet
  themeLink.href = val === defaultValue
      ? "assets/style/style.css"
      : `assets/style/themes/${val}.css`;

  // Simpan di localStorage
  localStorage.setItem("theme", val);

  // Update teks placeholder
  updatePlaceholderText(val);
});