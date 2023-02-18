import test from "ava";
import { merge, mergeVersionsLargest } from "hinted-tree-merger";

function mv(t, a, b, c, ea, hints) {
  const actions = [];
  t.deepEqual(
    merge(
      a,
      b,
      undefined,
      (action, hint) => {
        if (hint?.type) {
          action.type = hint.type;
        }
        actions.push(action);
      },
      {
        "*": {
          merge: mergeVersionsLargest,
          type: "chore"
        },
        ...hints
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
  { systemd: ">=244.1" },
  { systemd: ">=244.2" },
  { systemd: ">=244.2" },
  [
    { remove: ">=244.1", path: "systemd", type: "chore" },
    { add: ">=244.2", path: "systemd", type: "chore" }
  ]
);

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

test(
  mv,
  {
    a: "1",
    b: "1"
  },
  {
    a: "--delete--",
    c: "1"
  },
  { a: "--delete--", b: "1", c: "1" },
  [
    { remove: "1", path: "a", type: "chore" },
    { add: "--delete--", path: "a", type: "chore" },
    { add: "1", path: "c", type: "chore" }
  ],
  { "*": { keepHints: true, merge: mergeVersionsLargest, type: "chore" } }
);
