import { eventBus } from "./EventBus";

export const eventNameGetForLocation = "weather:getForLocation";
export const eventNameResult = "weather:loaded";

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

async function getWeatherData(...params) {
  let result, url;
  try {
    if (params.length === 1 && typeof params[0] === "string")
      url = `${WEATHER_URL}&q=${params[0]}`;
    else if (params.length === 2)
      url = `${WEATHER_URL}&lat=${params[0]}&lon=${params[1]}`;
    else return;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    result = await response.json();
  } catch (error) {
    result = error;
  }
  eventBus.trigger(eventNameResult, result);
}

/// зарегистрировать вызывающее событие
eventBus.on(eventNameGetForLocation, getWeatherData);
