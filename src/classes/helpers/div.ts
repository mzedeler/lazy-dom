export const div = (id: string, ...children: Node[]) => {
  const result = document.createElement('div')
  result.setAttribute('id', id)
  for (const child of children) {
    result.appendChild(child)
  }
  return result
}
