import test from "ava";
import { reanimateHints, mergeVersions } from "hinted-tree-merger";

test("reanimateHints merge", t => {
  t.deepEqual(reanimateHints({ a: { merge: "mergeVersions" } }), {
    a: { merge: mergeVersions }
  });
});

test("reanimateHints orderBy regexp", t => {
  t.deepEqual(
    reanimateHints({ a: { orderBy: ["a", "/[A-Z]+$/i", "/\\d+/", 1] } }),
    {
      a: { orderBy: ["a", new RegExp(/[A-Z]+$/, "i"), new RegExp(/\d+/), 1] }
    }
  );
});
