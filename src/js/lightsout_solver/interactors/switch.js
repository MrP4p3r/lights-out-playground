/*!
 * Use switchCell(...) to process click
 */

'use strict';

import Presentation from '../model/presentation.js';

/**
 * @param {Number} fieldSize
 * @param {Array<Array<boolean>>} presentationMatrix
 * @param {Number} i
 * @param {Number} j
 */
let SwitchCellRequest = function (fieldSize, presentationMatrix, i, j) {
    this.fieldSize = fieldSize;
    this.presentationMatrix = presentationMatrix;
    this.i = i;
    this.j = j;
};

/**
 * @param {Array<Array<boolean>>} newPresentationMatrix;
 */
let SwitchCellResponse = function (newPresentationMatrix) {
    this.newPresentationMatrix = newPresentationMatrix;
};

/**
 * @param {SwitchCellRequest} request
 * @return SwitchCellResponse
 */
let switchCell = function (request) {
    let presentation = new Presentation(request.fieldSize, request.presentationMatrix);
    presentation.toggle(request.i, request.j);
    return new SwitchCellResponse(presentation.items);
};

export {SwitchCellRequest, SwitchCellResponse, switchCell};
