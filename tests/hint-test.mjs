import test from "ava";
import { hintFor } from "../src/hint.mjs";

const merge = "merge";

function hf(t, hints, path, result) {
  t.deepEqual(hintFor(hints, path), result);
}

hf.title = (providedTitle = "", a, b) =>
  `hintFor ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(hf, {}, undefined, {});
test(hf, undefined, "a", {});
test(hf, { "*": { merge } }, "a", { merge });

test(hf, { "": { merge } }, "", { merge });
test(hf, { "": { merge } }, "a", {});

test(hf, { a: { merge } }, "a", { merge });
test(hf, { a: { merge } }, "b", {});
test(hf, { "a.b": { merge } }, "a.b", { merge });
test(hf, { "*b": { merge } }, "a.b", { merge });
test(hf, { "a.*": { merge } }, "a.b", { merge });
test(hf, { "a.*": { merge } }, "a", {});
test(hf, { "a.*": { merge } }, "c.b", {});
test(hf, { "*": { merge }, "a.b": { key: "a" } }, "a.b", {
  key: "a",
  merge
});
