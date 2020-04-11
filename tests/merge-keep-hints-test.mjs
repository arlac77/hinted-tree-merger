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
  [
    { remove: "x", path: "a" },
    { add: "--delete--", path: "a" }
  ],
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

test(
  mt,
  {
    depends: { systemd: ">=244.1", "nginx-mainline": ">=1.17.9" },
    dependes: { "nginx-mainline": ">=1.17.9" }
  },
  {
    depends: { "nginx-mainline": ">=1.17.9" },
    dependes: "--delete--"
  },
  [
    { remove: { "nginx-mainline": ">=1.17.9" }, path: "dependes" },
    { add: "--delete--", path: "dependes" }
  ],
  { "*": { keepHints: true } },
  {
    depends: { systemd: ">=244.1", "nginx-mainline": ">=1.17.9" },
    dependes: "--delete--"
  }
);
