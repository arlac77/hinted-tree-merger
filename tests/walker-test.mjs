import test from "ava";
import { walk } from "../src/walker.mjs";

function wt(t, a, b) {
  const walked = [];

  for (const m of walk(a)) {
    walked.push(m);
  }

  t.deepEqual(walked, b);
}

wt.title = (providedTitle = "", a) =>
  `walk ${providedTitle} ${a && a.description ? "Symbol" : a}`.trim();

test(wt, 1, [{ value: 1, path: [] }]);
test(wt, 2n, [{ value: 2n, path: [] }]);
test(wt, "a", [{ value: "a", path: [] }]);
test(wt, true, [{ value: true, path: [] }]);
test(wt, undefined, [{ value: undefined, path: [] }]);
test(wt, [3], [{ value: [3], path: [] }, { value: 3, path: [0] }]);
test(
  wt,
  [3, 4],
  [
    { value: [3, 4], path: [] },
    { value: 3, path: [0] },
    { value: 4, path: [1] }
  ]
);
test(
  wt,
  [3, [4, 5]],
  [
    { value: [3, [4, 5]], path: [] },
    { value: 3, path: [0] },
    { value: [4, 5], path: [1] },
    { value: 4, path: [1, 0] },
    { value: 5, path: [1, 1] }
  ]
);

test(wt, { a: 1 }, [{ value: { a: 1 }, path: [] }, { value: 1, path: ["a"] }]);
test("object nested", wt, { a: 1, b: { c: 2 } }, [
  { value: { a: 1, b: { c: 2 } }, path: [] },
  { value: 1, path: ["a"] },
  { value: { c: 2 }, path: ["b"] },
  { value: 2, path: ["b", "c"] }
]);
