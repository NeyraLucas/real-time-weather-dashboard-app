import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
} from 'rxjs';
import { City } from '@core/models/city.model';
import { GeocodingService } from '@core/services/geocoding.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="search-wrapper" role="search">
      <label for="city-search" class="search-label">Buscar ciudad</label>
      <div class="search-input-group">
        <span class="search-icon" aria-hidden="true">🔍</span>
        <input
          #searchInput
          id="city-search"
          type="search"
          class="search-input"
          placeholder="Escribe una ciudad..."
          autocomplete="off"
          [formControl]="searchControl"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-controls]="isOpen() ? 'city-suggestions' : null"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          role="combobox"
          (keydown)="onKeyDown($event)"
          (blur)="onBlur()"
        />
        @if (isLoading()) {
          <span class="search-spinner" aria-label="Buscando..." role="status">
            <svg class="spinner-svg" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="32" stroke-dashoffset="8"/>
            </svg>
          </span>
        }
      </div>

      @if (isOpen() && suggestions().length > 0) {
        <ul
          id="city-suggestions"
          class="suggestions-list"
          role="listbox"
          aria-label="Sugerencias de ciudades"
        >
          @for (city of suggestions(); track city.id; let i = $index) {
            <li
              class="suggestion-item"
              [class.suggestion-item--active]="activeIndex() === i"
              role="option"
              [id]="'suggestion-' + i"
              [attr.aria-selected]="activeIndex() === i"
              (mousedown)="selectCity(city)"
            >
              <span class="suggestion-icon" aria-hidden="true">📍</span>
              <span class="suggestion-name">{{ city.name }}</span>
              <span class="suggestion-meta">
                @if (city.admin1) { {{ city.admin1 }}, } {{ city.country }}
              </span>
            </li>
          }
        </ul>
      }

      @if (isOpen() && suggestions().length === 0 && hasSearched() && !isLoading()) {
        <div class="no-results" role="status" aria-live="polite">
          <span aria-hidden="true">🌐</span> No se encontraron ciudades
        </div>
      }
    </div>
  `,
  styles: [`
    .search-wrapper {
      position: relative;
      width: 100%;
    }
    .search-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(148, 163, 184, 0.8);
      margin-bottom: 0.5rem;
    }
    .search-input-group {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      font-size: 1rem;
      pointer-events: none;
      z-index: 1;
    }
    .search-input {
      width: 100%;
      padding: 0.875rem 3rem 0.875rem 2.75rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1.5px solid rgba(99, 102, 241, 0.3);
      border-radius: 0.875rem;
      color: #e2e8f0;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
    }
    .search-input::placeholder {
      color: rgba(148, 163, 184, 0.5);
    }
    .search-input:focus {
      border-color: rgba(99, 102, 241, 0.7);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    .search-input::-webkit-search-cancel-button { display: none; }
    .search-spinner {
      position: absolute;
      right: 1rem;
    }
    .spinner-svg {
      width: 1.25rem;
      height: 1.25rem;
      color: #6366f1;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .suggestions-list {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      z-index: 100;
      list-style: none;
      margin: 0;
      padding: 0.5rem;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 0.875rem;
      backdrop-filter: blur(16px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
      max-height: 20rem;
      overflow-y: auto;
      animation: dropDown 0.2s ease-out;
    }
    @keyframes dropDown {
      from { opacity: 0; transform: translateY(-0.5rem); }
      to { opacity: 1; transform: translateY(0); }
    }
    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.75rem 1rem;
      border-radius: 0.625rem;
      cursor: pointer;
      transition: background 0.15s;
    }
    .suggestion-item:hover,
    .suggestion-item--active {
      background: rgba(99, 102, 241, 0.2);
    }
    .suggestion-icon { font-size: 0.85rem; flex-shrink: 0; }
    .suggestion-name {
      font-weight: 600;
      color: #e2e8f0;
      flex: 1;
      font-size: 0.9375rem;
    }
    .suggestion-meta {
      font-size: 0.78rem;
      color: rgba(148, 163, 184, 0.7);
      text-align: right;
    }
    .no-results {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      padding: 1rem;
      text-align: center;
      font-size: 0.875rem;
      color: rgba(148, 163, 184, 0.7);
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 0.875rem;
      backdrop-filter: blur(16px);
    }
  `],
})
export class SearchBar implements OnInit {
  readonly citySelected = output<City>();

  protected readonly searchControl = new FormControl('');
  protected readonly isOpen = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly activeIndex = signal(-1);
  protected readonly hasSearched = signal(false);

  private readonly geocodingService = inject(GeocodingService);
  private readonly notificationService = inject(NotificationService);

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly suggestions = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      filter((query): query is string => typeof query === 'string' && query.trim().length >= 2),
      map((query) => {
        this.isLoading.set(true);
        this.hasSearched.set(true);
        this.isOpen.set(true);
        this.activeIndex.set(-1);
        return query;
      }),
      switchMap((query) =>
        this.geocodingService.searchCities(query).pipe(
          map((res) => {
            this.isLoading.set(false);
            return res.results ?? [];
          }),
          catchError(() => {
            this.isLoading.set(false);
            this.notificationService.showError(
              'No se pudo conectar con la API de geocodificación. Verifica tu conexión.'
            );
            return of([]);
          })
        )
      )
    ),
    { initialValue: [] as City[] }
  );

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((v) => {
      if (!v || v.trim().length < 2) {
        this.isOpen.set(false);
        this.hasSearched.set(false);
        this.isLoading.set(false);
      }
    });
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const list = this.suggestions();
    if (!this.isOpen() || list.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => Math.min(i + 1, list.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => Math.max(i - 1, -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (this.activeIndex() >= 0) {
          this.selectCity(list[this.activeIndex()]);
        }
        break;
      case 'Escape':
        this.isOpen.set(false);
        this.searchInput()?.nativeElement.blur();
        break;
    }
  }

  protected onBlur(): void {
    // Delay to allow mousedown on suggestion items
    setTimeout(() => this.isOpen.set(false), 150);
  }

  protected selectCity(city: City): void {
    this.searchControl.setValue(city.name, { emitEvent: false });
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this.citySelected.emit(city);
  }
}
