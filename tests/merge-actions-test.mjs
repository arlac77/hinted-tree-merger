import test from "ava";
import { merge, mergeVersionsPreferNumeric } from "hinted-tree-merger";

test("travis merge", t => {
  const merged = merge(
    {
      name: "API to readme",
      on: {
        schedule: [{ cron: "31 14 * * *" }]
      },
      jobs: {
        update_readme_api: {
          "runs-on": "ubuntu-latest"
        },
        steps: [
          { name: "chekout", uses: "actions/checkout@v2" },
          { name: "doc", uses: "actions/setup-node@v1" },
          { name: "install", run: "npm install" }
        ]
      }
    },
    {
      name: "API to readme",
      on: {
        schedule: [{ cron: "31 14 * * *" }]
      },
      jobs: {
        update_readme_api: {
          "runs-on": "ubuntu-latest"
        },
        steps: [
          {
            name: "doc",
            uses: "actions/setup-node@v1",
            with: { "node-version": "14.4.0" }
          }
        ]
      }
    },
    undefined,
    undefined,
    {
      "*": {
        removeEmpty: true
      },
      "*.node-version": {
        merge: mergeVersionsPreferNumeric
      },
      "*.steps": {
        key: "name"
      }
    }
  );

 // console.log(JSON.stringify(merged, undefined, 2));

  t.deepEqual(merged, {
    name: "API to readme",
    on: {
      schedule: [{ cron: "31 14 * * *" }]
    },
    jobs: {
      update_readme_api: {
        "runs-on": "ubuntu-latest"
      },
      steps: [
        { name: "chekout", uses: "actions/checkout@v2" },
        {
          name: "doc",
          uses: "actions/setup-node@v1",
          with: { "node-version": "14.4.0" }
        },
        { name: "install", run: "npm install" }
      ]
    }
  });
});

/*
name: API to readme
'on':
  schedule:
    - cron: 31 14 * * *
jobs:
  update_readme_api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: doc
        uses: actions/setup-node@v1
        with:
          node-version: 14.3.0
      - name: doc
        uses: actions/setup-node@v1
        with:
          node-version:
            - '-10'
            - '-11'
            - '-12'
            - '-13'
            - '-14'
            - 14.4.0
      - run: npm install
      - run: npm run docs
      - uses: gr2m/create-or-update-pull-request-action@v1.x
        env:
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}'
        with:
          path: README.md
          title: API
          branch: readme-api
          commit-message: 'docs(README): sync API'
      - uses: gr2m/create-or-update-pull-request-action@v1.x
        env:
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}'
        with:
          path: README.md
          title: Sync API into README
          branch: readme-api
          commit-message: 'docs(README): sync API'
*/
