import test from "ava";
import { isEmpty } from "../src/util.mjs";

function em(t, a) {
  t.true(isEmpty(a));
}

em.title = (providedTitle = "", a) =>
  `isEmpty ${providedTitle} ${a && a.description ? "Symbol" : a}`.trim();

function nem(t, a) {
  t.false(isEmpty(a));
}

nem.title = (providedTitle = "", a) =>
  `not isEmpty ${providedTitle} ${a && a.description ? "Symbol" : a}`.trim();

test(nem, 1);
test(nem, 2n);
test(nem, "a");
test(nem, true);
test(nem, false);
test(nem, { a: 1 });
test(nem, [3]);
test(nem, new Set(["a"]));
test(nem, new Map([["a", 1]]));
test(nem, Symbol("a symbol"));
test(nem, a => {});
test(nem, console.log);
test(nem, new Date());

test(em, undefined);
test(em, null);
test("string", em, "");
test(em, {});
test(em, []);
test(em, new Set());
test(em, new Map());
