import { vi } from 'vitest';
// Respect the accessibility preference and keep the interaction tests deterministic.
Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn((query: string) => ({ matches: query.includes('prefers-reduced-motion'), media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; } })) });
window.scrollTo = vi.fn();
