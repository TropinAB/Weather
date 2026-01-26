import "./weather.css";
import {
  eventNameCityChanged,
  renderMainPage,
  renderAboutPage,
  initWeatherPage,
  renderLocationLoading,
  renderWeatherLoading,
  renderLocationInfo,
  renderWeatherInfo,
} from "./views/weather";
import * as geo from "./service/geoJS";
import * as weather from "./service/openWeatherMap";
import { eventBus } from "./service/EventBus";
import { Router } from "./service/Router";

export const eventNameRequestLocation = "request:location";
export const eventNameRequestWeather = "request:weather";
const router = new Router();

function processLocationData(location) {
  if (
    location &&
    (location.latitude === "nil" || location.longitude === "nil")
  ) {
    location = Error(`Не удалось определить Ваше местоположение :(`);
  }
  renderLocationInfo(location);

  if (location && location.latitude && location.longitude) {
    eventBus.trigger(
      eventNameRequestWeather,
      location.latitude,
      location.longitude,
    );
  } else {
    router.go(PREFIX + "city");
  }
}

function requestLocationData() {
  renderLocationLoading();
  eventBus.on(geo.eventNameResult, processLocationData);
  eventBus.trigger(geo.eventNameCall);
}

function requestWeatherData(...params) {
  renderWeatherLoading();
  eventBus.on(weather.eventNameResult, renderWeatherInfo);
  eventBus.trigger(weather.eventNameGetForLocation, ...params);
}

function isWeather(path) {
  return path.startsWith(PREFIX + "city");
}

function processWeatherPage(routeData) {
  const cityName = decodeURIComponent(
    routeData.currentPath.replace(PREFIX + "city", ""),
  )
    .replaceAll("/", " ")
    .trim();

  initWeatherPage();
  if (cityName) {
    eventBus.trigger(eventNameRequestWeather, cityName);
  }
}

function requestWeatherForCity(cityName) {
  cityName = cityName.replace(" ", "/");
  router.go(`${PREFIX}city/${cityName}`);
}

function clickHandler(event) {
  if (!event.target.classList.contains("menu-item")) return;

  event.preventDefault();
  router.go(event.target.getAttribute("href"));
}

export async function loadAndRenderWeatherData(element) {
  renderMainPage(element);
  element.addEventListener("click", clickHandler);

  eventBus.on(eventNameCityChanged, requestWeatherForCity);
  eventBus.on(eventNameRequestLocation, requestLocationData);
  eventBus.on(eventNameRequestWeather, requestWeatherData);

  router.on(PREFIX, requestLocationData);
  router.on(PREFIX + "about", renderAboutPage);
  router.on(isWeather, processWeatherPage);
}
