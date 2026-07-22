import { describe, it, expect } from 'vitest';
import { add, divide, process, greet } from '../calculator.js';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});

describe('divide', () => {
  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });
});

describe('process', () => {
  it('should parse string to number and add', () => {
    expect(process('5')).toBe(15);
  });
});

describe('greet', () => {
  it('should log greeting', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    greet('World');
    expect(spy).toHaveBeenCalledWith('Hello World');
    spy.mockRestore();
  });
});
