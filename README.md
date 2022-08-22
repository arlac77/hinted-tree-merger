[![npm](https://img.shields.io/npm/v/hinted-tree-merger.svg)](https://www.npmjs.com/package/hinted-tree-merger)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Open Bundle](https://bundlejs.com/badge-light.svg)](https://bundlejs.com/?q=hinted-tree-merger)
[![downloads](http://img.shields.io/npm/dm/hinted-tree-merger.svg?style=flat-square)](https://npmjs.org/package/hinted-tree-merger)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/hinted-tree-merger.svg?style=flat-square)](https://github.com/arlac77/hinted-tree-merger/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fhinted-tree-merger%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/hinted-tree-merger/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/hinted-tree-merger/badge.svg)](https://snyk.io/test/github/arlac77/hinted-tree-merger)
[![Coverage Status](https://coveralls.io/repos/arlac77/hinted-tree-merger/badge.svg)](https://coveralls.io/github/arlac77/hinted-tree-merger)

# hinted-tree-merger

merges two trees guided with hints

# usage

### merge array having entries identified by key

```js
import { merge } from "hinted-tree-merger";

const r = merge(
        [{ k:1, e:1}, { k:2}],
        [{ k:1, e:2}, { k:3}], // 2nd. array has precedence
        "",
      undefined,
      {
        "": { key: "k" } // identify slots by property "k"
      });

  // r := [{ k:1 e:2 }, { k:2 }, { k:3 }]
```

### deep copy

```js
import { merge } from "hinted-tree-merger";

const r = merge( undefined, [ { k:1, e:2}, { k:3 }]);

  // r := [{ k:1 e:2 }, { k:2 }, { k:3 }]
```

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [hintFor](#hintfor)
    *   [Parameters](#parameters)
*   [mergeSkip](#mergeskip)
    *   [Parameters](#parameters-1)
*   [mergeArrays](#mergearrays)
    *   [Parameters](#parameters-2)
*   [merge](#merge)
    *   [Parameters](#parameters-3)
*   [hasDeleteHint](#hasdeletehint)
    *   [Parameters](#parameters-4)
*   [isToBeRemoved](#istoberemoved)
    *   [Parameters](#parameters-5)
*   [hintFreeValue](#hintfreevalue)
    *   [Parameters](#parameters-6)
*   [indexFor](#indexfor)
    *   [Parameters](#parameters-7)
*   [keyFor](#keyfor)
    *   [Parameters](#parameters-8)
*   [sortObjectsByKeys](#sortobjectsbykeys)
    *   [Parameters](#parameters-9)
*   [match](#match)
*   [compareVersion](#compareversion)
    *   [Parameters](#parameters-10)
*   [unionVersion](#unionversion)
    *   [Parameters](#parameters-11)
*   [VersionMapper](#versionmapper)
*   [mergeVersionsWithFilter](#mergeversionswithfilter)
    *   [Parameters](#parameters-12)
*   [mergeVersions](#mergeversions)
    *   [Parameters](#parameters-13)
*   [mergeVersionsPreferNumeric](#mergeversionsprefernumeric)
    *   [Parameters](#parameters-14)
*   [walk](#walk)
    *   [Parameters](#parameters-15)

## hintFor

Construct hint for a given path.

### Parameters

*   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

## mergeSkip

Skip merging use left side always.

### Parameters

*   `a` &#x20;
*   `b` &#x20;
*   `path` &#x20;
*   `actions` &#x20;
*   `hints` &#x20;

## mergeArrays

### Parameters

*   `a` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&#x20;
*   `b` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)**&#x20;
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `actions` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)**  (optional, default `nullAction`)
*   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

## merge

Merge to values.

### Parameters

*   `a` **any**&#x20;
*   `b` **any**&#x20;
*   `path` &#x20;
*   `actions` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>**  (optional, default `nullAction`)
*   `hints` **any**&#x20;

Returns **any** merged value

## hasDeleteHint

### Parameters

*   `value` **any**&#x20;
*   `expected` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))**&#x20;

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))**&#x20;

## isToBeRemoved

Should value be removed.

### Parameters

*   `value` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;
*   `fromTemplate` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** true if fromTemplate tells is to delete value

## hintFreeValue

Remove hint(s) form a value.

### Parameters

*   `value` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | any)**&#x20;

Returns **any** value without hint

## indexFor

Find best insertion point for b\[i] in a.

### Parameters

*   `b` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<any>**&#x20;
*   `i` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**&#x20;
*   `a` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<any>**&#x20;

## keyFor

Deliver key value to identify object.

### Parameters

*   `object` **any**&#x20;
*   `hint` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

## sortObjectsByKeys

Sort keys in source.

### Parameters

*   `source` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;
*   `compare` &#x20;

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** source with keys orderd by compare function

## match

url means highest version

## compareVersion

Compare two versions.

### Parameters

*   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))**&#x20;
*   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))**&#x20;

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** -1 if a < b, 0 if a == b and 1 if a > b

## unionVersion

Forms union of two versions.

### Parameters

*   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))**&#x20;
*   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))**&#x20;

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))**&#x20;

## VersionMapper

maps version values (to number)

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

## mergeVersionsWithFilter

Merge and filter two sets of version (expressions).

### Parameters

*   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)**&#x20;
*   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)**&#x20;
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** location in the tree
*   `actions` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** cb to notify about the actual selection (optional, default `nullAction`)
*   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;
*   `filter` **[VersionMapper](#versionmapper)**&#x20;

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** merged set of version expressions

## mergeVersions

merge two sets of version (expressions)

### Parameters

*   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)**&#x20;
*   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)**&#x20;
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** location in the tree
*   `actions` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** cb to notify about the actual selection
*   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** merged set of version expressions

## mergeVersionsPreferNumeric

Same as mergeVersions but merge result are converted into
numbers if possible

### Parameters

*   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)**&#x20;
*   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)**&#x20;
*   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** location in the tree
*   `actions` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** cb to notify about the actual selection
*   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**&#x20;

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** merged set of version expressions

## walk

Iterates over all members.

### Parameters

*   `value` **any**&#x20;
*   `path` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<any>**  (optional, default `[]`)
*   `parents`   (optional, default `[]`)

# install

With [npm](http://npmjs.org) do:

```shell
npm install hinted-tree-merger
```

# license

BSD-2-Clause
