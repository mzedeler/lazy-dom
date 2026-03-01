"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentAllJsdom = exports.documentAllLazyDom = exports.documentGetElementsByTagNameNS = exports.documentGetElementById = void 0;
const DEPTH = 5;
const CHILDREN_PER_NODE = 3;
function buildTree() {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    function addChildren(parent, depth) {
        if (depth >= DEPTH)
            return;
        for (let i = 0; i < CHILDREN_PER_NODE; i++) {
            const child = document.createElement('div');
            child.setAttribute('id', `node-${depth}-${i}`);
            parent.appendChild(child);
            addChildren(child, depth + 1);
        }
    }
    addChildren(root, 1);
    document.body.appendChild(root);
    return root;
}
const documentGetElementById = () => {
    const root = buildTree();
    const result = document.getElementById('node-4-2');
    document.body.removeChild(root);
    return result;
};
exports.documentGetElementById = documentGetElementById;
const documentGetElementsByTagNameNS = () => {
    const root = buildTree();
    const collection = document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'div');
    const len = collection.length;
    document.body.removeChild(root);
    return len;
};
exports.documentGetElementsByTagNameNS = documentGetElementsByTagNameNS;
const documentAllLazyDom = () => {
    const root = buildTree();
    const all = document.all;
    const len = all.length;
    document.body.removeChild(root);
    return len;
};
exports.documentAllLazyDom = documentAllLazyDom;
const documentAllJsdom = () => {
    const root = buildTree();
    const all = document.querySelectorAll('*');
    const len = all.length;
    document.body.removeChild(root);
    return len;
};
exports.documentAllJsdom = documentAllJsdom;
