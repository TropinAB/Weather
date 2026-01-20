import { eventBus } from "./EventBus";

export const eventNameCall = "geo:getLocation";
export const eventNameResult = "geo:loaded";

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
  eventBus.trigger(eventNameResult, result);
}

/// зарегистрировать вызывающее событие
eventBus.on(eventNameCall, getCurrentLocationData);
