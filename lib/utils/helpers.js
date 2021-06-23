"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomString = void 0;

/** We do not care about truly random string */
var randomString = function randomString(n) {
  return Math.random().toString(36).substring(n);
};

exports.randomString = randomString;