import { nullAction } from "./util.mjs";
import { hintFor } from "./hint.mjs";

export function mergeExpressions(a, b, path, actions = nullAction, hints) {
  if (a === undefined && b === undefined) {
    return undefined;
  }

  const hint = hintFor(hints, path);

  const aa = decodeExpressions(a, hint);
  const bb = decodeExpressions(b, hint);

  /*console.log("AA",aa);
  console.log("BB",bb);
  console.log(mergeDecodedExpressions(aa, bb));
  */
  const r = encodeExpressions(mergeDecodedExpressions(aa, bb));

  if (r !== a) {
    actions({ add: r, path }, hint);
  }

  return r;
}

export function decodeExpressions(script, hint) {
  if (script === undefined || script.match(/^\s*$/)) {
    return { op: "", args: [] };
  }

  let overwrite = false;

  const m = script.match(/^--delete--\s*(.*)/);

  if (m && !hint.keepHints) {
    return { op: "-", args: m[1] };
  }

  if (script.match(/^#overwrite/)) {
    if (!hint.keepHints) {
      script = script.replace(/^#overwrite\s+/, "");
    }
    overwrite = true;
  }
  
  if (script.match(/&&/)) {
    return {
      overwrite,
      op: "&&",
      args: script.split(/\s*&&\s*/)
    };
  }
  return { op: "", args: [script], overwrite };
}

function mergeOP(a, b) {
  const args = x => (x === undefined ? [] : x.args);

  const t = args(a).concat(args(b));

  return {
    op: "&&",
    args: t.filter((item, pos) => t.indexOf(item) == pos)
  };
}

export function mergeDecodedExpressions(dest, source) {
  if (dest.op === "-") {
    return { op: "", args: [] };
  }

  switch (source.op) {
    case "-":
      return { op: dest.op, args: dest.args.filter(f => f !== source.args[0]) };

    case "&&":
      dest = source.overwrite ? source : mergeOP(source, dest);
      break;

    default:
      switch (dest.op) {
        case "-":
          return;

        /*
        case "&&":
          dest = mergeOP(source, dest);
          break;
*/
        default:
          dest = mergeOP(dest, source);
      }
  }

  return dest;
}

export function encodeExpressions(encoded) {
  return encoded.args.join(encoded.op === "" ? "" : " " + encoded.op + " ");
}
