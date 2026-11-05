import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
export function ButScene({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion();
  useEffect(() => { const timer = setTimeout(onContinue, reduced ? 1800 : 2600); return () => clearTimeout(timer); }, [onContinue, reduced]);
  return <section className="story-scene interlude-scene text-center"><h1>Но...</h1></section>;
}
