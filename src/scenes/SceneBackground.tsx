import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { memo, useEffect, useState } from 'react';
import type { SceneTheme } from './themes';
import { preloadBackground } from '../story/preload';

export const SceneBackground = memo(function SceneBackground({ theme, warm }: { theme: SceneTheme; warm: boolean }) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(theme);
  useEffect(() => {
    let current = true;
    void preloadBackground(theme).then(ready => { if (current && ready) setDisplayed(theme); });
    return () => { current = false; };
  }, [theme]);
  const duration = reduced ? .15 : (displayed.transitionDuration ?? 1.8);
  const frameKey = `${displayed.backgroundImage}|${displayed.overlayColor}|${displayed.overlayOpacity}`;
  return <div className="scene-background" aria-hidden="true">
    <AnimatePresence initial={false} custom={duration}>
      <motion.div key={frameKey} className="background-layer" initial={{ opacity: 0, scale: reduced ? 1.025 : 1.055 }} animate={{ opacity: 1, scale: 1.025 }} variants={{ leaving: (seconds: number) => ({ opacity: 0, transition: { delay: seconds, duration: 0 } }) }} exit="leaving" transition={{ duration, ease: 'easeInOut' }}>
        <picture>
          {displayed.mobileBackgroundImage && <source media="(max-width: 600px)" srcSet={displayed.mobileBackgroundImage} />}
          <img className="background-image" src={displayed.backgroundImage} alt="" decoding="async" style={{ filter: displayed.preblurred ? undefined : `blur(${displayed.blurAmount}px)` }} />
        </picture>
        <div className="background-overlay" style={{ backgroundColor: displayed.overlayColor, opacity: displayed.overlayOpacity }} />
        {displayed.atmosphere === 'stars' && <div className="star-field" style={{ opacity: .7 }} />}
        {displayed.atmosphere === 'garden' && <motion.div className="garden-light" initial={{ opacity: 0, x: '-2%' }} animate={{ opacity: .25, x: '2%' }} transition={{ duration: reduced ? 0 : 30 }} />}
      </motion.div>
    </AnimatePresence>
    <motion.div className="warm-light" animate={{ opacity: warm ? .55 : 0 }} transition={{ duration: 2 }} />
    <div className="vignette" /><div className="grain" />
  </div>;
});
