export async function getCurrentLocationData() {
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
    if (response.ok) return await response.json();
    // Вернуть ошибку
    return new Error(`Ошибка ${response.status}: ${response.statusText}`);
  } catch (error) {
    return error;
  }
}
