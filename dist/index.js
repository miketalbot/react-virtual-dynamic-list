"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "useCurrentState", {
  enumerable: true,
  get: function get() {
    return _useCurrentState5.useCurrentState;
  }
});
Object.defineProperty(exports, "useMeasurement", {
  enumerable: true,
  get: function get() {
    return _useMeasurement3.useMeasurement;
  }
});
Object.defineProperty(exports, "ScrollIndicatorHolder", {
  enumerable: true,
  get: function get() {
    return _scrollIndicator.ScrollIndicatorHolder;
  }
});
exports.Virtual = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

var _heightCalculator = require("./height-calculator");

var _useCurrentState5 = require("./use-current-state");

var _defaultWrapper = require("./default-wrapper");

var _noop = require("./noop");

var _useMeasurement3 = require("./use-measurement");

var _scrollIndicator = require("./scroll-indicator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var MEASURE_LIMIT = 3;
var id = 0;
var scrollEventParams = {
  items: null,
  scrollTop: 0,
  start: 0,
  last: 0,
  index: 0,
  max: 0,
  scroller: null,
  scrollTo: function scrollTo() {}
};
var uqId = 0;

var Virtual = _react.default.forwardRef(function Virtual(_ref, passRef) {
  var items = _ref.items,
      scrollToItem = _ref.scrollToItem,
      _ref$useAnimation = _ref.useAnimation,
      useAnimation = _ref$useAnimation === void 0 ? true : _ref$useAnimation,
      _ref$onInit = _ref.onInit,
      onInit = _ref$onInit === void 0 ? _noop.noop : _ref$onInit,
      _ref$expectedHeight = _ref.expectedHeight,
      expectedHeight = _ref$expectedHeight === void 0 ? 64 : _ref$expectedHeight,
      _ref$scrollTop = _ref.scrollTop,
      scrollTop = _ref$scrollTop === void 0 ? 0 : _ref$scrollTop,
      _ref$onScroll = _ref.onScroll,
      onScroll = _ref$onScroll === void 0 ? _noop.noop : _ref$onScroll,
      renderItem = _ref.renderItem,
      className = _ref.className,
      _ref$overscan = _ref.overscan,
      overscan = _ref$overscan === void 0 ? 1 : _ref$overscan,
      _ref$Holder = _ref.Holder,
      Holder = _ref$Holder === void 0 ? _defaultWrapper.DefaultWrapper : _ref$Holder,
      _ref$Wrapper = _ref.Wrapper,
      Wrapper = _ref$Wrapper === void 0 ? _defaultWrapper.DefaultWrapper : _ref$Wrapper,
      props = _objectWithoutProperties(_ref, ["items", "scrollToItem", "useAnimation", "onInit", "expectedHeight", "scrollTop", "onScroll", "renderItem", "className", "overscan", "Holder", "Wrapper"]);

  var _useState = (0, _react.useState)(function () {
    scrollEventParams.items = items;
    scrollEventParams.getPositionOf = getPositionOf;
    scrollEventParams.getHeightOf = getHeightOf;
    scrollEventParams.getItemFromPosition = getItemFromPosition;
    scrollEventParams.scrollTo = scrollTo;
    var cache = scrollEventParams.itemCache = new Map();
    onInit(scrollEventParams);
    return {
      cache: cache,
      positions: [],
      render: 0,
      hc: (0, _heightCalculator.heightCalculator)(getHeightOf),
      heights: [],
      measured: 1,
      redraw: false,
      scroll: scrollTop,
      refresh: _noop.noop,
      scrollUpdate: _noop.noop,
      expectedHeight: expectedHeight,
      measuredHeights: expectedHeight,
      itemHeight: expectedHeight,
      componentHeight: 1000,
      item: -1,
      id: 0,
      counter: 0,
      renders: [],
      others: []
    };
  }),
      _useState2 = _slicedToArray(_useState, 1),
      state = _useState2[0];

  if (!Array.isArray(items)) {
    items = {
      length: items,
      useIndex: true
    };
  }

  items._id = items._id || id++;

  if (items._id !== state.lastId || items.length !== state.lastLength) {
    state.lastId = items._id;
    state.lastLength = items.length;
    state.cache.clear();
    state.hc.invalidate(-1);
    state.redraw = true;
  }

  useAnimation = useAnimation || scrollToItem;

  var _useMeasurement = (0, _useMeasurement3.useMeasurement)(),
      _useMeasurement2 = _slicedToArray(_useMeasurement, 2),
      currentHeight = _useMeasurement2[0].height,
      attach = _useMeasurement2[1];

  state.componentHeight = currentHeight;

  if (state.currentHeight !== currentHeight) {
    state.redraw = true;
    state.currentHeight = currentHeight;
  }

  var _useCurrentState = (0, _useCurrentState5.useCurrentState)(scrollTop || state.scroll),
      _useCurrentState2 = _slicedToArray(_useCurrentState, 1),
      scrollPos = _useCurrentState2[0];

  var scrollInfo = (0, _react.useRef)({
    lastItem: 0,
    lastPos: 0
  });
  var endRef = (0, _react.useRef)();
  var offset = Math.min(10000000, scrollInfo.current.lastPos + (items.length - scrollInfo.current.lastItem) * state.itemHeight);
  (0, _react.useEffect)(function () {
    state.scroller.scrollTop = scrollPos;
    if (!useAnimation) return;
    var control = {
      running: true,
      beat: 0
    };
    requestAnimationFrame(animate(control));
    return function () {
      control.running = false;
    };
  }, [useAnimation, scrollPos]);
  return /*#__PURE__*/_react.default.createElement(Holder, _extends({}, props, {
    className: className,
    state: state,
    onScroll: scroll,
    ref: componentHeight,
    style: _objectSpread({}, props, {}, props.style, {
      WebkitOverflowScrolling: 'touch',
      position: 'relative',
      scrollTop: state.scroll,
      display: props.display,
      width: props.width || '100%',
      height: props.height,
      flexGrow: props.flexGrow,
      overflowX: 'hidden',
      minHeight: props.minHeight,
      maxHeight: props.maxHeight,
      overflowY: 'auto'
    })
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: endRef,
    style: {
      marginTop: offset - 1,
      height: 1
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'absolute',
      overflow: 'visible',
      height: 0,
      width: '100%',
      top: 0
    }
  }, /*#__PURE__*/_react.default.createElement(Items, {
    end: endRef,
    state: state,
    getHeightOf: getHeightOf,
    getItemFromPosition: getItemFromPosition,
    getPositionOf: getPositionOf,
    overscan: overscan,
    currentHeight: currentHeight,
    items: items,
    onScroll: onScroll,
    Wrapper: Wrapper,
    scrollTo: scrollTo,
    renderItem: renderItem,
    from: scrollPos,
    scrollInfo: scrollInfo.current
  })));

  function componentHeight(target) {
    if (target) {
      passRef && passRef(target);
      state.componentHeight = target.offsetHeight;
      attach && attach(target);
      state.scroller = target;
      target._component = true;
      target.scrollTop = state.scroll;
    }
  }

  function getPositionOf(item) {
    if (item < 0 || item > items.length - 1) return 0;

    if (state.measured < MEASURE_LIMIT) {
      return state.itemHeight * item;
    }

    return state.hc(item);
  }

  function getItemFromPosition(from) {
    if (from < 0) return 0;
    var start = 0;
    var end = items.length;
    var max = Math.abs(Math.log2(end) + 1);
    var c = 0;
    var middle;

    do {
      middle = ((end - start) / 2 | 0) + start;
      var posStart = getPositionOf(middle);
      var posEnd = posStart + getHeightOf(middle);
      if (posStart <= from && posEnd > from) return middle;

      if (posStart > from) {
        end = middle;
      } else {
        start = middle;
      }
    } while (c++ < max);

    return middle;
  }

  function getHeightOf(item) {
    var height = state.heights[item];
    return height !== undefined ? height : state.itemHeight;
  }

  function animate(control) {
    control.count = 0;

    function inner() {
      if (state.scroller && state.scroller.scrollTop !== 0) {
        state.scroll = state.scroller.scrollTop;
      }

      control.beat++;

      if (control.count < 5) {
        state.scroller.scrollTop = state.scroll;
      }

      if (scrollToItem && control.count++ < 8) {
        var pos = getPositionOf(scrollToItem);
        state.scroller.scrollTop = pos;
      } else {
        scrollToItem = undefined;
      }

      if ((control.beat & 3) === 0) {
        state.scroll = state.scroller.scrollTop;
        state.scrollUpdate(state.scroller.scrollTop);
      }

      if (control.running) requestAnimationFrame(inner);
    }

    return inner;
  }

  function scroll(event) {
    state.scroll = event.target.scrollTop;
    state.scrollUpdate(state.scroll);
  }

  function scrollTo(item) {
    var pos = getPositionOf(item);
    state.scroll = pos;
    state.scroller.scrollTop = pos;
  }
});

exports.Virtual = Virtual;

function Items(_ref2) {
  var from = _ref2.from,
      scrollInfo = _ref2.scrollInfo,
      getPositionOf = _ref2.getPositionOf,
      state = _ref2.state,
      getItemFromPosition = _ref2.getItemFromPosition,
      overscan = _ref2.overscan,
      onScroll = _ref2.onScroll,
      renderItem = _ref2.renderItem,
      getHeightOf = _ref2.getHeightOf,
      scrollTo = _ref2.scrollTo,
      currentHeight = _ref2.currentHeight,
      Wrapper = _ref2.Wrapper,
      hc = _ref2.hc,
      items = _ref2.items;

  var _useState3 = (0, _react.useState)(0),
      _useState4 = _slicedToArray(_useState3, 2),
      id = _useState4[0],
      refresh = _useState4[1];

  state.refresh = function () {
    return refresh(id + 1);
  };

  var _useCurrentState3 = (0, _useCurrentState5.useCurrentState)(from),
      _useCurrentState4 = _slicedToArray(_useCurrentState3, 2),
      setScrollPos = _useCurrentState4[1];

  var scrollPos = state.scroll;
  state.scroll = state.from = scrollPos;
  state.scrollUpdate = setScrollPos;
  var lookBehind = Math.min(state.itemHeight * 10, state.componentHeight * overscan);
  var item = Math.max(0, getItemFromPosition(scrollPos - lookBehind));
  var first = getItemFromPosition(scrollPos);
  var updatedPosition = getPositionOf(state.item);
  var diff = state.redraw ? 0 : updatedPosition - state.y;

  if (diff) {
    scrollPos += diff;
    state.scroller.scrollTop = scrollPos;
    state.y = updatedPosition;
  }

  if (state.index !== first || state.redraw) {
    state.redraw = false;
    state.index = first;
    state.item = item;
    state.render++;
    var y = state.y = getPositionOf(item);
    var renders = state.renders;
    var others = state.others;
    others.length = 0;
    renders.length = 0;

    for (var i = Math.max(0, item - (3 * overscan | 0)); i < item; i++) {
      others.push(render(i));
    }

    y -= scrollPos;
    var scan = item;
    var maxY = currentHeight * (overscan + 1);

    while (y < maxY && scan < items.length) {
      renders.push(render(scan));
      y += getHeightOf(scan);
      scan++;
    }

    if (scan >= scrollInfo.lastItem) {
      scrollInfo.lastItem = scan;
      scrollInfo.lastPos = y + scrollPos;
    }

    state.scan = scan;
  }

  scrollEventParams.items = items;
  scrollEventParams.scrollTop = scrollPos;
  scrollEventParams.start = item;
  scrollEventParams.index = first;
  scrollEventParams.last = state.scan;
  scrollEventParams.max = scrollInfo.lastItem;
  scrollEventParams.scroller = state.scroller;
  scrollEventParams.getPositionOf = getPositionOf;
  scrollEventParams.getHeightOf = getHeightOf;
  scrollEventParams.scrollTo = scrollTo;
  scrollEventParams.getItemFromPosition = getItemFromPosition;
  scrollEventParams.itemCache = state.cache;
  onScroll(scrollEventParams);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Wrapper, {
    style: {
      height: 0,
      overflow: 'hidden'
    }
  }, state.others), /*#__PURE__*/_react.default.createElement(Wrapper, {
    style: {
      transform: "translateY(".concat(state.y, "px)")
    }
  }, state.renders));

  function render(item) {
    var cache = state.cache;
    if (cache.has(item)) return cache.get(item);
    var toRender = !items.useIndex ? items[item] : item;
    var result = !!toRender || items.useIndex ? /*#__PURE__*/_react.default.createElement(Item, {
      item: item,
      key: uqId++,
      toRender: toRender
    }) : null;
    cache.set(item, result);
    return result;

    function Item(_ref3) {
      var item = _ref3.item,
          toRender = _ref3.toRender;
      var observer = new _resizeObserverPolyfill.default(function (entries) {
        var entry = entries[0];
        var height = entry.contentRect.height;

        if (height) {
          if (state.heights[item] !== height) {
            if (state.measured === 1) {
              state.measuredHeights = height;
              state.measured++;
            } else {
              state.measuredHeights += height;
              state.measured++;
            }

            state.itemHeight = state.measuredHeights / Math.max(1, state.measured - 1);
            state.heights[entry.target._item] = height;

            if (state.measured < MEASURE_LIMIT) {
              state.hc.invalidate(-1);
            } else {
              state.hc.invalidate(entry.target._item);
            }
          }
        }
      });
      (0, _react.useEffect)(function () {
        return function () {
          observer.disconnect();
        };
      });
      return /*#__PURE__*/_react.default.createElement("div", {
        ref: observe
      }, renderItem(toRender, item));

      function observe(target) {
        if (target) {
          target._item = item;
          observer.observe(target);
        }
      }
    }
  }
}

Virtual.propTypes = {
  Wrapper: _propTypes.default.func,
  display: _propTypes.default.any,
  expectedHeight: _propTypes.default.number,
  flexGrow: _propTypes.default.any,
  height: _propTypes.default.any,
  items: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.number]).isRequired,
  maxHeight: _propTypes.default.any,
  minHeight: _propTypes.default.any,
  onScroll: _propTypes.default.func,
  overscan: _propTypes.default.number,
  renderItem: _propTypes.default.func.isRequired,
  scrollTop: _propTypes.default.number,
  useAnimation: _propTypes.default.bool,
  width: _propTypes.default.any
};