import test from "ava";
import { removeHintedValues } from "../src/util.mjs";

function rhv(t, a, b) {
  t.deepEqual(removeHintedValues(a), b);
}

rhv.title = (providedTitle = "", a) =>
  `removeHintedValues ${providedTitle} ${
    a && a.description ? "Symbol" : a
  }`.trim();

test(rhv, 1, 1);
test(rhv, 2n, 2n);
test(rhv, "a", "a");
test(rhv, true, true);
test(rhv, false, false);
test(rhv, undefined, undefined);
test(rhv, null, null);

const s = Symbol("a symbol");
test(rhv, s, s);

test(rhv, {}, {});
test(rhv, [], []);

test(rhv, new Date(), new Date());
test(rhv, new Set(), new Set());
test(rhv, new Map(), new Map());


test(rhv, "--delete-- a", undefined);
test(rhv, [1,"--delete-- a"], [1]);
