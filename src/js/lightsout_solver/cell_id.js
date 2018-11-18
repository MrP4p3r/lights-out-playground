'use strict';

/**
 * Helper to create cell identifier object.
 *
 * @param {Number} i
 * @param {Number} j
 * @return {{i: *, j: *}}
 */
let CellId = function (i, j) {
    return {i: i, j: j};
};

export default CellId;
