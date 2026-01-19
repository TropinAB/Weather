let locationEl, weatherEl;

function createElementWithClassAndText(tagName, className, text) {
  const newEl = document.createElement(tagName);
  if (Array.isArray(className)) {
    className.forEach((classNm) => newEl.classList.add(classNm));
  } else {
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

export function renderMainPage(element) {
  element.append(
    createElementWithClassAndText(
      "h1",
      "header",
      `Моё первое приложение "Погода"`,
    ),
  );
  locationEl = createElementWithClassAndText("div", ["location", "border"], "");
  element.append(locationEl);
  weatherEl = createElementWithClassAndText("div", ["weather", "border"], "");
  element.append(weatherEl);
}

function renderLoadingMessage(element, message) {
  const labelLoading = createElementWithClassAndText(
    "label",
    "loading",
    message,
  );
  element.append(labelLoading);
}

export function renderLocationloading() {
  renderLoadingMessage(locationEl, "Загрузка данных о текущем расположении...");
}

export function renderWeatherloading() {
  renderLoadingMessage(weatherEl, "Загрузка данных о погоде...");
}

export function renderLocationInfo(location) {
  locationEl.replaceChildren();
  if (location instanceof Error) {
    locationEl.append(
      createElementWithClassAndText("label", "error", location.message),
    );
    return;
  }
  //console.log(location);
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
  weatherEl.replaceChildren();
  if (weather instanceof Error) {
    weatherEl.append(
      createElementWithClassAndText("label", "error", weather.message),
    );
    return;
  }
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
        "error",
        "Данные о погоде не получены",
      ),
    );
  }
}
