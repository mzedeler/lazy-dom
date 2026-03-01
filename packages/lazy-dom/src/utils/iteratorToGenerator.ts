export function *iteratorToGenerator<T>(iterator: Iterator<T>): Generator<T> {
  for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
    yield value
  }
}
