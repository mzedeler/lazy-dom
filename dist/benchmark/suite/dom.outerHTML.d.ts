/**
 * Benchmarks for DOM serialization (outerHTML / innerHTML).
 * This is the dominant cost in failing test suites — toMatchSnapshot() calls
 * outerHTML which forces evaluation of ALL lazy thunk chains recursively.
 */
export declare const outerHTMLWideTree: () => string;
export declare const outerHTMLDeepTree: () => string;
export declare const outerHTMLRealisticTree: () => string;
export declare const innerHTMLContainer: () => string;
