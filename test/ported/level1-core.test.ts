import { expect } from 'chai'

describe('level1/core', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  // ---------------------------------------------------------------------------
  // Attr
  // ---------------------------------------------------------------------------
  describe('Attr', () => {
    it('attrcreatetextnode - modify attr.value and verify value and nodeValue', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'original')
      const attr = el.attributes.getNamedItem('class')!
      expect(attr).to.not.be.null
      attr.value = 'updated'
      expect(attr.value).to.equal('updated')
      expect(attr.nodeValue).to.equal('updated')
    })

    it('attrcreatetextnode2 - modify attr via nodeValue setter', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'original')
      const attr = el.attributes.getNamedItem('class')!
      expect(attr).to.not.be.undefined
      // Attr in lazy-dom does not have a nodeValue setter; this documents the gap.
      ;(attr as any).nodeValue = 'updated-via-nodeValue'
      expect((attr as any).nodeValue).to.equal('updated-via-nodeValue')
    })

    it('attreffectivevalue - getAttribute returns effective value via getNamedItem nodeValue', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'hello')
      const attr = el.attributes.getNamedItem('title')!
      expect(attr).to.not.be.null
      expect(attr.nodeValue).to.equal('hello')
    })

    it('attrname - attr.name returns the attribute name', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.attributes.getNamedItem('class')!
      expect(attr).to.not.be.undefined
      expect(attr.name).to.equal('class')
    })

    it('attrspecifiedvalue - attr.specified is true for setAttribute attributes', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.attributes.getNamedItem('class')!
      expect(attr).to.not.be.undefined
      expect(attr.specified).to.be.true
    })

    it('attrspecifiedvaluechanged - attr.specified is true even after changing value', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'first')
      el.setAttribute('class', 'second')
      const attr = el.attributes.getNamedItem('class')!
      expect(attr).to.not.be.undefined
      expect(attr.specified).to.be.true
    })

    it('attrnextsiblingnull - attr.nextSibling is null', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.attributes.getNamedItem('class')!
      expect(attr.nextSibling).to.be.null
    })

    it('attrparentnodenull - attr.parentNode is null', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.attributes.getNamedItem('class')!
      expect(attr.parentNode).to.be.null
    })

    it('attrprevioussiblingnull - attr.previousSibling is null', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.attributes.getNamedItem('class')!
      expect(attr.previousSibling).to.be.null
    })

    it('attrcreatedocumentfragment - attributes work on elements within a fragment', () => {
      const frag = document.createDocumentFragment()
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      frag.appendChild(el)
      const attr = el.attributes.item(0)
      expect(attr).to.not.be.null
      expect(attr!.name).to.equal('class')
    })
  })

  // ---------------------------------------------------------------------------
  // Document creation
  // ---------------------------------------------------------------------------
  describe('Document creation', () => {
    it('documentcreateelement - createElement returns element with correct tagName', () => {
      const el = document.createElement('div')
      expect(el.tagName).to.equal('DIV')
    })

    it('documentcreateelementcasesensitive - createElement uppercases tagName', () => {
      // Note: lazy-dom uppercases tagName via .toUpperCase() in the getter.
      // The original jsdom test checks case sensitivity in XML mode.
      // In lazy-dom, createElement("div") produces tagName "DIV".
      const el = document.createElement('div')
      expect(el.tagName).to.equal('DIV')
      const el2 = document.createElement('DIV')
      expect(el2.tagName).to.equal('DIV')
    })

    it('documentcreatetextnode - createTextNode sets nodeValue', () => {
      const text = document.createTextNode('hello world')
      expect(text.nodeValue).to.equal('hello world')
    })

    it('documentcreateattribute - createAttribute creates an Attr node', () => {
      const attr = document.createAttribute('class')
      expect(attr.name).to.equal('class')
      expect(attr.value).to.equal('')
      expect(attr.specified).to.be.true
    })

    it('documentcreatecomment - createComment creates a comment node', () => {
      const comment = document.createComment('this is a comment')
      expect(comment.nodeType).to.equal(8)
      expect(comment.data).to.equal('this is a comment')
      expect(comment.nodeName).to.equal('#comment')
    })

    it('documentcreatedocumentfragment - createDocumentFragment creates a fragment', () => {
      const frag = document.createDocumentFragment()
      expect(frag.nodeType).to.equal(11)
      expect(frag.nodeName).to.equal('#document-fragment')
      expect(frag.nodeValue).to.be.null
      expect(frag.childNodes.length).to.equal(0)
    })

    it('documentcreateprocessinginstruction - creates PI node', () => {
      const pi = document.createProcessingInstruction('xml-stylesheet', 'type="text/xsl"')
      expect(pi.nodeType).to.equal(7)
      expect(pi.target).to.equal('xml-stylesheet')
      expect(pi.data).to.equal('type="text/xsl"')
      expect(pi.nodeName).to.equal('xml-stylesheet')
    })

    it.skip('documentgetdoctype [requires doctype]', () => {
      // Original: level1/core.js - documentgetdoctype
      // Needs: document.doctype
    })

    it.skip('documentgetdoctypenodtd [requires doctype]', () => {
      // Original: level1/core.js - documentgetdoctypenodtd
      // Needs: document.doctype
    })

    it('documentgetimplementation - document.implementation exists', () => {
      const impl = document.implementation
      expect(impl).to.not.equal(null)
      expect(impl).to.not.equal(undefined)
    })

    it.skip('documentinvalidcharacterexceptioncreateattribute [requires createAttribute error handling]', () => {
      // Original: level1/core.js - documentinvalidcharacterexceptioncreateattribute
      // Needs: createAttribute with INVALID_CHARACTER_ERR
    })

    it.skip('documentinvalidcharacterexceptioncreateelement [requires createElement error handling]', () => {
      // Original: level1/core.js - documentinvalidcharacterexceptioncreateelement
      // Needs: createElement INVALID_CHARACTER_ERR for invalid names
    })

    it.skip('documentinvalidcharacterexceptioncreatepi [requires createProcessingInstruction]', () => {
      // Original: level1/core.js - documentinvalidcharacterexceptioncreatepi
      // Needs: createProcessingInstruction with error handling
    })

    // --- Regression: document tree structure (Bug #6) ---
    it('documentElement is an HTML element', () => {
      expect(document.documentElement).to.exist
      expect(document.documentElement.tagName).to.equal('HTML')
    })

    it('body is a child of documentElement', () => {
      expect(document.body.parentNode).to.equal(document.documentElement)
    })

    it('head is a child of documentElement', () => {
      expect(document.head.parentNode).to.equal(document.documentElement)
    })

    it('documentElement contains both head and body', () => {
      const children = document.documentElement.childNodes
      expect(children.length).to.equal(2)
      expect(children[0]).to.equal(document.head)
      expect(children[1]).to.equal(document.body)
    })

    // --- Regression: document queries search entire tree (Bug #7) ---
    it('getElementsByTagName finds elements appended to head', () => {
      const meta = document.createElement('meta')
      document.head.appendChild(meta)
      const results = document.getElementsByTagName('meta')
      expect(results.length).to.be.greaterThan(0)
      document.head.removeChild(meta)
    })

    it('querySelectorAll finds elements appended to head', () => {
      const link = document.createElement('link')
      link.setAttribute('id', 'test-link')
      document.head.appendChild(link)
      const results = document.querySelectorAll('#test-link')
      expect(results.length).to.equal(1)
      document.head.removeChild(link)
    })

    it('querySelector finds elements appended to head', () => {
      const style = document.createElement('style')
      style.setAttribute('id', 'test-style')
      document.head.appendChild(style)
      const found = document.querySelector('#test-style')
      expect(found).to.equal(style)
      document.head.removeChild(style)
    })

    it('getElementsByTagName still finds elements in body', () => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      const results = document.getElementsByTagName('div')
      expect(results.length).to.be.greaterThan(0)
    })

    // --- Regression: cloneNode on DocumentFragment (Bug #3) ---
    it('clones a DocumentFragment (shallow)', () => {
      const frag = document.createDocumentFragment()
      frag.appendChild(document.createElement('div'))
      const clone = frag.cloneNode(false)
      expect(clone.nodeType).to.equal(11)
      expect(clone.childNodes.length).to.equal(0)
    })

    it('clones a DocumentFragment (deep)', () => {
      const frag = document.createDocumentFragment()
      frag.appendChild(document.createElement('div'))
      frag.appendChild(document.createElement('span'))
      const clone = frag.cloneNode(true)
      expect(clone.childNodes.length).to.equal(2)
    })
  })

  // ---------------------------------------------------------------------------
  // Element
  // ---------------------------------------------------------------------------
  describe('Element', () => {
    // --- Document method tests (skipped) ---
    it('documentgetelementsbytagnamelength - getElementsByTagName returns correct count', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      parent.appendChild(document.createElement('span'))
      parent.appendChild(document.createElement('span'))
      parent.appendChild(document.createElement('p'))
      const spans = document.getElementsByTagName('span')
      expect(spans.length).to.equal(2)
    })

    it('documentgetelementsbytagnametotallength - getElementsByTagName("*") returns all', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      parent.appendChild(document.createElement('span'))
      parent.appendChild(document.createElement('p'))
      const all = document.getElementsByTagName('*')
      expect(all.length).to.be.greaterThanOrEqual(2)
    })

    it('documentgetelementsbytagnamevalue - getElementsByTagName returns matching elements', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const span = document.createElement('span')
      span.setAttribute('id', 'test-span')
      parent.appendChild(span)
      const found = document.getElementsByTagName('span')
      let hasMatch = false
      for (let i = 0; i < found.length; i++) {
        if (found[i].getAttribute('id') === 'test-span') hasMatch = true
      }
      expect(hasMatch).to.be.true
    })

    it('domimplementationfeaturenoversion - hasFeature with no version returns true', () => {
      const impl = document.implementation
      expect(impl.hasFeature('XML')).to.equal(true)
    })

    it('domimplementationfeaturenull - hasFeature with null version returns true', () => {
      const impl = document.implementation
      expect(impl.hasFeature('XML', null)).to.equal(true)
    })

    it('domimplementationfeaturexml - hasFeature with XML returns true', () => {
      const impl = document.implementation
      expect(impl.hasFeature('XML', '1.0')).to.equal(true)
    })

    // --- Element attribute tests (active) ---
    it('elementaddnewattribute - setAttribute then getAttribute', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'myclass')
      expect(el.getAttribute('class')).to.equal('myclass')
    })

    it('elementassociatedattribute - setAttribute makes attr specified', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.attributes.getNamedItem('class')
      expect(attr).to.not.be.undefined
      expect(attr!.specified).to.be.true
    })

    it('elementchangeattributevalue - setAttribute twice returns latest value', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'first')
      el.setAttribute('class', 'second')
      expect(el.getAttribute('class')).to.equal('second')
    })

    it('elementgetattributenode - getAttributeNode returns Attr with correct name', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.getAttributeNode('class')
      expect(attr).to.not.be.null
      expect(attr!.name).to.equal('class')
    })

    it('elementgetattributenodenull - getAttributeNode for nonexistent returns null', () => {
      const el = document.createElement('div')
      const attr = el.getAttributeNode('nonexistent')
      expect(attr).to.be.null
    })

    it('elementretrieveattrvalue - getAttribute returns the value', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'a title')
      expect(el.getAttribute('title')).to.equal('a title')
    })

    it('elementretrievetagname - tagName matches createElement argument (uppercased)', () => {
      const el = document.createElement('div')
      expect(el.tagName).to.equal('DIV')
    })

    it('elementremoveattribute - removeAttribute causes getAttribute to return null', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      expect(el.getAttribute('class')).to.equal('test')
      el.removeAttribute('class')
      expect(el.getAttribute('class')).to.be.null
    })

    // --- Element tests (skipped) ---
    it('elementcreatenewattribute - createAttribute + setAttributeNode adds attribute', () => {
      const el = document.createElement('div')
      const attr = document.createAttribute('class')
      attr.value = 'myclass'
      el.setAttributeNode(attr)
      expect(el.getAttribute('class')).to.equal('myclass')
    })

    it('elementgetelementsbytagname - element.getElementsByTagName returns matching descendants', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      parent.appendChild(document.createElement('span'))
      parent.appendChild(document.createElement('span'))
      parent.appendChild(document.createElement('p'))
      const spans = parent.getElementsByTagName('span')
      expect(spans.length).to.equal(2)
    })

    it('elementgetelementsbytagnameaccessnodelist - results can be navigated', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const span1 = document.createElement('span')
      span1.setAttribute('id', 's1')
      const span2 = document.createElement('span')
      span2.setAttribute('id', 's2')
      parent.appendChild(span1)
      parent.appendChild(span2)
      const spans = parent.getElementsByTagName('span')
      expect(spans[0].getAttribute('id')).to.equal('s1')
      expect(spans[1].getAttribute('id')).to.equal('s2')
    })

    it('elementgetelementsbytagnamenomatch - returns empty for no matches', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      parent.appendChild(document.createElement('span'))
      const result = parent.getElementsByTagName('table')
      expect(result.length).to.equal(0)
    })

    it('elementgetelementsbytagnamespecialvalue - "*" matches all descendants', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      parent.appendChild(document.createElement('span'))
      parent.appendChild(document.createElement('p'))
      const all = parent.getElementsByTagName('*')
      expect(all.length).to.equal(2)
    })

    it.skip('elementgettagname - tests documentElement.tagName on XML root', () => {
      // Original: level1/core.js - elementgettagname
      // Skipped because this tests the XML root element tagName from a parsed fixture
    })

    it('elementinuseattributeerr - setAttributeNode with attr owned by another throws', () => {
      const el1 = document.createElement('div')
      const el2 = document.createElement('span')
      const attr = document.createAttribute('class')
      attr.value = 'test'
      el1.setAttributeNode(attr)
      expect(() => el2.setAttributeNode(attr)).to.throw()
    })

    it.skip('elementinvalidcharacterexception [requires setAttribute error handling]', () => {
      // Original: level1/core.js - elementinvalidcharacterexception
      // Needs: setAttribute INVALID_CHARACTER_ERR for invalid names
    })

    it('elementnormalize - normalize merges adjacent text nodes', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      el.appendChild(document.createTextNode('hello'))
      el.appendChild(document.createTextNode(' world'))
      expect(el.childNodes.length).to.equal(2)
      el.normalize()
      expect(el.childNodes.length).to.equal(1)
      expect(el.textContent).to.equal('hello world')
    })

    it('elementnotfounderr - removeAttributeNode with wrong attr throws', () => {
      const el = document.createElement('div')
      const attr = document.createAttribute('class')
      attr.value = 'test'
      expect(() => el.removeAttributeNode(attr)).to.throw()
    })

    it('elementremoveattributeaftercreate - removeAttributeNode on created attr', () => {
      const el = document.createElement('div')
      const attr = document.createAttribute('title')
      attr.value = 'test'
      el.setAttributeNode(attr)
      expect(el.hasAttribute('title')).to.be.true
      el.removeAttributeNode(attr)
      expect(el.hasAttribute('title')).to.be.false
    })

    it('elementremoveattributenode - removeAttributeNode removes the attr', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.getAttributeNode('class')!
      el.removeAttributeNode(attr)
      expect(el.getAttribute('class')).to.be.null
    })

    it('elementreplaceattributewithself - setAttributeNode with same attr is no-op', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.getAttributeNode('class')!
      const old = el.setAttributeNode(attr)
      expect(old).to.equal(attr)
      expect(el.getAttribute('class')).to.equal('test')
    })

    it('elementreplaceexistingattribute - setAttributeNode replaces existing attr', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'first')
      const attr = document.createAttribute('class')
      attr.value = 'second'
      el.setAttributeNode(attr)
      expect(el.getAttribute('class')).to.equal('second')
    })

    it('elementreplaceexistingattributegevalue - replaced attr value is correct', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'first')
      const attr = document.createAttribute('class')
      attr.value = 'replaced'
      el.setAttributeNode(attr)
      expect(el.getAttribute('class')).to.equal('replaced')
    })

    it('elementsetattributenodenull - setAttributeNode returns null for new attr', () => {
      const el = document.createElement('div')
      const attr = document.createAttribute('class')
      attr.value = 'test'
      const old = el.setAttributeNode(attr)
      expect(old).to.be.null
    })

    // --- Regression: innerHTML setter (Bug #10) ---
    it('innerHTML setter clears children when set to empty string', () => {
      const div = document.createElement('div')
      div.appendChild(document.createElement('span'))
      div.appendChild(document.createTextNode('text'))
      expect(div.childNodes.length).to.equal(2)
      div.innerHTML = ''
      expect(div.childNodes.length).to.equal(0)
      expect(div.innerHTML).to.equal('')
    })

    it('innerHTML setter sets text content when set to a string', () => {
      const div = document.createElement('div')
      div.innerHTML = 'hello'
      expect(div.innerHTML).to.equal('hello')
      expect(div.childNodes.length).to.equal(1)
    })

    it('innerHTML setter replaces existing children', () => {
      const div = document.createElement('div')
      div.appendChild(document.createElement('span'))
      div.innerHTML = 'replaced'
      expect(div.innerHTML).to.equal('replaced')
      expect(div.childNodes.length).to.equal(1)
    })
  })

  // ---------------------------------------------------------------------------
  // Node types
  // ---------------------------------------------------------------------------
  describe('Node types', () => {
    it('nodeelementnodename - element nodeName equals uppercased tag', () => {
      const el = document.createElement('div')
      expect(el.nodeName).to.equal('DIV')
    })

    it('nodeelementnodetype - element nodeType equals 1', () => {
      const el = document.createElement('div')
      expect(el.nodeType).to.equal(1)
    })

    it('nodeelementnodevalue - element nodeValue is null', () => {
      const el = document.createElement('div')
      expect(el.nodeValue).to.be.null
    })

    it('nodetextnodename - text node nodeName equals #text', () => {
      const text = document.createTextNode('data')
      expect(text.nodeName).to.equal('#text')
    })

    it('nodetextnodetype - text node nodeType equals 3', () => {
      const text = document.createTextNode('data')
      expect(text.nodeType).to.equal(3)
    })

    it('nodetextnodevalue - text node nodeValue equals data', () => {
      const text = document.createTextNode('hello')
      expect(text.nodeValue).to.equal('hello')
    })

    it('nodedocumentnodetype - document.nodeType equals 9', () => {
      expect(document.nodeType).to.equal(9)
    })

    it('nodevalue01 - element nodeValue is null, setting it has no effect', () => {
      const el = document.createElement('div')
      expect(el.nodeValue).to.be.null
      el.nodeValue = null as any
      expect(el.nodeValue).to.be.null
    })

    // --- Skipped node type tests ---
    it('nodedocumentnodename - document.nodeName is #document', () => {
      expect(document.nodeName).to.equal('#document')
    })

    it('nodedocumentnodevalue - document.nodeValue is null', () => {
      expect(document.nodeValue).to.be.null
    })

    it('nodedocumentfragmentnodename - fragment.nodeName is #document-fragment', () => {
      const frag = document.createDocumentFragment()
      expect(frag.nodeName).to.equal('#document-fragment')
    })

    it('nodedocumentfragmentnodetype - fragment.nodeType is 11', () => {
      const frag = document.createDocumentFragment()
      expect(frag.nodeType).to.equal(11)
    })

    it('nodedocumentfragmentnodevalue - fragment.nodeValue is null', () => {
      const frag = document.createDocumentFragment()
      expect(frag.nodeValue).to.be.null
    })

    it('nodecommentnodename - comment.nodeName is #comment', () => {
      const comment = document.createComment('test')
      expect(comment.nodeName).to.equal('#comment')
    })

    it('nodecommentnodetype - comment.nodeType is 8', () => {
      const comment = document.createComment('test')
      expect(comment.nodeType).to.equal(8)
    })

    it('nodecommentnodevalue - comment.nodeValue equals the data', () => {
      const comment = document.createComment('some comment text')
      expect(comment.nodeValue).to.equal('some comment text')
    })

    it('nodecommentnodeattributes - comment has no attributes', () => {
      const comment = document.createComment('test')
      // Comments don't have attributes
      expect((comment as any).attributes).to.not.be.ok
    })

    it('nodedocumentnodeattribute - document.attributes is null or undefined', () => {
      // JSDOM returns undefined, spec/lazy-dom returns null
      expect(document.attributes).to.not.be.ok
    })

    it('nodeelementnodeattributes - element attributes.item returns Attr', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      const attr = el.attributes.item(0)
      expect(attr).to.not.be.null
      expect(attr!.name).to.equal('class')
    })

    it('nodeprocessinginstructionnodename - PI.nodeName equals the target', () => {
      const pi = document.createProcessingInstruction('mytarget', 'data')
      expect(pi.nodeName).to.equal('mytarget')
    })

    it('nodeprocessinginstructionnodetype - PI.nodeType is 7', () => {
      const pi = document.createProcessingInstruction('mytarget', 'data')
      expect(pi.nodeType).to.equal(7)
    })

    it('nodeprocessinginstructionnodevalue - PI.nodeValue equals the data', () => {
      const pi = document.createProcessingInstruction('mytarget', 'some data')
      expect(pi.nodeValue).to.equal('some data')
    })

    it('nodeprocessinginstructionnodeattributes - PI has no attributes', () => {
      const pi = document.createProcessingInstruction('mytarget', 'data')
      expect(pi.attributes).to.not.be.ok
    })

    it('nodeprocessinginstructionsetnodevalue - setting PI.nodeValue changes data', () => {
      const pi = document.createProcessingInstruction('mytarget', 'original')
      pi.nodeValue = 'updated'
      expect(pi.nodeValue).to.equal('updated')
      expect(pi.data).to.equal('updated')
    })

    it.skip('nodedocumenttypenodename [requires doctype]', () => {
      // Original: level1/core.js - nodedocumenttypenodename
      // Needs: doctype
    })

    it.skip('nodedocumenttypenodetype [requires doctype]', () => {
      // Original: level1/core.js - nodedocumenttypenodetype
      // Needs: doctype
    })

    it.skip('nodedocumenttypenodevalue [requires doctype]', () => {
      // Original: level1/core.js - nodedocumenttypenodevalue
      // Needs: doctype
    })

    it('nodevalue02 - comment.nodeValue can be set', () => {
      const comment = document.createComment('original')
      comment.nodeValue = 'changed'
      expect(comment.nodeValue).to.equal('changed')
    })

    it.skip('nodevalue04 [requires doctype]', () => {
      // Original: level1/core.js - nodevalue04
      // Needs: doctype
    })

    it('nodevalue05 - fragment.nodeValue is null', () => {
      const frag = document.createDocumentFragment()
      expect(frag.nodeValue).to.be.null
    })

    it('nodevalue09 - PI.nodeValue returns data', () => {
      const pi = document.createProcessingInstruction('target', 'test data')
      expect(pi.nodeValue).to.equal('test data')
    })
  })

  // ---------------------------------------------------------------------------
  // Node tree operations
  // ---------------------------------------------------------------------------
  describe('Node tree operations', () => {
    it('nodeappendchild - appendChild adds node to childNodes', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      expect(parent.childNodes.length).to.equal(1)
      expect(parent.childNodes.item(0)).to.equal(child)
    })

    it('nodeappendchildgetnodename - appendChild returns the appended node', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      const returned = parent.appendChild(child)
      expect(returned.nodeName).to.equal('SPAN')
    })

    it('nodeparentnode - child.parentNode is the parent after appendChild', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      expect(child.parentNode).to.equal(parent)
    })

    it('nodeparentnodenull - newly created element has no parentNode', () => {
      const el = document.createElement('div')
      expect(el.parentNode).to.be.null
    })

    it('noderemovechild - removeChild removes the node from childNodes', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      expect(parent.childNodes.length).to.equal(1)
      parent.removeChild(child)
      expect(parent.childNodes.length).to.equal(0)
    })

    it('noderemovechildgetnodename - removeChild returns the removed node', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      const removed = parent.removeChild(child)
      expect(removed.nodeName).to.equal('SPAN')
    })

    it('nodechildnodes - childNodes.length reflects number of children', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      const child3 = document.createTextNode('text')
      parent.appendChild(child1)
      parent.appendChild(child2)
      parent.appendChild(child3)
      expect(parent.childNodes.length).to.equal(3)
    })

    it('nodechildnodesappendchild - childNodes updates when child is added', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      expect(parent.childNodes.length).to.equal(0)
      const child = document.createElement('span')
      parent.appendChild(child)
      expect(parent.childNodes.length).to.equal(1)
    })

    it('nodechildnodesempty - text node has no children', () => {
      const text = document.createTextNode('some text')
      expect(text.childNodes.length).to.equal(0)
    })

    it('nodegetownerdocument - element.ownerDocument equals document', () => {
      const el = document.createElement('div')
      expect(el.ownerDocument).to.equal(document)
    })

    it('nodeinsertbefore - insertBefore places node before reference', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      parent.appendChild(child1)
      parent.insertBefore(child2, child1)
      expect(parent.childNodes.length).to.equal(2)
      expect(parent.childNodes.item(0)).to.equal(child2)
      expect(parent.childNodes.item(1)).to.equal(child1)
    })

    // --- Skipped node tree tests ---
    it('nodegetfirstchild - firstChild returns the first child node', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      document.body.appendChild(parent)
      parent.appendChild(child1)
      parent.appendChild(child2)
      expect(parent.firstChild).to.equal(child1)
    })

    it('nodegetfirstchildnull - firstChild returns null when no children', () => {
      const el = document.createElement('div')
      expect(el.firstChild).to.be.null
    })

    it('nodegetlastchild - lastChild returns the last child node', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      document.body.appendChild(parent)
      parent.appendChild(child1)
      parent.appendChild(child2)
      expect(parent.lastChild).to.equal(child2)
    })

    it('nodegetlastchildnull - lastChild returns null when no children', () => {
      const el = document.createElement('div')
      expect(el.lastChild).to.be.null
    })

    it('nodegetnextsibling - nextSibling returns the next sibling', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      document.body.appendChild(parent)
      parent.appendChild(child1)
      parent.appendChild(child2)
      expect(child1.nextSibling).to.equal(child2)
    })

    it('nodegetnextsiblingnull - nextSibling returns null for last child', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      expect(child.nextSibling).to.be.null
    })

    it('nodegetprevioussibling - previousSibling returns the previous sibling', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      document.body.appendChild(parent)
      parent.appendChild(child1)
      parent.appendChild(child2)
      expect(child2.previousSibling).to.equal(child1)
    })

    it('nodegetprevioussiblingnull - previousSibling returns null for first child', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      expect(child.previousSibling).to.be.null
    })

    it('nodehaschildnodes - hasChildNodes returns true when children exist', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      parent.appendChild(document.createElement('span'))
      expect(parent.hasChildNodes()).to.be.true
    })

    it('nodehaschildnodesfalse - hasChildNodes returns false when no children', () => {
      const el = document.createElement('div')
      expect(el.hasChildNodes()).to.be.false
    })

    it('nodeappendchildchildexists - appendChild moves existing child to end', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      parent.appendChild(child1)
      parent.appendChild(child2)
      // Move child1 to end
      parent.appendChild(child1)
      expect(parent.childNodes.length).to.equal(2)
      expect(parent.firstChild).to.equal(child2)
      expect(parent.lastChild).to.equal(child1)
    })

    it('nodeappendchilddocfragment - appendChild with fragment appends all children', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const frag = document.createDocumentFragment()
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      frag.appendChild(child1)
      frag.appendChild(child2)
      parent.appendChild(frag)
      expect(parent.childNodes.length).to.equal(2)
      expect(parent.firstChild).to.equal(child1)
      expect(parent.lastChild).to.equal(child2)
    })

    it('nodeappendchildnodeancestor - appendChild with ancestor throws', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      expect(() => child.appendChild(parent)).to.throw()
    })

    it('nodeinsertbeforedocfragment - insertBefore with fragment inserts all children', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const existing = document.createElement('em')
      parent.appendChild(existing)
      const frag = document.createDocumentFragment()
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      frag.appendChild(child1)
      frag.appendChild(child2)
      parent.insertBefore(frag, existing)
      expect(parent.childNodes.length).to.equal(3)
      expect(parent.firstChild).to.equal(child1)
      expect(parent.lastChild).to.equal(existing)
    })

    it('nodeinsertbeforenewchildexists - insertBefore moves existing child', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      const child3 = document.createElement('em')
      parent.appendChild(child1)
      parent.appendChild(child2)
      parent.appendChild(child3)
      // Move child3 before child1
      parent.insertBefore(child3, child1)
      expect(parent.firstChild).to.equal(child3)
      expect(child3.nextSibling).to.equal(child1)
    })

    it('nodeinsertbeforenodeancestor - insertBefore with ancestor throws', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      const newNode = document.createElement('em')
      expect(() => child.insertBefore(parent, newNode)).to.throw()
    })

    it('nodeinsertbeforerefchildnonexistent - insertBefore with nonexistent ref throws', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const newNode = document.createElement('span')
      const fakeRef = document.createElement('p')
      expect(() => parent.insertBefore(newNode, fakeRef)).to.throw()
    })

    it('nodeinsertbeforerefchildnull - insertBefore with null ref appends to end', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      parent.appendChild(child1)
      parent.insertBefore(child2, null)
      expect(parent.lastChild).to.equal(child2)
    })

    it('nodecloneattributescopied - cloneNode copies attributes', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      el.setAttribute('id', 'myid')
      const clone = el.cloneNode(false) as any
      expect(clone.getAttribute('class')).to.equal('test')
      expect(clone.getAttribute('id')).to.equal('myid')
    })

    it('nodeclonefalsenocopytext - cloneNode(false) does not copy children', () => {
      const el = document.createElement('div')
      el.appendChild(document.createTextNode('hello'))
      const clone = el.cloneNode(false) as any
      expect(clone.childNodes.length).to.equal(0)
    })

    it('nodeclonegetparentnull - clone has null parentNode', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const clone = el.cloneNode(false)
      expect(clone.parentNode).to.be.null
    })

    it('nodeclonenodefalse - shallow clone has same tagName', () => {
      const el = document.createElement('div')
      const clone = el.cloneNode(false) as any
      expect(clone.tagName).to.equal('DIV')
    })

    it('nodeclonenodetrue - deep clone copies children', () => {
      const el = document.createElement('div')
      const child = document.createElement('span')
      el.appendChild(child)
      const clone = el.cloneNode(true) as any
      expect(clone.childNodes.length).to.equal(1)
      expect(clone.firstChild.tagName).to.equal('SPAN')
      expect(clone.firstChild).to.not.equal(child)
    })

    it('nodeclonetruecopytext - deep clone copies text nodes', () => {
      const el = document.createElement('div')
      el.appendChild(document.createTextNode('hello'))
      const clone = el.cloneNode(true) as any
      expect(clone.textContent).to.equal('hello')
    })

    it('nodereplacechild - replaceChild replaces the old child', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const oldChild = document.createElement('span')
      parent.appendChild(oldChild)
      const newChild = document.createElement('p')
      parent.replaceChild(newChild, oldChild)
      expect(parent.childNodes.length).to.equal(1)
      expect(parent.firstChild).to.equal(newChild)
    })

    it('nodereplacechildnewchildexists - replaceChild moves existing child', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      const child3 = document.createElement('em')
      parent.appendChild(child1)
      parent.appendChild(child2)
      parent.appendChild(child3)
      parent.replaceChild(child1, child3)
      expect(parent.childNodes.length).to.equal(2)
      expect(parent.lastChild).to.equal(child1)
    })

    it('nodereplacechildnodeancestor - replaceChild with ancestor throws', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      document.body.appendChild(parent)
      parent.appendChild(child)
      expect(() => child.replaceChild(parent, child)).to.throw()
    })

    it('nodereplacechildnodename - replaceChild returns the old child', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const oldChild = document.createElement('span')
      parent.appendChild(oldChild)
      const newChild = document.createElement('p')
      const returned = parent.replaceChild(newChild, oldChild)
      expect(returned.nodeName).to.equal('SPAN')
    })

    it('nodereplacechildoldchildnonexistent - replaceChild with nonexistent child throws', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const newChild = document.createElement('span')
      const notChild = document.createElement('p')
      expect(() => parent.replaceChild(newChild, notChild)).to.throw()
    })

    it('noderemovechildnode - removeChild removes node; siblings update', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const child1 = document.createElement('span')
      const child2 = document.createElement('p')
      const child3 = document.createElement('em')
      parent.appendChild(child1)
      parent.appendChild(child2)
      parent.appendChild(child3)
      parent.removeChild(child2)
      expect(parent.childNodes.length).to.equal(2)
      expect(parent.firstChild).to.equal(child1)
      expect(child1.nextSibling).to.equal(child3)
    })

    it('noderemovechildoldchildnonexistent - removeChild with nonexistent child throws', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const notChild = document.createElement('span')
      expect(() => parent.removeChild(notChild)).to.throw()
    })

    // --- Skipped node attribute tests ---
    it.skip('nodeattributenodeattribute [requires NamedNodeMap.item, Attr.attributes]', () => {
      // Original: level1/core.js - nodeattributenodeattribute
      // Needs: NamedNodeMap.item(index), Attr.attributes
    })

    it.skip('nodeattributenodename [requires parsed fixture]', () => {
      // Original: level1/core.js - nodeattributenodename
      // Uses getAttributeNode on a parsed XML fixture
    })

    it.skip('nodeattributenodevalue [requires parsed fixture]', () => {
      // Original: level1/core.js - nodeattributenodevalue
      // Uses getAttributeNode on a parsed XML fixture
    })

    // --- Regression: appendChild hierarchy check (Bug #1) ---
    it('allows re-parenting a child from one parent to another', () => {
      const parent1 = document.createElement('div')
      const parent2 = document.createElement('div')
      const child = document.createElement('span')
      parent1.appendChild(child)
      parent2.appendChild(child)
      expect(parent2.childNodes.length).to.equal(1)
      expect(parent1.childNodes.length).to.equal(0)
    })

    it('throws HIERARCHY_REQUEST_ERR when inserting an ancestor as child', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.appendChild(child)
      expect(() => child.appendChild(parent)).to.throw()
    })

    it('throws HIERARCHY_REQUEST_ERR when inserting self', () => {
      const el = document.createElement('div')
      expect(() => el.appendChild(el)).to.throw()
    })

    it('allows re-parenting via insertBefore', () => {
      const parent1 = document.createElement('div')
      const parent2 = document.createElement('div')
      const child = document.createElement('span')
      const ref = document.createElement('p')
      parent1.appendChild(child)
      parent2.appendChild(ref)
      parent2.insertBefore(child, ref)
      expect(parent2.childNodes.length).to.equal(2)
      expect(parent1.childNodes.length).to.equal(0)
    })

    // --- Regression: getRootNode (Bug #8) ---
    it('getRootNode returns document for elements connected to body', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      expect(el.getRootNode()).to.equal(document)
    })

    it('getRootNode returns document for elements connected to head', () => {
      const el = document.createElement('meta')
      document.head.appendChild(el)
      expect(el.getRootNode()).to.equal(document)
      document.head.removeChild(el)
    })

    it('getRootNode returns the element itself for disconnected elements', () => {
      const el = document.createElement('div')
      expect(el.getRootNode()).to.equal(el)
    })
  })

  // ---------------------------------------------------------------------------
  // NamedNodeMap
  // ---------------------------------------------------------------------------
  describe('NamedNodeMap', () => {
    it('namednodemapgetnameditem - getNamedItem returns attr with correct name', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'a title')
      const attr = el.attributes.getNamedItem('title')
      expect(attr).to.not.be.undefined
      expect(attr!.name).to.equal('title')
    })

    it('namednodemapnumberofnodes - attributes.length reflects number of attributes', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      el.setAttribute('title', 'a title')
      el.setAttribute('id', 'myid')
      expect(el.attributes.length).to.equal(3)
    })

    it('namednodemapreturnnull - getNamedItem for nonexistent returns null', () => {
      const el = document.createElement('div')
      const result = el.attributes.getNamedItem('nonexistent')
      expect(result).to.be.null
    })

    it('namednodemapremovenameditem - removeNamedItem removes the attribute', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      expect(el.attributes.getNamedItem('class')).to.not.be.null
      el.attributes.removeNamedItem('class')
      expect(el.attributes.getNamedItem('class')).to.be.null
    })

    it('namednodemapsetnameditemwithnewvalue - setNamedItem with createAttribute', () => {
      const el = document.createElement('div')
      const attr = document.createAttribute('title')
      attr.value = 'new title'
      el.attributes.setNamedItem(attr)
      expect(el.getAttribute('title')).to.equal('new title')
    })

    it('namednodemapchildnoderange - item() returns null for out-of-range index', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      expect(el.attributes.item(0)).to.not.be.null
      expect(el.attributes.item(1)).to.be.null
    })

    it('namednodemapreturnattrnode - item() returns Attr with correct name', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'a title')
      const attr = el.attributes.item(0)
      expect(attr).to.not.be.null
      expect(attr!.name).to.equal('title')
    })

    it('namednodemapreturnfirstitem - item(0) returns first attribute', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      el.setAttribute('title', 'a title')
      const first = el.attributes.item(0)
      expect(first).to.not.be.null
      expect(first!.name).to.equal('class')
    })

    it('namednodemapreturnlastitem - item(length-1) returns last attribute', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'test')
      el.setAttribute('title', 'a title')
      const last = el.attributes.item(el.attributes.length - 1)
      expect(last).to.not.be.null
      expect(last!.name).to.equal('title')
    })

    it('namednodemapsetnameditem - setNamedItem adds attribute', () => {
      const el = document.createElement('div')
      const attr = document.createAttribute('class')
      attr.value = 'test'
      el.attributes.setNamedItem(attr)
      expect(el.attributes.getNamedItem('class')).to.not.be.null
      expect(el.attributes.getNamedItem('class')!.value).to.equal('test')
    })

    it('namednodemapsetnameditemreturnvalue - setNamedItem returns null for new attr', () => {
      const el = document.createElement('div')
      const attr = document.createAttribute('title')
      attr.value = 'test'
      const result = el.attributes.setNamedItem(attr)
      expect(result).to.be.null
    })

    it('namednodemapsetnameditemthatexists - setNamedItem returns old attr when replacing', () => {
      const el = document.createElement('div')
      el.setAttribute('class', 'old')
      const attr = document.createAttribute('class')
      attr.value = 'new'
      const old = el.attributes.setNamedItem(attr)
      expect(old).to.not.be.null
      expect(old!.value).to.equal('old')
      expect(el.getAttribute('class')).to.equal('new')
    })

    it.skip('namednodemapinuseattributeerr [requires INUSE_ATTRIBUTE_ERR on NamedNodeMap]', () => {
      // NamedNodeMap.setNamedItem does not check INUSE (Element.setAttributeNode does)
    })

    it.skip('namednodemapnotfounderr [requires NOT_FOUND_ERR on removeNamedItem]', () => {
      // NamedNodeMap.removeNamedItem doesn't throw for missing items
    })

    it('namednodemapremovenameditemreturnnodevalue - removeNamedItem returns the removed attr', () => {
      const el = document.createElement('div')
      el.setAttribute('title', 'a title')
      const removed = el.attributes.removeNamedItem('title')
      expect(removed).to.not.be.null
      expect(removed!.nodeValue).to.equal('a title')
    })
  })

  // ---------------------------------------------------------------------------
  // CharacterData
  // ---------------------------------------------------------------------------
  describe('CharacterData', () => {
    it('characterdataappenddata - appendData appends to text node', () => {
      const text = document.createTextNode('hello')
      ;(text as any).appendData(' world')
      expect(text.data).to.equal('hello world')
    })

    it('characterdataappenddatagetdata - appendData result accessible via data', () => {
      const text = document.createTextNode('abc')
      ;(text as any).appendData('def')
      expect(text.data).to.equal('abcdef')
      expect((text as any).length).to.equal(6)
    })

    it.skip('characterdataappenddatanomodificationallowederr - readonly text node', () => {
      // Readonly nodes not supported
    })

    it('characterdatadeletedatabegining - deleteData from beginning', () => {
      const text = document.createTextNode('hello world')
      ;(text as any).deleteData(0, 5)
      expect(text.data).to.equal(' world')
    })

    it('characterdatadeletedataend - deleteData from end', () => {
      const text = document.createTextNode('hello world')
      ;(text as any).deleteData(5, 6)
      expect(text.data).to.equal('hello')
    })

    it('characterdatadeletedataexceedslength - deleteData count exceeds length', () => {
      const text = document.createTextNode('hello')
      ;(text as any).deleteData(2, 100)
      expect(text.data).to.equal('he')
    })

    it('characterdatadeletedatagetlengthanddata - deleteData updates length', () => {
      const text = document.createTextNode('hello world')
      ;(text as any).deleteData(0, 6)
      expect(text.data).to.equal('world')
      expect((text as any).length).to.equal(5)
    })

    it('characterdatadeletedatamiddle - deleteData from middle', () => {
      const text = document.createTextNode('hello world')
      ;(text as any).deleteData(5, 1)
      expect(text.data).to.equal('helloworld')
    })

    it.skip('characterdatadeletedatanomodificationallowederr - readonly text node', () => {
      // Readonly nodes not supported
    })

    it('characterdatagetdata - text.data returns the text content', () => {
      const text = document.createTextNode('some text data')
      expect(text.data).to.equal('some text data')
    })

    it('characterdatagetlength - text.length returns string length', () => {
      const text = document.createTextNode('hello')
      expect((text as any).length).to.equal(5)
    })

    it('characterdataindexsizeerrdeletedataoffsetgreater - deleteData throws for offset > length', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).deleteData(10, 1)).to.throw()
    })

    it('characterdataindexsizeerrdeletedataoffsetnegative - deleteData throws for negative offset', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).deleteData(-1, 1)).to.throw()
    })

    it('characterdataindexsizeerrinsertdataoffsetgreater - insertData throws for offset > length', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).insertData(10, 'x')).to.throw()
    })

    it('characterdataindexsizeerrinsertdataoffsetnegative - insertData throws for negative offset', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).insertData(-1, 'x')).to.throw()
    })

    it('characterdataindexsizeerrreplacedataoffsetgreater - replaceData throws for offset > length', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).replaceData(10, 1, 'x')).to.throw()
    })

    it('characterdataindexsizeerrreplacedataoffsetnegative - replaceData throws for negative offset', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).replaceData(-1, 1, 'x')).to.throw()
    })

    it.skip('characterdataindexsizeerrsubstringcountnegative - negative count treated as unsigned', () => {
      // DOM spec treats count as unsigned long; negative values don't throw
    })

    it('characterdataindexsizeerrsubstringoffsetgreater - substringData throws for offset > length', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).substringData(10, 1)).to.throw()
    })

    it('characterdataindexsizeerrsubstringnegativeoffset - substringData throws for negative offset', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).substringData(-1, 1)).to.throw()
    })

    it('characterdatainsertdatabeginning - insertData at beginning', () => {
      const text = document.createTextNode('world')
      ;(text as any).insertData(0, 'hello ')
      expect(text.data).to.equal('hello world')
    })

    it('characterdatainsertdataend - insertData at end', () => {
      const text = document.createTextNode('hello')
      ;(text as any).insertData(5, ' world')
      expect(text.data).to.equal('hello world')
    })

    it('characterdatainsertdatamiddle - insertData in middle', () => {
      const text = document.createTextNode('helloworld')
      ;(text as any).insertData(5, ' ')
      expect(text.data).to.equal('hello world')
    })

    it.skip('characterdatainsertdatanomodificationallowederr - readonly text node', () => {
      // Readonly nodes not supported
    })

    it('characterdatareplacedatabegining - replaceData at beginning', () => {
      const text = document.createTextNode('hello world')
      ;(text as any).replaceData(0, 5, 'hi')
      expect(text.data).to.equal('hi world')
    })

    it('characterdatareplacedataend - replaceData at end', () => {
      const text = document.createTextNode('hello world')
      ;(text as any).replaceData(6, 5, 'earth')
      expect(text.data).to.equal('hello earth')
    })

    it('characterdatareplacedataexceedslengthofarg - replaceData with shorter replacement', () => {
      const text = document.createTextNode('hello world')
      ;(text as any).replaceData(0, 11, 'hi')
      expect(text.data).to.equal('hi')
    })

    it('characterdatareplacedataexceedslengthofdata - replaceData count exceeds remaining', () => {
      const text = document.createTextNode('hello')
      ;(text as any).replaceData(3, 100, 'xyz')
      expect(text.data).to.equal('helxyz')
    })

    it('characterdatareplacedatamiddle - replaceData in middle', () => {
      const text = document.createTextNode('hello world')
      ;(text as any).replaceData(5, 1, '-')
      expect(text.data).to.equal('hello-world')
    })

    it.skip('characterdatareplacedatanomodificationallowederr - readonly text node', () => {
      // Readonly nodes not supported
    })

    it('characterdatasubstringvalue - substringData returns substring', () => {
      const text = document.createTextNode('hello world')
      expect((text as any).substringData(0, 5)).to.equal('hello')
      expect((text as any).substringData(6, 5)).to.equal('world')
    })

    // --- Regression: DOMException has numeric code (Bug #5) ---
    it('substringData throws DOMException with numeric code for invalid offset', () => {
      const text = document.createTextNode('hello')
      try {
        ;(text as any).substringData(100, 1)
        expect.fail('should have thrown')
      } catch (e: any) {
        expect(e.name).to.equal('IndexSizeError')
        expect(e.code).to.be.a('number')
        expect(e.code).to.equal(1)
      }
    })

    it('deleteData throws DOMException with numeric code for invalid offset', () => {
      const text = document.createTextNode('hello')
      try {
        ;(text as any).deleteData(100, 1)
        expect.fail('should have thrown')
      } catch (e: any) {
        expect(e.code).to.be.a('number')
      }
    })
  })

  // ---------------------------------------------------------------------------
  // Text
  // ---------------------------------------------------------------------------
  describe('Text', () => {
    it('textsplittextone - splitText splits at offset, original has first part', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const text = document.createTextNode('hello world')
      parent.appendChild(text)
      const newText = (text as any).splitText(5)
      expect(text.data).to.equal('hello')
      expect(newText.data).to.equal(' world')
    })

    it('textsplittexttwo - splitText new node is next sibling', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const text = document.createTextNode('hello world')
      parent.appendChild(text)
      const newText = (text as any).splitText(5)
      expect(text.nextSibling).to.equal(newText)
    })

    it('textsplittextthree - splitText at 0 empties original', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const text = document.createTextNode('hello')
      parent.appendChild(text)
      const newText = (text as any).splitText(0)
      expect(text.data).to.equal('')
      expect(newText.data).to.equal('hello')
    })

    it('textsplittextfour - splitText at end creates empty new node', () => {
      const parent = document.createElement('div')
      document.body.appendChild(parent)
      const text = document.createTextNode('hello')
      parent.appendChild(text)
      const newText = (text as any).splitText(5)
      expect(text.data).to.equal('hello')
      expect(newText.data).to.equal('')
    })

    it.skip('textsplittextnomodificationallowederr - readonly text node', () => {
      // Readonly nodes not supported
    })

    it.skip('textsplittextnomodificationallowederralikeee - readonly text node', () => {
      // Readonly nodes not supported
    })

    it('textwithnomarkup - text node data accessible via firstChild', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      el.appendChild(document.createTextNode('some text'))
      expect(el.firstChild).to.not.be.null
      expect((el.firstChild as any).data).to.equal('some text')
    })

    it('textindexsizeerrnegativeoffset - splitText throws for negative offset', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).splitText(-1)).to.throw()
    })

    it('textindexsizeerroffsetoutofbounds - splitText throws for offset > length', () => {
      const text = document.createTextNode('hello')
      expect(() => (text as any).splitText(10)).to.throw()
    })
  })

  // ---------------------------------------------------------------------------
  // Comment
  // ---------------------------------------------------------------------------
  describe('Comment', () => {
    it('commentgetcomment - comment.data returns the comment text', () => {
      const comment = document.createComment('This is a comment')
      expect(comment.data).to.equal('This is a comment')
    })
  })

  // ---------------------------------------------------------------------------
  // Processing instructions
  // ---------------------------------------------------------------------------
  describe('Processing instructions', () => {
    it('processinginstructiongetdata - PI.data returns the data', () => {
      const pi = document.createProcessingInstruction('xml-stylesheet', 'type="text/xsl"')
      expect(pi.data).to.equal('type="text/xsl"')
    })

    it('processinginstructiongettarget - PI.target returns the target', () => {
      const pi = document.createProcessingInstruction('xml-stylesheet', 'type="text/xsl"')
      expect(pi.target).to.equal('xml-stylesheet')
    })

    // --- Regression: cloneNode on ProcessingInstruction (Bug #3) ---
    it('clones a ProcessingInstruction', () => {
      const pi = document.createProcessingInstruction('xml-stylesheet', 'href="style.css"')
      const clone = pi.cloneNode(false)
      expect(clone.nodeType).to.equal(7)
      expect((clone as any).target).to.equal('xml-stylesheet')
      expect((clone as any).data).to.equal('href="style.css"')
    })
  })

  // ---------------------------------------------------------------------------
  // DocumentType
  // ---------------------------------------------------------------------------
  describe('DocumentType', () => {
    it.skip('documenttypegetdoctype [requires doctype]', () => {
      // Original: level1/core.js - documenttypegetdoctype
      // Needs: document.doctype
    })
  })

  // ---------------------------------------------------------------------------
  // Misc
  // ---------------------------------------------------------------------------
  describe('Misc', () => {
    it('creating_text_nodes_with_falsy_values - empty string and "0"', () => {
      const emptyText = document.createTextNode('')
      expect(emptyText.data).to.equal('')

      const zeroText = document.createTextNode('0')
      expect(zeroText.data).to.equal('0')
    })

    it('allow_empty_nodelists - empty element has childNodes.length === 0', () => {
      const el = document.createElement('div')
      expect(el.childNodes.length).to.equal(0)
    })

    it('documentgetrootnode - element.getRootNode() returns document when connected', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      expect(el.getRootNode()).to.equal(document)
    })
  })
})
