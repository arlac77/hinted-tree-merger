import test from "ava";

import { mergeObjectValueVersions } from "../src/versions.mjs";

function mv(t, a, b, c, ea) {
  const actions = [];
  t.deepEqual(mergeObjectValueVersions(a, b, actions), c);

  if (ea !== undefined) {
    t.deepEqual(actions, ea, "actions");
  }
}

mv.title = (providedTitle = "", a, b, c) =>
  `merge version ${providedTitle} ${JSON.stringify(c)} := ${JSON.stringify(a)} << ${JSON.stringify(b)}`.trim();

test(mv, {}, {}, {}, []);
test.skip(mv, {}, { a: 1 }, { a: 1 }, [{ add: { a: 1 } }]);
