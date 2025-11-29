import "./runApp.css";
import { createElementWithClassAndText } from "./toolsDOM.js";
import { prepareWeatherData } from "./weather.js";

export async function runApp(el) {
  el.append(
    createElementWithClassAndText(
      "h1",
      "header",
      `Моё первое приложение "Погода"`,
    ),
  );
  const locationEl = createElementWithClassAndText(
    "div",
    ["location", "border"],
    "",
  );
  el.append(locationEl);
  const weatherEl = createElementWithClassAndText(
    "div",
    ["weather", "border"],
    "",
  );
  el.append(weatherEl);

  prepareWeatherData(locationEl, weatherEl);
}
