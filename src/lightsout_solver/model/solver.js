/*
 * State solver module.
 *
 * Use findStatesByPresentation(...) to find all states leading to a given presentation;
 */

import BinaryMatrixOverlay from './overlay.js';
import CellId from './cell_id.js';

/**
 * @typedef {{i: Number, j: Number}} CID
 * @typedef {Map<CID, boolean>} Assumption
 * @typedef {Array<Assumption>} Assumptions
 * @typedef {Array<Assumptions>} AssumptionsStack
 */

/**
 * @param {Presentation} presentation
 * @return State[]
 */
let findStatesByPresentation = function (presentation) {
    /** @type State[] */
    let states = [];

    /** @type AssumptionsStack */
    let assumptionsStack = [];

    /** @type Array<Number> */
    let assumptionsIndexesStack = [];

    let pos = 0;
    let size = presentation.size;
    let indexer = new _Indexer(size);
    let id = indexer.get(pos);
    let value = presentation.items[id.i][id.j];
    let overlay = new BinaryMatrixOverlay(size);

    assumptionsStack.push(_makeAssumptions(size, id, value, overlay));
    assumptionsIndexesStack.push(-1);

    while (assumptionsStack.length !== 0) {
        let assumptionIndex = ++assumptionsIndexesStack[assumptionsIndexesStack.length - 1];
        let assumptionsAvailableCount = assumptionsStack[assumptionsStack.length - 1].length;
        if (assumptionIndex >= assumptionsAvailableCount) {
            pos--;
            overlay.pop();
            assumptionsStack.pop();
            assumptionsIndexesStack.pop();
            continue;
        }

        let nextAssumption = assumptionsStack[assumptionsStack.length - 1][assumptionIndex];
        overlay.push(nextAssumption);

        if (pos === (size * size - 1) && overlay.hasAllValues()) {
            states.push(overlay.toState());
            overlay.pop();
            continue;
        }

        id = indexer.get(++pos);
        value = presentation.items[id.i][id.j];
        let newAssumptions = _makeAssumptions(size, id, value, overlay);
        if (newAssumptions === null) {
            pos--;
            overlay.pop();
            continue;
        }

        assumptionsStack.push(newAssumptions);
        assumptionsIndexesStack.push(-1);
    }

    return states;
};

export default findStatesByPresentation;


/**
 * @private
 * @param {Number} size
 * @param {CID} id
 * @param {boolean} value
 * @param {BinaryMatrixOverlay} overlay
 * @return Assumptions|null
 */
let _makeAssumptions = function(size, id, value, overlay) {
    let cellIndexes = [id];
    if (id.i > 0)
        cellIndexes.push(CellId(id.i - 1, id.j));
    if (id.i < size - 1)
        cellIndexes.push(CellId(id.i + 1, id.j));
    if (id.j > 0)
        cellIndexes.push(CellId(id.i, id.j - 1));
    if (id.j < size - 1)
        cellIndexes.push(CellId(id.i, id.j + 1));

    /** @type Array<CID> */
    let nonEmptyCells = [...cellIndexes].filter(cid => overlay.has(cid));

    /** @type boolean */
    let nonEmptyCellsSum = nonEmptyCells.reduce((acc, cid) => (acc !== overlay.get(cid)), false);

    if (nonEmptyCells.length === cellIndexes.length) {
        if (value === nonEmptyCellsSum) {
            return [new Map()];
        } else {
            return null;
        }
    }

    /** @type Array<CID> */
    let emptyCells = [...cellIndexes].filter(cid => !overlay.has(cid));

    /** @type Assumptions */
    let assumptions = [];

    for (let values of iterBoolArrays(emptyCells.length)) {
        let totalSum = values.reduce((acc, val) => (acc !== val), nonEmptyCellsSum);
        if (totalSum === value) {
            let assumption = new Map(zip(emptyCells, values));
            assumptions.push(assumption);
        }
    }

    if (assumptions.length === 0) {
        return null;
    }

    return assumptions;
};


/**
 * @param {Number} size
 * @private
 */
let _Indexer = function (size) {
    /** @type Number */
    this.size = size;
};

/**
 * @param {Number} pos
 * @return {CID}
 */
_Indexer.prototype.get = function(pos) {
    return CellId(
        Math.floor(pos / this.size),
        pos % this.size,
    );
};


/**
 * Generate all combinations of boolean arrays with given length
 *
 * @param {Number} length
 * @return {IterableIterator<Array<boolean>>}
 */
const iterBoolArrays = function* (length) {
    let maxNum = 2**length;
    for (let num = 0; num < maxNum; num++) {
        let arr = [];
        for (let idx = 0; idx < length; idx++) {
            arr.push((num & (1 << idx)) > 0);
        }
        yield arr;
    }
};


/**
 * Same as zip() in Python
 *
 * @param arr
 * @param arrays
 * @return {IterableIterator<Array>}
 */
const zip = function* (arr, ...arrays) {
    let idxLim = arrays
        .map(a => a.length)
        .reduce((acc, val) => (val < acc ? val : acc), arr.length);
    for (let idx = 0; idx < idxLim; idx++) {
        yield [arr[idx], ...(arrays.map(a => a[idx]))];
    }
};


/**
 * Split by predicate.
 *
 * @param {Iterable} iterable
 * @param {function} predicate
 */
const split = function (iterable, predicate) {
    let result = { true: [], false: []};
    for (let value of iterable) {
        if (predicate(value)) {
            result.true.push(value);
        } else {
            result.false.push(value);
        }
    }
    return [];
};