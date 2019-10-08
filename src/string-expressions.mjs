export function mergeExpressions(a, b) {
  return b === undefined ? a : encodeExpressions(
    mergeDecodedExpressions(decodeExpressions(a), decodeExpressions(b))
  );
}

export function decodeExpressions(script) {
  if (script === undefined || script.match(/^\s*$/)) {
    return undefined;
  }

  let decoded;

  let overwrite = false;

  if (script === "-") {
    decoded = { op: "-" };
  } else {
    if (script.match(/^#overwrite/)) {
      script = script.replace(/^#overwrite\s+/, "");
      overwrite = true;
    }
    if (script.match(/&&/)) {
      decoded = {
        overwrite,
        op: "&&",
        args: script.split(/\s*&&\s*/)
      };
    } else {
      decoded = { value: script, overwrite };
    }
  }

  return decoded;
}

export function mergeDecodedExpressions(dest, source) {
  if (source === undefined) {
    if (dest === undefined) {
      return undefined;
    }
    source = {};
  } else if (dest === undefined) {
    dest = {};
  }

  function mergeOP(a, b) {
    const args = x => {
      if (x === undefined) return [];
      return x.args === undefined ? [x.value] : x.args;
    };

    const t = args(a).concat(args(b));

    return {
      op: "&&",
      args: t.filter((item, pos) => t.indexOf(item) == pos)
    };
  }

  if (dest !== undefined && dest.op === "-") {
    return;
  }

  switch (source.op) {
    case "-":
      return;

    case "&&":
      dest = source.overwrite ? s : mergeOP(source, dest);
      break;

    default:
      if (dest === undefined) {
        dest = { value: s.value };
      } else {
        switch (dest.op) {
          case "-":
            return;

          case "&&":
            dest = mergeOP(source, dest);
            break;

          default:
            dest.value = source.value;
        }
      }
  }

  return dest;
}

export function encodeExpressions(encoded) {
  if (encoded === undefined) {
    return undefined;
  }

  let script;

  switch (encoded.op) {
    case "&&":
      script = encoded.args.join(" && ");
      break;

    default:
      script = encoded.value;
  }

  return script;
}
