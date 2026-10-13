export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  elevation?: number;
}

export interface GeocodingResponse {
  results?: City[];
  generationtime_ms?: number;
}
