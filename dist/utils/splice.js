"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splice = splice;
function* splice(...iterators) {
    for (const iterator of iterators) {
        for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
            yield value;
        }
    }
}
