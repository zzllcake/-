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
  let greeting: string;
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  return `${greeting}, ${name}!`;
}

/**
 * 返回告别语
 */
export function farewell(name: string): string {
  return `Goodbye, ${name}! See you soon.`;
}
