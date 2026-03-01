export const emptyIterator: IterableIterator<never> = {
  next() {
    return { value: undefined, done: true as const };
  },
  [Symbol.iterator]() {
    return this;
  }
};
