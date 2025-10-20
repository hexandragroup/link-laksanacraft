// --- Tahun Dinamis ---
const startYear = 1990;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? startYear + "–" + currentYear : startYear;

// --- Data & Label ---
let products = [];
const labels = {
  ukuran: {
    miniatur: "Miniatur",
    "20, 25, 30cm": "20, 25, 30cm",
    standar: "Standar Pedalangan"
  },
  kualitas: { murah: "Murah", sedang: "Sedang", alusan: "Alusan" }
};
const groupAliases = {
  punakawan: ["semar", "gareng", "petruk", "bagong"],
  pandawa: ["arjuna", "nakula", "sadewa", "bima", "puntadewa"]
};

// --- Helper Functions ---
function escapeHtml(s) {
  return s
    ? String(s).replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[m]))
    : "";
}
function escapeAttr(s) { return escapeHtml(s); }
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }

function matchesGroup(tokoh, group) {
  return groupAliases[group]?.some(t => tokoh.includes(t));
}

// --- Form Submit ---
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  doFilterSearch();
});

// --- Filter Search ---
function doFilterSearch() {
  const tokoh = document.getElementById("tokoh").value.toLowerCase();
  const ukuran = document.getElementById("ukuran").value;
  const kualitas = document.getElementById("kualitas").value;
  const out = document.getElementById("results");
  out.innerHTML = "";

  if (!tokoh && !ukuran && !kualitas) {
    out.innerHTML =
      "<p style='color:red;'>⚠️ Silakan pilih minimal satu kriteria pencarian.</p>";
    return;
  }

  const filtered = products.filter(p =>
    (tokoh ? (
      p.tokoh.some(t => t.toLowerCase().includes(tokoh)) ||
      (tokoh === "punakawan" && matchesGroup(p.tokoh, "punakawan")) ||
      (tokoh === "pandawa" && matchesGroup(p.tokoh, "pandawa"))
    ) : true) &&
    (ukuran
      ? ukuran === "20, 25, 30cm"
        ? ["20cm", "25cm", "30cm"].some(u =>
            Array.isArray(p.ukuran) ? p.ukuran.includes(u) : p.ukuran === u
          )
        : ukuran === "standar"
        ? Array.isArray(p.ukuran)
          ? p.ukuran.includes("Standar Pedalangan")
          : p.ukuran === "Standar Pedalangan"
        : Array.isArray(p.ukuran)
        ? p.ukuran.includes(ukuran)
        : p.ukuran === ukuran
      : true) &&
    (kualitas ? p.kualitas === kualitas : true)
  );

  renderResults(filtered);
}

// --- Query Param (/?q=...) ---
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function checkQueryParam() {
  const q = getQueryParam("q");
  if (!q) return;
  const out = document.getElementById("results");
  out.innerHTML = "<p>🔎 Hasil pencarian untuk: <b>" + escapeHtml(q) + "</b></p>";

  const qLower = q.toLowerCase();
  const filtered = products.filter(p =>
    p.tokoh.some(t => t.toLowerCase().includes(qLower)) ||
    (qLower === "punakawan" && matchesGroup(p.tokoh, "punakawan")) ||
    (qLower === "pandawa" && matchesGroup(p.tokoh, "pandawa")) ||
    (p.ukuran &&
      (Array.isArray(p.ukuran)
        ? p.ukuran.some(u => u.toLowerCase().includes(qLower))
        : p.ukuran.toLowerCase().includes(qLower))) ||
    (p.kualitas && p.kualitas.toLowerCase().includes(qLower))
  );

  renderResults(filtered);
}

// --- Render Hasil ---
function renderResults(list) {
  const out = document.getElementById("results");
  if (list.length === 0) {
    out.innerHTML += "<p>Tidak ada produk ditemukan.</p>";
    return;
  }

  list.forEach(p => {
    let tokohList = p.tokoh.map(capitalize);
    if (matchesGroup(p.tokoh, "punakawan")) tokohList.unshift("(Punakawan)");
    if (matchesGroup(p.tokoh, "pandawa")) tokohList.unshift("(Pandawa)");

    let varianTable = "";
    if (p.varian && Array.isArray(p.varian)) {
      varianTable += "<table class='variant-table'><tr><th>Ukuran</th><th>Harga</th></tr>";
      p.varian.forEach(v => {
        varianTable += `<tr><td>${escapeHtml(v.size)}</td><td>${escapeHtml(v.harga)}</td></tr>`;
      });
      varianTable += "</table>";
    }

    let ukuranLabel = Array.isArray(p.ukuran)
      ? p.ukuran.map(u => labels.ukuran[u] || u).join(", ")
      : labels.ukuran[p.ukuran] || p.ukuran;

    out.innerHTML += `
      <div class="result">
        <p><strong>Tokoh:</strong> ${escapeHtml(tokohList.join(", "))}</p>
        <p><strong>Kualitas:</strong> ${escapeHtml(labels.kualitas[p.kualitas] || p.kualitas)}</p>
        <p><strong>Ukuran:</strong> ${escapeHtml(ukuranLabel)}</p>
        ${varianTable}
        <p><a href="${escapeAttr(p.link)}" target="_blank">🔗 Detail Produk</a></p>
      </div>
    `;
  });
}

/* === Autocomplete Tokoh dengan Highlight === */
function setupAutocomplete(products) {
  const input = document.getElementById("tokoh");
  const suggestionBox = document.getElementById("tokoh-suggestions");

  suggestionBox.style.maxHeight = "250px";
  suggestionBox.style.overflowY = "auto";

  const tokohSet = new Set();
  products.forEach(p => {
    if (Array.isArray(p.tokoh)) p.tokoh.forEach(t => tokohSet.add(capitalize(t)));
  });
  tokohSet.add("Punakawan");
  tokohSet.add("Pandawa");
  const tokohList = Array.from(tokohSet);

  input.addEventListener("input", function() {
    const val = this.value.toLowerCase();
    suggestionBox.innerHTML = "";
    if (!val) return;

    // Filter matches
    let matches = tokohList.filter(t => t.toLowerCase().startsWith(val));
    if (matches.length === 0) matches = tokohList.filter(t => t.toLowerCase().includes(val));

    matches.forEach(t => {
      const div = document.createElement("div");
      // Highlight matching substring
      const regex = new RegExp(`(${val})`, 'gi');
      div.innerHTML = t.replace(regex, '<b>$1</b>');
      div.style.padding = "6px 10px";
      div.style.cursor = "pointer";
      div.addEventListener("mouseenter", () => div.style.background = "#eee");
      div.addEventListener("mouseleave", () => div.style.background = "");
      div.addEventListener("click", () => {
        input.value = t;
        suggestionBox.innerHTML = "";
      });
      suggestionBox.appendChild(div);
    });
  });

  document.addEventListener("click", e => {
    if (e.target !== input) suggestionBox.innerHTML = "";
  });
}

// --- Load Semua Produk ---
async function loadAllProducts() {
  const files = [];
  let i = 1;
  while (true) {
    const file = `data/products${i}.json`;
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
  return files.flat();
}

// --- Inisialisasi ---
loadAllProducts()
  .then(data => {
    products = data;
    setupAutocomplete(products);
    checkQueryParam();
  })
  .catch(() => {
    document.getElementById("results").innerHTML =
      "<p style='color:red;'>⚠️ Gagal memuat data produk.</p>";
  });

// ======================================================
// Daftar alias (ganti sesuai kebutuhan)
// ======================================================
const BASES = {
  "#": "https://www.laksanacraft.my.id",
  "url": "https://url.laksanacraft.my.id",
  "link": "https://link.laksanacraft.my.id",
  "blog": "https://blog.laksanacraft.my.id",
  "shop": "https://shop.laksanacraft.my.id"
};

// ======================================================
// Element references
// ======================================================
const categoriesEl = document.getElementById("categories");
const resultsEl = document.getElementById("results");
const paginationEl = document.getElementById("pagination");
const searchBox = document.getElementById("searchBox");

let allLinks = [];
let filteredLinks = [];
let currentPage = 1;
const perPage = 10;

// ======================================================
// Fungsi mengganti alias
// ======================================================
function replaceAlias(item) {
  for (let key in BASES) {
    const baseUrl = BASES[key];

    if (item.url && item.url.startsWith(key)) {
      item.url = item.url.replace(new RegExp("^" + key), baseUrl);
    }
    if (item.link && item.link.startsWith(key)) {
      item.link = item.link.replace(new RegExp("^" + key), baseUrl);
    }
    if (item.varian) {
      item.varian.forEach(v => {
        if (v.link && v.link.startsWith(key)) {
          v.link = v.link.replace(new RegExp("^" + key), baseUrl);
        }
      });
    }
  }
}

// ======================================================
// Load semua products*.json otomatis
// ======================================================
async function loadProducts() {
  let dataArray = [];
  let i = 1;
  while (true) {
    const file = `/assets/products${i}.json`;
    try {
      const res = await fetch(file);
      if (!res.ok) break;
      const data = await res.json();
      data.forEach(item => replaceAlias(item));
      dataArray.push(...data);
      i++;
    } catch {
      break;
    }
  }
  return dataArray;
}

// ======================================================
// Load file manual (utama.json, sosial.json, dll.)
// ======================================================
async function loadManualFiles(files = []) {
  let dataArray = [];
  for (let file of files) {
    try {
      const res = await fetch(file);
      if (!res.ok) continue;
      const data = await res.json();
      data.forEach(item => replaceAlias(item));
      dataArray.push(...data);
    } catch (err) {
      console.error("Gagal load", file, err);
    }
  }
  return dataArray;
}

// ======================================================
// Load semua data dan setup kategori
// ======================================================
async function loadAll() {
  const manualData = await loadManualFiles([
    "/assets/config/utama.json",
    "/assets/config/toko.json",
    "/assets/config/sosial.json"
  ]);
  const productsData = await loadProducts();

  allLinks = [...manualData, ...productsData];

  // Setup kategori unik
  const categories = [...new Set(allLinks.map(item => item.category).filter(Boolean))];
  categories.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = `search.html?cat=${encodeURIComponent(cat)}`;

    btn.addEventListener("click", e => {
      e.preventDefault();
      document.body.classList.add("fade-out");
      setTimeout(() => { window.location.href = btn.href; }, 500);
    });

    categoriesEl.appendChild(btn);
  });
}

// ======================================================
// Render hasil pencarian & pagination
// ======================================================
function renderPage() {
  resultsEl.innerHTML = "";
  paginationEl.innerHTML = "";

  const totalPages = Math.ceil(filteredLinks.length / perPage);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const visible = filteredLinks.slice(start, end);

  if (visible.length === 0) {
    resultsEl.innerHTML = "<p>Tidak ada hasil.</p>";
    return;
  }

  visible.forEach((link, i) => {
    const a = document.createElement("a");
    a.href = link.url || link.link || "#";
    a.className = "btn result-btn";
    a.textContent = `${link.icon || ""} ${link.title || link.text || ""}`;
    a.target = "_blank";
    a.style.animationDelay = `${i * 0.05}s`;
    resultsEl.appendChild(a);
  });

  // Pagination
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "page-btn" + (i === currentPage ? " active" : "");
      btn.onclick = () => changePage(i);
      paginationEl.appendChild(btn);
    }
  }
}

function changePage(page) {
  currentPage = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderPage();
}

// ======================================================
// Pencarian global: prioritas startsWith
// ======================================================
searchBox.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  currentPage = 1;

  if (keyword.trim() === "") {
    resultsEl.innerHTML = "";
    paginationEl.innerHTML = "";
    return;
  }

  // startsWith prioritas
  let startMatches = allLinks.filter(link =>
    (link.title && link.title.toLowerCase().startsWith(keyword)) ||
    (link.text && link.text.toLowerCase().startsWith(keyword)) ||
    (link.category && link.category.toLowerCase().startsWith(keyword))
  );

  // jika tidak ada, cari yang includes
  let includeMatches = [];
  if (startMatches.length === 0) {
    includeMatches = allLinks.filter(link =>
      (link.title && link.title.toLowerCase().includes(keyword)) ||
      (link.text && link.text.toLowerCase().includes(keyword)) ||
      (link.category && link.category.toLowerCase().includes(keyword))
    );
  }

  filteredLinks = startMatches.length > 0 ? startMatches : includeMatches;
  renderPage();
});

// ======================================================
// Jalankan semua
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  loadAll();
});