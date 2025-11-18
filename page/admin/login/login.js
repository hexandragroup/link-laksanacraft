const ADMIN_USER = "admin@laksanacraft";
const ADMIN_PASS = "laksanacraft-admin";

// Proses login
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem("adminLogin", "true");
        window.location.href = "/page/admin/"; // Redirect ke admin dashboard
    } else {
        alert("Login gagal! Username atau password salah.");
    }
});

// Tampilkan/Sembunyikan password
function togglePassword() {
    const pass = document.getElementById("loginPass");
    pass.type = pass.type === "password" ? "text" : "password";
}