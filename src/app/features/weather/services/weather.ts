import { Injectable, resource, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '3f613894a41b441a9e0141822261202';
  private apiUrl = 'https://api.weatherapi.com/v1/current.json';

  readonly city = signal<string | null>(this.getCity());

  readonly weatherResource = resource({
    params: () => ({ city: this.city() }),
    loader: async ({ params, abortSignal }) => {
      if (!params.city) return null;
      const url = `${this.apiUrl}?key=${this.apiKey}&q=${params.city}&lang=sr`;
      const response = await fetch(url, { signal: abortSignal });
      if (!response.ok) {
        throw new Error('Grad nije pronađen ili se desila greška');
      }
      const data = await response.json();
      return this.transformWeatherData(data);
    }
  });

  readonly weather = this.weatherResource.value;
  readonly isLoading = this.weatherResource.isLoading;
  readonly error = this.weatherResource.error;

  updateCity(city: string) {
    this.saveCity(city);
    this.city.set(city);
  }

  private transformWeatherData(data: any) {
    return {
      city: data.location.name,
      temperature: Math.round(data.current.temp_c),
      description: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: +(data.current.wind_kph / 3.6).toFixed(1), // Convert to m/s
      icon: data.current.condition.icon || 'default'
    };
  }

  private saveCity(city: string): void {
    localStorage.setItem('weather-city', city);
  }

  private getCity(): string | null {
    return localStorage.getItem('weather-city');
  }
}
