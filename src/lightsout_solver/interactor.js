'use strict';

/**
 * Main API of this package.
 * Use findSolution(...) to find efficient solution for Lights Out game.
 */

import Presentation from './presentation';
import State from './state';
import Solution from './solution';
import findStatesByPresentation from './solver';

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
 * @param {Number} fieldSize
 * @desc Game field side length
 * @param {boolean[][]} diffMatrix
 * @desc Cells player have to toggle
 * @constructor
 */
let FindSolutionResponse = function (fieldSize, diffMatrix) {
    /** @type Number*/
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

    let solution = _chooseEfficientSolution(possibleStates);

    return new FindSolutionResponse(size, diffMatrix);
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
