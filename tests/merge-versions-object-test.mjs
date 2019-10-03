import test from "ava";

import { mergeVersionsObject } from "../src/versions.mjs";

function mv(t, a, b, c, ea) {
  const actions = [];
  t.deepEqual(mergeVersionsObject(a, b, undefined, x => actions.push(x)), c);
  if (ea !== undefined) {
    t.deepEqual(actions, ea, "actions");
  }
}

mv.title = (providedTitle = "", a, b, c) =>
  `merge version ${providedTitle} ${c} := ${JSON.stringify(
    a
  )} << ${JSON.stringify(b)}`.trim();

test(mv, {}, {}, {}, []);
test(mv, {}, undefined, {}, []);
test(mv, undefined, undefined, undefined, []);

test.skip(mv, {}, { a: 1 }, { a: 1 }, [{ add: { a: 1 } }]);

test.skip(
  mv,
  {
    a: "1",
    b: "1",
    e: "2"
  },
  {
    a: "--delete--",
    c: "1",
    d: "--delete--",
    e: "1"
  },
  { b: "1", c: "1", e: "2" },
  []
);
