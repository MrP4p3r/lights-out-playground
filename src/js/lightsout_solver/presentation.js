'use strict';

import BinaryMatrix from './binary_matrix';

/**
 * Presentations class.
 * Represents what player sees on the game field
 *
 * @extends BinaryMatrix
 * @constructor
 */
let Presentation = function (...args) {
    BinaryMatrix.call(this, ...args);
};

export default Presentation;

Presentation.prototype = Object.create(BinaryMatrix.prototype);

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

