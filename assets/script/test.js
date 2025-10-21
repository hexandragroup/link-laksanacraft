// =====================
// Link JS (Versi Lengkap dengan Search Suggestion)
// =====================

// Tampilkan tahun
const startYear = 2020;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

// Elemen utama
const categoriesEl = document.getElementById("categories");
const resultsEl = document.getElementById("results");
const paginationEl = document.getElementById("pagination");
const searchBox = document.getElementById("searchBox");
const suggestionsEl = document.getElementById("suggestions"); // 💡 tambahan

// Data
let allLinks = [];
let filteredLinks = [];
let currentPage = 1;
const perPage = 10;

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
// Setup kategori & tampilan
// ---------------------
loadAllData().then(data => {
  allLinks = data;

  // Ambil kategori unik
  const categories = [...new Set(allLinks.map(item => item.category))];

  // Render kategori
  categories.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = `search/?cat=${encodeURIComponent(cat)}`;

    btn.addEventListener("click", e => {
      e.preventDefault();
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = btn.href;
      }, 500);
    });

    categoriesEl.appendChild(btn);
  });
});

// ---------------------
// Pencarian global
// ---------------------
searchBox.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  currentPage = 1;

  // Kosongkan jika input kosong
  if (!keyword.trim()) {
    resultsEl.innerHTML = "";
    paginationEl.innerHTML = "";
    suggestionsEl.innerHTML = ""; // 💡 tambahan
    return;
  }

  // Prioritas startsWith
  let startMatches = allLinks.filter(link =>
    link.title.toLowerCase().startsWith(keyword) ||
    link.category.toLowerCase().startsWith(keyword)
  );

  // Jika tidak ada, cari includes
  let includeMatches = [];
  if (startMatches.length === 0) {
    includeMatches = allLinks.filter(link =>
      link.title.toLowerCase().includes(keyword) ||
      link.category.toLowerCase().includes(keyword)
    );
  }

  filteredLinks = startMatches.length > 0 ? startMatches : includeMatches;

  // 💡 tampilkan suggestion otomatis
  const suggestions = filteredLinks.slice(0, 8);
  showSuggestions(suggestions, keyword);

  renderPage();
});

// ---------------------
// Render hasil pencarian & pagination
// ---------------------
function renderPage() {
  resultsEl.innerHTML = "";
  paginationEl.innerHTML = "";

  const totalPages = Math.ceil(filteredLinks.length / perPage);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const visible = filteredLinks.slice(start, end);

  if (!visible.length) {
    resultsEl.innerHTML = "<p>Tidak ada hasil.</p>";
    return;
  }

  visible.forEach((link, i) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.className = "btn result-btn";
    a.textContent = `${link.icon} ${link.title}`;
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

// ---------------------
// 🔍 FITUR SUGGESTION (AUTOCOMPLETE)
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

function highlightMatch(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

// Tutup suggestion kalau klik di luar
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