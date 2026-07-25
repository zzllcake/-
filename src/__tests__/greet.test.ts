import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { greet, greetWithTime, farewell } from '../utils/greet.js';

// ============================================================
// greet() 测试
// ============================================================
describe('greet()', () => {
  it('基本问候：应该返回 Hello, World!', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  it('空字符串：应该处理空名称', () => {
    expect(greet('')).toBe('Hello, !');
  });

  it('特殊字符：应该处理特殊字符', () => {
    expect(greet('Alice & Bob')).toBe('Hello, Alice & Bob!');
  });

  it('数字字符串：应该正确处理', () => {
    expect(greet('123')).toBe('Hello, 123!');
  });

  it('Unicode：应该支持中文', () => {
    expect(greet('世界')).toBe('Hello, 世界!');
  });

  it('带空格：应该保留空格', () => {
    expect(greet('  hello  ')).toBe('Hello,   hello  !');
  });

  it('很长的名称：应该正确处理', () => {
    const longName = 'a'.repeat(1000);
    const result = greet(longName);
    expect(result).toBe(`Hello, ${longName}!`);
    expect(result.length).toBe(1000 + 8);
  });
});

// ============================================================
// greetWithTime() 测试
// ============================================================
describe('greetWithTime()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('早上（6:00）：应该说 Good morning', () => {
    vi.setSystemTime(new Date('2026-07-22T06:00:00'));
    expect(greetWithTime('Alice')).toBe('Good morning, Alice!');
  });

  it('早上（11:59）：仍然 Good morning', () => {
    vi.setSystemTime(new Date('2026-07-22T11:59:59'));
    expect(greetWithTime('Bob')).toBe('Good morning, Bob!');
  });

  it('下午（12:00）：应该说 Good afternoon', () => {
    vi.setSystemTime(new Date('2026-07-22T12:00:00'));
    expect(greetWithTime('Charlie')).toBe('Good afternoon, Charlie!');
  });

  it('下午（17:59）：仍然 Good afternoon', () => {
    vi.setSystemTime(new Date('2026-07-22T17:59:59'));
    expect(greetWithTime('Dave')).toBe('Good afternoon, Dave!');
  });

  it('晚上（18:00）：应该说 Good evening', () => {
    vi.setSystemTime(new Date('2026-07-22T18:00:00'));
    expect(greetWithTime('Eve')).toBe('Good evening, Eve!');
  });

  it('深夜（23:59）：仍然 Good evening', () => {
    vi.setSystemTime(new Date('2026-07-22T23:59:59'));
    expect(greetWithTime('Frank')).toBe('Good evening, Frank!');
  });

  it('午夜（0:00）：Good morning', () => {
    vi.setSystemTime(new Date('2026-07-22T00:00:00'));
    expect(greetWithTime('Grace')).toBe('Good morning, Grace!');
  });

  it('日期变更：验证跨天行为', () => {
    vi.setSystemTime(new Date('2026-12-31T23:30:00'));
    expect(greetWithTime('Henry')).toBe('Good evening, Henry!');
  });

  it('空字符串：应该正确处理', () => {
    vi.setSystemTime(new Date('2026-07-22T14:00:00'));
    expect(greetWithTime('')).toBe('Good afternoon, !');
  });

  it('特殊字符：应该正确处理', () => {
    vi.setSystemTime(new Date('2026-07-22T09:00:00'));
    expect(greetWithTime('Ivy & Jack')).toBe('Good morning, Ivy & Jack!');
  });

  it('确保不抛出异常', () => {
    expect(() => greetWithTime('Test')).not.toThrow();
  });
});

// ============================================================
// farewell() 测试
// ============================================================
describe('farewell()', () => {
  it('基本告别：应该返回标准告别语', () => {
    expect(farewell('World')).toBe('Goodbye, World! See you soon.');
  });

  it('空字符串：应该正确处理', () => {
    expect(farewell('')).toBe('Goodbye, ! See you soon.');
  });

  it('中文名称：应该支持 Unicode', () => {
    expect(farewell('世界')).toBe('Goodbye, 世界! See you soon.');
  });

  it('特殊字符：应该正确处理', () => {
    expect(farewell('Alice & Bob')).toBe('Goodbye, Alice & Bob! See you soon.');
  });

  it('数字字符串：应该正确处理', () => {
    expect(farewell('123')).toBe('Goodbye, 123! See you soon.');
  });

  it('很长的名称：应该正确处理', () => {
    const longName = 'x'.repeat(500);
    const result = farewell(longName);
    expect(result).toBe(`Goodbye, ${longName}! See you soon.`);
  });

  it('前后带空格：保留空格', () => {
    expect(farewell('  user  ')).toBe('Goodbye,   user  ! See you soon.');
  });
});

// ============================================================
// 集成测试：验证三个函数协作
// ============================================================
describe('集成测试', () => {
  it('完整的问候-告别流程', () => {
    const name = 'Alice';
    const hello = greet(name);
    const goodbye = farewell(name);

    expect(hello).toContain('Hello');
    expect(goodbye).toContain('Goodbye');
    expect(hello).toContain(name);
    expect(goodbye).toContain(name);
  });

  it('greet 和 greetWithTime 返回不同的格式', () => {
    const name = 'Bob';
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T09:00:00'));

    const simple = greet(name);
    const timed = greetWithTime(name);

    expect(simple).not.toBe(timed);
    expect(timed).toContain('Good morning');
    vi.useRealTimers();
  });
});
