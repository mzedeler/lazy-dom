/**
 * WPT test expectations — known failures and skips per backend.
 *
 * Each entry maps a test name (or prefix/regex) to a status and reason.
 * The shim checks this before running each test.
 *
 * status: 'skip' — the test is skipped (it.skip)
 * status: 'fail' — the test is expected to fail (caught → skip)
 */

type Backend = 'lazydom' | 'jsdom'

interface Expectation {
  status: 'skip' | 'fail'
  reason: string
  /** If set, only apply to these backends. Otherwise applies to all. */
  backends?: Backend[]
}

function isLazyDom(): boolean {
  return !!(globalThis as Record<string, unknown>).__LAZY_DOM__
}

function currentBackend(): Backend {
  return isLazyDom() ? 'lazydom' : 'jsdom'
}

const expectations: { match: string | RegExp; expectation: Expectation }[] = [
  // ===========================================================================
  // Cross-backend skips (features not applicable in Node.js)
  // ===========================================================================
  {
    match: 'Removed iframe',
    expectation: { status: 'skip', reason: 'Iframes not supported in Node.js test runner' },
  },
  {
    match: /in XML document$/,
    expectation: { status: 'skip', reason: 'XML documents via iframes not supported' },
  },
  {
    match: /in XHTML document$/,
    expectation: { status: 'skip', reason: 'XHTML documents via iframes not supported' },
  },
  {
    match: 'Non-text nodes with empty textContent values.',
    expectation: { status: 'skip', reason: 'DOMParser not available in Node.js' },
  },

  // ===========================================================================
  // lazyDom-only: DocumentType / doctype not implemented
  // ===========================================================================
  {
    match: 'For DocumentType nodes, nodeName should return the name.',
    expectation: { status: 'skip', reason: 'DocumentType not implemented', backends: ['lazydom'] },
  },
  {
    match: /DocumentType/i,
    expectation: { status: 'skip', reason: 'DocumentType not implemented', backends: ['lazydom'] },
  },
  {
    match: /doctype/i,
    expectation: { status: 'skip', reason: 'document.doctype not available', backends: ['lazydom'] },
  },

  // ===========================================================================
  // lazyDom-only: DOMImplementation factory methods not implemented
  // ===========================================================================
  {
    match: /createHTMLDocument/,
    expectation: { status: 'skip', reason: 'DOMImplementation.createHTMLDocument not implemented', backends: ['lazydom'] },
  },
  {
    match: /createDocument/,
    expectation: { status: 'skip', reason: 'DOMImplementation.createDocument not implemented', backends: ['lazydom'] },
  },
  {
    match: /created by parser/,
    expectation: { status: 'skip', reason: 'Parser-created documents not available', backends: ['lazydom'] },
  },
  {
    match: 'Node with custom prototype',
    expectation: { status: 'skip', reason: 'HTMLUnknownElement not implemented', backends: ['lazydom'] },
  },

  // ===========================================================================
  // lazyDom-only: DocumentFragment constructor (new DocumentFragment())
  // ===========================================================================
  {
    match: 'Sets the owner document to the current global object associated document',
    expectation: { status: 'fail', reason: 'new DocumentFragment() does not set ownerDocument', backends: ['lazydom'] },
  },
  {
    match: 'Create a valid document DocumentFragment',
    expectation: { status: 'fail', reason: 'new DocumentFragment() does not set ownerDocument', backends: ['lazydom'] },
  },

  // ===========================================================================
  // lazyDom-only: CharacterData — argument coercion & validation
  // ===========================================================================
  // appendData() with no arguments should throw TypeError
  {
    match: /\.appendData\(\)$/,
    expectation: { status: 'fail', reason: 'appendData() missing argument validation', backends: ['lazydom'] },
  },
  // data = null should coerce to ""
  {
    match: /\.data = null$/,
    expectation: { status: 'fail', reason: 'data setter does not coerce null to ""', backends: ['lazydom'] },
  },
  // data = undefined should coerce to "undefined"
  {
    match: /\.data = undefined$/,
    expectation: { status: 'fail', reason: 'data setter does not coerce undefined to string', backends: ['lazydom'] },
  },
  // data = 0 should coerce to "0"
  {
    match: /\.data = 0$/,
    expectation: { status: 'fail', reason: 'data setter does not coerce number to string', backends: ['lazydom'] },
  },
  // deleteData/insertData/replaceData with negative counts (should be treated as 0 via unsigned long)
  {
    match: /with small negative count$/,
    expectation: { status: 'fail', reason: 'Negative count not handled as unsigned long', backends: ['lazydom'] },
  },
  {
    match: /with large negative count$/,
    expectation: { status: 'fail', reason: 'Negative count not handled as unsigned long', backends: ['lazydom'] },
  },
  {
    match: /negative in bounds$/,
    expectation: { status: 'fail', reason: 'Negative offset not handled as unsigned long', backends: ['lazydom'] },
  },
  {
    match: /with negative clamped count$/,
    expectation: { status: 'fail', reason: 'Negative count not clamped to unsigned long', backends: ['lazydom'] },
  },
  // substringData edge cases
  {
    match: /substringData\(\) with too few arguments$/,
    expectation: { status: 'fail', reason: 'substringData missing argument validation', backends: ['lazydom'] },
  },
  {
    match: /substringData\(\) with very large offset$/,
    expectation: { status: 'fail', reason: 'substringData large offset not throwing IndexSizeError', backends: ['lazydom'] },
  },
  {
    match: /substringData\(\) with negative offset$/,
    expectation: { status: 'fail', reason: 'substringData negative offset not handled', backends: ['lazydom'] },
  },
  {
    match: /substringData\(\) with string offset$/,
    expectation: { status: 'fail', reason: 'substringData string offset not coerced', backends: ['lazydom'] },
  },
  {
    match: /substringData\(\) with very large count$/,
    expectation: { status: 'fail', reason: 'substringData large count handling', backends: ['lazydom'] },
  },
  {
    match: /substringData\(\) with negative count$/,
    expectation: { status: 'fail', reason: 'substringData negative count not handled as unsigned long', backends: ['lazydom'] },
  },

  // ===========================================================================
  // lazyDom-only: nodeValue = null should set data to ""
  // ===========================================================================
  {
    match: 'Text.nodeValue',
    expectation: { status: 'fail', reason: 'nodeValue = null should set data to ""', backends: ['lazydom'] },
  },
  {
    match: 'Comment.nodeValue',
    expectation: { status: 'fail', reason: 'nodeValue = null should set data to ""', backends: ['lazydom'] },
  },

  // ===========================================================================
  // lazyDom-only: Node constants not on Node interface/prototype
  // ===========================================================================
  {
    match: /^Constants for nodeType on /,
    expectation: { status: 'fail', reason: 'Node constants not on static Node/prototype objects', backends: ['lazydom'] },
  },
  {
    match: /^Constants for createDocumentPosition on /,
    expectation: { status: 'fail', reason: 'compareDocumentPosition constants not set', backends: ['lazydom'] },
  },

  // ===========================================================================
  // lazyDom-only: document.normalize not implemented
  // ===========================================================================
  {
    match: /document\.normalize/,
    expectation: { status: 'fail', reason: 'document.normalize not implemented', backends: ['lazydom'] },
  },

]

// Separate list for unnamed tests that need file-context matching
const unnamedTestExpectations: { file: string; expectation: Expectation }[] = [
  {
    file: 'Node-normalize',
    expectation: { status: 'fail', reason: 'document.normalize not a function', backends: ['lazydom'] },
  },
]

/** Currently active WPT file context (set by test entrypoint) */
let currentFileContext = ''

export function setFileContext(context: string): void {
  currentFileContext = context
}

/**
 * Look up the expectation for a test by name.
 * Returns undefined if the test should run normally.
 */
export function getExpectation(testName: string | undefined): Expectation | undefined {
  if (!testName) return undefined
  const backend = currentBackend()

  // Check named expectations
  for (const entry of expectations) {
    const matches = typeof entry.match === 'string'
      ? testName === entry.match || testName.includes(entry.match)
      : entry.match.test(testName)
    if (matches) {
      const exp = entry.expectation
      if (!exp.backends || exp.backends.includes(backend)) {
        return exp
      }
    }
  }

  // Check unnamed test expectations by file context
  if (testName === '(unnamed test)' && currentFileContext) {
    for (const entry of unnamedTestExpectations) {
      if (currentFileContext.includes(entry.file)) {
        const exp = entry.expectation
        if (!exp.backends || exp.backends.includes(backend)) {
          return exp
        }
      }
    }
  }

  return undefined
}
