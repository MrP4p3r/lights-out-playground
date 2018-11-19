/*!
 * Main API of this package.
 * Use findSolution(...) to find efficient solution for Lights Out game.
 */

'use strict';

import Presentation from './presentation.js';
import State from './state.js';
import Solution from './solution.js';
import findStatesByPresentation from './solver.js';

/**
 * @param {Number} fieldSize
 * @desc Game field side length
 * @param {Array<Array<boolean>>} presentationMatrix
 * @desc What player sees
 * @constructor
 */
let FindSolutionRequest = function (fieldSize, presentationMatrix) {
    this.fieldSize = fieldSize;
    this.presentationMatrix = presentationMatrix;
};

/**
 * @desc Cells player have to toggle
 * @param {Number} fieldSize
 * @desc Game field side length
 * @param {boolean} success
 * @param {Number} [fieldSize]
 * @param {boolean[][]} [diffMatrix]
 * @constructor
 */
let FindSolutionResponse = function (success, fieldSize, diffMatrix) {
    /** @type boolean */
    this.success = success;

    /** @type Number */
    this.fieldSize = fieldSize;

    /** @type boolean[][] */
    this.diffMatrix = diffMatrix;
};

/**
 * @param {FindSolutionRequest} request
 * @return FindSolutionResponse
 */
let findSolution = function (request) {
    let size = request.fieldSize;

    let presentation = new Presentation(size, request.presentationMatrix);
    let invPresentation = presentation.inverse();

    let possibleStates = findStatesByPresentation(invPresentation);
    let possibleSolutions = possibleStates.map(function (/** @type State */state) {
        return new Solution(state.size, state.items);
    });

    if (possibleSolutions.length === 0) {
        return new FindSolutionResponse(false);
    }

    let solution = _chooseEfficientSolution(possibleSolutions);
    return new FindSolutionResponse(true, size, solution.items);
};

export {findSolution, FindSolutionRequest, FindSolutionResponse};

/**
 * @param {Solution[]} possibleStates
 * @private
 * @return Solution
 */
let _chooseEfficientSolution = function (possibleStates) {
    let efficientSolution = possibleStates[0];
    let efficientSolutionEffectiveness = efficientSolution.getEffectiveness();
    for (let idx = 1; idx < possibleStates.length; idx++){
        let currentEffectiveness = possibleStates[idx].getEffectiveness();
        if (currentEffectiveness < efficientSolutionEffectiveness) {
            // The smaller the better
            efficientSolution = possibleStates[idx];
            efficientSolutionEffectiveness = currentEffectiveness;
        }
    }
    return efficientSolution;
};
