import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './services/weather';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css'
})
export class WeatherComponent {
  private weatherService = inject(WeatherService);

  place = '';
  currentTime = signal(new Date().toLocaleTimeString('sr-RS'));

  weather = this.weatherService.weather;
  isLoading = this.weatherService.isLoading;
  error = this.weatherService.error;

  constructor() {
    effect(() => {
      if (this.weather()) {
        this.currentTime.set(new Date().toLocaleTimeString('sr-RS'));
      }
    });
  }

  searchWeather(cityName = '') {
    if (!this.place.trim() && !cityName.trim()) return;
    const city = this.place.trim() || cityName.trim();

    this.weatherService.updateCity(city);
    this.place = '';
  }

  refreshWeather(cityName: string) {
    if (!cityName.trim()) return;
    this.searchWeather(cityName);
  }
}
