// --- Tahun Dinamis ---
const startYear = 1990;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? startYear + "–" + currentYear : startYear;

// --- Data & Label ---
let products = [];
const labels = {
  ukuran: {
    miniatur: "Miniatur",
    "20, 25, 30cm": "20, 25, 30cm",
    standar: "Standar Pedalangan"
  },
  kualitas: { murah: "Murah", sedang: "Sedang", alusan: "Alusan" }
};
const groupAliases = {
  punakawan: ["semar", "gareng", "petruk", "bagong"],
  pandawa: ["arjuna", "nakula", "sadewa", "bima", "puntadewa"]
};

// --- Helper Functions ---
function escapeHtml(s) {
  return s
    ? String(s).replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[m]))
    : "";
}
function escapeAttr(s) { return escapeHtml(s); }
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }

function matchesGroup(tokoh, group) {
  return groupAliases[group]?.some(t => tokoh.includes(t));
}

// --- Form Submit ---
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  doFilterSearch();
});

// --- Filter Search ---
function doFilterSearch() {
  const tokoh = document.getElementById("tokoh").value.toLowerCase();
  const ukuran = document.getElementById("ukuran").value;
  const kualitas = document.getElementById("kualitas").value;
  const out = document.getElementById("results");
  out.innerHTML = "";

  if (!tokoh && !ukuran && !kualitas) {
    out.innerHTML =
      "<p style='color:red;'>⚠️ Silakan pilih minimal satu kriteria pencarian.</p>";
    return;
  }

  const filtered = products.filter(p =>
    (tokoh ? (
      p.tokoh.some(t => t.toLowerCase().includes(tokoh)) ||
      (tokoh === "punakawan" && matchesGroup(p.tokoh, "punakawan")) ||
      (tokoh === "pandawa" && matchesGroup(p.tokoh, "pandawa"))
    ) : true) &&
    (ukuran
      ? ukuran === "20, 25, 30cm"
        ? ["20cm", "25cm", "30cm"].some(u =>
            Array.isArray(p.ukuran) ? p.ukuran.includes(u) : p.ukuran === u
          )
        : ukuran === "standar"
        ? Array.isArray(p.ukuran)
          ? p.ukuran.includes("Standar Pedalangan")
          : p.ukuran === "Standar Pedalangan"
        : Array.isArray(p.ukuran)
        ? p.ukuran.includes(ukuran)
        : p.ukuran === ukuran
      : true) &&
    (kualitas ? p.kualitas === kualitas : true)
  );

  renderResults(filtered);
}

// --- Query Param (/?q=...) ---
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function checkQueryParam() {
  const q = getQueryParam("q");
  if (!q) return;
  const out = document.getElementById("results");
  out.innerHTML = "<p>🔎 Hasil pencarian untuk: <b>" + escapeHtml(q) + "</b></p>";

  const qLower = q.toLowerCase();
  const filtered = products.filter(p =>
    p.tokoh.some(t => t.toLowerCase().includes(qLower)) ||
    (qLower === "punakawan" && matchesGroup(p.tokoh, "punakawan")) ||
    (qLower === "pandawa" && matchesGroup(p.tokoh, "pandawa")) ||
    (p.ukuran &&
      (Array.isArray(p.ukuran)
        ? p.ukuran.some(u => u.toLowerCase().includes(qLower))
        : p.ukuran.toLowerCase().includes(qLower))) ||
    (p.kualitas && p.kualitas.toLowerCase().includes(qLower))
  );

  renderResults(filtered);
}

// --- Render Hasil ---
function renderResults(list) {
  const out = document.getElementById("results");
  if (list.length === 0) {
    out.innerHTML += "<p>Tidak ada produk ditemukan.</p>";
    return;
  }

  list.forEach(p => {
    let tokohList = p.tokoh.map(capitalize);
    if (matchesGroup(p.tokoh, "punakawan")) tokohList.unshift("(Punakawan)");
    if (matchesGroup(p.tokoh, "pandawa")) tokohList.unshift("(Pandawa)");

    let varianTable = "";
    if (p.varian && Array.isArray(p.varian)) {
      varianTable += "<table class='variant-table'><tr><th>Ukuran</th><th>Harga</th></tr>";
      p.varian.forEach(v => {
        varianTable += `<tr><td>${escapeHtml(v.size)}</td><td>${escapeHtml(v.harga)}</td></tr>`;
      });
      varianTable += "</table>";
    }

    let ukuranLabel = Array.isArray(p.ukuran)
      ? p.ukuran.map(u => labels.ukuran[u] || u).join(", ")
      : labels.ukuran[p.ukuran] || p.ukuran;

    out.innerHTML += `
      <div class="result">
        <p><strong>Tokoh:</strong> ${escapeHtml(tokohList.join(", "))}</p>
        <p><strong>Kualitas:</strong> ${escapeHtml(labels.kualitas[p.kualitas] || p.kualitas)}</p>
        <p><strong>Ukuran:</strong> ${escapeHtml(ukuranLabel)}</p>
        ${varianTable}
        <p><a href="${escapeAttr(p.link)}" target="_blank">🔗 Detail Produk</a></p>
      </div>
    `;
  });
}

/* === Autocomplete Tokoh (Hybrid + Scroll) === */
function setupAutocomplete(products) {
  const input = document.getElementById("tokoh");
  const suggestionBox = document.getElementById("tokoh-suggestions");

  suggestionBox.style.maxHeight = "250px";
  suggestionBox.style.overflowY = "auto";

  const tokohSet = new Set();
  products.forEach(p => {
    if (Array.isArray(p.tokoh)) p.tokoh.forEach(t => tokohSet.add(capitalize(t)));
  });

  tokohSet.add("Punakawan");
  tokohSet.add("Pandawa");

  const tokohList = Array.from(tokohSet);

  input.addEventListener("input", function() {
    const val = this.value.toLowerCase();
    suggestionBox.innerHTML = "";
    if (!val) return;

    // Hybrid search: startsWith dulu, lalu includes
    let matches = tokohList.filter(t => t.toLowerCase().startsWith(val));
    if (matches.length === 0) matches = tokohList.filter(t => t.toLowerCase().includes(val));

    matches.forEach(t => {
      const div = document.createElement("div");
      div.textContent = t;
      div.style.padding = "6px 10px";
      div.style.cursor = "pointer";
      div.addEventListener("mouseenter", () => div.style.background = "#eee");
      div.addEventListener("mouseleave", () => div.style.background = "");
      div.addEventListener("click", () => {
        input.value = t;
        suggestionBox.innerHTML = "";
      });
      suggestionBox.appendChild(div);
    });
  });

  document.addEventListener("click", e => {
    if (e.target !== input) suggestionBox.innerHTML = "";
  });
}

// --- Load Semua Produk ---
async function loadAllProducts() {
  const files = [];
  let i = 1;
  while (true) {
    const file = `data/products${i}.json`;
    try {
      const res = await fetch(file);
      if (!res.ok) break;
      const json = await res.json();
      files.push(json);
      i++;
    } catch {
      break;
    }
  }
  return files.flat();
}

loadAllProducts()
  .then(data => {
    products = data;
    setupAutocomplete(products);
    checkQueryParam();
  })
  .catch(() => {
    document.getElementById("results").innerHTML =
      "<p style='color:red;'>⚠️ Gagal memuat data produk.</p>";
  });
