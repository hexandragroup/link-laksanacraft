// =====================
// Link JS - Suggestion Only (Prioritaskan Huruf Awal)
// =====================

// Tampilkan tahun otomatis
const startYear = 2020;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

// Elemen utama
const categoriesEl = document.getElementById("categories");
const searchBox = document.getElementById("searchBox");
const suggestionsEl = document.getElementById("suggestions");

let allLinks = [];

// ---------------------
// Load semua JSON otomatis
// ---------------------
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

// ---------------------
// Setup kategori
// ---------------------
loadAllData().then(data => {
  allLinks = data;

  const categories = [...new Set(allLinks.map(item => item.category))];
  categories.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = `search/?cat=${encodeURIComponent(cat)}`;
    btn.addEventListener("click", e => {
      e.preventDefault();
      document.body.classList.add("fade-out");
      setTimeout(() => { window.location.href = btn.href; }, 500);
    });
    categoriesEl.appendChild(btn);
  });
});

// ---------------------
// 🔍 Pencarian suggestion dengan prioritas huruf awal
// ---------------------
searchBox.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();

  if (!keyword.trim()) {
    suggestionsEl.innerHTML = "";
    return;
  }

  // 1️⃣ Cari yang diawali huruf pencarian
  const startMatches = allLinks.filter(link =>
    link.title.toLowerCase().startsWith(keyword) ||
    link.category.toLowerCase().startsWith(keyword)
  );

  // 2️⃣ Jika hasil masih sedikit, tambahkan yang mengandung kata
  const includeMatches = allLinks.filter(link =>
    (link.title.toLowerCase().includes(keyword) ||
     link.category.toLowerCase().includes(keyword)) &&
    !startMatches.includes(link)
  );

  // Gabungkan: prioritas startsWith dulu
  const combined = [...startMatches, ...includeMatches].slice(0, 8);

  showSuggestions(combined, keyword);
});

// ---------------------
// 🔍 Tampilkan suggestion list
// ---------------------
function showSuggestions(suggestions, keyword) {
  if (!suggestions.length) {
    suggestionsEl.innerHTML = "";
    return;
  }

  const ul = document.createElement("ul");

  suggestions.forEach(link => {
    const li = document.createElement("li");
    li.innerHTML = `${link.icon || "🔗"} ${highlightMatch(link.title, keyword)}`;
    li.onclick = () => {
      window.open(link.url, "_blank");
      suggestionsEl.innerHTML = "";
      searchBox.value = link.title;
    };
    ul.appendChild(li);
  });

  suggestionsEl.innerHTML = "";
  suggestionsEl.appendChild(ul);
}

// ---------------------
// ✨ Fungsi highlight teks pencarian
// ---------------------
function highlightMatch(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

// ---------------------
// Tutup suggestion jika klik di luar
// ---------------------
document.addEventListener("click", e => {
  if (!suggestionsEl.contains(e.target) && e.target !== searchBox) {
    suggestionsEl.innerHTML = "";
  }
});

// ---------------------
// Google Translate styling
// ---------------------
function resizeGTranslate() {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.style.width = "100%";
    select.style.maxWidth = "420px";
    select.style.padding = "14px 24px";
    select.style.fontSize = "15px";
    select.style.boxSizing = "border-box";
  }
}
setTimeout(resizeGTranslate, 1000);
setTimeout(resizeGTranslate, 1500);
setTimeout(resizeGTranslate, 2000);