"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iteratorToArray = void 0;
const iteratorToArray = (iterator) => {
    const result = [];
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
        result.push(value);
    }
    return result;
};
exports.iteratorToArray = iteratorToArray;
