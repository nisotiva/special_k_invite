import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { discordWebhookUrl } from '../config';
import { Calendar } from './Calendar';
import { dateKey, formatDate, isFutureAppointment, meetingCalendarToday, parseDate, timeOptions } from './dateUtils';
import { submitInvitation, UnconfiguredEndpointError } from './submitInvitation';
import { Reveal } from './SceneElements';
import type { Receipt } from './progress';
const DRAFT_KEY = 'personal-story:date-draft';
function readDraft(): { date: string; time: string } {
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? 'null');
    if (draft && typeof draft.date === 'string' && parseDate(draft.date) && draft.date >= dateKey(meetingCalendarToday())) return { date: draft.date, time: typeof draft.time === 'string' && timeOptions.includes(draft.time) ? draft.time : '' };
  } catch { /* Storage is optional. */ }
  return { date: '', time: '' };
}
export function DateTimeScene({ onConfirmed }: { onConfirmed: (receipt: Receipt) => void }) {
  const [draft, setDraft] = useState(readDraft);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const busy = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const copyRef = useRef<HTMLTextAreaElement>(null);
  const summary = draft.date && draft.time ? `Дата: ${formatDate(draft.date)}\nВремя: ${draft.time}\nЧасовой пояс: Europe/London` : '';
  useEffect(() => { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* Optional persistence. */ } }, [draft]);
  useEffect(() => {
    mounted.current = true;
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => { mounted.current = false; clearInterval(timer); abortRef.current?.abort(); };
  }, []);
  useEffect(() => { if (manualCopy) { copyRef.current?.focus(); copyRef.current?.select(); } }, [manualCopy]);
  function update(value: Partial<typeof draft>) { setDraft(previous => ({ ...previous, ...value })); setMessage(''); setCopyMessage(''); setManualCopy(false); }
  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    if (!isFutureAppointment(draft.date, draft.time)) { setMessage('Выберите будущую дату и время с шагом 15 минут.'); setNow(new Date()); return; }
    if (!discordWebhookUrl) { setMessage('Отправка ещё не подключена. Скопируйте выбранную дату и время и отправьте их мне удобным способом.'); return; }
    busy.current = true;
    setSending(true);
    setMessage('');
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    const receipt: Receipt = { date: draft.date, time: draft.time, timestamp: new Date().toISOString(), delivery: 'unverified' };
    try {
      await submitInvitation({ ...receipt, event_type: 'musical_invitation' }, controller.signal);
      if (mounted.current) onConfirmed(receipt);
    } catch (error) {
      if (mounted.current) setMessage(error instanceof UnconfiguredEndpointError ? 'Отправка ещё не подключена. Скопируйте выбранную дату и время.' : 'Не удалось отправить запрос. Попробуйте ещё раз');
    } finally {
      clearTimeout(timeout);
      busy.current = false;
      if (mounted.current) setSending(false);
    }
  }
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(summary);
      if (mounted.current) setCopyMessage('Дата и время скопированы. Их можно отправить мне удобным способом.');
    } catch { if (mounted.current) { setManualCopy(true); setCopyMessage('Скопируйте выделенный текст вручную.'); } }
  }
  const valid = isFutureAppointment(draft.date, draft.time, now);
  return <section className="story-scene date-scene text-center" aria-labelledby="date-title">
    <p className="eyebrow">ПОСЛЕДНЯЯ ФОРМАЛЬНОСТЬ</p><h1 id="date-title">Осталась одна формальность</h1><p className="story-subtitle date-intro">Поскольку право назначать личные встречи и свидания у Вас уже имеется, предлагаю им воспользоваться</p><p className="date-question">Когда Вам будет удобно?</p>
    <form className="date-form" onSubmit={confirm} aria-busy={sending}>
      <div className="date-panel"><Calendar selected={draft.date} onSelect={date => update({ date })} disabled={sending} today={meetingCalendarToday(now)} />
      {draft.date && <Reveal className="time-field"><label htmlFor="meeting-time">Время встречи</label><div className="time-select-wrap"><select id="meeting-time" value={draft.time} disabled={sending} required onChange={event => update({ time: event.target.value })}><option value="">Выберите время</option>{timeOptions.map(time => <option key={time} value={time} disabled={!isFutureAppointment(draft.date, time, now)}>{time}</option>)}</select><span aria-hidden="true">⌄</span></div><p className="time-hint">Ваше местное время · шаг 15 минут</p></Reveal>}</div>
      {summary && <Reveal className="date-summary"><p>Дата: <strong>{formatDate(draft.date)}</strong></p><p>Время: <strong>{draft.time}</strong></p><button type="submit" className="glass-button" disabled={!valid || sending}>{sending ? 'Отправляем приглашение...' : 'Воспользоваться полномочиями'}</button></Reveal>}
      {!discordWebhookUrl && <p className="connection-note">Отправка ещё не подключена.{summary ? ' Пока можно скопировать дату и время.' : ''}</p>}
      <p className="form-feedback" role="status" aria-live="polite">{message}</p>
      {summary && <><button type="button" className="copy-button" onClick={copy} disabled={sending}>Скопировать дату и время</button><p className="copy-feedback" role="status">{copyMessage}</p>{manualCopy && <textarea ref={copyRef} className="manual-copy" readOnly aria-label="Дата и время для копирования" value={summary} rows={3} />}</>}
    </form>
  </section>;
}
