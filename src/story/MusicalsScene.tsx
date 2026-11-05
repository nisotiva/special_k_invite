import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChoiceCards, Reveal, useWrongAnswer } from './SceneElements';
import type { StorySceneProps } from './SceneElements';
const options = ['Ужасы', 'Мюзиклы', 'Комедии', 'Боевики'];
export function MusicalsScene({ solved, onSolve, onContinue }: StorySceneProps) {
  const reduced = useReducedMotion();
  const [fading, setFading] = useState(false);
  const { wrongIndex, hasError, reject } = useWrongAnswer();
  useEffect(() => {
    if (!solved) return;
    const fade = setTimeout(() => setFading(true), reduced ? 700 : 1700);
    const next = setTimeout(onContinue, reduced ? 850 : 2900);
    return () => { clearTimeout(fade); clearTimeout(next); };
  }, [onContinue, reduced, solved]);
  return <motion.section className="story-scene musicals-scene text-center" aria-labelledby="musicals-title" animate={{ opacity: fading ? 0 : 1 }} transition={{ duration: reduced ? .1 : 1.1 }}>
    <motion.div animate={{ opacity: solved ? 0 : 1 }} transition={{ duration: reduced ? .1 : .8 }}><p className="eyebrow">ПОСЛЕДНЯЯ ПРОВЕРКА</p><h1 id="musicals-title">А теперь вопрос обо мне...</h1><Reveal delay={.7}><p className="story-subtitle">Как ты думаешь, какой жанр фильмов<br className="desktop-break" /> я не любил больше всего?</p></Reveal>
    <ChoiceCards {...{ options, solved, wrongIndex }} correctIndex={1} hideOthers onChoose={index => index === 1 ? onSolve() : reject(index)} />
    <div className="story-result"><p className="story-feedback" role="status">{!solved && hasError ? 'Не совсем. Попробуй ещё раз' : '\u00a0'}</p></div></motion.div>
    {solved && <div className="musical-reveal" aria-live="polite"><Reveal delay={.35}><p className="musical-answer">Да. Именно мюзиклы.</p></Reveal></div>}
  </motion.section>;
}
