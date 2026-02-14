import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './services/weather';
import { WeatherState } from './state/weather-state';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class WeatherComponent {
  private weatherService = inject(WeatherService);
  public weatherState = inject(WeatherState);
  public oldCity: string = this.weatherService.getCity();


  place = '';
  currentTime = new Date().toLocaleTimeString('sr-RS');

  weather = this.weatherState.currentWeather;
  isLoading = this.weatherState.isLoading;
  error = this.weatherState.error;

  ngOnInit() {
    const currentWeather = this.weather();
    if (this.oldCity || currentWeather?.city) {
      let cityName = this.oldCity || currentWeather?.city || '';
      this.refreshWeather(cityName);
    }
  }

  searchWeather(cityName = '') {

    if (!this.place.trim() && !cityName.trim()) return;
    let city = this.place.trim() || cityName.trim()

    this.weatherState.setLoading(true);
    this.weatherState.clearError();

    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        const weatherData = this.weatherService.transformWeatherData(data);
        this.weatherState.setWeather(weatherData);
        this.currentTime = new Date().toLocaleTimeString('sr-RS');
      },
      error: (err) => {
        this.weatherState.setError('Grad nije pronađen ili se desila greška');
      }
    });

    this.weatherService.saveCity(city);
  }

  refreshWeather(cityName: string) {
    if (!cityName.trim()) return;
    this.searchWeather(cityName);
  }
}
