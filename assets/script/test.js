// ==================== Tahun Otomatis ====================
document.getElementById("year").textContent = new Date().getFullYear();

// ==================== Variabel Global ====================
const queryInput = document.getElementById("query");
const suggestions = document.getElementById("suggestions");
const categoriesEl = document.getElementById("categories");
const allCategoriesEl = document.getElementById("allCategories");
const categorySelect = document.getElementById("categorySelect");
let allLinks = [];
let debounceTimer;

// ==================== 🔍 PENCARIAN ====================
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

document.addEventListener("click", e => {
  if (!e.target.closest(".search-box")) {
    suggestions.style.display = "none";
  }
});

// ==================== 🏷️ KATEGORI ====================

// 🔹 Load semua data JSON (data1.json, data2.json, dst.)
async function loadAllData() {
  let dataArray = [];
  let i = 1;

  while (true) {
    const file = `assets/data${i}.json`;
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

loadAllData().then(data => {
  allLinks = data;
  if (!allLinks.length) {
    console.warn("⚠️ Tidak ada data JSON ditemukan di /assets/");
    return;
  }

  const categories = [...new Set(allLinks.map(i => i.category))];

  // 🔹 Maksimal 14 kategori utama
  const mainCategories = categories.slice(0, 14);
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

  // 🔹 Tambahkan tombol "Lihat Semua"
  const seeAllBtn = document.createElement("a");
  seeAllBtn.className = "category-btn see-all";
  seeAllBtn.textContent = "🔽 Lihat Semua";
  seeAllBtn.href = "#";
  seeAllBtn.onclick = e => {
    e.preventDefault();
    toggleAllCategories();
  };
  categoriesEl.appendChild(seeAllBtn);

  // 🔹 Isi dropdown kategori lengkap
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.textContent = cat;
    opt.value = cat;
    categorySelect.appendChild(opt);
  });
});

function toggleAllCategories() {
  allCategoriesEl.hidden = !allCategoriesEl.hidden;
  const seeAllBtn = document.querySelector(".category-btn.see-all");
  if (seeAllBtn) {
    seeAllBtn.textContent = allCategoriesEl.hidden ? "🔽 Lihat Semua" : "🔼 Tutup";
  }
}