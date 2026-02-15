import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather';
import { WeatherService } from './services/weather';
import { signal, WritableSignal } from '@angular/core';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherServiceMock: {
    city: WritableSignal<string>;
    weather: WritableSignal<any>;
    isLoading: WritableSignal<boolean>;
    error: WritableSignal<any>;
    updateCity: Mock;
  };

  beforeEach(async () => {
    weatherServiceMock = {
      city: signal(''),
      weather: signal(null),
      isLoading: signal(false),
      error: signal(null),
      updateCity: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [WeatherComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Search Functionality', () => {
    it('should call updateCity on search', () => {
      component.place = 'London';
      component.searchWeather();

      expect(weatherServiceMock.updateCity).toHaveBeenCalledWith('London');
    });

    it('should clear place input after search', () => {
      component.place = 'London';
      component.searchWeather();
      expect(component.place).toBe('');
    });

    it('should not search if city name is empty', () => {
      component.place = '   ';
      component.searchWeather();

      expect(weatherServiceMock.updateCity).not.toHaveBeenCalled();
    });

    it('should accept city name as argument', () => {
      component.searchWeather('Paris');
      expect(weatherServiceMock.updateCity).toHaveBeenCalledWith('Paris');
    });
  });

  describe('Refresh Functionality', () => {
    it('should call updateCity via refreshWeather', () => {
      component.refreshWeather('Berlin');
      expect(weatherServiceMock.updateCity).toHaveBeenCalledWith('Berlin');
    });

    it('should abort refresh if city name is empty', () => {
      component.refreshWeather('');
      expect(weatherServiceMock.updateCity).not.toHaveBeenCalled();
    });
  });

  describe('Reactive State', () => {
    it('should display weather when available', () => {
      const mockWeather = { city: 'London', temperature: 15, description: 'Cloudy' };
      weatherServiceMock.weather.set(mockWeather);
      fixture.detectChanges();

      expect(component.weather()).toEqual(mockWeather);
    });

    it('should reflect loading state', () => {
      weatherServiceMock.isLoading.set(true);
      fixture.detectChanges();

      expect(component.isLoading()).toBe(true);
    });

    it('should reflect error state', () => {
      weatherServiceMock.error.set('Error message');
      fixture.detectChanges();

      expect(component.error()).toBe('Error message');
    });
  });
});
