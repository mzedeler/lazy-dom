// Synchronous WASM instantiation using @assemblyscript/loader
// Synchronous loading is required because DOM classes are used at import time.

import { instantiateSync, ASUtil } from "@assemblyscript/loader";
import { readFileSync } from "fs";
import { resolve } from "path";

export interface WasmExports extends ASUtil {
  // Node lifecycle
  createNode(nodeType: number): number;
  destroyNode(nodeId: number): void;

  // Node properties
  getNodeType(nodeId: number): number;
  getParentId(nodeId: number): number;
  setParentId(nodeId: number, parentId: number): void;
  getOwnerDocumentId(nodeId: number): number;
  setOwnerDocumentId(nodeId: number, docId: number): void;

  // Child management
  appendChild(parentId: number, childId: number): void;
  removeChild(parentId: number, childId: number): void;
  clearChildren(nodeId: number): void;
  getChildCount(nodeId: number): number;
  getChildId(nodeId: number, index: number): number;
  getChildIds(nodeId: number): number; // returns pointer to StaticArray<u32>

  hasNode(nodeId: number): boolean;

  // Document registry
  createDocument(): number;
  destroyDocument(docId: number): void;
  getDocumentBodyId(docId: number): number;
  setDocumentBodyId(docId: number, bodyId: number): void;
  connectSubtree(docId: number, rootId: number): void;
  disconnectSubtree(docId: number, rootId: number): void;
  disconnectElement(docId: number, elementId: number): void;
  getConnectedElementCount(docId: number): number;
  getConnectedElementIds(docId: number): number; // returns pointer to StaticArray<u32>
}

// Find the WASM file relative to this source file
// In development (tsx), __dirname points to src/wasm/
// The WASM binary is at build/wasm/lazy-dom.wasm from project root
function findWasmPath(): string {
  // Try multiple potential locations
  const candidates = [
    resolve(__dirname, "../../build/wasm/lazy-dom.wasm"),      // from src/wasm/ (dev via tsx)
    resolve(__dirname, "../build/wasm/lazy-dom.wasm"),          // from dist/wasm/ (compiled)
    resolve(process.cwd(), "build/wasm/lazy-dom.wasm"),         // cwd fallback
    resolve(process.cwd(), "node_modules/lazy-dom/build/wasm/lazy-dom.wasm"),
  ];
  for (const candidate of candidates) {
    try {
      readFileSync(candidate);
      return candidate;
    } catch {
      // try next
    }
  }
  return candidates[1]; // default to cwd-relative path
}

const wasmPath = findWasmPath();
const wasmBuffer = readFileSync(wasmPath);

const wasmInstance = instantiateSync<WasmExports>(wasmBuffer, {
  env: {
    abort(msgPtr: number, filePtr: number, line: number, column: number) {
      const msg = msgPtr ? wasm.__getString(msgPtr) : "unknown";
      const file = filePtr ? wasm.__getString(filePtr) : "unknown";
      throw new Error(`WASM abort: ${msg} at ${file}:${line}:${column}`);
    },
  },
});

export const wasm: WasmExports = wasmInstance.exports;
