import { getWeatherData } from "./openWeatherMap";

describe("Check getWeatherData function", () => {
  global.fetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const ERROR_MESSAGE = "Network error";
  const errorResponse = {
    ok: false,
    status: 404,
    statusText: "Страница не найдена",
  };
  const successData = {
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
  const successResponse = {
    ok: true,
    json: () => Promise.resolve(successData),
  };

  it("getCurrentLocationData is a function", () =>
    expect(getWeatherData).toBeInstanceOf(Function));
  it("test Network error", async () => {
    fetch.mockRejectedValue(new Error(ERROR_MESSAGE));

    await expect(getWeatherData(1, 1)).resolves.toThrow(ERROR_MESSAGE);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("test Error response", async () => {
    fetch.mockResolvedValueOnce(errorResponse);

    await expect(getWeatherData()).resolves.toThrow(
      `Ошибка 404: Страница не найдена`,
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("test Success response", async () => {
    fetch.mockResolvedValueOnce(successResponse);

    await expect(getWeatherData()).resolves.toBe(successData);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
