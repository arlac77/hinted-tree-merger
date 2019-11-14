import test from "ava";
import { mergeArrays } from "../src/merger.mjs";

test("mergeTemplateFiles", t => {
  t.deepEqual(
    mergeArrays(
      [
        {
          merger: "Other",
          pattern: "a"
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
          merger: "Other",
          pattern: "b"
        },
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
        "": { key: ["merger", "pattern"] },
        "*.options.badges": {
          key: "name",
          compare: (a, b) => a.name.localeCompare(b.name)
        }
      }
    ),
    [
      {
        merger: "Other",
        pattern: "a"
      },
      {
        merger: "Other",
        pattern: "b"
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
