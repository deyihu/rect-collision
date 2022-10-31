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
  return !(bbox1.maxX < bbox2.minX || bbox1.minY > bbox2.maxY || bbox1.minX > bbox2.maxX || bbox1.maxY < bbox2.minY);
}

// function getItemColRow(item) {
//     const { minX, minY, maxX, maxY } = item;
//     const minCol = Math.floor(minX / GRIDWIDTH), maxCol = Math.ceil(maxX / GRIDWIDTH), minRow = Math.floor(minY / GRIDHEIGHT), maxRow = Math.ceil(maxY / GRIDHEIGHT);
//     return { minCol, maxCol, minRow, maxRow };
// }

var RectCollision = /*#__PURE__*/function () {
  function RectCollision() {
    this.gridIndex = new Map();
    this.items = [];
    this.init();
  }
  var _proto = RectCollision.prototype;
  _proto.init = function init() {
    for (var col = -10; col <= 20; col++) {
      for (var row = -10; row <= 20; row++) {
        var grid = {
          col: col,
          row: row,
          index: []
        };
        this.gridIndex.set(col + "_" + row, grid);
      }
    }
  };
  _proto.insert = function insert(item) {
    if (!item) {
      return this;
    }
    if (item._insert) {
      return this;
    }
    item._insert = true;
    var minX = item.minX,
      minY = item.minY,
      maxX = item.maxX,
      maxY = item.maxY;
    var minCol = Math.floor(minX / GRIDWIDTH),
      maxCol = Math.ceil(maxX / GRIDWIDTH),
      minRow = Math.floor(minY / GRIDHEIGHT),
      maxRow = Math.ceil(maxY / GRIDHEIGHT);
    var gridIndex = this.gridIndex;
    var len = this.items.push(item);
    var row = minRow;
    for (var col = minCol; col <= maxCol; col++) {
      row = minRow;
      for (; row <= maxRow; row++) {
        var index = col + "_" + row;
        if (col < -10 || col > 20 || row < -10 || row > 20) {
          if (!gridIndex.has(index)) {
            gridIndex.set(index, {
              col: col,
              row: row,
              index: []
            });
          }
        }
        gridIndex.get(index).index.push(len - 1);
      }
    }
  }

  // remove(item) {
  //     if (!item) {
  //         return this;
  //     }
  //     const gridIndex = item._gridIndex;
  //     if (!gridIndex || !gridIndex.length) {
  //         delete item._gridIndex;
  //         return this;
  //     }
  //     for (let i = 0, len = gridIndex.length; i < len; i++) {
  //         const index = gridIndex[i];
  //         const grid = this.gridIndex.get(index);
  //         if (!grid) {
  //             continue;
  //         }
  //         const items = grid.items;
  //         const idx = items.indexOf(item);
  //         if (idx > -1) {
  //             item.splice(idx, 1);
  //         }
  //     }
  //     delete item._gridIndex;
  //     return this;
  // }
  ;
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
    var row = minRow;
    for (var col = minCol; col <= maxCol; col++) {
      row = minRow;
      for (; row <= maxRow; row++) {
        var gridIdx = col + "_" + row;
        var grid = gridIndex.get(gridIdx);
        if (!grid) {
          continue;
        }
        var index = grid.index;
        if (!index.length) {
          continue;
        }
        for (var i = 0, len = index.length; i < len; i++) {
          var idx = index[i];
          if (cross(item, this.items[idx])) {
            return true;
          }
        }
      }
    }
    return false;
  };
  _proto.clear = function clear() {
    for (var _iterator = _createForOfIteratorHelperLoose(this.gridIndex), _step; !(_step = _iterator()).done;) {
      var gIndex = _step.value;
      gIndex[1].index = [];
    }
    for (var i = 0, len = this.items.length; i < len; i++) {
      delete this.items[i]._insert;
    }
    this.items = [];
    return this;
  };
  _proto.all = function all() {
    return this.items;
    // const result = [];
    // for (const index of this.gridIndex) {
    //     const items = index[1].items;
    //     if (!items || !items.length) {
    //         continue;
    //     }
    //     for (let i = 0, len = items.length; i < len; i++) {
    //         const item = items[i];
    //         if (result.indexOf(item) === -1) {
    //             result.push(item);
    //         }
    //     }
    // }
    // return result;
  };
  return RectCollision;
}();

export { GRIDHEIGHT, GRIDWIDTH, RectCollision };
