// Tahun otomatis
const startYear = 2020;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

// Elemen
const suggestionsEl = document.getElementById("suggestions");
const searchBox = document.getElementById("searchBox");
const categoriesEl = document.getElementById("categories");

let allLinks = [];

// ===================== LOAD SEMUA DATA =====================
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

// ===================== SETUP KATEGORI =====================
async function setupCategories() {
  categoriesEl.innerHTML = "<p style='text-align:center;'>🔄 Memuat kategori...</p>";

  allLinks = await loadAllData();
  const categories = [...new Set(allLinks.map(item => item.category))];
  const maxVisible = 14;

  categoriesEl.innerHTML = ""; // hapus teks memuat
  categoriesEl.style.opacity = 0;

  // Render kategori utama
  categories.slice(0, maxVisible).forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      window.location.href = `search/?cat=${encodeURIComponent(cat)}`;
    });
    categoriesEl.appendChild(btn);
  });

  // Dropdown kategori tambahan
  if (categories.length > maxVisible) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("select-dropdown-container");

    const select = document.createElement("select");
    select.classList.add("select-dropdown");
    select.innerHTML = '<option value="">-- Pilih Kategori Lain --</option>';

    categories.slice(maxVisible).forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      const selected = select.value;
      if (selected) window.location.href = `search/?cat=${encodeURIComponent(selected)}`;
    });

    dropdownContainer.appendChild(select);
    categoriesEl.appendChild(dropdownContainer);
  }

  // Fade-in efek halus
  setTimeout(() => (categoriesEl.style.transition = "opacity .5s ease", categoriesEl.style.opacity = 1), 100);
}

setupCategories();

// ===================== SUGGESTION SEARCH =====================
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

// Tampilkan hasil suggestion
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

// Highlight teks pencarian
function highlightMatch(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

// Tutup suggestion saat klik di luar
document.addEventListener("click", e => {
  if (!suggestionsEl.contains(e.target) && e.target !== searchBox) {
    suggestionsEl.innerHTML = "";
  }
});

// ===================== GOOGLE TRANSLATE =====================
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

function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: "id" }, "google_translate_element");
}

function doGTranslate(el) {
  if (!el.value) return;
  const langPair = el.value.split("|");
  const lang = langPair[1];
  if (lang === "id") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
    window.location.href = window.location.origin + window.location.pathname;
    return;
  }
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }
}