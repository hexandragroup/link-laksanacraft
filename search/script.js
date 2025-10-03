// Daftar tokoh
const tokohList = ["arjuna", "bima", "puntadewa ", "nakula", "sadewa"];

// Ukuran dan kualitas default
const ukuran = "20, 25, 30cm";
const kualitas = "alusan";

// Harga varian (bisa diubah sesuai kebutuhan)
const hargaVarian = [
  { size: "20cm", harga: "Rp75.000" },
  { size: "25cm", harga: "Rp100.000" },
  { size: "30cm", harga: "Rp150.000" }
];

// Link per tokoh
const tokohLinks = {
  "puntadewa": "https://contoh.com/puntadewa-20-25-30cm-alusan",
  "arjuna": "https://contoh.com/arjuna-20-25-30cm-alusan",
  "bima": "https://contoh.com/bima-20-25-30cm-alusan",
  "nakula": "https://contoh.com/nakula-20-25-30cm-alusan",
  "sadewa": "https://contoh.com/sadewa-20-25-30cm-alusan"
};

// Labels untuk tampilan
const labels = {
  ukuran: { "20, 25, 30cm": "20, 25, 30cm" },
  kualitas: { alusan: "Alusan" }
};

// --- Generate products otomatis ---
let products = tokohList.map(t => ({
  tokoh: t,
  ukuran,
  kualitas,
  link: tokohLinks[t] || "#",
  varian: hargaVarian
}));

// --- Helper functions ---
function escapeHtml(s){ return s ? String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])) : ''; }
function escapeAttr(s){ return escapeHtml(s); }
function capitalize(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }

// --- Populate tokoh dropdown ---
function populateTokohDropdown(products) {
  const tokohDropdown = document.getElementById("tokoh");
  const existingOptions = Array.from(tokohDropdown.options).map(o => o.value);
  products.forEach(p => {
    if (!existingOptions.includes(p.tokoh)) {
      const opt = document.createElement("option");
      opt.value = p.tokoh;
      opt.textContent = capitalize(p.tokoh);
      tokohDropdown.appendChild(opt);
    }
  });
}

// --- Render results ---
function renderResults(list) {
  const out = document.getElementById("results");
  if (list.length === 0) {
    out.innerHTML = "<p>Tidak ada produk ditemukan.</p>";
    return;
  }
  list.forEach(p => {
    let varianTable = "<table class='variant-table'><tr><th>Ukuran</th><th>Harga</th></tr>";
    p.varian.forEach(v => {
      varianTable += `<tr><td>${escapeHtml(v.size)}</td><td>${escapeHtml(v.harga)}</td></tr>`;
    });
    varianTable += "</table>";
    out.innerHTML += `
      <div class="result">
        <p><strong>Tokoh:</strong> ${escapeHtml(capitalize(p.tokoh))}</p>
        <p><strong>Kualitas:</strong> ${escapeHtml(labels.kualitas[p.kualitas] || p.kualitas)}</p>
        ${varianTable}
        <p><a href="${escapeAttr(p.link)}" target="_blank">🔗 Detail Produk</a></p>
      </div>
    `;
  });
}

// --- Filter form ---
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const tokoh = document.getElementById("tokoh").value;
  const ukuranFilter = document.getElementById("ukuran").value;
  const kualitasFilter = document.getElementById("kualitas").value;
  const out = document.getElementById("results");
  out.innerHTML = "";

  if (!tokoh && !ukuranFilter && !kualitasFilter) {
    out.innerHTML = "<p style='color:red;'>⚠️ Silakan pilih minimal satu kriteria pencarian.</p>";
    return;
  }

  const filtered = products.filter(p =>
    (tokoh ? p.tokoh === tokoh : true) &&
    (ukuranFilter ? p.ukuran === ukuranFilter : true) &&
    (kualitasFilter ? p.kualitas === kualitasFilter : true)
  );

  renderResults(filtered);
});

// --- Inisialisasi ---
populateTokohDropdown(products);