import test from "ava";
import { hasDeleteHint } from "../src/util.mjs";

function hdh(t, value, expected, result) {
  t.is(hasDeleteHint(value, expected), result);
}

hdh.title = (providedTitle = "", a, b) =>
  `hasDeleteHint ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();


test(hdh, "--delete--", undefined, true);
test(hdh, "--delete--", 1, true);

test(hdh, "--delete-- value", "value", true);
test(hdh, "--delete-- value", undefined, true);
test(hdh, "--delete--value", "value", true);

test(hdh, "--delete--1", 1, true);
test(hdh, "--delete-- 1", 1, true);
test(hdh, "--delete--2", 2n, true);
test(hdh, "--delete-- 2", 2n, true);
test(hdh, "--delete--a b c", "a b c", true);
test(hdh, "--delete-- a b c", "a b c", true);

test(hdh, " --delete-- value", "value", false);

test(hdh, 7, undefined, false);
test(hdh, 7, "value", false);
test(hdh, [], undefined, false);
test(hdh, [], "value", false);
test(hdh, {}, undefined, false);
test(hdh, {}, "value", false);

test(hdh, "-value", "value", "value");
test(hdh, "value", "value", false);