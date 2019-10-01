import test from "ava";

import { indexFor } from "../src/util.mjs";

function ifr(t, a, b, c, r) {
  t.is(indexFor(a, b, c), r);
}

ifr.title = (providedTitle = "", a, b, c) =>
  `equal ${providedTitle} ${JSON.stringify(a)} ${b} ${JSON.stringify(c)}`.trim();

test(ifr, ["a", "bb", "c"], 1, ["a", "b", "c"], 2);
test(ifr, ["a", "bb", "c"], 1, ["a", "b", "c1"], 3);
