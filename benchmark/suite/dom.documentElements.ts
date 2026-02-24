const DEPTH = 5
const CHILDREN_PER_NODE = 3

function buildTree() {
  const root = document.createElement('div')
  root.setAttribute('id', 'root')

  function addChildren(parent: Element, depth: number) {
    if (depth >= DEPTH) return
    for (let i = 0; i < CHILDREN_PER_NODE; i++) {
      const child = document.createElement('div')
      child.setAttribute('id', `node-${depth}-${i}`)
      parent.appendChild(child)
      addChildren(child, depth + 1)
    }
  }

  addChildren(root, 1)
  document.body.appendChild(root)
  return root
}

export const documentGetElementById = () => {
  const root = buildTree()

  const result = document.getElementById('node-4-2')

  document.body.removeChild(root)
  return result
}

export const documentGetElementsByTagNameNS = () => {
  const root = buildTree()

  const collection = document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'div')
  const len = collection.length

  document.body.removeChild(root)
  return len
}

export const documentAllLazyDom = () => {
  const root = buildTree()

  const all = document.all
  const len = all.length

  document.body.removeChild(root)
  return len
}

export const documentAllJsdom = () => {
  const root = buildTree()

  const all = document.querySelectorAll('*')
  const len = all.length

  document.body.removeChild(root)
  return len
}
