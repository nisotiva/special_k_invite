import { motion, useReducedMotion } from 'motion/react';
import { ChoiceCards, ContinueButton, Delayed, Reveal, useWrongAnswer } from './SceneElements';
import type { StorySceneProps } from './SceneElements';
const options = ['Обязывать доверителя приносить кофе каждое утро', 'Назначать личные встречи, свидания и внеочередные допросы', 'Запрещать доверителю выходить из дома по выходным', 'Требовать письменного согласования каждого сообщения'];
export function PowerOfAttorneyScene({ solved, onSolve, onContinue }: StorySceneProps) {
  const reduced = useReducedMotion();
  const { wrongIndex, hasError, reject } = useWrongAnswer();
  return <motion.section className="story-scene document-scene text-center" aria-labelledby="attorney-title" initial={{ opacity: 0, y: reduced ? 0 : 45 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : .3, duration: .9, ease: [.22, 1, .36, 1] }}>
    <div className="document-sheet"><p className="eyebrow">ПРОВЕРКА 04</p><div className="document-rule" aria-hidden="true"/><h1 id="attorney-title">Кажется, у тебя были<br className="desktop-break" /> особые полномочия...</h1><p className="story-subtitle">Какой из этих пунктов действительно был в нашей доверенности?</p>
    <ChoiceCards {...{ options, solved, wrongIndex }} correctIndex={1} document onChoose={index => index === 1 ? onSolve() : reject(index)} />
    <div className="document-result" aria-live="polite">{solved ? <><motion.div className="authority-stamp" initial={{ opacity: 0, scale: reduced ? 1 : 1.16, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} transition={{ duration: .7, delay: reduced ? 0 : .25 }}>ПОЛНОМОЧИЯ ПОДТВЕРЖДЕНЫ</motion.div><Reveal delay={.9}><p className="story-response">Доверенность по-прежнему действительна. Кстати, право назначать свидания никто не отменял...</p></Reveal><Delayed delay={1900}><ContinueButton onClick={onContinue} /></Delayed></> : <p className="story-feedback" role="status">{hasError ? 'В документе такого пункта не обнаружено' : '\u00a0'}</p>}</div></div>
  </motion.section>;
}
