import test from "ava";
import { merge, compare } from "hinted-tree-merger";

test("mergeTemplateFiles", t => {
  t.deepEqual(
    merge(
      {
        template: {
          files: [
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
          ]
        }
      },
      {
        dependencies: {
          other: "--delete--",
          rollup: "1.2.3"
        },
        template: {
          files: [
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
          ]
        }
      },
      "",
      undefined,
      {
        "dependencies" : { keepHints: true },
        "template.files": { key: ["merger", "pattern"] },
        "*.options.badges": {
          key: "name",
          compare
        }
      }
    ),
    {
      dependencies: {
        other: "--delete--",
        rollup: "1.2.3"
      },
      template: {
        files: [
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
      }
    }
  );
});
