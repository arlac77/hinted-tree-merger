import test from "ava";
import { mergeArrays } from "../src/merger.mjs";

test("mergeArray", t => {
  t.deepEqual(
    mergeArrays(
      [{ key: 1, value: 1 }, { key: 2, value: 2, something: 5 }],
      [{ key: 2, value: 2, other: 4 }, { key: 3, value: 3 }],
      "",
      undefined,
      {
        "": {
          key: "key",
          sort: (a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : 0)
        }
      }
    ),
    [
      { key: 1, value: 1 },
      { key: 2, value: 2, something: 5, other: 4 },
      { key: 3, value: 3 }
    ]
  );
});
