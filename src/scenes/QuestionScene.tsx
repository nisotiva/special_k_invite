import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CarWheelPicker, createOptions } from './CarWheelPicker';
import { Arrow } from './WelcomeScene';
export function QuestionScene({ onContinue, onSolved }: { onContinue: () => void; onSolved: () => void }) {
  const [options] = useState(createOptions);
  const [stopped, setStopped] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const [canContinue, setCanContinue] = useState(false);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onStop = useCallback((index: number) => setStopped(previous => previous.includes(index) ? previous : [...previous, index]), []);
  useEffect(() => { if (!solved) return; const timer = setTimeout(() => setCanContinue(true), 1000); return () => clearTimeout(timer); }, [solved]);
  useEffect(() => () => { if (wrongTimer.current) clearTimeout(wrongTimer.current); }, []);
  const choose = (value: string) => {
    if (stopped.length !== 3 || solved) return;
    if (value === 'Regalia') { setWrong(null); setSolved(true); onSolved(); }
    else { setWrong(value); if (wrongTimer.current) clearTimeout(wrongTimer.current); wrongTimer.current = setTimeout(() => setWrong(null), 850); }
  };
  return <section className="question text-center" aria-labelledby="question-title">
    <p className="eyebrow">ПРОВЕРКА 01</p>
    <h1 id="question-title">Какую машину<br/>Вы мне продали?</h1>
    <p className="subtitle">Надеюсь, память Вас не подведёт</p>
    <CarWheelPicker {...{ options, solved, wrong, onStop }} ready={stopped.length === 3} onSelect={choose} />
    <div className="answer-area">
      <p className={`answer-message ${solved ? 'answer-correct' : ''}`} role="status" aria-live="polite">{solved ? 'Ладно, похоже, это действительно Вы' : wrong ? 'Хм... А Вы точно тот самый человек?' : stopped.length === 3 ? 'Выберите тот самый автомобиль' : 'Немного терпения. Вспоминаем…'}</p>
      <AnimatePresence>{canContinue && <motion.button className="glass-button" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={onContinue}>Продолжить <Arrow /></motion.button>}</AnimatePresence>
    </div>
  </section>;
}
