"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createMemberOptions = function createMemberOptions(_ref) {
  var _PortBindings;

  var id = _ref.id,
      baseName = _ref.baseName,
      ports = _ref.ports,
      networkName = _ref.networkName,
      options = _ref.options;
  var defaultOptions = {
    mode: 'CORE',
    clusterSize: 3,
    imageName: 'neo4j:4.3-enterprise'
  };

  var newOptions = _objectSpread(_objectSpread({}, defaultOptions), options);

  var memberName = "".concat(baseName, "-").concat(newOptions.mode, "-").concat(id + 1);
  console.log(_chalk["default"].yellow("  Creating member: ".concat(memberName)));
  var discoveryMembers = Array.from({
    length: newOptions.clusterSize
  }, function (_, i) {
    return "".concat(baseName, "-core-").concat(i + 1, ":5000");
  });
  var envinromentVariables = ['NEO4J_ACCEPT_LICENSE_AGREEMENT=yes', "NEO4J_dbms_mode=".concat(newOptions.mode), "NEO4J_causal__clustering_initial__discovery__members=".concat(discoveryMembers), "NEO4J_dbms_connector_bolt_advertised__address=localhost:".concat(ports.container.BOLT), "NEO4J_dbms_connector_http_advertised__address=localhost:".concat(ports.container.HTTP)];

  if (newOptions.mode === 'CORE') {
    envinromentVariables.push("NEO4J_causal__clustering_expected__core__cluster__size=".concat(newOptions.clusterSize));
  }

  return {
    Image: newOptions.imageName,
    Tty: false,
    name: memberName,
    Hostname: memberName,
    AttachStdin: false,
    AttachStdout: false,
    AttachStderr: false,
    HostConfig: {
      NetworkMode: networkName,
      PortBindings: (_PortBindings = {}, _defineProperty(_PortBindings, "".concat(ports.host.HTTP, "/tcp"), [{
        HostIp: '',
        HostPort: ports.container.HTTP
      }]), _defineProperty(_PortBindings, "".concat(ports.host.HTTPS, "/tcp"), [{
        HostIp: '',
        HostPort: ports.container.HTTPS
      }]), _defineProperty(_PortBindings, "".concat(ports.host.BOLT, "/tcp"), [{
        HostIp: '',
        HostPort: ports.container.BOLT
      }]), _PortBindings)
    },
    Env: envinromentVariables
  };
};

var _default = createMemberOptions;
exports["default"] = _default;