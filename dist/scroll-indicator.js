"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollIndicatorHolder = void 0;

var _react = _interopRequireWildcard(require("react"));

var _useMeasurement3 = require("./use-measurement");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var panelOpts = {
  position: 'absolute',
  left: 0,
  zIndex: 10,
  right: 0,
  width: '100%',
  height: 0
};

var ScrollIndicatorHolder = _react.default.forwardRef(function ScrollIndicatorHolder(_ref, ref) {
  var children = _ref.children,
      className = _ref.className,
      state = _ref.state,
      onScroll = _ref.onScroll,
      style = _ref.style,
      _ref$shadow = _ref.shadow,
      shadow = _ref$shadow === void 0 ? '0 0 12px 2px' : _ref$shadow,
      props = _objectWithoutProperties(_ref, ["children", "className", "state", "onScroll", "style", "shadow"]);

  var _useMeasurement = (0, _useMeasurement3.useMeasurement)(),
      _useMeasurement2 = _slicedToArray(_useMeasurement, 2),
      size = _useMeasurement2[0],
      attach = _useMeasurement2[1];

  var _useState = (0, _react.useState)(state.fadeTop || 0),
      _useState2 = _slicedToArray(_useState, 2),
      topAmount = _useState2[0],
      setTopAmount = _useState2[1];

  var _useState3 = (0, _react.useState)(state.fadeBottom || 0),
      _useState4 = _slicedToArray(_useState3, 2),
      bottomAmount = _useState4[0],
      setBottomAmount = _useState4[1];

  (0, _react.useLayoutEffect)(function () {
    if (size.height > 0.1 && state.scroller) {
      setBottomAmount(Math.max(0, Math.min(1, (state.scroller.scrollHeight - state.scroller.scrollTop - size.height) / 64)));
    }
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "".concat(className, " dynamic-list-holder"),
    style: {
      position: 'relative',
      overflow: 'hidden'
    },
    ref: attach
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: _objectSpread({
      boxShadow: shadow
    }, panelOpts, {
      top: 0,
      opacity: topAmount
    })
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: _objectSpread({
      boxShadow: shadow
    }, panelOpts, {
      bottom: 0,
      opacity: bottomAmount
    })
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: ref,
    style: _objectSpread({}, props, {}, style, {
      scrollTop: state.scroll
    }),
    onScroll: scroll
  }, children));

  function scroll(event) {
    var pos = event.target.scrollTop;
    state.fadeTop = Math.min(1, pos / 64);
    state.fadeBottom = Math.max(0, Math.min(1, (event.target.scrollHeight - pos - size.height) / 64));
    setTopAmount(state.fadeTop);
    setBottomAmount(state.fadeBottom);
    onScroll(event);
  }
});

exports.ScrollIndicatorHolder = ScrollIndicatorHolder;