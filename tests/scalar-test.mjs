import test from "ava";
import { isScalar } from "../src/util.mjs";

function sc(t, a) {
  t.true(isScalar(a));
}

sc.title = (providedTitle = "", a) =>
  `isScalar ${providedTitle} ${a && a.description ? "Symbol" : a}`.trim();

function nsc(t, a) {
  t.false(isScalar(a));
}

nsc.title = (providedTitle = "", a) => `isScalar ${providedTitle} ${a}`.trim();

test(sc, 1);
test(sc, 2n);
test(sc, "a");
test(sc, true);
test(sc, false);
test(sc, undefined);
test(sc, null);
test(sc, Symbol("a symbol"));
test(sc, a => {});
test(sc, console.log);

test(nsc, {});
test(nsc, []);
test(nsc, new Date());
test(nsc, new Set());
test(nsc, new Map());
