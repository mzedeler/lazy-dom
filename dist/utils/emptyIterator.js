"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyIterator = void 0;
exports.emptyIterator = {
    next() {
        return { value: undefined, done: true };
    },
    [Symbol.iterator]() {
        return this;
    }
};
