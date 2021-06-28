import test from "ava";
import { keyFor } from "../src/util.mjs";

function kft(t, object, hint, expected) {
  t.is(keyFor(object, hint), expected);
}

kft.title = (providedTitle = "", object, hint, expected) =>
  `keyFor ${providedTitle} ${JSON.stringify(object)} ${JSON.stringify(
    hint
  )}`.trim();

test(kft, {}, undefined, undefined);
test(kft, { x: "v" }, { key: "k" }, undefined);
test(kft, { k: "v" }, { key: "k" }, "v");

test(
  kft,
  { k1: "v1", k2: "v2", k3: "v3" },
  { key: ["k1", "k2", "k3"] },
  "v1:v2:v3"
);
test(kft, { k1: "v1", k3: "v3" }, { key: ["k1", "k2", "k3"] }, "v1::v3");
test(kft, { k1: "v1", k3: "v3" }, { key: ["k1"] }, "v1");

test(kft, { k1: "v1", k2: "v2", k3: "v3" }, { key: "k1&k2&k3" }, "v1:v2:v3");
test(kft, { k1: "v1", k3: "v3" }, { key: "k1&k2&k3" }, "v1::v3");

test(kft, { k1: "v1", k2: "v2", k3: "v3" }, { key: "k1|k2|k3" }, "v1");
test(kft, { k2: "v2", k3: "v3" }, { key: "k1|k2|k3" }, "v2");

test(
  kft,
  {
    uses: "gr2m/create-or-update-pull-request-action@v1.x",
    with: {
      path: "README.md",
      title: "Sync API into README"
    }
  },
  { key: "id|name|uses|run" },
  "gr2m/create-or-update-pull-request-action@v1.x"
);

test(
  kft,
  {
    uses: "gr2m/create-or-update-pull-request-action@v1.x",
    with: {
      path: "README.md",
      title: "Sync API into README"
    }
  },
  { key: "id|name|uses|run", normalizeValue: "@.*" },
  "gr2m/create-or-update-pull-request-action"
);
