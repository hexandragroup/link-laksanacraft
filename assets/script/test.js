// =====================
// Link JS - Suggestion + Kategori Terbatas (Prioritas Huruf Awal)
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

let allLinks = [];

// ---------------------
// 📁 Load semua JSON otomatis
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
// ⚙️ Setup kategori (maksimal 14 + dropdown tambahan)
// ---------------------
loadAllData().then(data => {
  allLinks = data;

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
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = btn.href;
      }, 500);
    });
    categoriesEl.appendChild(btn);
  });

  // Jika kategori lebih dari 14 → tambahkan tombol dropdown
  if (allCategories.length > 14) {
    const moreBtn = document.createElement("button");
    moreBtn.className = "category-btn";
    moreBtn.textContent = "⬇️ Lihat Kategori Lain";
    moreBtn.style.background = "#ccc";
    moreBtn.style.fontWeight = "bold";
    categoriesEl.appendChild(moreBtn);

    // Buat dropdown container
    const dropdown = document.createElement("div");
    dropdown.className = "category-dropdown";
    dropdown.style.display = "none";
    dropdown.style.position = "absolute";
    dropdown.style.background = "#fff";
    dropdown.style.border = "1px solid #ddd";
    dropdown.style.borderRadius = "8px";
    dropdown.style.padding = "10px";
    dropdown.style.maxHeight = "250px";
    dropdown.style.overflowY = "auto";
    dropdown.style.zIndex = "999";
    dropdown.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
    dropdown.style.width = "100%";
    dropdown.style.maxWidth = "420px";

    // Tambahkan kategori lainnya ke dropdown
    allCategories.slice(14).forEach(cat => {
      const item = document.createElement("div");
      item.textContent = cat;
      item.className = "dropdown-item";
      item.style.padding = "8px";
      item.style.cursor = "pointer";
      item.style.borderRadius = "6px";
      item.onmouseover = () => (item.style.background = "#eee");
      item.onmouseout = () => (item.style.background = "transparent");
      item.onclick = () => {
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = `search/?cat=${encodeURIComponent(cat)}`;
        }, 400);
      };
      dropdown.appendChild(item);
    });

    categoriesEl.appendChild(dropdown);

    // Toggle dropdown saat tombol diklik
    moreBtn.addEventListener("click", () => {
      dropdown.style.display =
        dropdown.style.display === "none" ? "block" : "none";
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
// 🔍 Pencarian dengan suggestion (prioritas huruf awal)
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
// 💡 Tampilkan daftar suggestion
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
// ✨ Highlight hasil pencarian
// ---------------------
function highlightMatch(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

// ---------------------
// ❌ Tutup suggestion jika klik di luar
// ---------------------
document.addEventListener("click", e => {
  if (!suggestionsEl.contains(e.target) && e.target !== searchBox) {
    suggestionsEl.innerHTML = "";
  }
});

// ---------------------
// 🌍 Styling Google Translate
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