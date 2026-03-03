import { DOMException } from "../classes/DOMException"

export interface QualifiedName {
  prefix: string | null
  localName: string
}

export function parseQualifiedName(qualifiedName: string): QualifiedName {
  const colonIndex = qualifiedName.indexOf(':')
  if (colonIndex >= 0) {
    return {
      prefix: qualifiedName.substring(0, colonIndex),
      localName: qualifiedName.substring(colonIndex + 1),
    }
  }
  return { prefix: null, localName: qualifiedName }
}

/**
 * Validate a namespace/prefix combination per the DOM spec.
 *
 * When `checkXmlns` is true (default), the xmlns-specific checks are applied.
 * `createElementNS` passes false since those checks don't apply to elements.
 */
export function validateNamespace(
  prefix: string | null,
  namespaceURI: string | null,
  qualifiedName: string,
  checkXmlns: boolean = true,
): void {
  if (prefix !== null && namespaceURI === null) {
    throw new DOMException(
      "Namespace is null but prefix is not null.",
      'NamespaceError',
      DOMException.NAMESPACE_ERR
    )
  }
  if (prefix === 'xml' && namespaceURI !== 'http://www.w3.org/XML/1998/namespace') {
    throw new DOMException(
      "Prefix 'xml' requires namespace 'http://www.w3.org/XML/1998/namespace'.",
      'NamespaceError',
      DOMException.NAMESPACE_ERR
    )
  }
  if (checkXmlns) {
    if (qualifiedName === 'xmlns' && namespaceURI !== 'http://www.w3.org/2000/xmlns/') {
      throw new DOMException(
        "'xmlns' requires namespace 'http://www.w3.org/2000/xmlns/'.",
        'NamespaceError',
        DOMException.NAMESPACE_ERR
      )
    }
    if (prefix === 'xmlns' && namespaceURI !== 'http://www.w3.org/2000/xmlns/') {
      throw new DOMException(
        "Prefix 'xmlns' requires namespace 'http://www.w3.org/2000/xmlns/'.",
        'NamespaceError',
        DOMException.NAMESPACE_ERR
      )
    }
  }
}
