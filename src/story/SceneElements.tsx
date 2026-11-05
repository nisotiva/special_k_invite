import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Arrow } from '../scenes/WelcomeScene';

export interface StorySceneProps { solved: boolean; onSolve: () => void; onContinue: () => void }
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : delay, duration: reduced ? .1 : .8, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
export function Delayed({ children, delay = 900 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setVisible(true), reduced ? 0 : delay); return () => clearTimeout(timer); }, [delay, reduced]);
  return visible ? <Reveal>{children}</Reveal> : null;
}
export function ContinueButton({ onClick, label = 'Продолжить' }: { onClick: () => void; label?: string }) {
  return <button type="button" className="glass-button" onClick={onClick}>{label} <Arrow /></button>;
}
export function ChoiceCards({ options, correctIndex, solved, wrongIndex, onChoose, hideOthers = false, document = false }: { options: readonly string[]; correctIndex: number; solved: boolean; wrongIndex: number | null; onChoose: (index: number) => void; hideOthers?: boolean; document?: boolean }) {
  const reduced = useReducedMotion();
  return <div className={`choice-list ${document ? 'document-choices' : ''}`} role="group" aria-label="Варианты ответа">{options.map((option, index) => <motion.button type="button" key={option} className={`choice-card ${solved && index === correctIndex ? 'choice-correct' : ''}`} disabled={solved} aria-pressed={solved && index === correctIndex} onClick={() => onChoose(index)} animate={{ x: !reduced && wrongIndex === index ? [0, -5, 5, -3, 0] : 0, opacity: solved && index !== correctIndex ? hideOthers ? 0 : .35 : 1 }} transition={{ duration: .5 }}>
    {document && <span className="clause-number" aria-hidden="true">0{index + 1}</span>}<span>{option}</span><span className="choice-mark" aria-hidden="true">{solved && index === correctIndex ? '✓' : '·'}</span>
  </motion.button>)}</div>;
}
export function useWrongAnswer() {
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  useEffect(() => { if (wrongIndex === null) return; const timer = setTimeout(() => setWrongIndex(null), 600); return () => clearTimeout(timer); }, [wrongIndex]);
  return { wrongIndex, hasError, reject: (index: number) => { setHasError(true); setWrongIndex(index); } };
}
