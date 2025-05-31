import { expect } from 'chai'
import { div } from '../utils/div'
import * as CSSselect from 'css-select'

describe('Element', () => {
  beforeEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

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

  it('has textContent getter', () => {
    const text1 = document.createTextNode('some')
    const text2 = document.createTextNode(' ')
    const text3 = document.createTextNode('text')
    const root = div('root', text1, text2, text3)

    console.log(root.textContent)

    expect(root.textContent).to.eql('some text')
  })

  describe('matches()', () => {
    it('can match the element that is being called', () => {
      const root = div('root')
  
      expect(root.matches('#root')).to.be.true
    })
  
    it('can match a child element', () => {
      const child = div('child')
      const root = div('root', child)
  
      expect(root.matches('#root:has(#child)')).to.be.true
    })

    it('supports class selectors', () => {
      const root = div('root')
      root.setAttribute('class', 'root')
  
      expect(root.matches('.root')).to.be.true
    })
  })

  describe('querySelector', () => {
    it('can find a child based on id', () => {
      const child = div('child')
      const root = div('root', child)

      expect(root.querySelector('#child')).to.eq(child)
    })

    it('can find a child based on class', () => {
      const child = div('child')
      child.setAttribute('class', 'child')
      const root = div('root', child)

      expect(root.querySelector('.child')).to.eq(child)
    })

    it.skip('can find a grandchild based on class', () => {
      const grandchild = div('grandchild')
      grandchild.setAttribute('class', 'grandchild')
      const child = div('child')
      const root = div('root', child)

      expect(root.querySelector('.grandchild')).to.eq(grandchild)
    })
  })

  describe('textContent', () => {
    it('can set text content on an empty element', () => {
      const textContent = 'some text'
      const empty = div('empty')

      empty.textContent = textContent

      expect(empty.outerHTML).to.eq('<div id="empty">' + textContent + '</div>')
    })

    it('can set text content on an element with children', () => {
      const textContent = 'some text'
      const empty = div('parent', div('child'))

      empty.textContent = textContent

      expect(empty.outerHTML).to.eq('<div id="parent">' + textContent + '</div>')
    })

    it('can set text content on an element with text content', () => {
      const textContent = 'some text'
      const empty = div('the-div', document.createTextNode('original text'))

      empty.textContent = textContent

      expect(empty.outerHTML).to.eq('<div id="the-div">' + textContent + '</div>')
    })
  })
})
