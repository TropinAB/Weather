import { eventBus } from "./EventBus";

export const eventNameRequestForLocation = "weather:requestForLocation";
export const eventNameRequestForCity = "weather:requestForLocation";
export const eventNameResult = "weather:loaded";
export const eventNameError = "weather:error";
type WeatherLine = {
  id: number;
  main: string;
  description: string;
  icon: string;
};
export type WeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherLine[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

const API_ID = [
  "d",
  "0",
  "1",
  "7",
  "5",
  "7",
  "e",
  "8",
  "c",
  "5",
  "4",
  "0",
  "2",
  "d",
  "d",
  "5",
  "3",
  "e",
  "8",
  "b",
  "c",
  "d",
  "4",
  "0",
  "7",
  "1",
  "f",
  "3",
  "9",
  "d",
  "7",
  "9",
]
  .reverse()
  .join("");
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_ID}&lang=ru`;

function requestWeatherData(url: string): void {
  fetch(url)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((result: WeatherData) => eventBus.trigger(eventNameResult, result))
    .catch((error: Error) => eventBus.trigger(eventNameError, error));
}

function requestWeatherDataForLocation(
  latitude: string,
  longitude: string,
): void {
  requestWeatherData(`${WEATHER_URL}&lat=${latitude}&lon=${longitude}`);
}

function requestWeatherDataForCity(cityName: string): void {
  requestWeatherData(`${WEATHER_URL}&q=${cityName}`);
}

/// зарегистрировать вызывающее события
eventBus.on(eventNameRequestForLocation, requestWeatherDataForLocation);
eventBus.on(eventNameRequestForCity, requestWeatherDataForCity);
