import test from "ava";
import { merge } from "hinted-tree-merger";

function mt(t, a, b, actions, hints, r) {
  let myActions = [];
  t.deepEqual(
    merge(a, b, undefined, x => myActions.push(x), hints),
    r
  );
  if (actions !== undefined) {
    t.deepEqual(actions, myActions, "actions");
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
  new Set(["a"]),
  new Set(["--delete-- b","-c"]),
  [{ add: "--delete-- b", path: "[1]" },{ add: "-c", path: "[2]" }],
  { "*": { keepHints: true } },
  new Set(["a", "--delete-- b","-c"])
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
