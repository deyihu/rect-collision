/*!
 * rect-collision v0.1.0
  */
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var GRIDWIDTH = 100;
var GRIDHEIGHT = 50;
function bboxCross(bbox1, bbox2) {
  if (bbox1.maxX < bbox2.minX || bbox1.minY > bbox2.maxY || bbox1.minX > bbox2.maxX || bbox1.maxY < bbox2.minY) {
    return false;
  }
  return true;
}

// function getItemColRow(item) {
//     const { minX, minY, maxX, maxY } = item;
//     const minCol = Math.floor(minX / GRIDWIDTH), maxCol = Math.ceil(maxX / GRIDWIDTH), minRow = Math.floor(minY / GRIDHEIGHT), maxRow = Math.ceil(maxY / GRIDHEIGHT);
//     return { minCol, maxCol, minRow, maxRow };
// }

var RectCollision = /*#__PURE__*/function () {
  function RectCollision() {
    this.gridIndex = new Map();
    this.init();
  }
  var _proto = RectCollision.prototype;
  _proto.init = function init() {
    for (var col = -10; col <= 20; col++) {
      for (var row = -10; row <= 20; row++) {
        var grid = {
          col: col,
          row: row,
          items: []
        };
        this.gridIndex.set(col + "_" + row, grid);
      }
    }
  };
  _proto.insert = function insert(item) {
    if (!item) {
      return this;
    }
    if (item._gridIndex) {
      return this;
    }
    item._gridIndex = [];
    var minX = item.minX,
      minY = item.minY,
      maxX = item.maxX,
      maxY = item.maxY;
    var minCol = Math.floor(minX / GRIDWIDTH),
      maxCol = Math.ceil(maxX / GRIDWIDTH),
      minRow = Math.floor(minY / GRIDHEIGHT),
      maxRow = Math.ceil(maxY / GRIDHEIGHT);
    var gridIndex = this.gridIndex;
    for (var col = minCol; col <= maxCol; col++) {
      for (var row = minRow; row <= maxRow; row++) {
        var index = col + "_" + row;
        if (!gridIndex.has(index)) {
          gridIndex.set(index, {
            col: col,
            row: row,
            items: []
          });
        }
        gridIndex.get(index).items.push(item);
        item._gridIndex.push(index);
      }
    }
  };
  _proto.remove = function remove(item) {
    if (!item) {
      return this;
    }
    var gridIndex = item._gridIndex;
    if (!gridIndex || !gridIndex.length) {
      delete item._gridIndex;
      return this;
    }
    for (var i = 0, len = gridIndex.length; i < len; i++) {
      var index = gridIndex[i];
      var grid = this.gridIndex.get(index);
      if (!grid) {
        continue;
      }
      var items = grid.items;
      var idx = items.indexOf(item);
      if (idx > -1) {
        item.splice(idx, 1);
      }
    }
    delete item._gridIndex;
    return this;
  };
  _proto.collides = function collides(item) {
    if (!item) {
      return false;
    }
    var minX = item.minX,
      minY = item.minY,
      maxX = item.maxX,
      maxY = item.maxY;
    var minCol = Math.floor(minX / GRIDWIDTH),
      maxCol = Math.ceil(maxX / GRIDWIDTH),
      minRow = Math.floor(minY / GRIDHEIGHT),
      maxRow = Math.ceil(maxY / GRIDHEIGHT);
    var cross = bboxCross;
    var gridIndex = this.gridIndex;
    for (var col = minCol; col <= maxCol; col++) {
      for (var row = minRow; row <= maxRow; row++) {
        var index = col + "_" + row;
        var grid = gridIndex.get(index);
        if (!grid) {
          continue;
        }
        var items = grid.items;
        if (!items.length) {
          continue;
        }
        for (var i = 0, len = items.length; i < len; i++) {
          if (cross(item, items[i])) {
            return true;
          }
        }
      }
    }
    return false;
  };
  _proto.clear = function clear() {
    for (var _iterator = _createForOfIteratorHelperLoose(this.gridIndex), _step; !(_step = _iterator()).done;) {
      var index = _step.value;
      var items = index[1].items;
      for (var i = 0, len = items.length; i < len; i++) {
        delete items[i]._gridIndex;
      }
      index[1].items = [];
    }
    return this;
  };
  _proto.all = function all() {
    var result = [];
    for (var _iterator2 = _createForOfIteratorHelperLoose(this.gridIndex), _step2; !(_step2 = _iterator2()).done;) {
      var index = _step2.value;
      var items = index[1].items;
      if (!items || !items.length) {
        continue;
      }
      for (var i = 0, len = items.length; i < len; i++) {
        var item = items[i];
        if (result.indexOf(item) === -1) {
          result.push(item);
        }
      }
    }
    return result;
  };
  return RectCollision;
}();

export { GRIDHEIGHT, GRIDWIDTH, RectCollision };
