import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = '3f613894a41b441a9e0141822261202';
  private apiUrl = 'https://api.weatherapi.com/v1/current.json';

  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${city}&lang=sr`
    return this.http.get(url);
  }

  transformWeatherData(data: any) {
    return {
      city: data.location.name,
      temperature: Math.round(data.current.temp_c),
      description: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: +(data.current.wind_kph / 3.6).toFixed(1), // Convert to m/s
      icon: data.current.condition.icon || 'default'
    };
  }

  saveCity(city: string): void {

    localStorage.setItem('weather-city', city);
  }

  getCity(): string {

    return localStorage.getItem('weather-city') || '';
  }
}
