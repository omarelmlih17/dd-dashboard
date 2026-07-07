const API_URL = "https://script.google.com/macros/s/AKfycbzhpeSXP-bE6Km9gGk7DQSLdwtopWN8svJ-Af_EtcyGGLwLdTtL8jVuEvtOVqSvsRa_LQ/exec?api=dashboard";

function fetchDashboardData() {
  return new Promise((resolve, reject) => {
    const callbackName = "ddDashboardCallback_" + Date.now();

    console.log("Chargement API:", API_URL);

    window[callbackName] = function (data) {
      console.log("Données reçues:", data);
      delete window[callbackName];
      script.remove();
      resolve(data);
    };

    const script = document.createElement("script");
    script.src = API_URL + "&callback=" + callbackName + "&_=" + Date.now();

    script.onerror = function () {
      console.error("Erreur chargement JSONP:", script.src);
      delete window[callbackName];
      script.remove();
      reject(new Error("Impossible de charger les données dashboard."));
    };

    document.body.appendChild(script);
  });
}
