[![npm](https://img.shields.io/npm/v/hinted-tree-merger.svg)](https://www.npmjs.com/package/hinted-tree-merger)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![minified size](https://badgen.net/bundlephobia/min/hinted-tree-merger)](https://bundlephobia.com/result?p=hinted-tree-merger)
[![downloads](http://img.shields.io/npm/dm/hinted-tree-merger.svg?style=flat-square)](https://npmjs.org/package/hinted-tree-merger)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/hinted-tree-merger.svg?style=flat-square)](https://github.com/arlac77/hinted-tree-merger/issues)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/hinted-tree-merger.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/hinted-tree-merger)
[![Build Status](https://secure.travis-ci.org/arlac77/hinted-tree-merger.png)](http://travis-ci.org/arlac77/hinted-tree-merger)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/hinted-tree-merger/badge.svg)](https://snyk.io/test/github/arlac77/hinted-tree-merger)

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

-   [mergeSkip](#mergeskip)
    -   [Parameters](#parameters)
-   [mergeArrays](#mergearrays)
    -   [Parameters](#parameters-1)
-   [merge](#merge)
    -   [Parameters](#parameters-2)
-   [MAX_SAFE_INTEGER](#max_safe_integer)
-   [compareVersion](#compareversion)
    -   [Parameters](#parameters-3)
-   [VersionMapper](#versionmapper)
-   [mergeVersionsWithFilter](#mergeversionswithfilter)
    -   [Parameters](#parameters-4)
-   [mergeVersions](#mergeversions)
    -   [Parameters](#parameters-5)
-   [mergeVersionsPreferNumeric](#mergeversionsprefernumeric)
    -   [Parameters](#parameters-6)
-   [hasDeleteHint](#hasdeletehint)
    -   [Parameters](#parameters-7)
-   [isToBeRemoved](#istoberemoved)
    -   [Parameters](#parameters-8)
-   [indexFor](#indexfor)
    -   [Parameters](#parameters-9)
-   [sortObjectsByKeys](#sortobjectsbykeys)
    -   [Parameters](#parameters-10)
-   [hintFor](#hintfor)
    -   [Parameters](#parameters-11)

## mergeSkip

Skip merging use left side

### Parameters

-   `a`  
-   `b`  
-   `path`  
-   `actions`  
-   `hints`  

## mergeArrays

### Parameters

-   `a` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 
-   `b` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `actions` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)**  (optional, default `nullAction`)
-   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## merge

merge to values

### Parameters

-   `a` **any** 
-   `b` **any** 
-   `path`  
-   `actions` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>**  (optional, default `nullAction`)
-   `hints` **any** 

Returns **any** merged value

## MAX_SAFE_INTEGER

url means highest version

## compareVersion

compare two versions

### Parameters

-   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 
-   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** \-1 if a &lt; b, 0 if a == b and 1 if a > b

## VersionMapper

maps version values (to number)

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

## mergeVersionsWithFilter

merge and filter two sets of version (expressions)

### Parameters

-   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** 
-   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** location in the tree
-   `actions` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** cb to notify about the actual selection (optional, default `nullAction`)
-   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `filter` **[VersionMapper](#versionmapper)** 

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** merged set of version expressions

## mergeVersions

merge two sets of version (expressions)

### Parameters

-   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** 
-   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** location in the tree
-   `actions` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** cb to notify about the actual selection
-   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** merged set of version expressions

## mergeVersionsPreferNumeric

Same as mergeVersions but merge result are converted into
numbers if possible

### Parameters

-   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** 
-   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** location in the tree
-   `actions` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** cb to notify about the actual selection
-   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) \| [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)>)** merged set of version expressions

## hasDeleteHint

### Parameters

-   `value` **any** 
-   `expected` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))** 

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean))** 

## isToBeRemoved

should value be removed

### Parameters

-   `value` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `fromTemplate` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** true if fromTemplate tells is to delete value

## indexFor

find best insertion point for b[i] in a

### Parameters

-   `b` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any>** 
-   `i` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `a` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any>** 

## sortObjectsByKeys

sort keys in source

### Parameters

-   `source` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `compare`  

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## hintFor

construct hint for a given path

### Parameters

-   `hints` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# install

With [npm](http://npmjs.org) do:

```shell
npm install hinted-tree-merger
```

# license

BSD-2-Clause
