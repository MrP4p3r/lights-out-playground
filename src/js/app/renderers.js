/*!
 * Dumb view functions
 */

import '../../css/app.css';

/**
 * @param {AppModel} props
 * @return {string}
 */
let renderAppView = function (props) {
    let size = props.size;
    let rows = props.items;
    let tips = props.tips;

    let html = '';
    html += renderHeader();
    html += renderControls(props.showSolution, props.playMode);
    html += renderGameField(size, rows, tips, props.showSolution);
    html += renderNote(props.solverSucceed);
    return html;
};

export default renderAppView;

/**
 * Header renderer;
 */
let renderHeader = function() {
    return '<header><div class="title"><span>Lights Out Playground</span></div></header>';
};

/**
 * Controls renderer.
 */
let renderControls = function (showSolutionEnabled, playModeEnabled) {
    let html = '';
    html += '<div id="field-controls">';
    html += `<a id="button-solve" class="button main ${showSolutionEnabled ? 'active' : ''}">Solve!</a>`;
    html += `<a id="button-play-mode" class="button ${playModeEnabled ? 'active' : ''}">Play</a>`;
    html += '<a id="button-randomize" class="button">Randomize</a>';
    html += '<a id="button-clean" class="button">Clean</a>';
    html += '<a id="button-dec-size" class="button">Size--</a>';
    html += '<a id="button-inc-size" class="button">Size++</a>';
    html += '</div>';
    return html
};

/**
 * Note renderer.
 * @param {boolean} solverSucceed
 */
let renderNote = function (solverSucceed) {
    let html = '';
    if (solverSucceed === false) {
        html += '<div class="note"><p>It seems this field presentation is not valid.</p></div>'
    }
    return html;
};

/**
 * Game field renderer.
 */
let renderGameField = (function () {
    let renderer = {
        render: function (size, rows, tipRows, highlight) {
            let html = '<div class="game-field">';
            for (let i = 0; i < size; i++) {
                html += this._renderRow(size, i, rows[i], tipRows[i], highlight);
            }
            html += '</div>';
            return html
        },
        _renderRow: function (size, i, values, tips, highlight) {
            let html = '<div class="cells-row">';
            for (let j = 0; j < size; j++) {
                html += this._renderCell(i, j, values[j], tips[j], highlight);
            }
            html += '</div>';
            return html
        },
        _renderCell: function (i, j, value, tipValue, highlight) {
            let html = '';
            html += `<div class="cell-wrapper" data-cell-highlight="${highlight ? tipValue : false}"> `;
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
