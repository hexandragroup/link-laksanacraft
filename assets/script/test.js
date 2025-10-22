// =====================
// Link JS - 14 Tombol + Dropdown Kategori Lainnya
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
// ⚙️ Setup kategori
loadAllData().then(data => {
  allLinks = data;
  container.innerHTML = ""; // hapus loading setelah data siap

  const allCategories = [...new Set(allLinks.map(item => item.category))];

  const limitedCategories = allCategories.slice(0, 14);
  const extraCategories = allCategories.slice(14);

  // Render 14 tombol utama
  limitedCategories.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = `search/?cat=${encodeURIComponent(cat)}`;
    btn.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = btn.href;
    });
    categoriesEl.appendChild(btn);
  });

  // Tombol kategori lainnya (dropdown full-screen)
  if (extraCategories.length > 0) {
    const moreBtn = document.createElement("button");
    moreBtn.className = "category-btn";
    moreBtn.textContent = "⬇️ Pilih Kategori Lainnya";
    categoriesEl.appendChild(moreBtn);

    const dropdown = document.createElement("div");
    dropdown.className = "category-dropdown";
    dropdown.style.display = "none";

    extraCategories.forEach(cat => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = cat;
      item.onclick = () => {
        dropdown.style.display = "none";
        window.location.href = `search/?cat=${encodeURIComponent(cat)}`;
      };
      dropdown.appendChild(item);
    });

    document.body.appendChild(dropdown);

    // Toggle dropdown
    moreBtn.addEventListener("click", e => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    // Tutup dropdown jika klik di luar
    document.addEventListener("click", e => {
      if (!dropdown.contains(e.target) && e.target !== moreBtn) {
        dropdown.style.display = "none";
      }
    });
  }
});

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