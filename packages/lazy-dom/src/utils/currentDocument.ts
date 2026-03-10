import type { Document } from '../classes/Document'

/**
 * Module-level reference to the current Document instance.
 * Set by lazyDom() on creation, cleared by reset() on teardown.
 * Used by Range and DocumentFragment as a fallback when no
 * ownerDocument is available from the node hierarchy.
 */
let _currentDocument: Document | null = null

export function setCurrentDocument(doc: Document | null): void {
  _currentDocument = doc
}

export function getCurrentDocument(): Document | null {
  return _currentDocument
}
