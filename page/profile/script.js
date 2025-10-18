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

// ====================================
// translate.js — Google Translate Auto
// ====================================

// Inisialisasi elemen Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "id",
      autoDisplay: false
    },
    "google_translate_element"
  );
}

// Jalankan setelah konten termuat
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLang");

  // Jika ada bahasa tersimpan (bukan Indonesia), translate otomatis
  if (savedLang && savedLang !== "id") {
    const interval = setInterval(() => {
      const iframe = document.querySelector(".goog-te-menu-frame");
      if (iframe && iframe.contentDocument) {
        const options = iframe.contentDocument.querySelectorAll(
          ".goog-te-menu2-item span.text"
        );
        options.forEach(el => {
          if (el.innerText.toLowerCase().includes(savedLang.toLowerCase())) {
            el.click();
            clearInterval(interval);
          }
        });
      }
    }, 800);
  }
});

// Pantau cookie perubahan bahasa agar tersimpan ke localStorage
window.addEventListener("load", () => {
  const observer = new MutationObserver(() => {
    const match = document.cookie.match(/googtrans=\/id\/([^;]+)/);
    if (match && match[1]) {
      localStorage.setItem("selectedLang", match[1]);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});