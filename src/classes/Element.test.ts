import { expect } from 'chai'

describe('Element', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  it('can be created', () => {
    const element = document.createElement('div')

    expect(element).to.be.instanceOf(HTMLDivElement)
  })

  it('has tagName', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('tagName', 'DIV')
  })

  it('has nodeType set to ELEMENT_NODE (1)', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('nodeType', 1)
  })

  it('has addEventListener()', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('addEventListener')
    expect(element.addEventListener).to.be.instanceof(Function)
  })

  it('has ownerDocument', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('ownerDocument', document)
  })

  it('has addEventListener', () => {
    const element = document.createElement('div')

    expect(element).to.have.property('addEventListener')
    expect(element).to.have.property('addEventListener').instanceOf(Function)
  })

  it('is possible to call addEventListener', () => {
    const element = document.createElement('div')

    expect(() => element.addEventListener('click', () => {})).not.to.throw
  })

  const div = (id: string, ...children: Node[]) => {
    const result = document.createElement('div')
    result.setAttribute('id', id)
    for (const child of children) {
      result.appendChild(child)
    }
    return result
  }

  it('has removeChild()', () => {
    const rootId = 'root'
    const parent1Id = 'parent1'
    const parent2Id = 'parent2'
    const parent1Leaf1Id = 'leaf11'
    const parent1Leaf2Id = 'leaf12'
    const parent2Leaf = 'leaf2'
    const root =
      div(rootId,
        div(parent1Id,
          div(parent1Leaf1Id),
          div(parent1Leaf2Id)
        ),
        div(parent2Id,
          div(parent2Leaf)
        )
      )

    document.body.appendChild(root)
    const parent1 = document.getElementById(parent1Id)
    if (!parent1) {
      throw new Error('assertion failed: this element should exist')
    }

    root.removeChild(parent1)

    expect(root.outerHTML).to.eql('<div id="root"><div id="parent2"><div id="leaf2"></div></div></div>')
    expect(document.getElementById(parent1Id)).to.be.null
    expect(document.getElementById(parent1Leaf1Id)).to.be.null
    expect(document.getElementById(parent1Leaf2Id)).to.be.null
  })
})
