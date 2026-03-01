/**
 * Benchmarks for textContent reading.
 * Tests flat vs deep vs mixed child structures.
 * Note: current textContent implementation only reads direct Text children,
 * so textContentDeep20 will reveal that gap.
 */
export declare const textContentFlat100: () => string | null;
export declare const textContentDeep20: () => string | null;
export declare const textContentMixed: () => string | null;
