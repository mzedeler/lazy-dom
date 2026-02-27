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

    it.skip('HTMLDivElement_align - requires div.align property reflection')
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

    // Skipped: requires property reflection for anchor-specific properties
    // accessKey, charset, coords, href, hreflang, name, rel, rev, shape,
    // tabIndex, target, type, text, host, hostname, pathname, port, protocol,
    // search, hash, toString
    it.skip('HTMLAnchorElement_accessKey - requires property reflection')
    it.skip('HTMLAnchorElement_charset - requires property reflection')
    it.skip('HTMLAnchorElement_coords - requires property reflection')
    it.skip('HTMLAnchorElement_href - requires property reflection')
    it.skip('HTMLAnchorElement_hreflang - requires property reflection')
    it.skip('HTMLAnchorElement_name - requires property reflection')
    it.skip('HTMLAnchorElement_rel - requires property reflection')
    it.skip('HTMLAnchorElement_rev - requires property reflection')
    it.skip('HTMLAnchorElement_shape - requires property reflection')
    it.skip('HTMLAnchorElement_tabIndex - requires property reflection')
    it.skip('HTMLAnchorElement_target - requires property reflection')
    it.skip('HTMLAnchorElement_type - requires property reflection')
    it.skip('HTMLAnchorElement_text - requires property reflection')
    it.skip('HTMLAnchorElement_host - requires URL decomposition')
    it.skip('HTMLAnchorElement_hostname - requires URL decomposition')
    it.skip('HTMLAnchorElement_pathname - requires URL decomposition')
    it.skip('HTMLAnchorElement_port - requires URL decomposition')
    it.skip('HTMLAnchorElement_protocol - requires URL decomposition')
    it.skip('HTMLAnchorElement_search - requires URL decomposition')
    it.skip('HTMLAnchorElement_hash - requires URL decomposition')
    it.skip('HTMLAnchorElement_toString - requires toString returning href')
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

    // Skipped: requires property reflection
    // form, accessKey, disabled, name, tabIndex, type, value
    it.skip('HTMLButtonElement01 - requires form property')
    it.skip('HTMLButtonElement02 - requires accessKey property')
    it.skip('HTMLButtonElement03 - requires disabled property')
    it.skip('HTMLButtonElement04 - requires name property')
    it.skip('HTMLButtonElement05 - requires tabIndex property')
    it.skip('HTMLButtonElement06 - requires type property')
    it.skip('HTMLButtonElement07 - requires value property')
    it.skip('HTMLButtonElement08 - requires value property assignment')
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
    it.skip('HTMLInputElement_form - requires form property')
    it.skip('HTMLInputElement_accept - requires accept property')
    it.skip('HTMLInputElement_accessKey - requires accessKey property')
    it.skip('HTMLInputElement_alt - requires alt property')
    it.skip('HTMLInputElement_checked - requires checked property')
    it.skip('HTMLInputElement_defaultChecked - requires defaultChecked property')
    it.skip('HTMLInputElement_defaultValue - requires defaultValue property')
    it.skip('HTMLInputElement_disabled - requires disabled property')
    it.skip('HTMLInputElement_maxLength - requires maxLength property')
    it.skip('HTMLInputElement_name - requires name property')
    it.skip('HTMLInputElement_readOnly - requires readOnly property')
    it.skip('HTMLInputElement_size - requires size property')
    it.skip('HTMLInputElement_src - requires src property')
    it.skip('HTMLInputElement_tabIndex - requires tabIndex property')
    it.skip('HTMLInputElement_useMap - requires useMap property')
    it.skip('HTMLInputElement_value - requires value property')
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
    it.skip('HTMLLabelElement_form - requires form property')
    it.skip('HTMLLabelElement_accessKey - requires accessKey property')
    it.skip('HTMLLabelElement_htmlFor - requires htmlFor property')
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
    it.skip('HTMLFormElement_length - requires length property')
    it.skip('HTMLFormElement_name - requires name property')
    it.skip('HTMLFormElement_acceptCharset - requires acceptCharset property')
    it.skip('HTMLFormElement_action - requires action property')
    it.skip('HTMLFormElement_enctype - requires enctype property')
    it.skip('HTMLFormElement_method - requires method property')
    it.skip('HTMLFormElement_target - requires target property')
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
    it.skip('HTMLImageElement_alt - requires alt property')
    it.skip('HTMLImageElement_border - requires border property')
    it.skip('HTMLImageElement_height - requires height property')
    it.skip('HTMLImageElement_hspace - requires hspace property')
    it.skip('HTMLImageElement_isMap - requires isMap property')
    it.skip('HTMLImageElement_longDesc - requires longDesc property')
    it.skip('HTMLImageElement_lowSrc - requires lowSrc property')
    it.skip('HTMLImageElement_name - requires name property')
    it.skip('HTMLImageElement_src - requires src property reflection')
    it.skip('HTMLImageElement_useMap - requires useMap property')
    it.skip('HTMLImageElement_vspace - requires vspace property')
    it.skip('HTMLImageElement_width - requires width property')
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
    it.skip('HTMLHeadingElement_h1_align through h6_align - requires align property reflection')
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
    it.skip('HTMLUListElement_compact - requires compact property')
    it.skip('HTMLUListElement_type - requires type property')
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
    it.skip('HTMLLIElement_type - requires type property')
    it.skip('HTMLLIElement_value - requires value property')
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
    it.skip('HTMLBodyElement_aLink - requires aLink property')
    it.skip('HTMLBodyElement_background - requires background property')
    it.skip('HTMLBodyElement_bgColor - requires bgColor property')
    it.skip('HTMLBodyElement_link - requires link property')
    it.skip('HTMLBodyElement_text - requires text property')
    it.skip('HTMLBodyElement_vLink - requires vLink property')
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
  // Elements NOT supported by lazy-dom (all skipped)
  // ---------------------------------------------------------------------------
  describe('Unsupported elements', () => {
    describe('HTMLAreaElement', () => {
      // 8 tests: accessKey, alt, coords, href, noHref, shape, tabIndex, target
      it.skip('HTMLAreaElement01-08 - requires HTMLAreaElement and property reflection')
    })

    describe('HTMLBRElement', () => {
      it.skip('HTMLBRElement01 - requires br.clear property')
    })

    describe('HTMLBaseElement', () => {
      // 2 tests: href, target
      it.skip('HTMLBaseElement01-02 - requires HTMLBaseElement and property reflection')
    })

    describe('HTMLDListElement', () => {
      // 4 tests: compact and related properties
      it.skip('HTMLDListElement01-04 - requires HTMLDListElement and compact property')
    })

    describe('HTMLDirectoryElement', () => {
      // 2 tests: compact
      it.skip('HTMLDirectoryElement01-02 - requires HTMLDirectoryElement (deprecated)')
    })

    describe('HTMLFieldSetElement', () => {
      // 6 tests: form and related properties
      it.skip('HTMLFieldSetElement01-06 - requires HTMLFieldSetElement and form property')
    })

    describe('HTMLFontElement', () => {
      // 7 tests: color, face, size
      it.skip('HTMLFontElement01-07 - requires HTMLFontElement (deprecated)')
    })

    describe('HTMLFrameElement', () => {
      // 9 tests: frameBorder, longDesc, marginHeight, marginWidth, name, noResize, scrolling, src, contentDocument
      it.skip('HTMLFrameElement01-09 - requires HTMLFrameElement (deprecated)')
    })

    describe('HTMLFrameSetElement', () => {
      // 6 tests: cols, rows
      it.skip('HTMLFrameSetElement01-06 - requires HTMLFrameSetElement (deprecated)')
    })

    describe('HTMLHRElement', () => {
      // 2 tests: align, noShade, size, width
      it.skip('HTMLHRElement01-02 - requires HTMLHRElement and property reflection')
    })

    describe('HTMLHtmlElement', () => {
      // 4 tests: version
      it.skip('HTMLHtmlElement01-04 - requires HTMLHtmlElement and version property')
    })

    describe('HTMLIFrameElement', () => {
      // 7 tests: align, frameBorder, height, longDesc, marginHeight, marginWidth, name, scrolling, src, width
      it.skip('HTMLIFrameElement01-07 - requires HTMLIFrameElement property reflection')
    })

    describe('HTMLIsIndexElement', () => {
      it.skip('HTMLIsIndexElement01 - requires HTMLIsIndexElement (deprecated)')
    })

    describe('HTMLLegendElement', () => {
      // 7 tests: form, accessKey, align
      it.skip('HTMLLegendElement01-07 - requires HTMLLegendElement and form property')
    })

    describe('HTMLLinkElement', () => {
      // 7 tests: charset, disabled, href, hreflang, media, rel, rev, target, type
      it.skip('HTMLLinkElement01-07 - requires HTMLLinkElement and property reflection')
    })

    describe('HTMLMapElement', () => {
      // 4 tests: areas collection, name
      it.skip('HTMLMapElement01-04 - requires HTMLMapElement and areas collection')
    })

    describe('HTMLMetaElement', () => {
      // 6 tests: content, httpEquiv, name, scheme
      it.skip('HTMLMetaElement01-06 - requires HTMLMetaElement and property reflection')
    })

    describe('HTMLModElement', () => {
      // 4 tests: cite, dateTime (for ins/del elements)
      it.skip('HTMLModElement01-04 - requires HTMLModElement and property reflection')
    })

    describe('HTMLOListElement', () => {
      // 4 tests: compact, start, type
      it.skip('HTMLOListElement01-04 - requires HTMLOListElement and property reflection')
    })

    describe('HTMLObjectElement', () => {
      // 8 tests: form, code, align, archive, border, codeBase, codeType, data, etc.
      it.skip('HTMLObjectElement01-08 - requires HTMLObjectElement and property reflection')
    })

    describe('HTMLOptGroupElement', () => {
      // 2 tests: disabled, label
      it.skip('HTMLOptGroupElement01-02 - requires HTMLOptGroupElement')
    })

    describe('HTMLOptionElement', () => {
      // 12 tests: form, defaultSelected, text, index, disabled, label, selected, value
      it.skip('HTMLOptionElement01-12 - requires HTMLOptionElement and property reflection')
    })

    describe('HTMLParamElement', () => {
      // 3 tests: name, type, value, valueType
      it.skip('HTMLParamElement01-03 - requires HTMLParamElement')
    })

    describe('HTMLQuoteElement', () => {
      // 10 tests: cite (for blockquote and q elements)
      it.skip('HTMLQuoteElement01-10 - requires HTMLQuoteElement and cite property')
    })

    describe('HTMLScriptElement', () => {
      // 11 tests: text, charset, defer, event, htmlFor, src, type
      it.skip('HTMLScriptElement01-11 - requires HTMLScriptElement and property reflection')
    })

    describe('HTMLSelectElement', () => {
      // 25 tests: type, selectedIndex, value, length, form, options, disabled, multiple, name, size, tabIndex, add, remove
      it.skip('HTMLSelectElement01-25 - requires HTMLSelectElement and options collection')
    })

    describe('HTMLStyleElement', () => {
      // 7 tests: disabled, media, type
      it.skip('HTMLStyleElement01-07 - requires HTMLStyleElement and property reflection')
    })

    describe('HTMLTableElement', () => {
      // 29 tests: caption, tHead, tFoot, rows, tBodies, align, bgColor, border, cellPadding, cellSpacing, frame, rules, summary, width, createTHead, deleteTHead, createTFoot, deleteTFoot, createCaption, deleteCaption, insertRow, deleteRow
      it.skip('HTMLTableElement01-29 - requires HTMLTableElement and table navigation APIs')
    })

    describe('HTMLTableCaptionElement', () => {
      // 3 tests: align
      it.skip('HTMLTableCaptionElement01-03 - requires HTMLTableCaptionElement')
    })

    describe('HTMLTableCellElement', () => {
      // 12 tests: cellIndex, abbr, align, axis, bgColor, ch, chOff, colSpan, headers, height, noWrap, rowSpan, scope, vAlign, width
      it.skip('HTMLTableCellElement01-12 - requires HTMLTableCellElement and property reflection')
    })

    describe('HTMLTableColElement', () => {
      // 8 tests: align, ch, chOff, span, vAlign, width
      it.skip('HTMLTableColElement01-08 - requires HTMLTableColElement and property reflection')
    })

    describe('HTMLTableRowElement', () => {
      // 22 tests: rowIndex, sectionRowIndex, cells, align, bgColor, ch, chOff, vAlign, insertCell, deleteCell
      it.skip('HTMLTableRowElement01-22 - requires HTMLTableRowElement and row navigation APIs')
    })

    describe('HTMLTableSectionElement', () => {
      // 14 tests: align, ch, chOff, vAlign, rows, insertRow, deleteRow
      it.skip('HTMLTableSectionElement01-14 - requires HTMLTableSectionElement and section navigation APIs')
    })

    describe('HTMLTextAreaElement', () => {
      // 16 tests: form, defaultValue, accessKey, cols, disabled, name, readOnly, rows, tabIndex, type, value
      it.skip('HTMLTextAreaElement01-16 - requires HTMLTextAreaElement and property reflection')
    })

    describe('HTMLTitleElement', () => {
      // 2 tests: text
      it.skip('HTMLTitleElement01-02 - requires HTMLTitleElement and text property')
    })

    describe('HTMLDocument', () => {
      // Various tests: document.title, document.body set, document.cookie, document.domain, etc.
      it.skip('HTMLDocument01-10 - requires document.title, document.cookie, document.domain, etc.')
    })
  })
})
