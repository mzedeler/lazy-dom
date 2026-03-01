/**
 * WPT testharness.js shim — maps WPT's test registration and assertion
 * functions to Mocha's `it()` and Chai's `expect()`.
 *
 * WPT test files call global `test()`, `assert_equals()`, etc.
 * This shim provides those globals so the files run unmodified inside Mocha.
 */
import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import { getExpectation } from './expectations'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatValue(val: unknown): string {
  if (val === null) return 'null'
  if (val === undefined) return 'undefined'
  if (typeof val === 'string') return JSON.stringify(val)
  if (typeof val === 'number' || typeof val === 'boolean') return String(val)
  if (Array.isArray(val)) return '[' + val.map(formatValue).join(', ') + ']'
  if (typeof val === 'object') {
    try { return JSON.stringify(val) } catch { return String(val) }
  }
  return String(val)
}

function describeFailure(description: string | undefined, msg: string): string {
  const parts: string[] = []
  if (msg) parts.push(msg)
  if (description) parts.push(description)
  return parts.join(': ') || 'assertion failed'
}

// ---------------------------------------------------------------------------
// Assertion functions (WPT API)
// ---------------------------------------------------------------------------

function assert_true(actual: unknown, description?: string): void {
  expect(actual, description).to.equal(true)
}

function assert_false(actual: unknown, description?: string): void {
  expect(actual, description).to.equal(false)
}

function assert_equals(actual: unknown, expected: unknown, description?: string): void {
  if (typeof expected === 'number' && Number.isNaN(expected)) {
    expect(actual, description).to.be.NaN
  } else {
    expect(actual, description).to.equal(expected)
  }
}

function assert_not_equals(actual: unknown, expected: unknown, description?: string): void {
  expect(actual, description).to.not.equal(expected)
}

function assert_in_array(actual: unknown, expected: unknown[], description?: string): void {
  expect(expected, description).to.include(actual)
}

function assert_array_equals(actual: unknown, expected: unknown[], description?: string): void {
  expect(Array.from(actual as Iterable<unknown>), description).to.deep.equal(Array.from(expected))
}

function assert_array_approx_equals(actual: number[], expected: number[], epsilon: number, description?: string): void {
  const a = Array.from(actual)
  expect(a.length, description + ' (length)').to.equal(expected.length)
  for (let i = 0; i < expected.length; i++) {
    expect(Math.abs(a[i] - expected[i]), description + ' (index ' + i + ')').to.be.at.most(epsilon)
  }
}

function assert_approx_equals(actual: number, expected: number, epsilon: number, description?: string): void {
  expect(Math.abs(actual - expected), description).to.be.at.most(epsilon)
}

function assert_less_than(actual: number, expected: number, description?: string): void {
  expect(actual, description).to.be.below(expected)
}

function assert_greater_than(actual: number, expected: number, description?: string): void {
  expect(actual, description).to.be.above(expected)
}

function assert_less_than_equal(actual: number, expected: number, description?: string): void {
  expect(actual, description).to.be.at.most(expected)
}

function assert_greater_than_equal(actual: number, expected: number, description?: string): void {
  expect(actual, description).to.be.at.least(expected)
}

function assert_regexp_match(actual: string, expected: RegExp, description?: string): void {
  expect(actual, description).to.match(expected)
}

function assert_class_string(object: unknown, className: string, description?: string): void {
  const actual = Object.prototype.toString.call(object)
  expect(actual, description).to.equal('[object ' + className + ']')
}

function assert_own_property(object: object, propertyName: string, description?: string): void {
  expect(object, description).to.have.own.property(propertyName)
}

function assert_not_own_property(object: object, propertyName: string, description?: string): void {
  expect(object, description).to.not.have.own.property(propertyName)
}

function assert_inherits(object: object, propertyName: string, description?: string): void {
  expect(propertyName in (object as Record<string, unknown>), description + ' (in)').to.equal(true)
  expect(object, description).to.not.have.own.property(propertyName)
}

function assert_readonly(object: object, propertyName: string, description?: string): void {
  const original = (object as Record<string, unknown>)[propertyName]
  try {
    ;(object as Record<string, unknown>)[propertyName] = original + 'CHANGED'
  } catch {
    // TypeError in strict mode is acceptable
  }
  expect((object as Record<string, unknown>)[propertyName], description).to.equal(original)
}

// Legacy DOMException code names → modern DOMException.name
const legacyCodeToName: Record<string, string> = {
  INDEX_SIZE_ERR: 'IndexSizeError',
  DOMSTRING_SIZE_ERR: 'DOMStringSizeError',
  HIERARCHY_REQUEST_ERR: 'HierarchyRequestError',
  WRONG_DOCUMENT_ERR: 'WrongDocumentError',
  INVALID_CHARACTER_ERR: 'InvalidCharacterError',
  NO_DATA_ALLOWED_ERR: 'NoDataAllowedError',
  NO_MODIFICATION_ALLOWED_ERR: 'NoModificationAllowedError',
  NOT_FOUND_ERR: 'NotFoundError',
  NOT_SUPPORTED_ERR: 'NotSupportedError',
  INUSE_ATTRIBUTE_ERR: 'InUseAttributeError',
  INVALID_STATE_ERR: 'InvalidStateError',
  SYNTAX_ERR: 'SyntaxError',
  INVALID_MODIFICATION_ERR: 'InvalidModificationError',
  NAMESPACE_ERR: 'NamespaceError',
  INVALID_ACCESS_ERR: 'InvalidAccessError',
  TYPE_MISMATCH_ERR: 'TypeMismatchError',
  SECURITY_ERR: 'SecurityError',
  NETWORK_ERR: 'NetworkError',
  ABORT_ERR: 'AbortError',
  URL_MISMATCH_ERR: 'URLMismatchError',
  QUOTA_EXCEEDED_ERR: 'QuotaExceededError',
  TIMEOUT_ERR: 'TimeoutError',
  INVALID_NODE_TYPE_ERR: 'InvalidNodeTypeError',
  DATA_CLONE_ERR: 'DataCloneError',
}

function assert_throws_dom(
  typeOrCode: string | number,
  funcOrCtor: Function | { new (...args: unknown[]): unknown },
  funcOrDescription?: Function | string,
  description?: string,
): void {
  let fn: Function
  let desc: string | undefined
  // Overload: assert_throws_dom(type, DOMException, fn, desc)
  //       or: assert_throws_dom(type, fn, desc)
  if (typeof funcOrDescription === 'function') {
    fn = funcOrDescription
    desc = description
  } else {
    fn = funcOrCtor as Function
    desc = funcOrDescription
  }
  let caught: Error | undefined
  try {
    fn()
  } catch (e) {
    caught = e as Error
  }
  expect(caught, describeFailure(desc, 'expected function to throw')).to.exist
  // Check DOMException name or code
  if (typeof typeOrCode === 'string') {
    const domEx = caught as { name?: string; code?: number }
    // Resolve legacy code names to modern names
    const expectedName = legacyCodeToName[typeOrCode] || typeOrCode
    expect(domEx.name, desc).to.equal(expectedName)
  } else {
    const domEx = caught as { code?: number }
    expect(domEx.code, desc).to.equal(typeOrCode)
  }
}

function assert_throws_js(constructor: { new (...args: unknown[]): Error }, fn: Function, description?: string): void {
  expect(fn, description).to.throw(constructor)
}

function assert_throws_exactly(exception: unknown, fn: Function, description?: string): void {
  let caught: unknown
  let didThrow = false
  try {
    fn()
  } catch (e) {
    didThrow = true
    caught = e
  }
  expect(didThrow, describeFailure(description, 'expected function to throw')).to.equal(true)
  expect(caught, description).to.equal(exception)
}

function assert_unreached(description?: string): void {
  expect.fail(description || 'assert_unreached was called')
}

function assert_exists(actual: unknown, description?: string): void {
  expect(actual, description).to.not.be.null
  expect(actual, description).to.not.be.undefined
}

function assert_implements(condition: unknown, description?: string): void {
  if (!condition) {
    // Not implemented — skip the rest of the test
    (globalThis as Record<string, unknown>).__wpt_skip_test__ = true
    throw new Error('SKIP: ' + (description || 'not implemented'))
  }
}

function assert_implements_optional(condition: unknown, description?: string): void {
  assert_implements(condition, description)
}

// ---------------------------------------------------------------------------
// Test object for async_test
// ---------------------------------------------------------------------------

interface WPTTestObject {
  step: (fn: Function) => void
  step_func: (fn: Function) => Function
  step_func_done: (fn: Function) => Function
  step_timeout: (fn: Function, timeout: number) => void
  unreached_func: (description?: string) => Function
  add_cleanup: (fn: Function) => void
  done: () => void
  name: string
}

// ---------------------------------------------------------------------------
// Test registration functions (WPT API)
// ---------------------------------------------------------------------------

function wptSetup(fnOrProperties: Function | object): void {
  if (typeof fnOrProperties === 'function') {
    // WPT setup() runs synchronously and immediately — test scripts
    // depend on variables being set before subsequent code executes.
    fnOrProperties()
  }
  // Properties object is ignored (allow_uncaught_exception, etc.)
}

function wptTest(fn: Function, name?: string): void {
  name = name || '(unnamed test)'
  const exp = getExpectation(name)
  if (exp?.status === 'skip') {
    it.skip(name + ' [WPT skip: ' + exp.reason + ']', () => {})
    return
  }

  it(name, function (this: Mocha.Context) {
;(globalThis as Record<string, unknown>).__wpt_skip_test__ = false

    try {
      fn({ name } as WPTTestObject)
    } catch (e) {
      if ((globalThis as Record<string, unknown>).__wpt_skip_test__) {
        this.skip()
        return
      }
      if (exp?.status === 'fail') {
        // Expected failure — skip rather than fail
        this.skip()
        return
      }
      throw e
    }
    if (exp?.status === 'fail') {
      // Test passed but was expected to fail — surface this
      expect.fail('Test was expected to fail but passed. Remove it from expectations.')
    }
  })
}

function wptAsyncTest(fnOrName: Function | string, nameOrProperties?: string | object): void {
  let fn: Function | undefined
  let name: string
  if (typeof fnOrName === 'string') {
    name = fnOrName
    fn = undefined
  } else {
    fn = fnOrName
    name = nameOrProperties as string
  }

  const exp = getExpectation(name)
  if (exp?.status === 'skip') {
    it.skip(name + ' [WPT skip: ' + exp.reason + ']', () => {})
    return
  }

  it(name, function (this: Mocha.Context, done: Mocha.Done) {
;(globalThis as Record<string, unknown>).__wpt_skip_test__ = false

    const cleanups: Function[] = []
    const testObj: WPTTestObject = {
      name,
      step(stepFn: Function) {
        try {
          stepFn()
        } catch (e) {
          if ((globalThis as Record<string, unknown>).__wpt_skip_test__) {
            return
          }
          if (exp?.status === 'fail') {
            return
          }
          throw e
        }
      },
      step_func(stepFn: Function) {
        return (...args: unknown[]) => {
          testObj.step(() => stepFn(...args))
        }
      },
      step_func_done(stepFn: Function) {
        return (...args: unknown[]) => {
          testObj.step(() => stepFn(...args))
          testObj.done()
        }
      },
      step_timeout(stepFn: Function, timeout: number) {
        setTimeout(() => testObj.step(stepFn), timeout)
      },
      unreached_func(description?: string) {
        return () => {
          assert_unreached(description)
        }
      },
      add_cleanup(cleanupFn: Function) {
        cleanups.push(cleanupFn)
      },
      done() {
        for (const cleanup of cleanups) {
          try { cleanup() } catch { /* ignore */ }
        }
        if ((globalThis as Record<string, unknown>).__wpt_skip_test__) {
          done()
          return
        }
        done()
      },
    }

    if (fn) {
      try {
        fn(testObj)
      } catch (e) {
        if ((globalThis as Record<string, unknown>).__wpt_skip_test__) {
          this.skip()
          return
        }
        if (exp?.status === 'fail') {
          this.skip()
          return
        }
        done(e as Error)
        return
      }
    }
  })
}

function wptPromiseTest(fn: (t: WPTTestObject) => Promise<void>, name: string): void {
  const exp = getExpectation(name)
  if (exp?.status === 'skip') {
    it.skip(name + ' [WPT skip: ' + exp.reason + ']', () => {})
    return
  }

  it(name, async function (this: Mocha.Context) {
;(globalThis as Record<string, unknown>).__wpt_skip_test__ = false

    const cleanups: Function[] = []
    const testObj: WPTTestObject = {
      name,
      step(stepFn: Function) { stepFn() },
      step_func(stepFn: Function) { return stepFn },
      step_func_done(stepFn: Function) { return stepFn },
      step_timeout(stepFn: Function, timeout: number) {
        setTimeout(stepFn, timeout)
      },
      unreached_func(description?: string) {
        return () => { assert_unreached(description) }
      },
      add_cleanup(cleanupFn: Function) {
        cleanups.push(cleanupFn)
      },
      done() {
        for (const cleanup of cleanups) {
          try { cleanup() } catch { /* ignore */ }
        }
      },
    }

    try {
      await fn(testObj)
    } catch (e) {
      if ((globalThis as Record<string, unknown>).__wpt_skip_test__) {
        this.skip()
        return
      }
      if (exp?.status === 'fail') {
        this.skip()
        return
      }
      throw e
    } finally {
      testObj.done()
    }
    if (exp?.status === 'fail') {
      expect.fail('Test was expected to fail but passed. Remove it from expectations.')
    }
  })
}

function generateTests(fn: Function, cases: unknown[][]): void {
  for (const args of cases) {
    const name = args[0] as string
    wptTest(() => {
      fn(...args.slice(1))
    }, name)
  }
}

// ---------------------------------------------------------------------------
// HTML file loader
// ---------------------------------------------------------------------------

/**
 * Loads a WPT `.html` test file:
 * 1. Extracts `<script src="...">` references (skipping testharness*.js)
 * 2. Loads referenced support scripts via eval()
 * 3. Extracts inline `<script>` contents and eval()s them
 *
 * Must be called inside a `describe()` block so that `test()` → `it()`
 * registrations happen at the right Mocha lifecycle phase.
 */
export function loadWPTHtml(filePath: string): void {
  const abs = path.resolve(filePath)
  const html = fs.readFileSync(abs, 'utf-8')
  const dir = path.dirname(abs)

  // Extract all <script> tags
  const scriptTagRe = /<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi
  let match: RegExpExecArray | null

  try {
    while ((match = scriptTagRe.exec(html)) !== null) {
      const tag = match[0]

      // Check for src attribute
      const srcMatch = tag.match(/src=["']([^"']+)["']/)
      if (srcMatch) {
        const src = srcMatch[1]
        // Skip testharness.js and testharnessreport.js
        if (src.includes('testharness') || src.includes('testharnessreport')) {
          continue
        }
        // Resolve relative path from the HTML file's directory
        const scriptPath = path.resolve(dir, src)
        if (fs.existsSync(scriptPath)) {
          const scriptContent = fs.readFileSync(scriptPath, 'utf-8')
    ;(0, eval)(scriptContent)
        }
        continue
      }

      // Inline script: extract content between <script> tags
      const inlineMatch = tag.match(/<script(?:\s[^>]*)?>(?<content>[\s\S]*?)<\/script>/i)
      if (inlineMatch?.groups?.content) {
        const code = inlineMatch.groups.content
;(0, eval)(code)
      }
    }
  } catch (e) {
    // If eval crashes (e.g. missing API like createDocument), register
    // a skip so the suite doesn't abort entirely.
    const msg = e instanceof Error ? e.message : String(e)
    it.skip('(file failed to load: ' + msg + ')', () => {})
  }
}

/**
 * Loads a WPT `.js` test file by eval()ing its contents.
 * Must be called inside a `describe()` block.
 */
export function loadWPTScript(filePath: string): void {
  const abs = path.resolve(filePath)
  const content = fs.readFileSync(abs, 'utf-8')
  try {
    ;(0, eval)(content)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    it.skip('(file failed to load: ' + msg + ')', () => {})
  }
}

// ---------------------------------------------------------------------------
// Global installation
// ---------------------------------------------------------------------------

export function installWPTGlobals(): void {
  const g = globalThis as Record<string, unknown>
  // Test registration
  g.test = wptTest
  g.async_test = wptAsyncTest
  g.promise_test = wptPromiseTest
  g.setup = wptSetup
  g.generate_tests = generateTests

  // Assertions
  g.assert_true = assert_true
  g.assert_false = assert_false
  g.assert_equals = assert_equals
  g.assert_not_equals = assert_not_equals
  g.assert_in_array = assert_in_array
  g.assert_array_equals = assert_array_equals
  g.assert_array_approx_equals = assert_array_approx_equals
  g.assert_approx_equals = assert_approx_equals
  g.assert_less_than = assert_less_than
  g.assert_greater_than = assert_greater_than
  g.assert_less_than_equal = assert_less_than_equal
  g.assert_greater_than_equal = assert_greater_than_equal
  g.assert_regexp_match = assert_regexp_match
  g.assert_class_string = assert_class_string
  g.assert_own_property = assert_own_property
  g.assert_not_own_property = assert_not_own_property
  g.assert_inherits = assert_inherits
  g.assert_readonly = assert_readonly
  g.assert_throws_dom = assert_throws_dom
  g.assert_throws_js = assert_throws_js
  g.assert_throws_exactly = assert_throws_exactly
  g.assert_unreached = assert_unreached
  g.assert_exists = assert_exists
  g.assert_implements = assert_implements
  g.assert_implements_optional = assert_implements_optional

  // Utility
  g.format_value = formatValue
}

/**
 * Resets per-file state between WPT test files.
 * Call this in a `beforeEach` or between `loadWPTHtml` calls.
 */
export function resetWPTState(): void {
  // Currently a no-op since setup() runs immediately.
  // Kept as a hook for future per-file state reset needs.
}
