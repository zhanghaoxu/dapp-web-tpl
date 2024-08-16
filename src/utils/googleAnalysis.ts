const gtagId = process.env.GTAG_ID;
console.log(gtagId, 'gtag', process.env.CDN_PREFIX);
function init() {
  if (!gtagId) return;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gtagId;
  script.async = true;
  document.body.appendChild(script);
  script.onload = function (e) {
    window.dataLayer = window.dataLayer || [];
    function gtag(a: any, b: any) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', gtagId);
  };
}

export default init;
