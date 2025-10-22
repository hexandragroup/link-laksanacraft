(function(){
  const style = document.createElement('style');
  style.textContent = `
    .corner-tab {
      position: fixed; top:30px; right:-10px; width:55px; height:55px;
      background:#333; color:#fff; font-size:28px; border-radius:30px 0 0 30px;
      display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10000;
      transition: transform 0.3s, opacity 0.3s;
    }
    .corner-tab:hover { background:#555; transform: scale(1.05); }

    .corner-menu {
      position:fixed; top:0; right:-200px; width:200px; height:100%;
      background: rgba(255,255,255,0.97);
      box-shadow: -3px 0 12px rgba(0,0,0,0.2);
      display:flex; flex-direction:column;
      padding-top:60px;
      transition:right 0.3s ease;
      z-index:9999;
    }
    .corner-menu.show { right:0; }

    .corner-menu a {
      padding:12px 20px;
      border-bottom:1px solid rgba(0,0,0,0.1);
      text-decoration:none; color:#222;
    }
    .corner-menu a:hover { background: rgba(0,0,0,0.05); }

    /* Dropdown tema */
    .theme-switcher {
      margin: 15px 15px 30px 15px;
      padding: 8px;
      border: 1px solid #bbb;
      border-radius: 6px;
      background: #f8f8f8;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .theme-switcher:hover { background: #eee; }
  `;
  document.head.appendChild(style);

  const html = `
    <div class="corner-tab" id="cornerTab">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </div>

    <div class="corner-menu" id="cornerMenu">
      <a href="https://link.laksanacraft.my.id/">🏠 Beranda</a>
      <a href="https://url.laksanacraft.my.id/profil">👤 Tentang</a>
      <a href="https://linktr.ee/hexandra" target="_blank">💼 Bisnis</a>
      <a href="https://url.laksanacraft.my.id/link">🔗 Tautan</a>

      <select id="themeSelector" class="theme-switcher">
        <option value="">🎨 Pilih Tema</option>
        <option value="base">🌤️ Modern</option>
        <option value="neo">🧊 Neo 3D</option>
        <option value="dark">🌙 Dark Mode</option>
      </select>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  const cornerTab = document.getElementById("cornerTab");
  const cornerMenu = document.getElementById("cornerMenu");
  const themeSelector = document.getElementById("themeSelector");

  // === Animasi menu ===
  cornerTab.addEventListener("click", e => {
    e.stopPropagation();
    cornerMenu.classList.add("show");
    cornerTab.style.opacity = "0";
    cornerTab.style.pointerEvents = "none";
  });

  document.addEventListener("click", e => {
    if (!cornerMenu.contains(e.target) && !cornerTab.contains(e.target)) {
      cornerMenu.classList.remove("show");
      cornerTab.style.opacity = "1";
      cornerTab.style.pointerEvents = "auto";
    }
  });

  // === Swipe close (mobile) ===
  let touchStartX = 0;
  document.addEventListener("touchstart", e => touchStartX = e.touches[0].clientX);
  document.addEventListener("touchend", e => {
    const touchEndX = e.changedTouches[0].clientX;
    if (cornerMenu.classList.contains("show") && touchEndX < touchStartX - 50) {
      cornerMenu.classList.remove("show");
      cornerTab.style.opacity = "1";
      cornerTab.style.pointerEvents = "auto";
    }
  });

  // === Theme switcher ===
  const themeLink = document.createElement("link");
  themeLink.id = "theme-style";
  themeLink.rel = "stylesheet";
  document.head.appendChild(themeLink);

  // Muat tema tersimpan
  const savedTheme = localStorage.getItem("theme") || "base";
  themeLink.href = `assets/style/${savedTheme === "base" ? "style.css" : "themes/" + savedTheme + ".css"}`;
  themeSelector.value = savedTheme;

  // Ganti tema saat dipilih
  themeSelector.addEventListener("change", () => {
    const val = themeSelector.value;
    if (!val) return;
    themeLink.href = `assets/style/${val === "base" ? "style.css" : "themes/" + val + ".css"}`;
    localStorage.setItem("theme", val);
  });
})();