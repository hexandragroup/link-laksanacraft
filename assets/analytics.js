// --- Google Analytics / Tag Manager ---
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-V1JWDFFYK2');

// --- Google Translate ---
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'id' }, 'google_translate_element');
}

function doGTranslate(el) {
  if (el.value === '') return;
  var lang = el.value.split('|')[1];
  if (lang === 'id') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
    location.href = "https://link.laksanacraft.my.id/";
    return;
  }
  var select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
}

// --- Muat script translate Google secara dinamis ---
const gtScript = document.createElement('script');
gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.head.appendChild(gtScript);