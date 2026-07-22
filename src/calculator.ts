export function add(a: number, b: number) {
  return a + b;
}

export function divide(a: number, b: number) {
  return a / b;
}

export function process(input: string) {
  const num = Number(input);
  return add(num, 10);
}

export function greet(name: string) {
  console.log(`Hello ${name}`);
}
