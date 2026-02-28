"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = invariant;
class InvariantError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvariantError';
    }
}
function invariant(condition, message) {
    if (!condition) {
        throw new InvariantError(message);
    }
}
invariant.InvariantError = InvariantError;
