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

    it('can find a grandchild based on class', () => {
      const grandchild = div('grandchild')
      grandchild.setAttribute('class', 'grandchild')
      const child = div('child', grandchild)
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

  describe('innerHTML setter', () => {
    it('parses a simple HTML element', () => {
      const container = document.createElement('div')
      container.innerHTML = '<span>hello</span>'

      expect(container.firstChild).to.be.instanceOf(HTMLSpanElement)
      expect(container.firstChild!.textContent).to.eq('hello')
    })

    it('parses nested elements', () => {
      const container = document.createElement('div')
      container.innerHTML = '<div><span>inner</span></div>'

      const child = container.firstChild as HTMLDivElement
      expect(child.tagName).to.eq('DIV')
      expect(child.firstChild).to.be.instanceOf(HTMLSpanElement)
    })

    it('parses elements with attributes', () => {
      const container = document.createElement('div')
      container.innerHTML = '<input type="text" name="field" />'

      const input = container.firstChild as HTMLInputElement
      expect(input.getAttribute('type')).to.eq('text')
      expect(input.getAttribute('name')).to.eq('field')
    })

    it('parses multiple sibling elements', () => {
      const container = document.createElement('div')
      container.innerHTML = '<span>a</span><span>b</span>'

      expect(container.childNodes).to.have.length(2)
    })

    it('parses mixed text and element content', () => {
      const container = document.createElement('div')
      container.innerHTML = 'text<span>element</span>more'

      expect(container.childNodes).to.have.length(3)
      expect(container.textContent).to.eq('textelementmore')
    })

    it('clears existing children before parsing', () => {
      const container = document.createElement('div')
      container.appendChild(document.createElement('p'))
      container.innerHTML = '<span>new</span>'

      expect(container.childNodes).to.have.length(1)
      expect(container.firstChild).to.be.instanceOf(HTMLSpanElement)
    })

    it('handles empty string by clearing children', () => {
      const container = document.createElement('div')
      container.appendChild(document.createElement('p'))
      container.innerHTML = ''

      expect(container.childNodes).to.have.length(0)
    })

    it('disconnects old children parentNode after innerHTML replacement', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const oldChild = document.createElement('span')
      container.appendChild(oldChild)
      expect(oldChild.parentNode).to.equal(container)

      container.innerHTML = '<p>new</p>'
      expect(oldChild.parentNode).to.be.null
    })

    it('disconnects old children parentNode after textContent replacement', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const oldChild = document.createElement('span')
      container.appendChild(oldChild)
      expect(oldChild.parentNode).to.equal(container)

      container.textContent = 'replaced'
      expect(oldChild.parentNode).to.be.null
    })

    it('parsed elements have getAttribute and hasAttribute', () => {
      const container = document.createElement('div')
      container.innerHTML = '<div class="foo" data-x="bar"></div>'

      const child = container.firstChild as HTMLDivElement
      expect(child.getAttribute('class')).to.eq('foo')
      expect(child.hasAttribute('data-x')).to.be.true
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

  describe('setAttribute coercion', () => {
    it('coerces objects to string', () => {
      const el = document.createElement('div')
      el.setAttribute('src', {} as unknown as string)
      expect(el.getAttribute('src')).to.eq('[object Object]')
    })

    it('coerces undefined to string', () => {
      const el = document.createElement('div')
      el.setAttribute('data-x', undefined as unknown as string)
      expect(el.getAttribute('data-x')).to.eq('undefined')
    })
  })

  describe('CSS selector error tolerance', () => {
    it('querySelector returns null for malformed selectors', () => {
      const el = document.createElement('div')
      expect(el.querySelector('div[name="x"')).to.be.null
    })

    it('querySelectorAll returns empty array for malformed selectors', () => {
      const el = document.createElement('div')
      expect(el.querySelectorAll('div[name="x"')).to.have.lengthOf(0)
    })

    it('matches returns false for malformed selectors', () => {
      const el = document.createElement('div')
      expect(el.matches('div[name="x"')).to.be.false
    })
  })

  describe('style attribute in serialized output', () => {
    it('includes style attr when style properties are set', () => {
      const el = document.createElement('div')
      el.style.color = 'red'
      const attrs = Array.from(el.attributes)
      const styleAttr = attrs.find(a => a.localName === 'style')
      expect(styleAttr).to.exist
      expect(styleAttr!.value).to.include('color: red')
    })

    it('setAttribute style updates CSSStyleDeclaration', () => {
      const el = document.createElement('div')
      el.setAttribute('style', 'color: red')
      expect(el.style.color).to.eq('red')
    })

    it('does not include style attr when no style properties are set', () => {
      const el = document.createElement('div')
      const attrs = Array.from(el.attributes)
      const styleAttr = attrs.find(a => a.localName === 'style')
      expect(styleAttr).to.be.undefined
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

  describe('dispatchEvent', () => {
    it('sets target to the dispatched element', () => {
      const el = document.createElement('div')
      const event = new window.Event('click')
      let receivedTarget: unknown = null
      el.addEventListener('click', (e: Event) => {
        receivedTarget = e.target
      })
      el.dispatchEvent(event)
      expect(receivedTarget).to.equal(el)
    })

    it('sets target on externally constructed events', () => {
      const btn = document.createElement('button')
      const event = new window.Event('focus', { bubbles: true })
      let receivedTarget: unknown = null
      btn.addEventListener('focus', (e: Event) => {
        receivedTarget = e.target
      })
      btn.dispatchEvent(event)
      expect(receivedTarget).to.equal(btn)
    })

    it('returns true when event is not cancelled', () => {
      const el = document.createElement('div')
      const event = new window.Event('click', { cancelable: true })
      expect(el.dispatchEvent(event)).to.be.true
    })

    it('returns false when event is cancelled via preventDefault', () => {
      const el = document.createElement('div')
      const event = new window.Event('click', { cancelable: true })
      el.addEventListener('click', (e: Event) => {
        e.preventDefault()
      })
      expect(el.dispatchEvent(event)).to.be.false
    })
  })

  describe('event propagation (capture/bubble)', () => {
    it('fires capture listeners before bubble listeners', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)
      document.body.appendChild(parent)

      const log: string[] = []
      parent.addEventListener('click', () => log.push('parent-capture'), true)
      parent.addEventListener('click', () => log.push('parent-bubble'), false)
      child.addEventListener('click', () => log.push('child-capture'), true)
      child.addEventListener('click', () => log.push('child-bubble'), false)

      child.dispatchEvent(new Event('click', { bubbles: true }))

      expect(log).to.eql([
        'parent-capture',
        'child-capture',
        'child-bubble',
        'parent-bubble',
      ])
    })

    it('does not bubble when bubbles is false', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)
      document.body.appendChild(parent)

      const log: string[] = []
      parent.addEventListener('focus', () => log.push('parent-bubble'), false)
      child.addEventListener('focus', () => log.push('child-bubble'), false)

      child.dispatchEvent(new Event('focus', { bubbles: false }))

      expect(log).to.eql(['child-bubble'])
    })

    it('stopPropagation prevents further propagation', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)
      document.body.appendChild(parent)

      const log: string[] = []
      parent.addEventListener('click', () => log.push('parent'), false)
      child.addEventListener('click', (e: Event) => {
        log.push('child')
        e.stopPropagation()
      }, false)

      child.dispatchEvent(new Event('click', { bubbles: true }))

      expect(log).to.eql(['child'])
    })
  })

  describe('removeEventListener', () => {
    it('removes a listener so it no longer fires', () => {
      const el = document.createElement('div')
      let count = 0
      const listener = () => { count++ }

      el.addEventListener('click', listener)
      el.dispatchEvent(new Event('click'))
      expect(count).to.eq(1)

      el.removeEventListener('click', listener)
      el.dispatchEvent(new Event('click'))
      expect(count).to.eq(1)
    })

    it('only removes the matching capture/bubble listener', () => {
      const el = document.createElement('div')
      const log: string[] = []
      const listener = () => { log.push('fired') }

      el.addEventListener('click', listener, true)
      el.addEventListener('click', listener, false)

      el.removeEventListener('click', listener, true)
      el.dispatchEvent(new Event('click'))

      expect(log).to.eql(['fired'])
    })
  })

  describe('attribute case insensitivity', () => {
    it('setAttribute lowercases attribute names for HTML elements', () => {
      const el = document.createElement('div')
      el.setAttribute('onClick', 'handler')

      expect(el.getAttribute('onclick')).to.eq('handler')
    })

    it('getAttribute is case-insensitive for HTML elements', () => {
      const el = document.createElement('div')
      el.setAttribute('data-value', 'test')

      expect(el.getAttribute('data-value')).to.eq('test')
      expect(el.getAttribute('DATA-VALUE')).to.eq('test')
    })

    it('hasAttribute is case-insensitive for HTML elements', () => {
      const el = document.createElement('div')
      el.setAttribute('data-foo', 'bar')

      expect(el.hasAttribute('DATA-FOO')).to.be.true
    })

    it('removeAttribute is case-insensitive for HTML elements', () => {
      const el = document.createElement('div')
      el.setAttribute('data-foo', 'bar')
      el.removeAttribute('DATA-FOO')

      expect(el.hasAttribute('data-foo')).to.be.false
    })
  })

  describe('textContent excludes comments', () => {
    it('does not include Comment node data in textContent', () => {
      const el = document.createElement('div')
      el.appendChild(document.createTextNode('hello'))
      el.appendChild(document.createComment('this is a comment'))
      el.appendChild(document.createTextNode(' world'))

      expect(el.textContent).to.eq('hello world')
    })
  })

  describe('click()', () => {
    it('dispatches a click event', () => {
      const el = document.createElement('button')
      let clicked = false
      el.addEventListener('click', () => { clicked = true })
      el.click()

      expect(clicked).to.be.true
    })

    it('dispatches a bubbling event', () => {
      const parent = document.createElement('div')
      const child = document.createElement('button')
      parent.appendChild(child)
      document.body.appendChild(parent)

      let received = false
      parent.addEventListener('click', () => { received = true })
      child.click()

      expect(received).to.be.true
    })
  })

  describe('checkbox/radio click vs dispatchEvent', () => {
    it('click() toggles checkbox checked state', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      document.body.appendChild(input)
      expect(input.checked).to.be.false
      input.click()
      expect(input.checked).to.be.true
      input.click()
      expect(input.checked).to.be.false
    })

    it('click() sets radio checked to true', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'radio'
      document.body.appendChild(input)
      expect(input.checked).to.be.false
      input.click()
      expect(input.checked).to.be.true
    })

    it('dispatchEvent with plain Event does not toggle checkbox', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      document.body.appendChild(input)
      expect(input.checked).to.be.false
      input.dispatchEvent(new Event('click', { bubbles: true }))
      expect(input.checked).to.be.false
    })

    it('dispatchEvent with MouseEvent toggles checkbox', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      document.body.appendChild(input)
      expect(input.checked).to.be.false
      input.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(input.checked).to.be.true
    })

    it('dispatchEvent with plain Event does not set radio', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'radio'
      document.body.appendChild(input)
      expect(input.checked).to.be.false
      input.dispatchEvent(new Event('click', { bubbles: true }))
      expect(input.checked).to.be.false
    })

    it('click() reverts checkbox if event is cancelled', () => {
      const input = document.createElement('input') as HTMLInputElement
      input.type = 'checkbox'
      document.body.appendChild(input)
      input.addEventListener('click', (e) => e.preventDefault())
      input.click()
      expect(input.checked).to.be.false
    })
  })

  describe('dimension stubs', () => {
    it('clientWidth returns 0', () => {
      const el = document.createElement('div')
      expect(el.clientWidth).to.equal(0)
    })

    it('clientHeight returns 0', () => {
      const el = document.createElement('div')
      expect(el.clientHeight).to.equal(0)
    })

    it('scrollWidth returns 0', () => {
      const el = document.createElement('div')
      expect(el.scrollWidth).to.equal(0)
    })

    it('scrollHeight returns 0', () => {
      const el = document.createElement('div')
      expect(el.scrollHeight).to.equal(0)
    })

    it('scrollTop returns 0 and is settable', function () {
      // JSDOM stores scroll values; lazy-dom stubs always return 0
      if (!globalThis.__LAZY_DOM__) this.skip()
      const el = document.createElement('div')
      expect(el.scrollTop).to.equal(0)
      el.scrollTop = 100
      expect(el.scrollTop).to.equal(0)
    })

    it('scrollLeft returns 0 and is settable', function () {
      // JSDOM stores scroll values; lazy-dom stubs always return 0
      if (!globalThis.__LAZY_DOM__) this.skip()
      const el = document.createElement('div')
      expect(el.scrollLeft).to.equal(0)
      el.scrollLeft = 50
      expect(el.scrollLeft).to.equal(0)
    })
  })

  describe('error propagation in dispatchEvent', () => {
    it('catches listener errors and dispatches ErrorEvent on window', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const err = new Error('test error')
      const errors: unknown[] = []
      const handler = (e: Event) => {
        errors.push((e as ErrorEvent).error)
      }
      window.addEventListener('error', handler)
      el.addEventListener('click', () => { throw err })
      el.dispatchEvent(new Event('click', { bubbles: true }))
      window.removeEventListener('error', handler)
      expect(errors).to.deep.equal([err])
    })

    it('continues dispatching after a listener throws', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const log: string[] = []
      window.addEventListener('error', () => {})
      el.addEventListener('click', () => { throw new Error('fail') })
      // A second listener on parent should still fire (bubble phase)
      const parent = document.createElement('div')
      parent.appendChild(el)
      document.body.appendChild(parent)
      parent.addEventListener('click', () => log.push('parent'))
      el.dispatchEvent(new Event('click', { bubbles: true }))
      expect(log).to.include('parent')
    })

    it('routes uncaught errors through window.console.error', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const logged: unknown[][] = []
      // Override window.console to capture error calls
      const origConsole = window.console
      window.console = { ...origConsole, error: (...args: unknown[]) => logged.push(args) }
      el.addEventListener('click', () => { throw new Error('Boom') })
      el.dispatchEvent(new Event('click'))
      window.console = origConsole
      expect(logged.length).to.equal(1)
      expect(logged[0][0]).to.be.a('string').that.includes('Error: Uncaught')
      expect(logged[0][0]).to.include('Boom')
    })

    it('invokes on* event handler properties during dispatch', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const log: string[] = []
      el.onclick = () => log.push('onclick')
      el.addEventListener('click', () => log.push('addEventListener'))
      el.dispatchEvent(new Event('click'))
      expect(log).to.deep.equal(['addEventListener', 'onclick'])
    })
  })

  describe('focus / blur event dispatch', () => {
    it('focus() dispatches focusin and focus events', () => {
      const el = document.createElement('input')
      document.body.appendChild(el)
      const log: string[] = []
      el.addEventListener('focusin', () => log.push('focusin'))
      el.addEventListener('focus', () => log.push('focus'))
      el.focus()
      expect(log).to.deep.equal(['focusin', 'focus'])
    })

    it('blur() dispatches focusout and blur events', () => {
      const el = document.createElement('input')
      document.body.appendChild(el)
      el.focus() // give focus first
      const log: string[] = []
      el.addEventListener('focusout', () => log.push('focusout'))
      el.addEventListener('blur', () => log.push('blur'))
      el.blur()
      expect(log).to.deep.equal(['focusout', 'blur'])
    })

    it('focus() does not fire events if already focused', () => {
      const el = document.createElement('input')
      document.body.appendChild(el)
      el.focus()
      const log: string[] = []
      el.addEventListener('focus', () => log.push('focus'))
      el.focus()
      expect(log).to.deep.equal([])
    })
  })

  describe('Symbol.toStringTag', () => {
    it('returns correct class name for HTMLDivElement', () => {
      const el = document.createElement('div')
      expect(Object.prototype.toString.call(el)).to.equal('[object HTMLDivElement]')
    })

    it('returns correct class name for HTMLInputElement', () => {
      const el = document.createElement('input')
      expect(Object.prototype.toString.call(el)).to.equal('[object HTMLInputElement]')
    })

    it('returns correct class name for HTMLSpanElement', () => {
      const el = document.createElement('span')
      expect(Object.prototype.toString.call(el)).to.equal('[object HTMLSpanElement]')
    })
  })

  describe('innerHTML Comment serialization', () => {
    it('serializes Comment nodes in innerHTML', () => {
      const el = document.createElement('div')
      el.appendChild(document.createComment('test'))
      expect(el.innerHTML).to.equal('<!--test-->')
    })

    it('serializes mixed content with Comments', () => {
      const el = document.createElement('div')
      el.appendChild(document.createTextNode('before'))
      el.appendChild(document.createComment('middle'))
      el.appendChild(document.createTextNode('after'))
      expect(el.innerHTML).to.equal('before<!--middle-->after')
    })
  })

  describe('firstElementChild / lastElementChild / childElementCount', () => {
    it('returns first element child skipping text nodes', () => {
      const el = document.createElement('div')
      el.appendChild(document.createTextNode('text'))
      const span = document.createElement('span')
      el.appendChild(span)
      expect(el.firstElementChild).to.equal(span)
    })

    it('returns null when no element children', () => {
      const el = document.createElement('div')
      el.appendChild(document.createTextNode('text'))
      expect(el.firstElementChild).to.be.null
    })

    it('returns last element child skipping text nodes', () => {
      const el = document.createElement('div')
      const span = document.createElement('span')
      el.appendChild(span)
      el.appendChild(document.createTextNode('text'))
      expect(el.lastElementChild).to.equal(span)
    })

    it('returns correct childElementCount', () => {
      const el = document.createElement('div')
      el.appendChild(document.createTextNode('text'))
      el.appendChild(document.createElement('span'))
      el.appendChild(document.createElement('p'))
      expect(el.childElementCount).to.equal(2)
    })
  })
})
