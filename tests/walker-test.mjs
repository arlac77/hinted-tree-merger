import test from "ava";
import { walk } from "../src/walker.mjs";

function wt(t, a, b) {
  const walked = [...walk(a)];
  t.deepEqual(walked, b);
}

wt.title = (providedTitle = "", a) =>
  `walk ${providedTitle} ${a && a.description ? "Symbol" : a}`.trim();

test(wt, 1, [{ value: 1, path: [], parents: [] }]);
test(wt, 2n, [{ value: 2n, path: [], parents: [] }]);
test(wt, "a", [{ value: "a", path: [], parents: [] }]);
test(wt, true, [{ value: true, path: [], parents: [] }]);
test(wt, undefined, [{ value: undefined, path: [], parents: [] }]);

const value1 = [3];
test(wt, value1, [
  { value: [3], path: [], parents: [] },
  { value: 3, path: [0], parents: [value1] }
]);

const value2 = [3, 4];
test(wt, value2, [
  { value: [3, 4], path: [], parents: [] },
  { value: 3, path: [0], parents: [value2] },
  { value: 4, path: [1], parents: [value2] }
]);

const value3 = [3, [4, 5]];
test(wt, value3, [
  { value: [3, [4, 5]], path: [], parents: [] },
  { value: 3, path: [0], parents: [value3] },
  { value: [4, 5], path: [1], parents: [value3] },
  { value: 4, path: [1, 0], parents: [value3, value3[1]] },
  { value: 5, path: [1, 1], parents: [value3, value3[1]] }
]);

const value4 = { a: 1 };
test(wt, value4, [
  { value: { a: 1 }, path: [], parents: [] },
  { value: 1, path: ["a"], parents: [value4] }
]);

const value5 = { a: 1, b: { c: 2 } };
test.only("object nested", wt, value5, [
  { value: value5, path: [], parents: [] },
  { value: 1, path: ["a"], parents: [value5] },
  { value: { c: 2 }, path: ["b"], parents: [value5] },
  { value: 2, path: ["b", "c"], parents: [value5,value5.b] }
]);
