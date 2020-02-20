# deep-merge-test

Find the deep merge tool you need!

## What it is

This is a test bed for testing js methods, tools and utilities that execute deep merge of objects.
Deep merge is a costly and non-trivial operation, which can differ in implementation depending on the tool used, e.g. inherited and non-enumerable properties may or may not be copied to new object, etc.
A number of pre-defined tests are rigged up to test different aspects of deep merge operation by comparing original and new objects. Test suite it executed dy Jest.
This way you can see the difference between the tools and choose the one that you need depending on the situation, or add any other tool to the test and check how it compares.

## Usage

1. Clone this repository and run `npm install` to install dependencies.

Or install it via npm.
`npm install --save-dev`

2. Run `npm test` in this repository.

   TIP: if you installed this package with npm, you can use npm explore command to run test from parent directory without changing directory.
   `npm explore deep-merge-test -- test]`

3. You can see the results in console (not very convenient since there are too many), or in HTML form in `tmp/reporters/jest-stare` directory (obtained by jest-stare reporter). Or use a reporter of your choice.

## Tools pre-configured for testing

- Object.assign (vanilla JS method)
- jquery.extend
- lodash.merge'
- lodash.assign'
- lodash.defaults'
- deep-extend
- webpack-merge
- nested-config
- defaults(npm package)
- merge-options
- deepmerge

### Add your own tools and tests

Install your tool as devDependency
Manually edit merge.test.js - import your tool and include it in mergersSetup configuration object. Test suite will pick it up. You can also write your custom tests of course, PR's are welcome.

## Features tested

- nested objects
- promises
- functions
- symbols
- getters
- arrays (replacement strategy expected)
- no undefined properties copied over defined
- no null properties copied over defined
- inherited properties
- non-enumerable properties
- deep immutability
- original object immutability
- prototype references parent class

## Note

_In case you're wondering_: Special comments starting with 🕮 are used my package Sidenotes and serve for annotation purposes, please do not delete them.
