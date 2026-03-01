"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaiveConsumer = void 0;
class NaiveStore {
    lookupFuture = () => ({});
}
class NaiveConsumer {
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
        return this.naiveStore.lookupFuture()[key];
    }
}
exports.NaiveConsumer = NaiveConsumer;
