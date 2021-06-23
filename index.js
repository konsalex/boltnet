'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var printTest = require('@utils/printTest');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var printTest__default = /*#__PURE__*/_interopDefaultLegacy(printTest);

console.log('Try npm run lint/fix!');
printTest__default['default']('test');
function doSomeStuff(withThis, andThat, andThose) {
  //function on one line
  if (!andThose.length) {
    return false;
  }

  console.log(withThis);
  console.log(andThat);
  console.dir(andThose);
  return;
} // TODO: more examples

exports.doSomeStuff = doSomeStuff;
