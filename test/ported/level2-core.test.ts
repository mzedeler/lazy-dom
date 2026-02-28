import { expect } from 'chai'

describe('level2/core', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  // ---------------------------------------------------------------------------
  // getElementById
  // ---------------------------------------------------------------------------
  describe('getElementById', () => {
    it('getElementById01: returns element with matching id attribute', () => {
      const el = document.createElement('div')
      el.setAttribute('id', 'test-id')
      document.body.appendChild(el)

      const result = document.getElementById('test-id')
      expect(result).to.equal(el)
    })

    it('getElementById02: returns null for nonexistent id', () => {
      const result = document.getElementById('no-such-id')
      expect(result).to.equal(null)
    })
  })

  // ---------------------------------------------------------------------------
  // hasAttribute
  // ---------------------------------------------------------------------------
  describe('hasAttribute', () => {
    it('hasAttribute01: returns true when attribute exists', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'some value')

      expect(el.hasAttribute('title')).to.equal(true)
    })

    it('hasAttribute03: returns false when attribute does not exist', () => {
      const el = document.createElement('div')

      expect(el.hasAttribute('title')).to.equal(false)
    })

    it('hasAttribute04: returns false after attribute is removed', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'some value')
      el.removeAttribute('title')

      expect(el.hasAttribute('title')).to.equal(false)
    })

    it('hasAttributeNS01 - returns true for existing namespaced attribute', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      expect(el.hasAttributeNS('http://www.nist.gov', 'domestic')).to.equal(true)
    })

    it('hasAttributeNS02 - returns false for nonexistent namespaced attribute', () => {
      const el = document.createElement('div')
      expect(el.hasAttributeNS('http://www.nist.gov', 'domestic')).to.equal(false)
    })

    it('hasAttributeNS03 - returns false after removing namespaced attribute', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      el.removeAttributeNS('http://www.nist.gov', 'domestic')
      expect(el.hasAttributeNS('http://www.nist.gov', 'domestic')).to.equal(false)
    })

    it('hasAttributeNS05 - returns false for wrong namespace', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      expect(el.hasAttributeNS('http://www.other.gov', 'domestic')).to.equal(false)
    })

    it.skip('hasAttributeNS06 [requires parsed XML fixture]', () => {})

    it('hasAttributes01: returns true when element has attributes', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      expect(el.hasAttributes()).to.equal(true)
    })

    it('hasAttributes02: returns false when element has no attributes', () => {
      const el = document.createElement('div')
      expect(el.hasAttributes()).to.equal(false)
    })
  })

  // ---------------------------------------------------------------------------
  // Element.namespaceURI
  // ---------------------------------------------------------------------------
  describe('Element.namespaceURI', () => {
    it('namespaceURI01: element created with createElementNS has correct namespaceURI', () => {
      const el = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')

      expect(el.namespaceURI).to.equal('http://www.w3.org/1999/xhtml')
    })

    // In lazy-dom, createElement returns null namespaceURI.
    // In JSDOM (per spec), createElement returns 'http://www.w3.org/1999/xhtml'.
    // This test asserts lazy-dom's behavior; it will not pass against JSDOM.
    it('namespaceURI03: element created with createElement has null namespaceURI', function () {
      const el = document.createElement('div')

      // Skip when running under JSDOM where namespaceURI defaults to XHTML
      if (el.namespaceURI === 'http://www.w3.org/1999/xhtml') {
        this.skip()
      }

      expect(el.namespaceURI).to.equal(null)
    })

    // --- Regression: cloneNode preserves namespace attributes (Bug #4) ---
    it('preserves namespaceURI on cloned element', () => {
      const el = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
      const clone = el.cloneNode(false) as Element
      expect(clone.namespaceURI).to.equal('http://www.w3.org/1999/xhtml')
    })

    it('preserves namespaced attributes on deep clone', () => {
      const el = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
      el.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:lang', 'en')
      const clone = el.cloneNode(true) as Element
      expect(clone.getAttributeNS('http://www.w3.org/XML/1998/namespace', 'lang')).to.equal('en')
    })

    // Skipped: tests using parsed fixtures
    it.skip('namespaceURI02 [requires parsed XML fixture]', () => {})
    it.skip('namespaceURI04 [requires parsed XML fixture]', () => {})
  })

  // ---------------------------------------------------------------------------
  // getElementsByTagNameNS
  // ---------------------------------------------------------------------------
  describe('getElementsByTagNameNS', () => {
    it('getElementsByTagNameNS_basic: finds element by namespace and local name', () => {
      const el = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
      document.body.appendChild(el)

      const result = document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'div')
      expect(result.length).to.be.greaterThan(0)

      let found = false
      for (let i = 0; i < result.length; i++) {
        if (result.item(i) === el) {
          found = true
          break
        }
      }
      expect(found).to.equal(true)
    })

    // Skipped: various complex NS query tests requiring parsed XML fixtures or wildcards
    it.skip('getElementsByTagNameNS01 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS02 [requires wildcard support]', () => {})
    it.skip('getElementsByTagNameNS03 [requires wildcard support]', () => {})
    it.skip('getElementsByTagNameNS04 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS05 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS06 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS07 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS08 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS09 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS10 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS11 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS12 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS13 [requires parsed XML fixture]', () => {})
    it.skip('getElementsByTagNameNS14 [requires parsed XML fixture]', () => {})
  })

  // ---------------------------------------------------------------------------
  // Attr.ownerElement
  // ---------------------------------------------------------------------------
  describe('Attr.ownerElement', () => {
    it('ownerElement01: getAttributeNode returns attr whose ownerElement is the element', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'some value')

      const attr = el.getAttributeNode('title')
      expect(attr).to.not.equal(null)
      expect(attr!.ownerElement).to.equal(el)
    })

    it('ownerElement02: attr.ownerElement reflects the element it belongs to', () => {
      const el = document.createElement('span')
      el.setAttribute('class', 'highlight')

      const attr = el.getAttributeNode('class')
      expect(attr).to.not.equal(null)
      expect(attr!.ownerElement).to.equal(el)
      expect(attr!.value).to.equal('highlight')
    })
  })

  // ---------------------------------------------------------------------------
  // createAttributeNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('createAttributeNS', () => {
    it('createAttributeNS01 - creates attr with correct properties', () => {
      const attr = document.createAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:lang')
      expect(attr.nodeName).to.equal('xml:lang')
      expect(attr.name).to.equal('xml:lang')
      expect(attr.namespaceURI).to.equal('http://www.w3.org/XML/1998/namespace')
      expect(attr.prefix).to.equal('xml')
      expect(attr.localName).to.equal('lang')
      expect(attr.value).to.equal('')
    })

    it('createAttributeNS02 - creates attr without prefix', () => {
      const attr = document.createAttributeNS('http://www.example.com', 'test')
      expect(attr.nodeName).to.equal('test')
      expect(attr.namespaceURI).to.equal('http://www.example.com')
      expect(attr.prefix).to.equal(null)
      expect(attr.localName).to.equal('test')
    })

    it('createAttributeNS03 - throws NAMESPACE_ERR for prefix with null namespace', () => {
      let threw = false
      try {
        document.createAttributeNS(null, 'foo:bar')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14) // NAMESPACE_ERR
      }
      expect(threw).to.equal(true)
    })

    it('createAttributeNS04 - throws NAMESPACE_ERR for xml prefix with wrong namespace', () => {
      let threw = false
      try {
        document.createAttributeNS('http://www.wrong.com', 'xml:lang')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it('createAttributeNS05 - xmlns qualified name requires xmlns namespace', () => {
      let threw = false
      try {
        document.createAttributeNS('http://www.wrong.com', 'xmlns')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it('createAttributeNS06 - xmlns prefix requires xmlns namespace', () => {
      let threw = false
      try {
        document.createAttributeNS('http://www.wrong.com', 'xmlns:foo')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })
  })

  // ---------------------------------------------------------------------------
  // createDocument (all skipped)
  // ---------------------------------------------------------------------------
  describe('createDocument [requires DOMImplementation.createDocument]', () => {
    it.skip('createDocument01', () => {})
    it.skip('createDocument02', () => {})
    it.skip('createDocument03', () => {})
    it.skip('createDocument04', () => {})
    it.skip('createDocument05', () => {})
    it.skip('createDocument06', () => {})
    it.skip('createDocument07', () => {})
    it.skip('createDocument08', () => {})
  })

  // ---------------------------------------------------------------------------
  // createDocumentType (all skipped)
  // ---------------------------------------------------------------------------
  describe('createDocumentType [requires DOMImplementation.createDocumentType]', () => {
    it.skip('createDocumentType01', () => {})
    it.skip('createDocumentType02', () => {})
    it.skip('createDocumentType03', () => {})
    it.skip('createDocumentType04', () => {})
  })

  // ---------------------------------------------------------------------------
  // createElementNS
  // ---------------------------------------------------------------------------
  describe('createElementNS', () => {
    it('createElementNS_basic: creates element with correct tagName and namespaceURI', () => {
      const el = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')

      expect(el.tagName).to.equal('DIV')
      expect(el.namespaceURI).to.equal('http://www.w3.org/1999/xhtml')
    })

    it('createElementNS01 - creates element with correct namespace properties', () => {
      const el = document.createElementNS('http://www.w3.org/DOM/Test/level2', 'XML:XML')
      expect(el.nodeName).to.equal('XML:XML')
      expect(el.namespaceURI).to.equal('http://www.w3.org/DOM/Test/level2')
      expect(el.localName).to.equal('XML')
      expect(el.prefix).to.equal('XML')
      expect(el.tagName).to.equal('XML:XML')
    })

    it('createElementNS02 - throws NAMESPACE_ERR for prefix with null namespace', () => {
      let threw = false
      try {
        document.createElementNS(null, 'prefix:localName')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it.skip('createElementNS03 [requires INVALID_CHARACTER_ERR validation]', () => {})

    it('createElementNS04 - throws NAMESPACE_ERR for xml prefix with wrong namespace', () => {
      let threw = false
      try {
        document.createElementNS('http://www.w3.org/XML/1998/namespaces', 'xml:element1')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it.skip('createElementNS05 [requires INVALID_CHARACTER_ERR validation]', () => {})
    it.skip('createElementNS06 [requires DOMImplementation.createDocument]', () => {})
  })

  // ---------------------------------------------------------------------------
  // documentcreateattributeNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('documentcreateattributeNS', () => {
    it('documentcreateattributeNS01 - creates attr with namespace properties', () => {
      const attr = document.createAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns')
      expect(attr.name).to.equal('xmlns')
      expect(attr.namespaceURI).to.equal('http://www.w3.org/2000/xmlns/')
    })

    it('documentcreateattributeNS02 - throws NAMESPACE_ERR for prefix with null namespace', () => {
      let threw = false
      try {
        document.createAttributeNS(null, 'prefix:local')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it('documentcreateattributeNS03 - creates attr with prefix and localName', () => {
      const attr = document.createAttributeNS('http://www.example.com', 'ns:test')
      expect(attr.prefix).to.equal('ns')
      expect(attr.localName).to.equal('test')
      expect(attr.name).to.equal('ns:test')
    })

    it('documentcreateattributeNS04 - creates attr without prefix', () => {
      const attr = document.createAttributeNS('http://www.example.com', 'test')
      expect(attr.prefix).to.equal(null)
      expect(attr.localName).to.equal('test')
      expect(attr.namespaceURI).to.equal('http://www.example.com')
    })

    it('documentcreateattributeNS05 - throws NAMESPACE_ERR for xml prefix with wrong namespace', () => {
      let threw = false
      try {
        document.createAttributeNS('http://www.wrong.com', 'xml:attr')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it('documentcreateattributeNS06 - creates xml-prefixed attr with correct namespace', () => {
      const attr = document.createAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:lang')
      expect(attr.prefix).to.equal('xml')
      expect(attr.localName).to.equal('lang')
      expect(attr.namespaceURI).to.equal('http://www.w3.org/XML/1998/namespace')
    })

    it('documentcreateattributeNS07 - throws NAMESPACE_ERR for xmlns prefix with wrong namespace', () => {
      let threw = false
      try {
        document.createAttributeNS('http://www.wrong.com', 'xmlns:foo')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })
  })

  // ---------------------------------------------------------------------------
  // documentcreateelementNS (skipped error handling)
  // ---------------------------------------------------------------------------
  describe('documentcreateelementNS', () => {
    it('documentcreateelementNS01 - creates element with full namespace properties', () => {
      const el = document.createElementNS('http://www.w3.org/DOM/Test/level2', 'XML:XML')
      expect(el.nodeName).to.equal('XML:XML')
      expect(el.namespaceURI).to.equal('http://www.w3.org/DOM/Test/level2')
      expect(el.localName).to.equal('XML')
      expect(el.prefix).to.equal('XML')
      expect(el.tagName).to.equal('XML:XML')
    })

    it.skip('documentcreateelementNS02 [requires INVALID_CHARACTER_ERR validation]', () => {})

    it('documentcreateelementNS03 - throws NAMESPACE_ERR for prefix with null namespace', () => {
      let threw = false
      try {
        document.createElementNS(null, 'null:xml')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it('documentcreateelementNS04 - throws NAMESPACE_ERR for xml prefix with wrong namespace', () => {
      let threw = false
      try {
        document.createElementNS('http://www.w3.org/XML/1998/namespaces', 'xml:element1')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })
  })

  // ---------------------------------------------------------------------------
  // documentgetelementsbytagnameNS
  // ---------------------------------------------------------------------------
  describe('documentgetelementsbytagnameNS', () => {
    it('documentgetelementsbytagnameNS_basic: finds namespaced element via getElementsByTagNameNS', () => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      document.body.appendChild(el)

      const result = document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg')
      expect(result.length).to.be.greaterThan(0)

      let found = false
      for (let i = 0; i < result.length; i++) {
        if (result.item(i) === el) {
          found = true
          break
        }
      }
      expect(found).to.equal(true)
    })

    // Skipped: tests requiring parsed XML fixtures or wildcards not supported
    it.skip('documentgetelementsbytagnameNS01 [requires parsed XML fixture]', () => {})
    it.skip('documentgetelementsbytagnameNS02 [requires parsed XML fixture]', () => {})
    it.skip('documentgetelementsbytagnameNS03 [requires wildcard support]', () => {})
    it.skip('documentgetelementsbytagnameNS04 [requires parsed XML fixture]', () => {})
    it.skip('documentgetelementsbytagnameNS05 [requires parsed XML fixture]', () => {})
  })

  // ---------------------------------------------------------------------------
  // documentimportnode (all skipped)
  // ---------------------------------------------------------------------------
  describe('documentimportnode', () => {
    it('documentimportnode01 - imports element (shallow)', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      el.appendChild(document.createTextNode('hello'))
      const imported = document.importNode(el, false)
      expect(imported.nodeName).to.equal('DIV')
      expect(imported.getAttribute('class')).to.equal('test')
      expect(imported.childNodes.length).to.equal(0)
    })

    it('documentimportnode02 - imports element (deep)', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      el.appendChild(document.createTextNode('hello'))
      const imported = document.importNode(el, true)
      expect(imported.nodeName).to.equal('DIV')
      expect(imported.childNodes.length).to.equal(1)
      expect(imported.textContent).to.equal('hello')
    })

    it('documentimportnode03 - imports text node', () => {
      const text = document.createTextNode('test data')
      const imported = document.importNode(text, false)
      expect(imported.nodeType).to.equal(3)
      expect(imported.nodeValue).to.equal('test data')
    })

    it('documentimportnode04 - imports comment', () => {
      const comment = document.createComment('test comment')
      const imported = document.importNode(comment, false)
      expect(imported.nodeType).to.equal(8)
      expect(imported.nodeValue).to.equal('test comment')
    })

    it('documentimportnode05 - imports document fragment (deep)', () => {
      const frag = document.createDocumentFragment()
      frag.appendChild(document.createElement('span'))
      frag.appendChild(document.createTextNode('text'))
      const imported = document.importNode(frag, true)
      expect(imported.nodeType).to.equal(11)
      expect(imported.childNodes.length).to.equal(2)
    })

    it('documentimportnode06 - imported element has null parentNode', () => {
      const el = document.createElement('div')
      const imported = document.importNode(el, false)
      expect(imported.parentNode).to.equal(null)
    })

    it('documentimportnode07 - imports element with namespaced attrs', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const imported = document.importNode(el, false)
      expect(imported.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('Yes')
    })

    it('documentimportnode08 - imports processing instruction', () => {
      const pi = document.createProcessingInstruction('target', 'data')
      const imported = document.importNode(pi, false)
      expect(imported.nodeType).to.equal(7)
      expect(imported.nodeValue).to.equal('data')
    })

    it('documentimportnode09 - deep import copies subtree', () => {
      const div = document.createElement('div')
      const span = document.createElement('span')
      span.appendChild(document.createTextNode('hello'))
      div.appendChild(span)
      const imported = document.importNode(div, true)
      expect(imported.childNodes.length).to.equal(1)
      expect(imported.firstChild!.nodeName).to.equal('SPAN')
      expect(imported.firstChild!.firstChild!.nodeValue).to.equal('hello')
    })
  })

  // ---------------------------------------------------------------------------
  // documenttypepublicid / documenttypesystemid (all skipped)
  // ---------------------------------------------------------------------------
  describe('documenttypepublicid / documenttypesystemid [requires doctype]', () => {
    it.skip('documenttypepublicid01', () => {})
    it.skip('documenttypesystemid01', () => {})
  })

  // ---------------------------------------------------------------------------
  // domimplementation tests (all skipped)
  // ---------------------------------------------------------------------------
  describe('domimplementation', () => {
    it.skip('domimplementationcreatedocument01 [requires DOMImplementation.createDocument]', () => {})
    it.skip('domimplementationcreatedocument02 [requires DOMImplementation.createDocument]', () => {})
    it.skip('domimplementationcreatedocument03 [requires DOMImplementation.createDocument]', () => {})
    it.skip('domimplementationcreatedocument04 [requires DOMImplementation.createDocument]', () => {})
    it.skip('domimplementationcreatedocument05 [requires DOMImplementation.createDocument]', () => {})
    it.skip('domimplementationcreatedocumenttype01 [requires DOMImplementation.createDocumentType]', () => {})
    it.skip('domimplementationcreatedocumenttype02 [requires DOMImplementation.createDocumentType]', () => {})
    it.skip('domimplementationcreatedocumenttype03 [requires DOMImplementation.createDocumentType]', () => {})
    it.skip('domimplementationcreatedocumenttype04 [requires DOMImplementation.createDocumentType]', () => {})
    it('domimplementationhasfeature01 - hasFeature returns true', () => {
      const impl = document.implementation
      expect(impl.hasFeature('Core', '2.0')).to.equal(true)
    })
  })

  // ---------------------------------------------------------------------------
  // elementgetattributenodens (all skipped)
  // ---------------------------------------------------------------------------
  describe('elementgetattributenodens', () => {
    it('elementgetattributenodens01 - returns attr node by ns+localName', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const attr = el.getAttributeNodeNS('http://www.nist.gov', 'domestic')
      expect(attr).to.not.equal(null)
      expect(attr!.value).to.equal('Yes')
      expect(attr!.namespaceURI).to.equal('http://www.nist.gov')
    })

    it('elementgetattributenodens02 - returns null for nonexistent', () => {
      const el = document.createElement('div')
      const attr = el.getAttributeNodeNS('http://www.nist.gov', 'missing')
      expect(attr).to.equal(null)
    })
  })

  // ---------------------------------------------------------------------------
  // elementgetelementsbytagnamens (all skipped)
  // ---------------------------------------------------------------------------
  describe('elementgetelementsbytagnamens', () => {
    it('elementgetelementsbytagnamens01 - finds elements by ns+localName', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const child = document.createElementNS('http://www.nist.gov', 'emp:employee')
      parent.appendChild(child)
      const result = parent.getElementsByTagNameNS('http://www.nist.gov', 'employee')
      expect(result.length).to.equal(1)
      expect(result[0]).to.equal(child)
    })

    it('elementgetelementsbytagnamens02 - returns empty for wrong namespace', () => {
      const parent = document.createElement('div')
      const child = document.createElementNS('http://www.nist.gov', 'emp:employee')
      parent.appendChild(child)
      const result = parent.getElementsByTagNameNS('http://www.other.gov', 'employee')
      expect(result.length).to.equal(0)
    })

    it('elementgetelementsbytagnamens03 - wildcard localName matches all', () => {
      const parent = document.createElement('div')
      const child1 = document.createElementNS('http://www.nist.gov', 'emp:employee')
      const child2 = document.createElementNS('http://www.nist.gov', 'emp:address')
      parent.appendChild(child1)
      parent.appendChild(child2)
      const result = parent.getElementsByTagNameNS('http://www.nist.gov', '*')
      expect(result.length).to.equal(2)
    })
  })

  // ---------------------------------------------------------------------------
  // elementremoveattributens (skipped)
  // ---------------------------------------------------------------------------
  describe('elementremoveattributens', () => {
    it('elementremoveattributens01 - removes namespaced attribute', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      expect(el.hasAttributeNS('http://www.nist.gov', 'domestic')).to.equal(true)
      el.removeAttributeNS('http://www.nist.gov', 'domestic')
      expect(el.hasAttributeNS('http://www.nist.gov', 'domestic')).to.equal(false)
    })
  })

  // ---------------------------------------------------------------------------
  // elementsetattributenodens (all skipped)
  // ---------------------------------------------------------------------------
  describe('elementsetattributenodens', () => {
    it('elementsetattributenodens01 - adds attr via setAttributeNodeNS', () => {
      const el = document.createElement('div')
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr.value = 'Yes'
      el.setAttributeNodeNS(attr)
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('Yes')
    })

    it('elementsetattributenodens02 - replaces attr with same ns+localName', () => {
      const el = document.createElement('div')
      const attr1 = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr1.value = 'Yes'
      el.setAttributeNodeNS(attr1)
      const attr2 = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr2.value = 'No'
      const old = el.setAttributeNodeNS(attr2)
      expect(old).to.equal(attr1)
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('No')
    })

    it('elementsetattributenodens03 - throws INUSE_ATTRIBUTE_ERR', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr.value = 'Yes'
      el1.setAttributeNodeNS(attr)
      let threw = false
      try {
        el2.setAttributeNodeNS(attr)
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(10) // INUSE_ATTRIBUTE_ERR
      }
      expect(threw).to.equal(true)
    })
  })

  // ---------------------------------------------------------------------------
  // elementsetattributens (all skipped)
  // ---------------------------------------------------------------------------
  describe('elementsetattributens', () => {
    it('elementsetattributens01 - sets namespaced attribute', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('Yes')
    })

    it('elementsetattributens02 - overwrites existing value', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'No')
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('No')
    })

    it('elementsetattributens03 - throws NAMESPACE_ERR for prefix with null ns', () => {
      const el = document.createElement('div')
      let threw = false
      try {
        el.setAttributeNS(null, 'emp:domestic', 'Yes')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it('elementsetattributens04 - throws NAMESPACE_ERR for xml prefix with wrong ns', () => {
      const el = document.createElement('div')
      let threw = false
      try {
        el.setAttributeNS('http://www.wrong.com', 'xml:lang', 'en')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it('elementsetattributens05 - sets attr with xmlns prefix and correct ns', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:ns', 'http://example.com')
      expect(el.getAttributeNS('http://www.w3.org/2000/xmlns/', 'ns')).to.equal('http://example.com')
    })

    it.skip('elementsetattributens06 [requires parsed XML fixture]', () => {})
    it.skip('elementsetattributens07 [requires parsed XML fixture]', () => {})

    it('elementsetattributens08 - throws NAMESPACE_ERR for xmlns with wrong ns', () => {
      const el = document.createElement('div')
      let threw = false
      try {
        el.setAttributeNS('http://www.wrong.com', 'xmlns', 'val')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it.skip('elementsetattributens09 [requires parsed XML fixture]', () => {})
  })

  // ---------------------------------------------------------------------------
  // getAttributeNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('getAttributeNS', () => {
    it.skip('getAttributeNS01 [requires parsed XML fixture]', () => {})

    it('getAttributeNS02 - returns empty string for attr with no value', () => {
      const el = document.createElement('div')
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:district')
      el.setAttributeNodeNS(attr)
      const result = el.getAttributeNS('http://www.nist.gov', 'district')
      expect(result).to.equal('')
    })

    it('getAttributeNS03 - returns null after removing attribute', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      el.removeAttributeNS('http://www.nist.gov', 'domestic')
      const result = el.getAttributeNS('http://www.nist.gov', 'domestic')
      expect(result).to.equal(null)
    })

    it('getAttributeNS04 - returns value after setAttributeNS', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:blank', 'NewValue')
      const result = el.getAttributeNS('http://www.nist.gov', 'blank')
      expect(result).to.equal('NewValue')
    })

    it('getAttributeNS05 - returns null for nonexistent namespace', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:test', 'val')
      const result = el.getAttributeNS('http://www.other.gov', 'test')
      expect(result).to.equal(null)
    })
  })

  // ---------------------------------------------------------------------------
  // getAttributeNodeNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('getAttributeNodeNS', () => {
    it('getAttributeNodeNS01 - returns correct attr node', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const attr = el.getAttributeNodeNS('http://www.nist.gov', 'domestic')
      expect(attr).to.not.equal(null)
      expect(attr!.localName).to.equal('domestic')
      expect(attr!.value).to.equal('Yes')
    })

    it('getAttributeNodeNS02 - returns null for nonexistent', () => {
      const el = document.createElement('div')
      const attr = el.getAttributeNodeNS('http://www.nist.gov', 'missing')
      expect(attr).to.equal(null)
    })
  })

  // ---------------------------------------------------------------------------
  // getNamedItemNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('getNamedItemNS', () => {
    it('getNamedItemNS01 - retrieves attr by namespace and localName', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const attr = el.attributes.getNamedItemNS('http://www.nist.gov', 'domestic')
      expect(attr).to.not.equal(null)
      expect(attr!.value).to.equal('Yes')
    })

    it('getNamedItemNS02 - returns null for nonexistent ns+localName', () => {
      const el = document.createElement('div')
      el.setAttribute('test', 'val')
      const attr = el.attributes.getNamedItemNS('http://www.other.com', 'test')
      expect(attr).to.equal(null)
    })
  })

  // ---------------------------------------------------------------------------
  // importNode (all skipped)
  // ---------------------------------------------------------------------------
  describe('importNode', () => {
    it('importNode01 - imported element is a clone', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'test')
      const imported = document.importNode(el, false)
      expect(imported).to.not.equal(el)
      expect(imported.getAttribute('title')).to.equal('test')
    })

    it('importNode02 - imported text is a clone', () => {
      const text = document.createTextNode('hello')
      const imported = document.importNode(text, false)
      expect(imported).to.not.equal(text)
      expect(imported.nodeValue).to.equal('hello')
    })

    it('importNode03 - imported comment is a clone', () => {
      const comment = document.createComment('test')
      const imported = document.importNode(comment, false)
      expect(imported).to.not.equal(comment)
      expect(imported.nodeValue).to.equal('test')
    })

    it('importNode04 - deep import of element with children', () => {
      const el = document.createElement('div')
      el.appendChild(document.createElement('span'))
      el.appendChild(document.createTextNode('text'))
      const imported = document.importNode(el, true)
      expect(imported.childNodes.length).to.equal(2)
      expect(imported.firstChild!.nodeName).to.equal('SPAN')
    })

    it('importNode05 - shallow import of element has no children', () => {
      const el = document.createElement('div')
      el.appendChild(document.createElement('span'))
      const imported = document.importNode(el, false)
      expect(imported.childNodes.length).to.equal(0)
    })

    it('importNode06 - imported node has correct ownerDocument', () => {
      const el = document.createElement('div')
      const imported = document.importNode(el, false)
      expect(imported.ownerDocument).to.equal(document)
    })

    it('importNode07 - imported fragment deep copies children', () => {
      const frag = document.createDocumentFragment()
      frag.appendChild(document.createElement('p'))
      const imported = document.importNode(frag, true)
      expect(imported.nodeType).to.equal(11)
      expect(imported.childNodes.length).to.equal(1)
    })

    it('importNode08 - import preserves attributes', () => {
      const el = document.createElement('div')
      el.setAttribute('id', 'original')
      el.setAttribute('class', 'test')
      const imported = document.importNode(el, false)
      expect(imported.getAttribute('id')).to.equal('original')
      expect(imported.getAttribute('class')).to.equal('test')
    })
  })

  // ---------------------------------------------------------------------------
  // localName (all skipped)
  // ---------------------------------------------------------------------------
  describe('localName', () => {
    it('localName01 - element created with createElementNS has correct localName', () => {
      const el = document.createElementNS('http://www.nist.gov', 'emp:employee')
      expect(el.localName).to.equal('employee')
    })

    it('localName02 - attr created with createAttributeNS has correct localName', () => {
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      expect(attr.localName).to.equal('domestic')
    })

    it('localName03 - element created with createElement has localName', () => {
      const el = document.createElement('div')
      expect(el.localName).to.equal('div')
    })
  })

  // ---------------------------------------------------------------------------
  // namednodemapgetnameditemns (all skipped)
  // ---------------------------------------------------------------------------
  describe('namednodemapgetnameditemns', () => {
    it('namednodemapgetnameditemns01 - returns attr by ns+localName', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const attr = el.attributes.getNamedItemNS('http://www.nist.gov', 'domestic')
      expect(attr).to.not.equal(null)
      expect(attr!.localName).to.equal('domestic')
    })

    it('namednodemapgetnameditemns02 - returns null for wrong namespace', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const attr = el.attributes.getNamedItemNS('http://www.other.gov', 'domestic')
      expect(attr).to.equal(null)
    })

    it('namednodemapgetnameditemns03 - returns null for wrong localName', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const attr = el.attributes.getNamedItemNS('http://www.nist.gov', 'other')
      expect(attr).to.equal(null)
    })

    it('namednodemapgetnameditemns04 - retrieves correct attr among multiple', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      el.setAttributeNS('http://www.other.gov', 'other:domestic', 'No')
      const attr = el.attributes.getNamedItemNS('http://www.nist.gov', 'domestic')
      expect(attr).to.not.equal(null)
      expect(attr!.value).to.equal('Yes')
    })

    it.skip('namednodemapgetnameditemns05 [requires parsed XML fixture]', () => {})
    it.skip('namednodemapgetnameditemns06 [requires parsed XML fixture]', () => {})
  })

  // ---------------------------------------------------------------------------
  // namednodemapremovenameditemns (all skipped)
  // ---------------------------------------------------------------------------
  describe('namednodemapremovenameditemns', () => {
    it('namednodemapremovenameditemns01 - removes attr by ns+localName', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const removed = el.attributes.removeNamedItemNS('http://www.nist.gov', 'domestic')
      expect(removed).to.not.equal(null)
      expect(removed!.localName).to.equal('domestic')
      expect(el.attributes.length).to.equal(0)
    })

    it('namednodemapremovenameditemns02 - returns null or throws for nonexistent', function () {
      const el = document.createElement('div')
      try {
        const removed = el.attributes.removeNamedItemNS('http://www.nist.gov', 'missing')
        // lazy-dom returns null
        expect(removed).to.equal(null)
      } catch (e: any) {
        // jsdom throws NotFoundError
        expect(e.name).to.equal('NotFoundError')
      }
    })

    it('namednodemapremovenameditemns03 - removes correct attr among multiple', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      el.setAttributeNS('http://www.other.gov', 'other:domestic', 'No')
      el.attributes.removeNamedItemNS('http://www.nist.gov', 'domestic')
      expect(el.attributes.length).to.equal(1)
      const remaining = el.getAttributeNS('http://www.other.gov', 'domestic')
      expect(remaining).to.equal('No')
    })

    it.skip('namednodemapremovenameditemns04 [requires parsed XML fixture]', () => {})
    it.skip('namednodemapremovenameditemns05 [requires parsed XML fixture]', () => {})
    it.skip('namednodemapremovenameditemns06 [requires parsed XML fixture]', () => {})
    it.skip('namednodemapremovenameditemns07 [requires parsed XML fixture]', () => {})
    it.skip('namednodemapremovenameditemns08 [requires parsed XML fixture]', () => {})
    it.skip('namednodemapremovenameditemns09 [requires parsed XML fixture]', () => {})
  })

  // ---------------------------------------------------------------------------
  // namednodemapsetnameditemns (all skipped)
  // ---------------------------------------------------------------------------
  describe('namednodemapsetnameditemns', () => {
    it('namednodemapsetnameditemns01 - adds attr via setNamedItemNS', () => {
      const el = document.createElement('div')
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr.value = 'Yes'
      el.attributes.setNamedItemNS(attr)
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('Yes')
    })

    it('namednodemapsetnameditemns02 - replaces attr with same ns+localName', () => {
      const el = document.createElement('div')
      const attr1 = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr1.value = 'Yes'
      el.attributes.setNamedItemNS(attr1)
      const attr2 = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr2.value = 'No'
      const old = el.attributes.setNamedItemNS(attr2)
      expect(old).to.equal(attr1)
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('No')
    })

    it('namednodemapsetnameditemns03 - different ns same localName adds separate attrs', () => {
      const el = document.createElement('div')
      const attr1 = document.createAttributeNS('http://www.ns1.com', 'ns1:test')
      attr1.value = 'val1'
      el.attributes.setNamedItemNS(attr1)
      const attr2 = document.createAttributeNS('http://www.ns2.com', 'ns2:test')
      attr2.value = 'val2'
      el.attributes.setNamedItemNS(attr2)
      expect(el.attributes.length).to.equal(2)
      expect(el.getAttributeNS('http://www.ns1.com', 'test')).to.equal('val1')
      expect(el.getAttributeNS('http://www.ns2.com', 'test')).to.equal('val2')
    })

    it.skip('namednodemapsetnameditemns04 [requires parsed XML fixture]', () => {})
    it.skip('namednodemapsetnameditemns05 [requires WRONG_DOCUMENT_ERR]', () => {})
    it.skip('namednodemapsetnameditemns06 [requires INUSE_ATTRIBUTE_ERR]', () => {})
  })

  // ---------------------------------------------------------------------------
  // nodegetlocalname (skipped)
  // ---------------------------------------------------------------------------
  describe('nodegetlocalname', () => {
    it('nodegetlocalname01 - returns localName for namespaced element', () => {
      const el = document.createElementNS('http://www.nist.gov', 'emp:employee')
      expect(el.localName).to.equal('employee')
    })
  })

  // ---------------------------------------------------------------------------
  // nodegetnamespaceuri (skipped)
  // ---------------------------------------------------------------------------
  describe('nodegetnamespaceuri', () => {
    it('nodegetnamespaceuri01 - returns namespaceURI for namespaced element', () => {
      const el = document.createElementNS('http://www.nist.gov', 'emp:employee')
      expect(el.namespaceURI).to.equal('http://www.nist.gov')
    })
  })

  // ---------------------------------------------------------------------------
  // nodegetownerdocument
  // ---------------------------------------------------------------------------
  describe('nodegetownerdocument', () => {
    it('nodegetownerdocument01: element.ownerDocument equals document', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)

      expect(el.ownerDocument).to.equal(document)
    })

    // Skipped: requires document.ownerDocument
    it.skip('nodegetownerdocument02 [requires document.ownerDocument]', () => {})
  })

  // ---------------------------------------------------------------------------
  // nodegetprefix (skipped)
  // ---------------------------------------------------------------------------
  describe('nodegetprefix', () => {
    it('nodegetprefix01 - returns prefix for namespaced element', () => {
      const el = document.createElementNS('http://www.nist.gov', 'emp:employee')
      expect(el.prefix).to.equal('emp')
    })
  })

  // ---------------------------------------------------------------------------
  // nodehasattributes (all skipped)
  // ---------------------------------------------------------------------------
  describe('nodehasattributes', () => {
    it('nodehasattributes01: element with attributes returns true', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      expect(el.hasAttributes()).to.equal(true)
    })

    it('nodehasattributes02: element without attributes returns false', () => {
      const el = document.createElement('div')
      expect(el.hasAttributes()).to.equal(false)
    })
  })

  // ---------------------------------------------------------------------------
  // normalize (skipped)
  // ---------------------------------------------------------------------------
  describe('normalize', () => {
    it('normalize01: merges adjacent text nodes', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      el.appendChild(document.createTextNode('hello'))
      el.appendChild(document.createTextNode(' '))
      el.appendChild(document.createTextNode('world'))
      expect(el.childNodes.length).to.equal(3)
      el.normalize()
      expect(el.childNodes.length).to.equal(1)
      expect(el.textContent).to.equal('hello world')
    })
  })

  // ---------------------------------------------------------------------------
  // ownerDocument / ownerElement
  // ---------------------------------------------------------------------------
  describe('ownerDocument', () => {
    it('ownerDocument01: document.nodeType equals 9 (DOCUMENT_NODE)', () => {
      expect(document.nodeType).to.equal(9)
    })
  })

  // ---------------------------------------------------------------------------
  // prefix (all skipped)
  // ---------------------------------------------------------------------------
  describe('prefix', () => {
    it('prefix01 - element prefix from createElementNS', () => {
      const el = document.createElementNS('http://www.nist.gov', 'emp:employee')
      expect(el.prefix).to.equal('emp')
    })

    it('prefix02 - attr prefix from createAttributeNS', () => {
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      expect(attr.prefix).to.equal('emp')
    })

    it('prefix03 - null prefix for element without prefix', () => {
      const el = document.createElementNS('http://www.nist.gov', 'employee')
      expect(el.prefix).to.equal(null)
    })
  })

  // ---------------------------------------------------------------------------
  // publicId (skipped)
  // ---------------------------------------------------------------------------
  describe('publicId [requires doctype]', () => {
    it.skip('publicId01', () => {})
  })

  // ---------------------------------------------------------------------------
  // removeAttributeNS (skipped)
  // ---------------------------------------------------------------------------
  describe('removeAttributeNS', () => {
    it('removeAttributeNS01 - removes namespaced attribute', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      el.removeAttributeNS('http://www.nist.gov', 'domestic')
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal(null)
    })
  })

  // ---------------------------------------------------------------------------
  // removeNamedItemNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('removeNamedItemNS', () => {
    it('removeNamedItemNS01 - removes attr by ns+localName via NamedNodeMap', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const removed = el.attributes.removeNamedItemNS('http://www.nist.gov', 'domestic')
      expect(removed).to.not.equal(null)
      expect(removed!.value).to.equal('Yes')
      expect(el.attributes.length).to.equal(0)
    })

    it('removeNamedItemNS02 - returns null or throws for nonexistent', function () {
      const el = document.createElement('div')
      try {
        const removed = el.attributes.removeNamedItemNS('http://www.nist.gov', 'missing')
        // lazy-dom returns null
        expect(removed).to.equal(null)
      } catch (e: any) {
        // jsdom throws NotFoundError
        expect(e.name).to.equal('NotFoundError')
      }
    })
  })

  // ---------------------------------------------------------------------------
  // setAttributeNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('setAttributeNS', () => {
    it('setAttributeNS01 - sets and retrieves namespaced attr', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('Yes')
    })

    it('setAttributeNS02 - attr has correct prefix', () => {
      const el = document.createElement('div')
      el.setAttributeNS('http://www.nist.gov', 'emp:domestic', 'Yes')
      const attr = el.getAttributeNodeNS('http://www.nist.gov', 'domestic')
      expect(attr!.prefix).to.equal('emp')
    })

    it('setAttributeNS03 - throws NAMESPACE_ERR for prefix with null ns', () => {
      const el = document.createElement('div')
      let threw = false
      try {
        el.setAttributeNS(null, 'emp:domestic', 'Yes')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it('setAttributeNS04 - throws NAMESPACE_ERR for xml prefix with wrong ns', () => {
      const el = document.createElement('div')
      let threw = false
      try {
        el.setAttributeNS('http://wrong.com', 'xml:lang', 'en')
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(14)
      }
      expect(threw).to.equal(true)
    })

    it.skip('setAttributeNS05 [requires parsed XML fixture]', () => {})
    it.skip('setAttributeNS06 [requires parsed XML fixture]', () => {})
    it.skip('setAttributeNS07 [requires parsed XML fixture]', () => {})
    it.skip('setAttributeNS08 [requires parsed XML fixture]', () => {})
  })

  // ---------------------------------------------------------------------------
  // setAttributeNodeNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('setAttributeNodeNS', () => {
    it('setAttributeNodeNS01 - adds attr via setAttributeNodeNS', () => {
      const el = document.createElement('div')
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr.value = 'Yes'
      el.setAttributeNodeNS(attr)
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('Yes')
    })

    it('setAttributeNodeNS02 - returns old attr on replacement', () => {
      const el = document.createElement('div')
      const attr1 = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr1.value = 'Yes'
      el.setAttributeNodeNS(attr1)
      const attr2 = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr2.value = 'No'
      const old = el.setAttributeNodeNS(attr2)
      expect(old).to.equal(attr1)
    })

    it('setAttributeNodeNS03 - throws INUSE_ATTRIBUTE_ERR for attr in use', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr.value = 'Yes'
      el1.setAttributeNodeNS(attr)
      let threw = false
      try {
        el2.setAttributeNodeNS(attr)
      } catch (e: any) {
        threw = true
        expect(e.code).to.equal(10)
      }
      expect(threw).to.equal(true)
    })
  })

  // ---------------------------------------------------------------------------
  // setNamedItemNS (all skipped)
  // ---------------------------------------------------------------------------
  describe('setNamedItemNS', () => {
    it('setNamedItemNS01 - adds attr via setNamedItemNS', () => {
      const el = document.createElement('div')
      const attr = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr.value = 'Yes'
      el.attributes.setNamedItemNS(attr)
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('Yes')
    })

    it('setNamedItemNS02 - replaces attr with same ns+localName', () => {
      const el = document.createElement('div')
      const attr1 = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr1.value = 'Yes'
      el.attributes.setNamedItemNS(attr1)
      const attr2 = document.createAttributeNS('http://www.nist.gov', 'emp:domestic')
      attr2.value = 'No'
      const old = el.attributes.setNamedItemNS(attr2)
      expect(old).to.equal(attr1)
      expect(el.getAttributeNS('http://www.nist.gov', 'domestic')).to.equal('No')
    })

    it.skip('setNamedItemNS03 [requires WRONG_DOCUMENT_ERR]', () => {})
  })

  // ---------------------------------------------------------------------------
  // systemId (skipped)
  // ---------------------------------------------------------------------------
  describe('systemId [requires doctype]', () => {
    it.skip('systemId01', () => {})
  })

  // ---------------------------------------------------------------------------
  // memoizationQueriesCleared (skipped)
  // ---------------------------------------------------------------------------
  describe('memoizationQueriesCleared [requires getElementsByTagName]', () => {
    it.skip('memoizationQueriesCleared01', () => {})
  })
})
