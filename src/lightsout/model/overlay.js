import { State } from './state';
import { CellId } from './cell_id';

/**
 * Helper for solution finding algorithm.
 * 
 * @param {Number} size
 * @constructor
 */
export let BinaryMatrixOverlay = function (size) {
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
 * @param {{i: Number, j: Number}} id
 * @return {boolean}
 */
BinaryMatrixOverlay.prototype.has = function (id) {
    let layer = this._filledCellsStack[this._filledCellsStack.length - 1];
    return (layer === undefined ? false : layer.has(id));
};


/**
 * @return {boolean}
 */
BinaryMatrixOverlay.prototype.hasAllValues = function () {
    return (
        this._filledCellsStack.length
        && this._filledCellsStack[this._filledCellsStack.length - 1].size === (this.size * this.size)
    );
};


/**
 * @return {State}
 */
BinaryMatrixOverlay.prototype.toState = function () {
    let items = [];
    for (let i = 0; i < this.size; i++) {
        items.push([]);
        for (let j = 0; j < this.size; j++) {
            items[i].push(this.get(CellId(i, j)));
        }
    }
    return new State(this.size, items);
};
