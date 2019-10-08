import test from "ava";
import {
  decodeExpressions,
  encodeExpressions,
  mergeExpressions
} from "../src/string-expressions.mjs";

function mset(t, a, b, r) {
  t.deepEqual(mergeExpressions(a, b), r);
}

mset.title = (providedTitle = "merge", a, b) =>
  `${providedTitle} ${a} ${b}`.trim();

test(mset, undefined, undefined, undefined);

test(mset, "a0", "a0", "a0");
test(mset, "a1", undefined, "a1");
//test(mset, "a2", '', "a2");
//test(mset, "a3", '  ', "a3");
test(mset, "a && b", "a", "a && b");


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
