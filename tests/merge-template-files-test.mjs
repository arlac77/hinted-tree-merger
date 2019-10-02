import test from "ava";
import { mergeArrays } from "../src/merger.mjs";

test("mergeTemplateFiles", t => {
  t.deepEqual(
    mergeArrays(
      [
        {
          merger: "Other",
        },
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
        "*.options.badges": {
          key: "name",
          sort: (a, b) => a.name.localeCompare(b.name)
        }
      }
    ),
    [
      {
        merger: "Other",
      },
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
