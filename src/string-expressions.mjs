import { nullAction } from "./util.mjs";
import { hintFor, DELETE_HINT_REGEX, OVERWRITE_HINT_REGEX } from "./hint.mjs";

export function mergeExpressions(a, b, path, actions = nullAction, hints) {
  if (a === undefined && b === undefined) {
    return undefined;
  }

  const hint = hintFor(hints, path);

  const aa = decodeExpressions(a, hint);
  const bb = decodeExpressions(b, hint);

  /*
  console.log("AA",aa);
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

  const m = script.match(DELETE_HINT_REGEX);

  if (m && !hint.keepHints) {
    return { op: "-", args: m[1] };
  }

  if (script.match(OVERWRITE_HINT_REGEX)) {
    if (!hint.keepHints) {
      script = script.replace(OVERWRITE_HINT_REGEX, "");
    }
    overwrite = true;
  }

  if (script.match(/&&/)) {
    return {
      overwrite,
      op: "&&",
      args: script.split(/\s*&&\s*/).map(v=>v.trim())
    };
  }
  return { op: "", args: [script.trim()], overwrite };
}

function mergeOP(a, b) {
  const args = x => (x === undefined ? [] : x.args);

  const t = args(a).concat(args(b));

  return {
    op: "&&",
    args: t.filter((item, pos) => t.indexOf(item) === pos)
  };
}

export function mergeDecodedExpressions(dest, source) {
  if (dest.op === "-") {
    return { op: "", args: [] };
  }

  if (source.overwrite) {
    return source;
  }

  if (dest.overwrite) {
    return dest;
  }

  switch (source.op) {
    case "-":
      return { op: dest.op, args: dest.args.filter(f => f !== source.args[0]) };

    case "&&":
      dest = mergeOP(source, dest);
      break;

    default:
      switch (dest.op) {
        case "-":
          return;

        default:
          dest = mergeOP(dest, source);
      }
  }

  return dest;
}

export function encodeExpressions(encoded) {
  return encoded.args.join(encoded.op === "" ? "" : " " + encoded.op + " ");
}
