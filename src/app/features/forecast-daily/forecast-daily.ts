import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DailyWeather } from '@core/models/weather.model';
import { getWmoCondition } from '@core/utils/wmo-codes';
import { DayName } from '@shared/pipes/day-name.pipe';

@Component({
  selector: 'app-forecast-daily',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DayName, DecimalPipe],
  templateUrl: './forecast-daily.html',
  styleUrl: './forecast-daily.css',
})
export class ForecastDaily {
  readonly daily = input.required<DailyWeather>();

  protected readonly forecastDays = computed(() => {
    const d = this.daily();
    return d.time.map((date: string, i: number) => ({
      date,
      index: i,
      weatherCode: d.weather_code[i],
      max: d.temperature_2m_max[i],
      min: d.temperature_2m_min[i],
      condition: getWmoCondition(d.weather_code[i]),
    }));
  });
}
