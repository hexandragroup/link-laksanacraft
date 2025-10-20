

/* --- Definisi Grup Tokoh --- */
const GROUP_ALIASES = {
  punakawan: ["semar", "gareng", "petruk", "bagong"],
  pandawa: ["arjuna", "bima", "nakula", "sadewa", "puntadewa"]
};

/* --- Fungsi Cek Grup Tokoh --- */
function getGroupName(tokohName) {
  for (let group in GROUP_ALIASES) {
    if (GROUP_ALIASES[group].includes(tokohName.toLowerCase())) {
      return group;
    }
  }
  return null;
}

/* --- Fungsi Highlight --- */
function highlightText(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "ig");
  return text.replace(regex, `<b style="background-color:#ffebc2;color:#b33;">$1</b>`);
}

/* --- Event Input: Auto-saran --- */
queryInput.addEventListener("input", function () {
  const val = this.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!products.length) {
    suggestionsBox.innerHTML = "<div>⏳ Memuat data produk...</div>";
    return;
  }
  if (!val) return;

  // Kumpulkan semua keyword unik
  let allKeywords = new Set();
  products.forEach(p => {
    if (p.tokoh) {
      const lowerTokoh = p.tokoh.map(t => t.toLowerCase());
      lowerTokoh.forEach(t => allKeywords.add(`tokoh:${t}`));
    }

    if (p.ukuran)
      (Array.isArray(p.ukuran) ? p.ukuran : [p.ukuran])
        .forEach(u => allKeywords.add(`ukuran:${u}`));

    if (p.kualitas)
      allKeywords.add(`kualitas:${p.kualitas}`);
  });

  const allList = Array.from(allKeywords);

  // --- Prioritaskan startsWith ---
  const startsWithMatches = allList.filter(k => k.split(":")[1].startsWith(val));
  const includesMatches = allList.filter(k => {
    const v = k.split(":")[1];
    return !v.startsWith(val) && v.includes(val);
  });

  const matches = [...startsWithMatches, ...includesMatches];

  if (!matches.length) {
    suggestionsBox.innerHTML = "<div style='padding:10px;color:#777;'>❌ Tidak ditemukan hasil cocok.</div>";
    return;
  }

  // --- Tampilkan hasil dengan label grup (informasi saja) ---
  matches.forEach(match => {
    const [type, value] = match.split(":");
    const div = document.createElement("div");
    div.style.padding = "8px 10px";
    div.style.borderBottom = "1px solid #eee";
    div.style.cursor = "pointer";

    let label = "";
    if (type === "tokoh") label = "👤 ";
    else if (type === "ukuran") label = "📏 ";
    else if (type === "kualitas") label = "⭐ ";

    const displayValue = value.charAt(0).toUpperCase() + value.slice(1);

    // Tambahkan label grup jika tokoh termasuk grup tertentu
    let groupLabel = "";
    if (type === "tokoh") {
      const groupName = getGroupName(value);
      if (groupName) {
        groupLabel = ` (${groupName.charAt(0).toUpperCase() + groupName.slice(1)})`;
      }
    }

    div.innerHTML = label + highlightText(displayValue + groupLabel, val);

    div.onclick = () => {
      // Klik tetap menuju tokoh aslinya, bukan grup
      queryInput.value = displayValue;
      suggestionsBox.innerHTML = "";
      window.location.href = `https://link.laksanacraft.my.id/page/search?q=${encodeURIComponent(value)}`;
    };

    suggestionsBox.appendChild(div);
  });
});