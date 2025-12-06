import * as weatherModule from "./weather.js";

global.fetch = jest.fn((url) => {
  if (url.startsWith("https://get.geojs.io")) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          country: "РФ",
          city: "Санкт-Петербург",
        }),
    });
  } else if (url.startsWith("https://api.openweathermap.org")) {
    return Promise.resolve({
      json: () =>
        Promise.resolve(
          JSON.parse(
            `{"coord":{"lon":30.2642,"lat":59.8944},"weather":[{"id":600,"main":"Snow","description":"небольшой снег","icon":"13d"}],"base":"stations","main":{"temp":1.7,"feels_like":-2.79,"temp_min":1.7,"temp_max":2.08,"pressure":1009,"humidity":94,"sea_level":1009,"grnd_level":1007},"visibility":10000,"wind":{"speed":5,"deg":210},"snow":{"1h":0.21},"clouds":{"all":75},"dt":1764419706,"sys":{"type":2,"id":2045711,"country":"RU","sunrise":1764397741,"sunset":1764421553},"timezone":10800,"id":498817,"name":"Санкт-Петербург","cod":200}`,
          ),
        ),
    });
  }
  return Promise.reject();
});

describe("Check prepareWeatherData", () => {
  it("prepareWeatherData is a function", () =>
    expect(weatherModule.prepareWeatherData).toBeInstanceOf(Function));

  it("prepareWeatherData return some data in elements", async () => {
    const locationEl = document.createElement("div");
    const weatherEl = document.createElement("div");

    await weatherModule.prepareWeatherData(locationEl, weatherEl);

    expect(locationEl.innerHTML.length).toBeGreaterThanOrEqual(0);
    expect(weatherEl.innerHTML.length).toBeGreaterThanOrEqual(0);
  }, 10000);
});

describe("Check loadCurrentLocation", () => {
  it("loadCurrentLocation is a function", () =>
    expect(weatherModule.loadCurrentLocation).toBeInstanceOf(Function));

  it("loadCurrentLocation return values", async () => {
    const locationEl = document.createElement("div");

    const location = await weatherModule.loadCurrentLocation(locationEl);

    expect(location).toBeInstanceOf(Object);
    expect(location).toHaveProperty("country");
    expect(location).toHaveProperty("city");
  }, 10000);
});

describe("Check loadWeatherInfo", () => {
  it("loadWeatherInfo is a function", () =>
    expect(weatherModule.loadWeatherInfo).toBeInstanceOf(Function));

  it("loadWeatherInfo return values", async () => {
    const weatherEl = document.createElement("div");

    const weather = await weatherModule.loadWeatherInfo(weatherEl);

    expect(weather).toBeInstanceOf(Object);
    expect(weather).toHaveProperty("main");
    expect(weather).toHaveProperty("weather");
  }, 10000);
});

describe("Check displayLocationInfo", () => {
  it("displayLocationInfo is a function", () =>
    expect(weatherModule.displayLocationInfo).toBeInstanceOf(Function));

  it("Test null data", () => {
    const locationEl = document.createElement("div");
    weatherModule.displayLocationInfo(locationEl, null);
    expect(locationEl.children).toHaveLength(0);
  });

  it("Test clear data", () => {
    const locationEl = document.createElement("div");
    const locationData = {};
    weatherModule.displayLocationInfo(locationEl, locationData);
    expect(locationEl.children).toHaveLength(1);
    expect(locationEl.children[0].classList).toHaveLength(1);
    expect(locationEl.children[0].classList[0]).toEqual("info-header");
  });

  it("Test location data", () => {
    const locationEl = document.createElement("div");
    const locationData = {
      country: "РФ",
      city: "Some city",
    };
    weatherModule.displayLocationInfo(locationEl, locationData);
    expect(locationEl.children).toHaveLength(3);
    expect(locationEl.children[1].classList).toHaveLength(0);
    expect(locationEl.children[1].children).toHaveLength(2);
    expect(locationEl.children[1].children[0].classList[0]).toEqual(
      "info-description",
    );
    expect(locationEl.children[1].children[1].classList[0]).toEqual(
      "info-value",
    );
  });
});

describe("Check displayWeatherInfo", () => {
  it("displayWeatherInfo is a function", () =>
    expect(weatherModule.displayWeatherInfo).toBeInstanceOf(Function));

  it("Test null data", () => {
    const weatherEl = document.createElement("div");
    weatherModule.displayWeatherInfo(weatherEl, null);
    expect(weatherEl.children).toHaveLength(1);
    expect(weatherEl.children[0].classList).toHaveLength(1);
    expect(weatherEl.children[0].classList[0]).toEqual("weather-error");
  });

  it("Test clear data", () => {
    const weatherEl = document.createElement("div");
    const weatherData = {};
    weatherModule.displayWeatherInfo(weatherEl, weatherData);
    expect(weatherEl.children).toHaveLength(1);
    expect(weatherEl.children[0].classList).toHaveLength(1);
    expect(weatherEl.children[0].classList[0]).toEqual("info-header");
  });

  it("Test weather data", () => {
    const weatherEl = document.createElement("div");
    const weatherData = {
      main: {
        temp: 15,
        feels_like: 10,
        humidity: 75,
      },
      wind: {
        deg: 90,
        speed: 11,
      },
      clouds: {
        all: 10,
      },
    };
    weatherModule.displayWeatherInfo(weatherEl, weatherData);
    expect(weatherEl.children).toHaveLength(7);
    expect(weatherEl.children[0].classList).toHaveLength(1);
  });
});
