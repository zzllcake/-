/**
 * 应用程序入口
 */
import { greet } from './utils/greet.js';

const message = greet('World');
console.log(message);

export { greet };
