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
  renderLocationError,
  renderWeatherError,
} from "./views/weather";
import * as geo from "./service/geoJS";
import * as weather from "./service/openWeatherMap";
import { eventBus } from "./service/EventBus";
import { Router } from "./service/Router";
import { GeoJSLocation } from "./types/geoJS";
import { RouteArgs } from "./types/Router";

export const eventNameRequestLocation = "request:location";
export const eventNameRequestWeatherLocation = "request:weather:location";
export const eventNameRequestWeatherCity = "request:weather:city";
const router = new Router();

function processLocationData(location: GeoJSLocation): void {
  if (
    !location ||
    !location.latitude ||
    !location.longitude ||
    location.latitude === "nil" ||
    location.longitude === "nil"
  ) {
    renderLocationError("Не удалось определить Ваше местоположение :(");
  } else {
    renderLocationInfo(location);

    eventBus.trigger(
      eventNameRequestWeatherLocation,
      location.latitude,
      location.longitude,
    );
  }
}

function requestLocationData() {
  renderLocationLoading();
  eventBus.on(geo.eventNameResult, processLocationData);
  eventBus.on(geo.eventNameError, renderLocationError);
  eventBus.trigger(geo.eventNameCall);
}

function requestWeatherForLocation(latitude: string, longitude: string) {
  renderWeatherLoading();
  eventBus.on(weather.eventNameResult, renderWeatherInfo);
  eventBus.on(weather.eventNameError, renderWeatherError);
  eventBus.trigger(weather.eventNameRequestForLocation, latitude, longitude);
}

function requestWeatherForCity(cityName: string) {
  renderWeatherLoading();
  eventBus.on(weather.eventNameResult, renderWeatherInfo);
  eventBus.on(weather.eventNameError, renderWeatherError);
  eventBus.trigger(weather.eventNameRequestForCity, cityName);
}

function isWeather(path: string): boolean {
  return path.startsWith(PREFIX + "city");
}

function processWeatherPage(routeData: RouteArgs) {
  const cityName: string = decodeURIComponent(
    routeData.currentPath.replace(PREFIX + "city", ""),
  )
    .replaceAll("/", " ")
    .trim();

  initWeatherPage();
  if (cityName) {
    eventBus.trigger(eventNameRequestWeatherCity, cityName);
  }
}

function cityChanged(cityName: string) {
  cityName = cityName.replace(" ", "/");
  router.go(`${PREFIX}city/${cityName}`, cityName);
}

function clickHandler(event: Event) {
  if (!event.target) return;
  if (!(event.target as HTMLElement).classList.contains("menu-item")) return;

  event.preventDefault();
  const url: string | null = (event.target as HTMLElement).getAttribute("href");
  url && router.go(url, {});
}

export function loadAndRenderWeatherData(element: HTMLElement): void {
  renderMainPage(element);
  element.addEventListener("click", clickHandler);

  eventBus.on(eventNameCityChanged, cityChanged);
  eventBus.on(eventNameRequestLocation, requestLocationData);
  eventBus.on(eventNameRequestWeatherCity, requestWeatherForCity);
  eventBus.on(eventNameRequestWeatherLocation, requestWeatherForLocation);

  router.on(PREFIX, requestLocationData);
}
router.on(PREFIX + "about", renderAboutPage);
router.on(isWeather, processWeatherPage);
