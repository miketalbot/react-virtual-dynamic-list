"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useClearableState = useClearableState;
exports.useMeasurement = useMeasurement;

var _react = require("react");

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useClearableState(initialValue, setter) {
  var _useState = (0, _react.useState)(initialValue),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  (0, _react.useEffect)(function () {
    return function () {
      setValue = null;
    };
  });

  var update = function update(v) {
    return setValue && setValue(v);
  };

  setter && setter(update);
  return [value, update];
}

function useMeasurement(ref) {
  var element = (0, _react.useRef)();

  var _useClearableState = useClearableState({
    width: 0.0000001,
    height: 0.0000001
  }),
      _useClearableState2 = _slicedToArray(_useClearableState, 2),
      size = _useClearableState2[0],
      setSize = _useClearableState2[1];

  var _useState3 = (0, _react.useState)(function () {
    return new _resizeObserverPolyfill.default(measure);
  }),
      _useState4 = _slicedToArray(_useState3, 1),
      observer = _useState4[0];

  (0, _react.useLayoutEffect)(function () {
    return function () {
      observer.disconnect();
    };
  }, [observer]);
  return [size, attach];

  function attach(target) {
    element.current = target;
    ref && ref(target);

    if (target) {
      observer.observe(target);
    }
  }

  function measure() {
    requestAnimationFrame(function () {
      var e = element.current;
      setSize({
        height: e.scrollHeight || e.offsetHeight,
        width: e.offsetWidth
      });
    });
  }
}