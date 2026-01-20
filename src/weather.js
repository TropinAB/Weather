import "./weather.css";
import {
  renderMainPage,
  renderLocationloading,
  renderWeatherloading,
  renderLocationInfo,
  renderWeatherInfo,
} from "./views/weather";
import * as geo from "./service/geoJS";
import * as weather from "./service/openWeatherMap";
import { eventBus } from "./service/EventBus";

function processWeatherData(weather) {
  renderWeatherInfo(weather);
}

function processLocationData(location) {
  renderLocationInfo(location);

  if (location && location.latitude && location.longitude) {
    renderWeatherloading();
    eventBus.on(weather.eventNameResult, processWeatherData);
    eventBus.trigger(
      weather.eventNameGetForLocation,
      location.latitude,
      location.longitude,
    );
  }
}

function requestLocationData() {
  renderLocationloading();
  eventBus.on(geo.eventNameResult, processLocationData);
  eventBus.trigger(geo.eventNameCall);
}

export async function loadAndRenderWeatherData(element) {
  renderMainPage(element);

  requestLocationData();
}
