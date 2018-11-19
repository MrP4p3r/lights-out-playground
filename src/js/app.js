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
        size: 3,
        items: [
            [false, false, true],
            [false, true, true],
            [true, true, true],
        ],
        tips: [
            [false, false, false],
            [false, false, false],
            [false, false, false],
        ]
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
        html += renderGameField(size, rows, tips);
        html += '<button id="solve-button">Solve!</button>';
        return html;
    },
    attachTo: [state],
});

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
    } else if (elem.id === 'solve-button') {
        let data = state.getData();
        let request = new LightsOutSolver.FindSolutionRequest(data.size, data.items);
        let response = LightsOutSolver.findSolution(request);
        state.setData({tips: response.diffMatrix})
    }
});

root.render();
