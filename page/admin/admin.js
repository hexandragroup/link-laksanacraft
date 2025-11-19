/* admin.js - Admin Dashboard single page (scan 1..50) */

// ----- CONFIG -----
const WORKER_BASE = "https://ancient-king-d447.hendraslaksono.workers.dev";
const API_KEY = "laksanacraft-admin";
const SCAN_MAX = 50; // pilihan Anda: scan 1..50

// DOM
const navBtns = document.querySelectorAll(".nav-btn");
const panelProducts = document.getElementById("panelProducts");
const panelLinks = document.getElementById("panelLinks");
const productsFileSelect = document.getElementById("productsFileSelect");
const linksFileSelect = document.getElementById("linksFileSelect");
const productsList = document.getElementById("productsList");
const linksList = document.getElementById("linksList");
const btnAdd = document.getElementById("btnAdd");
const btnLogout = document.getElementById("btnLogout");
const btnRefreshProducts = document.getElementById("btnRefreshProducts");
const btnRefreshLinks = document.getElementById("btnRefreshLinks");

// modal + login
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalForm = document.getElementById("modalForm");
const loginOverlay = document.getElementById("loginOverlay");
const loginForm = document.getElementById("loginForm");

// product fields
const productFields = document.getElementById("productFields");
const f_tokoh = document.getElementById("f_tokoh");
const f_ukuran = document.getElementById("f_ukuran");
const f_kualitas = document.getElementById("f_kualitas");
const f_link = document.getElementById("f_link");
const f_varian = document.getElementById("f_varian");

// link fields
const linkFields = document.getElementById("linkFields");
const l_category = document.getElementById("l_category");
const l_title = document.getElementById("l_title");
const l_url = document.getElementById("l_url");
const l_icon = document.getElementById("l_icon");

// hidden modal inputs
const modalType = document.getElementById("modalType");
const modalFile = document.getElementById("modalFile");
const modalIndex = document.getElementById("modalIndex");

// state
let productsFiles = [];
let linksFiles = [];
let productsData = []; // current loaded array
let linksData = [];
let currentTab = "products";

// admin credentials (temporary simple)
const ADMIN_USER = "admin@laksanacraft";
const ADMIN_PASS = "laksanacraft-admin";

// ---- Utilities ----
function el(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html!==undefined) e.innerHTML = html; return e; }

// ------- LOGIN FLOW -------
function showLogin() {
  loginOverlay.style.display = "flex";
}
function hideLogin() {
  loginOverlay.style.display = "none";
}
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value.trim();
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem("adminLogin", "true");
    hideLogin();
    initAfterAuth();
  } else {
    alert("Login gagal. Username/password salah.");
  }
});
document.getElementById("togglePass").addEventListener("click", () => {
  const ip = document.getElementById("loginPass");
  ip.type = ip.type === "password" ? "text" : "password";
});
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("adminLogin");
  location.reload();
});

// ------- NAVIGATION -------
navBtns.forEach(b => b.addEventListener("click", () => {
  navBtns.forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  currentTab = b.dataset.tab;
  if (currentTab === "products") {
    panelProducts.style.display = ""; panelLinks.style.display = "none";
    document.getElementById("productsFileGroup").style.display = "";
    document.getElementById("linksFileGroup").style.display = "none";
  } else {
    panelProducts.style.display = "none"; panelLinks.style.display = "";
    document.getElementById("productsFileGroup").style.display = "none";
    document.getElementById("linksFileGroup").style.display = "";
  }
});

// ------- SCAN FILES 1..SCAN_MAX -------
async function scanFiles() {
  productsFiles = [];
  linksFiles = [];
  const checkPromises = [];
  for (let i=1;i<=SCAN_MAX;i++){
    // productsN.json
    checkPromises.push(
      fetch(`${WORKER_BASE}/products?file=products${i}.json`, { method: 'HEAD' })
        .then(r => { if (r.ok) productsFiles.push(`products${i}.json`); })
        .catch(()=>{})
    );
    // dataN.json
    checkPromises.push(
      fetch(`${WORKER_BASE}/links?file=data${i}.json`, { method: 'HEAD' })
        .then(r => { if (r.ok) linksFiles.push(`data${i}.json`); })
        .catch(()=>{})
    );
  }
  await Promise.all(checkPromises);
  productsFiles.sort();
  linksFiles.sort();
  populateFileSelects();
}

// populate dropdowns
function populateFileSelects() {
  productsFileSelect.innerHTML = "";
  linksFileSelect.innerHTML = "";

  if (productsFiles.length===0) {
    const o = el('option', '', 'Tidak ada file products');
    productsFileSelect.appendChild(o);
  } else {
    productsFiles.forEach(f => {
      const o = el('option', '', f); o.value = f; productsFileSelect.appendChild(o);
    });
    // set default (first)
    productsFileSelect.value = productsFiles[0];
    loadProductsFile(productsFileSelect.value);
  }

  if (linksFiles.length===0) {
    const o = el('option', '', 'Tidak ada file links');
    linksFileSelect.appendChild(o);
  } else {
    linksFiles.forEach(f => {
      const o = el('option', '', f); o.value = f; linksFileSelect.appendChild(o);
    });
    linksFileSelect.value = linksFiles[0];
    loadLinksFile(linksFileSelect.value);
  }
}

// refresh handlers
btnRefreshProducts.addEventListener("click", () => {
  if (productsFileSelect.value) loadProductsFile(productsFileSelect.value);
});
btnRefreshLinks.addEventListener("click", () => {
  if (linksFileSelect.value) loadLinksFile(linksFileSelect.value);
});

// change file selects
productsFileSelect.addEventListener("change", e => loadProductsFile(e.target.value));
linksFileSelect.addEventListener("change", e => loadLinksFile(e.target.value));

// ------- LOAD DATA -------
async function loadProductsFile(file) {
  productsList.innerHTML = "Memuat...";
  try {
    const res = await fetch(`${WORKER_BASE}/products?file=${encodeURIComponent(file)}`);
    if (!res.ok) throw new Error("Gagal load");
    const arr = await res.json();
    productsData = arr;
    renderProducts();
  } catch (err) {
    productsList.innerHTML = `<div style="color:#a00">Gagal memuat ${file}</div>`;
    console.error(err);
  }
}

async function loadLinksFile(file) {
  linksList.innerHTML = "Memuat...";
  try {
    const res = await fetch(`${WORKER_BASE}/links?file=${encodeURIComponent(file)}`);
    if (!res.ok) throw new Error("Gagal load");
    const arr = await res.json();
    linksData = arr;
    renderLinks();
  } catch (err) {
    linksList.innerHTML = `<div style="color:#a00">Gagal memuat ${file}</div>`;
    console.error(err);
  }
}

// ------- RENDER -------
function renderProducts() {
  productsList.innerHTML = "";
  if (!Array.isArray(productsData) || productsData.length===0) {
    productsList.innerHTML = "<div>Tidak ada produk</div>"; return;
  }
  productsData.forEach((p, idx) => {
    const item = el('div','item');
    const left = el('div','item-left');
    left.innerHTML = `<div class="item-title">${(p.tokoh||[]).join(", ")}</div>
                      <div class="item-meta">Kualitas: ${p.kualitas || '-'} • Ukuran: ${(p.ukuran||[]).join(", ")}</div>
                      <div class="item-meta">Link: <a href="${p.link}" target="_blank">${p.link}</a></div>`;
    const actions = el('div','action-buttons');
    const btnE = el('button','btn-edit','Edit'); btnE.onclick = ()=>openProductEdit(idx);
    const btnD = el('button','btn-del','Hapus'); btnD.onclick = ()=>doDeleteProduct(idx);
    actions.appendChild(btnE); actions.appendChild(btnD);
    item.appendChild(left); item.appendChild(actions);
    productsList.appendChild(item);
  });
}

function renderLinks() {
  linksList.innerHTML = "";
  if (!Array.isArray(linksData) || linksData.length===0) {
    linksList.innerHTML = "<div>Tidak ada link</div>"; return;
  }
  linksData.forEach((l, idx) => {
    const item = el('div','item');
    const left = el('div','item-left');
    const cat = Array.isArray(l.category) ? l.category.join(", ") : l.category || '';
    left.innerHTML = `<div class="item-title">${l.title}</div>
                      <div class="item-meta">${cat}</div>
                      <div class="item-meta">URL: <a href="${l.url}" target="_blank">${l.url}</a></div>`;
    const actions = el('div','action-buttons');
    const btnE = el('button','btn-edit','Edit'); btnE.onclick = ()=>openLinkEdit(idx);
    const btnD = el('button','btn-del','Hapus'); btnD.onclick = ()=>doDeleteLink(idx);
    actions.appendChild(btnE); actions.appendChild(btnD);
    item.appendChild(left); item.appendChild(actions);
    linksList.appendChild(item);
  });
}

// ------- MODAL HANDLERS -------
btnAdd.addEventListener("click", ()=> {
  if (currentTab === 'products') openProductAdd();
  else openLinkAdd();
});

function openProductAdd() {
  modalTitle.innerText = "Tambah Produk";
  modalType.value = "product";
  modalFile.value = productsFileSelect.value;
  modalIndex.value = -1;
  showProductFields();
  f_tokoh.value = ""; f_ukuran.value=""; f_kualitas.value=""; f_link.value=""; f_varian.value="[]";
  showModal();
}

function openProductEdit(idx) {
  modalTitle.innerText = "Edit Produk";
  modalType.value = "product";
  modalFile.value = productsFileSelect.value;
  modalIndex.value = idx;
  showProductFields();
  const p = productsData[idx];
  f_tokoh.value = (p.tokoh||[]).join(", ");
  f_ukuran.value = (p.ukuran||[]).join(", ");
  f_kualitas.value = p.kualitas || "";
  f_link.value = p.link || "";
  f_varian.value = JSON.stringify(p.varian || [], null, 2);
  showModal();
}

function openLinkAdd() {
  modalTitle.innerText = "Tambah Link";
  modalType.value = "link";
  modalFile.value = linksFileSelect.value;
  modalIndex.value = -1;
  showLinkFields();
  l_category.value=""; l_title.value=""; l_url.value=""; l_icon.value="";
  showModal();
}

function openLinkEdit(idx) {
  modalTitle.innerText = "Edit Link";
  modalType.value = "link";
  modalFile.value = linksFileSelect.value;
  modalIndex.value = idx;
  showLinkFields();
  const it = linksData[idx];
  l_category.value = Array.isArray(it.category) ? JSON.stringify(it.category) : it.category;
  l_title.value = it.title || "";
  l_url.value = it.url || "";
  l_icon.value = it.icon || "";
  showModal();
}

function showProductFields(){ productFields.style.display='block'; linkFields.style.display='none'; }
function showLinkFields(){ productFields.style.display='none'; linkFields.style.display='block'; }
function showModal(){ modal.style.display='flex'; }
function closeModal(){ modal.style.display='none'; }

document.getElementById("btnCancel").addEventListener("click", ()=> closeModal());
modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = modalType.value;
  if (type === 'product') await submitProductForm();
  else await submitLinkForm();
});

// ------- CRUD OPERATIONS (PRODUCTS) -------
async function submitProductForm() {
  const file = modalFile.value;
  const idx = parseInt(modalIndex.value);
  const tokoh = f_tokoh.value.split(",").map(s=>s.trim()).filter(Boolean);
  const ukuran = f_ukuran.value.split(",").map(s=>s.trim()).filter(Boolean);
  const kualitas = f_kualitas.value.trim();
  const link = f_link.value.trim();
  let varian;
  try { varian = JSON.parse(f_varian.value || "[]"); } catch(e){ alert("Varian harus JSON valid"); return; }

  if (idx === -1) {
    // add new: push to array with new id
    const maxId = productsData.reduce((m,x)=>Math.max(m, x.id||0), 0);
    const newItem = { id: maxId+1, tokoh, ukuran, kualitas, link, varian };
    const newArr = [...productsData, newItem];
    await writeFullProductsFile(file, newArr);
  } else {
    // update
    const id = productsData[idx].id;
    const updated = { ...productsData[idx], tokoh, ukuran, kualitas, link, varian, id };
    await updateProductById(file, id, updated);
  }
  closeModal();
  await loadProductsFile(file);
}

async function doDeleteProduct(idx) {
  if (!confirm("Hapus produk ini?")) return;
  const id = productsData[idx].id;
  const file = productsFileSelect.value;
  await deleteItemById('products', file, id);
  await loadProductsFile(file);
}

// ------- CRUD OPERATIONS (LINKS) -------
async function submitLinkForm() {
  const file = modalFile.value;
  const idx = parseInt(modalIndex.value);
  let categoryInput = l_category.value.trim();
  let categoryVal;
  // try parse JSON -> array, otherwise keep as string
  try {
    const maybe = JSON.parse(categoryInput);
    categoryVal = maybe;
  } catch(e) {
    categoryVal = categoryInput;
  }
  const title = l_title.value.trim();
  const url = l_url.value.trim();
  const icon = l_icon.value.trim();

  if (idx === -1) {
    // add
    const newItem = { category: categoryVal, title, url, icon };
    const newArr = [...linksData, newItem];
    await writeFullLinksFile(file, newArr);
  } else {
    // update specific index (no id expected)
    const updated = { ...linksData[idx], category: categoryVal, title, url, icon };
    // replace array item at idx
    const arr = [...linksData];
    arr[idx] = updated;
    await writeFullLinksFile(file, arr);
  }
  closeModal();
  await loadLinksFile(file);
}

async function doDeleteLink(idx) {
  if (!confirm("Hapus link ini?")) return;
  const file = linksFileSelect.value;
  const arr = [...linksData];
  arr.splice(idx,1);
  await writeFullLinksFile(file, arr);
  await loadLinksFile(file);
}

// ------- Worker helper functions (read/write/update/delete) -------

async function writeFullProductsFile(file, arrayData){
  try {
    const res = await fetch(`${WORKER_BASE}/products?file=${encodeURIComponent(file)}`, {
      method: "POST",
      headers: {"Content-Type":"application/json","X-API-KEY":API_KEY},
      body: JSON.stringify(arrayData)
    });
    const j = await res.json();
    if (j.ok) alert("Tersimpan.");
    else alert("Gagal menyimpan: "+(j.error||JSON.stringify(j)));
  } catch (e){ console.error(e); alert("Error saat menyimpan"); }
}

async function writeFullLinksFile(file, arrayData){
  try {
    const res = await fetch(`${WORKER_BASE}/links?file=${encodeURIComponent(file)}`, {
      method: "POST",
      headers: {"Content-Type":"application/json","X-API-KEY":API_KEY},
      body: JSON.stringify(arrayData)
    });
    const j = await res.json();
    if (j.ok) alert("Tersimpan.");
    else alert("Gagal menyimpan: "+(j.error||JSON.stringify(j)));
  } catch (e){ console.error(e); alert("Error saat menyimpan"); }
}

async function updateProductById(file, id, itemObj){
  try {
    const res = await fetch(`${WORKER_BASE}/products?file=${encodeURIComponent(file)}&id=${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json","X-API-KEY":API_KEY},
      body: JSON.stringify(itemObj)
    });
    const j = await res.json();
    if (j.ok) alert("Berhasil diperbarui.");
    else alert("Gagal update: "+(j.error||JSON.stringify(j)));
  } catch(e){ console.error(e); alert("Error update"); }
}

async function deleteItemById(kind, file, id) {
  try {
    const url = `${WORKER_BASE}/${kind}?file=${encodeURIComponent(file)}&id=${encodeURIComponent(id)}`;
    const res = await fetch(url, { method: "DELETE", headers: {"X-API-KEY":API_KEY} });
    const j = await res.json();
    if (j.ok) return true;
    else { alert("Gagal menghapus: "+(j.error||"")); return false; }
  } catch(e){ console.error(e); alert("Error delete"); return false; }
}

// ------- INIT AFTER AUTH -------
async function initAfterAuth(){
  // scan files
  await scanFiles();
  // hide/show controls
  document.getElementById("adminUserLabel").innerText = ADMIN_USER;
}

// check login on load
window.addEventListener("load", ()=>{
  if (localStorage.getItem("adminLogin") === "true") {
    initAfterAuth();
  } else {
    showLogin();
  }
});