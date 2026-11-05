import { motion, useReducedMotion } from 'motion/react';
import { ContinueButton, Delayed, Reveal, useWrongAnswer } from './SceneElements';
import type { StorySceneProps } from './SceneElements';
const flowers = [{ name: 'Лютик', image: 'buttercup' }, { name: 'Роза', image: 'rose' }, { name: 'Тюльпан', image: 'tulip' }, { name: 'Пион', image: 'peony' }];
export function FlowersScene({ solved, onSolve, onContinue }: StorySceneProps) {
  const reduced = useReducedMotion();
  const { wrongIndex, hasError, reject } = useWrongAnswer();
  return <motion.section layout="position" transition={{ layout: { duration: reduced ? 0 : .65, ease: [.22, 1, .36, 1] } }} className="story-scene flowers-scene text-center" aria-labelledby="flowers-title">
    <p className="eyebrow">ПРОВЕРКА 02</p><h1 id="flowers-title">Кажется, в этом букете<br className="desktop-break" /> есть лишний цветок...</h1>
    <p className="story-subtitle">Какой из них стоит убрать?</p>
    <div className={`flower-stage ${solved ? 'is-bouquet' : ''}`} role="group" aria-label={solved ? 'Букет из четырёх цветов' : 'Цветы в букете'}>
      {flowers.map((flower, index) => <motion.div layout key={flower.image} className={`flower-slot flower-${index}`} animate={{ rotate: solved ? [-24, -8, 10, 27][index] : 0 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 55, damping: 16, mass: 1.2, delay: index * .08 }}>
        <motion.button type="button" className="flower-button" aria-label={flower.name} disabled={solved} onClick={() => reject(index)} whileHover={solved || reduced ? {} : { y: -6, rotate: 2 }} animate={{ x: !reduced && wrongIndex === index ? [0, -4, 4, -3, 0] : 0 }}>
          <img src={`${import.meta.env.BASE_URL}flowers/${flower.image}.svg`} alt="" width="220" height="320" decoding="async" draggable="false" />
          <motion.span animate={{ opacity: solved ? 0 : 1 }}>{flower.name}</motion.span>
        </motion.button>
      </motion.div>)}
      {solved && <motion.div className="bouquet-ribbon" aria-hidden="true" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduced ? 0 : 1, duration: .7 }}>∞</motion.div>}
    </div>
    {!solved ? <><p className="story-feedback" role="status">{hasError ? 'Вы уверены, что именно он лишний?' : '\u00a0'}</p><button className="glass-button" onClick={onSolve}>Ни один. Все прекрасны</button></> : <div className="flower-result"><Reveal delay={1.25}><blockquote className="flower-quote">«И цветов не бывает много. Они все прекрасны, начиная от маленького лютика и заканчивая благородными розами»</blockquote><p className="story-caption">Кажется, кто-то однажды сказал очень красивые слова</p></Reveal><Delayed delay={2700}><ContinueButton onClick={onContinue} /></Delayed></div>}
  </motion.section>;
}
