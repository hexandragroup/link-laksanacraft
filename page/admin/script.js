/* =====================================================
   ADMIN.JS — Halaman Admin CRUD
   Menggunakan Cloudflare Worker JSON Storage
   ===================================================== */

/* =========================
   KONFIGURASI
   ========================= */
const API_BASE = "https://ancient-king-d447.hendraslaksono.workers.dev/?file=products1.json";
const ADMIN_USER = "admin@laksanacraft";
const ADMIN_PASS = "laksanacraft-admin";

/* =========================
   LOGIN SYSTEM
   ========================= */
function loginAdmin() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem("adminLogin", "true");
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminBox").style.display = "block";

    loadProducts();
  } else {
    alert("Login gagal. Username atau password salah.");
  }
}

function checkLogin() {
  if (localStorage.getItem("adminLogin") === "true") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminBox").style.display = "block";
    loadProducts();
  }
}

function logoutAdmin() {
  localStorage.removeItem("adminLogin");
  location.reload();
}

/* =========================
   LOAD DATA
   ========================= */
let products = [];

async function loadProducts() {
  try {
    const res = await fetch(API_BASE);
    products = await res.json();

    renderProductList();
  } catch (err) {
    console.error("Gagal memuat produk:", err);
    alert("Gagal memuat data");
  }
}

/* =========================
   RENDER LIST PRODUK
   ========================= */
function renderProductList() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "admin-item";

    div.innerHTML = `
      <div class="admin-item-title">${p.tokoh.join(", ")}</div>
      <div>Ukuran: ${p.ukuran.join(", ")}</div>
      <div>Kualitas: ${p.kualitas}</div>
      <div>Link: <a href="${p.link}" target="_blank">${p.link}</a></div>

      <div class="admin-item-actions">
        <button class="admin-edit" onclick="editProduct(${i})">Edit</button>
        <button class="admin-delete" onclick="deleteProduct(${i})">Hapus</button>
      </div>
    `;

    list.appendChild(div);
  });
}

/* =========================
   TAMBAH PRODUK
   ========================= */
function addProduct() {
  document.getElementById("formTitle").innerText = "Tambah Produk";
  document.getElementById("adminForm").classList.add("active");

  document.getElementById("formIndex").value = "-1";

  document.getElementById("formTokoh").value = "";
  document.getElementById("formUkuran").value = "";
  document.getElementById("formKualitas").value = "";
  document.getElementById("formLink").value = "";
  document.getElementById("formVarian").value = "";
}

/* =========================
   EDIT PRODUK
   ========================= */
function editProduct(index) {
  const p = products[index];

  document.getElementById("formTitle").innerText = "Edit Produk";
  document.getElementById("adminForm").classList.add("active");

  document.getElementById("formIndex").value = index;

  document.getElementById("formTokoh").value = p.tokoh.join(", ");
  document.getElementById("formUkuran").value = p.ukuran.join(", ");
  document.getElementById("formKualitas").value = p.kualitas;
  document.getElementById("formLink").value = p.link;
  document.getElementById("formVarian").value = JSON.stringify(p.varian, null, 2);
}

/* =========================
   HAPUS PRODUK
   ========================= */
function deleteProduct(index) {
  if (!confirm("Yakin ingin menghapus produk ini?")) return;

  products.splice(index, 1);
  saveProducts();
}

/* =========================
   SIMPAN PRODUK (WRITE JSON)
   ========================= */
async function saveProducts(event) {
  if (event) event.preventDefault();

  const index = parseInt(document.getElementById("formIndex").value);
  const tokoh = document.getElementById("formTokoh").value.split(",").map(s => s.trim());
  const ukuran = document.getElementById("formUkuran").value.split(",").map(s => s.trim());
  const kualitas = document.getElementById("formKualitas").value.trim();
  const link = document.getElementById("formLink").value.trim();
  const varian = JSON.parse(document.getElementById("formVarian").value);

  const newData = { tokoh, ukuran, kualitas, link, varian };

  if (index === -1) products.push(newData);
  else products[index] = newData;

  // Kirim ke Cloudflare Worker
  try {
    await fetch(API_BASE + "&mode=write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(products)
    });

    alert("Data berhasil disimpan!");
    document.getElementById("adminForm").classList.remove("active");
    loadProducts();

  } catch (err) {
    console.error("Gagal menyimpan:", err);
    alert("Gagal menyimpan data.");
  }
}

/* =========================
   INIT
   ========================= */
checkLogin();