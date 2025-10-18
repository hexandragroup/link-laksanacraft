/* ======================================================
   Google Analytics / Tag Manager
   ====================================================== */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-V1JWDFFYK2');

/* ======================================================
   Google Translate
   ====================================================== */
window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({pageLanguage: 'id'}, 'google_translate_element');
};

function doGTranslate(el) {
  if (el.value === '') return;
  var langPair = el.value.split('|');
  var lang = langPair[1];

  if (lang === 'id') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
    window.location.href = window.location.origin + window.location.pathname;
    return;
  }

  var select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
}

// Load Google Translate
var gtScript = document.createElement('script');
gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.head.appendChild(gtScript);