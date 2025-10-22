/* ======================================================
   Google Analytics / Tag Manager (stabil)
   ====================================================== */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-V1JWDFFYK2');

/* ======================================================
   Script untuk mengganti alias (stabil)
   ====================================================== */
    document.addEventListener("DOMContentLoaded", async () => {
      try {
        const res = await fetch("/assets/config/base.json");
        const BASES = await res.json();

        // Tag yang bisa berisi URL
        const tags = ["a", "link", "img", "script"];

        tags.forEach(tag => {
          document.querySelectorAll(tag).forEach(el => {
            ["href", "src"].forEach(attr => {
              const val = el.getAttribute(attr);
              if (!val) return;

              const prefix = val.split("/")[0];
              if (BASES[prefix]) {
                const base = BASES[prefix].replace(/\/$/, "");
                const newUrl = val.replace(prefix, base);
                el.setAttribute(attr, newUrl);
              }
            });
          });
        });
      } catch (err) {
        console.error("Gagal memuat base.json:", err);
      }
    });

  // === Theme switcher ===
  const themeLink = document.createElement("link");
  themeLink.id = "theme-style";
  themeLink.rel = "stylesheet";
  document.head.appendChild(themeLink);


/* ======================================================
   Google Translate (stabil)
   ====================================================== */
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: "id" }, "google_translate_element");
}

function doGTranslate(el) {
  if (el.value === "") return;
  var langPair = el.value.split("|");
  var lang = langPair[1];
  if (lang === "id") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
    window.location.href = window.location.origin + window.location.pathname;
    return;
  }
  var select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }
}
