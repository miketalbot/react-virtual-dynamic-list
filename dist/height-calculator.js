"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.heightCalculator = heightCalculator;

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