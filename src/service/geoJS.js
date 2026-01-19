import { eventBus } from "./EventBus";

async function getCurrentLocationData() {
  let result;
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    result = await response.json();
  } catch (error) {
    result = error;
  }
  eventBus.trigger("geo:loaded", result);
}

/// зарегистрировать вызывающее событие
eventBus.on("geo:getLocation", getCurrentLocationData);
