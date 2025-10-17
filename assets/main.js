// --- Tahun dinamis ---
const startYear = 1990;
const currentYear = new Date().getFullYear();
document.getElementById("year").textContent =
  currentYear > startYear ? `${startYear}–${currentYear}` : startYear;

// --- Fungsi Pencarian Produk ---
function goSearch(e) {
  e.preventDefault();
  const q = document.getElementById("query").value.trim();
  if (q)
    window.location.href = "https://link.laksanacraft.my.id/search?q=" + encodeURIComponent(q);
  else
    alert("Masukkan kata kunci pencarian!");
}

// --- Auto-saran pencarian ---
let products = [];

async function loadAllProducts() {
  const files = [];
  let i = 1;
  while (true) {
    const file = `https://link.laksanacraft.my.id/search/data/products${i}.json`;
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
  products = files.flat();
}

loadAllProducts();

let loading = true;

loadAllProducts().then(() => {
  loading = false;
});

queryInput.addEventListener("input", function() {
  if (loading) {
    suggestionsBox.innerHTML = "<div>⏳ Memuat data...</div>";
    return;
  }
  // lanjutkan saran seperti biasa...
});

const queryInput = document.getElementById("query");
const suggestionsBox = document.getElementById("suggestions");

queryInput.addEventListener("input", function() {
  const val = this.value.toLowerCase();
  suggestionsBox.innerHTML = "";
  if (!val) return;

  let allKeywords = new Set();
  products.forEach(p => {
    if (p.tokoh) p.tokoh.forEach(t => allKeywords.add(t));
    if (p.ukuran) p.ukuran.forEach(u => allKeywords.add(u));
    if (p.kualitas) allKeywords.add(p.kualitas);
  });

  Array.from(allKeywords)
    .filter(k => k.toLowerCase().includes(val))
    .forEach(match => {
      const div = document.createElement("div");
      div.textContent = match;
      div.onclick = () => {
        queryInput.value = match;
        suggestionsBox.innerHTML = "";
      };
      suggestionsBox.appendChild(div);
    });
});

// --- Tab Navigasi (Utama / Toko / Sosial) ---
const tabFiles = {
  utama: 'links/utama.json',
  toko: 'links/toko.json',
  sosial: 'links/sosial.json'
};

const linkCache = {};

function loadLinks(tab) {
  const container = document.getElementById(tab);

  if (linkCache[tab]) {
    container.innerHTML = "";
    linkCache[tab].forEach(link => {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = link.url;
      a.textContent = link.text;
      container.appendChild(a);
    });
    return;
  }

  container.innerHTML = "<p>🔄 Memuat...</p>";
  fetch(tabFiles[tab])
    .then(res => res.json())
    .then(data => {
      linkCache[tab] = data;
      container.innerHTML = "";
      data.forEach(link => {
        const a = document.createElement("a");
        a.className = "btn";
        a.href = link.url;
        a.textContent = link.text;
        container.appendChild(a);
      });
    })
    .catch(() => {
      container.innerHTML = "<p>⚠️ Gagal memuat link.</p>";
    });
}

function showTab(id) {
  document.querySelectorAll('.tab-buttons button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab-buttons button[onclick="showTab('${id}')"]`).classList.add('active');
  const tab = document.getElementById(id);
  tab.classList.add('active');
  loadLinks(id);

  if (window.innerWidth < 600)
    tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Muat tab pertama otomatis ---
loadLinks('utama');

// Tombol panah & menu sisi
const cornerTab = document.getElementById('cornerTab');
const cornerMenu = document.getElementById('cornerMenu');

// Klik tombol → tampilkan menu & sembunyikan tombol
cornerTab.addEventListener('click', (e) => {
  e.stopPropagation();
  cornerMenu.classList.add('show');
  cornerTab.style.opacity = '0';
  cornerTab.style.pointerEvents = 'none';
});

// Klik di luar → tutup menu & tampilkan tombol
document.addEventListener('click', (e) => {
  if (!cornerMenu.contains(e.target) && !cornerTab.contains(e.target)) {
    cornerMenu.classList.remove('show');
    cornerTab.style.opacity = '1';
    cornerTab.style.pointerEvents = 'auto';
  }
});

// Swipe kiri untuk tutup menu (mobile)
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
document.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].clientX;
  if (cornerMenu.classList.contains('show') && touchEndX < touchStartX - 50) {
    cornerMenu.classList.remove('show');
    cornerTab.style.opacity = '1';
    cornerTab.style.pointerEvents = 'auto';
  }
});