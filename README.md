[![npm](https://img.shields.io/npm/v/hinted-tree-merger.svg)](https://www.npmjs.com/package/hinted-tree-merger)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/hinted-tree-merger.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/hinted-tree-merger)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://secure.travis-ci.org/arlac77/hinted-tree-merger.png)](http://travis-ci.org/arlac77/hinted-tree-merger)
[![codecov.io](http://codecov.io/github/arlac77/hinted-tree-merger/coverage.svg?branch=master)](http://codecov.io/github/arlac77/hinted-tree-merger?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/hinted-tree-merger/badge.svg)](https://snyk.io/test/github/arlac77/hinted-tree-merger)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/hinted-tree-merger.svg?style=flat-square)](https://github.com/arlac77/hinted-tree-merger/issues)
[![Dependency Status](https://david-dm.org/arlac77/hinted-tree-merger.svg)](https://david-dm.org/arlac77/hinted-tree-merger)
[![devDependency Status](https://david-dm.org/arlac77/hinted-tree-merger/dev-status.svg)](https://david-dm.org/arlac77/hinted-tree-merger#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/hinted-tree-merger.svg?branch=master)](http://inch-ci.org/github/arlac77/hinted-tree-merger)
[![downloads](http://img.shields.io/npm/dm/hinted-tree-merger.svg?style=flat-square)](https://npmjs.org/package/hinted-tree-merger)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# hinted-tree-merger

merges two trees guided with hints

# usage

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [mergeArrays](#mergearrays)
    -   [Parameters](#parameters)
-   [merge](#merge)
    -   [Parameters](#parameters-1)
-   [match](#match)
-   [compareVersion](#compareversion)
    -   [Parameters](#parameters-2)
-   [mergeVersionsWithFilter](#mergeversionswithfilter)
    -   [Parameters](#parameters-3)
-   [mergeVersionsPreferNumeric](#mergeversionsprefernumeric)
    -   [Parameters](#parameters-4)
-   [hasDeleteHint](#hasdeletehint)
    -   [Parameters](#parameters-5)
-   [isToBeRemoved](#istoberemoved)
    -   [Parameters](#parameters-6)
-   [indexFor](#indexfor)
    -   [Parameters](#parameters-7)
-   [hintFor](#hintfor)
    -   [Parameters](#parameters-8)

## mergeArrays

### Parameters

-   `a` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 
-   `b` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 
-   `path`  
-   `actions`   (optional, default `nullAction`)
-   `hints`  

## merge

merge to values

### Parameters

-   `a` **any** 
-   `b` **any** 
-   `path`  
-   `actions` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>**  (optional, default `nullAction`)
-   `hints` **any** 

Returns **any** merged value

## match

url means highest version

## compareVersion

compare two versions

### Parameters

-   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 
-   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 

Returns **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** \-1 if a &lt; b, 0 if a == b and 1 if a > b

## mergeVersionsWithFilter

### Parameters

-   `a` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 
-   `b` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))** 
-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `actions` **Action**  (optional, default `nullAction`)
-   `filter` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

## mergeVersionsPreferNumeric

Same as mergeVersions but merge result are numbers if possible

### Parameters

-   `a`  
-   `b`  
-   `path`  
-   `actions`  

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
