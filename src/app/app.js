/*
 * GUI application code
 */

import Reef from 'reef/dist/reef';

import AppModel from './model';
import AppView from './view';
import AppController from './controller';


let startApp = function () {
    let model = new AppModel();
    let state = new Reef(null, {lagoon: true, data: model});
    let controller = new AppController(state);
    let view = new AppView(controller);

    controller.initialize();
    view.attachTo(state);
    view.setupEventListeners();
    view.render();
};

export { startApp };
