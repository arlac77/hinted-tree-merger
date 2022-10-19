import test from "ava";
import { reanimateHints, mergeVersions } from "hinted-tree-merger";

test("reanimateHints", t => {
  t.deepEqual(reanimateHints({ a: { merge: "mergeVersions" } }), {
    a: { merge: mergeVersions }
  });
});
