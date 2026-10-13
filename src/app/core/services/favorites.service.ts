import { Injectable, signal, computed } from '@angular/core';
import { City } from '../models/city.model';

const STORAGE_KEY = 'weather-dashboard-favorites';

function loadFromStorage(): City[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as City[]) : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly _favorites = signal<City[]>(loadFromStorage());
  readonly favorites = this._favorites.asReadonly();

  readonly favoriteIds = computed(() => new Set(this._favorites().map((c) => c.id)));

  isFavorite(cityId: number): boolean {
    return this.favoriteIds().has(cityId);
  }

  toggleFavorite(city: City): void {
    this._favorites.update((current) => {
      const exists = current.some((c) => c.id === city.id);
      const updated = exists ? current.filter((c) => c.id !== city.id) : [...current, city];
      this.persist(updated);
      return updated;
    });
  }

  private persist(cities: City[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    } catch {
      // Storage quota exceeded — fail silently
    }
  }
}
