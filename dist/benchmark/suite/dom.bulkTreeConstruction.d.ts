/**
 * Benchmarks for tree building without reading (the "happy path" for lazy-dom).
 * Builds trees of increasing size without materializing any thunks via serialization.
 * Structure: header (h1, nav with links) + N cards (h2 + p + button) + footer.
 */
export declare const bulkTreeSmall: () => void;
export declare const bulkTreeMedium: () => void;
export declare const bulkTreeLarge: () => void;
