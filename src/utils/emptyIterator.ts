export const emptyIterator: Iterator<any> = {
  next() {
    return { value: undefined, done: true };
  }
};
