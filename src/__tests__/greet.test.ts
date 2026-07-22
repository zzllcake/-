import { describe, it, expect } from 'vitest';

import { greet } from '../utils/greet.js';

describe('greet', () => {
  it('should return a greeting with the given name', () => {
    const result = greet('World');
    expect(result).toBe('Hello, World!');
  });

  it('should handle empty string', () => {
    const result = greet('');
    expect(result).toBe('Hello, !');
  });

  it('should handle special characters', () => {
    const result = greet('Alice & Bob');
    expect(result).toBe('Hello, Alice & Bob!');
  });
});
