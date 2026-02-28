import { expect } from 'chai'

// Ported from jsdom level2/html.js
// Tests are grouped by element type. Active tests exercise APIs that lazy-dom
// implements. Skipped tests document element-specific properties and APIs that
// lazy-dom does not yet support.

describe('level2/html', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  // ---------------------------------------------------------------------------
  // HTMLElement generic tests
  // ---------------------------------------------------------------------------
  describe('HTMLElement', () => {
    it('HTMLElement_id - setAttribute/getAttribute for id', () => {
      const el = document.createElement('div')
      el.setAttribute('id', 'test')
      expect(el.getAttribute('id')).to.equal('test')
    })

    it('HTMLElement_title - setAttribute/getAttribute for title', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'test')
      expect(el.getAttribute('title')).to.equal('test')
    })

    it('HTMLElement_lang - setAttribute/getAttribute for lang', () => {
      const el = document.createElement('div')
      el.setAttribute('lang', 'en')
      expect(el.getAttribute('lang')).to.equal('en')
    })

    it('HTMLElement_dir - setAttribute/getAttribute for dir', () => {
      const el = document.createElement('div')
      el.setAttribute('dir', 'ltr')
      expect(el.getAttribute('dir')).to.equal('ltr')
    })

    it('HTMLElement_className - setAttribute/getAttribute for class', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'foo')
      expect(el.getAttribute('class')).to.equal('foo')
    })

    it('HTMLElement_tagName - tagName is uppercase', () => {
      const el = document.createElement('div')
      expect(el.tagName).to.equal('DIV')
    })

    it('HTMLElement_nodeType - nodeType is ELEMENT_NODE (1)', () => {
      const el = document.createElement('div')
      expect(el.nodeType).to.equal(1)
    })

    it('HTMLElement_textContent - textContent returns child text', () => {
      const el = document.createElement('div')
      const text = document.createTextNode('hello world')
      el.appendChild(text)
      expect(el.textContent).to.equal('hello world')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLDivElement
  // ---------------------------------------------------------------------------
  describe('HTMLDivElement', () => {
    it('HTMLDivElement01 - tagName is DIV', () => {
      const div = document.createElement('div')
      expect(div.tagName).to.equal('DIV')
    })

    it('HTMLDivElement_setAttribute - setAttribute/getAttribute for align', () => {
      const div = document.createElement('div')
      div.setAttribute('align', 'center')
      expect(div.getAttribute('align')).to.equal('center')
    })

    it('HTMLDivElement_align - div.align property reflection', () => {
      const div = document.createElement('div')
      div.align = 'center'
      expect(div.align).to.equal('center')
      expect(div.getAttribute('align')).to.equal('center')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLAnchorElement
  // ---------------------------------------------------------------------------
  describe('HTMLAnchorElement', () => {
    it('HTMLAnchorElement_tagName - tagName is A', () => {
      const a = document.createElement('a')
      expect(a.tagName).to.equal('A')
    })

    it('HTMLAnchorElement_setAttribute - setAttribute/getAttribute for href', () => {
      const a = document.createElement('a')
      a.setAttribute('href', 'http://example.com')
      expect(a.getAttribute('href')).to.equal('http://example.com')
    })

    it('HTMLAnchorElement_accessKey - accessKey property reflection', () => {
      const a = document.createElement('a')
      a.accessKey = 'k'
      expect(a.accessKey).to.equal('k')
    })

    it('HTMLAnchorElement_charset - charset property reflection', () => {
      const a = document.createElement('a')
      a.charset = 'utf-8'
      expect(a.charset).to.equal('utf-8')
    })

    it('HTMLAnchorElement_coords - coords property reflection', () => {
      const a = document.createElement('a')
      a.coords = '0,0,50,50'
      expect(a.coords).to.equal('0,0,50,50')
    })

    it('HTMLAnchorElement_href - href property reflection', () => {
      const a = document.createElement('a')
      a.href = 'http://example.com/'
      expect(a.href).to.equal('http://example.com/')
    })

    it('HTMLAnchorElement_hreflang - hreflang property reflection', () => {
      const a = document.createElement('a')
      a.hreflang = 'en'
      expect(a.hreflang).to.equal('en')
    })

    it('HTMLAnchorElement_name - name property reflection', () => {
      const a = document.createElement('a')
      a.name = 'anchor1'
      expect(a.name).to.equal('anchor1')
    })

    it('HTMLAnchorElement_rel - rel property reflection', () => {
      const a = document.createElement('a')
      a.rel = 'noopener'
      expect(a.rel).to.equal('noopener')
    })

    it('HTMLAnchorElement_rev - rev property reflection', () => {
      const a = document.createElement('a')
      a.rev = 'made'
      expect(a.rev).to.equal('made')
    })

    it('HTMLAnchorElement_shape - shape property reflection', () => {
      const a = document.createElement('a')
      a.shape = 'rect'
      expect(a.shape).to.equal('rect')
    })

    it('HTMLAnchorElement_tabIndex - tabIndex property reflection', () => {
      const a = document.createElement('a')
      a.tabIndex = 5
      expect(a.tabIndex).to.equal(5)
    })

    it('HTMLAnchorElement_target - target property reflection', () => {
      const a = document.createElement('a')
      a.target = '_blank'
      expect(a.target).to.equal('_blank')
    })

    it('HTMLAnchorElement_type - type property reflection', () => {
      const a = document.createElement('a')
      a.type = 'text/html'
      expect(a.type).to.equal('text/html')
    })

    it('HTMLAnchorElement_text - text property returns textContent', () => {
      const a = document.createElement('a')
      a.appendChild(document.createTextNode('Click me'))
      expect(a.text).to.equal('Click me')
    })

    it('HTMLAnchorElement_host - host property from URL', () => {
      const a = document.createElement('a')
      a.href = 'http://example.com:8080/path'
      expect(a.host).to.equal('example.com:8080')
    })

    it('HTMLAnchorElement_hostname - hostname property from URL', () => {
      const a = document.createElement('a')
      a.href = 'http://example.com/path'
      expect(a.hostname).to.equal('example.com')
    })

    it('HTMLAnchorElement_pathname - pathname property from URL', () => {
      const a = document.createElement('a')
      a.href = 'http://example.com/path/to/page'
      expect(a.pathname).to.equal('/path/to/page')
    })

    it('HTMLAnchorElement_port - port property from URL', () => {
      const a = document.createElement('a')
      a.href = 'http://example.com:3000/path'
      expect(a.port).to.equal('3000')
    })

    it('HTMLAnchorElement_protocol - protocol property from URL', () => {
      const a = document.createElement('a')
      a.href = 'https://example.com/'
      expect(a.protocol).to.equal('https:')
    })

    it('HTMLAnchorElement_search - search property from URL', () => {
      const a = document.createElement('a')
      a.href = 'http://example.com/path?q=test'
      expect(a.search).to.equal('?q=test')
    })

    it('HTMLAnchorElement_hash - hash property from URL', () => {
      const a = document.createElement('a')
      a.href = 'http://example.com/path#section'
      expect(a.hash).to.equal('#section')
    })

    it('HTMLAnchorElement_toString - toString returns href', () => {
      const a = document.createElement('a')
      a.href = 'http://example.com/'
      expect(a.toString()).to.equal('http://example.com/')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLButtonElement
  // ---------------------------------------------------------------------------
  describe('HTMLButtonElement', () => {
    it('HTMLButtonElement_tagName - tagName is BUTTON', () => {
      const button = document.createElement('button')
      expect(button.tagName).to.equal('BUTTON')
    })

    it('HTMLButtonElement_setAttribute - setAttribute/getAttribute for name and value', () => {
      const button = document.createElement('button')
      button.setAttribute('name', 'submit-btn')
      button.setAttribute('value', 'Submit')
      expect(button.getAttribute('name')).to.equal('submit-btn')
      expect(button.getAttribute('value')).to.equal('Submit')
    })

    it('HTMLButtonElement01 - form property returns null', () => {
      const button = document.createElement('button')
      expect(button.form).to.equal(null)
    })

    it('HTMLButtonElement02 - accessKey property reflection', () => {
      const button = document.createElement('button')
      button.accessKey = 'b'
      expect(button.accessKey).to.equal('b')
    })

    it('HTMLButtonElement03 - disabled property reflection', () => {
      const button = document.createElement('button')
      button.disabled = true
      expect(button.disabled).to.equal(true)
    })

    it('HTMLButtonElement04 - name property reflection', () => {
      const button = document.createElement('button')
      button.name = 'btn'
      expect(button.name).to.equal('btn')
    })

    it('HTMLButtonElement05 - tabIndex property reflection', () => {
      const button = document.createElement('button')
      button.tabIndex = 3
      expect(button.tabIndex).to.equal(3)
    })

    it('HTMLButtonElement06 - type property reflection', () => {
      const button = document.createElement('button')
      expect(button.type).to.equal('submit')
      button.type = 'button'
      expect(button.type).to.equal('button')
    })

    it('HTMLButtonElement07 - value property reflection', () => {
      const button = document.createElement('button')
      button.value = 'Submit'
      expect(button.value).to.equal('Submit')
    })

    it('HTMLButtonElement08 - value property assignment', () => {
      const button = document.createElement('button')
      button.value = 'Go'
      expect(button.value).to.equal('Go')
      button.value = 'Stop'
      expect(button.value).to.equal('Stop')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLInputElement
  // ---------------------------------------------------------------------------
  describe('HTMLInputElement', () => {
    it('HTMLInputElement_tagName - tagName is INPUT', () => {
      const input = document.createElement('input')
      expect(input.tagName).to.equal('INPUT')
    })

    it('HTMLInputElement_type - type defaults to text', () => {
      const input = document.createElement('input') as any
      expect(input.type).to.equal('text')
    })

    it('HTMLInputElement_type_set - type can be set via setAttribute', () => {
      const input = document.createElement('input') as any
      input.setAttribute('type', 'checkbox')
      expect(input.type).to.equal('checkbox')
    })

    // Skipped: requires property reflection
    // form, accept, accessKey, alt, checked, defaultChecked, defaultValue,
    // disabled, maxLength, name, readOnly, size, src, tabIndex, useMap, value
    it('HTMLInputElement_form - form returns null', () => {
      const input = document.createElement('input')
      expect(input.form).to.equal(null)
    })

    it('HTMLInputElement_accept - accept property reflection', () => {
      const input = document.createElement('input')
      input.accept = 'image/*'
      expect(input.accept).to.equal('image/*')
    })

    it('HTMLInputElement_accessKey - accessKey property reflection', () => {
      const input = document.createElement('input')
      input.accessKey = 'i'
      expect(input.accessKey).to.equal('i')
    })

    it('HTMLInputElement_alt - alt property reflection', () => {
      const input = document.createElement('input')
      input.alt = 'alt text'
      expect(input.alt).to.equal('alt text')
    })

    it('HTMLInputElement_checked - checked property reflection', () => {
      const input = document.createElement('input')
      input.checked = true
      expect(input.checked).to.equal(true)
    })

    it('HTMLInputElement_defaultChecked - defaultChecked property reflection', () => {
      const input = document.createElement('input')
      input.defaultChecked = true
      expect(input.defaultChecked).to.equal(true)
    })

    it('HTMLInputElement_defaultValue - defaultValue property reflection', () => {
      const input = document.createElement('input')
      input.defaultValue = 'default'
      expect(input.defaultValue).to.equal('default')
    })

    it('HTMLInputElement_disabled - disabled property reflection', () => {
      const input = document.createElement('input')
      input.disabled = true
      expect(input.disabled).to.equal(true)
    })

    it('HTMLInputElement_maxLength - maxLength property reflection', () => {
      const input = document.createElement('input')
      input.maxLength = 100
      expect(input.maxLength).to.equal(100)
    })

    it('HTMLInputElement_name - name property reflection', () => {
      const input = document.createElement('input')
      input.name = 'field'
      expect(input.name).to.equal('field')
    })

    it('HTMLInputElement_readOnly - readOnly property reflection', () => {
      const input = document.createElement('input')
      input.readOnly = true
      expect(input.readOnly).to.equal(true)
    })

    it('HTMLInputElement_size - size property reflection', () => {
      const input = document.createElement('input')
      input.size = 30
      expect(input.size).to.equal(30)
    })

    it('HTMLInputElement_src - src property reflection', () => {
      const input = document.createElement('input')
      input.src = 'image.png'
      expect(input.src).to.include('image.png')
    })

    it('HTMLInputElement_tabIndex - tabIndex property reflection', () => {
      const input = document.createElement('input')
      input.tabIndex = 7
      expect(input.tabIndex).to.equal(7)
    })

    it('HTMLInputElement_useMap - useMap property reflection', () => {
      const input = document.createElement('input')
      input.useMap = '#map'
      expect(input.useMap).to.equal('#map')
    })

    it('HTMLInputElement_value - value property reflection', () => {
      const input = document.createElement('input')
      input.value = 'hello'
      expect(input.value).to.equal('hello')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLLabelElement
  // ---------------------------------------------------------------------------
  describe('HTMLLabelElement', () => {
    it('HTMLLabelElement_tagName - tagName is LABEL', () => {
      const label = document.createElement('label')
      expect(label.tagName).to.equal('LABEL')
    })

    // Skipped: requires property reflection
    it('HTMLLabelElement_form - form returns null', () => {
      const label = document.createElement('label')
      expect(label.form).to.equal(null)
    })

    it('HTMLLabelElement_accessKey - accessKey property reflection', () => {
      const label = document.createElement('label')
      label.accessKey = 'l'
      expect(label.accessKey).to.equal('l')
    })

    it('HTMLLabelElement_htmlFor - htmlFor property reflection', () => {
      const label = document.createElement('label')
      label.htmlFor = 'input-id'
      expect(label.htmlFor).to.equal('input-id')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLFormElement
  // ---------------------------------------------------------------------------
  describe('HTMLFormElement', () => {
    it('HTMLFormElement_tagName - tagName is FORM', () => {
      const form = document.createElement('form')
      expect(form.tagName).to.equal('FORM')
    })

    // Skipped: requires property reflection and form collection APIs
    it.skip('HTMLFormElement_elements - requires elements collection')

    it('HTMLFormElement_length - length returns 0', () => {
      const form = document.createElement('form')
      expect(form.length).to.equal(0)
    })

    it('HTMLFormElement_name - name property reflection', () => {
      const form = document.createElement('form')
      form.name = 'myform'
      expect(form.name).to.equal('myform')
    })

    it('HTMLFormElement_acceptCharset - acceptCharset property reflection', () => {
      const form = document.createElement('form')
      form.acceptCharset = 'utf-8'
      expect(form.acceptCharset).to.equal('utf-8')
    })

    it('HTMLFormElement_action - action property reflection', () => {
      const form = document.createElement('form')
      form.action = '/submit'
      expect(form.action).to.include('/submit')
    })

    it('HTMLFormElement_enctype - enctype property reflection', () => {
      const form = document.createElement('form')
      form.enctype = 'multipart/form-data'
      expect(form.enctype).to.equal('multipart/form-data')
    })

    it('HTMLFormElement_method - method property reflection', () => {
      const form = document.createElement('form')
      form.method = 'post'
      expect(form.method).to.equal('post')
    })

    it('HTMLFormElement_target - target property reflection', () => {
      const form = document.createElement('form')
      form.target = '_blank'
      expect(form.target).to.equal('_blank')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLImageElement
  // ---------------------------------------------------------------------------
  describe('HTMLImageElement', () => {
    it('HTMLImageElement_tagName - tagName is IMG', () => {
      const img = document.createElement('img')
      expect(img.tagName).to.equal('IMG')
    })

    it('HTMLImageElement_setAttribute - setAttribute/getAttribute for src', () => {
      const img = document.createElement('img')
      img.setAttribute('src', 'test.png')
      expect(img.getAttribute('src')).to.equal('test.png')
    })

    // Skipped: requires property reflection
    // alt, border, height, hspace, isMap, longDesc, lowSrc, name, src,
    // useMap, vspace, width
    it('HTMLImageElement_alt - alt property reflection', () => {
      const img = document.createElement('img')
      img.alt = 'photo'
      expect(img.alt).to.equal('photo')
    })

    it('HTMLImageElement_border - border property reflection', () => {
      const img = document.createElement('img')
      img.border = '1'
      expect(img.border).to.equal('1')
    })

    it('HTMLImageElement_height - height property reflection', () => {
      const img = document.createElement('img')
      img.height = 100
      expect(img.height).to.equal(100)
    })

    it('HTMLImageElement_hspace - hspace property reflection', () => {
      const img = document.createElement('img')
      img.hspace = 5
      expect(img.hspace).to.equal(5)
    })

    it('HTMLImageElement_isMap - isMap property reflection', () => {
      const img = document.createElement('img')
      img.isMap = true
      expect(img.isMap).to.equal(true)
    })

    it('HTMLImageElement_longDesc - longDesc property reflection', () => {
      const img = document.createElement('img')
      img.longDesc = 'desc.html'
      expect(img.longDesc).to.include('desc.html')
    })

    it('HTMLImageElement_lowSrc - lowSrc property reflection', () => {
      const img = document.createElement('img')
      img.lowSrc = 'low.png'
      expect(img.lowSrc).to.include('low.png')
    })

    it('HTMLImageElement_name - name property reflection', () => {
      const img = document.createElement('img')
      img.name = 'img1'
      expect(img.name).to.equal('img1')
    })

    it('HTMLImageElement_src - src property reflection', () => {
      const img = document.createElement('img')
      img.src = 'photo.png'
      expect(img.src).to.include('photo.png')
    })

    it('HTMLImageElement_useMap - useMap property reflection', () => {
      const img = document.createElement('img')
      img.useMap = '#map'
      expect(img.useMap).to.equal('#map')
    })

    it('HTMLImageElement_vspace - vspace property reflection', () => {
      const img = document.createElement('img')
      img.vspace = 10
      expect(img.vspace).to.equal(10)
    })

    it('HTMLImageElement_width - width property reflection', () => {
      const img = document.createElement('img')
      img.width = 200
      expect(img.width).to.equal(200)
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLSpanElement
  // ---------------------------------------------------------------------------
  describe('HTMLSpanElement', () => {
    it('HTMLSpanElement_tagName - tagName is SPAN', () => {
      const span = document.createElement('span')
      expect(span.tagName).to.equal('SPAN')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLHeadingElement (h1-h6)
  // ---------------------------------------------------------------------------
  describe('HTMLHeadingElement', () => {
    it('HTMLHeadingElement_h1 - tagName is H1', () => {
      const h1 = document.createElement('h1')
      expect(h1.tagName).to.equal('H1')
    })

    it('HTMLHeadingElement_h2 - tagName is H2', () => {
      const h2 = document.createElement('h2')
      expect(h2.tagName).to.equal('H2')
    })

    it('HTMLHeadingElement_h3 - tagName is H3', () => {
      const h3 = document.createElement('h3')
      expect(h3.tagName).to.equal('H3')
    })

    it('HTMLHeadingElement_h4 - tagName is H4', () => {
      const h4 = document.createElement('h4')
      expect(h4.tagName).to.equal('H4')
    })

    it('HTMLHeadingElement_h5 - tagName is H5', () => {
      const h5 = document.createElement('h5')
      expect(h5.tagName).to.equal('H5')
    })

    it('HTMLHeadingElement_h6 - tagName is H6', () => {
      const h6 = document.createElement('h6')
      expect(h6.tagName).to.equal('H6')
    })

    // Skipped: requires align property reflection for each heading level
    it('HTMLHeadingElement_h1_align - align property reflection', () => {
      const h1 = document.createElement('h1')
      h1.align = 'center'
      expect(h1.align).to.equal('center')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLUListElement
  // ---------------------------------------------------------------------------
  describe('HTMLUListElement', () => {
    it('HTMLUListElement_tagName - tagName is UL', () => {
      const ul = document.createElement('ul')
      expect(ul.tagName).to.equal('UL')
    })

    // Skipped: requires property reflection
    it('HTMLUListElement_compact - compact property reflection', () => {
      const ul = document.createElement('ul')
      ul.compact = true
      expect(ul.compact).to.equal(true)
    })

    it('HTMLUListElement_type - type property reflection', () => {
      const ul = document.createElement('ul')
      ul.type = 'disc'
      expect(ul.type).to.equal('disc')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLLIElement
  // ---------------------------------------------------------------------------
  describe('HTMLLIElement', () => {
    it('HTMLLIElement_tagName - tagName is LI', () => {
      const li = document.createElement('li')
      expect(li.tagName).to.equal('LI')
    })

    // Skipped: requires property reflection
    it('HTMLLIElement_type - type property reflection', () => {
      const li = document.createElement('li')
      li.type = 'square'
      expect(li.type).to.equal('square')
    })

    it('HTMLLIElement_value - value property reflection', () => {
      const li = document.createElement('li')
      li.value = 5
      expect(li.value).to.equal(5)
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLParagraphElement
  // ---------------------------------------------------------------------------
  describe('HTMLParagraphElement', () => {
    it('HTMLParagraphElement_tagName - tagName is P', () => {
      const p = document.createElement('p')
      expect(p.tagName).to.equal('P')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLPreElement
  // ---------------------------------------------------------------------------
  describe('HTMLPreElement', () => {
    it('HTMLPreElement_tagName - tagName is PRE', () => {
      const pre = document.createElement('pre')
      expect(pre.tagName).to.equal('PRE')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLCanvasElement
  // ---------------------------------------------------------------------------
  describe('HTMLCanvasElement', () => {
    it('HTMLCanvasElement_tagName - tagName is CANVAS', () => {
      const canvas = document.createElement('canvas')
      expect(canvas.tagName).to.equal('CANVAS')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLBodyElement
  // ---------------------------------------------------------------------------
  describe('HTMLBodyElement', () => {
    it('HTMLBodyElement_tagName - document.body tagName is BODY', () => {
      expect(document.body.tagName).to.equal('BODY')
    })

    it('HTMLBodyElement_nodeType - document.body nodeType is 1', () => {
      expect(document.body.nodeType).to.equal(1)
    })

    // Skipped: requires property reflection
    it('HTMLBodyElement_aLink - aLink property reflection', () => {
      document.body.aLink = '#ff0000'
      expect(document.body.aLink).to.equal('#ff0000')
      document.body.removeAttribute('alink')
    })

    it('HTMLBodyElement_background - background property reflection', () => {
      document.body.background = 'bg.png'
      expect(document.body.background).to.equal('bg.png')
      document.body.removeAttribute('background')
    })

    it('HTMLBodyElement_bgColor - bgColor property reflection', () => {
      document.body.bgColor = '#ffffff'
      expect(document.body.bgColor).to.equal('#ffffff')
      document.body.removeAttribute('bgcolor')
    })

    it('HTMLBodyElement_link - link property reflection', () => {
      document.body.link = '#0000ff'
      expect(document.body.link).to.equal('#0000ff')
      document.body.removeAttribute('link')
    })

    it('HTMLBodyElement_text - text property reflection', () => {
      document.body.text = '#000000'
      expect(document.body.text).to.equal('#000000')
      document.body.removeAttribute('text')
    })

    it('HTMLBodyElement_vLink - vLink property reflection', () => {
      document.body.vLink = '#800080'
      expect(document.body.vLink).to.equal('#800080')
      document.body.removeAttribute('vlink')
    })
  })

  // ---------------------------------------------------------------------------
  // Element generic tests
  // ---------------------------------------------------------------------------
  describe('Element generic', () => {
    it('element_textContent - concatenates text from child text nodes', () => {
      const div = document.createElement('div')
      div.appendChild(document.createTextNode('hello '))
      div.appendChild(document.createTextNode('world'))
      expect(div.textContent).to.equal('hello world')
    })

    it('element_innerHTML - produces HTML from mixed children', () => {
      const div = document.createElement('div')
      const span = document.createElement('span')
      span.appendChild(document.createTextNode('inner'))
      div.appendChild(span)
      div.appendChild(document.createTextNode(' text'))
      expect(div.innerHTML).to.equal('<span>inner</span> text')
    })

    it('element_outerHTML - includes the element own tag', () => {
      const div = document.createElement('div')
      div.appendChild(document.createTextNode('content'))
      expect(div.outerHTML).to.equal('<div>content</div>')
    })

    it('element_childNodes_length - reports correct number of children', () => {
      const div = document.createElement('div')
      div.appendChild(document.createElement('span'))
      div.appendChild(document.createElement('span'))
      div.appendChild(document.createTextNode('text'))
      expect(div.childNodes.length).to.equal(3)
    })

    it('element_childNodes_item - returns child at index', () => {
      const div = document.createElement('div')
      const first = document.createElement('span')
      const second = document.createElement('p')
      div.appendChild(first)
      div.appendChild(second)
      expect(div.childNodes.item(0)).to.equal(first)
      expect(div.childNodes.item(1)).to.equal(second)
    })

    it('element_setAttribute_overwrite - second setAttribute overwrites', () => {
      const div = document.createElement('div')
      div.setAttribute('data-x', 'one')
      div.setAttribute('data-x', 'two')
      expect(div.getAttribute('data-x')).to.equal('two')
    })

    it('element_removeAttribute_nonexistent - does not throw', () => {
      const div = document.createElement('div')
      expect(() => div.removeAttribute('nonexistent')).to.not.throw()
    })

    it('element_hasAttribute_true - returns true after setAttribute', () => {
      const div = document.createElement('div')
      div.setAttribute('role', 'button')
      expect(div.hasAttribute('role')).to.be.true
    })

    it('element_hasAttribute_false - returns false before setAttribute', () => {
      const div = document.createElement('div')
      expect(div.hasAttribute('role')).to.be.false
    })

    it('element_classList_add - adds class and reflects in attribute', () => {
      const div = document.createElement('div')
      div.classList.add('foo')
      expect(div.hasAttribute('class')).to.be.true
      expect(div.getAttribute('class')).to.include('foo')
    })

    it('element_dataset_set - sets data attribute via dataset', () => {
      const div = document.createElement('div')
      ;(div.dataset as any).fooBar = 'val'
      expect(div.getAttribute('data-foo-bar')).to.equal('val')
    })
  })

  // ---------------------------------------------------------------------------
  // Document tests
  // ---------------------------------------------------------------------------
  describe('Document', () => {
    it('document_body - document.body exists', () => {
      expect(document.body).to.exist
    })

    it('document_body_tagName - document.body.tagName is BODY', () => {
      expect(document.body.tagName).to.equal('BODY')
    })

    it('document_head - document.head exists', () => {
      expect(document.head).to.exist
    })

    it('document_documentElement - document.documentElement exists', () => {
      expect(document.documentElement).to.exist
    })

    it('document_getElementById - finds element by id', () => {
      const div = document.createElement('div')
      div.setAttribute('id', 'target-element')
      document.body.appendChild(div)
      const found = document.getElementById('target-element')
      expect(found).to.equal(div)
    })

    it('document_getElementById_null - returns null for nonexistent id', () => {
      const found = document.getElementById('does-not-exist')
      expect(found).to.be.null
    })

    it('document_nodeType - document.nodeType is DOCUMENT_NODE (9)', () => {
      expect(document.nodeType).to.equal(9)
    })
  })

  // ---------------------------------------------------------------------------
  // Special tests
  // ---------------------------------------------------------------------------
  describe('Special', () => {
    it('checked_property_is_boolean - setAttribute checked and getAttribute', () => {
      const input = document.createElement('input')
      input.setAttribute('checked', '')
      expect(input.hasAttribute('checked')).to.be.true
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLAreaElement
  // ---------------------------------------------------------------------------
  describe('HTMLAreaElement', () => {
    it('HTMLAreaElement01 - accessKey property reflection', () => {
      const area = document.createElement('area') as any
      area.accessKey = 'a'
      expect(area.accessKey).to.equal('a')
    })

    it('HTMLAreaElement02 - alt property reflection', () => {
      const area = document.createElement('area') as any
      area.alt = 'description'
      expect(area.alt).to.equal('description')
    })

    it('HTMLAreaElement03 - coords property reflection', () => {
      const area = document.createElement('area') as any
      area.coords = '0,0,50,50'
      expect(area.coords).to.equal('0,0,50,50')
    })

    it('HTMLAreaElement04 - href property reflection', () => {
      const area = document.createElement('area') as any
      area.href = 'http://example.com'
      expect(area.href).to.include('example.com')
    })

    it('HTMLAreaElement05 - noHref property reflection', () => {
      const area = document.createElement('area') as any
      area.noHref = true
      expect(area.noHref).to.equal(true)
    })

    it('HTMLAreaElement06 - shape property reflection', () => {
      const area = document.createElement('area') as any
      area.shape = 'rect'
      expect(area.shape).to.equal('rect')
    })

    it('HTMLAreaElement07 - tabIndex property reflection', () => {
      const area = document.createElement('area') as any
      area.tabIndex = 5
      expect(area.tabIndex).to.equal(5)
    })

    it('HTMLAreaElement08 - target property reflection', () => {
      const area = document.createElement('area') as any
      area.target = '_blank'
      expect(area.target).to.equal('_blank')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLBRElement
  // ---------------------------------------------------------------------------
  describe('HTMLBRElement', () => {
    it('HTMLBRElement01 - clear property reflection', () => {
      const br = document.createElement('br') as any
      br.clear = 'all'
      expect(br.clear).to.equal('all')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLBaseElement
  // ---------------------------------------------------------------------------
  describe('HTMLBaseElement', () => {
    it('HTMLBaseElement01 - href property reflection', () => {
      const base = document.createElement('base') as any
      base.href = 'http://example.com/'
      expect(base.href).to.include('example.com')
    })

    it('HTMLBaseElement02 - target property reflection', () => {
      const base = document.createElement('base') as any
      base.target = '_blank'
      expect(base.target).to.equal('_blank')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLDListElement
  // ---------------------------------------------------------------------------
  describe('HTMLDListElement', () => {
    it('HTMLDListElement01 - compact property reflection', () => {
      const dl = document.createElement('dl') as any
      dl.compact = true
      expect(dl.compact).to.equal(true)
    })
  })

  // ---------------------------------------------------------------------------
  // Deprecated elements (skipped)
  // ---------------------------------------------------------------------------
  describe('Deprecated elements', () => {
    describe('HTMLDirectoryElement', () => {
      it.skip('HTMLDirectoryElement01-02 - requires HTMLDirectoryElement (deprecated)')
    })

    describe('HTMLFontElement', () => {
      it.skip('HTMLFontElement01-07 - requires HTMLFontElement (deprecated)')
    })

    describe('HTMLFrameElement', () => {
      it.skip('HTMLFrameElement01-09 - requires HTMLFrameElement (deprecated)')
    })

    describe('HTMLFrameSetElement', () => {
      it.skip('HTMLFrameSetElement01-06 - requires HTMLFrameSetElement (deprecated)')
    })

    describe('HTMLIsIndexElement', () => {
      it.skip('HTMLIsIndexElement01 - requires HTMLIsIndexElement (deprecated)')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLFieldSetElement
  // ---------------------------------------------------------------------------
  describe('HTMLFieldSetElement', () => {
    it('HTMLFieldSetElement01 - form returns null', () => {
      const fieldset = document.createElement('fieldset') as any
      expect(fieldset.form).to.equal(null)
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLHRElement
  // ---------------------------------------------------------------------------
  describe('HTMLHRElement', () => {
    it('HTMLHRElement01 - align property reflection', () => {
      const hr = document.createElement('hr') as any
      hr.align = 'center'
      expect(hr.align).to.equal('center')
    })

    it('HTMLHRElement02 - noShade property reflection', () => {
      const hr = document.createElement('hr') as any
      hr.noShade = true
      expect(hr.noShade).to.equal(true)
    })

    it('HTMLHRElement03 - size property reflection', () => {
      const hr = document.createElement('hr') as any
      hr.size = '2'
      expect(hr.size).to.equal('2')
    })

    it('HTMLHRElement04 - width property reflection', () => {
      const hr = document.createElement('hr') as any
      hr.width = '100%'
      expect(hr.width).to.equal('100%')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLHtmlElement
  // ---------------------------------------------------------------------------
  describe('HTMLHtmlElement', () => {
    it('HTMLHtmlElement01 - version property reflection', () => {
      const html = document.createElement('html') as any
      html.version = '-//W3C//DTD HTML 4.01//EN'
      expect(html.version).to.equal('-//W3C//DTD HTML 4.01//EN')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLIFrameElement
  // ---------------------------------------------------------------------------
  describe('HTMLIFrameElement', () => {
    it('HTMLIFrameElement01 - align property reflection', () => {
      const iframe = document.createElement('iframe') as any
      iframe.align = 'left'
      expect(iframe.align).to.equal('left')
    })

    it('HTMLIFrameElement02 - frameBorder property reflection', () => {
      const iframe = document.createElement('iframe') as any
      iframe.frameBorder = '1'
      expect(iframe.frameBorder).to.equal('1')
    })

    it('HTMLIFrameElement03 - height property reflection', () => {
      const iframe = document.createElement('iframe') as any
      iframe.height = '300'
      expect(iframe.height).to.equal('300')
    })

    it('HTMLIFrameElement04 - longDesc property reflection', () => {
      const iframe = document.createElement('iframe') as any
      iframe.longDesc = 'desc.html'
      expect(iframe.longDesc).to.include('desc.html')
    })

    it('HTMLIFrameElement05 - name property reflection', () => {
      const iframe = document.createElement('iframe') as any
      iframe.name = 'frame1'
      expect(iframe.name).to.equal('frame1')
    })

    it('HTMLIFrameElement06 - src property reflection', () => {
      const iframe = document.createElement('iframe') as any
      iframe.src = 'page.html'
      expect(iframe.src).to.include('page.html')
    })

    it('HTMLIFrameElement07 - width property reflection', () => {
      const iframe = document.createElement('iframe') as any
      iframe.width = '500'
      expect(iframe.width).to.equal('500')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLLegendElement
  // ---------------------------------------------------------------------------
  describe('HTMLLegendElement', () => {
    it('HTMLLegendElement01 - form returns null', () => {
      const legend = document.createElement('legend') as any
      expect(legend.form).to.equal(null)
    })

    it('HTMLLegendElement02 - accessKey property reflection', () => {
      const legend = document.createElement('legend') as any
      legend.accessKey = 'l'
      expect(legend.accessKey).to.equal('l')
    })

    it('HTMLLegendElement03 - align property reflection', () => {
      const legend = document.createElement('legend') as any
      legend.align = 'top'
      expect(legend.align).to.equal('top')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLLinkElement
  // ---------------------------------------------------------------------------
  describe('HTMLLinkElement', () => {
    it('HTMLLinkElement01 - charset property reflection', () => {
      const link = document.createElement('link') as any
      link.charset = 'utf-8'
      expect(link.charset).to.equal('utf-8')
    })

    it('HTMLLinkElement02 - disabled property reflection', () => {
      const link = document.createElement('link') as any
      link.disabled = true
      expect(link.disabled).to.equal(true)
    })

    it('HTMLLinkElement03 - href property reflection', () => {
      const link = document.createElement('link') as any
      link.href = 'style.css'
      expect(link.href).to.include('style.css')
    })

    it('HTMLLinkElement04 - hreflang property reflection', () => {
      const link = document.createElement('link') as any
      link.hreflang = 'en'
      expect(link.hreflang).to.equal('en')
    })

    it('HTMLLinkElement05 - media property reflection', () => {
      const link = document.createElement('link') as any
      link.media = 'screen'
      expect(link.media).to.equal('screen')
    })

    it('HTMLLinkElement06 - rel property reflection', () => {
      const link = document.createElement('link') as any
      link.rel = 'stylesheet'
      expect(link.rel).to.equal('stylesheet')
    })

    it('HTMLLinkElement07 - type property reflection', () => {
      const link = document.createElement('link') as any
      link.type = 'text/css'
      expect(link.type).to.equal('text/css')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLMapElement
  // ---------------------------------------------------------------------------
  describe('HTMLMapElement', () => {
    it('HTMLMapElement01 - name property reflection', () => {
      const map = document.createElement('map') as any
      map.name = 'mymap'
      expect(map.name).to.equal('mymap')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLMetaElement
  // ---------------------------------------------------------------------------
  describe('HTMLMetaElement', () => {
    it('HTMLMetaElement01 - content property reflection', () => {
      const meta = document.createElement('meta') as any
      meta.content = 'text/html; charset=utf-8'
      expect(meta.content).to.equal('text/html; charset=utf-8')
    })

    it('HTMLMetaElement02 - httpEquiv property reflection', () => {
      const meta = document.createElement('meta') as any
      meta.httpEquiv = 'Content-Type'
      expect(meta.httpEquiv).to.equal('Content-Type')
    })

    it('HTMLMetaElement03 - name property reflection', () => {
      const meta = document.createElement('meta') as any
      meta.name = 'viewport'
      expect(meta.name).to.equal('viewport')
    })

    it('HTMLMetaElement04 - scheme property reflection', () => {
      const meta = document.createElement('meta') as any
      meta.scheme = 'DCMI.Period'
      expect(meta.scheme).to.equal('DCMI.Period')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLModElement (ins/del)
  // ---------------------------------------------------------------------------
  describe('HTMLModElement', () => {
    it('HTMLModElement01 - cite property on ins', () => {
      const ins = document.createElement('ins') as any
      ins.cite = 'http://example.com'
      expect(ins.cite).to.include('example.com')
    })

    it('HTMLModElement02 - dateTime property on ins', () => {
      const ins = document.createElement('ins') as any
      ins.dateTime = '2024-01-01'
      expect(ins.dateTime).to.equal('2024-01-01')
    })

    it('HTMLModElement03 - cite property on del', () => {
      const del = document.createElement('del') as any
      del.cite = 'http://example.com'
      expect(del.cite).to.include('example.com')
    })

    it('HTMLModElement04 - dateTime property on del', () => {
      const del = document.createElement('del') as any
      del.dateTime = '2024-01-01'
      expect(del.dateTime).to.equal('2024-01-01')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLOListElement
  // ---------------------------------------------------------------------------
  describe('HTMLOListElement', () => {
    it('HTMLOListElement01 - compact property reflection', () => {
      const ol = document.createElement('ol') as any
      ol.compact = true
      expect(ol.compact).to.equal(true)
    })

    it('HTMLOListElement02 - start property reflection', () => {
      const ol = document.createElement('ol') as any
      ol.start = 5
      expect(ol.start).to.equal(5)
    })

    it('HTMLOListElement03 - type property reflection', () => {
      const ol = document.createElement('ol') as any
      ol.type = 'a'
      expect(ol.type).to.equal('a')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLObjectElement
  // ---------------------------------------------------------------------------
  describe('HTMLObjectElement', () => {
    it('HTMLObjectElement01 - form returns null', () => {
      const obj = document.createElement('object') as any
      expect(obj.form).to.equal(null)
    })

    it('HTMLObjectElement02 - code property reflection', () => {
      const obj = document.createElement('object') as any
      obj.code = 'MyApplet.class'
      expect(obj.code).to.equal('MyApplet.class')
    })

    it('HTMLObjectElement03 - align property reflection', () => {
      const obj = document.createElement('object') as any
      obj.align = 'middle'
      expect(obj.align).to.equal('middle')
    })

    it('HTMLObjectElement04 - data property reflection', () => {
      const obj = document.createElement('object') as any
      obj.data = 'movie.swf'
      expect(obj.data).to.include('movie.swf')
    })

    it('HTMLObjectElement05 - type property reflection', () => {
      const obj = document.createElement('object') as any
      obj.type = 'application/x-shockwave-flash'
      expect(obj.type).to.equal('application/x-shockwave-flash')
    })

    it('HTMLObjectElement06 - name property reflection', () => {
      const obj = document.createElement('object') as any
      obj.name = 'myobject'
      expect(obj.name).to.equal('myobject')
    })

    it('HTMLObjectElement07 - width property reflection', () => {
      const obj = document.createElement('object') as any
      obj.width = '400'
      expect(obj.width).to.equal('400')
    })

    it('HTMLObjectElement08 - height property reflection', () => {
      const obj = document.createElement('object') as any
      obj.height = '300'
      expect(obj.height).to.equal('300')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLOptGroupElement
  // ---------------------------------------------------------------------------
  describe('HTMLOptGroupElement', () => {
    it('HTMLOptGroupElement01 - disabled property reflection', () => {
      const optgroup = document.createElement('optgroup') as any
      optgroup.disabled = true
      expect(optgroup.disabled).to.equal(true)
    })

    it('HTMLOptGroupElement02 - label property reflection', () => {
      const optgroup = document.createElement('optgroup') as any
      optgroup.label = 'Group 1'
      expect(optgroup.label).to.equal('Group 1')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLOptionElement
  // ---------------------------------------------------------------------------
  describe('HTMLOptionElement', () => {
    it('HTMLOptionElement01 - form returns null', () => {
      const option = document.createElement('option') as any
      expect(option.form).to.equal(null)
    })

    it('HTMLOptionElement02 - defaultSelected property reflection', () => {
      const option = document.createElement('option') as any
      option.defaultSelected = true
      expect(option.defaultSelected).to.equal(true)
    })

    it('HTMLOptionElement03 - text returns textContent', () => {
      const option = document.createElement('option') as any
      option.appendChild(document.createTextNode('Option 1'))
      expect(option.text).to.equal('Option 1')
    })

    it('HTMLOptionElement04 - disabled property reflection', () => {
      const option = document.createElement('option') as any
      option.disabled = true
      expect(option.disabled).to.equal(true)
    })

    it('HTMLOptionElement05 - label property reflection', () => {
      const option = document.createElement('option') as any
      option.label = 'Opt1'
      expect(option.label).to.equal('Opt1')
    })

    it('HTMLOptionElement06 - value property reflection', () => {
      const option = document.createElement('option') as any
      option.value = 'val1'
      expect(option.value).to.equal('val1')
    })

    it('HTMLOptionElement07 - selected property', () => {
      const option = document.createElement('option') as any
      option.selected = true
      expect(option.selected).to.equal(true)
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLParamElement
  // ---------------------------------------------------------------------------
  describe('HTMLParamElement', () => {
    it('HTMLParamElement01 - name property reflection', () => {
      const param = document.createElement('param') as any
      param.name = 'movie'
      expect(param.name).to.equal('movie')
    })

    it('HTMLParamElement02 - value property reflection', () => {
      const param = document.createElement('param') as any
      param.value = 'movie.swf'
      expect(param.value).to.equal('movie.swf')
    })

    it('HTMLParamElement03 - valueType property reflection', () => {
      const param = document.createElement('param') as any
      param.valueType = 'data'
      expect(param.valueType).to.equal('data')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLQuoteElement (blockquote, q)
  // ---------------------------------------------------------------------------
  describe('HTMLQuoteElement', () => {
    it('HTMLQuoteElement01 - cite property on blockquote', () => {
      const bq = document.createElement('blockquote') as any
      bq.cite = 'http://example.com'
      expect(bq.cite).to.include('example.com')
    })

    it('HTMLQuoteElement02 - cite property on q', () => {
      const q = document.createElement('q') as any
      q.cite = 'http://example.com'
      expect(q.cite).to.include('example.com')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLScriptElement
  // ---------------------------------------------------------------------------
  describe('HTMLScriptElement', () => {
    it('HTMLScriptElement01 - text property', () => {
      const script = document.createElement('script') as any
      script.text = 'alert("hello")'
      expect(script.text).to.equal('alert("hello")')
    })

    it('HTMLScriptElement02 - charset property reflection', () => {
      const script = document.createElement('script') as any
      script.charset = 'utf-8'
      expect(script.charset).to.equal('utf-8')
    })

    it('HTMLScriptElement03 - defer property reflection', () => {
      const script = document.createElement('script') as any
      script.defer = true
      expect(script.defer).to.equal(true)
    })

    it('HTMLScriptElement04 - event property reflection', () => {
      const script = document.createElement('script') as any
      script.event = 'onclick'
      expect(script.event).to.equal('onclick')
    })

    it('HTMLScriptElement05 - htmlFor property reflection', () => {
      const script = document.createElement('script') as any
      script.htmlFor = 'button1'
      expect(script.htmlFor).to.equal('button1')
    })

    it('HTMLScriptElement06 - src property reflection', () => {
      const script = document.createElement('script') as any
      script.src = 'script.js'
      expect(script.src).to.include('script.js')
    })

    it('HTMLScriptElement07 - type property reflection', () => {
      const script = document.createElement('script') as any
      script.type = 'text/javascript'
      expect(script.type).to.equal('text/javascript')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLSelectElement
  // ---------------------------------------------------------------------------
  describe('HTMLSelectElement', () => {
    it('HTMLSelectElement01 - type returns select-one by default', () => {
      const select = document.createElement('select') as any
      expect(select.type).to.equal('select-one')
    })

    it('HTMLSelectElement02 - type returns select-multiple when multiple', () => {
      const select = document.createElement('select') as any
      select.multiple = true
      expect(select.type).to.equal('select-multiple')
    })

    it('HTMLSelectElement03 - form returns null', () => {
      const select = document.createElement('select') as any
      expect(select.form).to.equal(null)
    })

    it('HTMLSelectElement04 - disabled property reflection', () => {
      const select = document.createElement('select') as any
      select.disabled = true
      expect(select.disabled).to.equal(true)
    })

    it('HTMLSelectElement05 - multiple property reflection', () => {
      const select = document.createElement('select') as any
      select.multiple = true
      expect(select.multiple).to.equal(true)
    })

    it('HTMLSelectElement06 - name property reflection', () => {
      const select = document.createElement('select') as any
      select.name = 'myselect'
      expect(select.name).to.equal('myselect')
    })

    it('HTMLSelectElement07 - size property reflection', () => {
      const select = document.createElement('select') as any
      select.size = 5
      expect(select.size).to.equal(5)
    })

    it('HTMLSelectElement08 - tabIndex property reflection', () => {
      const select = document.createElement('select') as any
      select.tabIndex = 3
      expect(select.tabIndex).to.equal(3)
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLStyleElement
  // ---------------------------------------------------------------------------
  describe('HTMLStyleElement', () => {
    it('HTMLStyleElement01 - disabled property reflection', () => {
      const style = document.createElement('style') as any
      style.disabled = true
      expect(style.disabled).to.equal(true)
    })

    it('HTMLStyleElement02 - media property reflection', () => {
      const style = document.createElement('style') as any
      style.media = 'screen'
      expect(style.media).to.equal('screen')
    })

    it('HTMLStyleElement03 - type property reflection', () => {
      const style = document.createElement('style') as any
      style.type = 'text/css'
      expect(style.type).to.equal('text/css')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLTableElement
  // ---------------------------------------------------------------------------
  describe('HTMLTableElement', () => {
    it('HTMLTableElement01 - align property reflection', () => {
      const table = document.createElement('table') as any
      table.align = 'center'
      expect(table.align).to.equal('center')
    })

    it('HTMLTableElement02 - bgColor property reflection', () => {
      const table = document.createElement('table') as any
      table.bgColor = '#ffffff'
      expect(table.bgColor).to.equal('#ffffff')
    })

    it('HTMLTableElement03 - border property reflection', () => {
      const table = document.createElement('table') as any
      table.border = '1'
      expect(table.border).to.equal('1')
    })

    it('HTMLTableElement04 - cellPadding property reflection', () => {
      const table = document.createElement('table') as any
      table.cellPadding = '5'
      expect(table.cellPadding).to.equal('5')
    })

    it('HTMLTableElement05 - cellSpacing property reflection', () => {
      const table = document.createElement('table') as any
      table.cellSpacing = '2'
      expect(table.cellSpacing).to.equal('2')
    })

    it('HTMLTableElement06 - summary property reflection', () => {
      const table = document.createElement('table') as any
      table.summary = 'Summary text'
      expect(table.summary).to.equal('Summary text')
    })

    it('HTMLTableElement07 - width property reflection', () => {
      const table = document.createElement('table') as any
      table.width = '100%'
      expect(table.width).to.equal('100%')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLTableCaptionElement
  // ---------------------------------------------------------------------------
  describe('HTMLTableCaptionElement', () => {
    it('HTMLTableCaptionElement01 - align property reflection', () => {
      const caption = document.createElement('caption') as any
      caption.align = 'top'
      expect(caption.align).to.equal('top')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLTableCellElement
  // ---------------------------------------------------------------------------
  describe('HTMLTableCellElement', () => {
    it('HTMLTableCellElement01 - abbr property reflection', () => {
      const td = document.createElement('td') as any
      td.abbr = 'Name'
      expect(td.abbr).to.equal('Name')
    })

    it('HTMLTableCellElement02 - align property reflection', () => {
      const td = document.createElement('td') as any
      td.align = 'center'
      expect(td.align).to.equal('center')
    })

    it('HTMLTableCellElement03 - axis property reflection', () => {
      const td = document.createElement('td') as any
      td.axis = 'expenses'
      expect(td.axis).to.equal('expenses')
    })

    it('HTMLTableCellElement04 - bgColor property reflection', () => {
      const td = document.createElement('td') as any
      td.bgColor = '#ff0000'
      expect(td.bgColor).to.equal('#ff0000')
    })

    it('HTMLTableCellElement05 - colSpan property reflection', () => {
      const td = document.createElement('td') as any
      td.colSpan = 3
      expect(td.colSpan).to.equal(3)
    })

    it('HTMLTableCellElement06 - headers property reflection', () => {
      const td = document.createElement('td') as any
      td.headers = 'header1 header2'
      expect(td.headers).to.equal('header1 header2')
    })

    it('HTMLTableCellElement07 - height property reflection', () => {
      const td = document.createElement('td') as any
      td.height = '50'
      expect(td.height).to.equal('50')
    })

    it('HTMLTableCellElement08 - noWrap property reflection', () => {
      const td = document.createElement('td') as any
      td.noWrap = true
      expect(td.noWrap).to.equal(true)
    })

    it('HTMLTableCellElement09 - rowSpan property reflection', () => {
      const td = document.createElement('td') as any
      td.rowSpan = 2
      expect(td.rowSpan).to.equal(2)
    })

    it('HTMLTableCellElement10 - scope property reflection', () => {
      const td = document.createElement('td') as any
      td.scope = 'col'
      expect(td.scope).to.equal('col')
    })

    it('HTMLTableCellElement11 - vAlign property reflection', () => {
      const td = document.createElement('td') as any
      td.vAlign = 'top'
      expect(td.vAlign).to.equal('top')
    })

    it('HTMLTableCellElement12 - width property reflection', () => {
      const td = document.createElement('td') as any
      td.width = '200'
      expect(td.width).to.equal('200')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLTableColElement
  // ---------------------------------------------------------------------------
  describe('HTMLTableColElement', () => {
    it('HTMLTableColElement01 - align property reflection', () => {
      const col = document.createElement('col') as any
      col.align = 'center'
      expect(col.align).to.equal('center')
    })

    it('HTMLTableColElement02 - ch property reflection', () => {
      const col = document.createElement('col') as any
      col.ch = '.'
      expect(col.ch).to.equal('.')
    })

    it('HTMLTableColElement03 - chOff property reflection', () => {
      const col = document.createElement('col') as any
      col.chOff = '2'
      expect(col.chOff).to.equal('2')
    })

    it('HTMLTableColElement04 - span property reflection', () => {
      const col = document.createElement('col') as any
      col.span = 3
      expect(col.span).to.equal(3)
    })

    it('HTMLTableColElement05 - vAlign property reflection', () => {
      const col = document.createElement('col') as any
      col.vAlign = 'middle'
      expect(col.vAlign).to.equal('middle')
    })

    it('HTMLTableColElement06 - width property reflection', () => {
      const col = document.createElement('col') as any
      col.width = '100'
      expect(col.width).to.equal('100')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLTableRowElement
  // ---------------------------------------------------------------------------
  describe('HTMLTableRowElement', () => {
    it('HTMLTableRowElement01 - align property reflection', () => {
      const tr = document.createElement('tr') as any
      tr.align = 'center'
      expect(tr.align).to.equal('center')
    })

    it('HTMLTableRowElement02 - bgColor property reflection', () => {
      const tr = document.createElement('tr') as any
      tr.bgColor = '#cccccc'
      expect(tr.bgColor).to.equal('#cccccc')
    })

    it('HTMLTableRowElement03 - ch property reflection', () => {
      const tr = document.createElement('tr') as any
      tr.ch = '.'
      expect(tr.ch).to.equal('.')
    })

    it('HTMLTableRowElement04 - chOff property reflection', () => {
      const tr = document.createElement('tr') as any
      tr.chOff = '1'
      expect(tr.chOff).to.equal('1')
    })

    it('HTMLTableRowElement05 - vAlign property reflection', () => {
      const tr = document.createElement('tr') as any
      tr.vAlign = 'bottom'
      expect(tr.vAlign).to.equal('bottom')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLTableSectionElement
  // ---------------------------------------------------------------------------
  describe('HTMLTableSectionElement', () => {
    it('HTMLTableSectionElement01 - align property on thead', () => {
      const thead = document.createElement('thead') as any
      thead.align = 'center'
      expect(thead.align).to.equal('center')
    })

    it('HTMLTableSectionElement02 - ch property on tbody', () => {
      const tbody = document.createElement('tbody') as any
      tbody.ch = '.'
      expect(tbody.ch).to.equal('.')
    })

    it('HTMLTableSectionElement03 - chOff property on tfoot', () => {
      const tfoot = document.createElement('tfoot') as any
      tfoot.chOff = '2'
      expect(tfoot.chOff).to.equal('2')
    })

    it('HTMLTableSectionElement04 - vAlign property on tbody', () => {
      const tbody = document.createElement('tbody') as any
      tbody.vAlign = 'top'
      expect(tbody.vAlign).to.equal('top')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLTextAreaElement
  // ---------------------------------------------------------------------------
  describe('HTMLTextAreaElement', () => {
    it('HTMLTextAreaElement01 - form returns null', () => {
      const textarea = document.createElement('textarea') as any
      expect(textarea.form).to.equal(null)
    })

    it('HTMLTextAreaElement02 - defaultValue property', () => {
      const textarea = document.createElement('textarea') as any
      textarea.defaultValue = 'default text'
      expect(textarea.defaultValue).to.equal('default text')
    })

    it('HTMLTextAreaElement03 - cols property reflection', () => {
      const textarea = document.createElement('textarea') as any
      textarea.cols = 40
      expect(textarea.cols).to.equal(40)
    })

    it('HTMLTextAreaElement04 - disabled property reflection', () => {
      const textarea = document.createElement('textarea') as any
      textarea.disabled = true
      expect(textarea.disabled).to.equal(true)
    })

    it('HTMLTextAreaElement05 - name property reflection', () => {
      const textarea = document.createElement('textarea') as any
      textarea.name = 'comments'
      expect(textarea.name).to.equal('comments')
    })

    it('HTMLTextAreaElement06 - readOnly property reflection', () => {
      const textarea = document.createElement('textarea') as any
      textarea.readOnly = true
      expect(textarea.readOnly).to.equal(true)
    })

    it('HTMLTextAreaElement07 - rows property reflection', () => {
      const textarea = document.createElement('textarea') as any
      textarea.rows = 10
      expect(textarea.rows).to.equal(10)
    })

    it('HTMLTextAreaElement08 - tabIndex property reflection', () => {
      const textarea = document.createElement('textarea') as any
      textarea.tabIndex = 4
      expect(textarea.tabIndex).to.equal(4)
    })

    it('HTMLTextAreaElement09 - type returns textarea', () => {
      const textarea = document.createElement('textarea') as any
      expect(textarea.type).to.equal('textarea')
    })

    it('HTMLTextAreaElement10 - value property', () => {
      const textarea = document.createElement('textarea') as any
      textarea.value = 'user input'
      expect(textarea.value).to.equal('user input')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLTitleElement
  // ---------------------------------------------------------------------------
  describe('HTMLTitleElement', () => {
    it('HTMLTitleElement01 - text property', () => {
      const title = document.createElement('title') as any
      title.text = 'Page Title'
      expect(title.text).to.equal('Page Title')
    })
  })

  // ---------------------------------------------------------------------------
  // HTMLDocument (partially supported)
  // ---------------------------------------------------------------------------
  describe('HTMLDocument', () => {
    it.skip('HTMLDocument01-10 - requires document.title, document.cookie, document.domain, etc.')
  })
})
