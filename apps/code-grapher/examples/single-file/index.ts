function addTen(n: number) {
  return add(n, 10);
}

function add(a: number, b: number) {
  return a + b;
}

function tenTimes(n: number) {
  return n * 10;
}

export function sample(n: number) {
  const n1 = addTen(n);
  const n2 = add(n1, 100);
  const n3 = tenTimes(n2);
  const n4 = n3 + 123;
  return n4;
}
