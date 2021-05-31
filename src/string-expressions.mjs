import { nullAction } from "./util.mjs";
import { hintFor } from "./hint.mjs";

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
  let like = false;

  const m = script.match(/^--delete--\s*(.*)/);

  if (m && !hint.keepHints) {
    return { op: "-", args: m[1] };
  }

  if (script.match(/^--overwrite--/)) {
    if (!hint.keepHints) {
      script = script.replace(/^--overwrite--\s+/, "");
    }
    overwrite = true;
  }

  if (script.match(/^--like--/)) {
    if (!hint.keepHints) {
      script = script.replace(/^--like--\s+/, "");
    }
    like = true;
  }

  if (script.match(/&&/)) {
    return {
      like,
      overwrite,
      op: "&&",
      args: script.split(/\s*&&\s*/).map(v=>v.trim())
    };
  }
  return { op: "", args: [script.trim()], overwrite, like };
}

function mergeOP(a, b) {
  const args = x => (x === undefined ? [] : x.args);

  const t = args(a).concat(args(b));

  return {
    op: "&&",
    args: t.filter((item, pos) => t.indexOf(item) === pos)
  };
}

function mergeLIKE(a, b) {
  const args = x => (x === undefined ? [] : x.args);

  //const t = args(a).concat(args(b));
  const t="";
  console.log(args(b))

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

  if (source.like) {
    //dest = mergeLIKE(dest, source );
    return dest;
  }

  if (dest.like) {
    return source;
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
