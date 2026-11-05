import type { SceneTheme } from '../scenes/themes';

const decoded = new Map<string, Promise<boolean>>();
export function preloadImage(src: string): Promise<boolean> {
  const cached = decoded.get(src);
  if (cached) return cached;
  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.src = src;
  // Older browsers and DOM-only tests do not expose decode(). Loading must never block navigation.
  const task = typeof image.decode === 'function'
    ? image.decode().then(() => true, () => { decoded.delete(src); return false; })
    : Promise.resolve(true);
  decoded.set(src, task);
  return task;
}
export function preloadBackground(theme: SceneTheme): Promise<boolean> {
  const mobile = window.matchMedia('(max-width: 600px)').matches;
  return preloadImage(mobile && theme.mobileBackgroundImage ? theme.mobileBackgroundImage : theme.backgroundImage);
}
export function whenIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(task, { timeout: 1200 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(task, 250);
  return () => clearTimeout(id);
}
