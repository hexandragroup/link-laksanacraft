// ======================================================
// Alias produk
// ======================================================
const BASES_PRODUCTS = {
  "www": "https://www.laksanacraft.my.id",
  "url": "https://url.laksanacraft.my.id",
  "link": "https://link.laksanacraft.my.id",
  "blog": "https://blog.laksanacraft.my.id",
  "shop": "https://shop.laksanacraft.my.id"
};

function replaceAliasProducts(item) {
  for (let key in BASES_PRODUCTS) {
    const baseUrl = BASES_PRODUCTS[key];
    ["link", "url"].forEach(prop => {
      if (item[prop] && !item[prop].startsWith("http") && item[prop].includes("/")) {
        const parts = item[prop].split("/");
        if (parts[0] === key) {
          item[prop] = baseUrl + "/" + parts.slice(1).join("/");
        }
      }
    });
    if (item.varian) {
      item.varian.forEach(v => {
        if (v.link && !v.link.startsWith("http") && v.link.includes("/")) {
          const parts = v.link.split("/");
          if (parts[0] === key) {
            v.link = baseUrl + "/" + parts.slice(1).join("/");
          }
        }
      });
    }
  }
}

// ======================================================
// Load semua products*.json
// ======================================================
async function loadProducts() {
  let dataArray = [];
  let i = 1;
  while (true) {
    const file = `/assets/products${i}.json`;
    try {
      const res = await fetch(file);
      if (!res.ok) break;
      const data = await res.json();
      data.forEach(item => replaceAliasProducts(item));
      dataArray.push(...data);
      i++;
    } catch {
      break;
    }
  }
  return dataArray;
}

// ======================================================
// Jalankan load produk di halaman khusus
// ======================================================
document.addEventListener("DOMContentLoaded", async () => {
  const productsData = await loadProducts();
  console.log("Data produk:", productsData);
});