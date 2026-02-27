import { expect } from 'chai'
import { div } from '../utils/div'

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

  describe('HTML element inheritance', () => {
    it('div is instanceof HTMLElement', () => {
      const el = document.createElement('div')
      expect(el).to.be.instanceOf(HTMLElement)
    })

    it('button is instanceof HTMLElement', () => {
      const el = document.createElement('button')
      expect(el).to.be.instanceOf(HTMLElement)
    })

    it('input is instanceof HTMLElement', () => {
      const el = document.createElement('input')
      expect(el).to.be.instanceOf(HTMLElement)
    })

    it('span is instanceof HTMLElement', () => {
      const el = document.createElement('span')
      expect(el).to.be.instanceOf(HTMLElement)
    })
  })

  describe('focus() / blur()', () => {
    it('has focus as a function', () => {
      const el = document.createElement('div')
      expect(el.focus).to.be.instanceOf(Function)
    })

    it('focus() does not throw', () => {
      const el = document.createElement('div')
      expect(() => el.focus()).not.to.throw
    })

    it('has blur as a function', () => {
      const el = document.createElement('div')
      expect(el.blur).to.be.instanceOf(Function)
    })

    it('blur() does not throw', () => {
      const el = document.createElement('div')
      expect(() => el.blur()).not.to.throw
    })
  })

  describe('closest()', () => {
    it('returns the element itself when it matches the selector', () => {
      const el = div('target')
      document.body.appendChild(el)

      expect(el.closest('#target')).to.eq(el)
    })

    it('returns the nearest matching ancestor', () => {
      const child = div('child')
      const parent = div('parent', child)
      document.body.appendChild(parent)

      expect(child.closest('#parent')).to.eq(parent)
    })

    it('returns null when no ancestor matches', () => {
      const el = div('alone')
      document.body.appendChild(el)

      expect(el.closest('#nonexistent')).to.be.null
    })
  })

  describe('classList', () => {
    it('add() adds a class reflected in getAttribute', () => {
      const el = document.createElement('div')
      el.classList.add('foo')

      expect(el.getAttribute('class')).to.include('foo')
    })

    it('remove() removes a class and contains() confirms', () => {
      const el = document.createElement('div')
      el.classList.add('foo')
      el.classList.remove('foo')

      expect(el.classList.contains('foo')).to.be.false
    })

    it('contains() returns true/false correctly', () => {
      const el = document.createElement('div')
      el.classList.add('foo')

      expect(el.classList.contains('foo')).to.be.true
      expect(el.classList.contains('bar')).to.be.false
    })

    it('toggle() toggles a class on then off', () => {
      const el = document.createElement('div')
      el.classList.toggle('foo')
      expect(el.classList.contains('foo')).to.be.true

      el.classList.toggle('foo')
      expect(el.classList.contains('foo')).to.be.false
    })
  })

  describe('innerHTML getter', () => {
    it('returns child element HTML', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)

      expect(parent.innerHTML).to.eq('<span></span>')
    })

    it('returns text content', () => {
      const parent = document.createElement('div')
      parent.appendChild(document.createTextNode('hello'))

      expect(parent.innerHTML).to.eq('hello')
    })

    it('returns empty string for empty element', () => {
      const parent = document.createElement('div')

      expect(parent.innerHTML).to.eq('')
    })
  })

  describe('dataset', () => {
    it('reflects data- attributes via getAttribute', () => {
      const el = document.createElement('div')
      el.setAttribute('data-foo', 'bar')

      expect(el.dataset.foo).to.eq('bar')
    })

    it('setting dataset property reflects in getAttribute', () => {
      const el = document.createElement('div')
      el.dataset.foo = 'baz'

      expect(el.getAttribute('data-foo')).to.eq('baz')
    })

    it('returns undefined for unset data attribute', () => {
      const el = document.createElement('div')

      expect(el.dataset.missing).to.be.undefined
    })
  })

  describe('children', () => {
    it('returns only Element children, not Text nodes', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(document.createTextNode('text'))
      parent.appendChild(child)
      parent.appendChild(document.createTextNode('more text'))

      expect(parent.children).to.have.lengthOf(1)
      expect(parent.children[0]).to.eq(child)
    })

    it('returns empty collection when there are only Text children', () => {
      const parent = document.createElement('div')
      parent.appendChild(document.createTextNode('text'))

      expect(parent.children).to.have.lengthOf(0)
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
