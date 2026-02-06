import { eventBus } from "../service/EventBus";
import { GeoJSLocation } from "../types/geoJS";
import { WeatherData } from "../types/openWeatherMap";
import { WeatherHistory } from "../types/weatherHistory";

export const eventNameCityChanged = "city:changed";

let menuEl: HTMLElement | null = null;
let contentEl: HTMLElement | null = null;
let cityEl: HTMLElement | null = null;
let historyEl: HTMLElement | null = null;
let dataEl: HTMLElement | null = null;

function createElementWithClassAndText(
  tagName: string,
  className: string | string[],
  text: string,
): HTMLElement {
  const newEl: HTMLElement = document.createElement(tagName);
  if (Array.isArray(className)) {
    className.forEach((classNm) => newEl.classList.add(classNm));
  } else if (className) {
    newEl.classList.add(className);
  }
  newEl.innerText = text;
  return newEl;
}

function addInfoElement(
  parentEl: HTMLElement,
  description: string,
  value: string,
): void {
  const divEl: HTMLElement = document.createElement("div");
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

function renderMainMenu(element: HTMLElement): void {
  const menuAboutEl: HTMLElement = createElementWithClassAndText(
    "a",
    ["menu-item", "border"],
    "О приложении",
  );
  (menuAboutEl as HTMLAnchorElement).href = PREFIX + "about";
  element.append(menuAboutEl);
  const menuWeatherEl = createElementWithClassAndText(
    "a",
    ["menu-item", "border"],
    "Погода в городах",
  );
  (menuWeatherEl as HTMLAnchorElement).href = PREFIX + "city";
  element.append(menuWeatherEl);
}

export function renderMainPage(element: HTMLElement): void {
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

export function renderAboutPage(): void {
  if (contentEl) {
    contentEl.replaceChildren(
      createElementWithClassAndText("h2", "", `Приложение "Погода"`),
    );
    addInfoElement(contentEl, "Разработчик", "Тропин А.Б.");
  }
  dataEl = null;
  cityEl = null;
}

function createCityNameElement(): HTMLElement {
  cityEl = createElementWithClassAndText("div", ["flex-container"], "");
  const searchEl = createElementWithClassAndText(
    "div",
    ["city-search", "border"],
    "",
  );
  historyEl = createElementWithClassAndText("div", ["width100", "border"], "");
  cityEl.append(searchEl, historyEl);
  const cityInput: HTMLElement = createElementWithClassAndText(
    "input",
    "input",
    "",
  );
  cityInput.addEventListener("input", (event: Event) => {
    event.target &&
      (event.target as HTMLInputElement).value &&
      eventBus.triggerDebounced(
        1000,
        eventNameCityChanged,
        (event.target as HTMLInputElement).value,
      );
  });
  searchEl.append(
    createElementWithClassAndText(
      "label",
      ["input-description", "width100"],
      "Показать погоду в городе: ",
    ),
    cityInput,
  );
  return cityEl;
}

export function renderHistory(weatherHistory: WeatherHistory[]): void {
  if (!historyEl) return;
  const headerEl: HTMLElement = createElementWithClassAndText(
    "text",
    "info-header",
    "История просмотра данных о погоде",
  );
  const listEl: HTMLElement = createElementWithClassAndText(
    "ul",
    "history-wh",
    "",
  );
  weatherHistory &&
    weatherHistory instanceof Array &&
    weatherHistory.map((item) => {
      const listItem: HTMLElement = createElementWithClassAndText("li", "", "");
      const aEl: HTMLElement = createElementWithClassAndText(
        "a",
        "menu-item",
        `${item.city}: ${item.temp}°C (${item.date})`,
      );
      (aEl as HTMLAnchorElement).href = PREFIX + `city/${item.city}`;
      listItem.append(aEl);
      listEl.append(listItem);
    });
  historyEl.replaceChildren(headerEl, listEl);
}

export function initWeatherPage(): void {
  if (contentEl) {
    cityEl = cityEl || createCityNameElement();
    dataEl = createElementWithClassAndText("div", [], "");
    contentEl.replaceChildren(cityEl, dataEl);
  }
}

function renderLoadingMessage(element: HTMLElement, message: string): void {
  const labelLoading: HTMLElement = createElementWithClassAndText(
    "label",
    "loading",
    message,
  );
  element.append(labelLoading);
}

export function renderLocationLoading() {
  initWeatherPage();
  dataEl &&
    renderLoadingMessage(dataEl, "Загрузка данных о текущем расположении...");
}

export function renderWeatherLoading() {
  initWeatherPage();
  dataEl && renderLoadingMessage(dataEl, "Загрузка данных о погоде...");
}

export function renderLocationError(error: string): void {
  if (!dataEl) return;
  const locationEl: HTMLElement = createElementWithClassAndText(
    "div",
    ["location", "border"],
    "",
  );
  dataEl.replaceChildren(locationEl);
  locationEl.append(createElementWithClassAndText("label", "error", error));
}

export function renderLocationInfo(location: GeoJSLocation): void {
  if (!dataEl) return;
  const locationEl: HTMLElement = createElementWithClassAndText(
    "div",
    ["location", "border"],
    "",
  );
  dataEl.replaceChildren(locationEl);
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

export function renderWeatherError(error: string) {
  if (!dataEl) return;
  const weatherEl = createElementWithClassAndText(
    "div",
    ["weather", "border"],
    "",
  );
  dataEl.replaceChildren(weatherEl);
  weatherEl.append(createElementWithClassAndText("label", "error", error));
}

export function renderWeatherInfo(weather: WeatherData) {
  if (!dataEl) return;
  const weatherEl = createElementWithClassAndText(
    "div",
    ["weather", "border"],
    "",
  );
  dataEl.replaceChildren(weatherEl);
  if (weather) {
    const container = createElementWithClassAndText(
      "div",
      "flex-container",
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
        weather.main.temp.toString(),
      );
      addInfoElement(
        containerWeather,
        "Ощущается как, °C",
        weather.main.feels_like.toString(),
      );
      addInfoElement(
        containerWeather,
        "Влажность, %",
        weather.main.humidity.toString(),
      );
    }
    if (weather.wind) {
      addInfoElement(
        containerWeather,
        "Направление ветра, °",
        weather.wind.deg.toString(),
      );
      addInfoElement(
        containerWeather,
        "Скорость ветра, м/с",
        weather.wind.speed.toString(),
      );
    }
    if (weather.clouds) {
      addInfoElement(
        containerWeather,
        "Облачность, %",
        weather.clouds.all.toString(),
      );
    }
    if (weather.coord) {
      const map: HTMLElement = createElementWithClassAndText("img", "map", "");
      (map as HTMLImageElement).src =
        `https://static-maps.yandex.ru/1.x/?ll=${weather.coord.lon},${weather.coord.lat}&spn=0.1,0.1&l=map&size=400,400`;
      (map as HTMLImageElement).alt = `Карта ${weather.name}`;
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
