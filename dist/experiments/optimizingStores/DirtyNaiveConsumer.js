"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirtyNaiveConsumer = void 0;
class NaiveStore {
    lookupFuture = () => ({});
    dirty = false;
}
class DirtyNaiveConsumer {
    naiveStore = new NaiveStore();
    setValue(key, value) {
        const lookupFuture = this.naiveStore.lookupFuture;
        this.naiveStore.dirty = true;
        this.naiveStore.lookupFuture = () => {
            const lookup = lookupFuture();
            lookup[key] = value;
            return lookup;
        };
    }
    getValue(key) {
        if (this.naiveStore.dirty) {
            const result = this.naiveStore.lookupFuture();
            this.naiveStore.lookupFuture = () => result;
            this.naiveStore.dirty = false;
            return result[key];
        }
        return this.naiveStore.lookupFuture()[key];
    }
}
exports.DirtyNaiveConsumer = DirtyNaiveConsumer;
