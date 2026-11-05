import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
export const decoys = ['Sultan', 'Elegy', 'Banshee', 'Jester', 'Buffalo', 'Kuruma', 'Schafter', 'Futo'];
const names = [...decoys, 'Regalia'];
export function createOptions(random = Math.random): string[] {
  const shuffled = [...decoys];
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  const result = shuffled.slice(0, 2);
  result.splice(Math.floor(random() * 3), 0, 'Regalia');
  return result;
}
const ROW = 52;
const TARGET = 26;
function Wheel({ value, index, ready, solved, wrong, onStop, onSelect }: { value: string; index: number; ready: boolean; solved: boolean; wrong: boolean; onStop: (index: number) => void; onSelect: (value: string) => void }) {
  const reduced = useReducedMotion();
  const y = useMotionValue(0);
  const [rows] = useState(() => Array.from({ length: 30 }, (_, i) => i === TARGET ? value : names[(i + index * 3) % names.length]));
  useEffect(() => {
    const animation = animate(y, -TARGET * ROW, { duration: reduced ? 0 : 2.25 + index * .3, ease: [.12, .68, .16, 1], onComplete: () => onStop(index) });
    return () => animation.stop();
  }, [index, onStop, reduced, y]);
  const selected = solved && value === 'Regalia';
  return <motion.button type="button" className={`wheel ${selected ? 'wheel-selected' : ''} ${solved && !selected ? 'wheel-muted' : ''}`} disabled={!ready || solved} onClick={() => onSelect(value)} aria-label={ready ? `Выбрать ${value}` : `Вариант ${index + 1}, подбор автомобиля`} aria-pressed={selected} animate={{ x: wrong ? [0, -6, 6, -4, 4, 0] : 0 }} transition={{ duration: .4 }}>
    <span className="wheel-viewport" aria-hidden="true"><motion.span className="wheel-strip" style={{ y }}>{rows.map((name, i) => <span key={i} className="wheel-row">{name}</span>)}</motion.span></span>
    <span className="selection-band" aria-hidden="true" />
    <span className="wheel-indicator" aria-hidden="true">{selected ? '✓' : <span />}</span>
  </motion.button>;
}
export function CarWheelPicker({ options, ready, solved, wrong, onStop, onSelect }: { options: string[]; ready: boolean; solved: boolean; wrong: string | null; onStop: (index: number) => void; onSelect: (value: string) => void }) {
  return <div className="wheel-grid" role="group" aria-label="Варианты автомобиля">{options.map((value, index) => <Wheel key={value} {...{ value, index, ready, solved, onStop, onSelect }} wrong={wrong === value} />)}</div>;
}
