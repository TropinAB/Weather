import { eventBus } from "/src/service/EventBus";

export const eventNameCityChanged = "city:changed";

let menuEl = null,
  contentEl = null,
  cityEl = null,
  dataEl = null;

function createElementWithClassAndText(tagName, className, text) {
  const newEl = document.createElement(tagName);
  if (Array.isArray(className)) {
    className.forEach((classNm) => newEl.classList.add(classNm));
  } else if (className) {
    newEl.classList.add(className);
  }
  newEl.innerText = text;
  return newEl;
}

function addInfoElement(parentEl, description, value) {
  const divEl = document.createElement("div");
  divEl.append(
    createElementWithClassAndText(
      "label",
      "info-description",
      `${description}:`,
    ),
  );
  divEl.append(createElementWithClassAndText("label", "info-value", value));
  parentEl.append(divEl);
}

function renderMainMenu(element) {
  const menuAboutEl = createElementWithClassAndText(
    "a",
    ["menu-item", "border"],
    "О приложении",
  );
  menuAboutEl.href = PREFIX + "about";
  element.append(menuAboutEl);
  const menuWeatherEl = createElementWithClassAndText(
    "a",
    ["menu-item", "border"],
    "Погода в городах",
  );
  menuWeatherEl.href = PREFIX + "city";
  element.append(menuWeatherEl);
}

export function renderMainPage(element) {
  element.append(
    createElementWithClassAndText(
      "h1",
      "header",
      `Моё первое приложение "Погода"`,
    ),
  );
  menuEl = createElementWithClassAndText("div", ["menu"], "");
  renderMainMenu(menuEl);
  element.append(menuEl);
  contentEl = createElementWithClassAndText("div", [], "");
  element.append(contentEl);
}

export function renderAboutPage() {
  contentEl.replaceChildren(
    createElementWithClassAndText("h2", "", `Приложение "Погода"`),
  );
  addInfoElement(contentEl, "Разработчик", "Тропин А.Б.");
  dataEl = null;
  cityEl = null;
}

function getCityNameElement() {
  cityEl = createElementWithClassAndText("div", "border", "");
  cityEl.append(
    createElementWithClassAndText(
      "label",
      "input-description",
      "Показать погоду в городе: ",
    ),
  );
  const cityInput = createElementWithClassAndText("input", "input", "");
  cityInput.addEventListener("input", (event) => {
    event.target.value &&
      eventBus.triggerDebounced(1000, eventNameCityChanged, event.target.value);
  });
  cityEl.append(cityInput);
  return cityEl;
}

export function initWeatherPage() {
  cityEl = cityEl || getCityNameElement();
  contentEl.replaceChildren(cityEl);
  dataEl = createElementWithClassAndText("div", [], "");
  contentEl.append(dataEl);
}

function renderLoadingMessage(element, message) {
  const labelLoading = createElementWithClassAndText(
    "label",
    "loading",
    message,
  );
  element.append(labelLoading);
}

export function renderLocationLoading() {
  initWeatherPage();
  renderLoadingMessage(dataEl, "Загрузка данных о текущем расположении...");
}

export function renderWeatherLoading() {
  initWeatherPage();
  renderLoadingMessage(dataEl, "Загрузка данных о погоде...");
}

export function renderLocationInfo(location) {
  const locationEl = createElementWithClassAndText(
    "div",
    ["location", "border"],
    "",
  );
  dataEl.replaceChildren(locationEl);
  if (location instanceof Error) {
    locationEl.append(
      createElementWithClassAndText("label", "error", location.message),
    );
    return;
  }
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
  } else {
    locationEl.append(
      createElementWithClassAndText(
        "label",
        "error",
        "Данные о местоположении не получены",
      ),
    );
  }
}

export function renderWeatherInfo(weather) {
  const weatherEl = createElementWithClassAndText(
    "div",
    ["weather", "border"],
    "",
  );
  dataEl.replaceChildren(weatherEl);
  if (weather instanceof Error) {
    weatherEl.append(
      createElementWithClassAndText("label", "error", weather.message),
    );
    return;
  }
  if (weather) {
    const container = createElementWithClassAndText(
      "div",
      "weather-container",
      "",
    );
    weatherEl.append(
      createElementWithClassAndText(
        "text",
        "info-header",
        `Данные о погоде в городе '${weather.name}'`,
      ),
      container,
    );
    const containerMap = createElementWithClassAndText(
      "div",
      "weather-map",
      "",
    );
    const containerWeather = createElementWithClassAndText(
      "div",
      "width100",
      "",
    );
    container.append(containerMap, containerWeather);
    if (weather.main) {
      addInfoElement(
        containerWeather,
        "Текущая температура, °C",
        weather.main.temp,
      );
      addInfoElement(
        containerWeather,
        "Ощущается как, °C",
        weather.main.feels_like,
      );
      addInfoElement(containerWeather, "Влажность, %", weather.main.humidity);
    }
    if (weather.wind) {
      addInfoElement(
        containerWeather,
        "Направление ветра, °",
        weather.wind.deg,
      );
      addInfoElement(
        containerWeather,
        "Скорость ветра, м/с",
        weather.wind.speed,
      );
    }
    if (weather.clouds) {
      addInfoElement(containerWeather, "Облачность, %", weather.clouds.all);
    }
    if (weather.coord) {
      // https://static-maps.yandex.ru/1.x/?ll=30.2642,59.8944&spn=0.1,0.1&l=map&size=400,400
      const map = createElementWithClassAndText("img", "map");
      map.src = `https://static-maps.yandex.ru/1.x/?ll=${weather.coord.lon},${weather.coord.lat}&spn=0.1,0.1&l=map&size=400,400`;
      map.alt = `Карта ${weather.name}`;
      containerMap.append(map);
    }
  } else {
    weatherEl.append(
      createElementWithClassAndText(
        "label",
        "error",
        "Данные о погоде не получены",
      ),
    );
  }
}
