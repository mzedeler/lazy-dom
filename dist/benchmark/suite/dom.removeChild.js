"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domRemoveChild = void 0;
const domRemoveChild = async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    document.body.removeChild(div);
};
exports.domRemoveChild = domRemoveChild;
