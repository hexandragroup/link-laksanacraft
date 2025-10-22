// =====================
// Link JS - Suggestion + Kategori Select
// =====================

// 🕒 Tahun otomatis
const startYear = 2020;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

// Elemen utama
const searchBox = document.getElementById("searchBox");
const suggestionsEl = document.getElementById("suggestions");
const categorySelect = document.getElementById("categorySelect");

// Container untuk link
const container = document.createElement("div");
container.id = "linkContainer";
document.querySelector(".container").appendChild(container);

let allLinks = [];
const linkCache = {};

// ---------------------
// 📁 Loading awal
container.innerHTML = "<p>🔄 Memuat...</p>";

// ---------------------
// 📁 Load semua JSON otomatis
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
// ⚙️ Setup kategori select
loadAllData().then(data => {
  allLinks = data;
  container.innerHTML = ""; // hapus loading setelah data siap

  const allCategories = [...new Set(allLinks.map(item => item.category))];

  const limitedCategories = allCategories.slice(0, 14); // prioritas
  const extraCategories = allCategories.slice(14);
  const finalCategories = [...limitedCategories, ...extraCategories];

  // Render semua kategori di select
  finalCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
});

// ---------------------
// Pilih kategori
categorySelect.addEventListener("change", e => {
  const selectedCat = e.target.value;
  if (!selectedCat) return;

  // Load link sesuai kategori
  if (!linkCache[selectedCat]) {
    linkCache[selectedCat] = allLinks.filter(link => link.category === selectedCat);
  }
  renderLinks(linkCache[selectedCat]);
});

// ---------------------
// Render link
function renderLinks(data) {
  container.innerHTML = "";
  data.forEach(link => {
    const a = document.createElement("a");
    a.className = "btn";
    a.href = link.url;
    a.textContent = link.title || link.text;
    a.target = "_blank";
    container.appendChild(a);
  });
}

// ---------------------
// 🔍 Suggestion search
searchBox.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  if (!keyword.trim()) {
    suggestionsEl.innerHTML = "";
    return;
  }

  const startMatches = allLinks.filter(link =>
    link.title.toLowerCase().startsWith(keyword) ||
    link.category.toLowerCase().startsWith(keyword)
  );

  const includeMatches = allLinks.filter(link =>
    (link.title.toLowerCase().includes(keyword) ||
      link.category.toLowerCase().includes(keyword)) &&
    !startMatches.includes(link)
  );

  const combined = [...startMatches, ...includeMatches].slice(0, 8);
  showSuggestions(combined, keyword);
});

// ---------------------
// 💡 Tampilkan suggestion
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
// ✨ Highlight pencarian
function highlightMatch(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

// ---------------------
// ❌ Tutup suggestion jika klik di luar
document.addEventListener("click", e => {
  if (!suggestionsEl.contains(e.target) && e.target !== searchBox) {
    suggestionsEl.innerHTML = "";
  }
});