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
  // lazyDom-only skips
  // ===========================================================================
  {
    match: 'Node with custom prototype',
    expectation: { status: 'skip', reason: 'Custom prototype manipulation not supported', backends: ['lazydom'] },
  },
  // Tests that reference document.doctype from a parser-created document —
  // our test document is created programmatically without a DOCTYPE.
  {
    match: 'For DocumentType nodes, nodeName should return the name.',
    expectation: { status: 'skip', reason: 'No parser-created doctype in test document', backends: ['lazydom'] },
  },
  {
    match: 'DocumentType.nodeValue',
    expectation: { status: 'skip', reason: 'No parser-created doctype in test document', backends: ['lazydom'] },
  },
  {
    match: /DocumentType created by parser/,
    expectation: { status: 'skip', reason: 'No parser-created doctype in test document', backends: ['lazydom'] },
  },
  {
    match: /^Doctype$/,
    expectation: { status: 'skip', reason: 'No parser-created doctype in test document', backends: ['lazydom'] },
  },
  {
    match: 'parentElement should be null (doctype)',
    expectation: { status: 'skip', reason: 'No parser-created doctype in test document', backends: ['lazydom'] },
  },

]

// Separate list for unnamed tests that need file-context matching
const unnamedTestExpectations: { file: string; expectation: Expectation }[] = [
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
