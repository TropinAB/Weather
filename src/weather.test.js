import { eventBus } from "./service/EventBus";
import { loadAndRenderWeatherData, eventNameRequestLocation } from "./weather";

const ERROR_MESSAGE = "Network error";
const errorResponse = {
  ok: false,
  status: 404,
  statusText: "Страница не найдена",
};
const nullResponse = {
  ok: true,
  json: () => Promise.resolve(null),
};
const successDataGeo = {
  accuracy: 20,
  city: "St Petersburg",
  timezone: "Europe/Moscow",
  organization: "AS12389 Rostelecom",
  ip: "178.66.128.229",
  asn: 12389,
  area_code: "0",
  organization_name: "Rostelecom",
  country_code: "RU",
  country_code3: "RUS",
  continent_code: "EU",
  country: "Russia",
  region: "St.-Petersburg",
  latitude: "59.8983",
  longitude: "30.2618",
};
const successDataGeoNil = {
  latitude: "nil",
  longitude: "nil",
};
const successResponseGeo = {
  ok: true,
  json: () => Promise.resolve(successDataGeo),
};
const successResponseGeoNil = {
  ok: true,
  json: () => Promise.resolve(successDataGeoNil),
};
const successDataWeather = {
  coord: {
    lon: 30.2642,
    lat: 59.8944,
  },
  weather: [
    {
      id: 600,
      main: "Snow",
      description: "небольшой снег",
      icon: "13d",
    },
  ],
  base: "stations",
  main: {
    temp: 1.7,
    feels_like: -2.79,
    temp_min: 1.7,
    temp_max: 2.08,
    pressure: 1009,
    humidity: 94,
    sea_level: 1009,
    grnd_level: 1007,
  },
  visibility: 10000,
  wind: {
    speed: 5,
    deg: 210,
  },
  snow: {
    "1h": 0.21,
  },
  clouds: {
    all: 75,
  },
  dt: 1764419706,
  sys: {
    type: 2,
    id: 2045711,
    country: "RU",
    sunrise: 1764397741,
    sunset: 1764421553,
  },
  timezone: 10800,
  id: 498817,
  name: "Санкт-Петербург",
  cod: 200,
};
const successResponseWeather = {
  ok: true,
  json: () => Promise.resolve(successDataWeather),
};

describe("Check loadAndRenderWeatherData", () => {
  global.fetch = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const AllEvents = async (times = 3) => {
    for (let i = 1; i <= times; i++) {
      jest.runOnlyPendingTimers();
      await Promise.resolve(); // Для запуска fetch
    }
  };

  it("loadAndRenderWeatherData is a function", () =>
    expect(loadAndRenderWeatherData).toBeInstanceOf(Function));

  it("loadAndRenderWeatherData render page with errorResponse on Geo", async () => {
    fetch.mockResolvedValue(errorResponse);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents();
    expect(fetch).toHaveBeenCalledTimes(1);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"></div></div><div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with successResponse on Geo with Nil", async () => {
    fetch.mockResolvedValue(successResponseGeoNil);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents();
    expect(fetch).toHaveBeenCalledTimes(0);

    eventBus.trigger(eventNameRequestLocation);
    await AllEvents(4);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"></ul></div></div><div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with fetch reject on Geo", async () => {
    fetch.mockRejectedValue(new Error(ERROR_MESSAGE));
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents();

    eventBus.trigger(eventNameRequestLocation);
    await AllEvents(10);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"></ul></div></div><div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with fetch reject on Weather", async () => {
    fetch
      .mockResolvedValueOnce(successResponseGeo)
      .mockRejectedValue(new Error(ERROR_MESSAGE));
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents(6);

    eventBus.trigger(eventNameRequestLocation);
    await AllEvents(10);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"></ul></div></div><div><div class="weather border"><label class="error"></label></div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with nullResponse on Geo", async () => {
    fetch.mockResolvedValueOnce(nullResponse);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents();

    eventBus.trigger(eventNameRequestLocation);
    await AllEvents(10);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"></ul></div></div><div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with errorResponse on Weather", async () => {
    fetch
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(errorResponse);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents(6);

    eventBus.trigger(eventNameRequestLocation);
    await AllEvents(10);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"></ul></div></div><div><div class="weather border"><label class="error"></label></div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with nullResponse on Weather", async () => {
    fetch
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(nullResponse);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents(6);

    eventBus.trigger(eventNameRequestLocation);
    await AllEvents(10);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"></ul></div></div><div><div class="weather border"><label class="error"></label></div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with success Response", async () => {
    fetch
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(successResponseWeather);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents(6);

    eventBus.trigger(eventNameRequestLocation);
    await AllEvents(10);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"><li><a class="menu-item" href="/city/Санкт-Петербург"></a></li></ul></div></div><div><div class="weather border"><text class="info-header"></text><div class="flex-container"><div class="weather-map"><img class="map" src="https://static-maps.yandex.ru/1.x/?ll=30.2642,59.8944&amp;spn=0.1,0.1&amp;l=map&amp;size=400,400" alt="Карта Санкт-Петербург"></div><div class="width100"><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div></div></div></div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with success Response and click About", async () => {
    fetch
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(successResponseWeather);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents(6);

    const menuAboutEl = element.querySelector('a[href="/about"]');
    menuAboutEl.click();
    await AllEvents(10);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><h2></h2><div><label class="info-description"></label><label class="info-value"></label></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with success Response and click Weather", async () => {
    fetch
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(successResponseWeather);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents(6);

    const menuWeatherEl = element.querySelector('a[href="/city"]');
    menuWeatherEl.click();
    await AllEvents(10);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"><li><a class="menu-item" href="/city/Санкт-Петербург"></a></li></ul></div></div><div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page with success Response for City", async () => {
    fetch
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(successResponseWeather);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents(6);

    const cityInput = element.querySelector("input");
    cityInput.value = "Moscow";
    cityInput.dispatchEvent(new window.Event("input"));
    await AllEvents(10);

    // eventBus.trigger(eventNameRequestLocation);
    // await AllEvents(10);

    // expect(fetch).toHaveBeenCalledWith("")
    // expect(fetch).toHaveBeenCalledTimes(1);

    expect(element.innerHTML).toMatchInlineSnapshot(
      `"<h1 class="header"></h1><div class="menu"><a class="menu-item border" href="/about"></a><a class="menu-item border" href="/city"></a></div><div><div class="flex-container"><div class="city-search border"><label class="input-description width100"></label><input class="input"></div><div class="width100 border"><text class="info-header"></text><ul class="history-wh"><li><a class="menu-item" href="/city/Санкт-Петербург"></a></li></ul></div></div><div><div class="weather border"><text class="info-header"></text><div class="flex-container"><div class="weather-map"><img class="map" src="https://static-maps.yandex.ru/1.x/?ll=30.2642,59.8944&amp;spn=0.1,0.1&amp;l=map&amp;size=400,400" alt="Карта Санкт-Петербург"></div><div class="width100"><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div><div><label class="info-description"></label><label class="info-value"></label></div></div></div></div></div></div>"`,
    );
  });

  it("loadAndRenderWeatherData render page and click on not menu-item", async () => {
    fetch
      .mockResolvedValueOnce(successResponseGeo)
      .mockResolvedValueOnce(successResponseWeather);
    const element = document.createElement("div");

    await loadAndRenderWeatherData(element);
    await AllEvents(6);

    element.click();

    expect(fetch).toHaveBeenCalled();
  });
});
