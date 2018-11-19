'use strict';

/*!
 * GUI application code
 */

import * as LightsOutSolver from './lightsout_solver/index.js';

/**
 * Application state;
 */
let state = new Reef(null, {
    lagoon: true,
    data: {
        size: 0,
        items: [],
        tips: [],
        solverSucceed: true,
    },
});

/**
 * Root component.
 */
let root = new Reef('#app_root', {
    data: state.data,
    template: function (props) {
        let size = props.size;
        let rows = props.items;
        let tips = props.tips;

        let html = '';
        html += renderControls();
        html += renderGameField(size, rows, tips);
        html += renderNote(props.solverSucceed);
        return html;
    },
    attachTo: [state],
});

/**
 * Controls renderer.
 */
let renderControls = function () {
    let html = '';
    html += '<div id="field-controls">';
    html += '<button id="button-solve">Solve!</button>';
    html += '<button id="button-dec-size">size--</button>';
    html += '<button id="button-inc-size">size++</button>';
    html += '</div>';
    return html
};

/**
 * Note renderer.
 * @param {boolean} solverSucceed
 */
let renderNote = function (solverSucceed) {
    let html = '';
    if (!solverSucceed) {
        html += '<div class="note"><p>It seems this field presentation is not valid.</p></div>'
    }
    return html;
};

/**
 * Game field renderer.
 */
let renderGameField = (function () {
    let renderer = {
        render: function (size, rows, tipRows) {
            let html = '<div class="game-field">';
            for (let i = 0; i < size; i++) {
                html += this._renderRow(size, i, rows[i], tipRows[i]);
            }
            html += '</div>';
            return html
        },
        _renderRow: function (size, i, values, tips) {
            let html = '<div class="cells-row">';
            for (let j = 0; j < size; j++) {
                html += this._renderCell(i, j, values[j], tips[j]);
            }
            html += '</div>';
            return html
        },
        _renderCell: function (i, j, value, tip) {
            let html = '';
            html += `<div class="cell-wrapper" data-cell-highlight="${tip}"> `;
            html += '<div ';
            html += 'class="cell" ';
            html += `data-cell-activated=${value} `;
            html += `data-cell-i=${i} `;
            html += `data-cell-j=${j} `;
            html += '></div></div>';
            return html
        },
    };
    return renderer.render.bind(renderer);
})();

document.addEventListener('click', function (event) {
    let elem = event.target;
    if (elem.classList.contains('cell')) {
        let i = Number.parseInt(elem.getAttribute('data-cell-i'));
        let j = Number.parseInt(elem.getAttribute('data-cell-j'));
        let data = state.getData();
        data.items[i][j] = !data.items[i][j];
        state.setData({items: data.items});
    } else if (elem.id === 'button-solve') {
        let data = state.getData();
        let request = new LightsOutSolver.FindSolutionRequest(data.size, data.items);
        let response = LightsOutSolver.findSolution(request);
        let update = {solverSucceed: response.success};
        if (response.success) {
            update.tips = response.diffMatrix;
        }
        state.setData(update)
    } else if (elem.id === 'button-inc-size' || elem.id === 'button-dec-size') {
        let sizeDelta = (elem.id === 'button-inc-size' ? 1 : -1);
        let data = state.getData();
        let newSize = data.size + sizeDelta;
        if (newSize < 2 || newSize > 12) {
            // This hardcode does not allow too big and too small fields
            return;
        }
        data.size = newSize;
        data.items = makeRandomItems(newSize);
        data.tips = makeTipsArray(newSize);
        state.setData(data);
    }
});


let makeRandomItems = function (size) {
    let items = [];
    for (let i = 0; i < size; i++) {
        items.push([]);
        for (let j = 0; j < size; j++) {
            items[i].push(Math.random() < 0.1337);
        }
    }
    return items;
};


let makeTipsArray = function (size) {
    let tips = [];
    for (let i = 0; i < size; i++) {
        tips.push([]);
        for (let j = 0; j < size; j++) {
            tips[i].push(false);
        }
    }
    return tips;
};


(function () {
    let data = state.getData();
    let size = 3;
    data.size = size;
    data.items = makeRandomItems(size);
    data.tips = makeTipsArray(size);
    state.setData(data);
})();
