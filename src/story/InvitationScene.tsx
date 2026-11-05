import { ContinueButton, Delayed, Reveal } from './SceneElements';
export function InvitationScene({ onContinue }: { onContinue: () => void }) {
  return <section className="story-scene invitation-scene text-center" aria-labelledby="invitation-title">
    <div className="invitation-light" aria-hidden="true">✧</div>
    <Reveal delay={.3}><p className="invitation-paragraph">Меня действительно заинтересовала<br className="desktop-break" /> Ваша любовь к этому жанру</p></Reveal>
    <Reveal delay={2.3}><p className="invitation-paragraph">Хотя прежде я не испытывал особого интереса к мюзиклам, мне хотелось бы разделить с Вами впечатления от просмотра</p></Reveal>
    <Reveal delay={4.8}><p className="invitation-paragraph">К тому же, насколько я помню, Вы упоминали, что у Вас есть один фильм на примете</p></Reveal>
    <Reveal delay={7.2}><h1 id="invitation-title">Кажется, у меня впервые возникло желание посмотреть мюзикл</h1></Reveal>
    <div className="invitation-action"><Delayed delay={9400}><ContinueButton onClick={onContinue} label="И что дальше?" /></Delayed></div>
  </section>;
}
