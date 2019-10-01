import test from "ava";
import { hintFor } from "../src/hint.mjs";
import { mergeVersions } from "../src/versions.mjs";

function hf(t, hints, path, result) {
  t.deepEqual(hintFor(hints, path), result);
}

hf.title = (providedTitle = "", a, b) =>
  `hintFor ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(hf, {}, undefined, {});
test(hf, undefined, "a", {});
test(hf, { a: { merge: mergeVersions } }, "a", { merge: mergeVersions });
test(hf, { a: { merge: mergeVersions } }, "b", {});
test(hf, { "a.b": { merge: mergeVersions } }, "a.b", {
  merge: mergeVersions
});

test(hf, { "*": { removeEmpty: true }, "a.b": { key: "a" } }, "a.b", {
  key: "a",
  removeEmpty: true
});
