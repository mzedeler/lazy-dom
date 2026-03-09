import { expect } from 'chai'
import * as NodeRegistry from './NodeRegistry'
import { Node } from '../classes/Node/Node'
import { Element } from '../classes/Element'

// At runtime, document.createElement returns lazy-dom nodes.
// Cast to our types so TypeScript sees wasmId.
const createElement = (tag: string) => document.createElement(tag) as unknown as Element & Node

describe('NodeRegistry', () => {
  before(function () {
    if (!globalThis.__LAZY_DOM__) this.skip()
  })

  it('register makes a node retrievable by wasmId', () => {
    const el = createElement('div')
    const retrieved = NodeRegistry.getNode(el.wasmId)
    expect(retrieved).to.equal(el)
  })

  it('getNodeOrThrow returns the node for a valid wasmId', () => {
    const el = createElement('span')
    const retrieved = NodeRegistry.getNodeOrThrow(el.wasmId)
    expect(retrieved).to.equal(el)
  })

  it('getNodeOrThrow throws for an unregistered wasmId', () => {
    expect(() => NodeRegistry.getNodeOrThrow(999999)).to.throw(
      /NodeRegistry: no node for wasmId 999999/
    )
  })

  it('getNode returns undefined for an unregistered wasmId', () => {
    expect(NodeRegistry.getNode(999999)).to.be.undefined
  })

  it('has returns true for a registered node', () => {
    const el = createElement('div')
    expect(NodeRegistry.has(el.wasmId)).to.be.true
  })

  it('has returns false for an unregistered wasmId', () => {
    expect(NodeRegistry.has(999999)).to.be.false
  })

  it('unregister removes the node', () => {
    const el = createElement('div')
    const id = el.wasmId
    expect(NodeRegistry.has(id)).to.be.true

    NodeRegistry.unregister(id)
    expect(NodeRegistry.has(id)).to.be.false
    expect(NodeRegistry.getNode(id)).to.be.undefined
  })

  it('holds strong references: node is retrievable even without external reference', () => {
    // Create a node, record its wasmId, then drop all JS references.
    // With strong references the node must still be in the registry.
    const wasmId = createElement('div').wasmId
    // The local variable is out of scope after this line in a real scenario,
    // but even so, the registry must hold the node.
    expect(NodeRegistry.has(wasmId)).to.be.true
    expect(NodeRegistry.getNode(wasmId)).to.not.be.undefined
  })

  it('child nodes remain in registry when accessed through parent', () => {
    const parent = createElement('div')
    ;(document.body as unknown as Node).appendChild(parent)
    parent.innerHTML = '<span><i>deep</i></span>'

    const span = parent.firstChild as unknown as Node
    const italic = span.firstChild as unknown as Node

    // All nodes must be in the registry
    expect(NodeRegistry.has(parent.wasmId)).to.be.true
    expect(NodeRegistry.has(span.wasmId)).to.be.true
    expect(NodeRegistry.has(italic.wasmId)).to.be.true

    // And retrievable
    expect(NodeRegistry.getNodeOrThrow(span.wasmId)).to.equal(span)
    expect(NodeRegistry.getNodeOrThrow(italic.wasmId)).to.equal(italic)
  })
})
