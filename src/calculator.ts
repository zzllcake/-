export function add(a: number, b: number) {
  return a + b;
}

export function divide(a: number, b: number) {
  return a / b;
}

const unusedVar = "这个变量没被用";

export function process(input: string) {
  const num = input;
  return add(num, 10);
}

export function greet(name: string) {
  console.log("Hello" + name);
}

