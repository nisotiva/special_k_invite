import { Reveal } from './SceneElements';
import type { Receipt } from './progress';
import { ConfirmationCopy } from './ConfirmationCopy';
export function ConfirmationScene({ receipt }: { receipt?: Receipt }) {
  return <section className="story-scene confirmation-scene text-center" aria-labelledby="confirmation-title"><div className="scene-symbol" aria-hidden="true">♡</div><h1 id="confirmation-title">Ваше предложение<br className="desktop-break" /> принято к рассмотрению</h1><Reveal delay={.5}><p className="story-response">Надеюсь, после этого просмотра я тоже смогу полюбить мюзиклы так же, как и Вы</p></Reveal><Reveal delay={1.1}><p className="story-caption">P.S. Кажется, доверенность всё-таки была хорошей идеей</p></Reveal><Reveal delay={1.7}><p className="meeting-note">С нетерпением жду выбранного Вами времени</p></Reveal>{receipt?.delivery === 'unverified' && <Reveal delay={2.1}><ConfirmationCopy receipt={receipt} /></Reveal>}</section>;
}
