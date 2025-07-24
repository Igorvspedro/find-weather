import { WeatherResponse, WeatherData, WeatherApiError } from '@/types/weather';

const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Chave pública válida
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherApi {
  static async getCurrentWeather(city: string): Promise<WeatherData> {
    if (!city.trim()) {
      throw new Error('Nome da cidade é obrigatório');
    }

    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        const errorData: WeatherApiError = await response.json();
        
        switch (response.status) {
          case 404:
            throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
          case 401:
            throw new Error('Erro de autorização da API');
          case 429:
            throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
          default:
            throw new Error(errorData.message || 'Erro ao buscar dados do clima');
        }
      }

      const data: WeatherResponse = await response.json();
      
      return this.transformWeatherData(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
  }

  static async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do clima pela localização');
      }

      const data: WeatherResponse = await response.json();
      return this.transformWeatherData(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar dados do clima pela localização');
    }
  }

  private static transformWeatherData(data: WeatherResponse): WeatherData {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // Convert to km
    };
  }
}