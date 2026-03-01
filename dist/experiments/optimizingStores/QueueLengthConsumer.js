"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueLengthConsumer = void 0;
class NaiveStore {
    lookupFuture = () => ({});
    queueLength = 0;
}
class QueueLengthConsumer {
    naiveStore = new NaiveStore();
    setValue(key, value) {
        const lookupFuture = this.naiveStore.lookupFuture;
        this.naiveStore.lookupFuture = () => {
            const lookup = lookupFuture();
            lookup[key] = value;
            return lookup;
        };
        this.naiveStore.queueLength++;
    }
    getValue(key) {
        if (this.naiveStore.queueLength > 1) {
            this.naiveStore.queueLength = 0;
            const result = this.naiveStore.lookupFuture();
            this.naiveStore.lookupFuture = () => result;
            return result[key];
        }
        return this.naiveStore.lookupFuture()[key];
    }
}
exports.QueueLengthConsumer = QueueLengthConsumer;
