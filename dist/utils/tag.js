"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tag = void 0;
const tag = (nameSpace, localName, ...children) => {
    const result = document.createElementNS(nameSpace, localName);
    for (const child of children) {
        result.appendChild(child);
    }
    return result;
};
exports.tag = tag;
