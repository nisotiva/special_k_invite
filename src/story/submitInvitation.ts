import { discordWebhookUrl } from '../config';
import { isFutureAppointment, parseDate } from './dateUtils';
export interface InvitationPayload { date: string; time: string; event_type: 'musical_invitation'; timestamp: string }
export class UnconfiguredEndpointError extends Error {}
export function buildDiscordPayload(payload: InvitationPayload) {
  if (!parseDate(payload.date) || !/^([01]\d|2[0-3]):(00|15|30|45)$/.test(payload.time) || Number.isNaN(Date.parse(payload.timestamp))) throw new Error('Выберите корректную дату и время.');
  return {
    username: 'Personal Invitation',
    allowed_mentions: { parse: [] },
    embeds: [{
      title: '♡ Новое приглашение',
      description: 'Karoline воспользовалась своими полномочиями и назначила совместный просмотр мюзикла!',
      color: 0xD6A4BE,
      fields: [
        { name: 'Дата встречи', value: payload.date.split('-').reverse().join('.'), inline: true },
        { name: 'Время встречи', value: payload.time, inline: true },
        { name: 'Часовой пояс', value: 'Europe/London', inline: true },
      ],
      footer: { text: 'Полномочия реализованы' },
      timestamp: new Date(payload.timestamp).toISOString(),
    }],
  };
}
export async function submitInvitation(payload: InvitationPayload, signal?: AbortSignal, endpoint = discordWebhookUrl): Promise<void> {
  if (!endpoint) throw new UnconfiguredEndpointError('Отправка ещё не подключена.');
  let url: URL;
  try { url = new URL(endpoint); } catch { throw new Error('Не удалось прочитать адрес вебхука. Скопируйте дату и время.'); }
  if (url.protocol !== 'https:' || !['discord.com', 'discordapp.com'].includes(url.hostname) || !/^\/api\/(?:v\d+\/)?webhooks\/\d+\/[\w-]+\/?$/.test(url.pathname)) throw new Error('Укажите корректный HTTPS-адрес Discord Webhook.');
  if (!isFutureAppointment(payload.date, payload.time)) throw new Error('Выберите будущую дату и время с шагом 15 минут.');
  const body = new FormData();
  body.append('payload_json', JSON.stringify(buildDiscordPayload(payload)));
  // An opaque response acknowledges completion of the request, never Discord delivery.
  // FormData supplies its own Content-Type/boundary; do not add custom headers.
  await fetch(url.href, { method: 'POST', mode: 'no-cors', body, signal, credentials: 'omit' });
}
