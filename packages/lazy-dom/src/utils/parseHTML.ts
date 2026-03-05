import { parseFragment, parse } from 'parse5'
import type { DefaultTreeAdapterMap } from 'parse5'
import type { Document } from '../classes/Document'
import type { Node } from '../classes/Node/Node'

type Parse5Node = DefaultTreeAdapterMap['childNode']
type Parse5Element = DefaultTreeAdapterMap['element']
type Parse5TextNode = DefaultTreeAdapterMap['textNode']
type Parse5CommentNode = DefaultTreeAdapterMap['commentNode']

// Serialize parse5 nodes back to raw HTML string (for <noscript> content)
function serializeParse5Nodes(nodes: Parse5Node[]): string {
  return nodes.map(serializeParse5Node).join('')
}

function serializeParse5Node(node: Parse5Node): string {
  if (node.nodeName === '#text') {
    return (node as Parse5TextNode).value
  }
  if (node.nodeName === '#comment') {
    return `<!--${(node as Parse5CommentNode).data}-->`
  }
  if (node.nodeName === '#documentType') {
    return ''
  }
  // Element
  const el = node as Parse5Element
  const attrs = el.attrs
    .map(a => a.prefix ? ` ${a.prefix}:${a.name}="${a.value}"` : ` ${a.name}="${a.value}"`)
    .join('')
  const children = el.childNodes ? serializeParse5Nodes(el.childNodes) : ''
  return `<${el.tagName}${attrs}>${children}</${el.tagName}>`
}

/**
 * Parse HTML as a fragment (for innerHTML).
 */
export function parseHTML(html: string, ownerDocument: Document): Node[] {
  const fragment = parseFragment(html)
  return convertNodes(fragment.childNodes, ownerDocument)
}

/**
 * Parse HTML as a full document (for document.write).
 * Returns the children of the parsed document's <html> element,
 * or all top-level nodes if no <html> wrapper is found.
 */
export function parseHTMLDocument(html: string, ownerDocument: Document): Node[] {
  const doc = parse(html)
  // parse5.parse() always wraps in a document with <html><head><body>
  // Find the <html> element and return its children
  const htmlEl = doc.childNodes.find(
    (n): n is Parse5Element => n.nodeName === 'html'
  )
  if (htmlEl) {
    return convertNodes(htmlEl.childNodes, ownerDocument)
  }
  return convertNodes(doc.childNodes, ownerDocument)
}

function convertNodes(nodes: Parse5Node[], doc: Document): Node[] {
  const result: Node[] = []
  for (const node of nodes) {
    const converted = convertNode(node, doc)
    if (converted) {
      result.push(converted)
    }
  }
  return result
}

function convertNode(node: Parse5Node, doc: Document): Node | null {
  const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml'

  switch (node.nodeName) {
    case '#text':
      return doc.createTextNode((node as Parse5TextNode).value)
    case '#comment':
      return doc.createComment((node as Parse5CommentNode).data)
    case '#documentType':
      return null
    default: {
      // Element node
      const el = node as Parse5Element
      const tagName = el.tagName
      const ns = el.namespaceURI

      const element = ns && ns !== XHTML_NAMESPACE
        ? doc.createElementNS(ns, tagName)
        : doc.createElement(tagName)

      // Set attributes
      for (const attr of el.attrs) {
        if (attr.namespace) {
          const qualifiedName = attr.prefix ? `${attr.prefix}:${attr.name}` : attr.name
          element.setAttributeNS(attr.namespace, qualifiedName, attr.value)
        } else {
          element.setAttribute(attr.name, attr.value)
        }
      }

      // For <noscript> in a scripting context, store children as raw HTML text
      // parse5 with scriptingEnabled=true (default) already treats noscript
      // content as raw text, but we still need to serialize for consistency
      if (tagName === 'noscript' && el.childNodes && el.childNodes.length > 0) {
        const rawHTML = serializeParse5Nodes(el.childNodes)
        if (rawHTML) {
          element.appendChild(doc.createTextNode(rawHTML))
        }
        return element
      }

      // Handle <template> content
      const children = 'content' in el
        ? (el as Parse5Element & { content: DefaultTreeAdapterMap['documentFragment'] }).content.childNodes
        : el.childNodes

      if (children) {
        const convertedChildren = convertNodes(children, doc)

        for (const child of convertedChildren) {
          element.appendChild(child)
        }
      }
      return element
    }
  }
}
