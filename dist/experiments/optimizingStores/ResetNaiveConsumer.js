"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetNaiveConsumer = void 0;
class NaiveStore {
    lookupFuture = () => ({});
}
class ResetNaiveConsumer {
    naiveStore = new NaiveStore();
    setValue(key, value) {
        const lookupFuture = this.naiveStore.lookupFuture;
        this.naiveStore.lookupFuture = () => {
            const lookup = lookupFuture();
            lookup[key] = value;
            return lookup;
        };
    }
    getValue(key) {
        const result = this.naiveStore.lookupFuture();
        this.naiveStore.lookupFuture = () => result;
        return result[key];
    }
}
exports.ResetNaiveConsumer = ResetNaiveConsumer;
