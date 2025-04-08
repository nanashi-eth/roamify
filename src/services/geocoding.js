// services/geocoding.js
import axios from "axios";

export const searchLocations = async (query) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    );
    return response.data.map((loc) => ({
      name: loc.name,
      country: loc.country,
      state: loc.state,
      lat: loc.lat,
      lon: loc.lon,
      displayName: `${loc.name}${loc.state ? `, ${loc.state}` : ""}, ${loc.country}`,
    }));
  } catch (error) {
    console.error("Error en geocoding:", error);
    return [];
  }
};
