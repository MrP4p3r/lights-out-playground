/*
 * Application view
 */

import Reef from 'reef/dist/reef';
import renderAppView from './renderers.js';

/**
 * Application View.
 * @return Reef
 * @constructor
 */
let AppView = function (controller) {
    this.controller = controller;
    this.component = new Reef('#app_root', {template: renderAppView});
};

export default AppView;

AppView.prototype.attachTo = function (state) {
    this.component.data = state.data;
    state.attach(this.component);
};

AppView.prototype.render = function () {
    this.component.render();
};

AppView.prototype.setupEventListeners = function () {
    let controller = this.controller;
    document.addEventListener('click', function (event) {
        let elem = event.target;
        if (elem.classList.contains('cell')) {
            let i = Number.parseInt(elem.getAttribute('data-cell-i'));
            let j = Number.parseInt(elem.getAttribute('data-cell-j'));
            controller.clickCell(i, j);
        } else if (elem.id === 'button-solve') {
            controller.solve();
        } else if (elem.id === 'button-inc-size' || elem.id === 'button-dec-size') {
            let sizeDelta = (elem.id === 'button-inc-size' ? 1 : -1);
            let newSize = controller.getFieldSize() + sizeDelta;
            controller.setFieldSize(newSize);
        } else if (elem.id === 'button-play-mode') {
            controller.setPlayMode(!controller.getPlayMode());
        } else if (elem.id === 'button-randomize') {
            controller.randomizeField();
        } else if (elem.id === 'button-clean') {
            controller.cleanField();
        }
    });
};
