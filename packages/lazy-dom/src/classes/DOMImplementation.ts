import type { Document } from "./Document"
import { DocumentType } from "./DocumentType"

type DocumentFactory = () => Document

export class DOMImplementation {
  private _createDocument: DocumentFactory
  private _ownerDocument: () => Document

  constructor(createDocument: DocumentFactory, ownerDocument: () => Document) {
    this._createDocument = createDocument
    this._ownerDocument = ownerDocument
  }

  hasFeature(_feature: string, _version?: string | null): boolean {
    // DOM Level 2 spec: always returns true
    return true
  }

  createDocumentType(qualifiedName: string, publicId: string, systemId: string): DocumentType {
    const doctype = new DocumentType(qualifiedName, publicId, systemId)
    doctype.nodeStore.ownerDocument = this._ownerDocument
    return doctype
  }

  createDocument(namespace: string | null, qualifiedName: string | null, doctype: DocumentType | null): Document {
    const doc = this._createDocument()

    // Force the lazy html/head/body init, then clear it — createDocument
    // produces a bare document with only the supplied doctype and root.
    const defaultHtml = doc.documentElement
    doc.removeChild(defaultHtml)

    if (doctype) {
      doctype.nodeStore.ownerDocument = () => doc
      doc.appendChild(doctype)
    }
    if (qualifiedName) {
      const root = doc.createElementNS(namespace, qualifiedName)
      doc.appendChild(root)
    }
    return doc
  }

  createHTMLDocument(title?: string): Document {
    const doc = this._createDocument()
    if (title !== undefined) {
      const titleElement = doc.createElement('title')
      titleElement.textContent = title
      doc.head.appendChild(titleElement)
    }
    return doc
  }

  /** Break closure references to the owning Document. */
  _dispose(): void {
    this._createDocument = () => { throw new Error('disposed') }
    this._ownerDocument = () => { throw new Error('disposed') }
  }
}
