import test from "ava";
import { hasDeleteHint } from "../src/util.mjs";

function hdh(t, hints, path, result) {
  t.deepEqual(hasDeleteHint(hints, path), result);
}

hdh.title = (providedTitle = "", a, b) =>
  `hasDeleteHint ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(hdh, "--delete-- value", "value", "value");
test(hdh, "--delete--value", "value", "value");
test(hdh, "--delete--", "value", "");

test(hdh, " --delete-- value", "value", undefined);
test(hdh, 7, undefined, undefined);
test(hdh, [], undefined, undefined);


test(hdh, "-value", "value", "value");
test(hdh, "value", "value", undefined);
