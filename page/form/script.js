document.addEventListener("DOMContentLoaded", function() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab-btn');
  const forms = document.querySelectorAll('form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      forms.forEach(f => f.classList.remove('active'));
      const target = tab.getAttribute('data-target');
      document.getElementById(target).classList.add('active');
    });
  });

  // Tahun otomatis
  const startYear = 1990;
  const currentYear = new Date().getFullYear();
  document.getElementById("year").textContent = currentYear > startYear ? startYear + "–" + currentYear : startYear;
});

// WhatsApp
function sendToWhatsApp(event) {
  event.preventDefault();
  const nama = document.getElementById('nama').value.trim();
  const produk = document.getElementById('produk').value.trim();
  const pesan = document.getElementById('pesan').value.trim();
  const noTujuan = "6285608564084"; 
  const text = `Halo, saya ${nama} ingin memesan:\n\n🛍️ Produk: ${produk}\n📝 Keterangan: ${pesan || "-"}`;
  window.open(`https://wa.me/${noTujuan}?text=${encodeURIComponent(text)}`, "_blank");
  event.target.submit();
}

// Theme switcher
const themeSelector = document.getElementById("themeSelector");
const themeLink = document.createElement("link");
themeLink.id = "theme-style";
themeLink.rel = "stylesheet";
document.head.appendChild(themeLink);

// Muat tema tersimpan
const savedTheme = localStorage.getItem("theme") || "base";
themeLink.href = savedTheme === "base" 
    ? "../../assets/style/style.css" 
    : `../../assets/style/themes/${savedTheme}.css`;
themeSelector.value = savedTheme;

// Ganti tema saat dipilih
themeSelector.addEventListener("change", () => {
  const val = themeSelector.value;
  if (!val) return;
  themeLink.href = val === "base" 
      ? "../../assets/style/style.css" 
      : `../../assets/style/themes/${val}.css`;
  localStorage.setItem("theme", val);
});