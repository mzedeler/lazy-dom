export const iteratorToArray = <T>(iterator: Iterator<T>): Array<T> => {
  const result: Array<T> = []
  for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
    result.push(value)
  }
  return result
}
