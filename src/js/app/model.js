/*
 * Application model.
 */

let AppModel = function () {
    this.size = 0;
    this.items = [];
    this.tips = [];
    this.showSolution = false;
    this.solverSucceed = null;
    this.playMode = false;
};

export default AppModel;
