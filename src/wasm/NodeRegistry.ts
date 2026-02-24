// Bidirectional u32 (wasmId) ↔ Node map
// Every Node gets a wasmId at construction; this registry maps between them.

import type { Node } from "../classes/Node/Node";

const idToNode = new Map<number, Node>();

export function register(wasmId: number, node: Node): void {
  idToNode.set(wasmId, node);
}

export function unregister(wasmId: number): void {
  idToNode.delete(wasmId);
}

export function getNode(wasmId: number): Node | undefined {
  return idToNode.get(wasmId);
}

export function getNodeOrThrow(wasmId: number): Node {
  const node = idToNode.get(wasmId);
  if (!node) {
    throw new Error(`NodeRegistry: no node for wasmId ${wasmId}`);
  }
  return node;
}

export function has(wasmId: number): boolean {
  return idToNode.has(wasmId);
}
