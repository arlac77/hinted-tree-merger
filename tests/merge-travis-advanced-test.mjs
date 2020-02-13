import test from "ava";
import { merge, mergeVersionsPreferNumeric } from "../src/merger.mjs";

test("travis merge", t => {
  const merged = merge(
    {
      jobs: {
        include: [
          {
            stage: "test",
            node_js: ["13.8.0", "-13"]
          }
        ]
      }
    },
    {
      jobs: {
        include: [
          {
            stage: "test",
            //node_js: ["-13"],
            script: ["npm run cover", "npx codecov"]
          }
        ]
      }
    },
    undefined,
    undefined,
    {
      "*": { scope: "travis", removeEmpty: true },
      "*node_js": { merge: mergeVersionsPreferNumeric },
      "jobs.include": {
        key: "stage",
        orderBy: ["test", "doc", "release"]
      }
    }
  );

  t.deepEqual(merged, {
    jobs: {
      include: [
        {
          stage: "test",
          node_js: ["13.8.0"],
          script: ["npm run cover", "npx codecov"]
        }
      ]
    }
  });
});
