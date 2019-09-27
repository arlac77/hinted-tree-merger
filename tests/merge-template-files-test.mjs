import test from "ava";
import { mergeArrays } from "../src/merger.mjs";

test.skip("mergeTemplateFiles", t => {
  t.deepEqual(
    mergeArrays(
      [
        {
          merger: "Package",
          options: {
            badges: [
              {
                name: "npm",
                icon: "https://img.shields.io/npm/v/{{name}}.svg",
                url: "https://www.npmjs.com/package/{{name}}"
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
                icon: "https://img.shields.io/npm/v/{{name}}.svg",
                url: "https://www.npmjs.com/package/{{name}}"
              }
            ]
          }
        }
      ],
      {
        "": { key: "merger" },
        "options.badges": { key: "name" }
      }
    ),
    [
      {
        merger: "Package",
        options: {
          badges: [
            {
              name: "npm",
              icon: "https://img.shields.io/npm/v/{{name}}.svg",
              url: "https://www.npmjs.com/package/{{name}}"
            },
            {
              name: "npm1",
              icon: "https://img.shields.io/npm/v/{{name}}.svg",
              url: "https://www.npmjs.com/package/{{name}}"
            }
          ]
        }
      }
    ]
  );
});
