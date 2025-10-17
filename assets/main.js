/* ======================================================
   MAIN JS – Sering diubah / pencarian & auto-saran
   ====================================================== */

/* --- Variabel global --- */
const queryInput = document.getElementById("query");
const suggestionsBox = document.getElementById("suggestions");

// Scroll untuk kotak saran
suggestionsBox.style.maxHeight = "300px";
suggestionsBox.style.overflowY = "auto";

// Mode pencarian: true = semua kata kunci harus cocok, false = salah satu cukup
const STRICT_SEARCH = true;

/* --- Fungsi Highlight Lembut --- */
function highlightText(text, keywords) {
  let highlighted = text;
  keywords.forEach(k => {
    const regex = new RegExp(`(${k})`, "ig");
    highlighted = highlighted.replace(
      regex,
      `<b style="background-color: #ffebc2; color: #b33;">$1</b>`
    );
  });
  return highlighted;
}

/* --- Event Input: Auto-saran + Highlight --- */
queryInput.addEventListener("input", function () {
  const val = this.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!products.length) {
    suggestionsBox.innerHTML = "<div>⏳ Memuat data produk...</div>";
    return;
  }
  if (!val) return;

  // Pisahkan input menjadi kata kunci
  const keywords = val.split(/\s+/).filter(Boolean);

  // Filter produk berdasarkan multi kata kunci di semua field
  let matchedProducts = products.filter(p => {
    const combined = [
      ...(p.tokoh || []),
      ...(Array.isArray(p.ukuran) ? p.ukuran : [p.ukuran || ""]),
      p.kualitas || ""
    ].join(" ").toLowerCase();

    return STRICT_SEARCH
      ? keywords.every(word => combined.includes(word))
      : keywords.some(word => combined.includes(word));
  });

  if (!matchedProducts.length) {
    suggestionsBox.innerHTML = "<div style='padding:10px;color:#777;'>❌ Tidak ditemukan hasil cocok.</div>";
    return;
  }

  // Ambil semua kata unik dari hasil yang cocok untuk saran
  let allSuggestions = new Set();
  matchedProducts.forEach(p => {
    if (p.tokoh) p.tokoh.forEach(t => allSuggestions.add(`tokoh:${t}`));
    if (p.ukuran) (Array.isArray(p.ukuran)? p.ukuran : [p.ukuran]).forEach(u => allSuggestions.add(`ukuran:${u}`));
    if (p.kualitas) allSuggestions.add(`kualitas:${p.kualitas}`);
  });

  Array.from(allSuggestions).forEach(item => {
    const [type, value] = item.split(":");
    const div = document.createElement("div");

    let label = "";
    if (type === "tokoh") label = "👤 Tokoh: ";
    else if (type === "ukuran") label = "📏 Ukuran: ";
    else if (type === "kualitas") label = "⭐ Kualitas: ";

    const displayValue =
      type === "tokoh" || type === "ukuran" || type === "kualitas"
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;

    div.innerHTML = label + highlightText(displayValue, keywords);

    // Klik saran → isi input
    div.onclick = () => {
      queryInput.value = displayValue;
      queryInput.dataset.selected = "true";
      suggestionsBox.innerHTML = "";
    };

    suggestionsBox.appendChild(div);
  });
});

/* ======================================================
   CUSTOM AUTOCOMPLETE PER TOKOH (optional)
   ====================================================== */
function setupAutocomplete(products) {
  const input = document.getElementById("tokoh");
  if (!input) return;
  const suggestionBox = document.getElementById("tokoh-suggestions");

  const tokohSet = new Set();
  products.forEach(p => {
    if (Array.isArray(p.tokoh)) p.tokoh.forEach(t => tokohSet.add(t.charAt(0).toUpperCase() + t.slice(1)));
  });
  tokohSet.add("Punakawan");
  tokohSet.add("Pandawa");
  const tokohList = Array.from(tokohSet);

  input.addEventListener("input", function() {
    const val = this.value.toLowerCase();
    suggestionBox.innerHTML = "";
    if (!val) return;

    tokohList.filter(t => t.toLowerCase().includes(val)).forEach(t => {
      const div = document.createElement("div");
      div.textContent = t;
      div.addEventListener("click", () => {
        input.value = t;
        suggestionBox.innerHTML = "";
      });
      suggestionBox.appendChild(div);
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target !== input) suggestionBox.innerHTML = "";
  });
}

// Jalankan autocomplete tokoh jika ada input #tokoh
if(document.getElementById("tokoh")) setupAutocomplete(products);