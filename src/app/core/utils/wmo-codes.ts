import { WmoCondition } from '@core/models/weather.model';

const WMO_CODES: Record<number, WmoCondition> = {
  0: { label: 'Despejado', description: 'Cielo despejado', icon: '☀️', color: '#FFD700' },
  1: { label: 'Mayormente despejado', description: 'Mayormente despejado', icon: '🌤️', color: '#FFD700' },
  2: { label: 'Parcialmente nublado', description: 'Parcialmente nublado', icon: '⛅', color: '#B0C4DE' },
  3: { label: 'Nublado', description: 'Nublado', icon: '☁️', color: '#A9A9A9' },
  45: { label: 'Niebla', description: 'Niebla', icon: '🌫️', color: '#D3D3D3' },
  48: { label: 'Niebla helada', description: 'Niebla con escarcha', icon: '🌫️', color: '#B0C4DE' },
  51: { label: 'Llovizna ligera', description: 'Llovizna ligera', icon: '🌦️', color: '#87CEEB' },
  53: { label: 'Llovizna moderada', description: 'Llovizna moderada', icon: '🌦️', color: '#6495ED' },
  55: { label: 'Llovizna intensa', description: 'Llovizna densa', icon: '🌧️', color: '#4682B4' },
  61: { label: 'Lluvia ligera', description: 'Lluvia ligera', icon: '🌦️', color: '#87CEEB' },
  63: { label: 'Lluvia moderada', description: 'Lluvia moderada', icon: '🌧️', color: '#4169E1' },
  65: { label: 'Lluvia intensa', description: 'Lluvia intensa', icon: '🌧️', color: '#00008B' },
  71: { label: 'Nieve ligera', description: 'Nieve ligera', icon: '🌨️', color: '#E0FFFF' },
  73: { label: 'Nieve moderada', description: 'Nieve moderada', icon: '❄️', color: '#B0E0E6' },
  75: { label: 'Nieve intensa', description: 'Nieve intensa', icon: '❄️', color: '#ADD8E6' },
  77: { label: 'Granizo', description: 'Granos de nieve', icon: '🌨️', color: '#D3D3D3' },
  80: { label: 'Chubascos ligeros', description: 'Chubascos ligeros', icon: '🌦️', color: '#87CEEB' },
  81: { label: 'Chubascos moderados', description: 'Chubascos moderados', icon: '🌧️', color: '#4169E1' },
  82: { label: 'Chubascos fuertes', description: 'Chubascos fuertes', icon: '⛈️', color: '#191970' },
  85: { label: 'Nevadas', description: 'Nevadas ligeras', icon: '🌨️', color: '#AFEEEE' },
  86: { label: 'Nevadas intensas', description: 'Nevadas intensas', icon: '❄️', color: '#B0E0E6' },
  95: { label: 'Tormenta', description: 'Tormenta eléctrica', icon: '⛈️', color: '#8B0000' },
  96: { label: 'Tormenta con granizo', description: 'Tormenta con granizo ligero', icon: '⛈️', color: '#8B0000' },
  99: { label: 'Tormenta fuerte', description: 'Tormenta con granizo intenso', icon: '🌩️', color: '#800000' },
};

const DEFAULT_CONDITION: WmoCondition = {
  label: 'Desconocido',
  description: 'Condición climática no reconocida',
  icon: '🌡️',
  color: '#A9A9A9',
};

export function getWmoCondition(code: number): WmoCondition {
  return WMO_CODES[code] ?? DEFAULT_CONDITION;
}

export function getDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Hoy';
  if (index === 1) return 'Mañana';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('es-MX', { weekday: 'short' });
}
