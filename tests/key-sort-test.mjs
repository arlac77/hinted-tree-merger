import test from "ava";
import { merge } from "../src/merger.mjs";

function mt(t, a, b, r, hints, actions) {
  let myActions = [];
  t.is(
    JSON.stringify(merge(a, b, "", x => myActions.push(x), hints)),
    JSON.stringify(r)
  );

  if (actions !== undefined) {
    t.deepEqual(actions, myActions);
  }
}

mt.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(b)}`.trim();

test(
  mt,
  { a: 0, c: 0 },
  { a: 0, b: 0, c: 0 },
  { a: 0, b: 0, c: 0 },
  { "*": { compare: (a, b) => a.localeCompare(b) } }
);
