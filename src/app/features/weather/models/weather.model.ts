export interface IWeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface IWeatherState {
  currentWeather: IWeatherData | null;
  isLoading: boolean;
  error: string | null;
}
