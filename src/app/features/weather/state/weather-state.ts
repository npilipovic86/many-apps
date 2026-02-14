import {computed, Injectable, signal} from '@angular/core';
import {IWeatherData, IWeatherState} from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherState {
  private state = signal<IWeatherState>({
    currentWeather: null,
    isLoading: false,
    error: null
  });


  readonly currentWeather = computed(() => this.state().currentWeather);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  setLoading(isLoading: boolean) {
    this.state.update((state) => ({...state, isLoading}));
  }

  setWeather(weather: IWeatherData) {
    this.state.update((state) => ({
      ...state,
      currentWeather: weather,
      isLoading: false,
      error: null
    }));
  }

  setError(error: string) {
    this.state.update((state) => ({
      ...state,
      error,
      isLoading: false
    }));
  }

  clearError() {
    this.state.update((state: IWeatherState) => ({...state, error: null}));
  }
}
