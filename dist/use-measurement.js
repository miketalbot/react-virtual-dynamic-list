"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useClearableState = useClearableState;
exports.useMeasurement = useMeasurement;

var _react = require("react");

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

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
  }, []);

  var update = function update(v) {
    return setValue && setValue(v);
  };

  setter && setter(update);
  return [value, update];
}

var batches = [];

function batch(fn) {
  batches.push(fn);
  runBatches();
}

var runBatches = (0, _debounce.default)(function () {
  _reactDom.default.unstable_batchedUpdates(function () {
    var toRun = batches;
    batches = [];

    var _iterator = _createForOfIteratorHelper(toRun),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var fn = _step.value;

        try {
          fn();
        } catch (e) {}
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
}, 48, {
  maxWait: 200
});

function useMeasurement(ref) {
  var element = (0, _react.useRef)();

  var _useState3 = (0, _react.useState)({
    width: 0.0000001,
    height: 0.0000001
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      size = _useState4[0],
      setSize = _useState4[1];

  var sizeFn = (0, _react.useRef)(setSize);
  sizeFn.current = setSize;

  var _useState5 = (0, _react.useState)(function () {
    return new _resizeObserverPolyfill.default(measure);
  }),
      _useState6 = _slicedToArray(_useState5, 1),
      observer = _useState6[0];

  (0, _react.useLayoutEffect)(function () {
    return function () {
      sizeFn.current = null;
      observer.disconnect();
    };
  }, [observer]);
  return [size, attach];

  function sized() {
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    batch(function () {
      sizeFn.current && sizeFn.current.apply(sizeFn, params);
    });
  }

  function attach(target) {
    element.current = target;
    ref && ref(target);

    if (target) {
      observer.observe(target);
    }
  }

  function measure(entries) {
    var contentRect = entries[0].contentRect;

    if (contentRect.height > 0) {
      sized({
        height: contentRect.height,
        width: contentRect.width,
        left: contentRect.left,
        top: contentRect.top,
        element: entries[0].target
      });
    }
  }
}