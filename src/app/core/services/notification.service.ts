import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _toast = signal<ToastMessage | null>(null);
  readonly toast = this._toast.asReadonly();

  private timerId: ReturnType<typeof setTimeout> | null = null;

  show(type: ToastMessage['type'], message: string, durationMs = 4000): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }
    const id = `toast-${Date.now()}`;
    this._toast.set({ id, type, message });
    this.timerId = setTimeout(() => this.dismiss(), durationMs);
  }

  showError(message: string): void {
    this.show('error', message);
  }

  showSuccess(message: string): void {
    this.show('success', message);
  }

  showInfo(message: string): void {
    this.show('info', message);
  }

  dismiss(): void {
    this._toast.set(null);
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
