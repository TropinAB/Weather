import "./weather.css";
import {
  renderMainPage,
  renderLocationloading,
  renderWeatherloading,
  renderLocationInfo,
  renderWeatherInfo,
} from "./views/weather";
import "./service/geoJS";
import "./service/openWeatherMap";
import { eventBus } from "./service/EventBus";

function processWeatherData(weather) {
  renderWeatherInfo(weather);
}

function processLocationData(location) {
  renderLocationInfo(location);

  if (location && location.latitude && location.longitude) {
    renderWeatherloading();
    eventBus.on("weather:loaded", processWeatherData);
    eventBus.trigger("weather:getForLocation", [
      location.latitude,
      location.longitude,
    ]);
  }
}

function requestLocationData() {
  renderLocationloading();
  eventBus.on("geo:loaded", processLocationData);
  eventBus.trigger("geo:getLocation");
}

export async function loadAndRenderWeatherData(element) {
  renderMainPage(element);

  requestLocationData();
}
