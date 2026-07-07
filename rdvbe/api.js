const API_URL = "https://script.google.com/macros/s/AKfycbwqgy3XZwcpGW4XZ-ly0aMld5UbOeh6nGI2y5syfdXeAScFc5Tf-4l8P17EMIyX6PA586w/exec?api=dashboard";

function fetchDashboardData() {
  return new Promise((resolve, reject) => {
    const callbackName = "ddDashboardCallback_" + Date.now();

    window[callbackName] = function (data) {
      delete window[callbackName];
      script.remove();
      resolve(data);
    };

    const script = document.createElement("script");
    script.src = API_URL + "&callback=" + callbackName + "&_=" + Date.now();
    script.onerror = function () {
      delete window[callbackName];
      script.remove();
      reject(new Error("Impossible de charger les données dashboard."));
    };

    document.body.appendChild(script);
  });
}
