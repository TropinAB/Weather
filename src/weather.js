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

const router = new Router();

function processWeatherData(weather) {
  renderWeatherInfo(weather);
}

function processLocationData(location) {
  if (
    location &&
    (location.latitude === "nil" || location.longitude === "nil")
  ) {
    location = Error(`Не удалось определить Ваше местоположение :(`);
  }
  console.log(location);
  renderLocationInfo(location);

  if (location && location.latitude && location.longitude) {
    renderWeatherLoading();
    eventBus.on(weather.eventNameResult, processWeatherData);
    eventBus.trigger(
      weather.eventNameGetForLocation,
      location.latitude,
      location.longitude,
    );
  } else {
    router.go("/weather");
  }
}

function requestLocationData() {
  renderLocationLoading();
  eventBus.on(geo.eventNameResult, processLocationData);
  eventBus.trigger(geo.eventNameCall);
}

function isWeather(path) {
  return path.startsWith("/weather");
}

function processWeatherPage(url) {
  const cityName = decodeURIComponent(url.currentPath.replace("/weather", ""))
    .replaceAll("/", " ")
    .trim();

  initWeatherPage();
  if (cityName) {
    renderWeatherLoading();
    eventBus.on(weather.eventNameResult, processWeatherData);
    eventBus.trigger(weather.eventNameGetForLocation, cityName);
  }
  console.log("processWeatherPage end");
}

function requestWeatherForCity(cityName) {
  cityName = cityName.replace(" ", "/");
  router.go(`/weather/${cityName}`);
}

function clickHandler(event) {
  if (!event.target.matches("a")) return;

  event.preventDefault();
  router.go(event.target.getAttribute("href"));
}

export async function loadAndRenderWeatherData(element) {
  renderMainPage(element);

  router.on("/", requestLocationData);
  router.on("/about", renderAboutPage);
  router.on(isWeather, processWeatherPage);

  element.addEventListener("click", clickHandler);

  eventBus.on(eventNameCityChanged, requestWeatherForCity);
}
