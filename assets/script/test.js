// Tahun Otomatis
const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

// Simulasi Data JSON
const allLinks = [
  { title: "Google", url: "https://google.com", icon: "🔍", category: "Search" },
  { title: "YouTube", url: "https://youtube.com", icon: "▶️", category: "Media" },
  { title: "GitHub", url: "https://github.com", icon: "💻", category: "Dev" },
  { title: "Wikipedia", url: "https://wikipedia.org", icon: "📘", category: "Reference" },
  { title: "Instagram", url: "https://instagram.com", icon: "📷", category: "Social" },
  { title: "Twitter", url: "https://x.com", icon: "🐦", category: "Social" },
  { title: "Canva", url: "https://canva.com", icon: "🎨", category: "Design" },
  { title: "Figma", url: "https://figma.com", icon: "🧩", category: "Design" },
  { title: "Bing", url: "https://bing.com", icon: "🪩", category: "Search" },
  { title: "ChatGPT", url: "https://chat.openai.com", icon: "🤖", category: "AI" },
];

// ==================== 🔍 PENCARIAN ==================== //
const queryInput = document.getElementById("query");
const suggestions = document.getElementById("suggestions");
let debounceTimer;

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

// Tutup dropdown jika klik di luar
document.addEventListener("click", e => {
  if (!e.target.closest(".search-box")) {
    suggestions.style.display = "none";
  }
});

// ==================== 🏷️ KATEGORI ==================== //
const categoriesEl = document.getElementById("categories");
const showAllBtn = document.getElementById("showAllBtn");
const allCategoriesEl = document.getElementById("allCategories");
const categorySelect = document.getElementById("categorySelect");

// Ambil kategori unik
const categories = [...new Set(allLinks.map(i => i.category))];

// Render kategori populer (maks 20 → 10 baris × 2 kolom)
categories.slice(0, 20).forEach(cat => {
  const btn = document.createElement("a");
  btn.className = "category-btn";
  btn.textContent = cat;
  categoriesEl.appendChild(btn);
});

// Isi dropdown semua kategori
categories.forEach(cat => {
  const opt = document.createElement("option");
  opt.textContent = cat;
  categorySelect.appendChild(opt);
});

showAllBtn.onclick = () => {
  allCategoriesEl.hidden = !allCategoriesEl.hidden;
  showAllBtn.textContent = allCategoriesEl.hidden ? "🔽 Lihat Semua" : "🔼 Tutup";
};