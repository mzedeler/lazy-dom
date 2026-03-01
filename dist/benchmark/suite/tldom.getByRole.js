"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tldomGetByRole = void 0;
const dom_1 = require("@testing-library/dom");
const NODE_COUNT = 100;
const tldomGetByRole = () => {
    const container = document.createElement('div');
    for (let i = 0; i < NODE_COUNT; i++) {
        const div = document.createElement('div');
        const span = document.createElement('span');
        span.appendChild(document.createTextNode('item ' + i));
        div.appendChild(span);
        container.appendChild(div);
    }
    const button = document.createElement('button');
    button.appendChild(document.createTextNode('Click me'));
    container.appendChild(button);
    document.body.appendChild(container);
    const { getByRole } = (0, dom_1.getQueriesForElement)(document.body);
    getByRole('button');
    document.body.removeChild(container);
};
exports.tldomGetByRole = tldomGetByRole;
