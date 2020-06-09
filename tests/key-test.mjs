import test from "ava";
import { keyFor } from "../src/util.mjs";

function kft(t, object, hint, expected) {
  t.is(keyFor(object, hint), expected);
}

kft.title = (providedTitle = "", object, hint, expected) =>
  `keyFor ${providedTitle} ${JSON.stringify(object)} ${JSON.stringify(hint)}`.trim();


test(kft, {}, undefined, undefined);
test(kft, { k: "v" }, { key: "a" }, "v");
