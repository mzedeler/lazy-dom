import type { Node } from "../classes/Node/Node";
export declare function register(wasmId: number, node: Node): void;
export declare function unregister(wasmId: number): void;
export declare function getNode(wasmId: number): Node | undefined;
export declare function getNodeOrThrow(wasmId: number): Node;
export declare function has(wasmId: number): boolean;
