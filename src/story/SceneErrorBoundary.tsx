import { Component } from 'react';
import type { ReactNode } from 'react';
export class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <section className="story-scene text-center"><h1>Небольшая пауза</h1><p className="story-subtitle">Не удалось загрузить сцену. Проверьте соединение и попробуйте снова — прогресс сохранён в этой вкладке.</p><button className="glass-button" onClick={() => window.location.reload()}>Попробовать снова</button></section>;
    return this.props.children;
  }
}
