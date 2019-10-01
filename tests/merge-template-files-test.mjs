import test from "ava";
import { mergeArrays } from "../src/merger.mjs";

test("mergeArray", t => {
  t.deepEqual(
    mergeArrays(
      [{ key: 1, value: 1 }, { key: 2, value: 2, something: 5 }],
      [{ key: 2, value: 2, other: 4 }, { key: 3, value: 3 }],
      "",
      undefined,
      {
        "": {
          key: "key",
          sort: (a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : 0)
        }
      }
    ),
    [
      { key: 1, value: 1 },
      { key: 2, value: 2, something: 5, other: 4 },
      { key: 3, value: 3 }
    ]
  );
});

test("mergeTemplateFiles", t => {
  t.deepEqual(
    mergeArrays(
      [
        {
          merger: "Package",
          options: {
            badges: [
              {
                name: "npm0",
                icon: "https://img.shields.io/npm/v/{{name}}0.svg",
                url: "https://www.npmjs.com/package/{{name}}0"
              }
            ]
          }
        }
      ],
      [
        {
          merger: "Package",
          options: {
            badges: [
              {
                name: "npm1",
                icon: "https://img.shields.io/npm/v/{{name}}1.svg",
                url: "https://www.npmjs.com/package/{{name}}1"
              }
            ]
          }
        }
      ],
      "",
      undefined,
      {
        "": { key: "merger" },
        "[].options.badges": {
          key: "name",
          sort: (a, b) => a.name.localeCompare(b.name)
        }
      }
    ),
    [
      {
        merger: "Package",
        options: {
          badges: [
            {
              name: "npm0",
              icon: "https://img.shields.io/npm/v/{{name}}0.svg",
              url: "https://www.npmjs.com/package/{{name}}0"
            },
            {
              name: "npm1",
              icon: "https://img.shields.io/npm/v/{{name}}1.svg",
              url: "https://www.npmjs.com/package/{{name}}1"
            }
          ]
        }
      }
    ]
  );
});


test("mergeTemplateFiles slot only on one side", t => {
  t.deepEqual(
    mergeArrays(
      [
        {
          merger: "Package",
          options: {
            badges: [
              {
                name: "npm0",
                icon: "https://img.shields.io/npm/v/{{name}}0.svg",
                url: "https://www.npmjs.com/package/{{name}}0"
              }
            ]
          }
        }
      ],
      [
        {
          merger: "Package1",
          options: {
            badges: [
              {
                name: "npm1",
                icon: "https://img.shields.io/npm/v/{{name}}1.svg",
                url: "https://www.npmjs.com/package/{{name}}1"
              }
            ]
          }
        }
      ],
      "",
      undefined,
      {
        "": { key: "merger" },
        "[].options.badges": {
          key: "name",
          sort: (a, b) => a.name.localeCompare(b.name)
        }
      }
    ),
    [
      {
        merger: "Package",
        options: {
          badges: [
            {
              name: "npm0",
              icon: "https://img.shields.io/npm/v/{{name}}0.svg",
              url: "https://www.npmjs.com/package/{{name}}0"
            }
          ]
        }
      },
      {
        merger: "Package1",
        options: {
          badges: [
            {
              name: "npm1",
              icon: "https://img.shields.io/npm/v/{{name}}1.svg",
              url: "https://www.npmjs.com/package/{{name}}1"
            }
          ]
        }
      },
    ]
  );
});
