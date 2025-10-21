// ======================================================
// LAKSANA LINK - TEST.JS (FINAL - LIHAT SEMUA DI DALAM DROPDOWN)
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
    const file = `assets/data${i}.json`; // ✅ versi test.html
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

  // 🔹 14 kategori utama
  mainCategories.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = "#";
    btn.onclick = e => {
      e.preventDefault();
      queryInput.value = cat;
      showSuggestions(cat);
    };
    categoriesEl.appendChild(btn);
  });

  // 🔹 Dropdown kategori + opsi "Lihat Semua"
  const select = document.createElement("select");
  select.className = "category-select";
  select.innerHTML = `<option value="">🏷️ Pilih Kategori</option>`;

  // Tambahkan kategori utama dulu
  mainCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.textContent = cat;
    opt.value = cat;
    select.appendChild(opt);
  });

  // Tambahkan opsi "🔽 Lihat Semua Kategori"
  const seeAllOpt = document.createElement("option");
  seeAllOpt.textContent = "🔽 Lihat Semua Kategori";
  seeAllOpt.value = "__all__";
  select.appendChild(seeAllOpt);

  categoriesEl.appendChild(select);

  // 🔹 Saat memilih kategori
  select.onchange = e => {
    const cat = e.target.value;
    if (cat === "__all__") {
      // Jika pilih "Lihat Semua", ganti isi dropdown jadi semua kategori
      select.innerHTML = `<option value="">🏷️ Pilih Kategori</option>`;
      categories.forEach(fullCat => {
        const opt = document.createElement("option");
        opt.textContent = fullCat;
        opt.value = fullCat;
        select.appendChild(opt);
      });
      select.value = ""; // reset pilihan
      return;
    }

    if (cat) {
      queryInput.value = cat;
      showSuggestions(cat);
    }
  };
});