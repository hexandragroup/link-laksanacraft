// ======================================================
// Daftar alias
// ======================================================
const BASES = {
  "www": "https://www.laksanacraft.my.id",
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
// Ganti alias untuk data manual (utama, sosial, toko)
// ======================================================
function replaceAliasManual(item) {
  for (let key in BASES) {
    const baseUrl = BASES[key];
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

// ======================================================
// Ganti alias untuk produk (products*.json) otomatis
// ======================================================
function replaceAliasProducts(item) {
  for (let key in BASES) {
    const baseUrl = BASES[key];
    ["link", "url"].forEach(prop => {
      if (item[prop] && !item[prop].startsWith("http") && item[prop].includes("/")) {
        const parts = item[prop].split("/");
        if (parts[0] === key) {
          item[prop] = baseUrl + "/" + parts.slice(1).join("/");
        }
      }
    });
    if (item.varian) {
      item.varian.forEach(v => {
        if (v.link && !v.link.startsWith("http") && v.link.includes("/")) {
          const parts = v.link.split("/");
          if (parts[0] === key) {
            v.link = baseUrl + "/" + parts.slice(1).join("/");
          }
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
      data.forEach(item => replaceAliasProducts(item));
      dataArray.push(...data);
      i++;
    } catch {
      break;
    }
  }
  return dataArray;
}

// ======================================================
// Load file manual (utama, sosial, toko, dll.)
// ======================================================
async function loadManualFiles(files = []) {
  let dataArray = [];
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

// ======================================================
// Load semua data & setup kategori
// ======================================================
async function loadAll() {
  const manualData = await loadManualFiles([
    "/assets/config/utama.json",
    "/assets/config/toko.json",
    "/assets/config/sosial.json"
  ]);

  const productsData = await loadProducts();

  allLinks = [...manualData, ...productsData];

  const categories = [...new Set(allLinks.map(item => item.category).filter(Boolean))];
  categoriesEl.innerHTML = "";
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

  if (!keyword.trim()) {
    resultsEl.innerHTML = "";
    paginationEl.innerHTML = "";
    return;
  }

  let startMatches = allLinks.filter(link =>
    (link.title && link.title.toLowerCase().startsWith(keyword)) ||
    (link.text && link.text.toLowerCase().startsWith(keyword)) ||
    (link.category && link.category.toLowerCase().startsWith(keyword))
  );

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