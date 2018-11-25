/*!
 * Use generate(...) to generate a new field
 */

'use strict';

import Presentation from '../model/presentation.js';
import State from "../model/state.js";

/**
 * @param {Number} fieldSize
 * @param {boolean|null} fillDirective
 */
let GenerateRequest = function (fieldSize, fillDirective) {
    this.fieldSize = fieldSize;
    this.fillDirective = fillDirective;
};

/**
 * @param {Array<Array<boolean>>} presentationMatrix;
 */
let GenerateResponse = function (presentationMatrix) {
    this.presentationMatrix = presentationMatrix;
};

/**
 * @param {GenerateRequest} request
 * @return GenerateResponse
 */
let generate = function (request) {
    let presentation;
    let size = request.fieldSize;

    switch (request.fillDirective) {
        case null:
            let state = State.MakeNew(size, () => (Math.random() < 0.5));
            presentation = new Presentation.MakeNew(request.fieldSize, (i, j) => state.getSum(i, j));
            break;
        case true:
        case false:
            presentation = new Presentation.MakeNew(request.fieldSize, () => request.fillDirective);
            break;
        default:
            throw `Unknown fillDirective ${request.fillDirective}`;
    }

    return new GenerateResponse(presentation.items);
};

export {GenerateRequest, GenerateResponse, generate};
