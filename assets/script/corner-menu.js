(function() {
  // === Tambahkan elemen corner menu baru ===
  const cornerTab = document.createElement('div');
  cornerTab.id = 'cornerTab';
  cornerTab.className = 'corner-tab';
  cornerTab.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  `;
  document.body.appendChild(cornerTab);

  const cornerMenu = document.createElement('div');
  cornerMenu.id = 'cornerMenu';
  cornerMenu.className = 'corner-menu';
  
  // Masukkan menu lama ke dalam cornerMenu
  cornerMenu.innerHTML = `
    <div class="admin-btn-menu" id="adminBtn">⚙️</div>

    <a href="https://link.laksanacraft.my.id/">🏠 Beranda</a>
    <a href="https://url.laksanacraft.my.id/profil">👤 Tentang</a>
    <a href="https://linktr.ee/hexandra" target="_blank">💼 Bisnis</a>
    <a href="https://url.laksanacraft.my.id/link">🔗 Tautan</a>

    <select id="themeSelector" class="theme-switcher">
      <option value="base">🎨 Pilih Tema</option>
      <option value="neon">🌙 Neon 3D</option>
      <option value="paper">📄 Card Paper</option>
      <option value="retro">🎛️ Retro 3D</option>
    </select>
  `;
  document.body.appendChild(cornerMenu);

  const adminBtn = document.getElementById('adminBtn');

  // === Animasi buka menu ===
  cornerTab.addEventListener('click', e => {
    e.stopPropagation();
    cornerMenu.classList.add('show');
    cornerTab.style.opacity = '0';
    cornerTab.style.pointerEvents = 'none';
  });

  // Klik di luar menu untuk menutup
  document.addEventListener('click', e => {
    if (!cornerMenu.contains(e.target) && !cornerTab.contains(e.target)) {
      cornerMenu.classList.remove('show');
      cornerTab.style.opacity = '1';
      cornerTab.style.pointerEvents = 'auto';
    }
  });

  // Swipe close untuk mobile
  let touchStartX = 0;
  document.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
  document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    if (cornerMenu.classList.contains('show') && touchEndX < touchStartX - 50) {
      cornerMenu.classList.remove('show');
      cornerTab.style.opacity = '1';
      cornerTab.style.pointerEvents = 'auto';
    }
  });

  // Tombol admin
  adminBtn.addEventListener('click', e => {
    e.stopPropagation();
    window.location.href = "https://link.laksanacraft.my.id/page/admin/login";
  });

})();