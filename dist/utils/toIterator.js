"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIterator = toIterator;
function* toIterator(a) {
    for (const item of a) {
        yield item;
    }
}
