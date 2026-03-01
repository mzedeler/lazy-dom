"use strict";
/**
 * Benchmarks for textContent reading.
 * Tests flat vs deep vs mixed child structures.
 * Note: current textContent implementation only reads direct Text children,
 * so textContentDeep20 will reveal that gap.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.textContentMixed = exports.textContentDeep20 = exports.textContentFlat100 = void 0;
const textContentFlat100 = () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    for (let i = 0; i < 100; i++) {
        el.appendChild(document.createTextNode(`text-${i} `));
    }
    const text = el.textContent;
    document.body.removeChild(el);
    return text;
};
exports.textContentFlat100 = textContentFlat100;
const textContentDeep20 = () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    let current = root;
    for (let i = 0; i < 20; i++) {
        current.appendChild(document.createTextNode(`level-${i} `));
        const child = document.createElement('div');
        current.appendChild(child);
        current = child;
    }
    const text = root.textContent;
    document.body.removeChild(root);
    return text;
};
exports.textContentDeep20 = textContentDeep20;
const textContentMixed = () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    for (let i = 0; i < 50; i++) {
        if (i % 2 === 0) {
            const span = document.createElement('span');
            span.appendChild(document.createTextNode(`span-${i} `));
            el.appendChild(span);
        }
        else {
            el.appendChild(document.createTextNode(`text-${i} `));
        }
    }
    const text = el.textContent;
    document.body.removeChild(el);
    return text;
};
exports.textContentMixed = textContentMixed;
