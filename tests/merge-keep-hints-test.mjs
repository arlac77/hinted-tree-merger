import test from "ava";
import { merge } from "../src/merger.mjs";

function mt(t, a, b, actions, hints, r) {
  let myActions = [];
  t.deepEqual(
    merge(a, b, undefined, x => myActions.push(x), hints),
    r
  );
  if (actions !== undefined) {
    t.deepEqual(actions, myActions);
  }
}

mt.title = (providedTitle = "merge keep hints", a, b) =>
  `${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(b)}`.trim();

test(
  mt,
  { a: "x", b: "y" },
  { a: "--delete--" },
  [{ add: "--delete--", path: "a" }],
  { "*": { keepHints: true } },
  { a: "--delete--", b: "y" }
);

test(
  mt,
  {},
  { a: "--delete--" },
  [{ add: "--delete--", path: "a" }],
  { "*": { keepHints: true } },
  { a: "--delete--" }
);
