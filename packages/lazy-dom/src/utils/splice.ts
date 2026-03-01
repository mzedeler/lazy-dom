export function* splice<T>(...iterators: Array<Iterator<T>>) {
  for (const iterator of iterators) {
    for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
      yield value;
    }
  }
}
