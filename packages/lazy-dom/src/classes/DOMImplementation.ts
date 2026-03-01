import type { Document } from "./Document"

type DocumentFactory = () => Document

export class DOMImplementation {
  private _createDocument: DocumentFactory

  constructor(createDocument: DocumentFactory) {
    this._createDocument = createDocument
  }

  hasFeature(_feature: string, _version?: string | null): boolean {
    // DOM Level 2 spec: always returns true
    return true
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
}
