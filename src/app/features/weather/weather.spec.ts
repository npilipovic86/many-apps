import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather';
import { WeatherService } from './services/weather';
import { WeatherState } from './state/weather-state';
import { signal, WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherServiceMock: {
    getCity: Mock;
    getWeather: Mock;
    transformWeatherData: Mock;
    saveCity: Mock;
  };
  let weatherStateMock: {
    currentWeather: WritableSignal<any>;
    isLoading: WritableSignal<boolean>;
    error: WritableSignal<string | null>;
    setLoading: Mock;
    setWeather: Mock;
    setError: Mock;
    clearError: Mock;
  };

  let currentWeatherSignal: WritableSignal<any>;
  let isLoadingSignal: WritableSignal<boolean>;
  let errorSignal: WritableSignal<string | null>;

  beforeEach(async () => {
    // Initialize signals
    currentWeatherSignal = signal<any>(null);
    isLoadingSignal = signal<boolean>(false);
    errorSignal = signal<string | null>(null);

    weatherServiceMock = {
      getCity: vi.fn(),
      getWeather: vi.fn(),
      transformWeatherData: vi.fn(),
      saveCity: vi.fn()
    };
    weatherServiceMock.getCity.mockReturnValue('');

    weatherStateMock = {
      currentWeather: currentWeatherSignal,
      isLoading: isLoadingSignal,
      error: errorSignal,
      setLoading: vi.fn(),
      setWeather: vi.fn(),
      setError: vi.fn(),
      clearError: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [WeatherComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceMock },
        { provide: WeatherState, useValue: weatherStateMock }
      ]
    }).compileComponents();
  });

  describe('Initialization', () => {
    it('should create', () => {
      fixture = TestBed.createComponent(WeatherComponent);
      component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    it('should load weather on init if a city is saved in WeatherService', () => {
      weatherServiceMock.getCity.mockReturnValue('Belgrade');
      weatherServiceMock.getWeather.mockReturnValue(of({}));

      fixture = TestBed.createComponent(WeatherComponent);
      component = fixture.componentInstance;

      // Trigger ngOnInit
      fixture.detectChanges();

      expect(weatherServiceMock.getWeather).toHaveBeenCalledWith('Belgrade');
    });

    it('should load weather on init if a city is present in WeatherState (though logic prefers oldCity first)', () => {
      // Logic in ngOnInit: let cityName = this.oldCity || currentWeather?.city || '';
      // So if oldCity is empty invoke logic with state city
      weatherServiceMock.getCity.mockReturnValue('');
      currentWeatherSignal.set({ city: 'Novi Sad' });
      weatherServiceMock.getWeather.mockReturnValue(of({}));

      fixture = TestBed.createComponent(WeatherComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(weatherServiceMock.getWeather).toHaveBeenCalledWith('Novi Sad');
    });

    it('should NOT load weather on init if no city is available', () => {
      weatherServiceMock.getCity.mockReturnValue('');
      currentWeatherSignal.set(null);

      fixture = TestBed.createComponent(WeatherComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(weatherServiceMock.getWeather).not.toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(WeatherComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should perform search, update state and save city on success', () => {
      const mockRawData = { location: { name: 'London' }, current: { temp_c: 15 } };
      const mockTransformedData = { city: 'London', temperature: 15 };

      weatherServiceMock.getWeather.mockReturnValue(of(mockRawData));
      weatherServiceMock.transformWeatherData.mockReturnValue(mockTransformedData);

      component.place = 'London';
      component.searchWeather();

      expect(weatherStateMock.setLoading).toHaveBeenCalledWith(true);
      expect(weatherStateMock.clearError).toHaveBeenCalled();
      expect(weatherServiceMock.getWeather).toHaveBeenCalledWith('London');
      expect(weatherServiceMock.transformWeatherData).toHaveBeenCalledWith(mockRawData);
      expect(weatherStateMock.setWeather).toHaveBeenCalledWith(mockTransformedData);
      expect(weatherServiceMock.saveCity).toHaveBeenCalledWith('London');
    });

    it('should handle error during search', () => {
      weatherServiceMock.getWeather.mockReturnValue(throwError(() => new Error('Network error')));

      component.place = 'UnknownCity';
      component.searchWeather();

      expect(weatherStateMock.setLoading).toHaveBeenCalledWith(true);
      expect(weatherStateMock.setError).toHaveBeenCalledWith('Grad nije pronađen ili se desila greška');
    });

    it('should not search if city name is empty', () => {
      component.place = '   ';
      component.searchWeather();

      expect(weatherStateMock.setLoading).not.toHaveBeenCalled();
      expect(weatherServiceMock.getWeather).not.toHaveBeenCalled();
    });

    it('should accept city name as argument', () => {
      weatherServiceMock.getWeather.mockReturnValue(of({}));

      component.searchWeather('Paris');

      expect(weatherServiceMock.getWeather).toHaveBeenCalledWith('Paris');
    });
  });

  describe('Refresh Functionality', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(WeatherComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should call searchWeather via refreshWeather', () => {
      const searchSpy = vi.spyOn(component, 'searchWeather');
      // searchWeather needs to handle the mock return or it might fail if we don't mock it again, 
      // but we spied on it so we can check call.
      // However, the original method is called purely, so dependencies need to be ready.
      weatherServiceMock.getWeather.mockReturnValue(of({}));

      component.refreshWeather('Berlin');

      expect(searchSpy).toHaveBeenCalledWith('Berlin');
    });

    it('should abort refresh if city name is empty', () => {
      const searchSpy = vi.spyOn(component, 'searchWeather');
      component.refreshWeather('');
      expect(searchSpy).not.toHaveBeenCalled();
    });
  });
});
