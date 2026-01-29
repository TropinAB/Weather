import { eventBus } from "../service/EventBus";
import { GeoJSLocation } from "../types/geoJS";
import { WeatherData } from "../types/openWeatherMap";

export const eventNameCityChanged = "city:changed";

let menuEl: HTMLElement | null = null;
let contentEl: HTMLElement | null = null;
let cityEl: HTMLElement | null = null;
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
  const cityEl: HTMLElement = createElementWithClassAndText(
    "div",
    "border",
    "",
  );
  cityEl.append(
    createElementWithClassAndText(
      "label",
      "input-description",
      "Показать погоду в городе: ",
    ),
  );
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
  cityEl.append(cityInput);
  return cityEl;
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

export function renderLocationInfo(location: GeoJSLocation): void {
  if (!dataEl) return;
  const locationEl: HTMLElement = createElementWithClassAndText(
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

export function renderWeatherInfo(weather: WeatherData) {
  if (!dataEl) return;
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
    weatherEl.append(
      createElementWithClassAndText(
        "label",
        "info-header",
        `Данные о погоде в городе '${weather.name}'`,
      ),
    );
    if (weather.main) {
      addInfoElement(
        weatherEl,
        "Текущая температура, °C",
        weather.main.temp.toString(),
      );
      addInfoElement(
        weatherEl,
        "Ощущается как, °C",
        weather.main.feels_like.toString(),
      );
      addInfoElement(
        weatherEl,
        "Влажность, %",
        weather.main.humidity.toString(),
      );
    }
    if (weather.wind) {
      addInfoElement(
        weatherEl,
        "Направление ветра, °",
        weather.wind.deg.toString(),
      );
      addInfoElement(
        weatherEl,
        "Скорость ветра, м/с",
        weather.wind.speed.toString(),
      );
    }
    if (weather.clouds) {
      addInfoElement(weatherEl, "Облачность, %", weather.clouds.all.toString());
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
