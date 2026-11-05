import { sceneIds } from '../scenes/themes';
import type { SceneId } from '../scenes/themes';
export const STORAGE_KEY = 'personal-story:v2';
export interface Receipt { date: string; time: string; timestamp: string; delivery?: 'unverified' }
export interface Progress { scene: SceneId; completed: SceneId[]; receipt?: Receipt }
const isScene = (value: unknown): value is SceneId => sceneIds.includes(value as SceneId);
export function readProgress(): Progress {
  const initial: Progress = { scene: 'welcome', completed: [] };
  try {
    const data = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!data || !isScene(data.scene) || !Array.isArray(data.completed)) return initial;
    const completed: SceneId[] = data.completed.filter(isScene);
    let scene = data.scene;
    // A solved automatic sequence must not spin or play again on refresh.
    if (scene === 'question' && completed.includes('question')) scene = 'flowers';
    if (scene === 'musicals' && completed.includes('musicals')) scene = 'interlude';
    const receipt = data.receipt && typeof data.receipt.date === 'string' && typeof data.receipt.time === 'string' && typeof data.receipt.timestamp === 'string' ? data.receipt as Receipt : undefined;
    if (scene === 'confirmation' && !receipt) scene = 'date';
    return { scene, completed, receipt };
  } catch { return initial; }
}
export function saveProgress(progress: Progress) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* The story remains usable when storage is unavailable. */ }
}
