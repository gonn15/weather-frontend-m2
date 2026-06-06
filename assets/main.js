function setTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);
}

function getWeatherInfo(code) {
  if (code === 0) {
    return { text: "Soleado", icon: "bi-sun text-warning" };
  }
  if (code >= 1 && code <= 3) {
    return { text: "Parcialmente nublado", icon: "bi-cloud-sun text-warning" };
  }
  if (code >= 45 && code <= 48) {
    return { text: "Niebla", icon: "bi-cloud-fog text-secondary" };
  }
  if (code >= 51 && code <= 67) {
    return { text: "Lluvia", icon: "bi-cloud-rain text-primary" };
  }
  if (code >= 71 && code <= 77) {
    return { text: "Nieve", icon: "bi-snow text-info" };
  }
  if (code >= 80 && code <= 99) {
    return { text: "Tormenta", icon: "bi-cloud-lightning text-dark" };
  }

  return { text: "Desconocido", icon: "bi-question-circle" };
}

// Api open meteo
async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,windspeed_10m`;

  const res = await fetch(url);
  const data = await res.json();

  return data.current;
}




document.addEventListener("DOMContentLoaded", () => {

  const cities = [
    { name: "Santiago", lat: -33.4489, lon: -70.6693 },
    { name: "Valparaíso", lat: -33.0472, lon: -71.6127 },
    { name: "Temuco", lat: -38.7359, lon: -72.5904 },
    { name: "Concepción", lat: -36.8201, lon: -73.0444 },
    { name: "Antofagasta", lat: -23.6509, lon: -70.3975 },
    { name: "Iquique", lat: -20.2307, lon: -70.1357 },
    { name: "La Serena", lat: -29.9027, lon: -71.2519 },
    { name: "Puerto Montt", lat: -41.4693, lon: -72.9424 },
    { name: "Rancagua", lat: -34.1708, lon: -70.7444 },
    { name: "Chillán", lat: -36.6066, lon: -72.1034 },
    { name: "Punta Arenas", lat: -53.1638, lon: -70.9171 },
    { name: "Arica", lat: -18.4783, lon: -70.3126 }
  ];


  async function renderCities() {
    const cityGrid = document.getElementById("cityGrid");
    if (!cityGrid) return;

    // Mostrar loading mientras carga
    cityGrid.innerHTML = `<p class="text-center">Cargando clima...</p>`;

    const weatherPromises = cities.map(async (city) => {
      const weather = await getWeather(city.lat, city.lon);
      return { city, weather };
    });

    const results = await Promise.all(weatherPromises);

    let html = "";

    results.forEach(({ city, weather }) => {
      const weatherInfo = getWeatherInfo(weather.weather_code);

      html += `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card text-center p-3 city-card"
        data-lat="${city.lat}"
        data-lon="${city.lon}"
        data-name="${city.name}">
        
        <h5>${city.name}</h5>
        <i class="bi ${weatherInfo.icon} fs-1"></i>
        <h3>${weather.temperature_2m}°C</h3>
        <p>${weatherInfo.text}</p>
      </div>
    </div>
  `;
    });

    cityGrid.innerHTML = html;


    document.querySelectorAll(".city-card").forEach(card => {
      card.addEventListener("click", () => {

        const lat = card.dataset.lat;
        const lon = card.dataset.lon;
        const name = card.dataset.name;

        window.location.href =
          `detalles.html?lat=${lat}&lon=${lon}&name=${name}`;
      });
    });





  }

  renderCities();

  if (window.location.pathname.includes("detalles.html")) {
    loadDetails();
  }


});

function getParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    lat: params.get("lat"),
    lon: params.get("lon"),
    name: params.get("name")
  };
}

async function loadDetails() {
  const { lat, lon, name } = getParams();

  if (!lat || !lon) {
    document.getElementById("cityName").textContent =
      "Selecciona una ciudad desde la página principal";

    document.getElementById("temp").textContent = "-";
    document.getElementById("humidity").textContent = "-";
    document.getElementById("wind").textContent = "-";

    return;
  }

  // mostrar nombre ciudad
  document.getElementById("cityName").textContent = name;

  // obtener clima
  const weather = await getWeather(lat, lon);

  const weatherInfo = getWeatherInfo(weather.weather_code);

  // mostrar datos
  document.getElementById("temp").textContent =
    `${weather.temperature_2m}°C`;

  document.getElementById("humidity").textContent =
    `${weather.relative_humidity_2m}%`;

  document.getElementById("wind").textContent =
    `${weather.windspeed_10m} km/h`;
}

