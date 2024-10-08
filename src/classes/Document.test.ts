import { expect } from 'chai'

describe('Document', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  it('initializes correctly', () => {
    expect(document).to.exist
  })

  it('has createElement()', () => {
    document.createElement('div')
  })

  it('has createTextNode()', () => {
    document.createTextNode('hello there')
  })

  describe('getElementById()', () => {
    it('does not return elements that have not been attached', () => {
      const id = '1'
      const element = document.createElement('div')
      element.setAttribute('id', id)

      expect(document.getElementById(id)).to.be.null
    })

    it('has getElementById()', () => {
      const id = '1'
      const element = document.createElement('div')
      element.setAttribute('id', id)
      document.body.appendChild(element)
  
      const result = document.getElementById(id)
  
      expect(result).to.eq(element)
    })

    it('getElementById() can distinguish between two elements', () => {
      const id = '1'
      const element = document.createElement('div')
      element.setAttribute('id', id)
      document.body.appendChild(element)

      const id2 = '2'
      const element2 = document.createElement('span')
      element2.setAttribute('id', id2)
      document.body.appendChild(element2)

      const result = document.getElementById(id)
      expect(result).to.eq(element)

      const result2 = document.getElementById(id2)
      expect(result2).to.eq(element2)
    })
  })
})