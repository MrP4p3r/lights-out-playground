/*!
 * Application controller
 */

import Reef from 'reef/dist/reef';
import * as LightsOutSolver from "../lightsout_solver";

/**
 * @param {Reef} state
 * @constructor
 */
let AppController = function (state) {
    this.state = state;
};

export default AppController;

AppController.prototype.initialize = function () {
    this.state.setData(this._makeNewField(3, null));
};

AppController.prototype._makeNewField = function (size, fillDirective) {
    let request = new LightsOutSolver.GenerateRequest(size, fillDirective);
    let items = LightsOutSolver.generate(request).presentationMatrix;

    let tips = [];
    for (let i = 0; i < size; i++) {
        tips.push([]);
        for (let j = 0; j < size; j++) {
            tips[i].push(false);
        }
    }

    return {
        size: size,
        items: items,
        tips: tips,
        solverSucceed: null,
        showSolution: false,
    };
};

/**
 * @return {Number}
 */
AppController.prototype.getFieldSize = function () {
    return this.state.getData().size;
};

/**
 * @param {Number} newSize
 */
AppController.prototype.setFieldSize = function (newSize) {
    if (newSize < 2 || newSize > 12) {
        // This hardcode does not allow too big and too small fields
        return;
    }
    this.state.setData(this._makeNewField(newSize, null));
};

AppController.prototype.solve = function () {
    let data = this.state.getData();

    if (data.showSolution) {
        data.showSolution = false;
        this.state.setData(data);
    } else {
        let request = new LightsOutSolver.FindSolutionRequest(data.size, data.items);
        let response = LightsOutSolver.findSolution(request);
        let update = {solverSucceed: response.success};
        if (response.success) {
            update.tips = response.diffMatrix;
            update.showSolution = true;
        }
        this.state.setData(update)
    }
};

/**
 * @param {Number} i
 * @param {Number} j
 */
AppController.prototype.clickCell = function (i, j) {
    let data = this.state.getData();
    if (!data.playMode) {
        /* Edit mode */
        data.items[i][j] = !data.items[i][j];
        this.state.setData({items: data.items, showSolution: false});
    } else {
        /* Play mode */
        let request = new LightsOutSolver.SwitchCellRequest(data.size, data.items, i, j);
        let response = LightsOutSolver.switchCell(request);
        data.items = response.newPresentationMatrix;
        if (data.solverSucceed) {
            data.tips[i][j] = data.tips[i][j] !== true;
        }
        this.state.setData(data);
    }
};

/**
 * @return {boolean}
 */
AppController.prototype.getPlayMode = function () {
    return this.state.getData().playMode;
};

/**
 * @param {boolean} enabled
 */
AppController.prototype.setPlayMode = function (enabled) {
    let data = this.state.getData();
    data.playMode = enabled;
    this.state.setData(data);
};

AppController.prototype.randomizeField = function () {
    let data = this.state.getData();
    let newData = this._makeNewField(data.size, null);
    this.state.setData(newData);
};

AppController.prototype.cleanField = function () {
    let data = this.state.getData();
    let sum = data.items.reduce((a, v) => (a + v.reduce((a, v) => (a + v), false)), false);

    let fillDirective;
    if (sum === 0) fillDirective = true;
    else if (sum === (data.size * data.size)) fillDirective = false;
    else fillDirective = false;

    this.state.setData(this._makeNewField(data.size, fillDirective));
};
