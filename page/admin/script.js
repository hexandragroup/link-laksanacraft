/* =====================================================
   ADMIN.JS — Panel Admin CRUD
   Opsi 1 (Login HTML terpisah)
   ===================================================== */

// ============================
// Validasi login
// ============================
if (localStorage.getItem("adminLogin") !== "true") {
    window.location.href = "login/index.html";
}

// ============================
// API Worker (ganti sesuai file JSON Anda)
// ============================
const API_BASE = "https://ancient-king-d447.hendraslaksono.workers.dev/?file=products1.json";

let products = [];

// ============================
// LOAD DATA JSON
// ============================
async function loadProducts() {
    try {
        const res = await fetch(API_BASE);
        products = await res.json();
        renderProductList();
    } catch (err) {
        alert("Gagal memuat data.");
        console.error(err);
    }
}

loadProducts();

// ============================
// LOGOUT
// ============================
function logoutAdmin() {
    localStorage.removeItem("adminLogin");
    window.location.href = "login/index.html";
}

// ============================
// RENDER LIST PRODUK
// ============================
function renderProductList() {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    products.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "data-item";

        div.innerHTML = `
            <strong>${p.tokoh.join(", ")}</strong>
            <br>Ukuran: ${p.ukuran.join(", ")}
            <br>Kualitas: ${p.kualitas}
            <br>Link: <a href="${p.link}" target="_blank">${p.link}</a>

            <div class="action-buttons">
                <button class="btn-small btn-edit" onclick="editProduct(${i})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteProduct(${i})">Hapus</button>
            </div>
        `;

        list.appendChild(div);
    });
}

// ============================
// TAMBAH PRODUK
// ============================
function addProduct() {
    document.getElementById("formTitle").innerText = "Tambah Produk";
    document.getElementById("adminForm").style.display = "block";

    document.getElementById("formIndex").value = -1;
    document.getElementById("formTokoh").value = "";
    document.getElementById("formUkuran").value = "";
    document.getElementById("formKualitas").value = "";
    document.getElementById("formLink").value = "";
    document.getElementById("formVarian").value = "";
}

// ============================
// EDIT PRODUK
// ============================
function editProduct(index) {
    const p = products[index];

    document.getElementById("formTitle").innerText = "Edit Produk";
    document.getElementById("adminForm").style.display = "block";

    document.getElementById("formIndex").value = index;
    document.getElementById("formTokoh").value = p.tokoh.join(", ");
    document.getElementById("formUkuran").value = p.ukuran.join(", ");
    document.getElementById("formKualitas").value = p.kualitas;
    document.getElementById("formLink").value = p.link;
    document.getElementById("formVarian").value = JSON.stringify(p.varian, null, 2);
}

// ============================
// HAPUS PRODUK
// ============================
function deleteProduct(index) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    products.splice(index, 1);
    saveProducts();
}

// ============================
// SIMPAN DATA (WRITE JSON)
// ============================
async function saveProducts(event) {
    if (event) event.preventDefault();

    const index = parseInt(document.getElementById("formIndex").value);

    const newData = {
        tokoh: document.getElementById("formTokoh").value.split(",").map(a => a.trim()),
        ukuran: document.getElementById("formUkuran").value.split(",").map(a => a.trim()),
        kualitas: document.getElementById("formKualitas").value.trim(),
        link: document.getElementById("formLink").value.trim(),
        varian: JSON.parse(document.getElementById("formVarian").value)
    };

    if (index === -1) products.push(newData);
    else products[index] = newData;

    try {
        await fetch(API_BASE + "&mode=write", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(products)
        });

        alert("Berhasil disimpan!");
        document.getElementById("adminForm").style.display = "none";
        loadProducts();

    } catch (err) {
        alert("Gagal menyimpan data.");
        console.error(err);
    }
}

// ============================
// CLOSE FORM
// ============================
function closeForm() {
    document.getElementById("adminForm").style.display = "none";
}