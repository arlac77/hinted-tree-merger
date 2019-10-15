

export function mergeExpressions(a, b) {
  if(a === undefined  && b === undefined) {
    return undefined;
  }

  const aa = decodeExpressions(a);
  const bb = decodeExpressions(b);

  //console.log(a, aa);
  //console.log(b, bb);
  return encodeExpressions(mergeDecodedExpressions(aa, bb));
}


export function decodeExpressions(script) {
  if (script === undefined || script.match(/^\s*$/)) {
    return { op: '', args: [] };
  }

  let overwrite = false;

  if (script === "-") {
    return { op: "-", args: [] };
  } else {
    if (script.match(/^#overwrite/)) {
      script = script.replace(/^#overwrite\s+/, "");
      overwrite = true;
    }
    if (script.match(/&&/)) {
      return {
        overwrite,
        op: "&&",
        args: script.split(/\s*&&\s*/)
      };
    } else {
      return { op: '', args: [script], overwrite };
    }
  }
}

function mergeOP(a, b) {
  const args = x => x === undefined ? [] : x.args;

  const t = args(a).concat(args(b));

  return {
    op: "&&",
    args: t.filter((item, pos) => t.indexOf(item) == pos)
  };
}

export function mergeDecodedExpressions(dest, source) {
  if (dest.op === "-") {
    return { op: '', args: [] };
  }

  switch (source.op) {
    case "-":
      return;

    case "&&":
      dest = source.overwrite ? s : mergeOP(source, dest);
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
            dest = mergeOP(source, dest);

 //         dest.args.push(...source.args);
      }
  }

  return dest;
}

export function encodeExpressions(encoded) {
  return encoded.args.join(encoded.op === '' ? '' : ' ' + encoded.op + ' ');
}
