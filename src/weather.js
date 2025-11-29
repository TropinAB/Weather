import { sleep } from "./tools.js";
import { createElementWithClassAndText, addInfoElement } from "./toolsDOM.js";

export async function loadCurrentLocation(locationEl) {
  const labelLoading = createElementWithClassAndText(
    "label",
    "loading",
    "Загрузка данных о текущем расположении...",
  );
  locationEl.append(labelLoading);

  // эмитация загрузки данных
  await sleep(3000);

  labelLoading.remove();

  return {
    city: "Санкт-Петербург",
  };
}

export function displayLocationInfo(locationEl, location) {
  locationEl.append(
    createElementWithClassAndText(
      "label",
      "info-header",
      "Данные о местоположении",
    ),
  );
  if (location.city) addInfoElement(locationEl, "Город", location.city);
}

export async function loadWeatherInfo(weatherEl) {
  const labelLoading = createElementWithClassAndText(
    "label",
    "loading",
    "Загрузка данных о погоде...",
  );
  weatherEl.append(labelLoading);

  // эмитация загрузки данных
  await sleep(5000);
  const data = `{"coord":{"lon":30.2642,"lat":59.8944},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"base":"stations","main":{"temp":1.7,"feels_like":-2.79,"temp_min":1.7,"temp_max":2.08,"pressure":1009,"humidity":94,"sea_level":1009,"grnd_level":1007},"visibility":10000,"wind":{"speed":5,"deg":210},"snow":{"1h":0.21},"clouds":{"all":75},"dt":1764419706,"sys":{"type":2,"id":2045711,"country":"RU","sunrise":1764397741,"sunset":1764421553},"timezone":10800,"id":498817,"name":"Санкт-Петербург","cod":200}`;

  labelLoading.remove();

  return JSON.parse(data);
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
