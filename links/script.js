/* ======================================================
   LINK.JS — Script
   ====================================================== */

/* ===================== TAHUN OTOMATIS ===================== */
const startYear = 2020;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

/* ===================== ELEMEN DASAR ===================== */
const suggestionsEl = document.getElementById("suggestions");
const searchBox = document.getElementById("searchBox");
const categoriesEl = document.getElementById("categories");

let allLinks = [];

/* ===================== LOAD SEMUA DATA JSON ===================== */
async function loadAllData() {
  const dataArray = [];
  let i = 1;

  while (true) {
    try {
      const res = await fetch(`assets/data${i}.json`);
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

/* ===================== SETUP KATEGORI ===================== */
async function setupCategories() {
  // Tampilkan teks "Memuat..."
  categoriesEl.innerHTML = `
    <div style="
      width:100%;
      text-align:center;
      padding:10px 0;
      font-size:13px;
      color:#555;
    ">
      <p>⏳ Memuat kategori...</p>
    </div>`;
  // Ambil semua data
  allLinks = await loadAllData();
  // Ambil semua kategori, flatten array jika ada
  const categories = [
    ...new Set(
      allLinks.flatMap(item =>
        Array.isArray(item.category) ? item.category : [item.category]
      )
    )
  ];
  const maxVisible = 14;
  // Bersihkan & sembunyikan sejenak untuk efek fade-in
  categoriesEl.innerHTML = "";
  categoriesEl.style.opacity = 0;
  // Tambahkan kategori utama (maksimal 14)
  categories.slice(0, maxVisible).forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      // Filter item berdasarkan kategori yang diklik
      const filtered = allLinks.filter(item =>
        Array.isArray(item.category)
          ? item.category.includes(cat)
          : item.category === cat
      );
      // Arahkan ke halaman search atau tampilkan hasil sesuai kebutuhan
      window.location.href = `search/?cat=${encodeURIComponent(cat)}`;
    });
    categoriesEl.appendChild(btn);
  });
  // Tambahkan dropdown untuk kategori tambahan
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
      if (!selected) return;
      window.location.href = `search/?cat=${encodeURIComponent(selected)}`;
    });

    dropdownContainer.appendChild(select);
    categoriesEl.appendChild(dropdownContainer);
  }

  // Efek fade-in halus
  setTimeout(() => {
    categoriesEl.style.transition = "opacity .5s ease";
    categoriesEl.style.opacity = 1;
  }, 100);
}

setupCategories();

/* ===================== FITUR PENCARIAN (SUGGESTIONS) ===================== */
searchBox.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase().trim();
  if (!keyword) return (suggestionsEl.innerHTML = "");

  const startMatches = allLinks.filter(link =>
    link.title.toLowerCase().startsWith(keyword) ||
    (Array.isArray(link.category)
      ? link.category.some(c => c.toLowerCase().startsWith(keyword))
      : link.category.toLowerCase().startsWith(keyword))
  );

  const includeMatches = allLinks.filter(link =>
    (link.title.toLowerCase().includes(keyword) ||
      (Array.isArray(link.category)
        ? link.category.some(c => c.toLowerCase().includes(keyword))
        : link.category.toLowerCase().includes(keyword))) &&
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

// Tutup suggestion jika klik di luar
document.addEventListener("click", e => {
  if (!suggestionsEl.contains(e.target) && e.target !== searchBox) {
    suggestionsEl.innerHTML = "";
  }
});

/* ===================== GOOGLE TRANSLATE ===================== */
function resizeGTranslate() {
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    Object.assign(select.style, {
      width: "100%",
      maxWidth: "420px",
      padding: "14px 24px",
      fontSize: "15px",
      boxSizing: "border-box",
    });
  }
}
// Jalankan resize beberapa kali (Translate kadang lambat dimuat)
[1000, 1500, 2000].forEach(t => setTimeout(resizeGTranslate, t));
// Inisialisasi Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: "id" }, "google_translate_element");
}
// Fungsi pemicu ganti bahasa
function doGTranslate(el) {
  if (!el.value) return;
  const lang = el.value.split("|")[1];
  if (lang === "id") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
      window.location.hostname +
      ";";
    window.location.href = window.location.origin + window.location.pathname;
    return;
  }
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }
}
/* ===================== THEME SWITCHER ===================== */
const themeSelector = document.getElementById("themeSelector");
const themeLink = document.createElement("link");
themeLink.id = "theme-style";
themeLink.rel = "stylesheet";
document.head.appendChild(themeLink);

// Muat tema tersimpan
const savedTheme = localStorage.getItem("theme") || "base";
themeLink.href = savedTheme === "base" 
    ? "../assets/style/style.css" 
    : `../assets/style/themes/${savedTheme}.css`;
themeSelector.value = savedTheme;

// Ganti tema saat dipilih
themeSelector.addEventListener("change", () => {
  const val = themeSelector.value;
  if (!val) return;
  themeLink.href = val === "base" 
      ? "../assets/style/style.css" 
      : `../assets/style/themes/${val}.css`;
  localStorage.setItem("theme", val);
});