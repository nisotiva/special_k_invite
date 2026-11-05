import { useEffect, useRef, useState } from 'react';
import { formatDate } from './dateUtils';
import type { Receipt } from './progress';
export function ConfirmationCopy({ receipt }: { receipt: Receipt }) {
  const [message, setMessage] = useState('');
  const [manual, setManual] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const summary = `Дата: ${formatDate(receipt.date)}\nВремя: ${receipt.time}\nЧасовой пояс: Europe/London`;
  useEffect(() => { if (manual) { input.current?.focus(); input.current?.select(); } }, [manual]);
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(summary);
      setMessage('Дата и время скопированы. Их можно отправить мне удобным способом.');
    } catch { setManual(true); setMessage('Скопируйте выделенный текст вручную.'); }
  }
  return <div><button type="button" className="copy-button" onClick={copy}>Скопировать дату и время</button><p className="copy-feedback" role="status">{message}</p>{manual && <textarea className="manual-copy" ref={input} readOnly value={summary} rows={4} aria-label="Дата и время для копирования" />}</div>;
}
