
export const GRIDWIDTH = 100;
export const GRIDHEIGHT = 50;

function bboxCross(bbox1, bbox2) {
    return !(bbox1.maxX < bbox2.minX || bbox1.minY > bbox2.maxY || bbox1.minX > bbox2.maxX || bbox1.maxY < bbox2.minY);
}

// function getItemColRow(item) {
//     const { minX, minY, maxX, maxY } = item;
//     const minCol = Math.floor(minX / GRIDWIDTH), maxCol = Math.ceil(maxX / GRIDWIDTH), minRow = Math.floor(minY / GRIDHEIGHT), maxRow = Math.ceil(maxY / GRIDHEIGHT);
//     return { minCol, maxCol, minRow, maxRow };
// }

export class RectCollision {
    constructor() {
        this.gridIndex = new Map();
        this.items = [];
        this.init();
    }

    init() {
        for (let col = -10; col <= 20; col++) {
            for (let row = -10; row <= 20; row++) {
                const grid = {
                    col,
                    row,
                    index: []
                };
                this.gridIndex.set(`${col}_${row}`, grid);
            }
        }
    }

    insert(item) {
        if (!item) {
            return this;
        }
        if (item._insert) {
            return this;
        }
        item._insert = true;
        const { minX, minY, maxX, maxY } = item;
        const minCol = Math.floor(minX / GRIDWIDTH), maxCol = Math.ceil(maxX / GRIDWIDTH), minRow = Math.floor(minY / GRIDHEIGHT), maxRow = Math.ceil(maxY / GRIDHEIGHT);
        const gridIndex = this.gridIndex;
        const len = this.items.push(item);
        let row = minRow;
        for (let col = minCol; col <= maxCol; col++) {
            row = minRow;
            for (; row <= maxRow; row++) {
                const index = `${col}_${row}`;
                if (col < -10 || col > 20 || row < -10 || row > 20) {
                    if (!gridIndex.has(index)) {
                        gridIndex.set(index, {
                            col,
                            row,
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

    collides(item) {
        if (!item) {
            return false;
        }
        const { minX, minY, maxX, maxY } = item;
        const minCol = Math.floor(minX / GRIDWIDTH), maxCol = Math.ceil(maxX / GRIDWIDTH), minRow = Math.floor(minY / GRIDHEIGHT), maxRow = Math.ceil(maxY / GRIDHEIGHT);
        const cross = bboxCross;
        const gridIndex = this.gridIndex;
        let row = minRow;
        for (let col = minCol; col <= maxCol; col++) {
            row = minRow;
            for (; row <= maxRow; row++) {
                const gridIdx = `${col}_${row}`;
                const grid = gridIndex.get(gridIdx);
                if (!grid) {
                    continue;
                }
                const index = grid.index;
                if (!index.length) {
                    continue;
                }
                for (let i = 0, len = index.length; i < len; i++) {
                    const idx = index[i];
                    if (cross(item, this.items[idx])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    clear() {
        for (const gIndex of this.gridIndex) {
            gIndex[1].index = [];
        }
        for (let i = 0, len = this.items.length; i < len; i++) {
            delete this.items[i]._insert;
        }
        this.items = [];
        return this;
    }

    all() {
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
    }
}
