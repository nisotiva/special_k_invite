import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QuestionScene } from '../src/scenes/QuestionScene';
import { createOptions, decoys } from '../src/scenes/CarWheelPicker';
afterEach(cleanup);
describe('Personal quest', () => {
  it('always offers Regalia, two unique permitted alternatives, and all three possible positions', () => {
    const positions = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      const options = createOptions();
      expect(options).toHaveLength(3);
      expect(new Set(options).size).toBe(3);
      expect(options).toContain('Regalia');
      expect(options.every(option => option === 'Regalia' || decoys.includes(option))).toBe(true);
      positions.add(options.indexOf('Regalia'));
    }
    expect(positions.size).toBe(3);
  });
  it('allows a retry without replacing options, then unlocks continuation after the correct answer', async () => {
    const onSolved = vi.fn();
    const onContinue = vi.fn();
    render(<QuestionScene onSolved={onSolved} onContinue={onContinue} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Выбрать Regalia' }).hasAttribute('disabled')).toBe(false), { timeout: 4000 });
    const choices = screen.getAllByRole('button');
    const labels = choices.map(button => button.getAttribute('aria-label'));
    const incorrect = choices.find(button => button.getAttribute('aria-label') !== 'Выбрать Regalia')!;
    fireEvent.click(incorrect);
    expect(screen.getByRole('status').textContent).toBe('Хм... А Вы точно тот самый человек?');
    expect(onSolved).not.toHaveBeenCalled();
    expect(screen.getAllByRole('button').map(button => button.getAttribute('aria-label'))).toEqual(labels);
    fireEvent.click(screen.getByRole('button', { name: 'Выбрать Regalia' }));
    expect(onSolved).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status').textContent).toBe('Ладно, похоже, это действительно Вы');
    expect(screen.queryByRole('button', { name: 'Продолжить' })).toBeNull();
    expect(choices.every(button => button.hasAttribute('disabled'))).toBe(true);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDefined(), { timeout: 2000 });
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
