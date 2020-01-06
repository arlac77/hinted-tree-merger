import test from "ava";
import { merge } from "../src/merger.mjs";
import { mergeVersionsLargest } from "../src/versions.mjs";

function mv(t, a, b, c, ea) {
  const actions = [];
  t.deepEqual(
    merge(
      a,
      b,
      undefined,
      (action, hint) => {
        if (hint && hint.type) {
          action.type = hint.type;
        }
        actions.push(action);
      },
      {
        "*": {
          merge: mergeVersionsLargest,
          type: 'chore'
        }
      }
    ),
    c
  );
  if (ea !== undefined) {
    t.deepEqual(actions, ea, "actions");
  }
}

mv.title = (providedTitle = "", a, b, c) =>
  `merge version ${providedTitle} ${JSON.stringify(c)} := ${JSON.stringify(
    a
  )} << ${JSON.stringify(b)}`.trim();

test(mv, {}, {}, {}, []);
test(mv, {}, undefined, {}, []);
test(mv, undefined, undefined, undefined, []);
test(mv, {}, { a: 1 }, { a: 1 }, [{ add: 1, path: "a", type: "chore" }]);

test(
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
  [
    { remove: "1", path: "a", type: "chore" },
    { add: "1", path: "c", type: "chore" }
  ]
);
