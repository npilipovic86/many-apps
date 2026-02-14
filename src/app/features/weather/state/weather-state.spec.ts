import { TestBed } from '@angular/core/testing';
import { WeatherState } from './weather-state';
import { describe, it, expect, beforeEach } from 'vitest';
import { IWeatherData } from '../models/weather.model';

describe('WeatherState', () => {
  let service: WeatherState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherState]
    });
    service = TestBed.inject(WeatherState);
  });

  describe('Initial State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have null currentWeather initially', () => {
      expect(service.currentWeather()).toBeNull();
    });

    it('should have isLoading false initially', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should have null error initially', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set isLoading to true', () => {
      service.setLoading(true);
      expect(service.isLoading()).toBe(true);
    });

    it('should set isLoading to false', () => {
      service.setLoading(true);
      service.setLoading(false);
      expect(service.isLoading()).toBe(false);
    });

    it('should not affect other state properties', () => {
      const mockWeather: IWeatherData = {
        city: 'Paris',
        temperature: 20,
        description: 'Sunny',
        humidity: 60,
        windSpeed: 5,
        icon: 'sun.png'
      };
      service.setWeather(mockWeather);

      service.setLoading(true);

      expect(service.currentWeather()).toEqual(mockWeather);
      expect(service.error()).toBeNull();
    });
  });

  describe('setWeather', () => {
    it('should set weather data', () => {
      const mockWeather: IWeatherData = {
        city: 'London',
        temperature: 15,
        description: 'Cloudy',
        humidity: 70,
        windSpeed: 10,
        icon: 'cloud.png'
      };

      service.setWeather(mockWeather);

      expect(service.currentWeather()).toEqual(mockWeather);
    });

    it('should set isLoading to false when setting weather', () => {
      service.setLoading(true);

      const mockWeather: IWeatherData = {
        city: 'Berlin',
        temperature: 18,
        description: 'Clear',
        humidity: 55,
        windSpeed: 7,
        icon: 'clear.png'
      };

      service.setWeather(mockWeather);

      expect(service.isLoading()).toBe(false);
    });

    it('should clear error when setting weather', () => {
      service.setError('Some error');

      const mockWeather: IWeatherData = {
        city: 'Tokyo',
        temperature: 25,
        description: 'Rainy',
        humidity: 80,
        windSpeed: 12,
        icon: 'rain.png'
      };

      service.setWeather(mockWeather);

      expect(service.error()).toBeNull();
    });

    it('should update weather data when called multiple times', () => {
      const weather1: IWeatherData = {
        city: 'New York',
        temperature: 10,
        description: 'Snowy',
        humidity: 90,
        windSpeed: 15,
        icon: 'snow.png'
      };

      const weather2: IWeatherData = {
        city: 'Miami',
        temperature: 30,
        description: 'Hot',
        humidity: 75,
        windSpeed: 5,
        icon: 'sun.png'
      };

      service.setWeather(weather1);
      expect(service.currentWeather()).toEqual(weather1);

      service.setWeather(weather2);
      expect(service.currentWeather()).toEqual(weather2);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'City not found';

      service.setError(errorMessage);

      expect(service.error()).toBe(errorMessage);
    });

    it('should set isLoading to false when setting error', () => {
      service.setLoading(true);

      service.setError('Network error');

      expect(service.isLoading()).toBe(false);
    });

    it('should not affect currentWeather', () => {
      const mockWeather: IWeatherData = {
        city: 'Sydney',
        temperature: 22,
        description: 'Partly cloudy',
        humidity: 65,
        windSpeed: 8,
        icon: 'partly-cloudy.png'
      };
      service.setWeather(mockWeather);

      service.setError('API error');

      expect(service.currentWeather()).toEqual(mockWeather);
    });

    it('should update error when called multiple times', () => {
      service.setError('First error');
      expect(service.error()).toBe('First error');

      service.setError('Second error');
      expect(service.error()).toBe('Second error');
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      service.setError('Some error');

      service.clearError();

      expect(service.error()).toBeNull();
    });

    it('should not affect other state properties', () => {
      const mockWeather: IWeatherData = {
        city: 'Moscow',
        temperature: -5,
        description: 'Freezing',
        humidity: 85,
        windSpeed: 20,
        icon: 'freezing.png'
      };
      service.setWeather(mockWeather);
      service.setError('Error message');

      service.clearError();

      expect(service.currentWeather()).toEqual(mockWeather);
      expect(service.isLoading()).toBe(false);
    });

    it('should work when error is already null', () => {
      expect(service.error()).toBeNull();

      service.clearError();

      expect(service.error()).toBeNull();
    });
  });

  describe('Signal Reactivity', () => {
    it('should update computed signals when state changes', () => {
      expect(service.isLoading()).toBe(false);

      service.setLoading(true);
      expect(service.isLoading()).toBe(true);

      service.setLoading(false);
      expect(service.isLoading()).toBe(false);
    });

    it('should maintain signal reactivity across multiple updates', () => {
      const weather1: IWeatherData = {
        city: 'Rome',
        temperature: 24,
        description: 'Warm',
        humidity: 60,
        windSpeed: 6,
        icon: 'warm.png'
      };

      service.setWeather(weather1);
      expect(service.currentWeather()?.city).toBe('Rome');

      service.setError('Error');
      expect(service.error()).toBe('Error');

      service.clearError();
      expect(service.error()).toBeNull();
      expect(service.currentWeather()?.city).toBe('Rome');
    });
  });
});
