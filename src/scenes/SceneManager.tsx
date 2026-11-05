import { AnimatePresence } from 'motion/react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { dawnTheme, themes } from './themes';
import type { SceneId } from './themes';
import { SceneBackground } from './SceneBackground';
import { SceneTransition } from './SceneTransition';
import { WelcomeScene } from './WelcomeScene';
import { QuestionScene } from './QuestionScene';
import { FlowersScene } from '../story/FlowersScene';
import { ArabianNightsScene } from '../story/ArabianNightsScene';
import { PowerOfAttorneyScene } from '../story/PowerOfAttorneyScene';
import { MusicalsScene } from '../story/MusicalsScene';
import { ButScene } from '../story/ButScene';
import { InvitationScene } from '../story/InvitationScene';
import { ConfirmationScene } from '../story/ConfirmationScene';
import { readProgress, saveProgress } from '../story/progress';
import type { Receipt } from '../story/progress';
import { SceneErrorBoundary } from '../story/SceneErrorBoundary';
import { preloadBackground, preloadImage, whenIdle } from '../story/preload';
const loadDateScene = () => import('../story/DateTimeScene');
const DateTimeScene = lazy(() => loadDateScene().then(module => ({ default: module.DateTimeScene })));
const nextScene: Partial<Record<SceneId, SceneId>> = { welcome: 'question', question: 'flowers', flowers: 'nights', nights: 'attorney', attorney: 'musicals', musicals: 'interlude', interlude: 'invitation', invitation: 'date' };

export function SceneManager() {
  const [progress, setProgress] = useState(readProgress);
  const { scene, completed } = progress;
  const focusTarget = useRef<HTMLElement>(null);
  const theme = scene === 'nights' && completed.includes('nights') ? dawnTheme : themes[scene];
  useEffect(() => { saveProgress(progress); }, [progress]);
  useEffect(() => {
    const next = nextScene[scene];
    return whenIdle(() => {
      if (next) void preloadBackground(themes[next]);
      if (scene === 'nights') void preloadBackground(dawnTheme);
      if (next === 'flowers') for (const name of ['buttercup', 'rose', 'tulip', 'peony']) void preloadImage(`${import.meta.env.BASE_URL}flowers/${name}.svg`);
      if (scene === 'invitation') void loadDateScene().catch(() => { /* The boundary provides a retry if a chunk cannot load. */ });
    });
  }, [scene]);
  const advance = useCallback(() => {
    setProgress(previous => {
      if (previous.scene !== scene) return previous;
      const next = nextScene[scene];
      return next ? { ...previous, scene: next } : previous;
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [scene]);
  const solve = useCallback(() => {
    setProgress(previous => previous.scene !== scene || previous.completed.includes(scene) ? previous : { ...previous, completed: [...previous.completed, scene] });
  }, [scene]);
  const confirm = useCallback((receipt: Receipt) => {
    setProgress(previous => previous.scene === 'date' ? { ...previous, receipt, scene: 'confirmation' } : previous);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const focusScene = useCallback(() => { if (scene !== 'welcome') focusTarget.current?.focus({ preventScroll: true }); }, [scene]);
  const sceneProps = { solved: completed.includes(scene), onSolve: solve, onContinue: advance };
  const content = (() => {
    switch (scene) {
      case 'welcome': return <WelcomeScene onStart={advance} />;
      case 'question': return <QuestionScene onSolved={solve} onContinue={advance} />;
      case 'flowers': return <FlowersScene {...sceneProps} />;
      case 'nights': return <ArabianNightsScene {...sceneProps} />;
      case 'attorney': return <PowerOfAttorneyScene {...sceneProps} />;
      case 'musicals': return <MusicalsScene {...sceneProps} />;
      case 'interlude': return <ButScene onContinue={advance} />;
      case 'invitation': return <InvitationScene onContinue={advance} />;
      case 'date': return <Suspense fallback={<p className="loading-scene" role="status">Ещё мгновение...</p>}><DateTimeScene onConfirmed={confirm} /></Suspense>;
      case 'confirmation': return <ConfirmationScene receipt={progress.receipt} />;
    }
  })();
  return <div className={`experience atmosphere-${scene}`} style={{ color: theme.textColor, '--accent': theme.accentColor, '--glass': theme.glassStyle.background, '--glass-border': theme.glassStyle.border } as CSSProperties}>
    <SceneBackground theme={theme} warm={scene === 'question' && completed.includes('question')} />
    <main ref={focusTarget} tabIndex={-1} className="scene-stage"><SceneErrorBoundary><AnimatePresence mode="wait"><SceneTransition key={scene} preset={theme.animationPreset} onEntered={focusScene}>{content}</SceneTransition></AnimatePresence></SceneErrorBoundary></main>
  </div>;
}
