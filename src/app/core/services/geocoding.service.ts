import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeocodingResponse } from '../models/city.model';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  searchCities(query: string, count = 8): Observable<GeocodingResponse> {
    const params = new HttpParams()
      .set('name', query.trim())
      .set('count', count)
      .set('language', 'es')
      .set('format', 'json');

    return this.http.get<GeocodingResponse>(this.baseUrl, { params });
  }
}
