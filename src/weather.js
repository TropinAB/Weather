//import { sleep } from "./tools.js";
import { createElementWithClassAndText, addInfoElement } from "./toolsDOM.js";

const API_ID = "97d93f1704dcb8e35dd2045c8e75710d";

export async function loadCurrentLocation(locationEl) {
  const labelLoading = createElementWithClassAndText(
    "label",
    "loading",
    "Загрузка данных о текущем расположении...",
  );
  locationEl.append(labelLoading);

  const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
  const data = await response.json();

  labelLoading.remove();

  return data;
}

export function displayLocationInfo(locationEl, location) {
  if (location) {
    locationEl.append(
      createElementWithClassAndText(
        "label",
        "info-header",
        "Данные о местоположении",
      ),
    );
    if (location.country)
      addInfoElement(locationEl, "Страна", location.country);
    if (location.city) addInfoElement(locationEl, "Город", location.city);
  }
}

export async function loadWeatherInfo(weatherEl, latitude, longitude) {
  const labelLoading = createElementWithClassAndText(
    "label",
    "loading",
    "Загрузка данных о погоде...",
  );
  weatherEl.append(labelLoading);

  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_ID}&lang=ru`;
  const response = await fetch(url);
  const data = await response.json();

  labelLoading.remove();

  return data;
}

export function displayWeatherInfo(weatherEl, weather) {
  if (weather) {
    weatherEl.append(
      createElementWithClassAndText("label", "info-header", "Данные о погоде"),
    );
    if (weather.main) {
      addInfoElement(weatherEl, "Текущая температура, °C", weather.main.temp);
      addInfoElement(weatherEl, "Ощущается как, °C", weather.main.feels_like);
      addInfoElement(weatherEl, "Влажность, %", weather.main.humidity);
    }
    if (weather.wind) {
      addInfoElement(weatherEl, "Направление ветра, °", weather.wind.deg);
      addInfoElement(weatherEl, "Скорость ветра, м/с", weather.wind.speed);
    }
    if (weather.clouds) {
      addInfoElement(weatherEl, "Облачность, %", weather.clouds.all);
    }
  } else {
    weatherEl.append(
      createElementWithClassAndText(
        "label",
        "weather-error",
        "Данные о погоде не получены",
      ),
    );
  }
}

export async function prepareWeatherData(locationEl, weatherEl) {
  const location = await loadCurrentLocation(locationEl);
  displayLocationInfo(locationEl, location);
  const weather = await loadWeatherInfo(
    weatherEl,
    location.latitude,
    location.longitude,
  );
  displayWeatherInfo(weatherEl, weather);
}
