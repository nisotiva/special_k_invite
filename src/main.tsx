import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { SceneManager } from './scenes/SceneManager';
import './style.css';
import './story.css';
import './performance.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><MotionConfig reducedMotion="user"><SceneManager /></MotionConfig></React.StrictMode>,
);
