import { BinaryMatrix } from './binary_matrix';

/**
 * Solution class.
 * Represents game field changes to achieve another specific state.
 *
 * @extends BinaryMatrix
 * @constructor
 */
export let Solution = function (...args) {
    BinaryMatrix.call(this, ...args);
};

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
