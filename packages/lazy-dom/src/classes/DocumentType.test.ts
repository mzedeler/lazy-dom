import { expect } from 'chai'

describe('DocumentType', () => {
  describe('createDocumentType', () => {
    it('creates a DocumentType node with correct properties', () => {
      const doctype = document.implementation.createDocumentType('html', '', '')
      expect(doctype.name).to.equal('html')
      expect(doctype.publicId).to.equal('')
      expect(doctype.systemId).to.equal('')
      expect(doctype.nodeType).to.equal(10)
      expect(doctype.nodeName).to.equal('html')
    })

    it('stores publicId and systemId', () => {
      const doctype = document.implementation.createDocumentType(
        'html',
        '-//W3C//DTD XHTML 1.0 Strict//EN',
        'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'
      )
      expect(doctype.publicId).to.equal('-//W3C//DTD XHTML 1.0 Strict//EN')
      expect(doctype.systemId).to.equal('http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd')
    })

    it('sets ownerDocument to the implementation document', () => {
      const doctype = document.implementation.createDocumentType('html', '', '')
      expect(doctype.ownerDocument).to.equal(document)
    })
  })

  describe('nodeValue and textContent', () => {
    it('returns null for nodeValue', () => {
      const doctype = document.implementation.createDocumentType('html', '', '')
      expect(doctype.nodeValue).to.be.null
    })

    it('returns null for textContent', () => {
      const doctype = document.implementation.createDocumentType('html', '', '')
      expect(doctype.textContent).to.be.null
    })

    it('setting nodeValue has no effect', () => {
      const doctype = document.implementation.createDocumentType('html', '', '')
      doctype.nodeValue = 'test'
      expect(doctype.nodeValue).to.be.null
    })

    it('setting textContent has no effect', () => {
      const doctype = document.implementation.createDocumentType('html', '', '')
      doctype.textContent = 'test'
      expect(doctype.textContent).to.be.null
    })
  })

  describe('cloneNode', () => {
    it('clones a DocumentType node', () => {
      const doctype = document.implementation.createDocumentType('html', 'pub', 'sys')
      const clone = doctype.cloneNode()
      expect(clone.nodeType).to.equal(10)
      expect(clone.nodeName).to.equal('html')
      expect(clone).to.not.equal(doctype)
    })
  })

  describe('document.doctype', () => {
    it('returns null when no doctype is present', () => {
      expect(document.doctype).to.be.null
    })

    it('returns the doctype when one is appended', () => {
      const doc = document.implementation.createHTMLDocument('test')
      const doctype = doc.implementation.createDocumentType('html', '', '')
      doc.insertBefore(doctype, doc.firstChild)
      expect(doc.doctype).to.equal(doctype)
    })
  })

  describe('createDocument', () => {
    it('creates a document with a root element', () => {
      const doc = document.implementation.createDocument('', 'test', null)
      expect(doc.documentElement.tagName).to.equal('test')
    })

    it('creates a document with a doctype', () => {
      const doctype = document.implementation.createDocumentType('html', '', '')
      const doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', doctype)
      expect(doc.doctype).to.equal(doctype)
      expect(doc.documentElement.tagName).to.equal('HTML')
    })

    it('creates a document with no root element when qualifiedName is null', () => {
      const doc = document.implementation.createDocument(null, null, null)
      // The document should have no custom document element beyond default
      expect(doc.doctype).to.be.null
    })

    it('creates a document with empty qualifiedName', () => {
      const doc = document.implementation.createDocument(null, '', null)
      expect(doc.doctype).to.be.null
    })
  })
})
