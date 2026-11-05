export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return dateKey(date) === value ? date : null;
}
const londonClock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const offsetCache = new Map<string, number[]>();
function londonParts(date: Date) {
  const parts = Object.fromEntries(londonClock.formatToParts(date).map(part => [part.type, part.value]));
  return { day: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}
export function meetingCalendarToday(now = new Date()): Date {
  return parseDate(londonParts(now).day)!;
}
function londonOffsets(day: string): number[] {
  const cached = offsetCache.get(day);
  if (cached) return cached;
  const noon = Date.parse(`${day}T12:00:00Z`);
  const offsets = [...new Set([-12, 12].map(hours => {
    const sample = new Date(noon + hours * 3600000);
    const local = londonParts(sample);
    return Date.parse(`${local.day}T${local.time}:00Z`) - sample.getTime();
  }))];
  if (offsetCache.size >= 16) offsetCache.clear();
  offsetCache.set(day, offsets);
  return offsets;
}
export function isFutureAppointment(day: string, time: string, now = new Date()): boolean {
  if (!parseDate(day) || !/^([01]\d|2[0-3]):(00|15|30|45)$/.test(time)) return false;
  const naive = Date.parse(`${day}T${time}:00Z`);
  // Derive timezone offsets around the selected day, including either side of a DST change.
  return londonOffsets(day).some(offset => {
    const candidate = new Date(naive - offset);
    const local = londonParts(candidate);
    return local.day === day && local.time === time && candidate.getTime() > now.getTime();
  });
}
export function formatDate(value: string): string {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date) : '';
}
export const timeOptions = Array.from({ length: 96 }, (_, index) => `${String(Math.floor(index / 4)).padStart(2, '0')}:${String((index % 4) * 15).padStart(2, '0')}`);
