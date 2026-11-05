import { ChoiceCards, ContinueButton, Delayed, Reveal, useWrongAnswer } from './SceneElements';
import type { StorySceneProps } from './SceneElements';
const options = ['Ромео и Джульетта', 'Тысяча и одна ночь', 'Мастер и Маргарита', 'Декамерон'];
export function ArabianNightsScene({ solved, onSolve, onContinue }: StorySceneProps) {
  const { wrongIndex, hasError, reject } = useWrongAnswer();
  return <section className="story-scene nights-scene text-center" aria-labelledby="nights-title">
    <p className="eyebrow">ПРОВЕРКА 03</p><h1 id="nights-title" className="story-quotation">«Уже утро, мой повелитель,<br className="desktop-break" /> и я должна прекратить дозволенные речи»</h1><p className="story-subtitle">Откуда эта фраза?</p>
    <ChoiceCards {...{ options, solved, wrongIndex }} correctIndex={1} onChoose={index => index === 1 ? onSolve() : reject(index)} />
    <div className="story-result" aria-live="polite">{solved ? <><Reveal delay={1}><p className="story-response">Уже утро. Но, кажется, наша история ещё не закончена...</p></Reveal><Delayed delay={3500}><ContinueButton onClick={onContinue} /></Delayed></> : <p className="story-feedback" role="status">{hasError ? 'Не совсем. Попробуй вспомнить другую историю' : '\u00a0'}</p>}</div>
  </section>;
}
