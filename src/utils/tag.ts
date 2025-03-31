export const tag = (nameSpace: string, localName: string, ...children: Node[]) => {
  const result = document.createElementNS(nameSpace, localName)
  for (const child of children) {
    result.appendChild(child)
  }
  return result
}
