import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { catchError, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { City } from '@core/models/city.model';
import { WeatherData } from '@core/models/weather.model';
import { WeatherService } from '@core/services/weather.service';
import { FavoritesService } from '@core/services/favorites.service';
import { NotificationService } from '@core/services/notification.service';
import { SearchBar } from '@shared/components/search-bar/search-bar';
import { Toast } from '@shared/components/toast/toast';
import { CurrentWeather } from '@features/current-weather/current-weather';
import { ForecastDaily } from '@features/forecast-daily/forecast-daily';
import { FavoritesPanel } from '@features/favorites-panel/favorites-panel';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchBar, Toast, CurrentWeather, ForecastDaily, FavoritesPanel],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly weatherService = inject(WeatherService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly notificationService = inject(NotificationService);

  protected readonly selectedCity = signal<City | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly hasError = signal(false);

  // Writable linkedSignal for two-way model binding with CurrentWeather component
  protected readonly isFavoriteModel = linkedSignal(() => {
    const city = this.selectedCity();
    return city ? this.favoritesService.isFavorite(city.id) : false;
  });

  // City$ subject drives the weather fetch pipeline
  private readonly citySubject = new Subject<City>();

  private readonly weatherData$ = this.citySubject.pipe(
    switchMap((city) => {
      this.isLoading.set(true);
      this.hasError.set(false);
      return this.weatherService.getWeather(city.latitude, city.longitude).pipe(
        tap(() => {
          this.isLoading.set(false);
        }),
        catchError(() => {
          this.isLoading.set(false);
          this.hasError.set(true);
          this.notificationService.showError(
            'No se pudo obtener el clima. Verifica tu conexión e intenta de nuevo.'
          );
          return of(null);
        })
      );
    })
  );

  protected readonly weatherData = toSignal(this.weatherData$, {
    initialValue: null as WeatherData | null,
  });

  protected readonly currentWeather = computed(() => this.weatherData()?.current ?? null);
  protected readonly dailyForecast = computed(() => this.weatherData()?.daily ?? null);

  protected readonly weatherReady = computed(
    () => !this.isLoading() && this.weatherData() !== null
  );

  protected onCitySelected(city: City): void {
    this.selectedCity.set(city);
    this.citySubject.next(city);
  }
}
