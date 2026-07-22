import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { greet, greetWithTime, farewell } from '../utils/greet.js';

describe('greet', () => {
  it('should return a greeting with the given name', () => {
    const result = greet('World');
    expect(result).toBe('Hello, World!');
  });
  it('should handle empty string', () => {
    const result = greet('');
    expect(result).toBe('Hello, !');
  });
});

describe('greetWithTime', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  it('should say Good morning before 12:00', () => {
    vi.setSystemTime(new Date('2026-07-22T09:00:00'));
    expect(greetWithTime('Alice')).toBe('Good morning, Alice!');
  });
  it('should say Good afternoon between 12:00 and 17:59', () => {
    vi.setSystemTime(new Date('2026-07-22T14:30:00'));
    expect(greetWithTime('Bob')).toBe('Good afternoon, Bob!');
  });
  it('should say Good evening after 18:00', () => {
    vi.setSystemTime(new Date('2026-07-22T20:00:00'));
    expect(greetWithTime('Charlie')).toBe('Good evening, Charlie!');
  });
});

describe('farewell', () => {
  it('should return a farewell message', () => {
    const result = farewell('World');
    expect(result).toBe('Goodbye, World! See you soon.');
  });
});
