import { parseDOM } from 'htmlparser2'
import type { Document } from '../classes/Document'
import type { Node } from '../classes/Node/Node'

interface ParsedNode {
  type: string
  name?: string
  data?: string
  attribs?: Record<string, string>
  children?: ParsedNode[]
}

export function parseHTML(html: string, ownerDocument: Document): Node[] {
  const parsed = parseDOM(html) as ParsedNode[]
  return convertNodes(parsed, ownerDocument)
}

function convertNodes(nodes: ParsedNode[], doc: Document): Node[] {
  const result: Node[] = []
  for (const node of nodes) {
    const converted = convertNode(node, doc)
    if (converted) {
      result.push(converted)
    }
  }
  return result
}

function convertNode(node: ParsedNode, doc: Document): Node | null {
  switch (node.type) {
    case 'tag':
    case 'script':
    case 'style': {
      const element = doc.createElement(node.name!)
      if (node.attribs) {
        for (const [name, value] of Object.entries(node.attribs)) {
          element.setAttribute(name, value)
        }
      }
      if (node.children) {
        const children = convertNodes(node.children, doc)
        for (const child of children) {
          element.appendChild(child)
        }
      }
      return element
    }
    case 'text':
      return doc.createTextNode(node.data ?? '')
    case 'comment':
      return doc.createComment(node.data ?? '')
    default:
      return null
  }
}
