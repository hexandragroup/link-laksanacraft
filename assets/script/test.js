// =====================
// Link JS - Suggestion + Kategori Terbatas
// =====================

// 🕒 Tahun otomatis
const startYear = 2020;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

// Elemen utama
const categoriesEl = document.getElementById("categories");
const searchBox = document.getElementById("searchBox");
const suggestionsEl = document.getElementById("suggestions");

// Container link
const container = document.createElement("div");
container.id = "linkContainer";
document.querySelector(".container").appendChild(container);

// Tampilkan loading saat halaman pertama
container.innerHTML = "<p>🔄 Memuat kategori...</p>";

let allLinks = [];
const linkCache = {};

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
// Setup kategori (maks 14 + dropdown)
// ---------------------
loadAllData().then(data => {
  allLinks = data;
  container.innerHTML = ""; // hapus loading setelah data siap

  const allCategories = [...new Set(allLinks.map(item => item.category))];
  const limitedCategories = allCategories.slice(0, 14);

  // Render 14 kategori pertama
  limitedCategories.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = `search/?cat=${encodeURIComponent(cat)}`;
    btn.addEventListener("click", e => {
      e.preventDefault();
      loadLinksByCategory(cat);
    });
    categoriesEl.appendChild(btn);
  });

  // Dropdown kategori tambahan
  if (allCategories.length > 14) {
    const moreBtn = document.createElement("button");
    moreBtn.className = "category-btn";
    moreBtn.textContent = "⬇️ Lihat Kategori Lain";
    moreBtn.style.background = "#ccc";
    moreBtn.style.fontWeight = "bold";
    categoriesEl.appendChild(moreBtn);

    const dropdown = document.createElement("div");
    dropdown.className = "category-dropdown";

    allCategories.slice(14).forEach(cat => {
      const item = document.createElement("div");
      item.textContent = cat;
      item.className = "dropdown-item";
      item.onclick = () => loadLinksByCategory(cat);
      dropdown.appendChild(item);
    });

    categoriesEl.appendChild(dropdown);

    moreBtn.addEventListener("click", e => {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", e => {
      if (!dropdown.contains(e.target) && e.target !== moreBtn) {
        dropdown.style.display = "none";
      }
    });
  }
});

// ---------------------
// Fungsi load link per kategori
// ---------------------
function loadLinksByCategory(cat) {
  if (!linkCache[cat]) {
    linkCache[cat] = allLinks.filter(link => link.category === cat);
  }
  renderLinks(linkCache[cat]);
}

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
// Search suggestion
// ---------------------
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
// Tampilkan suggestion
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
// Highlight hasil search
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
// Styling Google Translate
// ---------------------
function resizeGTranslate() {
  const select = document.querySelector(".goog-te-combo");
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