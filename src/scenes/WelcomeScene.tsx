import { motion } from 'motion/react';
export const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export function WelcomeScene({ onStart }: { onStart: () => void }) {
  return <section className="welcome text-center" aria-labelledby="welcome-title">
    <motion.div className="scene-symbol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15, duration: 1 }} aria-hidden="true"><span>✧</span></motion.div>
    <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}>ОДНО МАЛЕНЬКОЕ СОВПАДЕНИЕ</motion.p>
    <motion.h1 id="welcome-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .9 }}>Привет,<br/><span className="title-soft">незнакомка!</span></motion.h1>
    <motion.div className="intro-copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65, duration: .85 }}>
      <p>Увы, этот сайт был создан только для одного человека.</p>
      <p>Но если это всё-таки Вы...<br/>Думаю, небольшая проверка нам не помешает</p>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .95, duration: .8 }}>
      <button className="glass-button group" onClick={onStart}>Начать проверку <Arrow /></button>
      <p className="button-note">Посторонним вход воспрещён. Почти.</p>
    </motion.div>
  </section>;
}
