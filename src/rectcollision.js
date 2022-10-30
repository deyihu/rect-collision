
export const GRIDWIDTH = 100;
export const GRIDHEIGHT = 50;

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

export class RectCollision {
    constructor() {
        this.gridIndex = new Map();
        this.init();
    }

    init() {
        for (let col = -10; col <= 20; col++) {
            for (let row = -10; row <= 20; row++) {
                const grid = {
                    col,
                    row,
                    items: []
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
        for (let col = minCol; col <= maxCol; col++) {
            for (let row = minRow; row <= maxRow; row++) {
                const index = `${col}_${row}`;
                if (!gridIndex.has(index)) {
                    gridIndex.set(index, {
                        col,
                        row,
                        items: []
                    });
                }
                gridIndex.get(index).items.push(item);
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
        for (let col = minCol; col <= maxCol; col++) {
            for (let row = minRow; row <= maxRow; row++) {
                const index = `${col}_${row}`;
                const grid = gridIndex.get(index);
                if (!grid) {
                    continue;
                }
                const items = grid.items;
                if (!items.length) {
                    continue;
                }
                for (let i = 0, len = items.length; i < len; i++) {
                    if (cross(item, items[i])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    clear() {
        for (const index of this.gridIndex) {
            const items = index[1].items;
            for (let i = 0, len = items.length; i < len; i++) {
                delete items[i]._insert;
            }
            index[1].items = [];
        }
        return this;
    }

    all() {
        const result = [];
        for (const index of this.gridIndex) {
            const items = index[1].items;
            if (!items || !items.length) {
                continue;
            }
            for (let i = 0, len = items.length; i < len; i++) {
                const item = items[i];
                if (result.indexOf(item) === -1) {
                    result.push(item);
                }
            }
        }
        return result;
    }
}
