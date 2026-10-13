import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FavoritesService } from '@core/services/favorites.service';
import { City } from '@core/models/city.model';

@Component({
  selector: 'app-favorites-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favorites-panel.html',
  styleUrl: './favorites-panel.css',
})
export class FavoritesPanel {
  readonly citySelected = output<City>();

  protected readonly favoritesService = inject(FavoritesService);

  protected selectCity(city: City): void {
    this.citySelected.emit(city);
  }

  protected removeFavorite(city: City, event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(city);
  }
}
