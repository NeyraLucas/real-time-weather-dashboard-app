import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dayName' })
export class DayName implements PipeTransform {
  transform(dateStr: string, index: number): string {
    if (index === 0) return 'Hoy';
    if (index === 1) return 'Mañana';
    // Parse with noon offset to avoid timezone shift issues
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' });
  }
}
