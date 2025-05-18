import { add } from "./add";
import { addTen } from "./addTen";
import { tenTimes } from "./tenTimes";
export function sample(n) {
    const n1 = addTen(n);
    const n2 = add(n1, 100);
    const n3 = tenTimes(n2);
    const n4 = n3 + 123;
    return n4;
}
//# sourceMappingURL=index.js.map