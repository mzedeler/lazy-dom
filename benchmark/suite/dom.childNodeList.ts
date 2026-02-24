const CHILD_COUNT = 100

export const childNodeListIndexAccess = () => {
  const parent = document.createElement('div')
  for (let i = 0; i < CHILD_COUNT; i++) {
    parent.appendChild(document.createTextNode('item ' + i))
  }
  document.body.appendChild(parent)

  let sum = 0
  for (let i = 0; i < parent.childNodes.length; i++) {
    sum += parent.childNodes[i].nodeType
  }

  document.body.removeChild(parent)
  return sum
}

export const childNodeListIteration = () => {
  const parent = document.createElement('div')
  for (let i = 0; i < CHILD_COUNT; i++) {
    parent.appendChild(document.createTextNode('item ' + i))
  }
  document.body.appendChild(parent)

  let sum = 0
  parent.childNodes.forEach((node) => {
    sum += node.nodeType
  })

  document.body.removeChild(parent)
  return sum
}

export const childNodeListLength = () => {
  const parent = document.createElement('div')
  for (let i = 0; i < CHILD_COUNT; i++) {
    parent.appendChild(document.createTextNode('item ' + i))
  }
  document.body.appendChild(parent)

  const len = parent.childNodes.length

  document.body.removeChild(parent)
  return len
}

export const childNodeListArrayFrom = () => {
  const parent = document.createElement('div')
  for (let i = 0; i < CHILD_COUNT; i++) {
    parent.appendChild(document.createTextNode('item ' + i))
  }
  document.body.appendChild(parent)

  const arr = Array.from(parent.childNodes)

  document.body.removeChild(parent)
  return arr.length
}
