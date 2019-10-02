import test from "ava";
import { merge, mergeVersionsPreferNumeric } from "../src/merger.mjs";

test("travis real merge", t => {
  const merged = merge(
    {
      language: "node_js",
      node_js: ["10.15.3", "11.11.0"],
      script: ["npm run cover"],
      branches: { only: ["master", "/^greenkeeper/.*$/"] },
      jobs: {
        include: [
          {
            stage: "docs",
            node_js: "lts/*",
            skip_cleanup: "true",
            script: [
              "npm install -g --production coveralls codecov",
              "npm run cover",
              "codecov",
              "cat ./coverage/lcov.info | coveralls",
              "npm run lint",
              "npm run docs"
            ]
          },
          {
            stage: "release",
            node_js: "lts/*",
            script: "skip",
            deploy: {
              provider: "script",
              skip_cleanup: "true",
              script: ["npx semantic-release"]
            }
          }
        ]
      }
    },
    {
      language: "node_js",
      node_js: ["-10", "-11", "10.15.3", "11.12.0"],
      script: ["npm run cover", "-npm run lint", "-npm run docs"],
      jobs: {
        include: [
          {
            stage: "docs",
            node_js: "lts/*",
            skip_cleanup: "true",
            script: [
              "-npm install -g --production coveralls codecov",
              "-cat ./coverage/lcov.info | coveralls",
              "npm install -g --production codecov",
              "npm run cover",
              "codecov",
              "npm run lint",
              "npm run docs"
            ]
          },
          {
            stage: "release",
            node_js: "lts/*",
            script: "skip",
            deploy: {
              provider: "script",
              skip_cleanup: "true",
              script: ["npx semantic-release"]
            }
          }
        ]
      },
      cache: "--delete-- npm",
      before_script: [
        "-npm prune",
        "-npm install -g --production coveralls codecov"
      ],
      after_script: ["-codecov", "-cat ./coverage/lcov.info | coveralls"],
      after_success: [
        '-npm run travis-deploy-once "npm run semantic-release"',
        "-npm run semantic-release"
      ],
      notifications: { email: ["-markus.felten@gmx.de"] }
    },
    undefined,
    undefined,
    {
      "*": { removeEmpty: true },
      "*node_js": { merge: mergeVersionsPreferNumeric },
      "jobs.include": {
        key: "stage"
      }
    }
  );

  //t.log(JSON.stringify(merged,undefined,2));

  t.deepEqual(merged, {
    language: "node_js",
    node_js: ["10.15.3", "11.12.0"],
    script: ["npm run cover"],
    branches: { only: ["master", "/^greenkeeper/.*$/"] },
    jobs: {
      include: [
        {
          stage: "docs",
          node_js: "lts/*",
          skip_cleanup: "true",
          script: [
            "npm install -g --production codecov",
            "npm run cover",
            "codecov",
            "npm run lint",
            "npm run docs"
          ]
        },
        {
          stage: "release",
          node_js: "lts/*",
          script: "skip",
          deploy: {
            provider: "script",
            skip_cleanup: "true",
            script: ["npx semantic-release"]
          }
        }
      ]
    }
  });
});
