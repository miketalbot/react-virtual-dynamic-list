"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultWrapper = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultWrapper = _react.default.forwardRef(function DefaultWrapper(_ref, ref) {
  var style = _ref.style,
      className = _ref.className,
      onScroll = _ref.onScroll,
      children = _ref.children;
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: ref,
    style: style,
    onScroll: onScroll,
    className: className
  }, children);
});

exports.DefaultWrapper = DefaultWrapper;