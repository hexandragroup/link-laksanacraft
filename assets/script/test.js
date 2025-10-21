// Tahun otomatis
document.getElementById("year").textContent = new Date().getFullYear();

// Elemen utama
const queryInput = document.getElementById("query");
const suggestions = document.getElementById("suggestions");
const categoriesEl = document.getElementById("categories");
const showAllBtn = document.getElementById("showAllBtn");
const allCategoriesEl = document.getElementById("allCategories");
const categorySelect = document.getElementById("categorySelect");

let allLinks = [];
let debounceTimer;

// ===================================================
// 🔹 Ambil semua data JSON nyata
// ===================================================
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

// ===================================================
// 🔹 Jalankan setelah data dimuat
// ===================================================
loadAllData().then(data => {
  allLinks = data;
  if (!allLinks.length) {
    alert("❌ Tidak ada data ditemukan di folder assets/");
    return;
  }

  // Kategori unik
  const categories = [...new Set(allLinks.map(item => item.category))];

  // Render kategori utama
  categories.slice(0, 20).forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = "#";
    btn.onclick = e => {
      e.preventDefault();
      showCategoryLinks(cat);
    };
    categoriesEl.appendChild(btn);
  });

  // Isi dropdown kategori
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.textContent = cat;
    opt.value = cat;
    categorySelect.appendChild(opt);
  });
});

// ===================================================
// 🔹 Pencarian dengan debounce + dropdown
// ===================================================
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
    a.textContent = `${link.icon || "🔗"} ${link.title}`;
    a.href = link.url;
    a.target = "_blank";
    suggestions.appendChild(a);
  });

  suggestions.style.display = matches.length ? "block" : "none";
}

// Tutup dropdown jika klik di luar
document.addEventListener("click", e => {
  if (!e.target.closest(".search-box")) {
    suggestions.style.display = "none";
  }
});

// ===================================================
// 🔹 Tampilkan tautan dalam kategori
// ===================================================
function showCategoryLinks(cat) {
  suggestions.innerHTML = "";
  const matches = allLinks.filter(link => link.category === cat);
  if (!matches.length) return;

  matches.forEach(link => {
    const a = document.createElement("a");
    a.textContent = `${link.icon || "🔗"} ${link.title}`;
    a.href = link.url;
    a.target = "_blank";
    suggestions.appendChild(a);
  });
  suggestions.style.display = "block";
}

// ===================================================
// 🔹 Tombol “Lihat Semua”
// ===================================================
showAllBtn.onclick = () => {
  allCategoriesEl.hidden = !allCategoriesEl.hidden;
  showAllBtn.textContent = allCategoriesEl.hidden ? "🔽 Lihat Semua" : "🔼 Tutup";
};

categorySelect.onchange = e => {
  if (e.target.value) {
    showCategoryLinks(e.target.value);
  }
};

// ===================================================
// 🔹 Google Translate
// ===================================================
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'id' }, 'google_translate_element');
}