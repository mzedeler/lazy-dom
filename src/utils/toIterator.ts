export function* toIterator<T>(a: Array<T>): Iterator<T> {
  for (const item of a) {
    yield item;
  }
}
