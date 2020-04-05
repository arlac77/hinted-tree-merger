import test from "ava";
import { mergeExpressions } from "../src/string-expressions.mjs";

function mset(t, a, b, hints, r) {
  t.deepEqual(mergeExpressions(a, b, "", undefined, hints), r);
}

mset.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${a} ${b}`.trim();

test(mset, undefined, undefined, undefined);

test(mset, "a0", "a0", {}, "a0");
test(mset, "a1", undefined, {}, "a1");
test(mset, "a2", "", {}, "a2");
test(mset, "a3", "  ", {}, "a3");
test(mset, "a4", undefined, {}, "a4");

test(mset, "a&&b", "a", {}, "a && b");
test(mset, "a", "b", {}, "a && b");
test(mset, "a && b", "a && b", {}, "a && b");

test(
  mset,
  "documentation lint src/expander.mjs",
  "documentation lint src/expander.mjs",
  {},
  "documentation lint src/expander.mjs"
);

test(mset, "a", "--delete-- a", {}, "");
test("keepHints single", mset, "a", "--delete-- a", { "*": { keepHints: true } }, "a && --delete-- a");
test("keepHints several", mset, "a", "--delete-- a && --delete-- b", { "*": { keepHints: true } }, "--delete-- a && --delete-- b && a");
test("keepHints without value", mset, "a", "--delete--", { "*": { keepHints: true } }, "a && --delete--");

test(mset, "a && b", "--delete-- a", {}, "b");
test(mset, "a && b", "--delete-- b", {}, "a");
test(mset, "a && b", "--delete-- c", {}, "a && b");
test.skip(mset, "a && b", "--delete-- a && --delete-- b", {}, "");

test(mset, "ava", "#overwrite ava --timeout 2m", {}, "ava --timeout 2m");
test(mset, "ava --timeout 2m", "#overwrite ava --timeout 2m", {}, "ava --timeout 2m");

/*
test("package scripts decode/encode scripts &&", t => {
  const d = decodeScripts({
    a: "#overwrite xx && yy&&zz",
    b: "XXX YYY ZZZ"
  });

  t.deepEqual(d, {
    a: { overwrite: true, op: "&&", args: ["xx", "yy", "zz"] },
    b: { overwrite: false, value: "XXX YYY ZZZ" }
  });

  d.a.args[1] = "yy2";

  t.deepEqual(encodeScripts(d), {
    a: "xx && yy2 && zz",
    b: "XXX YYY ZZZ"
  });
});

test("package scripts merge scripts && no dups", t => {
  t.deepEqual(
    mergeScripts(
      decodeScripts({
        a: "xx && zz"
      }),
      decodeScripts({
        a: "xx && yy"
      })
    ),
    {
      a: { op: "&&", args: ["xx", "yy", "zz"] }
    }
  );
});

test("package scripts merge undefined", t => {
  let d1 = decodeScripts({
    a: "xx && yy"
  });

  t.deepEqual(mergeScripts(undefined, d1), {
    a: { op: "&&", args: ["xx", "yy"] }
  });

  d1 = decodeScripts({
    a: "xx && yy"
  });

  t.deepEqual(mergeScripts(d1, undefined), {
    a: { overwrite: false, op: "&&", args: ["xx", "yy"] }
  });
});

test("package scripts decode/merge/encode", t => {
  const d1 = decodeScripts({
    a: "xx && yy"
  });

  const d2 = decodeScripts({
    a: "xx"
  });

  t.deepEqual(mergeScripts(d1, d2), {
    a: { op: "&&", args: ["xx", "yy"] }
  });
});

test("package scripts decode/merge/encode overwrite", t => {
  const d1 = decodeScripts({
    a: "xx"
  });

  const d2 = decodeScripts({
    a: "#overwrite xxx"
  });

  t.deepEqual(mergeScripts(d1, d2), {
    a: { overwrite: false, value: "xxx" }
  });
});
*/
