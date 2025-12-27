const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_ID = [
  "d",
  "0",
  "1",
  "7",
  "5",
  "7",
  "e",
  "8",
  "c",
  "5",
  "4",
  "0",
  "2",
  "d",
  "d",
  "5",
  "3",
  "e",
  "8",
  "b",
  "c",
  "d",
  "4",
  "0",
  "7",
  "1",
  "f",
  "3",
  "9",
  "d",
  "7",
  "9",
]
  .reverse()
  .join("");

export async function getWeatherData(latitude, longitude) {
  try {
    const url = `${WEATHER_URL}?units=metric&lat=${latitude}&lon=${longitude}&appid=${API_ID}&lang=ru`;
    const response = await fetch(url);
    if (response.ok) return await response.json();
    // Вернуть ошибку
    return new Error(`Ошибка ${response.status}: ${response.statusText}`);
  } catch (error) {
    return error;
  }
}
