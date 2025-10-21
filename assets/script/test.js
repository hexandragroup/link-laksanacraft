// ======================================================
// LAKSANA LINK - TEST.JS (FINAL LENGKAP)
// ======================================================

// Tahun otomatis di footer
document.getElementById("year").textContent = new Date().getFullYear();

// Ambil elemen penting
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

document.addEventListener("click", e => {
  if (!e.target.closest(".search-box")) {
    suggestions.style.display = "none";
  }
});

// ==================== 🔄 LOAD SEMUA DATA JSON ==================== //
async function loadAllData() {
  const dataArray = [];
  let i = 1;

  // 🔹 Path absolut agar bisa jalan dari folder manapun (termasuk /search/)
  const basePath = `${window.location.origin}/assets/`;

  while (true) {
    const fileUrl = `${basePath}data${i}.json`;

    try {
      const res = await fetch(fileUrl);
      if (!res.ok) {
        console.info(`ℹ️ Berhenti memuat di data${i}.json — file tidak ditemukan.`);
        break;
      }

      const jsonData = await res.json();

      // Pastikan data berbentuk array
      if (Array.isArray(jsonData)) {
        dataArray.push(...jsonData);
      } else {
        console.warn(`⚠️ Format data${i}.json tidak valid (bukan array), dilewati.`);
      }

      i++;
    } catch (err) {
      console.error(`❌ Gagal memuat ${fileUrl}:`, err);
      break;
    }
  }

  console.log(`✅ Total ${dataArray.length} item dimuat dari ${i - 1} file JSON.`);
  return dataArray;
}

// ==================== 🏷️ KATEGORI ==================== //
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

  // 🔹 Tambahkan tombol + dropdown "Lihat Semua"
  const seeAllWrapper = document.createElement("div");
  seeAllWrapper.className = "category-seeall-wrapper";

  const seeAllBtn = document.createElement("a");
  seeAllBtn.className = "category-btn see-all";
  seeAllBtn.textContent = "🔽 Lihat Semua";
  seeAllBtn.href = "#";
  seeAllWrapper.appendChild(seeAllBtn);

  // 🔹 Dropdown semua kategori
  const select = document.createElement("select");
  select.className = "category-select";
  select.innerHTML = `<option value="">🏷️ Pilih Kategori</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.textContent = cat;
    opt.value = cat;
    select.appendChild(opt);
  });
  select.hidden = true;
  seeAllWrapper.appendChild(select);

  // 🔹 Klik "Lihat Semua"
  seeAllBtn.onclick = e => {
    e.preventDefault();
    const show = select.hidden;
    select.hidden = !show;
    seeAllBtn.textContent = show ? "🔼 Tutup" : "🔽 Lihat Semua";
    if (show) {
      seeAllWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // 🔹 Pilih kategori dari dropdown
  select.onchange = e => {
    const cat = e.target.value;
    if (cat) {
      queryInput.value = cat;
      showSuggestions(cat);
    }
  };

  categoriesEl.appendChild(seeAllWrapper);
});