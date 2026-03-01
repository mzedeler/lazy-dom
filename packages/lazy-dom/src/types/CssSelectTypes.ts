import { NodeTypes } from "./NodeTypes"

/** Minimal node interface for CSS selector operations.
 *  Satisfied by both lazy-dom's Node and the standard DOM Node. */
export interface CssNode {
  readonly nodeType: number
  readonly nodeValue: string | null
  readonly childNodes: Iterable<CssNode>
}

/** Element interface for CSS selector operations.
 *  Satisfied by both lazy-dom's Element and standard DOM Element. */
export interface CssElement extends CssNode {
  readonly tagName: string
  readonly parentNode: object | null
  getAttribute(qualifiedName: string): string | null
  hasAttribute(name: string): boolean
}

/** Type guard: checks if a value is a CssNode (has nodeType property). */
export function isCssNode(value: unknown): value is CssNode {
  return value !== null && typeof value === 'object' && 'nodeType' in value
    && typeof value.nodeType === 'number'
}

/** Type guard: checks if a CssNode is a CssElement (element node type). */
export function isCssElement(node: CssNode): node is CssElement {
  return node.nodeType === NodeTypes.ELEMENT_NODE
}
