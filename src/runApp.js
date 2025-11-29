import "./runApp.css";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadCurrentLocation(locationEl) {
  const labelLoading = document.createElement("label");
  labelLoading.innerText = `Загрузка данных о текущем расположении...`;
  labelLoading.classList.add("loading");
  locationEl.append(labelLoading);

  await sleep(3000);

  // эмитация загрузки данных
  labelLoading.remove();

  return {};
}

function displayLocationInfo(locationEl, location) {

}

async function loadWeatherInfo(weatherEl) {
  const labelLoading = document.createElement("label");
  labelLoading.innerText = `Загрузка данных о погоде...`;
  labelLoading.classList.add("loading");
  weatherEl.append(labelLoading);

  // эмитация загрузки данных
  await sleep(5000);

  labelLoading.remove();

  return null;
}

export async function runApp(el) {
  el.innerHTML = `<h1 class="header">Моё первое приложение "Погода"</h1>
  <div class="location"></div>
  <div class="weather"></div>`;
  const locationEl = el.querySelector(".location");
  const weatherEl = el.querySelector(".weather");

  const location = await loadCurrentLocation(locationEl);
  if (location) {
    displayLocationInfo(locationEl, location);

    await loadWeatherInfo(weatherEl);
  }
}
