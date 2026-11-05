import { act, cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { preloadImage } from '../src/story/preload';
import { SceneBackground } from '../src/scenes/SceneBackground';
import { themes } from '../src/scenes/themes';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); });
it('shares one decode between prefetch and display and allows failed assets to be retried', async () => {
  let complete!: () => void;
  const decode = vi.fn(() => new Promise<void>(resolve => { complete = resolve; }));
  vi.stubGlobal('Image', class { src = ''; decode = decode; });
  const first = preloadImage('/cached-test.webp');
  const second = preloadImage('/cached-test.webp');
  expect(first).toBe(second);
  expect(decode).toHaveBeenCalledTimes(1);
  complete();
  await expect(first).resolves.toBe(true);
  decode.mockRejectedValueOnce(new Error('Image unavailable'));
  await expect(preloadImage('/retry-test.webp')).resolves.toBe(false);
  const retry = preloadImage('/retry-test.webp');
  complete();
  await expect(retry).resolves.toBe(true);
  expect(decode).toHaveBeenCalledTimes(3);
});
it('keeps the old background visible until the latest requested image has decoded', async () => {
  const pending = new Map<string, () => void>();
  vi.stubGlobal('Image', class {
    src = '';
    decode() { return new Promise<void>(resolve => pending.set(this.src, resolve)); }
  });
  const view = render(<SceneBackground theme={themes.welcome} warm={false} />);
  await act(async () => { pending.get(themes.welcome.backgroundImage)!(); });
  view.rerender(<SceneBackground theme={themes.flowers} warm={false} />);
  view.rerender(<SceneBackground theme={themes.nights} warm={false} />);
  await act(async () => { pending.get(themes.flowers.backgroundImage)!(); });
  expect(view.container.querySelector(`img[src="${themes.flowers.backgroundImage}"]`)).toBeNull();
  expect(view.container.querySelector(`img[src="${themes.welcome.backgroundImage}"]`)).not.toBeNull();
  await act(async () => { pending.get(themes.nights.backgroundImage)!(); });
  expect(view.container.querySelector(`img[src="${themes.nights.backgroundImage}"]`)).not.toBeNull();
});
