'use strict';

/**
 * Solution class.
 * Represents game field changes to achieve another specific state.
 */

import BinaryMatrix from './binary_matrix';

let Solution = function (...args) {
    BinaryMatrix.call(this, ...args);
};

export default Solution;

Solution.prototype = Object.create(BinaryMatrix.prototype);

/**
 * @return Number
 */
Solution.prototype.getEffectiveness = function () {
    let nChanges = 0;
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            if (this.items[i][j]) {
                nChanges++;
            }
        }
    }
    return nChanges;
};
