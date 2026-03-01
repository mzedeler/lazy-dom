"use strict";
/**
 * Benchmarks for setAttribute thunk chain depth.
 * Tests the O(N^2) closure chain hypothesis: each setAttribute wraps a new thunk,
 * and reading attributes evaluates the full chain.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAttributeOverwrite50 = exports.setAttribute100 = exports.setAttribute50 = exports.setAttribute10 = void 0;
function setAttributesAndRead(count) {
    const el = document.createElement('div');
    document.body.appendChild(el);
    for (let i = 0; i < count; i++) {
        el.setAttribute(`data-attr-${i}`, `value-${i}`);
    }
    // Force evaluation of the full thunk chain
    const len = el.attributes.length;
    document.body.removeChild(el);
    return len;
}
const setAttribute10 = () => setAttributesAndRead(10);
exports.setAttribute10 = setAttribute10;
const setAttribute50 = () => setAttributesAndRead(50);
exports.setAttribute50 = setAttribute50;
const setAttribute100 = () => setAttributesAndRead(100);
exports.setAttribute100 = setAttribute100;
const setAttributeOverwrite50 = () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    for (let i = 0; i < 50; i++) {
        el.setAttribute('data-x', `value-${i}`);
    }
    // Force evaluation
    const val = el.getAttribute('data-x');
    document.body.removeChild(el);
    return val;
};
exports.setAttributeOverwrite50 = setAttributeOverwrite50;
