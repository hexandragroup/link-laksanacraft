loadAllData().then(data => {
  allLinks = data;

  const categories = [...new Set(allLinks.map(item => item.category))];
  const maxVisible = 14;

  const categoriesEl = document.getElementById("categories");
  const moreDropdown = document.querySelector('.category-more-dropdown');
  const moreBtn = moreDropdown.querySelector('.category-more-btn');
  const moreList = moreDropdown.querySelector('.category-more-list');

  // Bagi kategori
  const visibleCategories = categories.slice(0, maxVisible);
  const extraCategories = categories.slice(maxVisible);

  // Render kategori horizontal
  visibleCategories.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.href = `search/?cat=${encodeURIComponent(cat)}`;
    btn.addEventListener("click", e => {
      e.preventDefault();
      window.location.href = btn.href;
    });
    categoriesEl.appendChild(btn);
  });

  // Render kategori tambahan di dropdown
  extraCategories.forEach(cat => {
    const div = document.createElement("div");
    div.textContent = cat;
    div.addEventListener("click", () => {
      window.location.href = `search/?cat=${encodeURIComponent(cat)}`;
      moreDropdown.classList.remove('open');
    });
    moreList.appendChild(div);
  });

  // Toggle dropdown saat klik
  moreBtn.addEventListener("click", () => {
    moreDropdown.classList.toggle('open');
  });

  // Tutup dropdown jika klik di luar
  document.addEventListener("click", e => {
    if (!moreDropdown.contains(e.target)) {
      moreDropdown.classList.remove('open');
    }
  });

  // Sembunyikan tombol dropdown jika tidak ada extra category
  if (extraCategories.length === 0) {
    moreDropdown.style.display = 'none';
  }
});