import { describe, it, expect } from 'vitest';

import { add, divide } from '../calculator.js';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});

describe('divide', () => {
  it('should divide for testing errors', () => {
    expect(divide(10, 2)).toBe(5);
  });
});
