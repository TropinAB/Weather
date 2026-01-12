import "./weather.css";
import {
  renderMainPage,
  renderLoadingMessage,
  renderLocationInfo,
  renderWeatherInfo,
} from "./views/weather";
import { getCurrentLocationData } from "./service/geoJS";
import { getWeatherData } from "./service/openWeatherMap";

export async function loadAndRenderWeatherData(element) {
  const [locationEl, weatherEl] = renderMainPage(element);

  renderLoadingMessage(locationEl, "Загрузка данных о текущем расположении...");
  const location = await getCurrentLocationData();
  renderLocationInfo(locationEl, location);

  renderLoadingMessage(weatherEl, "Загрузка данных о погоде...");
  if (location && location.latitude && location.longitude) {
    const weather = await getWeatherData(location.latitude, location.longitude);
    renderWeatherInfo(weatherEl, weather);
  }
}
