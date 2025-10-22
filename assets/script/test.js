// Tahun otomatis
const startYear = 2020;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

// Elemen
const suggestionsEl = document.getElementById("suggestions");
const searchBox = document.getElementById("searchBox");

let allLinks = [];

// Load semua JSON
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
    } catch { break; }
  }
  return dataArray;
}

// Setup kategori & suggestion
loadAllData().then(data => {
  allLinks = data;
  const categories = [...new Set(allLinks.map(item => item.category))];
  const maxVisible = 14;

  const categoriesEl = document.getElementById("categories");
  const moreDropdown = document.querySelector('.category-more-dropdown');
  const moreBtn = moreDropdown.querySelector('.category-more-btn');
  const moreList = moreDropdown.querySelector('.category-more-list');

  // Render kategori utama
  categories.slice(0, maxVisible).forEach(cat => {
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

  // Render dropdown kategori tambahan
  categories.slice(maxVisible).forEach(cat => {
    const div = document.createElement("div");
    div.textContent = cat;
    div.addEventListener("click", () => {
      window.location.href = `search/?cat=${encodeURIComponent(cat)}`;
      moreDropdown.classList.remove('open');
    });
    moreList.appendChild(div);
  });

  // Sembunyikan dropdown jika kosong
  if (categories.length <= maxVisible) moreDropdown.style.display = "none";

  // Toggle dropdown Lainnya
  moreBtn.addEventListener("click", e => {
    e.stopPropagation();
    moreDropdown.classList.toggle("open");
  });

  // Tutup dropdown jika klik di luar
  document.addEventListener("click", e => {
    if (!moreDropdown.contains(e.target)) moreDropdown.classList.remove("open");
  });

  // --------------------- Suggestion search
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
});

// Show suggestion
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

// Highlight pencarian
function highlightMatch(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

// Tutup suggestion jika klik di luar
document.addEventListener("click", e => {
  if (!suggestionsEl.contains(e.target) && e.target !== searchBox) {
    suggestionsEl.innerHTML = "";
  }
});

// Google Translate styling
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

// Google Translate init
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