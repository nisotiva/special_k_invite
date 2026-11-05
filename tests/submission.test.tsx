import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { buildDiscordPayload, submitInvitation, UnconfiguredEndpointError } from '../src/story/submitInvitation';
import { dateKey, isFutureAppointment } from '../src/story/dateUtils';
import { DateTimeScene } from '../src/story/DateTimeScene';
import { SceneManager } from '../src/scenes/SceneManager';
import { STORAGE_KEY } from '../src/story/progress';
const endpoint = 'https://discord.com/api/webhooks/123456789012345678/test-webhook-token';
vi.mock('../src/config', () => ({ discordWebhookUrl: 'https://discord.com/api/webhooks/123456789012345678/test-webhook-token' }));
const payload = { date: '2030-11-05', time: '19:15', event_type: 'musical_invitation' as const, timestamp: '2026-11-05T12:00:00.000Z' };
function opaqueResponse(): Response {
  return new Proxy({ type: 'opaque' }, { get(target, key) {
    if (['ok', 'status', 'headers', 'json', 'text'].includes(String(key))) throw new Error('Opaque response must not be inspected');
    return Reflect.get(target, key);
  } }) as Response;
}
afterEach(() => { cleanup(); sessionStorage.clear(); vi.restoreAllMocks(); });
describe('Discord webhook contract', () => {
  it('does not fetch or report success for an empty endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    await expect(submitInvitation(payload, undefined, '')).rejects.toBeInstanceOf(UnconfiguredEndpointError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('formats the exact embed and sends multipart no-cors without inspecting the opaque response', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(opaqueResponse());
    await submitInvitation(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(endpoint, expect.objectContaining({ method: 'POST', mode: 'no-cors' }));
    const options = fetchMock.mock.calls[0][1]!;
    expect(options.headers).toBeUndefined();
    expect(options.body).toBeInstanceOf(FormData);
    const form = options.body as FormData;
    expect([...form.keys()]).toEqual(['payload_json']);
    expect(JSON.parse(form.get('payload_json') as string)).toEqual({
      username: 'Personal Invitation', allowed_mentions: { parse: [] }, embeds: [{
        title: '♡ Новое приглашение',
        description: 'Karoline воспользовалась своими полномочиями и назначила совместный просмотр мюзикла!',
        color: 0xD6A4BE,
        fields: [{ name: 'Дата встречи', value: '05.11.2030', inline: true }, { name: 'Время встречи', value: '19:15', inline: true }, { name: 'Часовой пояс', value: 'Europe/London', inline: true }],
        footer: { text: 'Полномочия реализованы' }, timestamp: payload.timestamp,
      }],
    });
  });
  it('rejects past dates and invalid calendar values before any request', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    await expect(submitInvitation({ ...payload, date: '2000-01-01' })).rejects.toThrow('будущую');
    expect(() => buildDiscordPayload({ ...payload, date: '2030-02-30' })).toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('validates London time independently of device timezone, including the DST gap', () => {
    const summer = new Date('2030-07-10T12:00:00Z'); // 13:00 in London.
    expect(isFutureAppointment('2030-07-10', '12:45', summer)).toBe(false);
    expect(isFutureAppointment('2030-07-10', '13:15', summer)).toBe(true);
    const beforeSpring = new Date('2027-03-27T12:00:00Z');
    expect(isFutureAppointment('2027-03-28', '01:15', beforeSpring)).toBe(false);
    expect(isFutureAppointment('2027-03-28', '02:15', beforeSpring)).toBe(true);
  });
});
describe('Date form with a configured endpoint', () => {
  beforeEach(() => {
    const future = new Date(); future.setDate(future.getDate() + 5);
    sessionStorage.setItem('personal-story:date-draft', JSON.stringify({ date: dateKey(future), time: '21:15' }));
  });
  it('does not send on mount or time changes, blocks duplicate clicks, and advances after opaque completion', async () => {
    let resolve!: (response: Response) => void;
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise<Response>(done => { resolve = done; }));
    const onConfirmed = vi.fn();
    render(<DateTimeScene onConfirmed={onConfirmed} />);
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Время встречи'), { target: { value: '20:45' } });
    expect(fetchMock).not.toHaveBeenCalled();
    const submit = screen.getByRole('button', { name: 'Воспользоваться полномочиями' });
    fireEvent.click(submit);
    fireEvent.click(submit);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(submit.hasAttribute('disabled')).toBe(true);
    expect(submit.textContent).toBe('Отправляем приглашение...');
    expect(onConfirmed).not.toHaveBeenCalled();
    resolve(opaqueResponse());
    await waitFor(() => expect(onConfirmed).toHaveBeenCalledTimes(1));
    const body = JSON.parse((fetchMock.mock.calls[0][1]!.body as FormData).get('payload_json') as string);
    expect(body.embeds[0].fields[1].value).toBe('20:45');
    expect(Number.isNaN(Date.parse(body.embeds[0].timestamp))).toBe(false);
    expect(onConfirmed.mock.calls[0][0].delivery).toBe('unverified');
  });
  it('keeps the selection after a network failure and allows a successful retry', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(opaqueResponse());
    const onConfirmed = vi.fn();
    render(<DateTimeScene onConfirmed={onConfirmed} />);
    fireEvent.click(screen.getByRole('button', { name: 'Воспользоваться полномочиями' }));
    await screen.findByText('Не удалось отправить запрос. Попробуйте ещё раз');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(onConfirmed).not.toHaveBeenCalled();
    expect((screen.getByLabelText('Время встречи') as HTMLSelectElement).value).toBe('21:15');
    fireEvent.click(screen.getByRole('button', { name: 'Воспользоваться полномочиями' }));
    await waitFor(() => expect(onConfirmed).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('restores the final scene without resending and retains copying', async () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ scene: 'date', completed: ['question', 'flowers', 'nights', 'attorney', 'musicals'] }));
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(opaqueResponse());
    const view = render(<SceneManager />);
    fireEvent.click(await screen.findByRole('button', { name: 'Воспользоваться полномочиями' }));
    await screen.findByRole('heading', { name: /Ваше предложение принято к рассмотрению/ }, { timeout: 3000 });
    expect(screen.getByText('С нетерпением жду выбранного Вами времени')).toBeDefined();
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY)!);
    expect(saved.scene).toBe('confirmation');
    expect(saved.receipt.time).toBe('21:15');
    expect(saved.receipt.delivery).toBe('unverified');
    expect(screen.queryByText('Запрос отправлен. Браузер не может подтвердить доставку в Discord.')).toBeNull();
    expect(screen.getByRole('button', { name: 'Скопировать дату и время' })).toBeDefined();
    view.unmount();
    render(<SceneManager />);
    expect(screen.getByRole('heading', { name: /Ваше предложение принято к рассмотрению/ })).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
