import { BinaryMatrix } from './binary_matrix';
import { State } from "./state";

/**
 * Presentations class.
 * Represents what player sees on the game field
 *
 * @extends BinaryMatrix
 * @constructor
 */
export let Presentation = function (...args) {
    BinaryMatrix.call(this, ...args);
};

Presentation.prototype = Object.create(BinaryMatrix.prototype);

/**
 * @param {State} state
 * @return {boolean}
 */
Presentation.prototype.fitsState = function (state) {
    if (state.size !== this.size) {
        throw 'Presentation and state sizes must match';
    }

    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            if (state.getSum(i, j) !== this.items[i][j]) {
                return false
            }
        }
    }

    return true;
};

Presentation.prototype.inverse = function () {
    let newItems = [];
    for (let i = 0; i < this.size; i++) {
        newItems.push([]);
        for (let j = 0; j < this.size; j++) {
            newItems[i].push(!this.items[i][j]);
        }
    }
    return new Presentation(this.size, newItems);
};

Presentation.prototype.toggle = function (i, j) {
    let m = this.items;
    let size = this.size;
    m[i][j] = m[i][j] !== true;
    if (i > 0) m[i-1][j] = !m[i-1][j];
    if (i < size - 1) m[i+1][j] = !m[i+1][j];
    if (j > 0) m[i][j-1] = !m[i][j-1];
    if (j < size - 1) m[i][j+1] = !m[i][j+1];
};

/**
 * @param size
 * @param {function} valueFactory
 * @constructor
 */
Presentation.MakeNew = function (size, valueFactory) {
    let items = [];
    for (let i = 0; i < size; i++) {
        items.push([]);
        for (let j = 0; j < size; j++) {
            items[i].push(valueFactory(i, j));
        }
    }
    return new Presentation(size, items);
};
