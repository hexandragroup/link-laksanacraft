// ======================================================
// LAKSANA LINK - TEST.JS (FINAL - LIHAT SEMUA SELALU TERBUKA)
// ======================================================

// Tahun otomatis
document.getElementById("year").textContent = new Date().getFullYear();

// Elemen utama
const queryInput = document.getElementById("query");
const suggestions = document.getElementById("suggestions");
const categoriesEl = document.getElementById("categories");

let allLinks = [];
let debounceTimer;

// ==================== 🔍 PENCARIAN ==================== //
queryInput.addEventListener("input", e => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => showSuggestions(e.target.value.trim()), 250);
});

function showSuggestions(keyword) {
  suggestions.innerHTML = "";
  if (!keyword) {
    suggestions.style.display = "none";
    return;
  }

  const matches = allLinks.filter(link =>
    link.title.toLowerCase().includes(keyword.toLowerCase()) ||
    link.category.toLowerCase().includes(keyword.toLowerCase())
  );

  matches.slice(0, 50).forEach(link => {
    const a = document.createElement("a");
    a.textContent = `${link.icon} ${link.title}`;
    a.href = link.url;
    a.target = "_blank";
    suggestions.appendChild(a);
  });

  suggestions.style.display = matches.length ? "block" : "none";
}

// Tutup dropdown saran jika klik di luar
document.addEventListener("click", e => {
  if (!e.target.closest(".search-box")) {
    suggestions.style.display = "none";
  }
});

// ==================== 🏷️ KATEGORI ==================== //
async function loadAllData() {
  let dataArray = [];
  let i = 1;

  while (true) {
    const file = `assets/data${i}.json`; // ✅ karena ini versi test
    try {
      const res = await fetch(file);
      if (!res.ok) break;

      const data = await res.json();
      dataArray.push(...data);
      i++;
    } catch {
      break;
    }
  }

  return dataArray;
}

// Muat data dan tampilkan kategori
loadAllData().then(data => {
  allLinks = data;
  if (!allLinks.length) {
    console.warn("⚠️ Tidak ada data JSON ditemukan di /assets/");
    return;
  }

  const categories = [...new Set(allLinks.map(i => i.category))];
  const mainCategories = categories.slice(0, 14);

  // 🔹 Tambahkan 14 kategori utama
  mainCategories.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = "#";
    btn.onclick = e => {
      e.preventDefault();
      showSuggestions(cat);
      queryInput.value = cat;
    };
    categoriesEl.appendChild(btn);
  });

  // 🔹 Tombol "Lihat Semua"
  const seeAllBtn = document.createElement("a");
  seeAllBtn.className = "category-btn see-all";
  seeAllBtn.textContent = "🔽 Lihat Semua";
  categoriesEl.appendChild(seeAllBtn);

  // 🔹 Dropdown semua kategori (selalu tampil)
  const select = document.createElement("select");
  select.className = "category-select";
  select.innerHTML = `<option value="">🏷️ Pilih Kategori</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.textContent = cat;
    opt.value = cat;
    select.appendChild(opt);
  });
  categoriesEl.appendChild(select);

  // 🔹 Pilih kategori dari dropdown
  select.onchange = e => {
    const cat = e.target.value;
    if (cat) {
      queryInput.value = cat;
      showSuggestions(cat);
    }
  };
});