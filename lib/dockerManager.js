"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = require("./utils/helpers");

var _createMember = _interopRequireDefault(require("./utils/createMember"));

var _chalk = _interopRequireDefault(require("chalk"));

var _dockerode = _interopRequireDefault(require("dockerode"));

var _ora = _interopRequireDefault(require("ora"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DockerManager = /*#__PURE__*/function () {
  function DockerManager() {
    _classCallCheck(this, DockerManager);

    _defineProperty(this, "spinner", void 0);

    _defineProperty(this, "networkName", void 0);

    _defineProperty(this, "coreClusters", void 0);

    _defineProperty(this, "readReplicas", void 0);

    _defineProperty(this, "ignoreInput", void 0);

    _defineProperty(this, "baseName", void 0);

    _defineProperty(this, "basePorts", void 0);

    this.spinner = (0, _ora["default"])();
    this.spinner.color = 'green';
    this.networkName = null;
    this.coreClusters = 3;
    this.readReplicas = 1;
    this.ignoreInput = true;
    this.baseName = "boltnet-".concat((0, _helpers.randomString)(5));
    this.basePorts = {
      BOLT: '7687',
      HTTPS: '7473',
      HTTP: '7474'
    };
  }

  _createClass(DockerManager, [{
    key: "successSpinner",
    value: function successSpinner() {
      this.spinner.succeed();
    }
  }, {
    key: "failSpinner",
    value: function failSpinner() {
      this.spinner.fail();
    }
  }, {
    key: "startSpinner",
    value: function startSpinner(text) {
      this.spinner.text = text;
      this.spinner.start();
    }
  }, {
    key: "errorMessage",
    value: function errorMessage(message) {
      console.log(_chalk["default"].red(message));
    }
  }, {
    key: "fatalFail",
    value: function fatalFail(message) {
      this.failSpinner();
      this.errorMessage(message);
      throw new Error(message);
    }
    /** Remove all the containers generated from boltnet */

  }, {
    key: "pingDocker",
    value:
    /** Checks is docker is enabled */
    function () {
      var _pingDocker = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                this.startSpinner('Connecting with Docker');
                _context.next = 4;
                return DockerManager.dockerDriver.ping();

              case 4:
                this.successSpinner();
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                this.fatalFail(_context.t0);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function pingDocker() {
        return _pingDocker.apply(this, arguments);
      }

      return pingDocker;
    }()
    /** Create a network stack on the default Docker bridge */

  }, {
    key: "createNetwork",
    value: function () {
      var _createNetwork = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.networkName = "boltnet-".concat((0, _helpers.randomString)(6));
                this.startSpinner("Creating Bridge network with name: ".concat(this.networkName));
                _context2.prev = 2;
                _context2.next = 5;
                return DockerManager.dockerDriver.createNetwork({
                  Name: this.networkName
                });

              case 5:
                this.successSpinner();
                _context2.next = 11;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](2);
                this.fatalFail(_context2.t0);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 8]]);
      }));

      function createNetwork() {
        return _createNetwork.apply(this, arguments);
      }

      return createNetwork;
    }()
    /** Prune available unused Docker networks */

  }, {
    key: "pruneNetworks",
    value: function () {
      var _pruneNetworks = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.startSpinner('Removing Unused Networks');
                _context3.prev = 1;
                _context3.next = 4;
                return DockerManager.dockerDriver.pruneNetworks();

              case 4:
                this.successSpinner();
                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](1);
                this.fatalFail('Could not prune networks');

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 7]]);
      }));

      function pruneNetworks() {
        return _pruneNetworks.apply(this, arguments);
      }

      return pruneNetworks;
    }()
    /** Create and run containers */

  }, {
    key: "runContainers",
    value: function () {
      var _runContainers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var i, l, options, container;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.spinner.text = 'Starting Cluster Members';
                this.spinner.start();
                /**  Create Core Cluster members */

                i = 0, l = this.coreClusters + this.readReplicas;

              case 3:
                if (!(i < l)) {
                  _context4.next = 13;
                  break;
                }

                options = (0, _createMember["default"])({
                  baseName: this.baseName,
                  id: i,
                  networkName: this.networkName,
                  options: {
                    clusterSize: this.coreClusters,
                    mode: i + 1 > this.coreClusters ? 'READ_REPLICA' : 'CORE'
                  },
                  ports: {
                    container: {
                      BOLT: "".concat(parseInt(this.basePorts.BOLT) + i * 10),
                      HTTP: "".concat(parseInt(this.basePorts.HTTP) + i * 10),
                      HTTPS: "".concat(parseInt(this.basePorts.HTTPS) + i * 10)
                    },
                    host: this.basePorts
                  }
                });
                _context4.next = 7;
                return DockerManager.dockerDriver.createContainer(options);

              case 7:
                container = _context4.sent;
                _context4.next = 10;
                return container.start();

              case 10:
                i += 1;
                _context4.next = 3;
                break;

              case 13:
                this.spinner.succeed();

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function runContainers() {
        return _runContainers.apply(this, arguments);
      }

      return runContainers;
    }()
  }], [{
    key: "cleanBoltnetContainers",
    value: function cleanBoltnetContainers() {
      var _this = this;

      this.dockerDriver.listContainers(function (_, containers) {
        containers === null || containers === void 0 ? void 0 : containers.forEach(function (containerInfo) {
          if (containerInfo.Names.filter(function (containerName) {
            return new RegExp(/boltnet-/).test(containerName);
          })) {
            console.log(_chalk["default"].green("Removing Container ID: ".concat(containerInfo.Id)));

            _this.dockerDriver.getContainer(containerInfo.Id).remove({
              force: true
            });
          }
        });
      });
    }
  }]);

  return DockerManager;
}();

_defineProperty(DockerManager, "dockerDriver", new _dockerode["default"]());

var _default = DockerManager;
exports["default"] = _default;