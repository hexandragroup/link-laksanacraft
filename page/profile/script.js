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