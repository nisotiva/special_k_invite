import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { dateKey, parseDate } from './dateUtils';
const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export function Calendar({ selected, onSelect, disabled = false, today = new Date() }: { selected: string; onSelect: (value: string) => void; disabled?: boolean; today?: Date }) {
  const todayKey = dateKey(today);
  const initial = parseDate(selected) ?? today;
  const [view, setView] = useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [focused, setFocused] = useState(selected || todayKey);
  const keyboardFocus = useRef(false);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const previousDisabled = view <= currentMonth;
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const padding = (view.getDay() + 6) % 7;
  const month = monthFormatter.format(view);
  const focusDayInView = focused.slice(0, 7) === dateKey(view).slice(0, 7) ? focused : dateKey(new Date(view.getFullYear(), view.getMonth(), 1));
  useEffect(() => { if (keyboardFocus.current) { dayRefs.current.get(focused)?.focus(); keyboardFocus.current = false; } }, [focused, view]);
  function changeMonth(delta: number) {
    const next = new Date(view.getFullYear(), view.getMonth() + delta, 1);
    if (next < currentMonth || disabled) return;
    setView(next);
    setFocused(dateKey(next < today ? today : next));
  }
  function handleKey(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
    if (disabled) return;
    const next = new Date(date);
    if (event.key === 'ArrowLeft') next.setDate(next.getDate() - 1);
    else if (event.key === 'ArrowRight') next.setDate(next.getDate() + 1);
    else if (event.key === 'ArrowUp') next.setDate(next.getDate() - 7);
    else if (event.key === 'ArrowDown') next.setDate(next.getDate() + 7);
    else if (event.key === 'Home') next.setDate(next.getDate() - (next.getDay() + 6) % 7);
    else if (event.key === 'End') next.setDate(next.getDate() + 6 - (next.getDay() + 6) % 7);
    else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const day = next.getDate();
      next.setDate(1);
      next.setMonth(next.getMonth() + (event.key === 'PageUp' ? -1 : 1));
      next.setDate(Math.min(day, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
    } else return;
    event.preventDefault();
    if (dateKey(next) < todayKey) return;
    keyboardFocus.current = true;
    setFocused(dateKey(next));
    setView(new Date(next.getFullYear(), next.getMonth(), 1));
  }
  return <div className="calendar">
    <div className="calendar-header"><button type="button" aria-label="Предыдущий месяц" disabled={disabled || previousDisabled} onClick={() => changeMonth(-1)}>‹</button><p className="calendar-month" aria-live="polite">{month}</p><button type="button" aria-label="Следующий месяц" disabled={disabled} onClick={() => changeMonth(1)}>›</button></div>
    <p className="sr-only" id="calendar-help">Стрелки перемещают фокус по дням, Page Up и Page Down переключают месяцы. Enter выбирает дату.</p>
    <div className="calendar-weekdays" aria-hidden="true">{['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(day => <span key={day}>{day}</span>)}</div>
    <div className="calendar-days" role="group" aria-label="Выбор даты" aria-describedby="calendar-help">
      {Array.from({ length: padding }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}
      {Array.from({ length: days }, (_, index) => {
        const date = new Date(view.getFullYear(), view.getMonth(), index + 1);
        const key = dateKey(date);
        return <button type="button" key={key} ref={node => { if (node) dayRefs.current.set(key, node); else dayRefs.current.delete(key); }} disabled={disabled || key < todayKey} tabIndex={key === focusDayInView ? 0 : -1} aria-label={formatDay(date)} aria-pressed={selected === key} aria-current={key === todayKey ? 'date' : undefined} className={selected === key ? 'selected-day' : ''} onFocus={() => setFocused(key)} onClick={() => { setFocused(key); onSelect(key); }} onKeyDown={event => handleKey(event, date)}>{index + 1}</button>;
      })}
    </div>
  </div>;
}
function formatDay(date: Date) { return dayFormatter.format(date); }
