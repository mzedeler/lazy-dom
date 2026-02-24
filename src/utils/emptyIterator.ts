export const emptyIterator: IterableIterator<any> = {
  next() {
    return { value: undefined, done: true };
  },
  [Symbol.iterator]() {
    return this;
  }
};
