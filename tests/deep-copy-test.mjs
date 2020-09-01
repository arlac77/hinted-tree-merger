import test from "ava";
import { deepCopy } from "../src/util.mjs";

function dct(t, a) {
  t.deepEqual(deepCopy(a), a);
}

dct.title = (providedTitle = "", a) =>
  `deepCopy ${providedTitle} ${
    a && a.description
      ? "Symbol"
      : typeof a === "bigint"
      ? a
      : JSON.stringify(a)
  }`.trim();

test(dct, 1);
test(dct, 2n);
test(dct, "a");
test(dct, true);
test(dct, false);
//test(dct, undefined);
test(dct, null);
test(dct, Symbol("a symbol"));
test(dct, a => {});
//test(dct, console.log);

test(dct, {});
test(dct, { a: "1" });
test(dct, { a: "" });
