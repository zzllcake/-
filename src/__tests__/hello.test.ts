import { describe, it, expect } from 'vitest';

import { sayHello } from '../hello.js';

describe('sayHello', () => {
  it('should return a welcome message', () => {
    const result = sayHello('World');
    expect(result).toBe('Hi, World! Welcome to auto code review.');
  });

  it('should handle empty name', () => {
    const result = sayHello('');
    expect(result).toBe('Hi, ! Welcome to auto code review.');
  });
});
