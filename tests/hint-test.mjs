import test from "ava";
import { hintFor } from "../src/hint.mjs";
import { mergeVersions } from "../src/versions.mjs";

function hf(t, hints, path, result) {
  t.deepEqual(hintFor(hints, path), result);
}

hf.title = (providedTitle = "", a, b) =>
  `hintFor ${providedTitle} ${a} ${b}`.trim();

test(hf, {}, undefined, undefined);
test(hf, undefined, "a", undefined);
test(hf, { a: mergeVersions }, "a", mergeVersions);
test(hf, { a: mergeVersions }, "b", undefined);

test(hf, { "a.b": mergeVersions }, "a.b", mergeVersions);

/*
'B'
'B[1].C'
test(hf, { "b": mergeVersions }, ["a", "b"], mergeVersions);
*/
