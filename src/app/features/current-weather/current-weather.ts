import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { City } from '@core/models/city.model';
import { CurrentWeather as CurrentWeatherData } from '@core/models/weather.model';
import { getWmoCondition } from '@core/utils/wmo-codes';
import { FavoritesService } from '@core/services/favorites.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-current-weather',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './current-weather.html',
  styleUrl: './current-weather.css',
})
export class CurrentWeather {
  readonly city = input.required<City>();
  readonly weather = input.required<CurrentWeatherData>();
  readonly isFavorite = model<boolean>(false);

  private readonly favoritesService = inject(FavoritesService);
  private readonly notificationService = inject(NotificationService);

  protected readonly condition = computed(() => getWmoCondition(this.weather().weather_code));

  protected readonly feelsLike = computed(() => {
    const w = this.weather();
    // Simple heat index approximation
    const t = w.temperature_2m;
    const h = w.relative_humidity_2m;
    const hi = t - (0.55 - 0.0055 * h) * (t - 14.5);
    return Math.round(hi);
  });

  protected readonly windBeaufort = computed(() => {
    const s = this.weather().wind_speed_10m;
    if (s < 2) return { label: 'Calma', scale: 0 };
    if (s < 6) return { label: 'Brisa ligera', scale: 1 };
    if (s < 12) return { label: 'Brisa suave', scale: 2 };
    if (s < 20) return { label: 'Brisa moderada', scale: 3 };
    if (s < 29) return { label: 'Brisa fresca', scale: 4 };
    if (s < 39) return { label: 'Brisa fuerte', scale: 5 };
    if (s < 50) return { label: 'Viento fresco', scale: 6 };
    return { label: 'Viento fuerte', scale: 7 };
  });

  protected toggleFavorite(): void {
    const city = this.city();
    this.favoritesService.toggleFavorite(city);
    const nowFav = this.favoritesService.isFavorite(city.id);
    this.isFavorite.set(nowFav);
    if (nowFav) {
      this.notificationService.showSuccess(`${city.name} añadido a favoritos ⭐`);
    } else {
      this.notificationService.showInfo(`${city.name} eliminado de favoritos`);
    }
  }
}
