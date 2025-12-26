export async function getCurrentLocationData() {
  const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
  if (response.ok) return await response.json();
  // Вернуть ошибку
  throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
}
