    // Tahun dinamis
    const startYear = 1994;
    const currentYear = new Date().getFullYear();
    document.getElementById("year").textContent =
      currentYear > startYear ? startYear + "–" + currentYear : startYear;

    window.addEventListener("load", () => { document.body.classList.add("loaded"); });

    // Toggle dropdown klik
    document.querySelectorAll('.dropdown-wrapper').forEach(wrapper => {
      const btn = wrapper.querySelector('.dropdown-btn');
      btn.addEventListener('click', e => {
        e.stopPropagation();
        // tutup dropdown lain
        document.querySelectorAll('.dropdown-wrapper').forEach(w => {
          if(w !== wrapper) w.classList.remove('show');
        });
        wrapper.classList.toggle('show');
      });
    });

    // Klik di luar dropdown untuk menutup semua
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-wrapper').forEach(wrapper => wrapper.classList.remove('show'));
    });

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