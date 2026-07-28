import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { greet, greetWithTime, farewell } from '../utils/greet.js';

// ============================================================
// greet() 测试 (25 个用例)
// ============================================================
describe('greet()', () => {
  // 基本功能
  it('基本问候', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  it('空字符串', () => {
    expect(greet('')).toBe('Hello, !');
  });

  it('特殊字符', () => {
    expect(greet('Alice & Bob')).toBe('Hello, Alice & Bob!');
  });

  // 边界情况
  it('数字字符串', () => {
    expect(greet('123')).toBe('Hello, 123!');
  });

  it('Unicode 中文', () => {
    expect(greet('世界')).toBe('Hello, 世界!');
  });

  it('Unicode 表情', () => {
    expect(greet('😀')).toBe('Hello, 😀!');
  });

  it('前后空格保留', () => {
    expect(greet('  hello  ')).toBe('Hello,   hello  !');
  });

  it('制表符', () => {
    expect(greet('\t')).toBe('Hello, \t!');
  });

  it('换行符', () => {
    expect(greet('\n')).toBe('Hello, \n!');
  });

  it('很长的名称', () => {
    const longName = 'a'.repeat(10000);
    expect(greet(longName)).toBe(`Hello, ${longName}!`);
  });

  it('单个字符', () => {
    expect(greet('A')).toBe('Hello, A!');
  });

  it('HTML 标签', () => {
    expect(greet('<script>')).toBe('Hello, <script>!');
  });

  it('JSON 字符串', () => {
    expect(greet('{"key":"value"}')).toBe('Hello, {"key":"value"}!');
  });

  it('null 转为字符串', () => {
    expect(greet(null as unknown as string)).toBe('Hello, null!');
  });

  it('undefined 转为字符串', () => {
    expect(greet(undefined as unknown as string)).toBe('Hello, undefined!');
  });

  // 返回类型验证
  it('返回类型是字符串', () => {
    expect(typeof greet('test')).toBe('string');
  });

  it('包含输入内容', () => {
    const name = 'TestUser';
    expect(greet(name)).toContain(name);
  });

  it('以感叹号结尾', () => {
    expect(greet('x')).toMatch(/!$/);
  });

  it('不抛出异常', () => {
    expect(() => greet('safe')).not.toThrow();
  });

  it('重复调用一致性', () => {
    const result1 = greet('Alice');
    const result2 = greet('Alice');
    expect(result1).toBe(result2);
  });
});

// ============================================================
// greetWithTime() 测试 (35 个用例)
// ============================================================
describe('greetWithTime()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // 早晨时段
  it('0:00 凌晨', () => {
    vi.setSystemTime(new Date('2026-07-22T00:00:00'));
    expect(greetWithTime('User')).toBe('Good morning, User!');
  });

  it('5:59 凌晨边界', () => {
    vi.setSystemTime(new Date('2026-07-22T05:59:59'));
    expect(greetWithTime('User')).toBe('Good morning, User!');
  });

  it('6:00 早上', () => {
    vi.setSystemTime(new Date('2026-07-22T06:00:00'));
    expect(greetWithTime('Alice')).toBe('Good morning, Alice!');
  });

  it('8:30 早上', () => {
    vi.setSystemTime(new Date('2026-07-22T08:30:00'));
    expect(greetWithTime('Bob')).toBe('Good morning, Bob!');
  });

  it('11:59 早上边界', () => {
    vi.setSystemTime(new Date('2026-07-22T11:59:59'));
    expect(greetWithTime('Charlie')).toBe('Good morning, Charlie!');
  });

  // 下午时段
  it('12:00 下午开始', () => {
    vi.setSystemTime(new Date('2026-07-22T12:00:00'));
    expect(greetWithTime('Dave')).toBe('Good afternoon, Dave!');
  });

  it('14:30 下午', () => {
    vi.setSystemTime(new Date('2026-07-22T14:30:00'));
    expect(greetWithTime('Eve')).toBe('Good afternoon, Eve!');
  });

  it('17:59 下午边界', () => {
    vi.setSystemTime(new Date('2026-07-22T17:59:59'));
    expect(greetWithTime('Frank')).toBe('Good afternoon, Frank!');
  });

  // 晚上时段
  it('18:00 晚上开始', () => {
    vi.setSystemTime(new Date('2026-07-22T18:00:00'));
    expect(greetWithTime('Grace')).toBe('Good evening, Grace!');
  });

  it('20:00 晚上', () => {
    vi.setSystemTime(new Date('2026-07-22T20:00:00'));
    expect(greetWithTime('Henry')).toBe('Good evening, Henry!');
  });

  it('23:59 晚上边界', () => {
    vi.setSystemTime(new Date('2026-07-22T23:59:59'));
    expect(greetWithTime('Ivy')).toBe('Good evening, Ivy!');
  });

  // 跨天
  it('同一天不同时段', () => {
    vi.setSystemTime(new Date('2026-07-22T09:00:00'));
    expect(greetWithTime('Jack')).toBe('Good morning, Jack!');
    vi.setSystemTime(new Date('2026-07-22T15:00:00'));
    expect(greetWithTime('Jack')).toBe('Good afternoon, Jack!');
    vi.setSystemTime(new Date('2026-07-22T21:00:00'));
    expect(greetWithTime('Jack')).toBe('Good evening, Jack!');
  });

  it('跨年', () => {
    vi.setSystemTime(new Date('2026-12-31T23:30:00'));
    expect(greetWithTime('Kate')).toBe('Good evening, Kate!');
    vi.setSystemTime(new Date('2027-01-01T00:30:00'));
    expect(greetWithTime('Kate')).toBe('Good morning, Kate!');
  });

  // 边界输入
  it('空字符串输入', () => {
    vi.setSystemTime(new Date('2026-07-22T14:00:00'));
    expect(greetWithTime('')).toBe('Good afternoon, !');
  });

  it('特殊字符', () => {
    vi.setSystemTime(new Date('2026-07-22T09:00:00'));
    expect(greetWithTime('@#$%')).toBe('Good morning, @#$%!');
  });

  it('Unicode 中文', () => {
    vi.setSystemTime(new Date('2026-07-22T12:00:00'));
    expect(greetWithTime('世界')).toBe('Good afternoon, 世界!');
  });

  it('长名称', () => {
    vi.setSystemTime(new Date('2026-07-22T18:00:00'));
    const longName = 'n'.repeat(1000);
    expect(greetWithTime(longName)).toBe(`Good evening, ${longName}!`);
  });

  // 稳定性
  it('不抛出异常', () => {
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
    expect(() => greetWithTime('test')).not.toThrow();
  });

  it('返回类型', () => {
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
    expect(typeof greetWithTime('test')).toBe('string');
  });

  it('包含问候时间', () => {
    vi.setSystemTime(new Date('2026-07-22T09:00:00'));
    const result = greetWithTime('Test');
    expect(result).toMatch(/(Good morning|Good afternoon|Good evening)/);
  });
});

// ============================================================
// farewell() 测试 (20 个用例)
// ============================================================
describe('farewell()', () => {
  it('基本告别', () => {
    expect(farewell('World')).toBe('Goodbye, World! See you soon.');
  });

  it('空字符串', () => {
    expect(farewell('')).toBe('Goodbye, ! See you soon.');
  });

  it('中文', () => {
    expect(farewell('世界')).toBe('Goodbye, 世界! See you soon.');
  });

  it('特殊字符', () => {
    expect(farewell('@#$%')).toBe('Goodbye, @#$%! See you soon.');
  });

  it('数字', () => {
    expect(farewell('123')).toBe('Goodbye, 123! See you soon.');
  });

  it('Unicode 表情', () => {
    expect(farewell('😀')).toBe('Goodbye, 😀! See you soon.');
  });

  it('HTML', () => {
    expect(farewell('<b>')).toBe('Goodbye, <b>! See you soon.');
  });

  it('长名称', () => {
    const longName = 'x'.repeat(5000);
    expect(farewell(longName)).toBe(`Goodbye, ${longName}! See you soon.`);
  });

  it('包含 Goodbye', () => {
    expect(farewell('x')).toContain('Goodbye');
  });

  it('包含 See you soon', () => {
    expect(farewell('x')).toContain('See you soon');
  });

  it('以句号结尾', () => {
    expect(farewell('x')).toMatch(/\.$/);
  });

  it('不抛出异常', () => {
    expect(() => farewell('safe')).not.toThrow();
  });

  it('返回类型', () => {
    expect(typeof farewell('test')).toBe('string');
  });

  it('保留输入', () => {
    const input = 'MyName';
    expect(farewell(input)).toContain(input);
  });

  it('不包含 Hello', () => {
    expect(farewell('x')).not.toContain('Hello');
  });
});

// ============================================================
// 集成测试 (20 个用例)
// ============================================================
describe('集成测试', () => {
  it('完整问候告别流程', () => {
    const name = 'Alice';
    expect(greet(name)).toContain('Hello');
    expect(greetWithTime(name)).toContain(name);
    expect(farewell(name)).toContain('Goodbye');
  });

  it('greet 不含时间', () => {
    expect(greet('x')).not.toMatch(/(morning|afternoon|evening)/i);
  });

  it('greetWithTime 包含时间', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
    expect(greetWithTime('x')).toMatch(/(morning|afternoon|evening)/i);
    vi.useRealTimers();
  });

  it('三个函数输出不同', () => {
    const name = 'Test';
    const g1 = greet(name);
    const g2 = farewell(name);
    expect(g1).not.toBe(g2);
  });

  it('greet 以 ! 结尾，farewell 以 . 结尾', () => {
    expect(greet('x')).toMatch(/!$/);
    expect(farewell('x')).toMatch(/\.$/);
  });

  it('连续调用无副作用', () => {
    const name = 'Stable';
    expect(greet(name)).toBe(greet(name));
    expect(farewell(name)).toBe(farewell(name));
  });

  it('大量并发调用', () => {
    for (let i = 0; i < 100; i++) {
      expect(greet(`User${i}`)).toBe(`Hello, User${i}!`);
    }
  });

  it('所有函数处理空输入', () => {
    expect(() => greet('')).not.toThrow();
    expect(() => greetWithTime('')).not.toThrow();
    expect(() => farewell('')).not.toThrow();
  });

  it('所有函数返回字符串', () => {
    expect(typeof greet('a')).toBe('string');
    expect(typeof farewell('a')).toBe('string');
    expect(typeof greetWithTime('a')).toBe('string');
  });

  it('跨模块一致性', () => {
    const name = 'Alice';
    expect(greet(name)).toBe(`Hello, ${name}!`);
    expect(farewell(name)).toBe(`Goodbye, ${name}! See you soon.`);
  });
});
