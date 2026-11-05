import { ContinueButton, Delayed, Reveal } from './SceneElements';
export function InvitationScene({ onContinue }: { onContinue: () => void }) {
  return <section className="story-scene invitation-scene text-center" aria-labelledby="invitation-title">
    <div className="invitation-light" aria-hidden="true">✧</div>
    <Reveal delay={.3}><p className="invitation-paragraph">Признаться, раньше мюзиклы никогда не вызывали у меня особого интереса. Однако Ваша любовь к этому жанру заставила меня взглянуть на него немного иначе</p></Reveal>
    <Reveal delay={2.3}><p className="invitation-paragraph">Мне стало любопытно, что именно делает его настолько особенным для Вас, и было бы интересно разделить с Вами впечатления от просмотра</p></Reveal>
    <Reveal delay={4.8}><p className="invitation-paragraph">К тому же, насколько я помню, Вы однажды упоминали один фильм, который хотели посмотреть вместе)</p></Reveal>
    <Reveal delay={7.2}><h1 id="invitation-title">Кажется, у меня впервые появилось искреннее желание посмотреть мюзикл</h1></Reveal>
    <div className="invitation-action"><Delayed delay={9400}><ContinueButton onClick={onContinue} label="И что дальше?" /></Delayed></div>
  </section>;
}
