"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iteratorToGenerator = iteratorToGenerator;
function* iteratorToGenerator(iterator) {
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
        yield value;
    }
}
