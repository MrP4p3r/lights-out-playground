/**
 * Helper to create cell identifier object.
 *
 * @param {Number} i
 * @param {Number} j
 * @return {{i: *, j: *}}
 */
let CellId = (function () {
    let cached = {};
    return function (i, j) {
        if (cached[i] === undefined) {
            cached[i] = {};
        }
        if (cached[i][j] === undefined) {
            cached[i][j] = {i: i, j: j};
        }
        return cached[i][j];
    };
})();

export default CellId;
