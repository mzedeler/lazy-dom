// Bidirectional u32 (wasmId) ↔ Node map
// Every Node gets a wasmId at construction; this registry maps between them.
// Uses WeakRef so orphaned DOM subtrees can be garbage collected.
// Parent nodes hold strong references to children via Node._children,
// so children stay alive as long as their parent is reachable.

import type { Node } from "../classes/Node/Node";

const idToNode = new Map<number, WeakRef<Node>>();

const cleanupRegistry = new FinalizationRegistry<number>((wasmId) => {
  idToNode.delete(wasmId);
});

export function register(wasmId: number, node: Node): void {
  idToNode.set(wasmId, new WeakRef(node));
  cleanupRegistry.register(node, wasmId);
}

export function unregister(wasmId: number): void {
  idToNode.delete(wasmId);
}

export function getNode(wasmId: number): Node | undefined {
  return idToNode.get(wasmId)?.deref();
}

export function getNodeOrThrow(wasmId: number): Node {
  const ref = idToNode.get(wasmId);
  const node = ref?.deref();
  if (!node) {
    throw new Error(`NodeRegistry: no node for wasmId ${wasmId}`);
  }
  return node;
}

export function has(wasmId: number): boolean {
  return idToNode.get(wasmId)?.deref() !== undefined;
}

export function clear(): void {
  idToNode.clear();
}
