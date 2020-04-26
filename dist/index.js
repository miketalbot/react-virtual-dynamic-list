"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lerp = lerp;
exports.Virtual = Virtual;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var MEASURE_LIMIT = 5;

function heightCalculator(getHeight) {
  var cache = new Map();

  function calcHeight(v) {
    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (v === 0) return 0;
    var t = 0;

    if ((v & 1) !== 0) {
      t += blockHeight(v - 1, level);
    }

    return t + calcHeight(v >> 1, level + 1);
  }

  calcHeight.invalidate = function (item) {
    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (item === -1) {
      cache.clear();
      return;
    }

    cache.delete("".concat(item, ":").concat(level));
    if (item === 0) return;
    calcHeight.invalidate(item >> 1, level + 1);
  };

  function blockHeight(block, level) {
    if (level === 0) {
      return getHeight(block);
    } else if (level < 2) {
      return blockHeight(block << 1, level - 1) + blockHeight((block << 1) + 1, level - 1);
    } else {
      var key = "".concat(block, ":").concat(level);
      var existing = cache.get(key);

      if (existing !== undefined) {
        return existing;
      }

      var result = blockHeight(block << 1, level - 1) + blockHeight((block << 1) + 1, level - 1);
      cache.set(key, result);
      return result;
    }
  }

  return calcHeight;
}

var scrollEventParams = {
  items: null,
  scrollTop: 0,
  start: 0,
  last: 0,
  max: 0
};

var DefaultWrapper = _react.default.forwardRef(function DefaultWrapper(_ref, ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ["children"]);

  return /*#__PURE__*/_react.default.createElement("div", _extends({
    ref: ref
  }, props), children);
});

function noop() {}

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

function Virtual(_ref2) {
  var items = _ref2.items,
      scrollToItem = _ref2.scrollToItem,
      _ref2$useAnimation = _ref2.useAnimation,
      useAnimation = _ref2$useAnimation === void 0 ? true : _ref2$useAnimation,
      _ref2$expectedHeight = _ref2.expectedHeight,
      expectedHeight = _ref2$expectedHeight === void 0 ? 64 : _ref2$expectedHeight,
      _ref2$scrollTop = _ref2.scrollTop,
      scrollTop = _ref2$scrollTop === void 0 ? 0 : _ref2$scrollTop,
      _ref2$onScroll = _ref2.onScroll,
      onScroll = _ref2$onScroll === void 0 ? noop : _ref2$onScroll,
      renderItem = _ref2.renderItem,
      _ref2$overscan = _ref2.overscan,
      overscan = _ref2$overscan === void 0 ? 1 : _ref2$overscan,
      _ref2$Holder = _ref2.Holder,
      Holder = _ref2$Holder === void 0 ? DefaultWrapper : _ref2$Holder,
      _ref2$Wrapper = _ref2.Wrapper,
      Wrapper = _ref2$Wrapper === void 0 ? DefaultWrapper : _ref2$Wrapper,
      props = _objectWithoutProperties(_ref2, ["items", "scrollToItem", "useAnimation", "expectedHeight", "scrollTop", "onScroll", "renderItem", "overscan", "Holder", "Wrapper"]);

  if (!Array.isArray(items)) {
    items = {
      length: items,
      useIndex: true
    };
  }

  useAnimation = useAnimation || scrollToItem;
  var count = 0;

  var _useState = (0, _react.useState)(function () {
    return heightCalculator(getHeightOf);
  }),
      _useState2 = _slicedToArray(_useState, 1),
      hc = _useState2[0];

  var _useState3 = (0, _react.useState)(1000),
      _useState4 = _slicedToArray(_useState3, 2),
      setHeight = _useState4[1];

  var stateRef = (0, _react.useRef)({
    cache: new Map(),
    positions: [],
    render: 0,
    heights: [],
    measured: 1,
    scroll: 0,
    measuredHeights: expectedHeight,
    itemHeight: expectedHeight,
    componentHeight: 1000
  });
  var state = stateRef.current;
  var last = (0, _react.useRef)({
    item: -1,
    id: 0,
    counter: 0,
    renders: [],
    others: []
  });
  var status = last.current;
  return /*#__PURE__*/_react.default.createElement(Frame, props);

  function Frame(_ref3) {
    var props = _extends({}, _ref3);

    var _useState5 = (0, _react.useState)(0),
        _useState6 = _slicedToArray(_useState5, 2),
        id = _useState6[0],
        refresh = _useState6[1];

    var _useState7 = (0, _react.useState)(scrollTop),
        _useState8 = _slicedToArray(_useState7, 2),
        scrollPos = _useState8[0],
        setScrollPos = _useState8[1];

    var scrollInfo = (0, _react.useRef)({
      lastItem: 0,
      lastPos: 0
    });
    var endRef = (0, _react.useRef)();
    var offset = Math.min(10000000, scrollInfo.current.lastPos + (items.length - scrollInfo.current.lastItem) * state.itemHeight);
    (0, _react.useEffect)(function () {
      if (!useAnimation) return;
      var control = {
        running: true,
        beat: 0
      };
      requestAnimationFrame(animate(control));
      return function () {
        control.running = false;
      };
    });
    state.observer = new ResizeObserver(function (entries) {
      var updated = false;

      var _iterator = _createForOfIteratorHelper(entries),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          var _height = entry.contentRect.height;
          if (!_height) continue;

          if (state.heights[entry.target._item] !== _height) {
            if (state.measured === 1) {
              state.measuredHeights = _height;
              state.measured++;
            } else {
              state.measuredHeights += _height;
              state.measured++;
            }

            state.itemHeight = state.measuredHeights / Math.max(1, state.measured - 1);
            updated = true;
            state.heights[entry.target._item] = _height;

            if (state.measured < MEASURE_LIMIT) {
              hc.invalidate(-1);
            } else {
              hc.invalidate(entry.target._item);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (updated) refresh(id + 1);
    });
    (0, _react.useEffect)(function () {
      return function () {
        state.observer.disconnect();
      };
    }, []);
    return /*#__PURE__*/_react.default.createElement(Holder, {
      onScroll: scroll,
      ref: componentHeight,
      style: _objectSpread({}, props, {}, props.style, {
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        display: props.display || 'block',
        width: props.width || '100%',
        height: props.height || '100%',
        flexGrow: props.flexGrow || 1,
        overflowX: 'hidden',
        minHeight: props.minHeight || 2,
        maxHeight: props.maxHeight || '100vh',
        overflowY: 'auto'
      })
    }, /*#__PURE__*/_react.default.createElement("div", {
      ref: endRef,
      style: {
        marginTop: offset,
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
      from: scrollPos,
      scrollInfo: scrollInfo.current,
      scroller: componentHeight
    })));

    function animate(control) {
      function inner() {
        control.beat++;

        if (scrollToItem && count++ < 8) {
          var pos = getPositionOf(scrollToItem);
          state.scroller.scrollTop = pos;
        } else {
          scrollToItem = undefined;
        }

        if (control.beat % 8 === 0 && state.scroller) {
          var _scrollTop = state.scroller.scrollTop;
          if (_scrollTop !== scrollPos) setScrollPos(_scrollTop);
        }

        if (control.running) requestAnimationFrame(inner);
      }

      return inner;
    }

    function scroll(event) {
      setScrollPos(event.target.scrollTop);
    }
  }

  function componentHeight(target) {
    if (target) {
      target.scrollTop = scrollTop;
      state.scroller = target;
      var _height2 = target.offsetHeight;
      state.componentHeight = _height2;
      setHeight(_height2);
    }
  }

  function render(item) {
    var cache = state.cache;
    if (cache.has(item)) return cache.get(item);
    var toRender = items[item];

    var result = (!!toRender || items.useIndex) && /*#__PURE__*/_react.default.createElement("div", {
      ref: observe,
      key: item
    }, renderItem(!items.useIndex ? toRender : item, height(item), item));

    cache.set(item, result);
    return result;

    function observe(target) {
      if (target) {
        target._item = item;
        state.observer.observe(target);
      }
    }
  }

  function height(item) {
    return function (calc) {
      if (calc === true) {
        delete state.heights[item];
      } else {
        state.heights[item] = calc;
      }

      hc.invalidate(item);
    };
  }

  function Items(_ref4) {
    var from = _ref4.from,
        scrollInfo = _ref4.scrollInfo;
    status.from = from;
    var item = Math.max(0, getItemFromPosition(from - Math.min(state.itemHeight * 10, state.componentHeight * overscan)));
    var updatedPosition = getPositionOf(status.item);
    var diff = updatedPosition - status.y;

    if (diff) {
      state.scroller.scrollTop += diff;
      status.y = updatedPosition;
      from += diff;
    }

    if (status.item !== item) {
      status.item = item;
      state.render++;
      var y = status.y = getPositionOf(item);
      var renders = status.renders;
      var others = status.others;
      others.length = 0;
      renders.length = 0;

      for (var i = Math.max(0, item - (3 * overscan | 0)); i < item; i++) {
        others.push(render(i));
      }

      y -= from;
      var scan = item;
      var maxY = state.componentHeight * (overscan + .5) + (state.render < 2 ? 2 : 0);

      while (y < maxY && scan < items.length) {
        renders.push(render(scan));
        y += getHeightOf(scan);
        scan++;
      }

      if (scan >= scrollInfo.lastItem) {
        scrollInfo.lastItem = scan;
        scrollInfo.lastPos = y + from;
      }

      status.scan = scan;
    }

    scrollEventParams.items = items;
    scrollEventParams.scrollTop = from;
    scrollEventParams.start = item;
    scrollEventParams.last = status.scan;
    scrollEventParams.max = scrollInfo.lastItem;
    onScroll(scrollEventParams);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Wrapper, {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 0,
        overflow: 'hidden'
      }
    }, status.others), /*#__PURE__*/_react.default.createElement(Wrapper, {
      style: {
        transform: "translateY(".concat(status.y, "px)")
      }
    }, status.renders));
  }

  function getPositionOf(item) {
    if (item < 0 || item > items.length - 1) return 0;

    if (state.measured < MEASURE_LIMIT) {
      return state.itemHeight * item;
    }

    return hc && hc(item);
  }

  function getItemFromPosition(from) {
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
}

Virtual.propTypes = {
  Wrapper: _propTypes.default.func,
  display: _propTypes.default.any,
  expectedHeight: _propTypes.default.number,
  flexGrow: _propTypes.default.any,
  height: _propTypes.default.any,
  items: _propTypes.default.array.isRequired,
  maxHeight: _propTypes.default.any,
  minHeight: _propTypes.default.any,
  onScroll: _propTypes.default.func,
  overscan: _propTypes.default.number,
  renderItem: _propTypes.default.func.isRequired,
  scrollTop: _propTypes.default.number,
  useAnimation: _propTypes.default.bool,
  width: _propTypes.default.any
};