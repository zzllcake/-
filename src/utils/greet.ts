/**
 * 返回问候语
 * @param name 要问候的名字
 * @returns 格式化的问候语
 */
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * 返回带时间的问候语
 * @param name 要问候的名字
 * @returns 带时间的问候语
 */
export function greetWithTime(name: string): string {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${greeting}, ${name}!`;
}
