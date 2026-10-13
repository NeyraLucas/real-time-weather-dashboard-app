import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherData } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';

  getWeather(latitude: number, longitude: number): Observable<WeatherData> {
    const params = new HttpParams()
      .set('latitude', latitude)
      .set('longitude', longitude)
      .set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m')
      .set('daily', 'weather_code,temperature_2m_max,temperature_2m_min')
      .set('timezone', 'auto')
      .set('forecast_days', 7);

    return this.http.get<WeatherData>(this.baseUrl, { params });
  }
}
