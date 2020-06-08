import test from "ava";
import { hintFor } from "../src/hint.mjs";

const merge = "merge";

function hft(t, hints, path, result) {
  t.deepEqual(hintFor(hints, path), result);
}

hft.title = (providedTitle = "", a, b) =>
  `hintFor ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(hft, {}, undefined, {});
test(hft, undefined, "a", {});
test(hft, { "*": { merge } }, "a", { merge });

test(hft, { "": { merge } }, "", { merge });
test(hft, { "": { merge } }, "a", {});

test(hft, { "*": { keepHints: true } }, "[1]", { keepHints: true });


test(hft, { a: { merge } }, "a", { merge });
test(hft, { a: { merge } }, "b", {});
test(hft, { "a.b": { merge } }, "a.b", { merge });
test(hft, { "*b": { merge } }, "a.b", { merge });
test(hft, { "a.*": { merge } }, "a.b", { merge });
test(hft, { "a.*": { merge } }, "a", {});
test(hft, { "a.*": { merge } }, "c.b", {});
test(hft, { "*": { merge }, "a.b": { key: "a" } }, "a.b", {
  key: "a",
  merge
});

test(
  hft,
  // order of entries matters !!
  {
    "*": { type: "chore", scope: "package" },
    "dependencies.*": { type: "fix", extra: true }
  },
  "dependencies.b",
  {
    extra: true,
    scope: "package",
    type: "fix"
  }
);
