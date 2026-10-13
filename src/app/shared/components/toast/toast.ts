import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (notification.toast(); as toast) {
      <div
        class="toast-container"
        [class]="'toast toast--' + toast.type"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <span class="toast__icon">
          @switch (toast.type) {
            @case ('error') { ❌ }
            @case ('success') { ✅ }
            @case ('info') { ℹ️ }
          }
        </span>
        <span class="toast__message">{{ toast.message }}</span>
        <button
          class="toast__close"
          type="button"
          aria-label="Cerrar notificación"
          (click)="notification.dismiss()"
        >
          ✕
        </button>
      </div>
    }
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      border-radius: 0.75rem;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      font-size: 0.9rem;
      max-width: 26rem;
      animation: slideInToast 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .toast--error {
      background: rgba(185, 28, 28, 0.85);
      color: #fef2f2;
    }
    .toast--success {
      background: rgba(21, 128, 60, 0.85);
      color: #f0fdf4;
    }
    .toast--info {
      background: rgba(29, 78, 216, 0.85);
      color: #eff6ff;
    }
    .toast__icon {
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .toast__message {
      flex: 1;
      line-height: 1.4;
    }
    .toast__close {
      background: transparent;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.85rem;
      opacity: 0.75;
      transition: opacity 0.15s;
      flex-shrink: 0;
    }
    .toast__close:hover {
      opacity: 1;
    }
    .toast__close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
    @keyframes slideInToast {
      from { transform: translateY(1rem) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
  `],
})
export class Toast {
  protected readonly notification = inject(NotificationService);
}
