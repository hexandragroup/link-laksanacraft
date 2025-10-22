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