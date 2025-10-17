/* ======================================================
   MAIN JS – Prioritas hasil pencarian
   ====================================================== */

/* --- Variabel global --- */
const queryInput = document.getElementById("query");
const suggestionsBox = document.getElementById("suggestions");

// Scroll untuk kotak saran
suggestionsBox.style.maxHeight = "300px";
suggestionsBox.style.overflowY = "auto";

/* --- Fungsi Highlight Lembut --- */
function highlightText(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "ig");
  return text.replace(regex, `<b style="background-color:#ffebc2;color:#b33;">$1</b>`);
}

/* --- Event Input: Auto-saran + Highlight dengan Prioritas --- */
queryInput.addEventListener("input", function () {
  const val = this.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!products.length) {
    suggestionsBox.innerHTML = "<div>⏳ Memuat data produk...</div>";
    return;
  }
  if (!val) return;

  // Kumpulkan semua keyword unik dari produk
  let allKeywords = new Set();
  products.forEach(p => {
    if (p.tokoh) p.tokoh.forEach(t => allKeywords.add(`tokoh:${t}`));
    if (p.ukuran) (Array.isArray(p.ukuran)? p.ukuran : [p.ukuran]).forEach(u => allKeywords.add(`ukuran:${u}`));
    if (p.kualitas) allKeywords.add(`kualitas:${p.kualitas}`);
  });

  const allList = Array.from(allKeywords);

  // --- Prioritaskan startsWith terlebih dahulu, lalu includes ---
  let startsWithMatches = allList.filter(k => k.split(":")[1].toLowerCase().startsWith(val));
  let includesMatches = allList.filter(k => {
    const value = k.split(":")[1].toLowerCase();
    return !value.startsWith(val) && value.includes(val);
  });

  const matches = [...startsWithMatches, ...includesMatches];

  if (!matches.length) {
    suggestionsBox.innerHTML = "<div style='padding:10px;color:#777;'>❌ Tidak ditemukan hasil cocok.</div>";
    return;
  }

  // Tampilkan hasil dengan highlight
  matches.forEach(match => {
    const [type, value] = match.split(":");
    const div = document.createElement("div");

    let label = "";
    if (type === "tokoh") label = "👤 Tokoh: ";
    else if (type === "ukuran") label = "📏 Ukuran: ";
    else if (type === "kualitas") label = "⭐ Kualitas: ";

    const displayValue = value.charAt(0).toUpperCase() + value.slice(1);

    div.innerHTML = label + highlightText(displayValue, val);

    div.onclick = () => {
      queryInput.value = displayValue;
      suggestionsBox.innerHTML = "";
    };

    suggestionsBox.appendChild(div);
  });
});