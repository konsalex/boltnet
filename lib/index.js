#!/usr/bin/env node
"use strict";

var _constants = require("./utils/constants");

var _chalk = _interopRequireDefault(require("chalk"));

var _dockerManager = _interopRequireDefault(require("./dockerManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

console.log(_chalk["default"].yellow(_constants.STARTUP_MESSAGE));

function time() {
  return _time.apply(this, arguments);
}

function _time() {
  _time = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // cleanBoltnetContainers
            _dockerManager["default"].cleanBoltnetContainers(); // const manager = new DockerManager();
            // await manager.pingDocker();
            // await manager.createNetwork();
            // await manager.runContainers();
            // await manager.pruneNetworks();


          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _time.apply(this, arguments);
}

time();