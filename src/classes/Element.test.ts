import { expect } from 'chai'
import { div } from '../utils/div'
import { Text } from './Text'

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

  it('has textContent getter', () => {
    const text1 = document.createTextNode('some')
    const text2 = document.createTextNode(' ')
    const text3 = document.createTextNode('text')
    const root = div('root', text1, text2, text3)

    console.log(root.textContent)

    expect(root.textContent).to.eql('some text')
  })
})
