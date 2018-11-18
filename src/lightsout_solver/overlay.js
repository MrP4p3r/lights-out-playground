'use strict';

/**
 * Helper for solution finding algorithm.
 * 
 * @param {Number} size
 * @constructor
 */
let BinaryMatrixOverlay = function (size) {
    /** @type Number */
    this.size = size;

    /**
     * @type {Array<Map<{i: Number, j: Number}, boolean>>}
     * @protected
     */
    this._cellsStack = [];

    /**
     * @type {Array<Set<{i: Number, j: Number}>>}
     * @protected
     */
    this._filledCellsStack = [];
};


export default BinaryMatrixOverlay;


/**
 * @param {Map<{i: Number, j: Number}, boolean>} cells
 */
BinaryMatrixOverlay.prototype.push = function (cells) {
    let filledCells;
    this._cellsStack.push(cells);

    if (this._filledCellsStack.length === 0) {
        filledCells = new Set();
    } else {
        filledCells = this._filledCellsStack[this._filledCellsStack.length - 1];
    }

    filledCells = new Set([
        ...filledCells,
        ...cells.keys(),
    ]);

    this._filledCellsStack.push(filledCells);
};


BinaryMatrixOverlay.prototype.pop = function() {
    this._cellsStack.pop();
    this._filledCellsStack.pop();
};


/**
 * @param {{i: Number, j: Number}} id
 * @return {boolean|null}
 */
BinaryMatrixOverlay.prototype.get = function (id) {
    if ((this._filledCellsStack.length === 0)
        || !(this._filledCellsStack[this._filledCellsStack.length - 1].has(id))) {
        return null;
    }
    for (let layerIdx = 0; layerIdx < this._cellsStack.length; layerIdx++) {
        if (this._cellsStack[layerIdx].has(id)) {
            return this._cellsStack[layerIdx].get(id);
        }
    }
};


/**
 * @param {{i: Number, j: Number}} id
 * @param {boolean} value
 */
BinaryMatrixOverlay.prototype.set = function (id, value) {
    this._cellsStack[this._cellsStack.length - 1].set(id, value);
    this._filledCellsStack[this._filledCellsStack.length - 1].add(id);
};


/**
 * @return {boolean}
 */
BinaryMatrixOverlay.prototype.hasAllValues = function () {
    return (
        this._filledCellsStack.length
        && this._filledCellsStack[this._filledCellsStack.length - 1].length === (this.size * this.size)
    );
};
