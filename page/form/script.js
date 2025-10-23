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

// Opsi placeholder awal
const defaultText = "🎨 Pilih Tema";
const defaultValue = "base";

// Muat tema tersimpan
let savedTheme = localStorage.getItem("theme") || defaultValue;
themeLink.href = savedTheme === defaultValue 
    ? "../../assets/style/style.css" 
    : `../../assets/style/themes/${savedTheme}.css`;

// Set teks dan value dropdown
themeSelector.value = savedTheme;
updatePlaceholderText(savedTheme);

// Fungsi update placeholder
function updatePlaceholderText(val) {
  const firstOption = themeSelector.querySelector('option[value="base"]');
  if(val === defaultValue) {
    firstOption.textContent = defaultText; // Pilih Tema
  } else {
    firstOption.textContent = "🎨 Default"; // Setelah ganti tema
  }
}

// Ganti tema saat dipilih
themeSelector.addEventListener("change", () => {
  const val = themeSelector.value;
  if (!val) return;

  // Ganti stylesheet
  themeLink.href = val === defaultValue
      ? "../assets/style/style.css"
      : `../assets/style/themes/${val}.css`;

  // Simpan di localStorage
  localStorage.setItem("theme", val);

  // Update teks placeholder
  updatePlaceholderText(val);
});