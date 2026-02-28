"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.div = void 0;
const div = (id, ...children) => {
    const result = document.createElement('div');
    result.setAttribute('id', id);
    for (const child of children) {
        result.appendChild(child);
    }
    return result;
};
exports.div = div;
