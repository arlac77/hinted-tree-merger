import test from "ava";
import { merge } from "../src/merger.mjs";

function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function mt(t, a, b, r, hints, actions) {
  const myActions = [];
  t.is(
    JSON.stringify(merge(a, b, "", x => myActions.push(x), hints)),
    JSON.stringify(r)
  );

  if (actions !== undefined) {
    t.deepEqual(actions, myActions);
  }
}

mt.title = (providedTitle = "merge", a, b, r, hints) =>
  `${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(b)} ${JSON.stringify(
    hints
  )}`.trim();

test(
  mt,
  { a: 0, c: { a: 0, b: 0 } },
  { a: 0, b: 0, c: { a: 0, c: 0, b: 0 } },
  { a: 0, b: 0, c: { a: 0, b: 0, c: 0 } },
  { "*": { compare } }
);

test(
  "sort root only",
  mt,
  { a: 0, c: { a: 0, b: 0 } },
  { a: 0, b: 0, c: { c: 0, b: 0, a: 0 } },
  { a: 0, b: 0, c: { a: 0, b: 0, c: 0 } },
  { "": { compare } }
);
