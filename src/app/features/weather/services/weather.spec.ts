import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('WeatherService', () => {
    let service: WeatherService;
    let httpClientMock: any;

    beforeEach(() => {
        httpClientMock = {
            get: vi.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                WeatherService,
                { provide: HttpClient, useValue: httpClientMock }
            ]
        });
        service = TestBed.inject(WeatherService);

        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('getWeather', () => {
        it('should make HTTP GET request with correct URL', () => {
            const city = 'Belgrade';
            const mockResponse = { location: { name: 'Belgrade' }, current: {} };
            httpClientMock.get.mockReturnValue(of(mockResponse));

            service.getWeather(city).subscribe();

            expect(httpClientMock.get).toHaveBeenCalled();
            const callUrl = httpClientMock.get.mock.calls[0][0];
            expect(callUrl).toContain('api.weatherapi.com/v1/current.json');
            expect(callUrl).toContain(`q=${city}`);
            expect(callUrl).toContain('lang=sr');
        });

        it('should return weather data from API', () => {
            const city = 'London';
            const mockResponse = {
                location: { name: 'London' },
                current: { temp_c: 15 }
            };
            httpClientMock.get.mockReturnValue(of(mockResponse));

            service.getWeather(city).subscribe((data) => {
                expect(data).toEqual(mockResponse);
            });

            expect(httpClientMock.get).toHaveBeenCalled();
        });
    });

    describe('transformWeatherData', () => {
        it('should transform API data to application format', () => {
            const apiData = {
                location: { name: 'Paris' },
                current: {
                    temp_c: 22.5,
                    condition: { text: 'Sunny', icon: 'sunny.png' },
                    humidity: 65,
                    wind_kph: 18
                }
            };

            const result = service.transformWeatherData(apiData);

            expect(result).toEqual({
                city: 'Paris',
                temperature: 23, // Math.round(22.5)
                description: 'Sunny',
                humidity: 65,
                windSpeed: 5.0, // 18 / 3.6 = 5.0
                icon: 'sunny.png'
            });
        });

        it('should round temperature correctly', () => {
            const apiData = {
                location: { name: 'Test' },
                current: {
                    temp_c: 15.4,
                    condition: { text: 'Cloudy', icon: 'cloud.png' },
                    humidity: 50,
                    wind_kph: 10
                }
            };

            const result = service.transformWeatherData(apiData);

            expect(result.temperature).toBe(15);
        });

        it('should convert wind speed from kph to m/s with one decimal', () => {
            const apiData = {
                location: { name: 'Test' },
                current: {
                    temp_c: 20,
                    condition: { text: 'Windy', icon: 'wind.png' },
                    humidity: 40,
                    wind_kph: 36 // 36 / 3.6 = 10.0
                }
            };

            const result = service.transformWeatherData(apiData);

            expect(result.windSpeed).toBe(10.0);
        });

        it('should use default icon if icon is missing', () => {
            const apiData = {
                location: { name: 'Test' },
                current: {
                    temp_c: 20,
                    condition: { text: 'Clear', icon: null },
                    humidity: 50,
                    wind_kph: 10
                }
            };

            const result = service.transformWeatherData(apiData);

            expect(result.icon).toBe('default');
        });
    });

    describe('saveCity', () => {
        it('should save city to localStorage', () => {
            const city = 'New York';
            const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

            service.saveCity(city);

            expect(setItemSpy).toHaveBeenCalledWith('weather-city', city);
            expect(localStorage.getItem('weather-city')).toBe(city);

            setItemSpy.mockRestore();
        });

        it('should overwrite existing city in localStorage', () => {
            localStorage.setItem('weather-city', 'OldCity');

            service.saveCity('NewCity');

            expect(localStorage.getItem('weather-city')).toBe('NewCity');
        });
    });

    describe('getCity', () => {
        it('should retrieve city from localStorage', () => {
            localStorage.setItem('weather-city', 'Tokyo');

            const result = service.getCity();

            expect(result).toBe('Tokyo');
        });

        it('should return empty string if no city is saved', () => {
            const result = service.getCity();

            expect(result).toBe('');
        });

        it('should return empty string if localStorage returns null', () => {
            const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

            const result = service.getCity();

            expect(result).toBe('');

            getItemSpy.mockRestore();
        });
    });
});
