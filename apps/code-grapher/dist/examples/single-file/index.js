function addTen(n) {
    return add(n, 10);
}
function add(a, b) {
    return a + b;
}
function tenTimes(n) {
    return n * 10;
}
export function sample(n) {
    const n1 = addTen(n);
    const n2 = add(n1, 100);
    const n3 = tenTimes(n2);
    const n4 = n3 + 123;
    return n4;
}
//# sourceMappingURL=index.js.map