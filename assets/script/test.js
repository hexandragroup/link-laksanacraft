// Ambil container dropdown
const categoryDropdown = document.querySelector('.category-dropdown');
const categorySelected = categoryDropdown.querySelector('.category-selected');
const categoryList = categoryDropdown.querySelector('.category-list');

// Load kategori
loadAllData().then(data => {
  allLinks = data;
  const categories = [...new Set(allLinks.map(item => item.category))];

  categories.forEach(cat => {
    const div = document.createElement('div');
    div.textContent = cat;
    div.addEventListener('click', () => {
      categorySelected.textContent = cat; // tampilkan kategori yang dipilih
      categoryDropdown.classList.remove('open'); // tutup dropdown
      // Arahkan ke halaman kategori
      window.location.href = `search/?cat=${encodeURIComponent(cat)}`;
    });
    categoryList.appendChild(div);
  });
});

// Toggle dropdown saat diklik
categorySelected.addEventListener('click', () => {
  categoryDropdown.classList.toggle('open');
});

// Tutup dropdown jika klik di luar
document.addEventListener('click', e => {
  if (!categoryDropdown.contains(e.target)) {
    categoryDropdown.classList.remove('open');
  }
});