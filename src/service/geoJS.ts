import { eventBus } from "./EventBus";

export const eventNameCall = "geo:requestCurrentLocation";
export const eventNameResult = "geo:loaded";
export const eventNameError = "geo:error";
export type GeoLocation = {
  accuracy: number;
  area_code: string;
  asn: number;
  city: string;
  continent_code: string;
  country: string;
  country_code: string;
  country_code3: string;
  ip: string;
  latitude: string;
  longitude: string;
  organization: string;
  organization_name: string;
  region: string;
  timezone: string;
};

function requestCurrentLocationData(): void {
  fetch("https://get.geojs.io/v1/ip/geo.json")
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
      return response.json(); // as Promise<GeoLocation>;
    })
    .then((result: GeoLocation) => eventBus.trigger(eventNameResult, result))
    .catch((error: Error) => eventBus.trigger(eventNameError, error));
}

/// зарегистрировать вызывающее событие
eventBus.on(eventNameCall, requestCurrentLocationData);
