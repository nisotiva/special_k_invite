import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import type { SceneTheme } from './themes';

export function SceneTransition({ children, preset, onEntered }: { children: ReactNode; preset: SceneTheme['animationPreset']; onEntered?: () => void }) {
  const reduced = useReducedMotion();
  return <motion.div className="scene-content" initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8, transition: { duration: reduced ? .08 : .28, ease: 'easeOut' } }} onAnimationComplete={definition => { if (definition && typeof definition === 'object' && 'opacity' in definition && definition.opacity === 1) onEntered?.(); }} transition={{ duration: reduced ? .1 : preset === 'gentle' ? .65 : .5, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
