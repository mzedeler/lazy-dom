import { NodeTypes } from "../../types/NodeTypes"

import { Document } from "../Document"
import { Element } from "../Element"
import { NodeStore } from "./NodeStore"
import { ChildNodeList } from "./ChildNodeList"
import * as nodeOps from "../../wasm/nodeOps"
import * as NodeRegistry from "../../wasm/NodeRegistry"

import { DOMException } from "../DOMException"
import { notifyMutation } from "../mutationNotify"
import { Range } from "../Range"

// Forward reference resolved at runtime to avoid circular imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let DocumentFragment: any
function getDocumentFragment() {
  if (!DocumentFragment) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    DocumentFragment = require("../DocumentFragment").DocumentFragment
  }
  return DocumentFragment
}

export abstract class Node {
  wasmId: number
  nodeStore: NodeStore
  readonly _childNodes: ChildNodeList
  /** Set by Document when this node is a direct child of the document. */
  _parentDocument: Document | null = null

  readonly ELEMENT_NODE = NodeTypes.ELEMENT_NODE
  readonly ATTRIBUTE_NODE = NodeTypes.ATTRIBUTE_NODE
  readonly TEXT_NODE = NodeTypes.TEXT_NODE
  readonly PROCESSING_INSTRUCTION_NODE = NodeTypes.PROCESSING_INSTRUCTION_NODE
  readonly COMMENT_NODE = NodeTypes.COMMENT_NODE
  readonly DOCUMENT_NODE = NodeTypes.DOCUMENT_NODE
  readonly DOCUMENT_TYPE_NODE = NodeTypes.DOCUMENT_TYPE_NODE
  readonly DOCUMENT_FRAGMENT_NODE = NodeTypes.DOCUMENT_FRAGMENT_NODE

  constructor(nodeType: NodeTypes) {
    this.wasmId = nodeOps.createNode(nodeType)
    NodeRegistry.register(this.wasmId, this)
    this.nodeStore = new NodeStore(this.wasmId)
    this._childNodes = new ChildNodeList(this.nodeStore)
  }

  dump(): string {
    return this.nodeType + ':' + this.wasmId + ((this instanceof Element) ? ':' + this.tagName : '')
  }

  get childNodes() {
    return this._childNodes
  }

  get nodeType(): NodeTypes {
    return nodeOps.getNodeType(this.wasmId)
  }

  get ownerDocument(): Document {
    return this.nodeStore.ownerDocument()
  }

  get parent(): Node | null {
    const parentId = nodeOps.getParentId(this.wasmId)
    if (parentId === 0) return null
    return NodeRegistry.getNode(parentId) ?? null
  }

  get parentNode(): Node | Document | null {
    if (this._parentDocument) return this._parentDocument
    return this.parent
  }

  get parentElement(): Element | null {
    const parent = this.parent
    return parent instanceof Element ? parent : null
  }

  get firstChild(): Node | null {
    return this.nodeStore.getChildNode(0) ?? null
  }

  get lastChild(): Node | null {
    const count = this.nodeStore.getChildCount()
    if (count === 0) return null
    return this.nodeStore.getChildNode(count - 1) ?? null
  }

  get nextSibling(): Node | null {
    const parentId = nodeOps.getParentId(this.wasmId)
    if (parentId === 0) return null
    const siblingIds = nodeOps.getChildIds(parentId)
    const myIndex = siblingIds.indexOf(this.wasmId)
    if (myIndex === -1 || myIndex === siblingIds.length - 1) return null
    return NodeRegistry.getNode(siblingIds[myIndex + 1]) ?? null
  }

  get previousSibling(): Node | null {
    const parentId = nodeOps.getParentId(this.wasmId)
    if (parentId === 0) return null
    const siblingIds = nodeOps.getChildIds(parentId)
    const myIndex = siblingIds.indexOf(this.wasmId)
    if (myIndex <= 0) return null
    return NodeRegistry.getNode(siblingIds[myIndex - 1]) ?? null
  }

  get nextElementSibling(): Element | null {
    let sibling = this.nextSibling
    while (sibling) {
      if (sibling instanceof Element) return sibling
      sibling = sibling.nextSibling
    }
    return null
  }

  get previousElementSibling(): Element | null {
    let sibling = this.previousSibling
    while (sibling) {
      if (sibling instanceof Element) return sibling
      sibling = sibling.previousSibling
    }
    return null
  }

  hasChildNodes(): boolean {
    return this.nodeStore.getChildCount() > 0
  }

  get isConnected(): boolean {
    return this.parentNode !== null ? this.parentNode.isConnected : false
  }

  get nodeValue(): string | null {
    return this.nodeStore.nodeValue()
  }

  set nodeValue(nodeValue: string | null) {
    this.nodeStore.nodeValue = () => nodeValue
  }

  removeChild(node: Node): Node {
    if (node == null) {
      throw new TypeError("Failed to execute 'removeChild' on 'Node': 1 argument required, but only 0 present.")
    }
    // Check that node is actually a child and find its index for Range tracking
    const childIds = nodeOps.getChildIds(this.wasmId)
    const childIndex = childIds.indexOf(node.wasmId)
    if (childIndex === -1) {
      throw new DOMException(
        "The node to be removed is not a child of this node.",
        'NotFoundError',
        DOMException.NOT_FOUND_ERR
      )
    }

    nodeOps.setParentId(node.wasmId, 0)
    nodeOps.removeChild(this.wasmId, node.wasmId)
    this.ownerDocument.documentStore.disconnect(node)

    Range._notifyChildRemoved(this, childIndex)
    notifyMutation({ type: 'childList', target: this, removedNodes: [node] })

    return node
  }

  insertBefore(newNode: Node, referenceNode: Node | null): Node {
    const DocFrag = getDocumentFragment()
    if (newNode instanceof DocFrag) {
      const children = newNode.nodeStore.getChildNodesArray()
      for (const child of children) {
        this.insertBefore(child, referenceNode)
      }
      return newNode
    }

    // HIERARCHY_REQUEST_ERR: cannot insert an ancestor as a child
    if (newNode === (this as Node) || newNode.contains(this)) {
      throw new DOMException(
        "The new child element contains the parent.",
        'HierarchyRequestError',
        DOMException.HIERARCHY_REQUEST_ERR
      )
    }

    // NOT_FOUND_ERR: referenceNode is not a child
    if (referenceNode !== null) {
      const childIds = nodeOps.getChildIds(this.wasmId)
      if (!childIds.includes(referenceNode.wasmId)) {
        throw new DOMException(
          "The node before which the new node is to be inserted is not a child of this node.",
          'NotFoundError',
          DOMException.NOT_FOUND_ERR
        )
      }
    }

    // Remove from old parent if needed
    const oldParentId = nodeOps.getParentId(newNode.wasmId)
    if (oldParentId !== 0) {
      nodeOps.removeChild(oldParentId, newNode.wasmId)
    }

    nodeOps.setParentId(newNode.wasmId, this.wasmId)
    nodeOps.insertBefore(this.wasmId, newNode.wasmId, referenceNode ? referenceNode.wasmId : 0)
    this.ownerDocument.documentStore.connect(newNode)

    notifyMutation({ type: 'childList', target: this, addedNodes: [newNode] })

    return newNode
  }

  appendChild(node: Node) {
    const DocFrag = getDocumentFragment()
    if (node instanceof DocFrag) {
      const children = node.nodeStore.getChildNodesArray()
      for (const child of children) {
        this.appendChild(child)
      }
      return node
    }

    // HIERARCHY_REQUEST_ERR: cannot insert an ancestor as a child
    if (node === (this as Node) || node.contains(this)) {
      throw new DOMException(
        "The new child element contains the parent.",
        'HierarchyRequestError',
        DOMException.HIERARCHY_REQUEST_ERR
      )
    }

    // Remove from old parent if needed
    const oldParentId = nodeOps.getParentId(node.wasmId)
    if (oldParentId !== 0) {
      nodeOps.removeChild(oldParentId, node.wasmId)
    }

    nodeOps.setParentId(node.wasmId, this.wasmId)
    nodeOps.appendChild(this.wasmId, node.wasmId)
    this.ownerDocument.documentStore.connect(node)

    notifyMutation({ type: 'childList', target: this, addedNodes: [node] })

    return node
  }

  replaceChild(newChild: Node, oldChild: Node): Node {
    const DocFrag = getDocumentFragment()
    if (newChild instanceof DocFrag) {
      const children = newChild.nodeStore.getChildNodesArray()
      if (children.length === 0) {
        this.removeChild(oldChild)
        return oldChild
      }
      // Insert fragment children before oldChild, then remove oldChild
      for (const child of children) {
        this.insertBefore(child, oldChild)
      }
      this.removeChild(oldChild)
      return oldChild
    }

    this.insertBefore(newChild, oldChild)
    this.removeChild(oldChild)
    return oldChild
  }

  cloneNode(deep: boolean = false): Node {
    const clone = this._cloneNodeShallow()
    if (deep) {
      const children = this.nodeStore.getChildNodesArray()
      for (const child of children) {
        clone.appendChild(child.cloneNode(true))
      }
    }
    return clone
  }

  protected _cloneNodeShallow(): Node {
    // Subclasses should override this for proper cloning
    throw new Error('_cloneNodeShallow not implemented for this node type')
  }

  normalize(): void {
    const children = this.nodeStore.getChildNodesArray()
    let i = 0
    while (i < children.length) {
      const child = children[i]
      if (child.nodeType === NodeTypes.TEXT_NODE) {
        if (child.nodeValue === '') {
          this.removeChild(child)
          children.splice(i, 1)
          continue
        }
        // Merge consecutive text nodes
        while (i + 1 < children.length && children[i + 1].nodeType === NodeTypes.TEXT_NODE) {
          const nextText = children[i + 1]
          child.nodeValue = (child.nodeValue ?? '') + (nextText.nodeValue ?? '')
          this.removeChild(nextText)
          children.splice(i + 1, 1)
        }
      } else if (child.nodeType === NodeTypes.ELEMENT_NODE) {
        child.normalize()
      }
      i++
    }
  }

  contains(other: Node | null): boolean {
    if (!other) return false
    let current: Node | null = other
    while (current) {
      if (current === (this as Node)) return true
      current = current.parent
    }
    return false
  }

  remove(): void {
    const parent = this.parent
    if (parent) {
      parent.removeChild(this)
    }
  }

  static readonly DOCUMENT_POSITION_DISCONNECTED = 0x01
  static readonly DOCUMENT_POSITION_PRECEDING = 0x02
  static readonly DOCUMENT_POSITION_FOLLOWING = 0x04
  static readonly DOCUMENT_POSITION_CONTAINS = 0x08
  static readonly DOCUMENT_POSITION_CONTAINED_BY = 0x10
  static readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20

  readonly DOCUMENT_POSITION_DISCONNECTED = 0x01
  readonly DOCUMENT_POSITION_PRECEDING = 0x02
  readonly DOCUMENT_POSITION_FOLLOWING = 0x04
  readonly DOCUMENT_POSITION_CONTAINS = 0x08
  readonly DOCUMENT_POSITION_CONTAINED_BY = 0x10
  readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20

  compareDocumentPosition(other: Node): number {
    if (this === other) return 0

    // Get ancestor chains for both nodes
    const getAncestors = (node: Node): Node[] => {
      const result: Node[] = []
      let current: Node | null = node
      while (current) {
        result.unshift(current)
        current = current.parent
      }
      return result
    }

    const thisAncestors = getAncestors(this)
    const otherAncestors = getAncestors(other)

    // If they don't share a root, they're disconnected
    if (thisAncestors[0] !== otherAncestors[0]) {
      return Node.DOCUMENT_POSITION_DISCONNECTED |
        Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC |
        (this.wasmId < other.wasmId ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)
    }

    // Check for containment
    if (this.contains(other)) {
      return Node.DOCUMENT_POSITION_CONTAINED_BY | Node.DOCUMENT_POSITION_FOLLOWING
    }
    if (other.contains(this)) {
      return Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING
    }

    // Find the common ancestor and compare sibling order
    let commonDepth = 0
    while (commonDepth < thisAncestors.length && commonDepth < otherAncestors.length &&
           thisAncestors[commonDepth] === otherAncestors[commonDepth]) {
      commonDepth++
    }

    const thisBranch = thisAncestors[commonDepth]
    const otherBranch = otherAncestors[commonDepth]
    const commonParent = thisAncestors[commonDepth - 1]

    // Find which branch comes first among the parent's children
    const childIds = nodeOps.getChildIds(commonParent.wasmId)
    const thisIndex = childIds.indexOf(thisBranch.wasmId)
    const otherIndex = childIds.indexOf(otherBranch.wasmId)

    if (thisIndex < otherIndex) {
      return Node.DOCUMENT_POSITION_FOLLOWING
    }
    return Node.DOCUMENT_POSITION_PRECEDING
  }

  isSameNode(other: Node | null): boolean {
    return this === other
  }

  getRootNode(): Node | Document {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: Node = this
    while (current.parent !== null) {
      current = current.parent
    }
    // If the root is the documentElement, return the document itself
    const doc = current.ownerDocument
    if (doc.documentElement === current) {
      return doc
    }
    return current
  }
}
