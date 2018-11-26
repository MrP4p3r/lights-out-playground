/**
 * Binary matrix class.
 * Base for all game field related classes;
 * @param {Number} size
 * @param {Array<Array<boolean>>} items
 * @constructor
 */
export let BinaryMatrix = function (size, items) {
    this.size = size;
    this.items = items;
};

BinaryMatrix.makeNewEmpty = function (size) {
    let items = [];

    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(false);
        }
        items.push();
    }

    return new BinaryMatrix(size, items);
};
