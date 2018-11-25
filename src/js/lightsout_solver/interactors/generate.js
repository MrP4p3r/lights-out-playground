/*!
 * Use generate(...) to generate a new field
 */

'use strict';

import Presentation from '../model/presentation.js';
import State from "../model/state.js";

/**
 * @param {Number} fieldSize
 * @param {boolean} empty
 */
let GenerateRequest = function (fieldSize, empty) {
    this.fieldSize = fieldSize;
    this.empty = empty;
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
    let valueFactory = request.empty ? () => false : (() => (Math.random() < 0.5));
    let state = new State.MakeNew(request.fieldSize, valueFactory);
    let presentation = new Presentation.MakeNew(request.fieldSize, (i, j) => state.getSum(i, j));
    return new GenerateResponse(presentation.items);
};

export {GenerateRequest, GenerateResponse, generate};
