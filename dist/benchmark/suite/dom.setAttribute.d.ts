/**
 * Benchmarks for setAttribute thunk chain depth.
 * Tests the O(N^2) closure chain hypothesis: each setAttribute wraps a new thunk,
 * and reading attributes evaluates the full chain.
 */
export declare const setAttribute10: () => number;
export declare const setAttribute50: () => number;
export declare const setAttribute100: () => number;
export declare const setAttributeOverwrite50: () => string | null;
