/**
 * 问候工具函数
 */

/**
 * 返回问候语
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * 返回带时间的问候语
 */
export function greetWithTime(name: string): string {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${greeting}, ${name}!`;
}

/**
 * 返回告别语
 */
export function farewell(name: string): string {
  return `Goodbye, ${name}! See you soon.`;
}
