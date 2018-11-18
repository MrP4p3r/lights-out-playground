'use strict';

/**
 * State solver module.
 *
 * Use findStatesByPresentation(...) to find all states leading to a given presentation;
 */

import BinaryMatrixOverlay from './overlay';
import cellId from './cell_id';


/**
 * @param {Presentation} presentation
 * @return State[]
 */
let findStatesByPresentation = function (presentation) {
    /** @type State[] */
    let states = [];

    let overlay = new BinaryMatrixOverlay(size);

    /** @typedef {Map<{i: Number, j: Number}, boolean>} Assumption */
    /** @type Array<Array<Assumption>> */
    let assumptions = [];

    /** @type Array<Number> */
    let assumptionsIndexes = [];

    let size = presentation.size;
    let m = presentation.items;
    let idxr = new _Indexer(size);
    let pos = 0;
    let id = idxr.get(pos);
    let value = m[id.i][id.j];

    overlay.push(new Map());
    assumptions.push(_makeAssumptions(size, id, value, overlay));
    assumptionsIndexes.push(-1);

    while (assumptions.length !== 0) {
        // Increment top layer assumption index
        let assumptionIdx = ++assumptionsIndexes[assumptionsIndexes.length - 1];
        let nAssumptionsAvailable = assumptions[assumptions.length - 1].length;

        if (assumptionIdx > (nAssumptionsAvailable - 1)) {
            // If we run out of assumptions for current layer
            pos--;
            overlay.pop();
            assumptions.pop();
            assumptionsIndexes.pop();
            continue;
        }

        // Get next assumption and push into overlay
        let assumption = assumptions[assumptions.length - 1][assumptionIdx];
        overlay.push(assumption);

        if (pos === (size * size - 1) && overlay.hasAllValues()) {
            states.push(overlay.toState());
            overlay.pop();
            continue;
        }

        pos++;
        id = idxr.get(pos);
        value = m[id.i][id.j];

        try {
            assumptions.push(_makeAssumptions(size, id, value, overlay));
        } catch {
            pos--;
            overlay.pop();
            continue;
        }

        assumptionsIndexes.push(-1);
    }


    return states;
};

export default findStatesByPresentation;


/**
 * @param {Number} size
 * @param {{i: Number, j: Number}} id
 * @param {boolean} value
 * @param {BinaryMatrixOverlay} overlay
 * @private
 */
let _makeAssumptions = function(size, id, value, overlay) {
    let cellIndexes = [id];
    if (id.i > 0)
        cellIndexes.append(cellId(id.i - 1, id.j));
    if (id.i < size - 1)
        cellIndexes.append(cellId(id.i + 1, id.j));
    if (id.j > 0)
        cellIndexes.append(cellId(id.i, id.j + 1));
    if (id.j < size - 1)
        cellIndexes.append(cellId(id.i, id.j + 1));

    let nonEmptyCellIndexes = new Set(
        cellIndexes
            .map(overlay.get)
            .filter(function (value) {
                if (value === undefined) throw 'wtf?!';
                return value !== null;
            })
    );

    let nonEmptySum = [...nonEmptyCellIndexes].reduce((acc, val) => (acc !== overlay.get(val)), false);
    let emptyCellIndexes = new Set([...cellIndexes].filter(val => !nonEmptyCellIndexes.has(val)))

    if (emptyCellIndexes.length === 0 && nonEmptySum !== value) {
        throw 'AssumptionError';
    }

    let assumptions = [];

    // FIXME: selfproduct(...) is a subject for optimization :)
    for (let values of selfproduct([true, false], emptyCellIndexes.length)) {
        let emptyCells = new Map([...zip(emptyCellIndexes, values)]);
        let totalSum = [...emptyCells.keys()].reduce((acc, val) => emptyCells[val], false);
        if (totalSum === value) {
            assumptions.push(emptyCells);
        }
    }

    if (assumptions.length === 0) {
        throw 'AssumptionError';
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
 * @return {{i: Number, j:Number}}
 */
_Indexer.prototype.get = function(pos) {
    return cellId(
        Math.floor(pos / this.size),
        pos % this.size,
    );
};


const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
const selfproduct = function (arr, repeats) {
    let arrays = [];
    for (let i = 0; i < repeats; i++) arrays.push(arr);
    return cartesian(...arrays)
};

const zip = function* (arr, ...arrays) {
    let idxLim = arrays
        .map(a => a.length)
        .reduce((acc, val) => (val < acc ? val : acc), arr.length);
    for (let idx = 0; idx < idxLim; idx++) {
        yield [arr[idx], ...(arrays.map(a => a[idx]))];
    }
};
